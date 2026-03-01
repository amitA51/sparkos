/**
 * DefaultDataLoader - Lazy loading service for default/seed data
 *
 * This service replaces the static imports from mockData.ts.
 * Data is fetched from JSON files only when needed (first app install)
 * and cached in memory for subsequent calls.
 *
 * Benefits:
 * - Zero bundle impact (data is external JSON)
 * - Cached by Service Worker for offline access
 * - Only loaded once during app lifetime
 * - Type-safe with proper interfaces
 */

import type { Tag, Space, RssFeed, FeedItem, PersonalItem, Template, Mentor, RoadmapPhase } from '../types';

// Cache to prevent multiple fetches
const dataCache: Map<string, unknown> = new Map();

// Base path for default data files
const BASE_PATH = '/data/defaults';

/**
 * Generic fetch function with caching
 */
async function fetchDefaultData<T>(fileName: string): Promise<T[]> {
  const cacheKey = fileName;

  // Return cached data if available
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey) as T[];
  }

  try {
    const response = await fetch(`${BASE_PATH}/${fileName}.json`);

    if (!response.ok) {
      console.warn(`[DefaultDataLoader] Failed to fetch ${fileName}: ${response.status}`);
      return [];
    }

    const data = await response.json() as T[];
    dataCache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`[DefaultDataLoader] Error fetching ${fileName}:`, error);
    return [];
  }
}

/**
 * Fetch default tags for new users
 */
export async function getDefaultTags(): Promise<Tag[]> {
  return fetchDefaultData<Tag>('tags');
}

/**
 * Fetch default spaces for new users
 */
export async function getDefaultSpaces(): Promise<Space[]> {
  return fetchDefaultData<Space>('spaces');
}

/**
 * Fetch default RSS feeds for new users
 */
export async function getDefaultRssFeeds(): Promise<RssFeed[]> {
  return fetchDefaultData<RssFeed>('rssFeeds');
}

/**
 * Fetch default feed items (sample content)
 */
export async function getDefaultFeedItems(): Promise<FeedItem[]> {
  const items = await fetchDefaultData<FeedItem>('feedItems');

  // Recompute dynamic dates since JSON can't have Date.now()
  const now = Date.now();
  return items.map((item, index) => ({
    ...item,
    createdAt: new Date(now - (index + 1) * 3600000).toISOString(),
  }));
}

/**
 * Fetch default personal items (sample tasks, habits, etc.)
 */
export async function getDefaultPersonalItems(): Promise<PersonalItem[]> {
  const items = await fetchDefaultData<PersonalItem>('personalItems');

  // Recompute dynamic dates
  return items.map((item) => ({
    ...item,
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Fetch default templates
 */
export async function getDefaultTemplates(): Promise<Template[]> {
  return fetchDefaultData<Template>('templates');
}

/**
 * Fetch default mentors with quotes
 */
export async function getDefaultMentors(): Promise<Mentor[]> {
  return fetchDefaultData<Mentor>('mentors');
}

/**
 * Fetch sample roadmap data for roadmap creation
 */
export async function getSampleRoadmapData(): Promise<RoadmapPhase[]> {
  const phases = await fetchDefaultData<RoadmapPhase>('sampleRoadmap');

  // Recompute dates relative to now
  const getISODateString = (daysFromNow: number = 0): string => {
    const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0] || '';
  };

  return phases.map((phase, index) => {
    const startDay = index === 0 ? 0 : index === 1 ? 7 : 21;
    const endDay = index === 0 ? 7 : index === 1 ? 21 : 42;

    return {
      ...phase,
      startDate: getISODateString(startDay),
      endDate: getISODateString(endDay),
    };
  });
}

/**
 * Preload all default data (call during app initialization if desired)
 * This is optional - data will be lazy-loaded on first access anyway
 */
export async function preloadAllDefaults(): Promise<void> {
  await Promise.all([
    getDefaultTags(),
    getDefaultSpaces(),
    getDefaultRssFeeds(),
    getDefaultMentors(),
    getDefaultTemplates(),
  ]);
}

/**
 * Clear the cache (useful for testing or forced refresh)
 */
export function clearDefaultDataCache(): void {
  dataCache.clear();
}

/**
 * Check if default data has been loaded
 */
export function isDefaultDataLoaded(type: string): boolean {
  return dataCache.has(type);
}
