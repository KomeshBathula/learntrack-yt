import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import faviconImg from '../assets/favicon.png';
import api from '../utils/api';

const Auth = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        // Silent ping to wake up the Render free tier backend
        api.get('/api/test').catch(() => {
            // Ignore errors, we just want to trigger the server wake up
        });
    }, []);

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign-In was unsuccessful. Please try again.');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const logoVariants = {
        hidden: {
            scale: 0,
            rotate: -180,
            opacity: 0
        },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const titleVariants = {
        hidden: {
            y: 50,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.6
            }
        }
    };

    const taglineVariants = {
        hidden: {
            y: 30,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.2
            }
        }
    };

    const buttonContainerVariants = {
        hidden: {
            y: 40,
            opacity: 0
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.4
            }
        }
    };

    const authPanelVariants = {
        hidden: {
            scale: 0.8,
            opacity: 0,
            y: 50
        },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            y: -50,
            transition: {
                duration: 0.3
            }
        }
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.3)",
                "0 0 40px rgba(168, 85, 247, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.3)"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Theme toggle */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <AnimatePresence mode="wait">
                {!showAuth ? (
                    // Landing View
                    <motion.div
                        key="landing"
                        className="text-center z-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Animated Logo */}
                        <motion.div
                            className="flex justify-center mb-6"
                            variants={logoVariants}
                        >
                            <motion.div
                                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl overflow-hidden"
                                variants={glowVariants}
                                animate="animate"
                            >
                                <img
                                    src={faviconImg}
                                    alt="LearnTrackYT Logo"
                                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Animated Title */}
                        <motion.h1
                            className="text-4xl md:text-6xl font-black mb-4"
                            variants={titleVariants}
                        >
                            <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                                LearnTrack
                            </span>
                            <span className="text-[var(--text-primary)]">YT</span>
                        </motion.h1>

                        {/* Tagline */}
                        <motion.p
                            className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-md mx-auto"
                            variants={taglineVariants}
                        >
                            Transform YouTube playlists into your personal learning journey
                        </motion.p>

                        {/* Get Started Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            variants={buttonContainerVariants}
                        >
                            <motion.button
                                onClick={() => setShowAuth(true)}
                                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started
                            </motion.button>
                            <motion.button
                                onClick={() => setShowAuth(true)}
                                className="px-8 py-4 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-lg rounded-xl hover:bg-[var(--bg-hover)] transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                I have an account
                            </motion.button>
                        </motion.div>

                        {/* Features preview */}
                        <motion.div
                            className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                        >
                            {[
                                { icon: "📚", label: "Track Progress" },
                                { icon: "🤖", label: "AI Summaries" },
                                { icon: "📊", label: "Study Analytics" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.4 + index * 0.1 }}
                                >
                                    <div className="text-3xl md:text-4xl mb-2">{feature.icon}</div>
                                    <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">{feature.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    // Auth Panel
                    <motion.div
                        key="auth"
                        className="w-full max-w-md bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border)] shadow-2xl z-10"
                        variants={authPanelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Back button */}
                        <motion.button
                            onClick={() => setShowAuth(false)}
                            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors"
                            whileHover={{ x: -5 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </motion.button>

                        {/* Logo in auth panel */}
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        >
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg overflow-hidden">
                                <img
                                    src={faviconImg}
                                    alt="LearnTrackYT Logo"
                                    className="w-14 h-14 object-contain"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                                Welcome to LearnTrackYT
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2">Sign in to continue your learning journey</p>
                        </motion.div>

                        {error && (
                            <motion.div
                                className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div
                            className="flex flex-col items-center space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-3 text-[var(--text-secondary)]">Signing in...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full flex justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            theme="filled_blue"
                                            size="large"
                                            width="300"
                                            text="continue_with"
                                            shape="rectangular"
                                        />
                                    </div>

                                    <div className="text-center text-[var(--text-muted)] text-xs px-4">
                                        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                                    </div>
                                </>
                            )}
                        </motion.div>

                        <motion.div
                            className="mt-8 pt-6 border-t border-[var(--border)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center justify-center space-x-2 text-[var(--text-muted)] text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secure authentication powered by Google</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Auth;
