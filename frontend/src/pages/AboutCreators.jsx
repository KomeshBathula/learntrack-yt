import React from 'react';
import { Github, Linkedin, ExternalLink, Code2, Sparkles } from 'lucide-react';

const AboutCreators = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 space-y-16">

            {/* Header Section */}
            <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">The Minds Behind</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight">
                    Meet the Creators
                </h1>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
                    Crafting the future of learning with passion, code, and a touch of magic.
                </p>
            </div>

            {/* Creators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full max-w-5xl px-4">

                {/* Creator 1: Ramteja Kalluri */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-full bg-[#0A0A0B] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden">

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        {/* Profile Image Placeholder */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">RK</span>
                        </div>

                        {/* Name & Title */}
                        <h2 className="text-2xl font-bold text-white mb-2">Ramteja Kalluri</h2>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                            The Origin
                        </div>

                        {/* Description */}
                        <p className="text-zinc-400 mb-8 leading-relaxed text-sm md:text-base">
                            Visionary architect behind the platform. Bringing ideas to life through innovative design and robust engineering.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-auto">
                            <a href="https://github.com/RAMTEJA87" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all hover:scale-110">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-400 text-zinc-400 transition-all hover:scale-110">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Creator 2: Komesh Bathula */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-full bg-[#0A0A0B] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center overflow-hidden">

                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mt-16"></div>

                        {/* Profile Image Placeholder */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400">KB</span>
                        </div>

                        {/* Name & Title */}
                        <h2 className="text-2xl font-bold text-white mb-2">Komesh Bathula</h2>
                        <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
                            Contributor
                        </div>

                        {/* Description */}
                        <p className="text-zinc-400 mb-8 leading-relaxed text-sm md:text-base">
                            Driving excellence through code. Enhancing user experience and pushing technical boundaries.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-auto">
                            <a href="https://github.com/KomeshBathula" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-zinc-400 transition-all hover:scale-110">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-400 text-zinc-400 transition-all hover:scale-110">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-12 text-center">
                <p className="text-zinc-500 text-sm">
                    Built with <span className="text-red-500 animate-pulse">❤</span> by the LearnTrackYT Team
                </p>
            </div>
        </div>
    );
};

export default AboutCreators;
