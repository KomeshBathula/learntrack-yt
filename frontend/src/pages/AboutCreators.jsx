import React from 'react';
import { Github, Linkedin, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: 'Tadi Kodanda Ramreddy',
        initials: 'TR',
        role: 'Core Developer',
        github: '',
        linkedin: '',
        gradient: 'from-indigo-500 to-blue-600',
        accentBg: 'bg-indigo-500/10',
        accentBorder: 'border-indigo-500/20',
        accentText: 'text-indigo-400',
        glow: 'bg-indigo-500/10',
    },
    {
        name: 'Kalluri Ramteja',
        initials: 'KR',
        role: 'Core Developer',
        linkedin: '',
        gradient: 'from-purple-500 to-violet-600',
        accentBg: 'bg-purple-500/10',
        accentBorder: 'border-purple-500/20',
        accentText: 'text-purple-400',
        glow: 'bg-purple-500/10',
        github: 'https://github.com/RAMTEJA87',
    },
    {
        name: 'Yaswanth Chowdary',
        initials: 'YC',
        role: 'Core Developer',
        github: '',
        linkedin: '',
        gradient: 'from-emerald-500 to-teal-600',
        accentBg: 'bg-emerald-500/10',
        accentBorder: 'border-emerald-500/20',
        accentText: 'text-emerald-400',
        glow: 'bg-emerald-500/10',
    },
    {
        name: 'Priyanka Vangala',
        initials: 'PV',
        role: 'Core Developer',
        github: '',
        linkedin: '',
        gradient: 'from-rose-500 to-pink-600',
        accentBg: 'bg-rose-500/10',
        accentBorder: 'border-rose-500/20',
        accentText: 'text-rose-400',
        glow: 'bg-rose-500/10',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const AboutCreators = () => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="min-h-[80vh] flex flex-col items-center py-12 px-4 space-y-14 max-w-6xl mx-auto"
        >
            {/* Header */}
            <motion.div variants={item} className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] backdrop-blur-sm mb-4">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">The Minds Behind</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
                    Meet the Creators
                </h1>
                <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg leading-relaxed">
                    Crafting the future of learning with passion, code, and a touch of magic.
                </p>
            </motion.div>

            {/* Team Grid — 4 cards */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                {teamMembers.map((member) => (
                    <div key={member.name} className="group relative">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.gradient} rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500`} />
                        <div className="relative h-full bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--text-muted)] rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-1">

                            {/* Glow */}
                            <div className={`absolute top-0 right-0 w-24 h-24 ${member.glow} rounded-full blur-3xl -mr-8 -mt-8 opacity-50`} />

                            {/* Avatar */}
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-4 shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-300`}>
                                <span className="text-xl font-bold text-white">{member.initials}</span>
                            </div>

                            {/* Name & Role */}
                            <h2 className="text-base font-bold text-[var(--text-primary)] mb-1.5 leading-tight">{member.name}</h2>
                            <div className={`inline-block px-2.5 py-0.5 rounded-full ${member.accentBg} border ${member.accentBorder} ${member.accentText} text-[10px] font-semibold uppercase tracking-wider mb-4`}>
                                {member.role}
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3 mt-auto">
                                {member.github && (
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--skeleton)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all hover:scale-110"
                                        aria-label={`${member.name}'s GitHub`}
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--skeleton)] text-[var(--text-muted)] hover:text-blue-400 transition-all hover:scale-110"
                                        aria-label={`${member.name}'s LinkedIn`}
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Separator */}
            <motion.div variants={item} className="w-full flex items-center gap-4">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <div className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-widest">
                    Also helped
                </div>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </motion.div>

            {/* Komesh Bathula — Helper */}
            <motion.div variants={item} className="w-full flex justify-center">
                <div className="group bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--text-muted)] rounded-xl px-6 py-4 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm font-bold text-white">KB</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Komesh Bathula</h3>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Helped with Development</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <a href="https://github.com/KomeshBathula" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all hover:scale-110" aria-label="Komesh Bathula's GitHub">
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <motion.div variants={item} className="text-center pt-4">
                <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5">
                    Built with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by the LearnTrackYT Team
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AboutCreators;
