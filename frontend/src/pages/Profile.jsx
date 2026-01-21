import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DetailedHeatmap from '../components/DetailedHeatmap';
import { User, Edit2, Check, X, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, login } = useAuth(); // We might need a way to update local user state
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [completedPlaylists, setCompletedPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompletedPlaylists();
        if (user) setNewUsername(user.username);
    }, [user]);

    const fetchCompletedPlaylists = async () => {
        try {
            const { data } = await api.get('/api/playlists');
            // Filter locally for 100% completion
            const completed = data.filter(pl => pl.percent === 100);
            setCompletedPlaylists(completed);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const { data } = await api.put('/api/auth/profile', { username: newUsername });
            // Update local storage and context
            // Assuming the context doesn't expose a 'updateUser' method, we might have to manually update
            // localStorage and reload or use login(data) if it accepts full user object
            // Just for now: update the user in local storage and refresh context via window reload or context method
            const updatedUser = { ...user, username: data.username };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Hacky way to update context without a specific setUser method exposed in AuthContext
            // Ideally AuthContext should expose setUser or refreshUser. 
            // For now, if we call login with the new token/user data, it might work?
            // Actually, best to just reload the page to be safe if context is rigid
            window.location.reload();

            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">

            {/* Header / Profile Card */}
            <div className="bg-surface p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold border-4 border-surface shadow-2xl shrink-0">
                    {user?.username?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                    {isEditing ? (
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-xl font-bold focus:outline-none focus:border-primary w-full md:w-auto"
                                autoFocus
                            />
                            <button onClick={handleUpdateProfile} className="p-2 bg-green-600 rounded-lg hover:bg-green-500 text-white shadow-lg shadow-green-900/20">
                                <Check size={20} />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="p-2 bg-red-600/80 rounded-lg hover:bg-red-500 text-white">
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center md:justify-start gap-3 group">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 text-center">
                                {user?.username}
                            </h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-6 text-zinc-400 text-sm">
                        <span className="flex items-center gap-2">
                            <Shield size={14} /> Member since {new Date().getFullYear()}
                        </span>
                        <span>
                            {user?.email}
                        </span>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-surface p-6 rounded-3xl border border-white/5 shadow-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    Learning Activity
                    <span className="text-xs font-normal text-zinc-500 ml-auto border border-white/5 px-3 py-1 rounded-full">Past Year</span>
                </h2>
                <DetailedHeatmap />
            </div>

            {/* Completed Playlists */}
            <div className="bg-surface p-6 rounded-3xl border border-white/5 shadow-lg">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                    Completed Achievements
                    <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded-full ml-2">
                        {completedPlaylists.length}
                    </span>
                </h2>

                {completedPlaylists.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedPlaylists.map(pl => (
                            <Link to={`/playlist/${pl._id}`} key={pl._id} className="block group">
                                <div className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-yellow-500/50 transition-all group-hover:bg-black/40 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                        <img src={pl.thumbnail} alt={pl.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm truncate text-zinc-200 group-hover:text-white">{pl.title}</h3>
                                        <p className="text-xs text-zinc-500 mt-1">{pl.channelTitle}</p>
                                        <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                                            <Award size={12} /> Completed
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-zinc-500 border border-white/5 border-dashed rounded-xl">
                        <Award size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No completed playlists yet. Keep going!</p>
                    </div>
                )}
            </div>

        </div >
    );
};

export default Profile;
