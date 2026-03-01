/**
 * ═══════════════════════════════════════════════════════════════
 * SPARK ITEM UTILITIES
 * ═══════════════════════════════════════════════════════════════
 * 
 * Utility functions for working with SparkItems, including
 * conversions, formatting, and compatibility helpers.
 */

import type { SparkItem, SparkItemPriority } from '../types/SparkItemTypes';
import type { PersonalItem, SubTask } from '../types';

// ═══════════════════════════════════════════════════════════════
// DURATION PARSING & FORMATTING
// ═══════════════════════════════════════════════════════════════

/**
 * Parse duration string to minutes
 * @param duration - Duration string like "15m", "2h", "1h30m"
 * @returns Number of minutes, or null if unparseable
 */
export function parseDuration(duration?: string): number | null {
    if (!duration) return null;

    const normalized = duration.toLowerCase().trim();
    let totalMinutes = 0;

    // Match hours (e.g., "2h", "2 hours")
    const hoursMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h(?:ours?)?/);
    if (hoursMatch && hoursMatch[1]) {
        totalMinutes += parseFloat(hoursMatch[1]) * 60;
    }

    // Match minutes (e.g., "15m", "30 min", "45 minutes")
    const minutesMatch = normalized.match(/(\d+)\s*m(?:in(?:utes?)?)?/);
    if (minutesMatch && minutesMatch[1]) {
        totalMinutes += parseInt(minutesMatch[1], 10);
    }

    // If no match found, try parsing as plain number (assume minutes)
    if (totalMinutes === 0) {
        const plainNumber = parseInt(normalized, 10);
        if (!isNaN(plainNumber)) {
            totalMinutes = plainNumber;
        }
    }

    return totalMinutes > 0 ? totalMinutes : null;
}

/**
 * Format duration for display
 * @param duration - Duration string from AI
 * @returns Formatted display string with emoji
 */
export function formatDuration(duration?: string): string {
    if (!duration) return '';

    const minutes = parseDuration(duration);
    if (!minutes) return duration; // Return original if unparseable

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMins = minutes % 60;
        return remainingMins > 0
            ? `⏱️ ${hours}h ${remainingMins}m`
            : `⏱️ ${hours}h`;
    }

    return `⏱️ ${minutes}m`;
}

// ═══════════════════════════════════════════════════════════════
// PRIORITY UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Get priority badge label
 */
export function getPriorityLabel(priority?: SparkItemPriority): string | null {
    switch (priority) {
        case 'high': return 'P1';
        case 'medium': return 'P2';
        case 'low': return 'P3';
        default: return null;
    }
}

/**
 * Get priority CSS classes
 */
export function getPriorityClasses(priority?: SparkItemPriority): string {
    switch (priority) {
        case 'high':
            return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_-4px_rgba(248,113,113,0.3)]';
        case 'medium':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_-4px_rgba(251,191,36,0.3)]';
        case 'low':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_-4px_rgba(96,165,250,0.3)]';
        default:
            return 'bg-white/5 text-white/40 border-white/10';
    }
}

// ═══════════════════════════════════════════════════════════════
// CONVERSION UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Convert SparkItem subtasks (string[]) to PersonalItem SubTask[] format
 */
export function convertSubtasksToSubTaskArray(subtasks?: string[]): SubTask[] {
    if (!subtasks || subtasks.length === 0) return [];

    return subtasks.map((title, index) => ({
        id: `subtask-${Date.now()}-${index}`,
        title,
        isCompleted: false,
    }));
}

/**
 * Convert SparkItem to PersonalItem for backward compatibility
 * This allows using existing PersonalItem components with SparkItem data
 */
export function sparkItemToPersonalItem(spark: SparkItem): Partial<PersonalItem> {
    // Map SparkItem type to PersonalItem type
    const typeMapping: Record<string, PersonalItem['type']> = {
        task: 'task',
        event: 'task', // Events can be treated as tasks with due dates
        learning: 'learning',
        idea: 'idea',
        habit: 'habit',
        fitness: 'workout',
        project: 'goal',
    };

    return {
        id: spark.id,
        title: spark.title,
        content: spark.content,
        type: typeMapping[spark.type] || 'task',
        createdAt: spark.createdAt,
        updatedAt: spark.createdAt,

        // Status mapping
        isCompleted: spark.status === 'done',
        status: spark.status === 'done' ? 'done' :
            spark.status === 'scheduled' ? 'doing' : 'todo',

        // Priority
        priority: spark.priority,

        // Scheduling
        dueDate: spark.scheduling?.dueDate,
        dueTime: spark.scheduling?.time,

        // Subtasks (converted to SubTask[] format)
        subTasks: convertSubtasksToSubTaskArray(spark.subtasks),

        // Tags
        tags: spark.tags,

        // URL for learning items
        url: spark.meta?.url || undefined,
    };
}

// ═══════════════════════════════════════════════════════════════
// METADATA HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Check if item has AI reasoning metadata
 */
export function hasAiReasoning(item: SparkItem | PersonalItem): boolean {
    if ('meta' in item && item.meta) {
        return Boolean((item as SparkItem).meta?.aiReasoning);
    }
    return false;
}

/**
 * Get display-friendly type label
 */
export function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        task: 'משימה',
        event: 'אירוע',
        learning: 'למידה',
        idea: 'רעיון',
        habit: 'הרגל',
        fitness: 'אימון',
        project: 'פרויקט',
    };
    return labels[type] || type;
}

/**
 * Format scheduling info for display
 */
export function formatScheduling(scheduling?: { dueDate?: string; time?: string }): string | null {
    if (!scheduling?.dueDate) return null;

    const date = new Date(scheduling.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateStr: string;
    if (date.toDateString() === today.toDateString()) {
        dateStr = 'היום';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        dateStr = 'מחר';
    } else {
        dateStr = date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
    }

    return scheduling.time ? `${dateStr} | ${scheduling.time}` : dateStr;
}
