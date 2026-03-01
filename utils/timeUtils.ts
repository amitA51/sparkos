/**
 * Time Utilities
 * 
 * Centralized time formatting utilities to replace duplicated
 * time formatting implementations across the codebase.
 */

/**
 * Format seconds to MM:SS or H:MM:SS (auto-detects if hours needed)
 * @param seconds - Total seconds to format
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Format seconds to MM:SS (always shows minutes, never hours)
 * Use this for short timers like rest periods
 * @param seconds - Total seconds to format
 * @returns Formatted time string in MM:SS format
 */
export const formatTimeShort = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format milliseconds to MM:SS
 * @param ms - Milliseconds to format
 * @returns Formatted time string
 */
export const formatTimeFromMs = (ms: number): string => {
    if (!ms || isNaN(ms)) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format a timestamp to relative time (e.g., "2 min ago", "1 hour ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Relative time string
 */
export const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    if (seconds > 10) return `${seconds} sec ago`;
    return 'just now';
};

/**
 * Format a time string (HH:MM) to 12-hour format with AM/PM
 * @param time - Time string in "HH:MM" format
 * @returns Formatted time string like "2:30 PM" or null if invalid
 */
export const formatTimeString = (time?: string): string | null => {
    if (!time) return null;
    const parts = time.split(':');
    if (parts.length < 2 || !parts[0] || !parts[1]) return null;

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) return null;

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Format duration in minutes to readable Hebrew string
 * @param minutes - Duration in minutes
 * @returns Hebrew formatted duration string
 */
export const formatDurationKey = (minutes: number): string => {
    if (minutes < 60) return `${minutes} דק'`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} ש' ${m} דק'` : `${h} שעות`;
};

/**
 * Format duration in seconds to readable string (e.g., "5 min", "1h 30m")
 * @param seconds - Duration in seconds
 * @returns English formatted duration string
 */
export const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0 min';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes} min`;
};
