/**
 * Google Sync Service
 * Orchestrates bidirectional synchronization between Spark and Google services
 * (Google Drive, Google Calendar, Google Tasks)
 */

import { auth } from '../config/firebase';
import { hasGoogleApiAccess } from './authService';
import { syncService } from './syncService';
import * as googleCalendarService from './googleCalendarService';
import * as googleTasksService from './googleTasksService';
import { dbPut, dbGetAll } from './data/dbCore';
import { addPersonalItem, updatePersonalItem, getPersonalItems } from './db/personalItemsDb';
import type { PersonalItem, GoogleCalendarEvent } from '../types';

// --- Types ---

export interface SyncResult {
    success: boolean;
    driveSync: { success: boolean; error?: string };
    calendarSync: { success: boolean; eventCount: number; error?: string };
    tasksSync: { success: boolean; pulled: number; pushed: number; error?: string };
    timestamp: string;
}

export interface SyncStatus {
    isSyncing: boolean;
    lastSync: SyncResult | null;
    lastSyncTime: string | null;
}

// --- Constants ---

const GOOGLE_CALENDAR_STORE = 'google_calendar_events';
const SPARK_TASKS_LIST_NAME = 'Spark Tasks';

// --- State ---

let isSyncing = false;
let lastSyncResult: SyncResult | null = null;
const syncListeners: Set<(status: SyncStatus) => void> = new Set();

// --- Helper Functions ---

const notifyListeners = () => {
    const status: SyncStatus = {
        isSyncing,
        lastSync: lastSyncResult,
        lastSyncTime: lastSyncResult?.timestamp || null,
    };
    syncListeners.forEach(listener => listener(status));
};

// --- Sync Functions ---

/**
 * Sync Google Calendar events to local cache
 */
const syncCalendarEvents = async (): Promise<{ success: boolean; eventCount: number; error?: string }> => {
    try {
        if (!hasGoogleApiAccess()) {
            return { success: false, eventCount: 0, error: 'No Google API access' };
        }

        // Fetch events for the next 30 days
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 30);

        const events = await googleCalendarService.getEventsForDateRange(now, futureDate);

        // Cache events in IndexedDB
        for (const event of events) {
            await dbPut(GOOGLE_CALENDAR_STORE, { ...event, _id: event.id });
        }

        console.log(`[GoogleSync] Synced ${events.length} calendar events`);
        return { success: true, eventCount: events.length };
    } catch (error) {
        console.error('[GoogleSync] Calendar sync failed:', error);
        return {
            success: false,
            eventCount: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Get or create the Spark Tasks list in Google Tasks
 */
const getOrCreateSparkTaskList = async (): Promise<string | null> => {
    try {
        const lists = await googleTasksService.listTaskLists();
        const sparkList = lists.find(list => list.title === SPARK_TASKS_LIST_NAME);

        if (sparkList) {
            return sparkList.id;
        }

        // Create new list
        const newList = await googleTasksService.createTaskList(SPARK_TASKS_LIST_NAME);
        console.log('[GoogleSync] Created Spark Tasks list:', newList.id);
        return newList.id;
    } catch (error) {
        console.error('[GoogleSync] Failed to get/create task list:', error);
        return null;
    }
};

/**
 * Bidirectional sync between Spark tasks and Google Tasks
 */
const syncTasks = async (): Promise<{ success: boolean; pulled: number; pushed: number; error?: string }> => {
    try {
        if (!hasGoogleApiAccess()) {
            return { success: false, pulled: 0, pushed: 0, error: 'No Google API access' };
        }

        const taskListId = await getOrCreateSparkTaskList();
        if (!taskListId) {
            return { success: false, pulled: 0, pushed: 0, error: 'Failed to get task list' };
        }

        // Save the task list ID for future use
        localStorage.setItem('spark_google_tasks_list_id', taskListId);

        // --- PULL: Google Tasks → Spark ---
        const googleTasks = await googleTasksService.listTasks(taskListId, { showCompleted: true });
        let pulledCount = 0;

        for (const gTask of googleTasks) {
            // Check if this task already exists in Spark (by googleTaskId)
            const existingItems = await getPersonalItems();
            const existingItem = existingItems.find(item => item.googleTaskId === gTask.id);

            if (!existingItem) {
                // Create new task in Spark with Firebase sync
                const newItemData: Omit<PersonalItem, 'id' | 'createdAt' | 'updatedAt'> = {
                    type: 'task',
                    title: gTask.title,
                    content: gTask.notes || '',
                    dueDate: gTask.due ? new Date(gTask.due).toISOString().split('T')[0] : undefined,
                    isCompleted: gTask.status === 'completed',
                    googleTaskId: gTask.id,
                    googleTaskListId: taskListId,
                };
                await addPersonalItem(newItemData);
                pulledCount++;
            } else {
                // Update existing item if Google version is newer
                const gTaskUpdated = gTask.updated ? new Date(gTask.updated).getTime() : 0;
                const sparkUpdated = existingItem.updatedAt ? new Date(existingItem.updatedAt).getTime() : 0;

                if (gTaskUpdated > sparkUpdated) {
                    // Update with Firebase sync
                    await updatePersonalItem(existingItem.id, {
                        title: gTask.title,
                        content: gTask.notes || existingItem.content,
                        dueDate: gTask.due ? new Date(gTask.due).toISOString().split('T')[0] : existingItem.dueDate,
                        isCompleted: gTask.status === 'completed',
                    });
                    pulledCount++;
                }
            }
        }

        // --- PUSH: Spark → Google Tasks ---
        const allItems = await getPersonalItems();
        const sparkTasks = allItems.filter(item =>
            item.type === 'task' &&
            (item.googleTaskId || item.googleTasksSync !== false) // Include tasks marked for sync or already synced
        );
        let pushedCount = 0;

        for (const sparkTask of sparkTasks) {
            const gTaskData = googleTasksService.personalItemToGoogleTask(sparkTask);

            if (sparkTask.googleTaskId) {
                // Update existing Google task
                try {
                    const gTaskUpdated = googleTasks.find(gt => gt.id === sparkTask.googleTaskId)?.updated;
                    const sparkUpdated = sparkTask.updatedAt ? new Date(sparkTask.updatedAt).getTime() : Date.now();
                    const googleUpdated = gTaskUpdated ? new Date(gTaskUpdated).getTime() : 0;

                    // Only push if Spark version is newer
                    if (sparkUpdated > googleUpdated) {
                        await googleTasksService.updateTask(taskListId, sparkTask.googleTaskId, gTaskData);
                        pushedCount++;
                    }
                } catch (error) {
                    console.warn('[GoogleSync] Failed to update task:', sparkTask.id, error);
                }
            } else {
                // Create new Google task
                try {
                    const createdTask = await googleTasksService.createTask(taskListId, gTaskData);
                    // Update Spark item with Google task ID - with Firebase sync
                    await updatePersonalItem(sparkTask.id, {
                        googleTaskId: createdTask.id,
                        googleTaskListId: taskListId,
                    });
                    pushedCount++;
                } catch (error) {
                    console.warn('[GoogleSync] Failed to create task:', sparkTask.id, error);
                }
            }
        }

        console.log(`[GoogleSync] Tasks sync: pulled ${pulledCount}, pushed ${pushedCount}`);
        return { success: true, pulled: pulledCount, pushed: pushedCount };
    } catch (error) {
        console.error('[GoogleSync] Tasks sync failed:', error);
        return {
            success: false,
            pulled: 0,
            pushed: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

/**
 * Push a single task to Google (Create or Update)
 */
export const pushTaskToGoogle = async (item: PersonalItem): Promise<void> => {
    if (!hasGoogleApiAccess() || item.type !== 'task') return;

    try {
        const taskListId = localStorage.getItem('spark_google_tasks_list_id') || await getOrCreateSparkTaskList();
        if (!taskListId) return;

        const gTaskData = googleTasksService.personalItemToGoogleTask(item);

        if (item.googleTaskId) {
            // Update existing
            await googleTasksService.updateTask(taskListId, item.googleTaskId, gTaskData);
        } else {
            // Create new
            const createdTask = await googleTasksService.createTask(taskListId, gTaskData);
            // Update local item with new Google ID (silent update to avoid loops if handled correctly upstream)
            // Note: We need to be careful not to trigger infinite loops here.
            // Ideally, personalItemsDb should handle the ID update without re-triggering this push.
            await updatePersonalItem(item.id, {
                googleTaskId: createdTask.id,
                googleTaskListId: taskListId,
                googleTasksSync: true // Mark as synced
            });
        }
    } catch (error) {
        console.error('[GoogleSync] Failed to push task:', error);
    }
};

/**
 * Push task deletion to Google
 */
export const pushTaskDeletionToGoogle = async (googleTaskId: string): Promise<void> => {
    if (!hasGoogleApiAccess() || !googleTaskId) return;

    try {
        const taskListId = localStorage.getItem('spark_google_tasks_list_id');
        if (!taskListId) return;

        await googleTasksService.deleteTask(taskListId, googleTaskId);
    } catch (error) {
        console.error('[GoogleSync] Failed to delete task on Google:', error);
    }
};

/**
 * Perform full sync with all Google services
 */
export const performFullSync = async (): Promise<SyncResult> => {
    if (isSyncing) {
        console.log('[GoogleSync] Sync already in progress, skipping...');
        return lastSyncResult || {
            success: false,
            driveSync: { success: false, error: 'Sync in progress' },
            calendarSync: { success: false, eventCount: 0, error: 'Sync in progress' },
            tasksSync: { success: false, pulled: 0, pushed: 0, error: 'Sync in progress' },
            timestamp: new Date().toISOString(),
        };
    }

    // Check if user has Google API access
    if (!hasGoogleApiAccess()) {
        console.log('[GoogleSync] No Google API access, skipping sync');
        return {
            success: false,
            driveSync: { success: false, error: 'No API access' },
            calendarSync: { success: false, eventCount: 0, error: 'No API access' },
            tasksSync: { success: false, pulled: 0, pushed: 0, error: 'No API access' },
            timestamp: new Date().toISOString(),
        };
    }

    isSyncing = true;
    notifyListeners();

    console.log('[GoogleSync] Starting full sync...');

    try {
        // 1. Sync Google Drive (backup)
        let driveResult: { success: boolean; error?: string } = { success: false, error: '' };
        try {
            syncService.triggerAutoSave();
            driveResult = { success: true };
        } catch (error) {
            driveResult = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }

        // 2. Sync Calendar
        const calendarResult = await syncCalendarEvents();

        // 3. Sync Tasks (bidirectional)
        const tasksResult = await syncTasks();

        const result: SyncResult = {
            success: driveResult.success && calendarResult.success && tasksResult.success,
            driveSync: driveResult,
            calendarSync: calendarResult,
            tasksSync: tasksResult,
            timestamp: new Date().toISOString(),
        };

        lastSyncResult = result;

        // Store last sync time
        localStorage.setItem('spark_last_google_sync', result.timestamp);

        console.log('[GoogleSync] Full sync completed:', result);
        return result;
    } finally {
        isSyncing = false;
        notifyListeners();
    }
};

/**
 * Get cached calendar events from IndexedDB
 */
export const getCachedCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
    try {
        const events = await dbGetAll<GoogleCalendarEvent & { _id: string }>(GOOGLE_CALENDAR_STORE);
        return events.map(({ _id, ...event }) => event as GoogleCalendarEvent);
    } catch {
        return [];
    }
};

/**
 * Subscribe to sync status changes
 */
export const subscribeSyncStatus = (listener: (status: SyncStatus) => void): (() => void) => {
    syncListeners.add(listener);
    // Immediately send current status
    listener({
        isSyncing,
        lastSync: lastSyncResult,
        lastSyncTime: lastSyncResult?.timestamp || localStorage.getItem('spark_last_google_sync'),
    });
    return () => syncListeners.delete(listener);
};

/**
 * Get current sync status
 */
export const getSyncStatus = (): SyncStatus => ({
    isSyncing,
    lastSync: lastSyncResult,
    lastSyncTime: lastSyncResult?.timestamp || localStorage.getItem('spark_last_google_sync'),
});

/**
 * Initialize sync service - call on app startup
 * ✅ PERF: Returns cleanup function to prevent memory leaks
 */
export const initGoogleSync = (): (() => void) | undefined => {
    if (!auth) return undefined;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user && hasGoogleApiAccess()) {
            console.log('[GoogleSync] User authenticated with Google API access, syncing...');
            // Small delay to ensure auth state is settled
            setTimeout(() => performFullSync(), 1000);
        }
    });

    // Return cleanup function
    return unsubscribe;
};

// Export singleton instance
export const googleSyncService = {
    performFullSync,
    getCachedCalendarEvents,
    subscribeSyncStatus,
    getSyncStatus,
    initGoogleSync,
    pushTaskToGoogle,
    pushTaskDeletionToGoogle,
};
