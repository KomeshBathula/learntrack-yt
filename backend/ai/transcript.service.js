const { Innertube, UniversalCache } = require('youtubei.js');
const { YoutubeTranscript } = require('youtube-transcript');
const Groq = require('groq-sdk');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

class TranscriptService {
    static extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    static async getTranscript(url) {
        let lastError = null;
        console.log(`[Transcript] Processing URL: ${url}`);
        const videoId = this.extractVideoId(url);
        if (!videoId) throw new Error('Invalid YouTube URL');

        // --- STRATEGY 1: InnerTube (simulates real client) ---
        try {
            console.log('[Transcript] Strategy 1: InnerTube (Android Client)...');
            const youtube = await Innertube.create({
                cache: new UniversalCache(false),
                generate_session_locally: true
            });

            const info = await youtube.getInfo(videoId);
            const transcriptData = await info.getTranscript();

            if (transcriptData?.transcript?.content?.body?.initial_segments) {
                const text = transcriptData.transcript.content.body.initial_segments
                    .map(seg => seg.snippet.text)
                    .join(' ');

                if (!text || text.length < 50) {
                    throw new Error('InnerTube returned empty/short transcript');
                }

                console.log('[Transcript] Strategy 1 Success!');
                return text;
            }
        } catch (err) {
            console.log(`[Transcript] Strategy 1 (InnerTube) failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 2: Standard youtube-transcript (Web Scraping) ---
        try {
            console.log('[Transcript] Strategy 2: Standard Scraping...');
            const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
            const text = transcriptItems.map(item => item.text).join(' ');

            if (!text || text.length < 50) {
                throw new Error('Standard scrap returned empty/short transcript');
            }

            console.log('[Transcript] Strategy 2 Success!');
            return text;
        } catch (err) {
            console.log(`[Transcript] Strategy 2 Failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 3: Whisper AI via ytdl-core (Pure Node.js — no yt-dlp needed) ---
        try {
            console.log('[Transcript] Strategy 3: Whisper AI via ytdl-core (no yt-dlp)...');
            return await this.transcribeWithYtdlCore(url, videoId);
        } catch (err) {
            console.error(`[Transcript] Strategy 3 Failed: ${err.message}`);
            lastError = err;
        }

        throw new Error(`All transcript strategies failed. Last error: ${lastError?.message}`);
    }

    /**
     * Strategy 3: Download audio using @distube/ytdl-core (pure Node.js),
     * then transcribe with Groq Whisper. No yt-dlp binary required.
     */
    static async transcribeWithYtdlCore(url, videoId) {
        const tempPath = path.resolve(__dirname, `temp_${videoId}.mp3`);

        try {
            console.log('[Transcript] Downloading audio with ytdl-core...');

            // Normalize URL to standard watch format for ytdl-core
            const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

            // Download audio-only stream
            await new Promise((resolve, reject) => {
                const stream = ytdl(normalizedUrl, {
                    filter: 'audioonly',
                    quality: 'lowestaudio', // Smallest file = fastest download
                });

                const writeStream = fs.createWriteStream(tempPath);

                stream.on('error', (err) => {
                    writeStream.destroy();
                    reject(new Error(`ytdl-core download failed: ${err.message}`));
                });

                writeStream.on('error', (err) => {
                    reject(new Error(`File write failed: ${err.message}`));
                });

                writeStream.on('finish', () => {
                    resolve();
                });

                stream.pipe(writeStream);
            });

            // Verify file was created and has content
            if (!fs.existsSync(tempPath)) {
                throw new Error('Audio file was not created');
            }

            const stats = fs.statSync(tempPath);
            if (stats.size < 1000) {
                throw new Error('Audio file too small — likely empty');
            }

            // Check file size — Groq Whisper has a 25MB limit
            const maxSize = 24 * 1024 * 1024; // 24MB (safe margin)
            if (stats.size > maxSize) {
                throw new Error(`Audio file too large (${(stats.size / 1024 / 1024).toFixed(1)}MB). Max 25MB supported.`);
            }

            console.log(`[Transcript] Audio downloaded (${(stats.size / 1024 / 1024).toFixed(1)}MB), sending to Groq Whisper...`);

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempPath),
                model: "whisper-large-v3",
                response_format: "text"
            });

            if (!transcription || transcription.length < 50) {
                throw new Error('Whisper returned empty/short transcription');
            }

            console.log('[Transcript] Strategy 3 (Whisper via ytdl-core) Success!');
            return transcription;

        } catch (error) {
            throw error;
        } finally {
            // Always clean up temp file
            if (fs.existsSync(tempPath)) {
                try { fs.unlinkSync(tempPath); } catch (e) { }
            }
        }
    }
}

module.exports = TranscriptService;
