const express = require('express');
const router = express.Router();
const axios = require('axios');
const TranscriptService = require('./transcript.service');
const SummarizationService = require('./summarization.service');
const QuestionService = require('./question.service');
const ClarificationService = require('./clarification.service');

// Helper to fetch video title using YouTube oEmbed API
const getVideoTitle = async (youtubeUrl) => {
    try {
        console.log('[VideoTitle] Fetching title from oEmbed...');
        const response = await axios.get(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`,
            {
                timeout: 5000,              // fail fast if oEmbed is slow/hung
                maxContentLength: 100 * 1024 // guard against unexpectedly large responses
            }
        );
        const title = response.data?.title;
        console.log('[VideoTitle] Fetched:', title);
        return title || null;
    } catch (err) {
        console.error('[VideoTitle] oEmbed failed:', err.message);
        return null;
    }
};

// POST /api/ai/process
router.post('/process', async (req, res) => {
    try {
        const { youtubeUrl, transcriptText, language, summaryLevel } = req.body;

        let transcript = transcriptText;
        let videoTitle = null;

        // If YouTube URL is provided, fetch both title and transcript
        if (youtubeUrl) {
            console.log('Processing YouTube URL:', youtubeUrl);

            // Fetch video title using oEmbed (faster and more reliable)
            videoTitle = await getVideoTitle(youtubeUrl);

            // Fetch transcript if not provided
            if (!transcript) {
                console.log('Fetching transcript...');
                try {
                    transcript = await TranscriptService.getTranscript(youtubeUrl);
                } catch (err) {
                    console.error("Transcript fetch failed:", err.message);
                    return res.status(422).json({ error: `Transcript failed: ${err.message}. Please use Manual Mode.` });
                }
            }
        }

        if (!transcript) {
            return res.status(422).json({ error: 'Could not retrieve transcript. Please use Manual Mode.' });
        }

        // Sequential AI Processing (to avoid Rate Limits)
        console.log('Starting AI processing (Sequential)...');

        // Priority 1: Summary (Critical)
        console.log('Generating Summary...');
        const summary = await SummarizationService.generateSummary(transcript, summaryLevel, language);

        // Priority 2: Questions (Optional - Fail Gracefully)
        let questions = [];
        try {
            console.log('Waiting 2s before generating Questions...');
            await new Promise(r => setTimeout(r, 2000));
            questions = await QuestionService.generateQuestions(transcript, 5, language);
        } catch (err) {
            console.error('Question generation skipped:', err.message);
        }

        // Priority 3: Clarifications (Optional - Fail Gracefully)
        let clarifications = [];
        try {
            console.log('Waiting 2s before generating Clarifications...');
            await new Promise(r => setTimeout(r, 2000));
            clarifications = await ClarificationService.generateClarifications(transcript, language);
        } catch (err) {
            console.error('Clarification generation skipped:', err.message);
        }

        console.log('[API Response] Sending videoTitle:', videoTitle);

        res.json({
            videoTitle,
            summary,
            questions,
            clarifications
        });

    } catch (error) {
        console.error('AI Processing Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

module.exports = router;
