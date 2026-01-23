const express = require('express');
const router = express.Router();
const TranscriptService = require('./transcript.service');
const SummarizationService = require('./summarization.service');
const QuestionService = require('./question.service');
const ClarificationService = require('./clarification.service');

// POST /api/ai/process
router.post('/process', async (req, res) => {
    try {
        const { youtubeUrl, transcriptText, language, summaryLevel } = req.body;

        let transcript = transcriptText;

        if (!transcript && youtubeUrl) {
            console.log('Fetching transcript for:', youtubeUrl);
            try {
                transcript = await TranscriptService.getTranscript(youtubeUrl);
            } catch (err) {
                console.error("Transcript fetch failed:", err.message);
                return res.status(422).json({ error: `Transcript failed: ${err.message}. Please use Manual Mode.` });
            }
        }

        if (!transcript) {
            return res.status(422).json({ error: 'Could not retrieve transcript. Please use Manual Mode.' });
        }

        // 2. Parallel AI Processing
        console.log('Starting AI processing...');
        const [summary, questions, clarifications] = await Promise.all([
            SummarizationService.generateSummary(transcript, summaryLevel, language), // Pass language
            QuestionService.generateQuestions(transcript, 5, language),
            ClarificationService.generateClarifications(transcript, language)
        ]);

        res.json({
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
