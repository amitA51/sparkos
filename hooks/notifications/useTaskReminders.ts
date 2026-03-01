import { useEffect, useRef } from 'react';
import { showNotification } from '../../services/notificationsService';
import { useData } from '../../src/contexts/DataContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { isQuietHours } from './notificationUtils';
import { parseDate } from '../../utils/dateUtils';

/**
 * Hook that monitors task due dates and sends reminders before they're due.
 * Respects quiet hours and notification settings.
 */
export const useTaskReminders = () => {
    const { personalItems } = useData();
    const { settings } = useSettings();
    const notifiedTaskIds = useRef(new Set<string>());

    useEffect(() => {
        if (
            !settings.notificationsSettings?.enabled ||
            !settings.notificationsSettings?.taskRemindersEnabled
        ) {
            return;
        }

        const checkTasks = () => {
            // Don't send during quiet hours
            if (isQuietHours(settings)) {
                return;
            }

            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
                return;
            }

            const now = new Date();
            const openTasks = personalItems.filter(
                item => item.type === 'task' && !item.isCompleted && item.dueDate
            );

            // Get reminder time from new settings
            const reminderMinutes = settings.notificationsSettings.taskReminderMinutes ?? 15;

            openTasks.forEach(task => {
                // This creates the date in the user's local timezone at midnight
                const dueDate = parseDate(task.dueDate);

                if (task.dueTime) {
                    const [hours = 0, minutes = 0] = task.dueTime.split(':').map(Number);
                    dueDate.setHours(hours, minutes, 0, 0);
                } else {
                    // Default to 9 AM if no time is set
                    dueDate.setHours(9, 0, 0, 0);
                }

                const timeDiff = dueDate.getTime() - now.getTime();
                const minutesUntilDue = Math.ceil(timeDiff / (1000 * 60));

                if (minutesUntilDue > 0 && minutesUntilDue <= reminderMinutes) {
                    if (!notifiedTaskIds.current.has(task.id)) {
                        notifiedTaskIds.current.add(task.id);

                        const body = task.dueTime
                            ? `המשימה מתוכננת לשעה ${task.dueTime}.`
                            : `המשימה אמורה להתבצע היום.`;

                        showNotification(`תזכורת למשימה: ${task.title}`, {
                            body: body,
                            tag: `task-reminder-${task.id}`,
                            data: { action: 'go_today' },
                        });
                    }
                } else if (minutesUntilDue < -reminderMinutes) {
                    // Reset notification status if the due date has passed significantly,
                    // allowing for a new notification if the date is changed.
                    notifiedTaskIds.current.delete(task.id);
                }
            });
        };

        // Run immediately on mount to catch any pending reminders
        checkTasks();

        const intervalId = setInterval(checkTasks, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [
        personalItems,
        settings.notificationsSettings,
        // Listen to specific properties to trigger re-run
        settings.notificationsSettings?.enabled,
        settings.notificationsSettings?.taskRemindersEnabled,
        settings.notificationsSettings?.taskReminderMinutes,
        settings.notificationsSettings?.quietHoursEnabled,
        settings.notificationsSettings?.quietHoursStart,
        settings.notificationsSettings?.quietHoursEnd,
    ]);
};
