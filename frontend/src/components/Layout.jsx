import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, User, LayoutGrid, Brain, Users, Trophy, Bot } from 'lucide-react';
import MiniPlayer from './MiniPlayer';
import GrokChat from './GrokChat';
import ThemeToggle from './ThemeToggle';
import faviconImg from '../assets/favicon.png';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [miniVideo, setMiniVideo] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        window.showMiniPlayer = (video) => setMiniVideo(video);
        return () => { try { delete window.showMiniPlayer; } catch { /* ignore */ } };
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are You Sure To Log Out ?")) {
            logout();
            navigate('/auth');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pb-24 md:pb-0">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--border)] z-50 flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                        <img src={faviconImg} alt="LearnTrackYT" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block text-[var(--text-primary)]">LearnTrackYT</span>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8 mx-8">
                    <button onClick={() => navigate('/')} className={`font-medium transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Dashboard</button>
                    <button onClick={() => navigate('/courses')} className={`font-medium transition-colors ${location.pathname === '/courses' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>My Courses</button>
                    <button onClick={() => navigate('/community')} className={`font-medium transition-colors ${location.pathname.startsWith('/community') || location.pathname.startsWith('/study-groups') ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Community</button>
                    <button onClick={() => navigate('/leaderboard')} className={`font-medium flex items-center gap-1.5 transition-colors ${location.pathname === '/leaderboard' ? 'text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'text-yellow-500/70 hover:text-yellow-400'}`}>Leaderboard</button>
                    <button onClick={() => navigate('/ai-learning')} className={`font-medium transition-colors ${location.pathname === '/ai-learning' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Summary</button>
                    <button onClick={() => navigate('/profile')} className={`font-medium transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Profile</button>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Theme Toggle — compact on mobile, full on desktop */}
                    <ThemeToggle />

                    <button
                        onClick={() => navigate('/about-creators')}
                        className={`flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-full border transition-all ${location.pathname === '/about-creators'
                            ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                            : 'bg-[var(--bg-hover)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                            }`}
                    >
                        <Users size={16} />
                        <span className="text-sm font-medium hidden md:inline">Team</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
                {children}
            </main>

            {/* Floating Chat Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 p-3 md:p-4 rounded-full shadow-2xl border transition-all duration-300 hover:scale-105 ${isChatOpen
                    ? 'bg-zinc-800 text-white border-zinc-700'
                    : 'bg-primary text-white border-primary/50'
                    }`}
            >
                {isChatOpen ? <LogOut className="rotate-180" size={24} /> : <div className="flex items-center gap-2 font-bold px-1"><Bot size={20} /> <span className="text-sm">AI</span></div>}
            </button>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--border)] flex items-center justify-around z-40 safe-area-bottom pb-2">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                    <Home size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button
                    onClick={() => navigate('/courses')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/courses' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                    <LayoutGrid size={22} strokeWidth={location.pathname === '/courses' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Courses</span>
                </button>

                <button
                    onClick={() => navigate('/ai-learning')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/ai-learning' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                    <Brain size={22} strokeWidth={location.pathname === '/ai-learning' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Summary</span>
                </button>

                <button
                    onClick={() => navigate('/community')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname.startsWith('/community') ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                    <Users size={22} strokeWidth={location.pathname.startsWith('/community') ? 2.5 : 2} />
                      <span className="text-[10px] flex-shrink-0 font-medium tracking-tight">Users</span>
                  </button>

                  <button
                      onClick={() => navigate('/leaderboard')}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/leaderboard' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                  >
                      <Trophy size={22} strokeWidth={location.pathname === '/leaderboard' ? 2.5 : 2} />
                      <span className="text-[10px] flex-shrink-0 font-medium tracking-tight">Ranks</span>
                  </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/profile' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                >
                    <User size={22} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>

            <MiniPlayer
                video={miniVideo}
                onClose={() => setMiniVideo(null)}
                onNext={() => { }}
                onPrev={() => { }}
                onTogglePlay={() => { }}
            />
            <GrokChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default Layout;
