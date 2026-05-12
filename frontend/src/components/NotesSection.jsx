import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, FileText, Clock, Eye, Edit2, PlayCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useBlocker } from 'react-router-dom';
import api from '../utils/api';

const NotesSection = ({ playlistId, videoId, videoTitle, isDirty, setIsDirty, player }) => {
    const [note, setNote] = useState('');
    const [isViewMode, setIsViewMode] = useState(false);
    const textareaRef = useRef(null);

    // Reset notes when changing video
    useEffect(() => {
        const fetchSavedNote = async () => {
            try {
                const res = await api.get(`/api/notes/${playlistId}/${videoId}`);
                setNote(res.data.content || '');
                if (setIsDirty) setIsDirty(false);
            } catch (error) {
                console.error('Failed to load note', error);
                setNote('');
                if (setIsDirty) setIsDirty(false);
            }
        };
        fetchSavedNote();
    }, [playlistId, videoId, setIsDirty]);

    // Handle browser close/refresh
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Handle in-app navigation blocking (Router only)
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            const stay = window.confirm("You have unsaved notes! Click OK to stay and download them. Click Cancel to discard and leave.");
            if (stay) {
                blocker.reset();
            } else {
                blocker.proceed();
            }
        }
    }, [blocker]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(16);
        doc.text(videoTitle || "Learning Notes", 10, 10);

        // Add Content (wrapped)
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(note, 180);
        doc.text(splitText, 10, 20);

        // Sanitize filename
        const safeTitle = (videoTitle || `notes-${videoId}`).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`${safeTitle}.pdf`);
        if (setIsDirty) setIsDirty(false);
    };

    const handleChange = (e) => {
        setNote(e.target.value);
        if (setIsDirty) setIsDirty(true);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            let stamp = '\n';
            
            if (player) {
                try {
                    const time = await player.getCurrentTime();
                    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
                    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
                    stamp = `\n[${minutes}:${seconds}] `;
                } catch (err) {
                    console.error("Failed to get timestamp", err);
                }
            }

            const cursorStart = e.target.selectionStart || note.length;
            const cursorEnd = e.target.selectionEnd || note.length;
            const before = note.substring(0, cursorStart);
            const after = note.substring(cursorEnd);
            
            setNote(before + stamp + after);
            if (setIsDirty) setIsDirty(true);
            
            setTimeout(() => {
                if (textareaRef.current) {
                    const newPos = before.length + stamp.length;
                    textareaRef.current.setSelectionRange(newPos, newPos);
                }
            }, 0);
        }
    };

    const handleTimestampClick = (timeString) => {
        if(!player) return;
        const [mins, secs] = timeString.split(':').map(Number);
        player.seekTo(mins * 60 + secs, true);
        player.playVideo();
    };

    const handleSaveNote = async () => {
        try {
            await api.post(`/api/notes/${playlistId}/${videoId}`, { content: note });
            if (setIsDirty) setIsDirty(false);
            // Optionally, show a toast here.
        } catch (e) {
            console.error("Failed to save note:", e);
        }
    };

    const renderParsedNote = () => {
        if (!note) return <div className="text-white/40 italic p-4">No notes yet. Start typing to add some!</div>;
        
        // Match timestamps like [01:23] or [12:34]
        const parts = note.split(/(\[\d{1,3}:\d{2}\])/g);
        
        return (
            <div className="text-white font-mono text-sm leading-relaxed p-4 bg-black/20 rounded-xl border border-white/10 min-h-[200px] whitespace-pre-wrap">
                {parts.map((part, i) => {
                    if (part.match(/^\[\d{1,3}:\d{2}\]$/)) {
                        const timeStr = part.replace(/[\[\]]/g, '');
                        return (
                            <span 
                                key={i} 
                                onClick={() => handleTimestampClick(timeStr)}
                                className="cursor-pointer text-primary hover:underline hover:text-primary-light font-bold mx-1 inline-flex items-center gap-1 bg-primary/10 rounded px-1"
                            >
                                <PlayCircle size={12}/>{part}
                            </span>
                        );
                    }
                    return <span key={i}>{part}</span>;
                })}
            </div>
        );
    };

    return (
        <div className="bg-surface p-6 rounded-2xl border border-white/5 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    My Notes
                </h3>
                <div className="flex items-center gap-4">
                    {isDirty && (
                        <span className="text-xs text-amber-500 font-medium animate-pulse">
                            Unsaved Changes
                        </span>
                    )}
                    <div className="flex bg-black/30 rounded-lg p-1 border border-white/10">
                         <button 
                             className={`px-3 py-1 text-xs rounded font-medium flex items-center gap-1 transition-colors ${!isViewMode ? 'bg-primary text-white shadow' : 'text-white/50 hover:text-white/80'}`}
                             onClick={() => setIsViewMode(false)}
                         >
                             <Edit2 size={14} /> Edit
                         </button>
                         <button 
                             className={`px-3 py-1 text-xs rounded font-medium flex items-center gap-1 transition-colors ${isViewMode ? 'bg-primary text-white shadow' : 'text-white/50 hover:text-white/80'}`}
                             onClick={() => setIsViewMode(true)}
                         >
                             <Eye size={14} /> View
                         </button>
                    </div>
                </div>
            </div>

            <div className="relative">
                {isViewMode ? (
                    renderParsedNote()
                ) : (
                    <textarea
                        ref={textareaRef}
                        className="w-full bg-black/20 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-primary/50 min-h-[200px] resize-y font-mono text-sm leading-relaxed"
                        placeholder="Write your key takeaways here... Press Enter to automatically add a new timestamp."
                        value={note}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                )}
            </div>

            <div className="flex justify-end items-center mt-4">
                <div className="flex gap-2">
                     <button
                        onClick={handleSaveNote}
                        disabled={!isDirty}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                     >
                        <Save size={16} />
                        Save Notes
                     </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={!note.trim()}
                        className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        <Download size={16} />
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesSection;
