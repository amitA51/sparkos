/**
 * HabitWeekProgress Component
 * Shows weekly habit completion progress based on weeklyGoalDays setting
 */

import React, { useMemo } from 'react';
import { useSettings } from '../src/contexts/SettingsContext';
import { useData } from '../src/contexts/DataContext';

interface HabitWeekProgressProps {
    className?: string;
}

const HabitWeekProgress: React.FC<HabitWeekProgressProps> = ({ className = '' }) => {
    const { settings } = useSettings();
    const { personalItems } = useData();

    const weeklyGoal = settings.habitsSettings?.weeklyGoalDays || 5;

    const { daysCompleted, progress, dayLabels } = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now);
        // Start from Sunday
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const habits = personalItems.filter(item => item.type === 'habit' && item.habitType !== 'bad');

        // Check each day of the week
        const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
        const completedDays: boolean[] = [];

        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(startOfWeek);
            checkDate.setDate(startOfWeek.getDate() + i);
            const dateStr = checkDate.toISOString().split('T')[0];

            // Check if any habit was completed on this day
            const anyHabitCompleted = habits.some(habit => {
                if (!habit.completedDates || !dateStr) return false;
                return habit.completedDates.includes(dateStr);
            });

            completedDays.push(anyHabitCompleted);
        }

        const completed = completedDays.filter(Boolean).length;
        const progressPercent = Math.min((completed / weeklyGoal) * 100, 100);

        return {
            daysCompleted: completed,
            progress: progressPercent,
            dayLabels: days.map((label, i) => ({
                label,
                completed: completedDays[i],
                isToday: i === now.getDay(),
                isFuture: i > now.getDay(),
            })),
        };
    }, [personalItems, weeklyGoal]);

    if (personalItems.filter(item => item.type === 'habit').length === 0) {
        return null;
    }

    return (
        <div className={`bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04] ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">התקדמות שבועית</span>
                <span className="text-xs text-white/40">
                    {daysCompleted}/{weeklyGoal} ימים
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Day Indicators */}
            <div className="flex justify-between">
                {dayLabels.map((day, i) => (
                    <div
                        key={i}
                        className={`flex flex-col items-center gap-1 ${day.isFuture ? 'opacity-40' : ''}`}
                    >
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${day.completed
                                ? 'bg-emerald-500/80 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                : day.isToday
                                    ? 'bg-white/10 text-white/80 ring-1 ring-white/20'
                                    : 'bg-white/[0.03] text-white/30'
                                }`}
                        >
                            {day.completed ? '✓' : day.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Motivation Text */}
            {daysCompleted >= weeklyGoal && (
                <div className="mt-3 text-center text-xs text-emerald-400 font-medium">
                    🎉 השגת את היעד השבועי!
                </div>
            )}
        </div>
    );
};

export default React.memo(HabitWeekProgress);
