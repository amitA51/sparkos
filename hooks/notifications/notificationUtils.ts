import { AppSettings } from '../../types';

/**
 * Check if the current time is within the user's quiet hours.
 * @returns true if notifications should be blocked (quiet hours active)
 */
/**
 * Check if the current time is within the user's quiet hours.
 * @returns true if notifications should be blocked (quiet hours active)
 */
export const isQuietHours = (settings: AppSettings): boolean => {
    // Support new structure with fallback to legacy
    const quietEnabled = settings.notificationsSettings?.quietHoursEnabled ?? settings.quietHoursEnabled;

    if (!quietEnabled) return false;

    const start = settings.notificationsSettings?.quietHoursStart ?? settings.quietHoursStart ?? '22:00';
    const end = settings.notificationsSettings?.quietHoursEnd ?? settings.quietHoursEnd ?? '07:00';

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH = 0, startM = 0] = start.split(':').map(Number);
    const [endH = 0, endM = 0] = end.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (startMinutes > endMinutes) {
        // Quiet hours span midnight
        return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    } else {
        // Normal range (e.g., 14:00 - 16:00)
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
};

/**
 * Check if notifications can be sent (permission + enabled + not quiet hours)
 */
export const canSendNotification = (settings: AppSettings): boolean => {
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission !== 'granted') return false;

    // Check master switch
    const masterEnabled = settings.notificationsSettings?.enabled ?? settings.notificationsEnabled ?? true;
    if (!masterEnabled) return false;

    if (isQuietHours(settings)) return false;
    return true;
};

/**
 * Format time remaining until a specific time today
 */
export const getTimeUntil = (targetTime: string): number => {
    const now = new Date();
    const [hours = 0, minutes = 0] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    return target.getTime() - now.getTime();
};
