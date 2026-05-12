const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    youtubePlaylistId: { type: String, required: true },
    youtubePlaylistTitle: { type: String, required: true },
    thumbnail: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    inviteCode: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
