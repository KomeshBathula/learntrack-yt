import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, User } from 'lucide-react';
import MiniPlayer from './MiniPlayer';
import GrokChat from './GrokChat';

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
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-white pb-24 md:pb-0">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg text-white">
                        L
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block">LearnTrackYT</span>
                </div>

                <div className="flex items-center gap-4">
                    <span onClick={() => navigate('/profile')} className="text-sm text-zinc-400 hidden sm:block hover:text-white cursor-pointer transition-colors">Hello, {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} className="text-zinc-400 hover:text-white" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
                {children}
            </main>

            {/* Desktop Floating Chat Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`hidden md:flex fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl border border-zinc-200 transition-all duration-300 hover:scale-105 ${isChatOpen ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-black'}`}
            >
                {isChatOpen ? <LogOut className="rotate-180" size={24} /> : <div className="flex items-center gap-2 font-bold"><span className="text-lg">✨</span> <span className="text-sm">Ask AI</span></div>}
            </button>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-40 safe-area-bottom pb-2">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/' ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Home size={24} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                {/* Central AI Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`flex flex-col items-center justify-center -mt-6`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${isChatOpen ? 'bg-white text-black border-white scale-110' : 'bg-gradient-to-tr from-primary to-secondary text-white border-surface'}`}>
                        <span className="text-2xl">✨</span>
                    </div>
                    <span className={`text-[10px] font-bold mt-1 ${isChatOpen ? 'text-white' : 'text-zinc-500'}`}>Ask AI</span>
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${location.pathname === '/profile' ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <User size={24} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
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
