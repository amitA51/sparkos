/**
 * ═══════════════════════════════════════════════════════════════
 * THEME UTILS - Visual Configuration for SparkOS Item Types
 * ═══════════════════════════════════════════════════════════════
 * 
 * Maps backend types to frontend visuals including:
 * - Lucide-React icon names
 * - Tailwind badge colors (background + text)
 * - Hebrew labels
 */

import type { SparkItemType, SparkItemPriority } from '@/types/SparkItemTypes';

// ═══════════════════════════════════════════════════════════════
// TYPE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface TypeConfig {
    /** Lucide-React icon name */
    icon: string;
    /** Badge background class (Tailwind) */
    bgColor: string;
    /** Badge text color class (Tailwind) */
    textColor: string;
    /** Hebrew label for display */
    label: string;
}

/**
 * TYPE_CONFIG - Maps SparkItemType to visual styling
 * 
 * Color palette designed for premium, modern UI:
 * - Task: Vibrant blue (productivity)
 * - Event: Warm amber (calendar/time)
 * - Learning: Royal purple (knowledge/growth)
 * - Idea: Bright yellow (creativity/lightbulb)
 * - Habit: Emerald green (consistency/health)
 * - Fitness: Coral/salmon (energy/vitality)
 * - Project: Slate/indigo (structure/organization)
 */
export const TYPE_CONFIG: Record<SparkItemType, TypeConfig> = {
    task: {
        icon: 'CheckSquare',
        bgColor: 'bg-sky-100',
        textColor: 'text-sky-700',
        label: 'משימה',
    },
    event: {
        icon: 'CalendarDays',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        label: 'אירוע',
    },
    learning: {
        icon: 'BookOpen',
        bgColor: 'bg-violet-100',
        textColor: 'text-violet-700',
        label: 'למידה',
    },
    idea: {
        icon: 'Lightbulb',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        label: 'רעיון',
    },
    habit: {
        icon: 'Repeat',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        label: 'הרגל',
    },
    fitness: {
        icon: 'Dumbbell',
        bgColor: 'bg-rose-100',
        textColor: 'text-rose-700',
        label: 'כושר',
    },
    project: {
        icon: 'FolderKanban',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-700',
        label: 'פרויקט',
    },
};

// ═══════════════════════════════════════════════════════════════
// PRIORITY CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface PriorityConfig {
    /** Lucide-React icon name */
    icon: string;
    /** Badge background class (Tailwind) */
    bgColor: string;
    /** Badge text color class (Tailwind) */
    textColor: string;
    /** Dot/indicator color for compact displays */
    dotColor: string;
    /** Hebrew label for display */
    label: string;
}

/**
 * PRIORITY_CONFIG - Maps priority levels to traffic-light colors
 * 
 * - High: Red (urgent/critical)
 * - Medium: Amber/Yellow (attention needed)
 * - Low: Green/Gray (relaxed/optional)
 */
export const PRIORITY_CONFIG: Record<SparkItemPriority, PriorityConfig> = {
    high: {
        icon: 'AlertCircle',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        dotColor: 'bg-red-500',
        label: 'גבוהה',
    },
    medium: {
        icon: 'Clock',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        dotColor: 'bg-amber-500',
        label: 'בינונית',
    },
    low: {
        icon: 'Minus',
        bgColor: 'bg-slate-100',
        textColor: 'text-slate-600',
        dotColor: 'bg-slate-400',
        label: 'נמוכה',
    },
};

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get type configuration with fallback for unknown types
 */
export function getTypeConfig(type: SparkItemType): TypeConfig {
    return TYPE_CONFIG[type] ?? TYPE_CONFIG.task;
}

/**
 * Get priority configuration with fallback
 */
export function getPriorityConfig(priority: SparkItemPriority): PriorityConfig {
    return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
}

/**
 * Get combined badge classes for a type
 */
export function getTypeBadgeClasses(type: SparkItemType): string {
    const config = getTypeConfig(type);
    return `${config.bgColor} ${config.textColor}`;
}

/**
 * Get combined badge classes for a priority
 */
export function getPriorityBadgeClasses(priority: SparkItemPriority): string {
    const config = getPriorityConfig(priority);
    return `${config.bgColor} ${config.textColor}`;
}
