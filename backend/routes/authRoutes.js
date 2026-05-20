const express = require('express');
const { googleAuth, getMe, updateProfile, saveQuizResult, updateWeeklyGoal } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Google OAuth route
router.post('/google', googleAuth);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/quiz-result', protect, saveQuizResult);
router.put('/weekly-goal', protect, updateWeeklyGoal);

module.exports = router;
