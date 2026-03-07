import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight } from 'lucide-react';

const JumpBackIn = () => {
    const { user } = useAuth();
    if (!user?.lastActiveVideo) return null;

    const { playlistId, videoId, title, thumbnail } = user.lastActiveVideo;

    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] group">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <img src={thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
            </div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                {/* Thumbnail Card */}
                <div className="w-full md:w-80 aspect-video rounded-xl overflow-hidden shadow-2xl border border-[var(--border)] relative shrink-0 group/card">
                    <img
                        src={thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                        alt={title}
                        onError={(e) => e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 text-white">
                            <PlayCircle size={28} fill="currentColor" />
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full bg-primary w-[65%]" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left h-full py-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-3">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Jump Back In
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight mb-2 line-clamp-2">
                        {title}
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mb-6 line-clamp-1">Continue from where you left off</p>

                    <Link
                        to={`/playlist/${playlistId}?videoId=${videoId}`}
                        className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 self-center md:self-start group/btn"
                    >
                        <PlayCircle size={20} fill="currentColor" />
                        Resume Playing
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JumpBackIn;
