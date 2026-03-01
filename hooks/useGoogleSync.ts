/**
 * useGoogleSync Hook
 * Provides access to Google Sync status and actions for components
 */

import { useState, useEffect, useCallback } from 'react';
import {
    googleSyncService,
    SyncStatus,
    SyncResult,
    getCachedCalendarEvents
} from '../services/googleSyncService';
import type { GoogleCalendarEvent } from '../types';

export interface UseGoogleSyncReturn {
    // Status
    isSyncing: boolean;
    lastSync: SyncResult | null;
    lastSyncTime: string | null;

    // Actions
    triggerSync: () => Promise<SyncResult>;

    // Cached Data
    calendarEvents: GoogleCalendarEvent[];
    refreshCalendarEvents: () => Promise<void>;
}

export const useGoogleSync = (): UseGoogleSyncReturn => {
    const [status, setStatus] = useState<SyncStatus>(() => googleSyncService.getSyncStatus());
    const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);

    // Subscribe to sync status changes
    useEffect(() => {
        const unsubscribe = googleSyncService.subscribeSyncStatus(setStatus);
        return unsubscribe;
    }, []);

    // Load cached calendar events on mount
    useEffect(() => {
        const loadEvents = async () => {
            const events = await getCachedCalendarEvents();
            setCalendarEvents(events);
        };
        loadEvents();
    }, [status.lastSyncTime]); // Reload when sync completes

    const triggerSync = useCallback(async (): Promise<SyncResult> => {
        const result = await googleSyncService.performFullSync();
        return result;
    }, []);

    const refreshCalendarEvents = useCallback(async () => {
        const events = await getCachedCalendarEvents();
        setCalendarEvents(events);
    }, []);

    return {
        isSyncing: status.isSyncing,
        lastSync: status.lastSync,
        lastSyncTime: status.lastSyncTime,
        triggerSync,
        calendarEvents,
        refreshCalendarEvents,
    };
};
