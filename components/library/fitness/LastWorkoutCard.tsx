import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { PlayIcon, DumbbellIcon } from '../../icons';
import { format } from 'date-fns';
import { triggerHaptic } from '../../../src/utils/haptics';


interface LastWorkoutCardProps {
    onStartWorkout: () => void;
}

export const LastWorkoutCard: React.FC<LastWorkoutCardProps> = ({ onStartWorkout }) => {
    const { lastWorkout } = useFitnessInsights();

    if (!lastWorkout) {
        return (
            <div className="p-4 md:p-6 rounded-[24px] bg-[#1C1C1E] text-center shadow-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#2C2C2E] flex items-center justify-center mb-2">
                        <DumbbellIcon className="w-8 h-8 text-[#8E8E93]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">התחל את המסע שלך</h3>
                        <p className="text-[#8E8E93] text-sm leading-relaxed max-w-[240px] mx-auto">
                            האימון הראשון הוא תמיד הכי קשה. צור היסטוריה היום.
                        </p>
                    </div>
                    <button
                        onClick={() => { triggerHaptic('medium'); onStartWorkout(); }}
                        className="mt-2 px-8 py-3.5 bg-[var(--dynamic-accent-start)] rounded-full font-bold text-black shadow-lg shadow-[var(--dynamic-accent-start)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <PlayIcon className="w-5 h-5" />
                        התחל אימון ראשון
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
        >
            <div className="relative rounded-[24px] bg-[#1C1C1E] p-4 md:p-6 shadow-sm overflow-hidden">
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-[#2C2C2E] rounded-full text-[11px] font-bold text-[var(--dynamic-accent-start)] tracking-wide border border-[var(--dynamic-accent-start)]/20 uppercase">
                                    האימון האחרון שלך
                                </span>
                                <span className="text-xs text-[#8E8E93] font-mono">
                                    {format(new Date(lastWorkout.date), 'dd/MM/yy')}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-white leading-tight">
                                {lastWorkout.mainMuscleGroups.length > 0
                                    ? lastWorkout.mainMuscleGroups.join(' + ')
                                    : 'אימון כללי'}
                            </h3>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {/* Duration */}
                        <div className="p-3 rounded-2xl bg-[#2C2C2E]">
                            <div className="text-[10px] text-[#8E8E93] mb-1 font-bold uppercase">⏱️ משך</div>
                            <div className="text-lg font-black text-white">
                                {lastWorkout.durationMinutes}<span className="text-xs font-normal text-[#8E8E93] ml-1">דק׳</span>
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="p-3 rounded-2xl bg-[#2C2C2E]">
                            <div className="text-[10px] text-[#8E8E93] mb-1 font-bold uppercase">📊 נפח</div>
                            <div className="text-lg font-black text-white">
                                {(lastWorkout.totalVolume / 1000).toFixed(1)}<span className="text-xs font-normal text-[#8E8E93] ml-1">k</span>
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="p-3 rounded-2xl bg-[#2C2C2E]">
                            <div className="text-[10px] text-[#8E8E93] mb-1 font-bold uppercase">💪 תרגילים</div>
                            <div className="text-lg font-black text-white">
                                {lastWorkout.exerciseCount}
                            </div>
                        </div>
                    </div>

                    {/* PR Badge if exists */}
                    {lastWorkout.prCount > 0 && (
                        <div className="absolute top-6 left-6">
                            <div className="bg-[#FF9500]/10 text-[#FF9500] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#FF9500]/20 flex items-center gap-1.5">
                                <span className="text-sm">🏆</span>
                                {lastWorkout.prCount} שיאים!
                            </div>
                        </div>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={() => { triggerHaptic('medium'); onStartWorkout(); }}
                        className="w-full py-4 rounded-xl bg-[var(--dynamic-accent-start)] text-black font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-[var(--dynamic-accent-start)]/10"
                    >
                        <PlayIcon className="w-5 h-5 fill-black" />
                        חזור על אימון זה
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
