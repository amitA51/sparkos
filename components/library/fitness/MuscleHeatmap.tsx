import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { AlertTriangleIcon } from '../../icons';

export const MuscleHeatmap = React.memo(() => {
    const { muscleGroups: muscleGroupStats, neglectedMuscles } = useFitnessInsights();

    // Map intensity to solid Apple-style colors
    const getIntensityColor = (daysSince: number) => {
        if (daysSince <= 2) return 'bg-[#FF3B30]'; // Red (Hot/Recent)
        if (daysSince <= 4) return 'bg-[#FF9500]'; // Orange
        if (daysSince <= 7) return 'bg-[#FFD60A]'; // Yellow
        if (daysSince <= 14) return 'bg-[#0A84FF]'; // Blue
        return 'bg-[#8E8E93]'; // Gray (Inactive)
    };

    return (
        <div className="bg-[#1C1C1E] rounded-[24px] p-4 md:p-6 relative overflow-hidden shadow-sm h-full">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                <span>🔥</span> מפת חום שרירים
            </h3>

            {/* Alert for Neglected Muscles */}
            {neglectedMuscles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 relative"
                >
                    <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl p-4 flex items-start gap-3">
                        <div className="bg-[#FF3B30]/20 p-2 rounded-full">
                            <AlertTriangleIcon className="w-4 h-4 text-[#FF3B30]" />
                        </div>
                        <div>
                            <div className="text-[#FF3B30] font-bold text-sm mb-1">
                                תשומת לב נדרשת
                            </div>
                            <div className="text-[#FF3B30]/80 text-xs leading-relaxed">
                                לא אימנת את <span className="font-bold underline">{neglectedMuscles.join(', ')}</span> כבר למעלה משבועיים.
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Muscle Grid - Clean */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                {muscleGroupStats.map((stat: { muscleGroup: string; daysSince: number | null }, index: number) => (
                    <motion.div
                        key={stat.muscleGroup}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-[#2C2C2E] rounded-xl p-3 flex items-center justify-between hover:bg-[#3A3A3C] transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{stat.muscleGroup}</span>
                            <span className="text-[10px] text-[#8E8E93]">{stat.daysSince !== null ? `${stat.daysSince} ימים` : 'לא ידוע'}</span>
                        </div>

                        {/* Status Indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full ${getIntensityColor(stat.daysSince ?? 999)}`} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
});
