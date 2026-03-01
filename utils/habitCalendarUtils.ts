/**
 * Habit Calendar Utilities
 * 
 * Provides deterministic color assignment and performance-optimized
 * completion indexing for the habit calendar visualization.
 */

import type { PersonalItem } from '../types';

// Premium color palette for habits - carefully selected for contrast and aesthetics
export const HABIT_COLORS = [
    '#A78BFA', // Purple (Violet)
    '#38BDF8', // Sky Blue  
    '#10B981', // Emerald (Green)
    '#F59E0B', // Amber (Orange/Yellow)
    '#EF4444', // Red
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange (additional)
    '#84CC16', // Lime (additional)
    '#8B5CF6', // Violet (additional)
    '#06B6D4', // Cyan (additional)
];

/**
 * Hash-based color assignment - deterministic color per habit ID.
 * Same habit ID always returns the same color.
 * Uses djb2 hash algorithm for better distribution.
 */
export const getHabitColor = (habitId: string): string => {
    // djb2 hash algorithm - better distribution than simple char code sum
    let hash = 5381;
    for (let i = 0; i < habitId.length; i++) {
        hash = ((hash << 5) + hash) + habitId.charCodeAt(i);
    }
    return HABIT_COLORS[Math.abs(hash) % HABIT_COLORS.length] ?? '#6B7280';
};

/**
 * Build a color map for all habits.
 * Returns Record<habitId, color>
 */
export const buildHabitColorMap = (habits: PersonalItem[]): Record<string, string> => {
    const map: Record<string, string> = {};
    habits.forEach(habit => {
        map[habit.id] = getHabitColor(habit.id);
    });
    return map;
};

/**
 * Build completions index - one-time build for fast lookup.
 * Returns Record<dateKey, habitId[]>
 * 
 * Performance: O(n*m) where n = habits, m = avg completions per habit
 * Lookup after build: O(1)
 */
export const buildCompletionsIndex = (habits: PersonalItem[]): Record<string, string[]> => {
    const index: Record<string, string[]> = {};

    habits.forEach(habit => {
        habit.completionHistory?.forEach(entry => {
            // Extract YYYY-MM-DD from the date string (handles both ISO and date-only formats)
            let dateKey: string;
            if (typeof entry.date === 'string') {
                dateKey = entry.date.substring(0, 10);
            } else {
                // Handle Date object or timestamp
                const date = new Date(entry.date);
                dateKey = date.toISOString().substring(0, 10);
            }

            if (!index[dateKey]) {
                index[dateKey] = [];
            }
            // Prevent duplicates (same habit completed multiple times same day)
            const habitIds = index[dateKey]!;
            if (!habitIds.includes(habit.id)) {
                habitIds.push(habit.id);
            }
        });
    });

    return index;
};

/**
 * Build habit title map for tooltips.
 * Returns Record<habitId, title>
 */
export const buildHabitTitleMap = (habits: PersonalItem[]): Record<string, string> => {
    const map: Record<string, string> = {};
    habits.forEach(habit => {
        map[habit.id] = habit.title || 'הרגל ללא שם';
    });
    return map;
};

/**
 * Get completion stats for a date range.
 * Useful for summary widgets.
 */
export const getCompletionStats = (
    completionsIndex: Record<string, string[]>,
    startDate: Date,
    endDate: Date
): { totalCompletions: number; daysWithCompletions: number; avgPerDay: number } => {
    let totalCompletions = 0;
    let daysWithCompletions = 0;

    const current = new Date(startDate);
    while (current <= endDate) {
        const dateKey = current.toISOString().substring(0, 10);
        const completions = completionsIndex[dateKey];
        if (completions && completions.length > 0) {
            totalCompletions += completions.length;
            daysWithCompletions++;
        }
        current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const avgPerDay = totalDays > 0 ? totalCompletions / totalDays : 0;

    return { totalCompletions, daysWithCompletions, avgPerDay };
};
