/**
 * AI NLP/Parsing Service Module
 * 
 * Handles natural language processing, text extraction, and input parsing.
 */

import { Type } from '@google/genai';
import type { PersonalItem, Space, NlpResult } from '../../types';
import { loadSettings } from '../settingsService';
import { todayKey } from '../../utils/dateUtils';
import { ai } from './geminiClient';
import { withRateLimit } from './rateLimiter';

// ============================================================================
// Types
// ============================================================================

interface NaturalLanguageTaskResult {
    title: string;
    dueDate: string | null;
}

// ============================================================================
// NLP Functions
// ============================================================================

/**
 * Extracts text from a base64 encoded image using the Gemini API.
 */
export const extractTextFromImage = async (
    base64ImageData: string,
    mimeType: string
): Promise<string> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    const imagePart = {
        inlineData: { data: base64ImageData, mimeType },
    };
    const textPart = {
        text: 'Extract all text from this image, in its original language. Respond only with the extracted text.',
    };

    return withRateLimit(async () => {
        const response = await ai!.models.generateContent({
            model: settings.aiModel,
            contents: { parts: [imagePart, textPart] },
        });
        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        return text;
    });
};

/**
 * Parses a natural language query to extract task details.
 */
export const parseNaturalLanguageTask = async (
    query: string
): Promise<NaturalLanguageTaskResult> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    const today = todayKey();

    const prompt = `You are a smart task parser for a productivity app. Analyze the following text written in Hebrew and extract the task details.
    Today's date is: ${today}.
    - The 'title' should be the core action of the task.
    - The 'dueDate' should be in YYYY-MM-DD format. Interpret relative terms like "מחר", "מחרתיים", "היום", "בעוד 3 ימים", etc., based on today's date. If no date is mentioned, 'dueDate' should be null.
    - Ignore any time of day information.
    
    Text to parse: "${query}"
    
    Respond ONLY with a valid JSON object matching the specified schema.`;

    try {
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'The main title of the task.' },
                        dueDate: {
                            type: Type.STRING,
                            description: 'The due date in YYYY-MM-DD format, or null if not specified.',
                        },
                    },
                    required: ['title', 'dueDate'],
                },
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        const parsed: NaturalLanguageTaskResult = JSON.parse(text);
        return parsed;
    } catch (error) {
        console.error('Error parsing natural language task:', error);
        return { title: query, dueDate: null };
    }
};

/**
 * Smart input parsing with space suggestion.
 */
export const smartParseInput = async (
    query: string,
    spaces: Space[],
    recentItems: PersonalItem[]
): Promise<NlpResult> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    const today = todayKey();

    const spacesContext = spaces
        .filter(s => s.type === 'personal')
        .map(space => {
            const spaceItems = recentItems
                .filter(item => item.spaceId === space.id)
                .slice(0, 5)
                .map(item => item.title);
            return { id: space.id, name: space.name, recentTitles: spaceItems };
        });

    // Optimized prompt: structured format with compact context
    const prompt = `Role: Smart capture assistant for Hebrew productivity app.
Context: date=${today}

Task: Parse input → {type, title, dueDate?, priority?, suggestedSpaceId?}
- type: "task"|"note"|"habit"|"idea" (default: note)
- dueDate: YYYY-MM-DD if mentioned
- priority: "high" if "חשוב"/"דחוף", else "medium"
- suggestedSpaceId: best matching space ID or null

Spaces: ${JSON.stringify(spacesContext.map(s => ({ i: s.id, n: s.name })))}

Input: "${query}"`;

    try {
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['task', 'note', 'habit', 'idea'] },
                        title: { type: Type.STRING },
                        dueDate: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                        suggestedSpaceId: { type: Type.STRING },
                    },
                    required: ['type', 'title'],
                },
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        return JSON.parse(text) as NlpResult;
    } catch (error) {
        console.error('Error parsing smart input:', error);
        return { type: 'note', title: query };
    }
};

/**
 * Parses a natural language voice query to classify and extract item details.
 */
export const parseNaturalLanguageInput = async (query: string): Promise<NlpResult> => {
    if (!ai) throw new Error('API Key not configured.');
    const settings = loadSettings();
    const today = todayKey();

    // Optimized prompt: structured format with examples
    const prompt = `Role: Hebrew NLP parser for productivity app.
Context: date=${today}

Task: Parse voice input → {type, title, dueDate?, priority?}
- type: task ("משימה"/"צריך"/dates) | habit ("הרגל"/"כל יום") | idea ("רעיון") | note (default)
- title: clean, no filler words
- dueDate: YYYY-MM-DD relative to today
- priority: "high" if "חשוב"/"דחוף"

Examples:
"הוסף משימה לקנות חלב למחר" → {"type":"task","title":"לקנות חלב","dueDate":"...+1d","priority":"medium"}
"רעיון לאפליקציה" → {"type":"idea","title":"אפליקציה..."}

Input: "${query}"`;

    try {
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['task', 'note', 'habit', 'idea'] },
                        title: { type: Type.STRING },
                        dueDate: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                    },
                    required: ['type', 'title'],
                },
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error('AI response was empty.');
        }
        return JSON.parse(text) as NlpResult;
    } catch (error) {
        console.error('Error parsing natural language input:', error);
        return { type: 'note', title: query };
    }
};
