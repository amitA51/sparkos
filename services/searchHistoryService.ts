/**
 * Search History Service
 * Manages local storage persistence for recent search queries.
 */

const STORAGE_KEY = 'spark_search_history';
const MAX_HISTORY = 10;

/**
 * Saves a query to the search history.
 * Removes duplicates and keeps only the most recent ones.
 */
export const saveSearchQuery = (query: string) => {
    if (!query || query.trim().length === 0) return;

    const cleanQuery = query.trim();
    const currentHistory = getSearchHistory();

    // Remove if exists (to bring to top)
    const filtered = currentHistory.filter(q => q !== cleanQuery);

    // Add to front
    const newHistory = [cleanQuery, ...filtered].slice(0, MAX_HISTORY);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error('Failed to save search history', e);
    }
};

/**
 * Retrieves the search history.
 */
export const getSearchHistory = (): string[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse search history', e);
        return [];
    }
};

/**
 * Removes a specific query from history.
 */
export const removeFromHistory = (query: string) => {
    const currentHistory = getSearchHistory();
    const newHistory = currentHistory.filter(q => q !== query);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error('Failed to update search history', e);
    }
};

/**
 * Clears all search history.
 */
export const clearSearchHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
