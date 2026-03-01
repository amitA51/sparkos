import { useEffect, useRef } from 'react';
import { isHabitForToday } from '../useTodayItems';
import { showNotification } from '../../services/notificationsService';
import type { PersonalItem } from '../../types';
import { useData } from '../../src/contexts/DataContext';
import { useSettings } from '../../src/contexts/SettingsContext';
import { isQuietHours } from './notificationUtils';

/**
 * Hook that schedules reminders for habits at their configured reminder time.
 * Respects quiet hours and notification settings.
 */
export const useHabitReminders = () => {
    const { personalItems } = useData();
    const { settings } = useSettings();
    const scheduledTimeouts = useRef<number[]>([]);
    // Use ref to always have fresh personalItems in timeout callbacks
    const personalItemsRef = useRef<PersonalItem[]>(personalItems);

    // Keep ref updated with latest personalItems
    useEffect(() => {
        personalItemsRef.current = personalItems;
    }, [personalItems]);

    useEffect(() => {
        // Clear any previously scheduled timeouts
        scheduledTimeouts.current.forEach(clearTimeout);
        scheduledTimeouts.current = [];

        if (
            typeof Notification === 'undefined' ||
            Notification.permission !== 'granted' ||
            !settings.notificationsSettings?.enabled ||
            !settings.notificationsSettings?.habitRemindersEnabled
        ) {
            return;
        }

        const habitsWithReminders = personalItems.filter(
            item =>
                item.type === 'habit' && item.reminderEnabled && item.reminderTime && isHabitForToday(item)
        );

        if (habitsWithReminders.length === 0) {
            return;
        }

        const now = new Date();

        habitsWithReminders.forEach(habit => {
            // Note: We prioritize the habit's *specific* reminder time over the global default if set on the object
            // but the hook filters to require 'item.reminderTime' anyway. The global 'habitReminderTime' might be used for defaults when creating.

            const [hours = 0, minutes = 0] = habit.reminderTime!.split(':').map(Number);
            const reminderDate = new Date();
            reminderDate.setHours(hours, minutes, 0, 0);

            const delay = reminderDate.getTime() - now.getTime();

            if (delay > 0) {
                // Future reminder - schedule timeout
                const timeoutId = window.setTimeout(() => {
                    // Check quiet hours at notification time
                    if (isQuietHours(settings)) {
                        return;
                    }

                    // Use ref to get fresh state
                    const currentHabitState = personalItemsRef.current.find(h => h.id === habit.id);
                    if (currentHabitState && isHabitForToday(currentHabitState)) {
                        showNotification(`תזכורת: ${habit.title}`, {
                            body: 'אל תשכח להשלים את ההרגל שלך להיום!',
                            tag: `habit-reminder-${habit.id}`,
                            data: { action: 'go_today' },
                        });
                    }
                }, delay);
                scheduledTimeouts.current.push(timeoutId);
            } else if (delay > -60000) {
                // Reminder time just passed (within last minute) - show notification immediately
                // Check quiet hours first
                if (!isQuietHours(settings)) {
                    const currentHabitState = personalItemsRef.current.find(h => h.id === habit.id);
                    if (currentHabitState && isHabitForToday(currentHabitState)) {
                        showNotification(`תזכורת: ${habit.title}`, {
                            body: 'אל תשכח להשלים את ההרגל שלך להיום!',
                            tag: `habit-reminder-${habit.id}`,
                            data: { action: 'go_today' },
                        });
                    }
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
        settings.notificationsSettings?.habitRemindersEnabled,
        settings.notificationsSettings?.quietHoursEnabled,
        settings.notificationsSettings?.quietHoursStart,
        settings.notificationsSettings?.quietHoursEnd,
    ]);
};
