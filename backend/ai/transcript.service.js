const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { Innertube, UniversalCache } = require('youtubei.js');
const { YoutubeTranscript } = require('youtube-transcript');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
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

                if (!text || text.length < 50) {
                    throw new Error('InnerTube returned empty/short transcript');
                }

                console.log('[Transcript] Strategy 1 Success!');
                return text;
            }
        } catch (err) {
            console.log(`[Transcript] Strategy 1 (InnerTube) skipped. Moving to next strategy.`);
            // lastError = err; // Don't store this, it's just a try
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
            return await this.fetchSubtitlesWithYtDlp(url, videoId);
        } catch (err) {
            console.log(`[Transcript] Strategy 3 Failed: ${err.message}`);
            lastError = err;
        }

        // --- STRATEGY 4: Whisper (Audio Download via yt-dlp) ---
        try {
            console.log('[Transcript] Strategy 4: Whisper AI Fallback (via yt-dlp)...');
            return await this.transcribeWithWhisper(url, videoId);
        } catch (err) {
            console.error(`[Transcript] Strategy 4 Failed: ${err.message}`);
            lastError = err;
        }

        throw new Error(`All transcript strategies failed. Last error: ${lastError?.message}`);
    }

    static async fetchSubtitlesWithYtDlp(url, videoId) {
        // Output template for subs
        const tempBase = path.resolve(__dirname, `temp_subs_${videoId}`);

        // Command to fetch subs. Try manual subs first, then auto.
        // We use --skip-download to only get subs.
        // We convert to srt for easier parsing.

        try {
            console.log('[Transcript] Attempting yt-dlp subtitle fetch...');
            // Try fetching English subs (auto or manual)
            // --write-sub: write manual subs
            // --write-auto-sub: write auto subs
            // --sub-lang en,en-US,en-GB: languages
            // --output: path template

            const cmd = `yt-dlp --write-sub --write-auto-sub --sub-lang "en,en-US,en-GB,en-orig" --skip-download --convert-subs srt --output "${tempBase}" "${url}"`;

            await execPromise(cmd);

            // yt-dlp creates files like temp_subs_ID.en.srt
            // We need to find the created file.
            const dir = path.dirname(tempBase);
            const files = fs.readdirSync(dir);
            const subFile = files.find(f => f.startsWith(`temp_subs_${videoId}`) && f.endsWith('.srt'));

            if (!subFile) {
                throw new Error('No subtitle file downloaded');
            }

            const content = fs.readFileSync(path.join(dir, subFile), 'utf-8');

            // Cleanup immediately
            files.filter(f => f.startsWith(`temp_subs_${videoId}`)).forEach(f => {
                try { fs.unlinkSync(path.join(dir, f)); } catch (e) { }
            });

            // Parse SRT to text
            return this.parseSrt(content);

        } catch (error) {
            // Cleanup on error
            const dir = path.dirname(tempBase);
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                files.filter(f => f.startsWith(`temp_subs_${videoId}`)).forEach(f => {
                    try { fs.unlinkSync(path.join(dir, f)); } catch (e) { }
                });
            }
            throw error;
        }
    }

    static parseSrt(srtContent) {
        // Simple SRT parser
        // Remove timestamps and indices
        const lines = srtContent.split(/\r?\n/);
        const textLines = [];

        for (const line of lines) {
            // Skip indices (numeric only lines)
            if (/^\d+$/.test(line.trim())) continue;
            // Skip timestamps
            if (line.includes('-->')) continue;
            // Skip empty lines
            if (!line.trim()) continue;

            // Add unique lines (dedupe consecutive)
            const cleanLine = line.trim();
            if (textLines.length === 0 || textLines[textLines.length - 1] !== cleanLine) {
                textLines.push(cleanLine);
            }
        }

        return textLines.join(' ');
    }

    static async transcribeWithWhisper(url, videoId) {
        const tempPath = path.resolve(__dirname, `temp_${videoId}.mp3`);

        try {
            console.log('[Transcript] Downloading audio with yt-dlp...');
            // Use yt-dlp to download audio
            // -x: extract audio
            // --audio-format mp3
            const cmd = `yt-dlp -x --audio-format mp3 -o "${tempPath}" "${url}"`;
            await execPromise(cmd);

            if (!fs.existsSync(tempPath)) {
                throw new Error('Audio file not created by yt-dlp');
            }

            console.log('[Transcript] Audio downloaded, sending to Groq...');

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempPath),
                model: "whisper-large-v3",
                response_format: "text"
            });

            return transcription;

        } catch (error) {
            throw error;
        } finally {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }
}

module.exports = TranscriptService;
