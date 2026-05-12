import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User as UserIcon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { jsPDF } from 'jspdf';

const GrokChat = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = user?.username
                ? `Hello ${user.username}! I'm your AI study companion. Need help with a summary or a quiz?`
                : "Hello! I'm your AI study companion. How can I help you today?";

            setMessages([{ role: 'assistant', content: greeting }]);
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleExportPDF = () => {
        if (messages.length === 0) return;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("AI Study Session Export", 10, 10);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPos = 20;

        messages.forEach(msg => {
            const roleName = msg.role === 'user' ? (user?.username || 'You') : 'AI Assistant';
            doc.setFont("helvetica", "bold");
            doc.text(`${roleName}:`, 10, yPos);
            yPos += 7;

            doc.setFont("helvetica", "normal");
            const splitText = doc.splitTextToSize(msg.content, 180);
            
            // Check page boundaries dynamically
            for (let i = 0; i < splitText.length; i++) {
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 10;
                }
                doc.text(splitText[i], 10, yPos);
                yPos += 6;
            }
            yPos += 5; // Add spacing between messages
        });

        doc.save(`AI-Study-Export-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Contextualize with previous messages (last 10)
            const recentMessages = [...messages.slice(-10), userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data } = await api.post('/api/ai/chat', { messages: recentMessages });
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const exportChat = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("AI Study Companion - Chat Summary", 10, 10);
        doc.setFontSize(10);
        
        let yPos = 20;
        
        messages.forEach(msg => {
            const role = msg.role === 'user' ? 'You' : 'AI Assistant';
            doc.setFont('helvetica', 'bold');
            doc.text(`${role}:`, 10, yPos);
            yPos += 5;
            
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(msg.content, 180);
            doc.text(lines, 10, yPos);
            yPos += (lines.length * 5) + 5;
            
            if (yPos > 280) {
                doc.addPage();
                yPos = 10;
            }
        });
        
        doc.save('ai_chat_summary.pdf');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 z-[100] w-full md:w-[400px] h-full md:h-[550px] bg-[var(--bg)]/95 md:bg-[var(--bg-surface)]/95 backdrop-blur-2xl md:border border-[var(--border)] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden font-sans"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Sparkles size={20} className="text-white fill-white/20" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121214]"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)] text-base tracking-wide">Study Assistant</h3>
                                <p className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={exportChat}
                                title="Export Chat to PDF"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-hover)] hover:bg-[var(--skeleton)] transition-all duration-300 text-[var(--text-muted)] hover:text-primary"
                            >
                                <Download size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-hover)] hover:bg-[var(--skeleton)] hover:rotate-90 transition-all duration-300 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth">
                        {messages.map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={clsx(
                                        "flex gap-3 max-w-[90%]",
                                        isUser ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                                        isUser ? "bg-[var(--skeleton)] border border-[var(--border)]" : "bg-gradient-to-tr from-purple-600 to-blue-600"
                                    )}>
                                        {isUser ? (
                                            <span className="text-xs font-bold text-[var(--text-secondary)]">
                                                {user?.username?.[0]?.toUpperCase() || <UserIcon size={14} />}
                                            </span>
                                        ) : (
                                            <Bot size={16} className="text-white" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className={clsx(
                                        "p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-xl backdrop-blur-sm border",
                                        isUser
                                            ? "bg-primary/20 text-[var(--text-primary)] rounded-tr-sm border-primary/10"
                                            : "bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-tl-sm border-[var(--border)]"
                                    )}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-10 w-16">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[var(--bg-surface)]/90 border-t border-[var(--border)] backdrop-blur-xl">
                        <form onSubmit={handleSend} className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Ask ${user?.username || 'me'} anything...`}
                                className="w-full bg-[var(--input-bg)] border border-[var(--border)] group-hover:border-[var(--text-muted)] rounded-2xl py-4 pl-5 pr-14 text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-[var(--text-muted)] shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                <Send size={18} className={loading ? 'opacity-0' : 'ml-0.5'} />
                                {loading && <div className="absolute inset-0 m-auto w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            </button>
                        </form>
                        <p className="text-[10px] text-center text-[var(--text-muted)] mt-2">
                            AI can make mistakes. Check important info.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GrokChat;
