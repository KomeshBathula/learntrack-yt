import React from 'react';
import { Github, Linkedin, Code2, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
    {
        name: 'Ramteja Kalluri',
        initials: 'RK',
        role: 'Core Architect & Developer',
        github: 'https://github.com/RAMTEJA87',
        linkedin: 'https://linkedin.com/in/ramtejakalluri',
        gradient: 'from-indigo-600 via-slate-700 to-slate-800',
        textGradient: 'from-indigo-600 to-slate-600 dark:from-indigo-300 dark:to-slate-300',
        glow: 'bg-indigo-500/10',
        bgAccent: 'bg-white dark:bg-indigo-500/5',
        borderAccent: 'border-slate-200 dark:border-indigo-500/20'
    },
    {
        name: 'Ram Reddy Tadi',
        initials: 'RR',
        role: 'Backend Developer',
        github: 'https://github.com/ramreddy-tadi',
        linkedin: 'https://www.linkedin.com/in/ramreddy-tadi/',
        gradient: 'from-emerald-600 via-teal-700 to-slate-800',
        textGradient: 'from-emerald-600 to-teal-600 dark:from-emerald-300 dark:to-teal-300',
        glow: 'bg-emerald-500/10',
        bgAccent: 'bg-white dark:bg-emerald-500/5',
        borderAccent: 'border-slate-200 dark:border-emerald-500/20'
    },
    {
        name: 'Komesh Bathula',
        initials: 'KB',
        role: 'Core Architect & Developer',
        github: 'https://github.com/KomeshBathula',
        linkedin: 'https://linkedin.com/in/komeshbathula',
        gradient: 'from-slate-700 via-gray-700 to-zinc-800',
        textGradient: 'from-slate-700 to-gray-600 dark:from-slate-300 dark:to-gray-300',
        glow: 'bg-slate-500/10',
        bgAccent: 'bg-white dark:bg-slate-500/5',
        borderAccent: 'border-slate-200 dark:border-slate-500/20'
    }
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const AboutCreators = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-slate-50 dark:bg-[#0A0B0E] selection:bg-indigo-500/30 transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/5 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-slate-600/10 dark:bg-slate-600/5 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
                
                {/* Minimal Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex flex-col items-center py-20 px-4 md:px-8 space-y-20 max-w-7xl mx-auto"
            >
                {/* Header Sequence */}
                <motion.div variants={fadeUp} className="text-center space-y-6 max-w-3xl flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:backdrop-blur-md dark:shadow-2xl dark:shadow-indigo-500/10">
                        <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-700 dark:text-white/80">The Engineering Team</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-white/40 tracking-tighter pb-2">
                        Meet the Creators
                    </h1>
                    <p className="text-slate-600 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        We are building the ultimate AI-powered learning environment. Passionate about beautiful code, developer experience, and modern web architectures.
                    </p>
                </motion.div>

                {/* Creators Showcase */}
                <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 w-full pt-8">
                    {teamMembers.map((member) => (
                        <motion.div key={member.name} variants={fadeUp} className="group relative">
                            {/* Card Hover Glow */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${member.gradient} rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition-all duration-700 ease-out`} />
                            
                            {/* Card Container */}
                            <div className={`relative h-full ${member.bgAccent} border ${member.borderAccent} backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] p-8 md:p-12 flex flex-col items-center text-center transition-transform duration-500 ease-out group-hover:-translate-y-2 overflow-hidden`}>
                                
                                {/* Inner Ambient Glow - Light theme doesn't need to be as visible */}
                                <div className={`absolute -top-32 -right-32 w-64 h-64 ${member.glow} rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700`} />
                                <div className={`absolute -bottom-32 -left-32 w-64 h-64 ${member.glow} rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700`} />

                                {/* Huge Avatar Initial */}
                                <div className="relative mb-8 group-hover:scale-110 transition-transform duration-500 ease-out">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 dark:opacity-50 blur-md`} />
                                    <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-2xl border border-white/20 z-10`}>
                                        <span className="text-6xl md:text-7xl font-black text-white mix-blend-overlay shadow-sm tracking-tighter">
                                            {member.initials}
                                        </span>
                                    </div>
                                </div>

                                {/* Typography */}
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                                    {member.name}
                                </h2>
                                <div className={`text-sm md:text-base font-bold uppercase tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r ${member.textGradient} mb-10`}>
                                    {member.role}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 mt-auto z-10">
                                    {member.github && (
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group/btn"
                                            aria-label={`${member.name}'s GitHub`}
                                        >
                                            <Github className="w-6 h-6 text-slate-500 dark:text-zinc-400 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors" />
                                        </a>
                                    )}
                                    {member.linkedin && (
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group/btn"
                                            aria-label={`${member.name}'s LinkedIn`}
                                        >
                                            <Linkedin className="w-6 h-6 text-slate-500 dark:text-zinc-400 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white transition-colors" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Signature */}
                <motion.div variants={fadeUp} className="text-center pt-16 relative z-10">
                    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none dark:backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-emerald-400" />
                        <p className="text-slate-600 dark:text-zinc-300 text-sm font-medium flex items-center gap-1.5">
                            Engineered with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> by LearnTrackYT Team
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutCreators;
