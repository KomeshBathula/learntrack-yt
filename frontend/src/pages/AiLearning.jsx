import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AiSkeleton from '../components/AiSkeleton';
import VideoInput from '../components/ai/VideoInput';
import SummaryView from '../components/ai/SummaryView';
import QuestionView from '../components/ai/QuestionView';
import ClarificationView from '../components/ai/ClarificationView';
import api from '../utils/api';

const AiLearning = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('summary');
    const [error, setError] = useState(null);

    const handleProcess = async (payload) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.post('/api/ai-studio/process', payload);
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to process video. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${activeTab === id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] p-4 pb-24 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2 pt-4 md:pt-8">
                    <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight leading-tight">
                        Smart Summary
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-xs md:max-w-2xl mx-auto">Transform any YouTube video into a personalized study guide</p>
                </div>

                {/* Input Section */}
                <VideoInput onProcess={handleProcess} loading={loading} />

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {loading && <AiSkeleton />}

                {/* Results Section */}
                {!loading && data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <TabButton id="summary" label="Smart Summary" />
                            <TabButton id="questions" label="Quiz & Practice" />
                            <TabButton id="clarifications" label="Concept Clarity" />
                        </div>

                        {/* Content Area */}
                        <div className="min-h-[400px]">
                            {activeTab === 'summary' && <SummaryView summary={data.summary} videoTitle={data.videoTitle || data.title} />}
                            {activeTab === 'questions' && <QuestionView questions={data.questions} />}
                            {activeTab === 'clarifications' && <ClarificationView clarifications={data.clarifications} />}
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default AiLearning;
