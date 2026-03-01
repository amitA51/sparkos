import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { TrendingUpIcon } from '../../icons';

export const PRMarkee: React.FC = () => {
    const { recentPRs, allPRs } = useFitnessInsights();
    const displayPRs = recentPRs.length > 0 ? recentPRs : allPRs.slice(0, 5);

    if (displayPRs.length === 0) return null;

    return (
        <div className="overflow-visible">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                    <span className="text-2xl">🏆</span> שיאים אישיים
                </h3>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 scrollbar-hide snap-x pt-2">
                {displayPRs.map((pr, index) => {
                    const isRecent = recentPRs.includes(pr);

                    return (
                        <motion.div
                            key={`${pr.exerciseName}-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex-shrink-0 snap-center w-[160px] h-[200px] rounded-[24px] relative bg-[#1C1C1E] shadow-sm flex flex-col justify-between p-4 border border-white/5`}
                        >
                            {/* Top Badge */}
                            <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${isRecent ? 'bg-[#FFD60A]/10 text-[#FFD60A]' : 'bg-[#2C2C2E] text-[#8E8E93]'
                                    }`}>
                                    {isRecent ? 'NEW' : 'RECORD'}
                                </span>
                            </div>

                            {/* Main Number */}
                            <div className="flex flex-col items-center justify-center flex-1">
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-white tracking-tight">
                                        {pr.maxWeight}
                                    </span>
                                    <span className="text-xs font-bold text-[#8E8E93] mb-1.5">KG</span>
                                </div>
                                <div className="text-xs font-medium text-[#8E8E93] mt-1">
                                    {pr.maxReps} reps
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-3 border-t border-[#2C2C2E] text-center">
                                <div className="text-xs font-bold text-white truncate px-1">
                                    {pr.exerciseName}
                                </div>
                                {isRecent && (
                                    <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold text-[var(--dynamic-accent-start)]">
                                        <TrendingUpIcon className="w-3 h-3" />
                                        שיפור!
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
