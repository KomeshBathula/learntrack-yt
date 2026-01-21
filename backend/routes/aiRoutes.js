const express = require('express');
const router = express.Router();
const { chatWithGrok } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware'); // Optional: protect if needed, or leave public if desired. Prefer protecting.

// POST /api/ai/chat
router.post('/chat', protect, chatWithGrok);

module.exports = router;
