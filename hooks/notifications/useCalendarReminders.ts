import { useEffect, useRef, useCallback } from 'react';
import { showNotification } from '../../services/notificationsService';
import { useSettings } from '../../src/contexts/SettingsContext';
import { isQuietHours } from './notificationUtils';

// --- Constants ---

const CHECK_INTERVAL_MS = 60000; // Check every minute
const DEFAULT_REMINDER_MINUTES = 15;
const NOTIFICATION_TAG_PREFIX = 'calendar-reminder-';
const STORAGE_KEY = 'google_calendar_events';

// --- Interfaces ---

/**
 * Google Calendar event structure
 */
interface CalendarEvent {
    id?: string;
    summary?: string;
    start?: {
        dateTime?: string;
        date?: string;
    };
}

// --- Helper Functions ---

const getStoredEvents = (): CalendarEvent[] => {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (!cached) return [];

        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('Failed to parse calendar events from localStorage', e);
        return [];
    }
};

/**
 * Hook that monitors Google Calendar events and sends reminders before they start.
 * Respects quiet hours and notification settings.
 * 
 * Uses the calendarRemindersEnabled and calendarReminderMinutes settings.
 */
export const useCalendarReminders = () => {
    const { settings } = useSettings();
    const notifiedEventIds = useRef(new Set<string>());
    const calendarEventsRef = useRef<CalendarEvent[]>([]);

    // Update the events ref from localStorage
    const updateEvents = useCallback(() => {
        calendarEventsRef.current = getStoredEvents();
    }, []);

    useEffect(() => {
        const { notificationsSettings } = settings;

        // Check if calendar reminders are enabled
        if (
            !notificationsSettings?.enabled ||
            !notificationsSettings?.calendarRemindersEnabled
        ) {
            return;
        }

        const checkEvents = () => {
            // Don't send during quiet hours
            if (isQuietHours(settings)) {
                return;
            }

            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
                return;
            }

            // Update events from cache
            updateEvents();

            const now = new Date();
            const events = calendarEventsRef.current;
            const reminderMinutes = notificationsSettings?.calendarReminderMinutes ?? DEFAULT_REMINDER_MINUTES;

            events.forEach((event: CalendarEvent) => {
                const startDateTime = event.start?.dateTime || event.start?.date;
                if (!startDateTime) return;

                const eventId = event.id || event.summary || '';
                if (!eventId) return;

                const startTime = new Date(startDateTime);
                const timeDiff = startTime.getTime() - now.getTime();
                const minutesUntilStart = Math.ceil(timeDiff / (1000 * 60));

                // Send reminder if within the reminder window (positive minutes)
                if (minutesUntilStart > 0 && minutesUntilStart <= reminderMinutes) {
                    if (!notifiedEventIds.current.has(eventId)) {
                        notifiedEventIds.current.add(eventId);

                        const timeStr = startTime.toLocaleTimeString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        showNotification(`📅 ${event.summary || 'אירוע'}`, {
                            body: `מתחיל בעוד ${minutesUntilStart} דקות (${timeStr})`,
                            tag: `${NOTIFICATION_TAG_PREFIX}${eventId}`,
                            data: { action: 'go_calendar' },
                        });
                    }
                } else if (minutesUntilStart < -60) {
                    // Clean up old notifications after event has passed significantly
                    notifiedEventIds.current.delete(eventId);
                }
            });
        };

        // Initial check
        checkEvents();

        // Check every minute
        const intervalId = setInterval(checkEvents, CHECK_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [
        settings, // settings object contains all needed nested properties
        updateEvents,
    ]);
};
