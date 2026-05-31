const User = require('../models/User');
const Progress = require('../models/Progress');
const Playlist = require('../models/Playlist');

exports.getLeaderboard = async (req, res) => {
    try {
        // Fetch all users to accurately rank them based on streak
        const users = await User.find()
            .select('-password -email') // Don't expose sensitive info!
            .lean();

        // For each user, let's gather basic stats:
        // Completed playlists, enrolled playlists, and verify the streaks securely.
        const leaderboardData = await Promise.all(users.map(async (user) => {
            // Count playlists this user has
            const playlists = await Playlist.find({ user: user._id });
            const totalPlaylists = playlists.length;
            
            // To find completed playlists, we check how many videos they completed per playlist
            let completedPlaylists = 0;
            
            await Promise.all(playlists.map(async (pl) => {
                 const plVideosCount = pl.videoCount || pl.videos.length || 0;
                 if (plVideosCount > 0) {
                     const completedVideos = await Progress.countDocuments({
                         user: user._id,
                         playlist: pl._id,
                         status: 'COMPLETED'
                     });
                     if (completedVideos >= plVideosCount) {
                         completedPlaylists++;
                     }
                 }
            }));

            // Fetch exactly from Database directly.
            let currentStreak = user.currentStreak || 0;
            const longestStreak = user.longestStreak || 0;

            // We just ensure the DB value hasn't expired simply without randomly altering max.
            if (currentStreak > 0 && user.lastStreakUpdate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                const lastUpdate = new Date(user.lastStreakUpdate);
                lastUpdate.setHours(0, 0, 0, 0);
                
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
        }));
        
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
