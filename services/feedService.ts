import { loadSettings } from './settingsService';
import * as dataService from './dataService';
import { generateAiFeedItems, generateMentorContent } from './ai';
import { fetchAndParseFeed } from './rssService';
import { fetchNewsForTicker } from './financialsService';
import type { FeedItem, Mentor } from '../types';

// Maximum items to keep per type to prevent storage bloat
const MAX_RSS_ITEMS = 30;
const MAX_SPARK_ITEMS = 30;
const MAX_NEWS_ITEMS = 30;
const MAX_MENTOR_ITEMS = 30;

/**
 * Generates a stable, unique ID for a feed item based on its content.
 * @param {{ guid: string; link?: string; title: string }} feedItem The item to hash.
 * @returns {string} A hashed ID string.
 */
const generateFeedItemId = (feedItem: { guid: string; link?: string; title: string }): string => {
  const content = feedItem.guid || feedItem.link || feedItem.title;
  if (!content) return `feed-item-${Date.now()}-${Math.random()}`; // Fallback for items with no identifier
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `feed-${Math.abs(hash).toString(16)}`;
};

/**
 * Refreshes all data sources concurrently for maximum efficiency.
 * It fetches data from RSS feeds, financial news, AI content generation, and mentors in parallel.
 * Failed fetches from one source will not block others.
 * @returns {Promise<FeedItem[]>} A promise that resolves to an array of all newly fetched items.
 */
export const refreshAllFeeds = async (): Promise<FeedItem[]> => {
  const settings = loadSettings();
  const [allFeeds, existingItems, allMentors, watchlist] = await Promise.all([
    dataService.getFeeds(),
    dataService.getFeedItems(),
    dataService.getMentors(),
    dataService.getWatchlist(),
  ]);
  const existingItemIds = new Set(existingItems.map(item => item.id));
  const allNewItems: FeedItem[] = [];

  const promises: Promise<any>[] = [];

  // 1. AI Content Generation
  console.log(`[Feed Refresh] AI Sparks: ${settings.aiFeedSettings.isEnabled ? 'enabled' : 'disabled'} (${settings.aiFeedSettings.itemsPerRefresh} per refresh)`);
  console.log(`[Feed Refresh] RSS Feeds: ${allFeeds.length} sources`);

  if (settings.aiFeedSettings.isEnabled && settings.aiFeedSettings.itemsPerRefresh > 0) {
    promises.push(
      generateAiFeedItems(
        settings.aiFeedSettings,
        existingItems.map(i => i.title)
      ).then(generatedData => {
        return generatedData.map((itemData, index) => ({
          id: `ai-${Date.now()}-${index}`,
          type: 'spark' as const,
          title: itemData.title,
          content: itemData.summary_he,
          summary_ai: itemData.summary_he,
          insights: itemData.insights,
          topics: itemData.topics,
          tags: itemData.tags.map(t => ({ id: t, name: t })),
          level: itemData.level,
          estimated_read_time_min: itemData.estimated_read_time_min,
          digest: itemData.digest,
          is_read: false,
          is_spark: true,
          createdAt: new Date().toISOString(),
          source: 'AI_GENERATED',
          source_trust_score: 95,
        }));
      })
    );
  }

  // 2. RSS Feeds - Fetch up to 30 per feed
  allFeeds.forEach(feed => {
    promises.push(
      fetchAndParseFeed(feed.url).then(parsedFeed =>
        parsedFeed.items.slice(0, MAX_RSS_ITEMS).map(item => ({
          id: generateFeedItemId(item),
          type: 'rss' as const,
          title: item.title,
          link: item.link,
          content: item.content,
          is_read: false,
          is_spark: false,
          tags: [],
          createdAt: new Date(item.pubDate).toISOString(),
          source: feed.id,
        }))
      )
    );
  });

  // 3. Financial News
  watchlist.forEach(item => {
    promises.push(
      fetchNewsForTicker(item.ticker, item.type).then(newsItems =>
        newsItems.map(news => ({
          id: `news-${news.id}`,
          type: 'news' as const,
          title: news.headline,
          link: news.url,
          content: news.summary,
          is_read: false,
          is_spark: false,
          tags: [{ id: item.ticker, name: item.ticker }],
          createdAt: new Date(news.datetime * 1000).toISOString(),
          source: item.ticker,
        }))
      )
    );
  });

  // Execute all fetches in parallel and handle results
  const results = await Promise.allSettled(promises);

  results.forEach(result => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      result.value.forEach((newItem: FeedItem) => {
        if (!existingItemIds.has(newItem.id)) {
          allNewItems.push(newItem);
          existingItemIds.add(newItem.id);
        }
      });
    } else if (result.status === 'rejected') {
      console.error('A data source failed to refresh:', result.reason);
    }
  });

  // 4. Mentor Feeds (sync, no network) - With Smart Quote Rotation
  const enabledMentors = allMentors.filter(m => settings.enabledMentorIds.includes(m.id));
  const today = new Date().toDateString();

  // Helper: Get shown quote indices for a mentor from localStorage
  const getShownQuoteIndices = (mentorId: string): number[] => {
    try {
      const stored = localStorage.getItem(`mentor_shown_quotes_${mentorId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper: Save shown quote indices
  const saveShownQuoteIndex = (mentorId: string, index: number, totalQuotes: number) => {
    try {
      let shown = getShownQuoteIndices(mentorId);
      // Reset if all quotes have been shown
      if (shown.length >= totalQuotes - 1) {
        shown = [];
      }
      shown.push(index);
      localStorage.setItem(`mentor_shown_quotes_${mentorId}`, JSON.stringify(shown));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Helper: Get a random unseen quote index
  const getUnseenQuoteIndex = (mentorId: string, totalQuotes: number): number => {
    const shownIndices = new Set(getShownQuoteIndices(mentorId));
    const unseenIndices = Array.from({ length: totalQuotes }, (_, i) => i)
      .filter(i => !shownIndices.has(i));

    if (unseenIndices.length === 0) {
      // All shown, pick random
      return Math.floor(Math.random() * totalQuotes);
    }

    // Pick random from unseen
    const randomUnseen = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
    return randomUnseen ?? 0;
  };

  for (const mentor of enabledMentors) {
    if (mentor.quotes?.length > 0) {
      const hasPostedToday = existingItems.some(
        item =>
          item.source === `mentor:${mentor.id}` && new Date(item.createdAt).toDateString() === today
      );
      if (!hasPostedToday) {
        // Smart rotation: pick from unseen quotes
        const quoteIndex = getUnseenQuoteIndex(mentor.id, mentor.quotes.length);
        const quote = mentor.quotes[quoteIndex];
        saveShownQuoteIndex(mentor.id, quoteIndex, mentor.quotes.length);

        const newItem: FeedItem = {
          id: `mentor-${mentor.id}-${new Date().toISOString().split('T')[0]}`,
          type: 'mentor',
          title: `ציטוט מאת ${mentor.name}`,
          content: quote || '',
          is_read: false,
          is_spark: false,
          tags: [],
          createdAt: new Date().toISOString(),
          source: `mentor:${mentor.id}`,
        };
        if (!existingItemIds.has(newItem.id)) allNewItems.push(newItem);
      }
    }
  }


  // Save all newly collected items to the database in one batch
  if (allNewItems.length > 0) {
    await dataService.saveFeedItems(allNewItems);
  }

  // Cleanup: Remove old items if we exceed limits per type
  await cleanupOldFeedItems();

  return allNewItems;
};

/**
 * Cleans up old feed items when exceeding the maximum per type.
 * Keeps the most recent items and removes older ones.
 */
const cleanupOldFeedItems = async (): Promise<void> => {
  try {
    const allItems = await dataService.getFeedItems();
    const itemsToDelete: string[] = [];

    // Group items by type
    const itemsByType: Record<string, FeedItem[]> = {};
    for (const item of allItems) {
      const type = item.type || 'other';
      if (!itemsByType[type]) itemsByType[type] = [];
      itemsByType[type].push(item);
    }

    // Get limits per type
    const limits: Record<string, number> = {
      rss: MAX_RSS_ITEMS,
      spark: MAX_SPARK_ITEMS,
      news: MAX_NEWS_ITEMS,
      mentor: MAX_MENTOR_ITEMS,
    };

    // Find items to delete
    for (const [type, items] of Object.entries(itemsByType)) {
      const limit = limits[type] || 50; // Default limit for unknown types
      if (items.length > limit) {
        // Sort by createdAt descending (newest first)
        const sorted = items.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Mark items beyond the limit for deletion
        const toDelete = sorted.slice(limit);
        itemsToDelete.push(...toDelete.map(i => i.id));
      }
    }

    // Delete old items
    if (itemsToDelete.length > 0) {
      console.log(`[Feed Cleanup] Removing ${itemsToDelete.length} old items`);
      await Promise.all(itemsToDelete.map(id => dataService.removeFeedItem(id)));
    }
  } catch (error) {
    console.error('[Feed Cleanup] Error during cleanup:', error);
  }
};

export const addCustomMentor = async (name: string): Promise<Mentor> => {
  const quotes = await generateMentorContent(name);
  if (quotes.length === 0) throw new Error('Could not generate content for this mentor.');
  const newMentor: Mentor = {
    id: `custom-${Date.now()}`,
    name,
    description: 'Custom AI-powered mentor',
    isCustom: true,
    quotes,
  };
  await dataService.reAddCustomMentor(newMentor);
  return newMentor;
};

export const refreshMentorContent = async (mentorId: string): Promise<Mentor> => {
  const mentors = await dataService.getMentors();
  const mentor = mentors.find(m => m.id === mentorId);
  if (!mentor || !mentor.isCustom) throw new Error('Mentor not found or not a custom mentor.');
  const newQuotes = await generateMentorContent(mentor.name);
  if (newQuotes.length === 0) throw new Error('Could not refresh content.');
  const updatedMentor = { ...mentor, quotes: newQuotes };
  await dataService.reAddCustomMentor(updatedMentor);
  return updatedMentor;
};
