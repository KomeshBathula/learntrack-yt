const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Google OAuth login/register
exports.googleAuth = async (req, res) => {
    const { credential } = req.body;

    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

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
        res.status(401).json({ message: 'Google authentication failed' });
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
            await user.save();
            res.status(200).json({ message: 'Quiz result saved', quizResults: user.quizResults });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
