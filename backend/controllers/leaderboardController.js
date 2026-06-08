const User = require('../models/User');
const Progress = require('../models/Progress');
const Playlist = require('../models/Playlist');

exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch all users to accurately rank them based on streak
        const users = await User.find()
            .select('-password -email') // Don't expose sensitive info!
            .lean();

        // 1. Get all playlists safely
        const playlists = await Playlist.find({}, 'user videoCount videos').lean();
        const playlistMap = {};
        playlists.forEach(pl => {
            const userId = pl.user.toString();
            if (!playlistMap[userId]) playlistMap[userId] = [];
            playlistMap[userId].push({
                _id: pl._id.toString(),
                videoCount: pl.videoCount || (pl.videos ? pl.videos.length : 0)
            });
        });

        // 2. Count completed videos per user+playlist using aggregation
        const completedProgress = await Progress.aggregate([
            { $match: { status: 'COMPLETED' } },
            {
                $group: {
                    _id: { user: "$user", playlist: "$playlist" },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const progressMap = {};
        completedProgress.forEach(p => {
            if (!p._id.user || !p._id.playlist) return;
            const userId = p._id.user.toString();
            const playlistId = p._id.playlist.toString();
            if (!progressMap[userId]) progressMap[userId] = {};
            progressMap[userId][playlistId] = p.count;
        });

        // For each user, let's gather basic stats:
        const leaderboardData = users.map(user => {
            const userId = user._id.toString();
            const userPlaylists = playlistMap[userId] || [];
            const totalPlaylists = userPlaylists.length;
            
            let completedPlaylists = 0;
            const userProgress = progressMap[userId] || {};
            
            userPlaylists.forEach(pl => {
                 if (pl.videoCount > 0) {
                     const completedVideos = userProgress[pl._id] || 0;
                     if (completedVideos >= pl.videoCount) {
                         completedPlaylists++;
                     }
                 }
            });

            // Fetch exactly from Database directly.
            let currentStreak = user.currentStreak || 0;
            const longestStreak = user.longestStreak || 0;

            // We just ensure the DB value hasn't expired simply without randomly altering max.
            if (currentStreak > 0 && user.lastStreakUpdate) {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setUTCDate(yesterday.getUTCDate() - 1);
                
                const lastUpdate = new Date(user.lastStreakUpdate);
                lastUpdate.setUTCHours(0, 0, 0, 0);
                
                // If they missed yesterday entirely, current defaults to 0 dynamically, DB catches up on next tick.
                if (lastUpdate.getTime() < yesterday.getTime()) {
                    currentStreak = 0; 
                }
            }

            return {
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                exp: user.exp || 0,
                level: user.level || 1,
                streak: currentStreak,
                longestStreak: longestStreak,
                badges: user.badges || [],
                totalPlaylists,
                completedPlaylists,
            };
        });
        
        // Final Sort: currentStreak -> longestStreak -> completedPlaylists -> alphabetical
        leaderboardData.sort((a, b) => {
            if (b.streak !== a.streak) return b.streak - a.streak;
            if (b.longestStreak !== a.longestStreak) return b.longestStreak - a.longestStreak;
            if (b.completedPlaylists !== a.completedPlaylists) return b.completedPlaylists - a.completedPlaylists;
            return a.username.localeCompare(b.username);
        });

        // Assign ranks and limit to top 100
        const rankedData = leaderboardData.slice(0, 100).map((data, idx) => ({
            ...data,
            rank: idx + 1
        }));

        res.status(200).json(rankedData);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
}
