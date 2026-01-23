const { Innertube, UniversalCache } = require('youtubei.js');
const { YoutubeTranscript } = require('youtube-transcript');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core'); // Keep for backup
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

class TranscriptService {
    static extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
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
                // Parse InnerTube's specific format
                const text = transcriptData.transcript.content.body.initial_segments
                    .map(seg => seg.snippet.text)
                    .join(' ');
                console.log('[Transcript] Strategy 1 Success!');
                return text;
            }
        } catch (err) {
            console.log(`[Transcript] Strategy 1 Failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 2: Standard youtube-transcript (Web Scraping) ---
        try {
            console.log('[Transcript] Strategy 2: Standard Scraping...');
            const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
            console.log('[Transcript] Strategy 2 Success!');
            return transcriptItems.map(item => item.text).join(' ');
        } catch (err) {
            console.log(`[Transcript] Strategy 2 Failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 3: Whisper (Audio Download) ---
        try {
            console.log('[Transcript] Strategy 3: Whisper AI Fallback...');
            return await this.transcribeWithWhisper(url, videoId);
        } catch (err) {
            console.error(`[Transcript] Strategy 3 Failed: ${err.message}`);
            lastError = err;
        }

        throw new Error(`All transcript strategies failed. Last error: ${lastError?.message}`);
    }

    static async transcribeWithWhisper(url, videoId) {
        const tempPath = path.resolve(__dirname, `temp_${videoId}.mp3`);

        try {
            await new Promise((resolve, reject) => {
                const stream = ytdl(url, {
                    quality: 'lowestaudio',
                    filter: 'audioonly',
                    ipv6Block: true, // Sometimes helps with 429s
                    requestOptions: {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                            'Referer': 'https://www.youtube.com/'
                        }
                    }
                });

                const writer = fs.createWriteStream(tempPath);
                stream.pipe(writer);

                writer.on('finish', resolve);
                stream.on('error', reject);
                writer.on('error', reject);
            });

            console.log('[Transcript] Audio downloaded, sending to Groq...');

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempPath),
                model: "whisper-large-v3",
                response_format: "text"
            });

            return transcription;

        } catch (error) {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            throw error;
        } finally {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
}

module.exports = TranscriptService;
