import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { clsx } from 'clsx';

const GrokChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI learning assistant. How can I help you with your studies today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Contextualize with previous messages (last 10 to clear context if needed)
            const recentMessages = [...messages.slice(-10), userMsg].map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data } = await api.post('/api/ai/chat', { messages: recentMessages });
            setMessages(prev => [...prev, data]);
        } catch (error) {
            console.error(error);
            const serverError = error.response?.data?.message || error.message;
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${serverError}. Please try again later.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 w-[92vw] md:w-[400px] h-[60vh] md:h-[500px] bg-surface/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <Bot size={18} className="text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Study Assistant</h3>
                                <p className="text-xs text-zinc-400">Powered by Groq</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={clsx(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === 'user' ? "bg-zinc-700" : "bg-white"
                                )}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-black" />}
                                </div>
                                <div className={clsx(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-zinc-800 text-white rounded-tr-sm"
                                        : "bg-white/10 text-zinc-100 rounded-tl-sm"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-black" />
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GrokChat;
