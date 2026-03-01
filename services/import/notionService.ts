/**
 * Notion Import Service
 * Handles fetching data from Notion API and converting to PersonalItem format
 * 
 * Note: Notion requires OAuth for full access. This implementation uses
 * an internal integration token which can be created at notion.so/my-integrations
 */

import type { PersonalItem } from '../../types';

// Notion API types
interface NotionUser {
    object: 'user';
    id: string;
    name?: string;
}

interface NotionDatabase {
    object: 'database';
    id: string;
    title: Array<{ text: { content: string } }>;
    icon?: { emoji?: string; external?: { url: string } };
    description?: Array<{ text: { content: string } }>;
}

interface NotionPage {
    object: 'page';
    id: string;
    created_time: string;
    last_edited_time: string;
    parent: { type: string; database_id?: string };
    icon?: { emoji?: string; external?: { url: string } };
    properties: Record<string, NotionProperty>;
}

interface NotionProperty {
    type: string;
    title?: Array<{ text: { content: string } }>;
    rich_text?: Array<{ text: { content: string } }>;
    checkbox?: boolean;
    date?: { start: string | null; end: string | null };
    select?: { name: string; color?: string };
    multi_select?: Array<{ name: string; color?: string }>;
    status?: { name: string; color?: string };
    number?: number;
    url?: string;
    email?: string;
    phone_number?: string;
    people?: NotionUser[];
    files?: Array<{ name: string; file?: { url: string }; external?: { url: string } }>;
    relation?: Array<{ id: string }>;
    formula?: { type: string; string?: string; number?: number; boolean?: boolean; date?: { start: string } };
}

// API Constants
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Helper: Make authenticated request to Notion API
async function notionRequest(
    endpoint: string,
    token: string,
    method: 'GET' | 'POST' = 'GET',
    body?: object
): Promise<any> {
    const response = await fetch(`${NOTION_API_BASE}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Notion API Error: ${error.message || response.statusText}`);
    }

    return response.json();
}

/**
 * Verify if the integration token is valid
 */
export async function verifyNotionToken(token: string): Promise<{ valid: boolean; userInfo?: { name: string }; error?: string }> {
    try {
        const response = await notionRequest('/users/me', token);
        return {
            valid: true,
            userInfo: { name: response.name || response.bot?.owner?.user?.name || 'Unknown' },
        };
    } catch (error) {
        return {
            valid: false,
            error: error instanceof Error ? error.message : 'Token verification failed',
        };
    }
}

/**
 * Fetch all databases the integration has access to
 */
export async function fetchNotionDatabases(token: string): Promise<NotionDatabase[]> {
    const response = await notionRequest('/search', token, 'POST', {
        filter: { property: 'object', value: 'database' },
    });
    return response.results as NotionDatabase[];
}

/**
 * Query items from a specific database
 */
export async function fetchDatabaseItems(
    token: string,
    databaseId: string,
    startCursor?: string
): Promise<{ pages: NotionPage[]; hasMore: boolean; nextCursor?: string }> {
    const body: any = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;

    const response = await notionRequest(`/databases/${databaseId}/query`, token, 'POST', body);

    return {
        pages: response.results as NotionPage[],
        hasMore: response.has_more,
        nextCursor: response.next_cursor,
    };
}

/**
 * Get all items from a database (handles pagination)
 */
export async function fetchAllDatabaseItems(token: string, databaseId: string): Promise<NotionPage[]> {
    const allPages: NotionPage[] = [];
    let cursor: string | undefined;

    do {
        const { pages, hasMore, nextCursor } = await fetchDatabaseItems(token, databaseId, cursor);
        allPages.push(...pages);
        cursor = hasMore ? nextCursor : undefined;
    } while (cursor);

    return allPages;
}

/**
 * Extract text from Notion rich text array
 */
function extractText(richText?: Array<{ text: { content: string } }>): string {
    return richText?.map(rt => rt.text.content).join('') || '';
}

/**
 * Map Notion priority/status to SparkOS priority
 */
function mapPriority(value?: string): 'low' | 'medium' | 'high' {
    if (!value) return 'medium';
    const lower = value.toLowerCase();
    if (lower.includes('high') || lower.includes('urgent') || lower.includes('גבוה')) return 'high';
    if (lower.includes('low') || lower.includes('נמוך')) return 'low';
    return 'medium';
}

/**
 * Convert a Notion page to a SparkOS PersonalItem
 */
export function convertNotionPageToPersonalItem(page: NotionPage): PersonalItem {
    const props = page.properties;

    // Find title - usually in 'Name', 'Title', or 'שם' property
    let title = '';
    for (const key of ['Name', 'Title', 'name', 'title', 'שם', 'כותרת']) {
        if (props[key]?.title) {
            title = extractText(props[key].title);
            if (title) break;
        }
    }

    // Find content/notes - usually 'Notes', 'Description', 'Content'
    let content = '';
    for (const key of ['Notes', 'Description', 'Content', 'תיאור', 'הערות']) {
        if (props[key]?.rich_text) {
            content = extractText(props[key].rich_text);
            if (content) break;
        }
    }

    // Find due date
    let dueDate: string | undefined;
    for (const key of ['Due', 'Date', 'Due Date', 'תאריך', 'תאריך יעד']) {
        if (props[key]?.date?.start) {
            dueDate = props[key].date!.start;
            break;
        }
    }

    // Find completion status
    let isCompleted = false;
    for (const key of ['Done', 'Completed', 'Status', 'סטטוס', 'הושלם']) {
        if (props[key]?.checkbox !== undefined) {
            isCompleted = props[key].checkbox!;
            break;
        }
        if (props[key]?.status?.name) {
            const status = props[key].status!.name.toLowerCase();
            isCompleted = status.includes('done') || status.includes('complete') || status.includes('הושלם');
            break;
        }
    }

    // Find priority
    let priority: 'low' | 'medium' | 'high' = 'medium';
    for (const key of ['Priority', 'עדיפות']) {
        if (props[key]?.select?.name) {
            priority = mapPriority(props[key].select!.name);
            break;
        }
    }

    // Find tags
    const tags: string[] = [];
    for (const key of ['Tags', 'Labels', 'תגיות']) {
        if (props[key]?.multi_select) {
            tags.push(...props[key].multi_select!.map(t => t.name));
            break;
        }
    }

    // Determine item type
    const type: PersonalItem['type'] = dueDate ? 'task' : 'note';

    return {
        id: `notion_${page.id.replace(/-/g, '')}`,
        type,
        title: title || 'Untitled',
        content,
        createdAt: page.created_time,
        updatedAt: page.last_edited_time,
        isCompleted,
        priority,
        dueDate,
        tags,
        subTasks: [],
        order: 0,
    };
}

/**
 * Import all items from a Notion database
 */
export async function importFromNotionDatabase(
    token: string,
    databaseId: string
): Promise<PersonalItem[]> {
    const pages = await fetchAllDatabaseItems(token, databaseId);
    return pages.map(convertNotionPageToPersonalItem);
}

/**
 * Get database title helper
 */
export function getDatabaseTitle(db: NotionDatabase): string {
    return db.title?.[0]?.text?.content || 'Untitled Database';
}

/**
 * Get database icon helper
 */
export function getDatabaseIcon(db: NotionDatabase): string {
    return db.icon?.emoji || '📋';
}
