const StudyGroup = require('../models/StudyGroup');
const Playlist = require('../models/Playlist');
const Progress = require('../models/Progress');
const shortid = require('shortid');

// Create a new study group
exports.createGroup = async (req, res) => {
    try {
        const { name, playlistId } = req.body;
        if (!name || !playlistId) return res.status(400).json({ message: 'Name and Playlist are required' });

        const playlist = await Playlist.findOne({ _id: playlistId, user: req.user._id });
        if (!playlist) return res.status(404).json({ message: 'Playlist not found in your account' });

        const newGroup = await StudyGroup.create({
            name,
            youtubePlaylistId: playlist.youtubeId,
            youtubePlaylistTitle: playlist.title,
            thumbnail: playlist.thumbnail,
            creator: req.user._id,
            members: [req.user._id],
            inviteCode: shortid.generate()
        });

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Join a study group via invite code
exports.joinGroup = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const group = await StudyGroup.findOne({ inviteCode });
        if (!group) return res.status(404).json({ message: 'Invalid invite code' });

        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already in this group' });
        }

        group.members.push(req.user._id);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's study groups
exports.getMyGroups = async (req, res) => {
    try {
        const groups = await StudyGroup.find({ members: req.user._id }).populate('creator', 'username profilePicture');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single group details with members' progress
exports.getGroupDetails = async (req, res) => {
    try {
        const group = await StudyGroup.findById(req.params.id)
            .populate('members', 'username profilePicture _id')
            .populate('creator', 'username');

        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (!group.members.some(m => m._id.toString() === req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch how many videos each member has completed for this youtube playlist
        // We find the playlists corresponding to the youtubePlaylistId for these members
        const memberIds = group.members.map(m => m._id);
        const memberPlaylists = await Playlist.find({ user: { $in: memberIds }, youtubeId: group.youtubePlaylistId });
        const memberPlaylistIds = memberPlaylists.map(p => p._id);

        const progressData = await Progress.aggregate([
            { $match: { playlist: { $in: memberPlaylistIds }, status: 'COMPLETED' } },
            { $group: { _id: '$user', completedCount: { $sum: 1 } } }
        ]);

        const progressMap = {};
        progressData.forEach(p => {
            progressMap[p._id.toString()] = p.completedCount;
        });

        // We also need total video count. Assuming it's consistent for the youtube playlist.
        // Get it from one of the playlists.
        const totalVideoCount = memberPlaylists.length > 0 ? memberPlaylists[0].videoCount : 0;

        const membersWithProgress = group.members.map(m => {
            const count = progressMap[m._id.toString()] || 0;
            return {
                _id: m._id,
                username: m.username,
                profilePicture: m.profilePicture,
                completedVideos: count,
                progressPercentage: totalVideoCount > 0 ? Math.round((count / totalVideoCount) * 100) : 0
            };
        });

        res.status(200).json({
            _id: group._id,
            name: group.name,
            youtubePlaylistId: group.youtubePlaylistId,
            youtubePlaylistTitle: group.youtubePlaylistTitle,
            inviteCode: group.inviteCode,
            creator: group.creator,
            totalVideos: totalVideoCount,
            members: membersWithProgress.sort((a, b) => b.completedVideos - a.completedVideos) // Sort by most completed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
