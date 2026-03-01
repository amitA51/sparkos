/**
 * AI Search Service Module
 * 
 * Handles semantic search and related items discovery using Gemini AI.
 */

import { Type } from '@google/genai';
import type { FeedItem, PersonalItem } from '../../types';
import { loadSettings } from '../settingsService';
import { ai, parseAiJson } from './geminiClient';
import { withRateLimit } from './rateLimiter';

// ============================================================================
// Types
// ============================================================================

interface AiSearchResult {
    answer: string | null;
    itemIds: string[];
}

interface RelatedItemsResult {
    relatedItemIds: string[];
}

// ============================================================================
// Search Functions
// ============================================================================

/**
 * Performs a semantic search over all items using the Gemini API.
 * @param query The user's search query.
 * @param allItems The corpus of items to search through.
 * @returns An object containing the AI's synthesized answer and an array of relevant item IDs.
 */
export const performAiSearch = async (
    query: string,
    allItems: FeedItem[]
): Promise<AiSearchResult> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    // Token optimization: 100 items × 150 chars = ~70% reduction vs original
    const corpus = allItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 100)
        .map(item => ({
            i: item.id,                                          // Short key: id
            t: item.title.slice(0, 80),                          // Short key: title (truncated)
            s: (item.summary_ai || item.content).slice(0, 150),  // Short key: summary (truncated)
            g: item.tags.slice(0, 3).map(t => t.name),           // Short key: tags (max 3)
        }));

    // Optimized prompt: concise instructions, compact format
    const prompt = `Role: Semantic search engine for Hebrew knowledge base.

Task: Find relevant items for query, optionally synthesize answer.

Corpus format: {i:id, t:title, s:summary, g:tags[]}

Output: {"answer": string|null (Hebrew, Markdown), "itemIds": string[] (up to 15, by relevance)}

Query: "${query}"
Corpus: ${JSON.stringify(corpus)}`;

    return withRateLimit(async () => {
        const response = await ai!.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });
        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        return parseAiJson<AiSearchResult>(text);
    });
};

/**
 * Universal AI search across all item types.
 */
export const universalAiSearch = async (
    query: string,
    searchCorpus: { id: string; type: string; title: string; content: string; date: string }[]
): Promise<{ answer: string; sourceIds: string[] }> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();

    // Token optimization: compact corpus with short keys
    const compactCorpus = searchCorpus.slice(0, 100).map(item => ({
        i: item.id,
        y: item.type[0], // First letter of type
        t: item.title.slice(0, 80),
        s: item.content.slice(0, 150),
    }));

    const prompt = `Role: Universal search for Hebrew knowledge base (tasks, notes, articles, events).

Corpus format: {i:id, y:type, t:title, s:content}
Output: {"answer": Hebrew Markdown, "sourceIds": string[] (up to 15)}

Query: "${query}"
Corpus: ${JSON.stringify(compactCorpus)}`;

    return withRateLimit(async () => {
        const response = await ai!.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        answer: { type: Type.STRING },
                        sourceIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['answer', 'sourceIds'],
                },
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        return JSON.parse(text) as { answer: string; sourceIds: string[] };
    });
};

/**
 * Finds feed items related to a given item using the Gemini API.
 */
export const findRelatedItems = async (
    currentItem: FeedItem,
    allItems: FeedItem[]
): Promise<FeedItem[]> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    // Token optimization: limit corpus and content length
    const corpus = allItems
        .filter(item => item.id !== currentItem.id)
        .slice(0, 100)
        .map(item => ({
            i: item.id,
            t: item.title.slice(0, 60),
            s: (item.summary_ai || item.content).slice(0, 100),
        }));

    const prompt = `Find 3 items most semantically related to: "${currentItem.title}"

Format: {i:id, t:title, s:summary}
Output: {"relatedItemIds": string[3]}

Corpus: ${JSON.stringify(corpus)}`;

    try {
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });

        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        const result = parseAiJson<RelatedItemsResult>(text);
        const relatedIds = new Set(result.relatedItemIds);
        return allItems.filter(item => relatedIds.has(item.id));
    } catch (error) {
        console.error('Error finding related items:', error);
        return [];
    }
};

/**
 * Finds personal items related to a given item using the Gemini API.
 */
export const findRelatedPersonalItems = async (
    currentItem: PersonalItem,
    allItems: PersonalItem[]
): Promise<PersonalItem[]> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    const corpus = allItems
        .filter(item => item.id !== currentItem.id)
        .map(item => ({
            id: item.id,
            type: item.type,
            title: item.title,
            content: (item.content || '').substring(0, 300),
        }));

    const prompt = `You are a smart content recommender for a personal knowledge base. Based on the "Current Item" provided, find the 3 most semantically relevant items from the "Corpus of Items".
Look for thematic connections, related concepts, or items that might be part of the same project, even if not explicitly linked.
Respond with a JSON object containing a single key "relatedItemIds", which is an array of the top 3 most relevant item IDs.

Current Item:
${JSON.stringify({ type: currentItem.type, title: currentItem.title, content: (currentItem.content || '').substring(0, 500) })}

Corpus of Items:
${JSON.stringify(corpus.slice(0, 200))} // Limit corpus size

Respond ONLY with the JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });

        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        const result = parseAiJson<RelatedItemsResult>(text);
        const relatedIds = new Set(result.relatedItemIds);
        return allItems.filter(item => relatedIds.has(item.id));
    } catch (error) {
        console.error('Error finding related personal items:', error);
        return [];
    }
};
