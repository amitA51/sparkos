import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/fitness/useFitnessInsights';
import { AlertTriangleIcon } from '../../icons';

export const MuscleHeatmap = React.memo(() => {
    const { muscleGroups: muscleGroupStats, neglectedMuscles } = useFitnessInsights();

    // Map intensity to theme-aware colors using CSS variables
    const getIntensityColor = (daysSince: number) => {
        if (daysSince <= 2) return 'bg-fitness-hot';      // Red (Hot/Recent)
        if (daysSince <= 4) return 'bg-fitness-warm';     // Orange
        if (daysSince <= 7) return 'bg-fitness-good';    // Yellow
        if (daysSince <= 14) return 'bg-fitness-moderate'; // Blue
        return 'bg-fitness-inactive';                     // Gray (Inactive)
    };

    return (
        <div className="bg-bg-secondary rounded-2xl p-4 md:p-6 relative overflow-hidden shadow-sm h-full border border-border-subtle">
            <h3 className="text-text-primary font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
                <span>🔥</span> מפת חום שרירים
            </h3>

            {/* Alert for Neglected Muscles */}
            {neglectedMuscles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 relative"
                >
                    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-start gap-3">
                        <div className="bg-error/20 p-2 rounded-full">
                            <AlertTriangleIcon className="w-4 h-4 text-error" />
                        </div>
                        <div>
                            <div className="text-error font-bold text-sm mb-1">
                                תשומת לב נדרשת
                            </div>
                            <div className="text-error/80 text-xs leading-relaxed">
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
                        className="bg-bg-tertiary rounded-xl p-3 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-primary">{stat.muscleGroup}</span>
                            <span className="text-[10px] text-text-muted">{stat.daysSince !== null ? `${stat.daysSince} ימים` : 'לא ידוע'}</span>
                        </div>

                        {/* Status Indicator */}
                        <div className={`w-2.5 h-2.5 rounded-full ${getIntensityColor(stat.daysSince ?? 999)}`} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
});
