/**
 * HabitCalendarLegend
 * 
 * Displays a legend showing habit names with their assigned colors.
 * Enhanced with streak counts and collapsible design.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PersonalItem } from '../../types';
import { ChevronDownIcon, FlameIcon } from '../icons';

interface HabitCalendarLegendProps {
    /** All habit items */
    habits: PersonalItem[];
    /** Map of habit ID to color */
    habitColorMap: Record<string, string>;
    /** Optional: show streak counts */
    showStreaks?: boolean;
    /** Optional: collapsed by default */
    defaultCollapsed?: boolean;
}

const HabitCalendarLegend: React.FC<HabitCalendarLegendProps> = ({
    habits,
    habitColorMap,
    showStreaks = true,
    defaultCollapsed = false,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    // Sort habits by streak (highest first)
    const sortedHabits = useMemo(() => {
        return [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0));
    }, [habits]);

    if (habits.length === 0) return null;

    return (
        <motion.div
            className="mt-4 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header - Clickable to toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                        מקרא הרגלים
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-[var(--text-secondary)]">
                        {habits.length}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDownIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {sortedHabits.map((habit, index) => (
                                <motion.div
                                    key={habit.id}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor: habitColorMap[habit.id],
                                            boxShadow: `0 0 6px ${habitColorMap[habit.id]}50`
                                        }}
                                    />
                                    <span className="text-xs text-[var(--text-primary)] truncate flex-1">
                                        {habit.title || 'הרגל'}
                                    </span>
                                    {showStreaks && (habit.streak || 0) > 0 && (
                                        <div className="flex items-center gap-0.5 text-orange-400">
                                            <FlameIcon className="w-3 h-3" />
                                            <span className="text-[10px] font-bold">{habit.streak}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default React.memo(HabitCalendarLegend);
