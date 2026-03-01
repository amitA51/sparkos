/**
 * Feed Utility Functions
 *
 * Shared utilities for feed components including image extraction,
 * reading time calculation, and date formatting.
 */

/**
 * Extract the first valid image from HTML content.
 * Filters out tracking pixels and 1x1 images.
 */
export const extractImageFromContent = (content: string): string | null => {
    if (!content) return null;

    // Try to find an img tag first
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) {
        const src = imgMatch[1];
        // Filter out tracking pixels
        if (!src.includes('pixel') && !src.includes('tracking') && !src.includes('1x1')) {
            return src;
        }
    }

    // Try enclosure (common in RSS)
    const mediaMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    if (mediaMatch?.[1]) return mediaMatch[1];

    return null;
};

/**
 * Calculate estimated reading time in minutes.
 * Uses 200 words per minute as average reading speed.
 */
export const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return Math.max(1, Math.min(minutes, 30)); // Clamp between 1-30
};

/**
 * Get favicon URL for a given link using Google's favicon service.
 * Returns empty string if URL is invalid.
 */
export const getFaviconUrl = (link: string): string => {
    if (!link) return '';
    try {
        const url = new URL(link);
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {
        return '';
    }
};

/**
 * Format a date as a relative time string in Hebrew.
 * Returns formatted date for older items.
 */
export const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const itemDate = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - itemDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דק'`;
    if (diffHours < 24) return `לפני ${diffHours} שע'`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;

    // For older items, use formatted date
    return itemDate.toLocaleDateString('he-IL', {
        day: 'numeric',
        month: 'short',
    });
};

/**
 * Extract domain from URL for display purposes.
 * Returns empty string if URL is invalid.
 */
export const extractDomain = (url: string): string => {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return '';
    }
};
