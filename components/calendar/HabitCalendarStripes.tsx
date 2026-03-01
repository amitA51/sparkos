/**
 * HabitCalendarStripes
 * 
 * Displays colored stripes for completed habits on a specific calendar day.
 * Shows max 5 stripes with +N indicator for overflow.
 * Enhanced with tooltips and better visual feedback.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_VISIBLE_STRIPES = 5;

interface HabitCalendarStripesProps {
    /** IDs of habits completed on this day */
    completedHabitIds: string[];
    /** Map of habit ID to color */
    habitColorMap: Record<string, string>;
    /** Map of habit ID to title (for tooltips) */
    habitTitleMap: Record<string, string>;
    /** Optional: compact mode for smaller cells */
    compact?: boolean;
}

const HabitCalendarStripes: React.FC<HabitCalendarStripesProps> = ({
    completedHabitIds,
    habitColorMap,
    habitTitleMap,
    compact = false,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (completedHabitIds.length === 0) return null;

    const visibleHabits = completedHabitIds.slice(0, MAX_VISIBLE_STRIPES);
    const overflow = completedHabitIds.length - MAX_VISIBLE_STRIPES;
    const stripeHeight = compact ? 2 : 3;

    return (
        <div className="relative">
            <motion.div
                className="flex flex-col gap-[2px] w-full mb-1 cursor-pointer"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
            >
                {visibleHabits.map((habitId, index) => (
                    <motion.div
                        key={habitId}
                        className="rounded-full"
                        style={{
                            height: stripeHeight,
                            backgroundColor: habitColorMap[habitId] || '#6B7280',
                            boxShadow: `0 0 4px ${(habitColorMap[habitId] || '#6B7280')}40`
                        }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 0.2,
                            delay: index * 0.05,
                            ease: 'easeOut'
                        }}
                    />
                ))}
                {overflow > 0 && (
                    <div
                        className="rounded-full bg-gray-500/40 flex items-center justify-center"
                        style={{ height: stripeHeight }}
                    >
                        <span className="text-[6px] text-theme-secondary font-bold leading-none">
                            +{overflow}
                        </span>
                    </div>
                )}
            </motion.div>

            {/* Enhanced Tooltip */}
            <AnimatePresence>
                {showTooltip && completedHabitIds.length > 0 && (
                    <motion.div
                        className="absolute z-50 left-0 right-0 top-full mt-1 p-2 rounded-lg 
                       bg-[var(--bg-primary)] border border-white/10 shadow-xl"
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="text-[10px] font-semibold text-[var(--text-secondary)] mb-1.5">
                            ✅ הושלמו ({completedHabitIds.length})
                        </div>
                        <div className="space-y-1">
                            {completedHabitIds.map(habitId => (
                                <div key={habitId} className="flex items-center gap-1.5">
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: habitColorMap[habitId] }}
                                    />
                                    <span className="text-[10px] text-white truncate">
                                        {habitTitleMap[habitId]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(HabitCalendarStripes);
