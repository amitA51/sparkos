/**
 * Cached Intl.DateTimeFormat formatters for Hebrew locale
 * 
 * ✅ PERF: Creating Intl.DateTimeFormat is expensive (~1-2ms per call).
 * Instead of calling toLocaleDateString() which creates a new formatter each time,
 * we pre-create formatters and reuse them.
 * 
 * Usage:
 *   import { DATE_FORMATTERS, TIME_FORMATTERS } from '../utils/formatters';
 *   DATE_FORMATTERS.shortWeekday.format(date)
 */

// === Date Formatters ===

export const DATE_FORMATTERS = {
    /** Very short: "א", "ב", "ג" */
    narrowWeekday: new Intl.DateTimeFormat('he-IL', { weekday: 'narrow' }),

    /** Short weekday: "יום א׳", "יום ב׳" */
    shortWeekday: new Intl.DateTimeFormat('he-IL', { weekday: 'short' }),

    /** Full weekday: "יום ראשון", "יום שני" */
    longWeekday: new Intl.DateTimeFormat('he-IL', { weekday: 'long' }),

    /** Short date: "21/12" */
    shortDate: new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric' }),

    /** Medium date: "21 בדצמ׳" */
    mediumDate: new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' }),

    /** Full date: "21 בדצמבר 2024" */
    fullDate: new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),

    /** With weekday: "יום שבת, 21 בדצמבר" */
    fullWithWeekday: new Intl.DateTimeFormat('he-IL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }),

    /** ISO date string: "2024-12-21" */
    isoDate: {
        format: (date: Date): string => date.toISOString().split('T')[0]!
    },
} as const;

// === Time Formatters ===

export const TIME_FORMATTERS = {
    /** Short time: "20:09" */
    shortTime: new Intl.DateTimeFormat('he-IL', {
        hour: '2-digit',
        minute: '2-digit'
    }),

    /** Full time with seconds: "20:09:15" */
    fullTime: new Intl.DateTimeFormat('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }),
} as const;

// === Number Formatters ===

export const NUMBER_FORMATTERS = {
    /** Standard number: "1,234" */
    standard: new Intl.NumberFormat('he-IL'),

    /** Currency USD: "$1,234.56" */
    currencyUSD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }),

    /** Currency ILS: "₪1,234.56" */
    currencyILS: new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS'
    }),

    /** Percentage: "25%" */
    percent: new Intl.NumberFormat('he-IL', {
        style: 'percent',
        maximumFractionDigits: 1
    }),
} as const;

// === Helper Functions ===

/**
 * Format a date with error handling
 */
export function formatDate(
    date: Date | string | number | undefined | null,
    formatter: keyof typeof DATE_FORMATTERS = 'mediumDate'
): string {
    if (!date) return '';
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        return DATE_FORMATTERS[formatter].format(d);
    } catch {
        return '';
    }
}

/**
 * Format a time with error handling
 */
export function formatTime(
    date: Date | string | number | undefined | null,
    formatter: keyof typeof TIME_FORMATTERS = 'shortTime'
): string {
    if (!date) return '';
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        return TIME_FORMATTERS[formatter].format(d);
    } catch {
        return '';
    }
}

/**
 * Format a number with error handling
 */
export function formatNumber(
    value: number | undefined | null,
    formatter: keyof typeof NUMBER_FORMATTERS = 'standard'
): string {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return NUMBER_FORMATTERS[formatter].format(value);
}
