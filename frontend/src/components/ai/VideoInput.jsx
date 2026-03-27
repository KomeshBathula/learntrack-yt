import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Youtube, Loader2, FileText } from 'lucide-react';

const VideoInput = ({ onProcess, loading }) => {
    const [mode, setMode] = useState('url'); // 'url' or 'manual'
    const [url, setUrl] = useState('');
    const [manualText, setManualText] = useState('');
    const [level, setLevel] = useState('medium');
    const [language, setLanguage] = useState('en');

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            summaryLevel: level,
            language
        };

        if (mode === 'url') {
            if (url.trim()) {
                payload.youtubeUrl = url;
                onProcess(payload);
            }
        } else {
            if (manualText.trim()) {
                payload.transcriptText = manualText;
                onProcess(payload);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-xl"
        >
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-6 border border-white/10">

                {/* Mode Toggles */}
                <div className="flex bg-black/40 p-1 rounded-xl mb-6 w-fit mx-auto border border-white/10">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'url' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Youtube className="w-4 h-4" /> YouTube URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Manual Text
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg ${mode === 'url' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                        {mode === 'url' ? (
                            <Youtube className="w-6 h-6 text-red-500" />
                        ) : (
                            <FileText className="w-6 h-6 text-emerald-500" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {mode === 'url' ? 'AI Video Learning' : 'Manual Text Processor'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {mode === 'url' ? (
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Paste YouTube Video URL..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                required
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                    ) : (
                        <div className="relative group">
                            <textarea
                                placeholder="Paste transcript text, notes, or any content here..."
                                value={manualText}
                                onChange={(e) => setManualText(e.target.value)}
                                className="w-full h-40 bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                required
                            />
                        </div>
                    )}

                    {/* Summary Level */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Summary Type</label>
                        <div className="relative flex gap-2 bg-black/30 p-1 rounded-lg border border-white/10">
                            <button
                                type="button"
                                onClick={() => setLevel('short')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    level === 'short'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                Short
                            </button>
                            <button
                                type="button"
                                onClick={() => setLevel('medium')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    level === 'medium'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                Medium
                            </button>
                            <button
                                type="button"
                                onClick={() => setLevel('detailed')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    level === 'detailed'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                Detailed
                            </button>
                            <motion.div
                                layoutId="summary-indicator"
                                className="absolute bg-purple-600 rounded-md shadow-md"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 30
                                }}
                                style={{
                                    width: 'calc(33.333% - 0.333rem)',
                                    height: 'calc(100% - 0.5rem)',
                                    top: '0.25rem',
                                    left: level === 'short' ? '0.25rem' : level === 'medium' ? 'calc(33.333% + 0.167rem)' : 'calc(66.667% + 0.083rem)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Language</label>
                        <div className="relative flex gap-2 bg-black/30 p-1 rounded-lg border border-white/10">
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    language === 'en'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage('hi')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    language === 'hi'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                Hindi
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage('te')}
                                className={`relative z-10 flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
                                    language === 'te'
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                Telugu
                            </button>
                            <motion.div
                                layoutId="language-indicator"
                                className="absolute bg-indigo-600 rounded-md shadow-md"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 30
                                }}
                                style={{
                                    width: 'calc(33.333% - 0.333rem)',
                                    height: 'calc(100% - 0.5rem)',
                                    top: '0.25rem',
                                    left: language === 'en' ? '0.25rem' : language === 'hi' ? 'calc(33.333% + 0.167rem)' : 'calc(66.667% + 0.083rem)'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'url'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/20'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Generate Learning Material'
                        )}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default VideoInput;
