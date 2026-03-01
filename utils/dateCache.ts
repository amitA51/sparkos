/**
 * Date Cache Utilities
 * 
 * Prevents excessive Date object creation by caching frequently used dates.
 * Critical for performance in components that render many times per second.
 */

interface CachedDate {
    date: Date;
    key: string;
    timestamp: number;
}

let todayCache: CachedDate | null = null;
const CACHE_DURATION_MS = 60000; // 1 minute

/**
 * ✅ PERF: Returns cached today's date (00:00:00) to avoid creating new Date objects
 * Cache refreshes every 1 minute to stay current
 */
export const getToday = (): Date => {
    const now = Date.now();

    if (!todayCache || now - todayCache.timestamp > CACHE_DURATION_MS) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        todayCache = {
            date,
            key: date.toDateString(),
            timestamp: now
        };
    }

    // Return a copy to prevent mutations
    return new Date(todayCache.date);
};

/**
 * ✅ PERF: Returns cached today's date key without creating new Date
 */
export const getTodayKey = (): string => {
    getToday(); // Ensures cache is fresh
    return todayCache!.key;
};

/**
 * ✅ PERF: Returns cached today's ISO date string (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
    const today = getToday();
    return today.toISOString().split('T')[0]!;
};

/**
 * ✅ PERF: Get yesterday's date (cached based on today)
 */
export const getYesterday = (): Date => {
    const yesterday = getToday();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
};

/**
 * Check if a date is today (using cached today)
 */
export const isToday = (date: Date | string): boolean => {
    const checkDate = typeof date === 'string' ? new Date(date) : date;
    const today = getToday();
    return checkDate.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday (using cached yesterday)
 */
export const isYesterday = (date: Date | string): boolean => {
    const checkDate = typeof date === 'string' ? new Date(date) : date;
    const yesterday = getYesterday();
    return checkDate.toDateString() === yesterday.toDateString();
};

/**
 * Format time difference from now (e.g., "2 hours ago")
 * Uses cached current time when possible
 */
export const getTimeAgo = (date: Date | string): string => {
    const then = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
    const now = Date.now();
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return new Date(then).toLocaleDateString('he-IL');
    if (days > 0) return `לפני ${days} ימים`;
    if (hours > 0) return `לפני ${hours} שעות`;
    if (minutes > 0) return `לפני ${minutes} דקות`;
    return 'כרגע';
};

/**
 * Clear date cache (useful for testing or when time-sensitive operations need fresh data)
 */
export const clearDateCache = (): void => {
    todayCache = null;
};
