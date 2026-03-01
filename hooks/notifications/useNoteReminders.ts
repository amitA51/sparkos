import { useEffect, useRef } from 'react';
import { showNotification } from '../../services/notificationsService';
import { useData } from '../../src/contexts/DataContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { isQuietHours } from './notificationUtils';
import { parseDate } from '../../utils/dateUtils';

/**
 * Hook that monitors note due dates and sends reminders at the scheduled time.
 * Notes with dueDate and dueTime will trigger a notification at that exact time.
 * Respects quiet hours and notification settings.
 */
export const useNoteReminders = () => {
    const { personalItems } = useData();
    const { settings } = useSettings();
    const scheduledTimeouts = useRef<number[]>([]);
    const notifiedNoteIds = useRef(new Set<string>());

    useEffect(() => {
        // Clear any previously scheduled timeouts
        scheduledTimeouts.current.forEach(clearTimeout);
        scheduledTimeouts.current = [];

        if (
            !settings.notificationsSettings?.enabled ||
            !settings.notificationsSettings?.noteRemindersEnabled
        ) {
            return;
        }

        if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
            return;
        }

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // Get notes with due date set for today and with a time
        const notesWithReminders = personalItems.filter(
            item => item.type === 'note' && item.dueDate === todayStr && item.dueTime
        );

        if (notesWithReminders.length === 0) {
            return;
        }

        notesWithReminders.forEach(note => {
            const [hours = 0, minutes = 0] = note.dueTime!.split(':').map(Number);
            const reminderDate = parseDate(note.dueDate!);
            reminderDate.setHours(hours, minutes, 0, 0);

            const delay = reminderDate.getTime() - now.getTime();

            if (delay > 0) {
                // Future reminder - schedule timeout
                const timeoutId = window.setTimeout(() => {
                    // Check quiet hours at notification time
                    if (isQuietHours(settings)) {
                        return;
                    }

                    if (!notifiedNoteIds.current.has(note.id)) {
                        notifiedNoteIds.current.add(note.id);
                        showNotification(`תזכורת: ${note.title}`, {
                            body: note.content ? note.content.substring(0, 100) : 'יש לך פתק לטפל בו!',
                            tag: `note-reminder-${note.id}`,
                            data: { action: 'go_today' },
                        });
                    }
                }, delay);
                scheduledTimeouts.current.push(timeoutId);
            } else if (delay > -60000) {
                // Reminder time just passed (within last minute) - show notification immediately
                if (!isQuietHours(settings) && !notifiedNoteIds.current.has(note.id)) {
                    notifiedNoteIds.current.add(note.id);
                    showNotification(`תזכורת: ${note.title}`, {
                        body: note.content ? note.content.substring(0, 100) : 'יש לך פתק לטפל בו!',
                        tag: `note-reminder-${note.id}`,
                        data: { action: 'go_today' },
                    });
                }
            }
        });

        // Cleanup function
        return () => {
            scheduledTimeouts.current.forEach(clearTimeout);
            scheduledTimeouts.current = [];
        };
    }, [
        personalItems,
        settings.notificationsSettings,
        settings.notificationsSettings?.enabled,
        settings.notificationsSettings?.noteRemindersEnabled,
        settings.notificationsSettings?.quietHoursEnabled,
        settings.notificationsSettings?.quietHoursStart,
        settings.notificationsSettings?.quietHoursEnd,
    ]);
};
