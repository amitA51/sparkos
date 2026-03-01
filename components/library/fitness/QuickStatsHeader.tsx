import React from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { DumbbellIcon, FlameIcon } from '../../icons';

// Weekly volume target settings
const WEEKLY_VOLUME_TARGET = 50000;

export const QuickStatsHeader: React.FC = () => {
    const { currentStreak, workoutsThisMonth, workoutsThisWeek, workoutSessions } = useFitnessInsights();

    // Volume calculation
    const weeklyVolume = React.useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return workoutSessions
            .filter(s => s.endTime && new Date(s.startTime) >= weekAgo)
            .reduce((total, session) => {
                return total + session.exercises.reduce((sessionTotal, ex) => {
                    return sessionTotal + ex.sets
                        .filter(s => s.completedAt && s.weight && s.reps)
                        .reduce((setTotal, set) => setTotal + (set.weight! * set.reps!), 0);
                }, 0);
            }, 0);
    }, [workoutSessions]);

    const volumeProgress = Math.min((weeklyVolume / WEEKLY_VOLUME_TARGET) * 100, 100);
    const volumePercentText = Math.round(volumeProgress);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1C1C1E] rounded-[24px] p-4 md:p-6 shadow-sm"
        >
            <div className="grid grid-cols-3 gap-4 divide-x divide-[#3A3A3C] divide-x-reverse">

                {/* 1. Streak */}
                <div className="flex flex-col items-center justify-center col-span-1 pr-2">
                    <div className="text-4xl font-black text-white tracking-tight flex items-center gap-1.5">
                        {currentStreak}
                        <FlameIcon className="w-6 h-6 text-[#FF9500]" />
                    </div>
                    <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide mt-1">
                        ימי רצף
                    </div>
                </div>

                {/* 2. Monthly Stats */}
                <div className="flex flex-col items-center justify-center col-span-1 px-2 border-r border-[#3A3A3C]">
                    <div className="text-3xl font-black text-white tracking-tight">
                        {workoutsThisMonth}
                    </div>
                    <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wide mt-1 flex items-center gap-1">
                        <DumbbellIcon className="w-3 h-3" />
                        החודש
                    </div>
                </div>

                {/* 3. Weekly Volume */}
                <div className="flex flex-col items-center justify-center col-span-1 pl-2">
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                        {/* Background Ring */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#2C2C2E"
                                strokeWidth="4"
                            />
                            {/* Progress Ring */}
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: volumeProgress / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={volumeProgress >= 100 ? "var(--dynamic-accent-start)" : "var(--dynamic-accent-start)"}
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                            {volumePercentText}%
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wide text-center">
                        יעד נפח
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Weekly Count */}
            <div className="mt-5 pt-4 border-t border-[#3A3A3C] flex items-center justify-between">
                <div className="text-xs text-[#8E8E93] font-medium">
                    שבוע נוכחי
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex space-x-1.5 space-x-reverse">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < workoutsThisWeek ? 'bg-[var(--dynamic-accent-start)]' : 'bg-[#2C2C2E]'}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-white/60 font-mono">
                        {workoutsThisWeek}/5
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
