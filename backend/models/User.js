const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for Google OAuth users
    googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
    profilePicture: { type: String }, // Google profile picture URL
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    createdAt: { type: Date, default: Date.now },
    lastActiveVideo: {
        playlistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
        videoId: String,
        thumbnail: String,
        title: String,
        timestamp: { type: Date, default: Date.now }
    },
    quizResults: [{
        score: Number,
        total: Number,
        percentage: Number,
        topic: String,
        date: { type: Date, default: Date.now }
    }],
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    weeklyGoalMinutes: { type: Number, default: 120 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStreakUpdate: { type: Date }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
