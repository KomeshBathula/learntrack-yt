const express = require('express');
const { googleAuth, getMe, updateProfile, saveQuizResult } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

console.log('LOADING AUTH ROUTES...');

// Google OAuth route
router.post('/google', googleAuth);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/quiz-result', protect, saveQuizResult);

module.exports = router;
