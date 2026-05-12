import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Users, ArrowLeft, Copy, Trophy, CheckCircle, CopyCheck } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

const StudyGroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await api.get(`/api/study-groups/${id}`);
                setGroup(res.data);
            } catch (error) {
                console.error(error);
                alert("Failed to load study group");
            } finally {
                setLoading(false);
            }
        };
        fetchGroup();
    }, [id]);

    if (loading) return <div className="flex justify-center py-20">Loading Group...</div>;
    if (!group) return <div className="flex justify-center py-20 text-red-500">Study Group Not Found</div>;

    const copyInviteCode = () => {
        navigator.clipboard.writeText(group.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-slide-up pb-20 max-w-4xl mx-auto">
            <button onClick={() => navigate('/community')} className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors mb-6">
                <ArrowLeft size={20} /> Back to Community
            </button>

            <div className="bg-surface rounded-3xl p-8 border border-white/5 shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                        <Users size={16} /> Study Group
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{group.name}</h1>
                    <p className="text-zinc-400 mb-6">Tracking: <span className="text-white font-medium">{group.youtubePlaylistTitle}</span> • {group.totalVideos} Videos</p>
                    
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/10 max-w-md">
                        <div className="flex-1">
                            <p className="text-xs text-zinc-500 mb-1">Invite Code</p>
                            <p className="font-mono text-xl tracking-wider text-white">{group.inviteCode}</p>
                        </div>
                        <button 
                            onClick={copyInviteCode}
                            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Leaderboard
            </h2>

            <div className="space-y-4">
                {group.members.map((member, idx) => (
                    <div key={member._id} className="bg-surface border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden">
                        {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}
                        {idx === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-300"></div>}
                        {idx === 2 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600"></div>}

                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-xl font-bold text-zinc-600 w-6 text-center">#{idx + 1}</div>
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-lg text-primary overflow-hidden">
                                {member.profilePicture ? (
                                    <img src={member.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    member.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{member.username}</h3>
                                {group.creator._id === member._id && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Owner</span>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-400">Progress</span>
                                <span className="font-medium text-white">{member.progressPercentage}%</span>
                            </div>
                            <ProgressBar progress={member.progressPercentage} className="h-2" />
                            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                                <CheckCircle size={12} className="text-green-500" /> {member.completedVideos} / {group.totalVideos} completed
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyGroupDetail;
