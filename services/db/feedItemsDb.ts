/**
 * Feed Items Database Service
 *
 * CRUD operations for FeedItem entities (RSS, Sparks, News, Mentors).
 */

import { LOCAL_STORAGE_KEYS as LS } from '../../constants';
import type { FeedItem, PersonalItem } from '../../types';
import { dbGet, dbPut, dbDelete, initializeDefaultDataLazy, safeDateSort, syncWithRetry } from './indexedDBCore';
import { getDefaultFeedItems } from '../defaultDataLoader';
import { ValidationError, NotFoundError } from '../errors';
import { logEvent } from '../correlationsService';
import { addPersonalItem } from './personalItemsDb';
import { auth } from '../../config/firebase';
import {
    syncFeedItem,
    deleteFeedItem as deleteCloudFeedItem,
} from '../firestoreService';

// --- CRUD Operations ---

/**
 * Get all feed items, sorted by creation date (newest first).
 */
export const getFeedItems = async (): Promise<FeedItem[]> => {
    const items = await initializeDefaultDataLazy(LS.FEED_ITEMS, getDefaultFeedItems);
    return items.sort(safeDateSort);
};

/**
 * Re-add a feed item (used during import).
 */
export const reAddFeedItem = (item: FeedItem): Promise<void> => dbPut(LS.FEED_ITEMS, item);

/**
 * Update a feed item.
 */
export const updateFeedItem = async (id: string, updates: Partial<FeedItem>): Promise<FeedItem> => {
    if (!id) throw new ValidationError('Item ID is required for update.');
    const itemToUpdate = await dbGet<FeedItem>(LS.FEED_ITEMS, id);
    if (!itemToUpdate) throw new NotFoundError('FeedItem', id);
    const updatedItem = { ...itemToUpdate, ...updates };
    await dbPut(LS.FEED_ITEMS, updatedItem);

    // Cloud Sync with retry
    const currentUser = auth?.currentUser;
    if (currentUser) {
        syncWithRetry(
            () => syncFeedItem(currentUser.uid, updatedItem),
            `updateFeedItem:${updatedItem.id}`
        );
    }

    return updatedItem;
};

/**
 * Remove a feed item.
 */
export const removeFeedItem = async (id: string): Promise<void> => {
    if (!id) throw new ValidationError('Item ID is required for deletion.');
    await dbDelete(LS.FEED_ITEMS, id);

    // Cloud Sync with retry
    const currentUser = auth?.currentUser;
    if (currentUser) {
        syncWithRetry(
            () => deleteCloudFeedItem(currentUser.uid, id),
            `removeFeedItem:${id}`
        );
    }
};

/**
 * Save multiple feed items.
 */
export const saveFeedItems = async (items: FeedItem[]): Promise<void> => {
    await Promise.all(items.map(item => dbPut(LS.FEED_ITEMS, item)));

    // Cloud Sync with retry - batch sync
    const currentUser = auth?.currentUser;
    if (currentUser) {
        items.forEach(item => {
            syncWithRetry(
                () => syncFeedItem(currentUser.uid, item),
                `saveFeedItems:${item.id}`
            );
        });
    }
};

/**
 * Add a new Spark (user-created feed item).
 */
export const addSpark = async (
    sparkData: Omit<FeedItem, 'id' | 'createdAt' | 'type' | 'is_read' | 'is_spark'>
): Promise<FeedItem> => {
    if (!sparkData.title) throw new ValidationError('Spark title is required.');

    const newSpark: FeedItem = {
        id: `spark-${Date.now()}`,
        type: 'spark',
        is_read: false,
        is_spark: true,
        createdAt: new Date().toISOString(),
        ...sparkData,
    };

    await dbPut(LS.FEED_ITEMS, newSpark);

    logEvent({
        eventType: 'spark_created',
        itemId: newSpark.id,
        itemTitle: newSpark.title,
        metadata: { source: newSpark.source },
    });

    // Cloud Sync with retry
    const currentUser = auth?.currentUser;
    if (currentUser) {
        syncWithRetry(
            () => syncFeedItem(currentUser.uid, newSpark),
            `addSpark:${newSpark.id}`
        );
    }

    return newSpark;
};

/**
 * Convert a feed item to a personal item (learning type).
 */
export const convertFeedItemToPersonalItem = async (item: FeedItem): Promise<PersonalItem> => {
    if (!item || !item.id) throw new ValidationError('A valid feed item is required for conversion.');

    const newItemData: Omit<PersonalItem, 'id' | 'createdAt'> = {
        type: 'learning',
        title: item.title,
        content: item.summary_ai || item.content,
        url: item.link,
        domain: item.link ? new URL(item.link).hostname : undefined,
        metadata: {
            source: `Feed: ${item.source || 'Unknown'}`,
        },
        updatedAt: new Date().toISOString(),
    };

    return await addPersonalItem(newItemData);
};

