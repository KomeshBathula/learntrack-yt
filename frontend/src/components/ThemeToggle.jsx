import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
    { value: 'light', icon: Sun, label: 'Light', desc: 'Always light' },
    { value: 'dark', icon: Moon, label: 'Dark', desc: 'Always dark' },
    { value: 'system', icon: Monitor, label: 'System', desc: 'Match device' },
];

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentTheme = themes.find(t => t.value === theme) || themes[2];
    const CurrentIcon = currentTheme.icon;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border)]"
                aria-label="Toggle theme"
                aria-expanded={isOpen}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={theme}
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center"
                    >
                        <CurrentIcon size={16} />
                    </motion.div>
                </AnimatePresence>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-44 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-[200] backdrop-blur-xl"
                        style={{ boxShadow: '0 20px 40px var(--shadow-color)' }}
                    >
                        <div className="p-1.5">
                            {themes.map(({ value, icon: ThemeIcon, label, desc }) => (
                                <button
                                    type="button"
                                    key={value}
                                    onClick={() => {
                                        setTheme(value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${theme === value
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <ThemeIcon size={16} className={theme === value ? 'text-primary' : ''} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-tight">{label}</p>
                                        <p className={`text-[10px] leading-tight mt-0.5 ${theme === value ? 'text-primary/60' : 'text-[var(--text-muted)]'}`}>{desc}</p>
                                    </div>
                                    {theme === value && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeToggle;
