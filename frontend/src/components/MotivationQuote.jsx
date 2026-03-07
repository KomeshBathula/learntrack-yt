import React, { useState, useEffect, useCallback } from "react";
import { Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["motivation", "inspirational", "success", "learning", "wisdom", "positive"];
const MAX_QUOTE_LENGTH = 120;
const MAX_RETRIES = 3;

const FALLBACKS = [
    { id: 1, quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { id: 2, quote: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { id: 3, quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { id: 4, quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { id: 5, quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { id: 6, quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { id: 7, quote: "Act as if what you do makes a difference. It does.", author: "William James" },
];

const STORAGE_KEY = "learntrack_daily_quote";
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const MotivationQuote = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuote = useCallback(async () => {
        try {
            const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            if (cached.date === getTodayKey() && cached.quote) {
                setQuoteData(cached.quote);
                setIsLoading(false);
                return;
            }
        } catch { /* ignore */ }

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
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), quote: finalQuote }));
        } catch (err) {
            console.error("Error fetching quote:", err);
            setQuoteData(FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuote();
    }, [fetchQuote]);

    return (
        <div className="w-full">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm">
                {/* Subtle left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-teal-400 to-emerald-400 rounded-l-2xl" />

                {/* Content */}
                <div className="px-6 py-5 md:px-7 md:py-5 pl-7">
                    {/* Label Row */}
                    <div className="flex items-center gap-2 mb-3">
                        <Quote size={14} className="text-teal-400" />
                        <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-teal-400/70">
                            Daily Inspiration
                        </span>
                    </div>

                    {/* Quote */}
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2"
                            >
                                <div className="h-[18px] md:h-5 bg-white/[0.04] rounded w-[90%] animate-pulse" />
                                <div className="h-[18px] md:h-5 bg-white/[0.04] rounded w-[60%] animate-pulse" />
                                <div className="h-3 bg-white/[0.04] rounded w-[25%] animate-pulse mt-3" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key={quoteData?.id || "quote"}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <p className="text-[15px] md:text-base leading-relaxed text-zinc-200 italic">
                                    "{quoteData?.quote}"
                                </p>
                                <p className="text-xs text-zinc-500 mt-2.5 font-medium">
                                    — {quoteData?.author}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MotivationQuote;
