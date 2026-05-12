import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Users, Globe, Copy, Check, UsersIcon, PlusCircle, ArrowRight } from 'lucide-react';
import PlaylistSkeleton from '../components/PlaylistSkeleton';

const Community = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('public'); // 'public' | 'groups'
    const [publicPlaylists, setPublicPlaylists] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Join Group State
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'public') {
                const res = await api.get('/api/playlists/public');
                setPublicPlaylists(res.data);
            } else {
                const res = await api.get('/api/study-groups');
                setMyGroups(res.data);
            }
        } catch (error) {
            console.error('Error loading community data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClone = async (id) => {
        try {
            const res = await api.post(`/api/playlists/${id}/clone`);
            alert("Playlist and notes cloned successfully!");
            navigate(`/playlist/${res.data._id}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to clone playlist');
        }
    };

    const handleJoinGroup = async () => {
        if (!inviteCode.trim()) return;
        setJoining(true);
        setJoinError('');
        try {
            const res = await api.post('/api/study-groups/join', { inviteCode });
            setInviteCode('');
            navigate(`/study-groups/${res.data._id}`);
        } catch (error) {
            setJoinError(error.response?.data?.message || 'Failed to join group. Check code.');
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="animate-slide-up pb-20 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Community</h1>

            <div className="flex gap-4 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('public')}
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'public' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <Globe size={18} /> Public Playlists
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'groups' ? 'text-primary border-b-2 border-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <div className="flex items-center gap-2">
                        <Users size={18} /> My Study Groups
                    </div>
                </button>
            </div>

            {loading ? (
                <PlaylistSkeleton />
            ) : activeTab === 'public' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publicPlaylists.length === 0 && (
                        <div className="col-span-full text-center py-20 text-zinc-500">
                            No public playlists available.
                        </div>
                    )}
                    {publicPlaylists.map(pl => (
                        <div key={pl._id} className="bg-surface border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-colors">
                            <div className="flex gap-4">
                                <img src={pl.thumbnail} alt={pl.title} className="w-32 h-20 object-cover rounded-lg" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate">{pl.title}</h3>
                                    <p className="text-zinc-400 text-sm truncate">{pl.channelTitle}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">{pl.videoCount} videos</span>
                                        {pl.user && <span className="text-xs text-primary px-2 py-1 bg-primary/10 rounded">By {pl.user.username}</span>}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleClone(pl._id)}
                                className="w-full mt-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Copy size={16} /> Import to My Courses
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-2">Join a Study Group</h2>
                        <p className="text-zinc-400 text-sm mb-4">Got an invite code? Enter it below to join a group and track progress with friends.</p>
                        <div className="flex gap-3 max-w-md">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={e => setInviteCode(e.target.value)}
                                placeholder="Enter Invite Code"
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 outline-none focus:border-primary"
                            />
                            <button
                                onClick={handleJoinGroup}
                                disabled={joining || !inviteCode.trim()}
                                className="px-6 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
                            >
                                {joining ? 'Joining...' : 'Join'}
                            </button>
                        </div>
                        {joinError && <p className="text-red-500 text-sm mt-2">{joinError}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myGroups.length === 0 && (
                            <div className="col-span-full text-center py-10 text-zinc-500">
                                You are not in any study groups yet. Create one from a playlist page!
                            </div>
                        )}
                        {myGroups.map(group => (
                            <div 
                                key={group._id} 
                                onClick={() => navigate(`/study-groups/${group._id}`)}
                                className="bg-surface border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-primary/50 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                            <UsersIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{group.name}</h3>
                                            <p className="text-sm text-zinc-400">{group.members.length} Members</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-zinc-600 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="bg-black/20 p-3 rounded-lg flex items-center gap-3">
                                    {group.thumbnail ? (
                                        <img src={group.thumbnail} alt="" className="w-12 h-12 object-cover rounded" />
                                    ) : (
                                        <div className="w-12 h-12 bg-zinc-800 rounded"></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-zinc-500">Studying</p>
                                        <p className="font-medium text-sm truncate">{group.youtubePlaylistTitle}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
