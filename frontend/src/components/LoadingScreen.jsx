import React, { useState, useEffect } from 'react';
import { Loader2, Server, Globe, Zap, Cpu } from 'lucide-react';
import faviconImg from '../assets/favicon.png';

const loadingMessages = [
    { text: "Waking up the server...", icon: Server },
    { text: "Dusting off the database...", icon: Globe },
    { text: "Connecting to the neural network...", icon: Cpu },
    { text: "Almost there, just a moment...", icon: Zap },
    { text: "Preparing your learning space...", icon: Loader2 }
];

const WAKE_UP_DURATION = 60;

const LoadingScreen = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(WAKE_UP_DURATION); // Render free tier wake-up estimate

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);

        const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(timerInterval);
        };
    }, []);

    const CurrentIcon = loadingMessages[messageIndex].icon;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--text-primary)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

            {/* Central Content */}
            <div className="z-10 flex flex-col items-center gap-8">
                {/* Visual Loader */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-purple-600 animate-spin-slow blur-md absolute inset-0 opacity-50"></div>
                    <div className="w-24 h-24 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center relative shadow-2xl overflow-hidden p-3">
                        <img 
                            src={faviconImg} 
                            alt="Logo" 
                            className="w-full h-full object-contain animate-pulse" 
                        />
                    </div>
                    {/* Orbiting particles */}
                    <div className="absolute -inset-4 animate-spin-reverse">
                        <div className="w-3 h-3 bg-secondary rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#fff]"></div>
                    </div>
                </div>

                {/* Wake-up Timer */}
                <div className="flex flex-col items-center gap-1 -mt-4">
                    <span className="text-sm font-medium text-primary animate-pulse" aria-live="off">
                        {timeLeft > 0 ? `Estimated wake-up: ${timeLeft}s` : "Free tier server starting... almost ready!"}
                    </span>
                    <div 
                        className="w-32 h-1 bg-[var(--skeleton)] rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax={WAKE_UP_DURATION}
                        aria-valuenow={timeLeft}
                    >
                        <div 
                            className="h-full bg-primary transition-all duration-1000 ease-linear"
                            style={{ width: timeLeft > 0 ? `${(timeLeft / WAKE_UP_DURATION) * 100}%` : "100%" }}
                        ></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-center gap-3 h-20">
                    <h2 className="text-2xl font-bold tracking-tight">LearnTrackYT</h2>

                    <div key={messageIndex} className="flex items-center gap-2 text-[var(--text-muted)] animate-fade-in-up">
                        <CurrentIcon size={18} className="animate-bounce" />
                        <span className="font-medium tracking-wide">
                            {loadingMessages[messageIndex].text}
                        </span>
                    </div>
                </div>

                {/* Progress Bar (Visual only, creates feeling of movement) */}
                <div className="w-64 h-1 bg-[var(--skeleton)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-purple-500 w-1/2 animate-loading-bar rounded-full"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-xs text-[var(--text-muted)]">
                Deploying excellence...
            </div>
        </div>
    );
};

export default LoadingScreen;
