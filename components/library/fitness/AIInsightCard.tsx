import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { SparklesIcon, RefreshIcon } from '../../icons';
import { triggerHaptic } from '../../../src/utils/haptics';

export const AIInsightCard: React.FC = () => {
    const { aiInsight, aiInsightLoading, generateAIInsight, workoutSessions } = useFitnessInsights();

    if (workoutSessions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
        >
            <div className="bg-[#1C1C1E] rounded-[24px] p-4 md:p-6 relative overflow-hidden shadow-sm h-full border border-[var(--dynamic-accent-start)]/10">

                {/* Subtle Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--dynamic-accent-start)]/5 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-[var(--dynamic-accent-start)]" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg flex items-center gap-2 relative z-10">
                                    <span className="text-[var(--dynamic-accent-start)]">✨</span> תובנות AI
                                </h3>
                                <p className="text-[10px] text-[#8E8E93] font-medium tracking-wide mt-1 uppercase">Powered by Gemini 2.0</p>
                            </div>
                        </div>

                        <button
                            onClick={() => { triggerHaptic('light'); generateAIInsight(); }}
                            disabled={aiInsightLoading}
                            className="bg-[#2C2C2E] hover:bg-[#3A3A3C] p-2 rounded-full transition-colors active:scale-95 disabled:opacity-50 text-white/50 hover:text-white"
                        >
                            <RefreshIcon className={`w-4 h-4 ${aiInsightLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="min-h-[60px] flex items-center">
                        <AnimatePresence mode="wait">
                            {aiInsightLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full"
                                >
                                    <div className="flex gap-1 justify-center items-center h-full py-4">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-2 h-2 rounded-full bg-[var(--dynamic-accent-start)]"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-2 h-2 rounded-full bg-[var(--dynamic-accent-start)]"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-2 h-2 rounded-full bg-[var(--dynamic-accent-start)]"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-[#8E8E93]">מעבד נתונים...</p>
                                </motion.div>
                            ) : aiInsight ? (
                                <motion.div
                                    key="insight"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#2C2C2E] rounded-xl p-4 w-full relative border border-[var(--dynamic-accent-start)]/10"
                                >
                                    <p className="text-white/90 text-sm leading-relaxed text-right font-medium">
                                        {aiInsight}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full text-center py-2"
                                >
                                    <p className="text-sm text-[#8E8E93] mb-3">
                                        יש לי כמה תובנות מעניינות על האימון האחרון שלך...
                                    </p>
                                    <button
                                        onClick={() => { triggerHaptic('medium'); generateAIInsight(); }}
                                        className="text-xs font-bold text-[var(--dynamic-accent-start)] hover:underline transition-all"
                                    >
                                        לחץ כאן כדי לשמוע
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
