/**
 * Text Utilities for Feed Content Processing
 * 
 * Provides functions to clean and sanitize text content from RSS feeds
 * and other sources for safe, readable display.
 */

/**
 * Common HTML entities that need to be decoded
 */
const HTML_ENTITIES: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&mdash;': '\u2014', // em dash
    '&ndash;': '\u2013', // en dash
    '&hellip;': '\u2026', // ellipsis
    '&copy;': '\u00A9', // copyright
    '&reg;': '\u00AE', // registered
    '&trade;': '\u2122', // trademark
    '&bull;': '\u2022', // bullet
    '&lsquo;': '\u2018', // left single quote
    '&rsquo;': '\u2019', // right single quote
    '&ldquo;': '\u201C', // left double quote
    '&rdquo;': '\u201D', // right double quote
};

/**
 * Decode HTML entities in a string
 * SSR-safe implementation that doesn't rely on DOM
 */
function decodeHtmlEntities(text: string): string {
    if (!text) return '';

    let decoded = text;

    // Replace named entities
    for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
        decoded = decoded.replace(new RegExp(entity, 'gi'), char);
    }

    // Replace numeric entities (decimal: &#123; and hex: &#x7B;)
    decoded = decoded.replace(/&#(\d+);/g, (_, code) => {
        const num = parseInt(code, 10);
        return num > 0 && num < 65536 ? String.fromCharCode(num) : '';
    });

    decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
        const num = parseInt(code, 16);
        return num > 0 && num < 65536 ? String.fromCharCode(num) : '';
    });

    return decoded;
}

/**
 * Strip HTML tags and decode HTML entities from a string.
 * 
 * This function is SSR-safe and works without DOM access.
 * For use in displaying clean, readable text from RSS/news content.
 * 
 * @param html - The HTML string to clean
 * @returns Clean plain text with entities decoded
 * 
 * @example
 * stripHtmlAndDecodeEntities('<p>Hello &amp; World</p>');
 * // Returns: 'Hello & World'
 */
export function stripHtmlAndDecodeEntities(html: string): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    let text = html;

    // Remove script and style tags with their contents
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Convert block elements to newlines for proper paragraph separation
    text = text.replace(/<\/?(p|div|br|h[1-6]|li|tr)[^>]*>/gi, '\n');

    // Remove remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = decodeHtmlEntities(text);

    // Normalize whitespace
    // - Replace multiple spaces with single space
    // - Replace multiple newlines with double newline (paragraph break)
    // - Trim leading/trailing whitespace
    text = text
        .replace(/[ \t]+/g, ' ')          // Multiple spaces -> single space
        .replace(/\n\s*\n/g, '\n\n')      // Normalize paragraph breaks
        .replace(/^\s+|\s+$/gm, '')       // Trim each line
        .replace(/\n{3,}/g, '\n\n')       // Max 2 consecutive newlines
        .trim();

    return text;
}

/**
 * Truncate text to a maximum length, preserving whole words.
 * 
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 280)
 * @param suffix - Suffix to add if truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(
    text: string,
    maxLength: number = 280,
    suffix: string = '...'
): string {
    if (!text || text.length <= maxLength) {
        return text || '';
    }

    // Find last space before maxLength
    const truncated = text.slice(0, maxLength - suffix.length);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.7) {
        return truncated.slice(0, lastSpace) + suffix;
    }

    return truncated + suffix;
}
