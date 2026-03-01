import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MeditationModal from '../meditation/MeditationModal';

/**
 * MeditationWidget - Compact widget for quick access to meditation
 * Shows quick start buttons and opens full meditation modal
 */
export const MeditationWidget: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

    const quickDurations = [
        { mins: 5, emoji: '🌱', label: 'מהיר' },
        { mins: 10, emoji: '🧘', label: 'קלאסי' },
        { mins: 20, emoji: '🌟', label: 'עמוק' },
    ];

    const handleStart = (minutes: number) => {
        setSelectedDuration(minutes);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🧘</span>
                        <h3 className="text-lg font-semibold text-white">מדיטציה</h3>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs text-violet-300 hover:text-violet-200 transition-colors"
                    >
                        אפשרויות נוספות →
                    </button>
                </div>

                <p className="text-sm text-theme-secondary mb-4">
                    קח רגע לנשום ולהתמקד
                </p>

                <div className="flex gap-2">
                    {quickDurations.map(({ mins, emoji, label }) => (
                        <button
                            key={mins}
                            onClick={() => handleStart(mins)}
                            className="flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 group"
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{emoji}</span>
                            <span className="text-lg font-medium text-white">{mins}</span>
                            <span className="text-xs text-theme-muted">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <MeditationModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedDuration(null);
                        }}
                        initialDuration={selectedDuration || 10}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MeditationWidget;
