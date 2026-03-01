import { LOCAL_STORAGE_KEYS as LS } from '../../constants';
import { RssFeed } from '../../types';
import { getDefaultRssFeeds } from '../defaultDataLoader';
import {
    dbGet,
    dbPut,
    dbDelete,
    initializeDefaultDataLazy,
    syncWithRetry
} from './indexedDBCore';
import { fetchAndParseFeed } from '../rssService';
import { ValidationError } from '../errors';
import { auth } from '../../config/firebase';
import {
    syncRssFeed,
    deleteRssFeed as deleteCloudRssFeed,
} from '../firestoreService';

export const getFeeds = (): Promise<RssFeed[]> =>
    initializeDefaultDataLazy(LS.RSS_FEEDS, getDefaultRssFeeds);

export const addFeed = async (url: string, spaceId?: string): Promise<RssFeed> => {
    if (!url || !url.startsWith('http'))
        throw new ValidationError('A valid URL is required to add a feed.');
    const feeds = await getFeeds();
    if (feeds.some(feed => feed.url === url)) throw new Error('פיד עם כתובת זו כבר קיים.');
    const parsedFeed = await fetchAndParseFeed(url);
    const newFeed: RssFeed = { id: `rss-${Date.now()}`, url, name: parsedFeed.title, spaceId };
    await dbPut(LS.RSS_FEEDS, newFeed);

    // Cloud Sync with retry
    const currentUser = auth?.currentUser;
    if (currentUser) {
        syncWithRetry(
            () => syncRssFeed(currentUser.uid, newFeed),
            `addFeed:${newFeed.id}`
        );
    }

    return newFeed;
};

export const removeFeed = async (id: string): Promise<void> => {
    await dbDelete(LS.RSS_FEEDS, id);

    // Cloud Sync with retry
    const currentUser = auth?.currentUser;
    if (currentUser) {
        syncWithRetry(
            () => deleteCloudRssFeed(currentUser.uid, id),
            `removeFeed:${id}`
        );
    }
};

export const reAddFeed = (item: RssFeed): Promise<void> => dbPut(LS.RSS_FEEDS, item);

export const updateFeed = async (id: string, updates: Partial<RssFeed>): Promise<void> => {
    const feedToUpdate = await dbGet<RssFeed>(LS.RSS_FEEDS, id);
    if (feedToUpdate) {
        const updatedFeed = { ...feedToUpdate, ...updates };
        await dbPut(LS.RSS_FEEDS, updatedFeed);

        // Cloud Sync with retry
        const currentUser = auth?.currentUser;
        if (currentUser) {
            syncWithRetry(
                () => syncRssFeed(currentUser.uid, updatedFeed),
                `updateFeed:${id}`
            );
        }
    }
};

