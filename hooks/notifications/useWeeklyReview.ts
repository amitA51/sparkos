import { useEffect, useRef } from 'react';
import { showNotification } from '../../services/notificationsService';
import { useSettings } from '../../src/contexts/SettingsContext';
import { canSendNotification } from './notificationUtils';

/**
 * Hook that schedules the Weekly Review notification on the configured day.
 * Sends reminder at 10:00 AM on the selected day.
 */
export const useWeeklyReview = () => {
    const { settings } = useSettings();
    const scheduledTimeoutRef = useRef<number | null>(null);
    const lastSentWeekRef = useRef<string>(''); // Track which week we sent for
    // Keep settings ref for timeout callbacks
    const settingsRef = useRef(settings);

    // Keep ref updated with latest settings
    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    useEffect(() => {
        // Clear any existing timeout
        if (scheduledTimeoutRef.current) {
            clearTimeout(scheduledTimeoutRef.current);
            scheduledTimeoutRef.current = null;
        }

        if (!settings.weeklyReviewEnabled || !canSendNotification(settings)) {
            return;
        }

        const checkAndSchedule = () => {
            const now = new Date();
            const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const targetDay = settingsRef.current.weeklyReviewDay ?? 0;

            // Calculate week identifier to prevent duplicate sends
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay()); // Go to Sunday
            const weekId = weekStart.toISOString().split('T')[0] ?? '';

            // Don't send if already sent this week
            if (lastSentWeekRef.current === weekId) {
                return;
            }

            // Calculate milliseconds until target day at 10:00 AM
            let daysUntilTarget = (targetDay - currentDay);
            if (daysUntilTarget < 0) {
                daysUntilTarget += 7; // Next week
            }

            const targetDate = new Date(now);
            targetDate.setDate(now.getDate() + daysUntilTarget);
            targetDate.setHours(10, 0, 0, 0); // 10:00 AM

            const delay = targetDate.getTime() - now.getTime();

            if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
                // Schedule if within next 7 days
                scheduledTimeoutRef.current = window.setTimeout(() => {
                    sendWeeklyReview(weekId);
                }, Math.min(delay, 2147483647)); // setTimeout max value limit
            } else if (currentDay === targetDay && now.getHours() === 10 && now.getMinutes() < 5) {
                // It's the target day and time, send now
                sendWeeklyReview(weekId);
            }
        };

        function sendWeeklyReview(weekId: string) {
            showNotification('📊 סקירה שבועית', {
                body: 'הגיע הזמן לסקור את השבוע שעבר ולתכנן את השבוע הקרוב!',
                tag: 'weekly-review',
                data: { action: 'go_today' },
            });

            lastSentWeekRef.current = weekId;
        }

        checkAndSchedule();

        // Re-check every hour to handle scenarios where app is open for long periods
        const intervalId = setInterval(checkAndSchedule, 60 * 60 * 1000);

        return () => {
            if (scheduledTimeoutRef.current) {
                clearTimeout(scheduledTimeoutRef.current);
                scheduledTimeoutRef.current = null;
            }
            clearInterval(intervalId);
        };
    }, [
        settings.weeklyReviewEnabled,
        settings.weeklyReviewDay,
        settings.notificationsEnabled,
        settings.quietHoursEnabled,
        settings.quietHoursStart,
        settings.quietHoursEnd,
    ]);
};
