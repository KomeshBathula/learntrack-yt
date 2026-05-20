const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Create OAuth2Client once at module scope for reuse
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Google OAuth login/register
exports.googleAuth = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('GOOGLE_CLIENT_ID environment variable is not configured');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        // Verify the Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture, email_verified } = payload;

        // Ensure the email is present and verified before proceeding
        if (!email || email_verified !== true) {
            return res.status(401).json({ message: 'Google email is not verified or missing' });
        }

        // Check if user exists with this Google ID or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update Google ID if user exists with email but not googleId
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                if (picture) user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                username: name,
                email,
                googleId,
                profilePicture: picture,
                authProvider: 'google'
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Google auth error:', error);

        // Differentiate between invalid credentials and server errors
        if (error.message?.includes('Token used too late') ||
            error.message?.includes('Invalid token') ||
            error.message?.includes('Wrong recipient')) {
            return res.status(401).json({ message: 'Invalid or expired Google token' });
        }

        res.status(500).json({ message: 'Authentication server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.saveQuizResult = async (req, res) => {
    const { score, total, topic } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const percentage = Math.round((score / total) * 100);
            user.quizResults.push({ score, total, percentage, topic: topic || 'AI Generated Quiz' });
            
            // Give EXP for completing a quiz -> 50 EXP
            user.exp = (user.exp || 0) + 50;
            const nextLevelExp = (user.level || 1) * 500;
            if (user.exp >= nextLevelExp) {
                user.level = (user.level || 1) + 1;
                if (!user.badges.includes('Quiz Master') && user.quizResults.length >= 5) {
                    user.badges.push('Quiz Master');
                }
            }

            await user.save();
            res.status(200).json({ message: 'Quiz result saved', quizResults: user.quizResults, exp: user.exp, level: user.level });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWeeklyGoal = async (req, res) => {
    const { minutes } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.weeklyGoalMinutes = minutes;
            await user.save();
            res.json({ weeklyGoalMinutes: user.weeklyGoalMinutes });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
