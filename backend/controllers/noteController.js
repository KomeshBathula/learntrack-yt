const Note = require('../models/Note');
const User = require('../models/User');

// Get Note for a specific video
exports.getNote = async (req, res) => {
    const { playlistId, videoId } = req.params;
    try {
        const note = await Note.findOne({
            user: req.user._id,
            playlist: playlistId,
            videoId: videoId
        });
        res.json(note || { content: '' }); // Return empty if no note exists
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save/Update Note
exports.saveNote = async (req, res) => {
    const { playlistId, videoId, content } = req.body;
    try {
        const existingNote = await Note.findOne({
            user: req.user._id,
            playlist: playlistId,
            videoId: videoId
        });

        const note = await Note.findOneAndUpdate(
            {
                user: req.user._id,
                playlist: playlistId,
                videoId: videoId
            },
            { content, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        // Gamification: Give 15 EXP for taking notes on a video for the first time
        if (!existingNote && content.trim() !== '') {
            const user = await User.findById(req.user._id);
            if (user) {
                user.exp = (user.exp || 0) + 15;
                const nextLevelExp = (user.level || 1) * 500;
                if (user.exp >= nextLevelExp) {
                    user.level = (user.level || 1) + 1;
                    if (!user.badges.includes('Note Taker')) {
                        user.badges.push('Note Taker');
                    }
                }
                await user.save();
            }
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
