import React, { useState, useEffect, useCallback } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["motivation", "inspirational", "success", "learning", "wisdom", "positive"];
const MAX_QUOTE_LENGTH = 120;
const MAX_RETRIES = 3;

const FALLBACKS = [
    { id: 1, quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "Motivation" },
    { id: 2, quote: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Innovation" },
    { id: 3, quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
    { id: 4, quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivation" },
    { id: 5, quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Wisdom" },
    { id: 6, quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Motivation" },
    { id: 7, quote: "Act as if what you do makes a difference. It does.", author: "William James", category: "Inspirational" },
];

const STORAGE_KEY = "learntrack_daily_quote";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const MotivationQuote = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchQuote = useCallback(async (forceRefresh = false) => {
        // Check localStorage cache for today's quote
        if (!forceRefresh) {
            try {
                const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
                if (cached.date === getTodayKey() && cached.quote) {
                    setQuoteData(cached.quote);
                    setIsLoading(false);
                    return;
                }
            } catch { /* ignore parse errors */ }
        }

        setIsRefreshing(true);
        setIsLoading(true);
        try {
            let validQuote = null;
            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
                const response = await fetch(`https://quotifyhub.vercel.app/api/random?category=${category}`);
                if (!response.ok) throw new Error("API error");
                const data = await response.json();
                const quote = Array.isArray(data) ? data[0] : data;
                if (quote && quote.quote && quote.quote.length <= MAX_QUOTE_LENGTH) {
                    validQuote = quote;
                    break;
                }
            }
            const finalQuote = validQuote || FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
            setQuoteData(finalQuote);
            // Cache the quote for today
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), quote: finalQuote }));
        } catch (err) {
            console.error("Error fetching quote:", err);
            setQuoteData(FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);

    return (
        <div className="w-full">
            <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-black/60 border border-white/[0.06] p-5 md:p-6 rounded-2xl backdrop-blur-xl shadow-lg transition-all duration-500 hover:border-primary/20">
                {/* Background Glows */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/8 blur-[80px] rounded-full group-hover:bg-primary/15 transition-all duration-700" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-500/8 blur-[80px] rounded-full group-hover:bg-purple-500/15 transition-all duration-700" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-gradient-to-br from-primary/15 to-purple-500/15 rounded-lg text-primary border border-primary/10">
                                <Quote size={14} fill="currentColor" />
                            </div>
                            <span className="text-zinc-500 text-[10px] font-semibold tracking-[0.2em] uppercase">Motivation</span>
                        </div>
                        <motion.button
                            onClick={() => fetchQuote(true)}
                            disabled={isRefreshing}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-zinc-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all border border-transparent hover:border-primary/10"
                            title="New Quote"
                            aria-label="Fetch new quote"
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                        </motion.button>
                    </div>

                    {/* Quote Content */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2.5 py-1"
                            >
                                <div className="h-4 bg-white/[0.04] rounded-md w-[90%] animate-pulse" />
                                <div className="h-4 bg-white/[0.04] rounded-md w-[70%] animate-pulse" />
                                <div className="h-3 bg-white/[0.04] rounded-md w-[35%] animate-pulse mt-4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={quoteData?.id || "quote"}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <p className="text-base md:text-lg text-white/85 leading-relaxed mb-4 italic">
                                    "{quoteData?.quote}"
                                </p>

                                <div className="flex items-center gap-2.5">
                                    <div className="h-[1.5px] w-6 bg-gradient-to-r from-primary/60 to-transparent rounded-full" />
                                    <p className="text-xs text-zinc-400 font-medium">
                                        {quoteData?.author}
                                    </p>
                                    {quoteData?.category && (
                                        <span className="text-[9px] text-zinc-600 bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04] font-medium uppercase tracking-wider">
                                            {quoteData.category}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MotivationQuote;
