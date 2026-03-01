/**
 * Centralized Notification System
 * 
 * This module consolidates all notification-related hooks into a single manager.
 * Import and call useNotifications() in AppCore to enable all notification features.
 */

import { useHabitReminders } from './useHabitReminders';
import { useTaskReminders } from './useTaskReminders';
import { useNoteReminders } from './useNoteReminders';
import { useDailyDigest } from './useDailyDigest';
import { useWeeklyReview } from './useWeeklyReview';
import { useCalendarReminders } from './useCalendarReminders';

/**
 * Central notification manager hook.
 * Activates all notification subsystems:
 * - Task reminders (before due date/time)
 * - Habit reminders (at configured time)
 * - Note reminders (at configured time)
 * - Daily digest (summary at configured time)
 * - Weekly review (reminder on configured day)
 * 
 * All notifications respect quiet hours and global notification settings.
 */
export const useNotifications = () => {
    // Task due date reminders
    useTaskReminders();

    // Habit reminder notifications
    useHabitReminders();

    // Note reminder notifications
    useNoteReminders();

    // Daily summary notification
    useDailyDigest();

    // Weekly review reminder
    useWeeklyReview();

    // Calendar event reminders
    useCalendarReminders();
};

// Re-export individual hooks for direct access
export { useHabitReminders } from './useHabitReminders';
export { useTaskReminders } from './useTaskReminders';
export { useNoteReminders } from './useNoteReminders';
export { useDailyDigest } from './useDailyDigest';
export { useWeeklyReview } from './useWeeklyReview';
export { useCalendarReminders } from './useCalendarReminders';

// Re-export utilities
export { isQuietHours, canSendNotification, getTimeUntil } from './notificationUtils';

