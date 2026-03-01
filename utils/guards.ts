/**
 * Guard Clauses & Defensive Utilities
 * 
 * This module provides defensive coding utilities to prevent:
 * - Race conditions (double-submit)
 * - Invalid inputs (NaN, negative numbers)
 * - Empty/null data crashes
 * - URL validation issues
 */

// =============================================================================
// SUBMISSION GUARDS - Prevent double-clicks and race conditions
// =============================================================================

/**
 * Creates a submission guard to prevent double-clicks on buttons.
 * Uses a ref-like pattern for immediate synchronous checks.
 * 
 * @example
 * const submitGuard = createSubmitGuard();
 * 
 * const handleSubmit = async () => {
 *   if (!submitGuard.acquire()) return; // Already submitting
 *   try {
 *     await saveData();
 *   } finally {
 *     submitGuard.release();
 *   }
 * };
 */
export function createSubmitGuard() {
    let isSubmitting = false;

    return {
        /** Try to acquire the lock. Returns false if already locked. */
        acquire: (): boolean => {
            if (isSubmitting) return false;
            isSubmitting = true;
            return true;
        },
        /** Release the lock. Always call this in a finally block. */
        release: (): void => {
            isSubmitting = false;
        },
        /** Check if currently locked without acquiring. */
        isLocked: (): boolean => isSubmitting,
    };
}

// =============================================================================
// NUMERIC INPUT GUARDS - Prevent NaN, negative, and out-of-range values
// =============================================================================

export interface SanitizeNumberOptions {
    /** Minimum allowed value (default: 0) */
    min?: number;
    /** Maximum allowed value (default: Infinity) */
    max?: number;
    /** Fallback value if input is invalid (default: 0) */
    fallback?: number;
    /** Allow decimal numbers (default: true) */
    allowDecimals?: boolean;
}

/**
 * Sanitizes numeric input to prevent NaN, negative, and out-of-range values.
 * 
 * @example
 * sanitizeNumber("100")       // 100
 * sanitizeNumber("📚100")     // 0 (fallback)
 * sanitizeNumber("-5", { min: 0 }) // 0
 * sanitizeNumber("999", { max: 100 }) // 100
 */
export function sanitizeNumber(
    value: unknown,
    options: SanitizeNumberOptions = {}
): number {
    const { min = 0, max = Infinity, fallback = 0, allowDecimals = true } = options;

    // Handle null/undefined
    if (value === null || value === undefined) return fallback;

    // Parse the value
    let num: number;
    if (typeof value === 'string') {
        // Remove non-numeric characters except decimal point and minus
        const cleaned = value.replace(/[^\d.-]/g, '');
        num = allowDecimals ? parseFloat(cleaned) : parseInt(cleaned, 10);
    } else if (typeof value === 'number') {
        num = value;
    } else {
        return fallback;
    }

    // Check for NaN
    if (isNaN(num) || !isFinite(num)) return fallback;

    // Clamp to range
    return Math.max(min, Math.min(max, num));
}

/**
 * Sanitizes an input string for a number field, keeping only valid characters.
 * Use this for controlled inputs to prevent invalid characters from appearing.
 * 
 * @example
 * <input 
 *   value={weight}
 *   onChange={e => setWeight(sanitizeNumericInput(e.target.value))}
 * />
 */
export function sanitizeNumericInput(
    value: string,
    options: { allowDecimals?: boolean; allowNegative?: boolean } = {}
): string {
    const { allowDecimals = true, allowNegative = false } = options;

    const pattern = allowDecimals ? /[^\d.]/g : /[^\d]/g;
    let result = value.replace(pattern, '');

    // Only allow one decimal point
    if (allowDecimals) {
        const parts = result.split('.');
        if (parts.length > 2) {
            result = parts[0] + '.' + parts.slice(1).join('');
        }
    }

    // Handle negative sign
    if (allowNegative && value.startsWith('-')) {
        result = '-' + result;
    }

    return result;
}

// =============================================================================
// URL VALIDATION - Prevent invalid URL crashes
// =============================================================================

/**
 * Validates if a string is a valid HTTP/HTTPS URL.
 * 
 * @example
 * isValidHttpUrl("https://example.com")  // true
 * isValidHttpUrl("not-a-url")            // false
 * isValidHttpUrl("ftp://files.com")      // false
 */
export function isValidHttpUrl(urlString: string): boolean {
    if (!urlString || typeof urlString !== 'string') return false;

    try {
        const url = new URL(urlString.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Attempts to normalize a URL string by adding https:// if missing.
 * Returns null if the result is still not a valid URL.
 */
export function normalizeUrl(urlString: string): string | null {
    if (!urlString || typeof urlString !== 'string') return null;

    let normalized = urlString.trim();

    // Try adding https:// if no protocol
    if (!normalized.match(/^https?:\/\//i)) {
        normalized = 'https://' + normalized;
    }

    return isValidHttpUrl(normalized) ? normalized : null;
}

// =============================================================================
// ARRAY & OBJECT GUARDS - Prevent null/undefined crashes
// =============================================================================

/**
 * Ensures a value is an array, returning empty array for null/undefined.
 * 
 * @example
 * ensureArray(null)        // []
 * ensureArray(undefined)   // []
 * ensureArray([1, 2, 3])   // [1, 2, 3]
 */
export function ensureArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
}

/**
 * Safely accesses a nested property without throwing.
 * Returns the fallback value if any part of the path is null/undefined.
 * 
 * @example
 * safeGet(user, 'profile.settings.theme', 'dark')
 */
export function safeGet<T>(
    obj: unknown,
    path: string,
    fallback: T
): T {
    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current === null || current === undefined) return fallback;
        current = (current as Record<string, unknown>)[key];
    }

    return (current ?? fallback) as T;
}

// =============================================================================
// DATE VALIDATION - Prevent invalid date crashes
// =============================================================================

/**
 * Validates if a date string is in YYYY-MM-DD format.
 */
export function isValidDateString(dateString: string): boolean {
    if (!dateString || typeof dateString !== 'string') return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

/**
 * Safely parses a date string, returning null for invalid dates.
 */
export function safeParseDate(dateString: string): Date | null {
    if (!isValidDateString(dateString)) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}

// =============================================================================
// STRING GUARDS - Prevent overflow and injection
// =============================================================================

/**
 * Truncates a string to a maximum length with optional ellipsis.
 */
export function truncateString(
    str: string,
    maxLength: number,
    ellipsis = '...'
): string {
    if (!str || str.length <= maxLength) return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Validates string length is within bounds.
 */
export function isValidLength(
    str: string,
    options: { min?: number; max?: number } = {}
): boolean {
    const { min = 0, max = Infinity } = options;
    const length = str?.length ?? 0;
    return length >= min && length <= max;
}

// =============================================================================
// CLIPBOARD GUARD - Prevent crashes from clipboard API failures
// =============================================================================

/**
 * Safely copies text to clipboard with error handling.
 * Returns true if successful, false otherwise.
 * 
 * @example
 * const success = await safeClipboardCopy('text to copy');
 * if (success) showToast('הועתק!');
 */
export async function safeClipboardCopy(text: string): Promise<boolean> {
    if (!text || typeof text !== 'string') return false;

    try {
        // Check if clipboard API is available
        if (!navigator.clipboard?.writeText) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                return true;
            } finally {
                document.body.removeChild(textArea);
            }
        }

        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.warn('Failed to copy to clipboard:', error);
        return false;
    }
}

// =============================================================================
// JSON GUARD - Prevent crashes from invalid JSON
// =============================================================================

/**
 * Safely parses JSON with fallback value.
 * 
 * @example
 * const data = safeJSONParse<User[]>(localStorage.getItem('users'), []);
 */
export function safeJSONParse<T>(json: string | null | undefined, fallback: T): T {
    if (!json || typeof json !== 'string') return fallback;

    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}
