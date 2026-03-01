import { useEffect, useRef } from 'react';
import { showNotification } from '../../services/notificationsService';
import type { PersonalItem } from '../../types';
import { useData } from '../../src/contexts/DataContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { canSendNotification, getTimeUntil } from './notificationUtils';

/**
 * Hook that schedules the Daily Digest notification at the configured time.
 * Sends a summary of today's tasks and habits.
 */
export const useDailyDigest = () => {
    const { personalItems } = useData();
    const { settings } = useSettings();
    const scheduledTimeoutRef = useRef<number | null>(null);
    const hasSentTodayRef = useRef<string>(''); // Track if already sent today
    // Use ref to always have fresh personalItems in timeout callbacks
    const personalItemsRef = useRef<PersonalItem[]>(personalItems);

    // Keep ref updated with latest personalItems
    useEffect(() => {
        personalItemsRef.current = personalItems;
    }, [personalItems]);

    useEffect(() => {
        // Clear any existing timeout
        if (scheduledTimeoutRef.current) {
            clearTimeout(scheduledTimeoutRef.current);
            scheduledTimeoutRef.current = null;
        }

        if (!settings.dailyDigestEnabled || !canSendNotification(settings)) {
            return;
        }

        const today = new Date().toDateString();

        // Don't schedule if already sent today
        if (hasSentTodayRef.current === today) {
            return;
        }

        const delay = getTimeUntil(settings.dailyDigestTime ?? '');

        if (delay > 0) {
            // Schedule future notification
            scheduledTimeoutRef.current = window.setTimeout(() => {
                sendDailyDigest();
            }, delay);
        } else if (delay > -60000) {
            // Just passed (within last minute) - send immediately
            sendDailyDigest();
        }

        function sendDailyDigest() {
            const todayStr = new Date().toISOString().split('T')[0] ?? '';
            // Use ref to get fresh items at notification time
            const items = personalItemsRef.current;

            // Count today's tasks
            const todaysTasks = items.filter(
                item => item.type === 'task' && !item.isCompleted && item.dueDate === todayStr
            );

            // Count today's habits (not completed)
            const todaysHabits = items.filter(
                item => item.type === 'habit' && item.habitType !== 'bad'
            );

            const taskCount = todaysTasks.length;
            const habitCount = todaysHabits.length;

            let body = '';
            if (taskCount > 0 && habitCount > 0) {
                body = `יש לך ${taskCount} משימות ו-${habitCount} הרגלים להיום.`;
            } else if (taskCount > 0) {
                body = `יש לך ${taskCount} משימות להיום.`;
            } else if (habitCount > 0) {
                body = `יש לך ${habitCount} הרגלים להיום.`;
            } else {
                body = 'אין לך משימות או הרגלים להיום. יום פנוי!';
            }

            showNotification('📋 סיכום יומי', {
                body,
                tag: 'daily-digest',
                data: { action: 'go_today' },
            });

            hasSentTodayRef.current = new Date().toDateString();
        }

        return () => {
            if (scheduledTimeoutRef.current) {
                clearTimeout(scheduledTimeoutRef.current);
                scheduledTimeoutRef.current = null;
            }
        };
    }, [
        settings.dailyDigestEnabled,
        settings.dailyDigestTime,
        settings.notificationsEnabled,
        settings.quietHoursEnabled,
        settings.quietHoursStart,
        settings.quietHoursEnd,
    ]);
};
