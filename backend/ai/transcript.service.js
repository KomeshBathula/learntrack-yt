const { execFile } = require('child_process');
const util = require('util');
const execFilePromise = util.promisify(execFile);
const { Innertube, UniversalCache } = require('youtubei.js');
const { YoutubeTranscript } = require('youtube-transcript');
const Groq = require('groq-sdk');
const crypto = require('crypto');
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

        const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

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

        // --- STRATEGY 3: yt-dlp Subtitles (Direct Fetch) ---
        try {
            console.log('[Transcript] Strategy 3: yt-dlp Subtitles...');
            return await this.fetchSubtitlesWithYtDlp(normalizedUrl, videoId);
        } catch (err) {
            console.log(`[Transcript] Strategy 3 Failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 4: Whisper (Audio Download via yt-dlp) ---
        try {
            console.log('[Transcript] Strategy 4: Whisper AI Fallback (via yt-dlp)...');
            return await this.transcribeWithWhisper(normalizedUrl, videoId);
        } catch (err) {
            console.error(`[Transcript] Strategy 4 Failed: ${err.message}`);
            lastError = err;
        }

        throw new Error(`All transcript strategies failed. Last error: ${lastError?.message}`);
    }

    static async fetchSubtitlesWithYtDlp(url, videoId) {
        const uniqueId = crypto.randomBytes(4).toString('hex');
        const tempBase = path.resolve(__dirname, `temp_subs_${videoId}_${uniqueId}`);

        try {
            console.log('[Transcript] Attempting yt-dlp subtitle fetch...');

            // Fix: Use execFile with args array to prevent shell injection, and increase maxBuffer to 20MB
            await execFilePromise('yt-dlp', [
                '--write-sub',
                '--write-auto-sub',
                '--sub-lang', 'en,en-US,en-GB,en-orig',
                '--skip-download',
                '--convert-subs', 'srt',
                '--output', tempBase,
                url
            ], { maxBuffer: 20 * 1024 * 1024 });

            // yt-dlp creates files like tempBase.en.srt
            const dir = path.dirname(tempBase);
            const files = fs.readdirSync(dir);
            const subFileName = path.basename(tempBase);
            const subFile = files.find(f => f.startsWith(subFileName) && f.endsWith('.srt'));

            if (!subFile) {
                throw new Error('No subtitle file downloaded');
            }

            const content = fs.readFileSync(path.join(dir, subFile), 'utf-8');

            // Cleanup immediately
            files.filter(f => f.startsWith(subFileName)).forEach(f => {
                try { fs.unlinkSync(path.join(dir, f)); } catch (e) { }
            });

            return this.parseSrt(content);

        } catch (error) {
            // Cleanup on error
            const dir = path.dirname(tempBase);
            const subFileName = path.basename(tempBase);
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                files.filter(f => f.startsWith(subFileName)).forEach(f => {
                    try { fs.unlinkSync(path.join(dir, f)); } catch (e) { }
                });
            }
            throw error;
        }
    }

    static parseSrt(srtContent) {
        const lines = srtContent.split(/\r?\n/);
        const textLines = [];

        for (const line of lines) {
            if (/^\d+$/.test(line.trim())) continue;
            if (line.includes('-->')) continue;
            if (!line.trim()) continue;

            const cleanLine = line.trim();
            if (textLines.length === 0 || textLines[textLines.length - 1] !== cleanLine) {
                textLines.push(cleanLine);
            }
        }
        return textLines.join(' ');
    }

    static async transcribeWithWhisper(url, videoId) {
        const uniqueId = crypto.randomBytes(4).toString('hex');
        // Fix: yt-dlp handles the extension when we specify audio-format, but it's safer to use an output template
        const tempPathTemplate = path.resolve(__dirname, `temp_${videoId}_${uniqueId}.%(ext)s`);

        try {
            console.log('[Transcript] Downloading audio with yt-dlp...');

            // Fix: Use execFile to prevent shell injection, increase maxBuffer
            await execFilePromise('yt-dlp', [
                '-x',
                '--audio-format', 'mp3',
                '-o', tempPathTemplate,
                url
            ], { maxBuffer: 20 * 1024 * 1024 });

            // Since we used a template, find the actual generated file
            const dir = path.dirname(tempPathTemplate);
            const files = fs.readdirSync(dir);
            const prefix = `temp_${videoId}_${uniqueId}`;
            const actualFile = files.find(f => f.startsWith(prefix) && f.endsWith('.mp3'));

            if (!actualFile) {
                throw new Error('Audio file not created by yt-dlp');
            }

            const tempPath = path.join(dir, actualFile);
            const stats = fs.statSync(tempPath);

            // Fix: Reintroduced size check
            const maxSize = 24 * 1024 * 1024; // 24MB
            if (stats.size > maxSize) {
                throw new Error(`Audio file too large (${(stats.size / 1024 / 1024).toFixed(1)}MB). Max 25MB supported.`);
            }

            console.log(`[Transcript] Audio downloaded (${(stats.size / 1024 / 1024).toFixed(1)}MB), sending to Groq Whisper...`);

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempPath),
                model: "whisper-large-v3",
                response_format: "text"
            });

            // Fix: Reintroduced transcription validation
            if (!transcription || transcription.length < 50) {
                throw new Error('Whisper returned empty/short transcription');
            }

            console.log('[Transcript] Strategy 4 (Whisper via yt-dlp) Success!');
            return transcription;

        } catch (error) {
            throw error;
        } finally {
            // Fix: Catch and swallow cleanup errors without masking main error
            const dir = path.dirname(tempPathTemplate);
            const prefix = `temp_${videoId}_${uniqueId}`;
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                files.filter(f => f.startsWith(prefix)).forEach(f => {
                    try {
                        fs.unlinkSync(path.join(dir, f));
                    } catch (cleanupError) {
                        console.warn(`[Transcript] Failed to handle cleanup for ${f}`, cleanupError.message);
                    }
                });
            }
        }
    }
}

module.exports = TranscriptService;
