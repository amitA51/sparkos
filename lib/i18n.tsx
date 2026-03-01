/**
 * Internationalization (i18n) Infrastructure
 * 
 * A lightweight, type-safe translation system with:
 * - RTL/LTR support
 * - Pluralization
 * - Interpolation
 * - Nested keys
 * - React hooks integration
 * - Date/Number formatting
 */

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

/** Supported locales */
export type Locale = 'he' | 'en';

/** Text direction */
export type Direction = 'rtl' | 'ltr';

/** Translation value - can be string or nested object */
export type TranslationValue = string | { [key: string]: TranslationValue };

/** Translation dictionary */
export type TranslationDictionary = Record<string, TranslationValue>;

/** Plural forms */
export interface PluralForms {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/** Interpolation values */
export type InterpolationValues = Record<string, string | number>;

/** Locale configuration */
export interface LocaleConfig {
  locale: Locale;
  direction: Direction;
  displayName: string;
  dateFormat: Intl.DateTimeFormatOptions;
  numberFormat: Intl.NumberFormatOptions;
  currencyFormat: Intl.NumberFormatOptions;
}

// ============================================================================
// Locale Configurations
// ============================================================================

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  he: {
    locale: 'he',
    direction: 'rtl',
    displayName: 'עברית',
    dateFormat: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    currencyFormat: {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  en: {
    locale: 'en',
    direction: 'ltr',
    displayName: 'English',
    dateFormat: {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
    numberFormat: {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
    currencyFormat: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
};

// ============================================================================
// Hebrew Translations
// ============================================================================

const hebrewTranslations: TranslationDictionary = {
  common: {
    save: 'שמור',
    cancel: 'ביטול',
    delete: 'מחק',
    edit: 'ערוך',
    add: 'הוסף',
    close: 'סגור',
    confirm: 'אישור',
    back: 'חזרה',
    next: 'הבא',
    previous: 'הקודם',
    search: 'חיפוש',
    filter: 'סינון',
    sort: 'מיון',
    loading: 'טוען...',
    error: 'שגיאה',
    success: 'הצלחה',
    warning: 'אזהרה',
    info: 'מידע',
    yes: 'כן',
    no: 'לא',
    all: 'הכל',
    none: 'ללא',
    more: 'עוד',
    less: 'פחות',
    refresh: 'רענן',
    retry: 'נסה שוב',
    submit: 'שלח',
    reset: 'איפוס',
    clear: 'נקה',
    done: 'סיום',
    create: 'צור',
    update: 'עדכן',
    view: 'צפה',
    share: 'שתף',
    copy: 'העתק',
    copied: 'הועתק!',
    today: 'היום',
    yesterday: 'אתמול',
    tomorrow: 'מחר',
    now: 'עכשיו',
  },
  
  navigation: {
    home: 'בית',
    tasks: 'משימות',
    habits: 'הרגלים',
    calendar: 'יומן',
    ideas: 'רעיונות',
    workouts: 'אימונים',
    rss: 'קורא RSS',
    passwords: 'סיסמאות',
    investments: 'השקעות',
    settings: 'הגדרות',
    profile: 'פרופיל',
    notifications: 'התראות',
  },
  
  tasks: {
    title: 'משימות',
    addTask: 'הוסף משימה',
    editTask: 'ערוך משימה',
    deleteTask: 'מחק משימה',
    taskName: 'שם המשימה',
    dueDate: 'תאריך יעד',
    priority: 'עדיפות',
    priorityHigh: 'גבוהה',
    priorityMedium: 'בינונית',
    priorityLow: 'נמוכה',
    status: 'סטטוס',
    statusPending: 'ממתין',
    statusInProgress: 'בביצוע',
    statusCompleted: 'הושלם',
    noTasks: 'אין משימות',
    completedToday: 'הושלמו היום',
    overdue: 'באיחור',
    upcoming: 'קרובות',
  },
  
  habits: {
    title: 'הרגלים',
    addHabit: 'הוסף הרגל',
    editHabit: 'ערוך הרגל',
    deleteHabit: 'מחק הרגל',
    habitName: 'שם ההרגל',
    frequency: 'תדירות',
    daily: 'יומי',
    weekly: 'שבועי',
    streak: 'רצף',
    completed: 'הושלם',
    skipped: 'דולג',
    missed: 'פוספס',
    noHabits: 'אין הרגלים',
  },
  
  calendar: {
    title: 'יומן',
    addEvent: 'הוסף אירוע',
    editEvent: 'ערוך אירוע',
    deleteEvent: 'מחק אירוע',
    eventName: 'שם האירוע',
    startTime: 'שעת התחלה',
    endTime: 'שעת סיום',
    allDay: 'כל היום',
    location: 'מיקום',
    description: 'תיאור',
    noEvents: 'אין אירועים',
    monthView: 'תצוגת חודש',
    weekView: 'תצוגת שבוע',
    dayView: 'תצוגת יום',
  },
  
  errors: {
    generic: 'משהו השתבש',
    network: 'שגיאת רשת',
    notFound: 'לא נמצא',
    unauthorized: 'לא מורשה',
    forbidden: 'גישה נדחתה',
    validation: 'נתונים לא תקינים',
    serverError: 'שגיאת שרת',
    timeout: 'הזמן הקצוב עבר',
    offline: 'אין חיבור לאינטרנט',
    tryAgain: 'נסה שוב',
    goBack: 'חזור',
    goHome: 'חזור לדף הבית',
  },
  
  time: {
    seconds: 'שניות',
    minutes: 'דקות',
    hours: 'שעות',
    days: 'ימים',
    weeks: 'שבועות',
    months: 'חודשים',
    years: 'שנים',
    ago: 'לפני',
    justNow: 'הרגע',
  },
  
  accessibility: {
    skipToContent: 'דלג לתוכן',
    openMenu: 'פתח תפריט',
    closeMenu: 'סגור תפריט',
    expand: 'הרחב',
    collapse: 'כווץ',
    selected: 'נבחר',
    notSelected: 'לא נבחר',
    required: 'שדה חובה',
    optional: 'אופציונלי',
    newWindow: 'נפתח בחלון חדש',
    externalLink: 'קישור חיצוני',
  },
};

// ============================================================================
// English Translations
// ============================================================================

const englishTranslations: TranslationDictionary = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    more: 'More',
    less: 'Less',
    refresh: 'Refresh',
    retry: 'Retry',
    submit: 'Submit',
    reset: 'Reset',
    clear: 'Clear',
    done: 'Done',
    create: 'Create',
    update: 'Update',
    view: 'View',
    share: 'Share',
    copy: 'Copy',
    copied: 'Copied!',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    now: 'Now',
  },
  
  navigation: {
    home: 'Home',
    tasks: 'Tasks',
    habits: 'Habits',
    calendar: 'Calendar',
    ideas: 'Ideas',
    workouts: 'Workouts',
    rss: 'RSS Reader',
    passwords: 'Passwords',
    investments: 'Investments',
    settings: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
  },
  
  tasks: {
    title: 'Tasks',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    taskName: 'Task Name',
    dueDate: 'Due Date',
    priority: 'Priority',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    status: 'Status',
    statusPending: 'Pending',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    noTasks: 'No tasks',
    completedToday: 'Completed today',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
  },
  
  errors: {
    generic: 'Something went wrong',
    network: 'Network error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized',
    forbidden: 'Access denied',
    validation: 'Invalid data',
    serverError: 'Server error',
    timeout: 'Request timeout',
    offline: 'No internet connection',
    tryAgain: 'Try again',
    goBack: 'Go back',
    goHome: 'Go home',
  },
  
  time: {
    seconds: 'seconds',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
    ago: 'ago',
    justNow: 'just now',
  },
};

// ============================================================================
// Translation Store
// ============================================================================

const translations: Record<Locale, TranslationDictionary> = {
  he: hebrewTranslations,
  en: englishTranslations,
};

// ============================================================================
// Core Translation Functions
// ============================================================================

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: TranslationDictionary, path: string): string | undefined {
  const keys = path.split('.');
  let current: TranslationValue | undefined = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || typeof current === 'string') {
      return undefined;
    }
    current = (current as Record<string, TranslationValue>)[key];
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate variables into a translation string
 */
function interpolate(text: string, values: InterpolationValues = {}): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

/**
 * Get plural form for a count
 */
function getPluralForm(count: number, forms: PluralForms, locale: Locale): string {
  if (locale === 'he') {
    if (count === 0 && forms.zero) return forms.zero;
    if (count === 1) return forms.one;
    if (count === 2 && forms.two) return forms.two;
    return forms.other;
  }
  
  if (count === 0 && forms.zero) return forms.zero;
  if (count === 1) return forms.one;
  return forms.other;
}

/**
 * Translate a key
 */
export function translate(
  locale: Locale,
  key: string,
  values?: InterpolationValues
): string {
  const dictionary = translations[locale] || translations.he;
  const text = getNestedValue(dictionary, key);
  
  if (!text) {
    console.warn(`[i18n] Missing translation for key: ${key} (locale: ${locale})`);
    return key;
  }
  
  return values ? interpolate(text, values) : text;
}

/**
 * Translate with pluralization
 */
export function translatePlural(
  locale: Locale,
  key: string,
  count: number,
  values?: InterpolationValues
): string {
  const dictionary = translations[locale] || translations.he;
  const forms = getNestedValue(dictionary, key);
  
  if (!forms) {
    console.warn(`[i18n] Missing plural translation for key: ${key}`);
    return key;
  }
  
  const parts = forms.split('|');
  const pluralForms: PluralForms = parts.length === 2
    ? { one: parts[0] ?? '', other: parts[1] ?? '' }
    : { zero: parts[0], one: parts[1] ?? '', other: parts[2] ?? '' };
  
  const text = getPluralForm(count, pluralForms, locale);
  return interpolate(text, { count, ...values });
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const config = LOCALE_CONFIGS[locale];
  const formatOptions = options || config.dateFormat;
  
  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

/**
 * Format a number according to locale
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const config = LOCALE_CONFIGS[locale];
  const formatOptions = options || config.numberFormat;
  
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  value: number,
  locale: Locale,
  currency?: string
): string {
  const config = LOCALE_CONFIGS[locale];
  const formatOptions = {
    ...config.currencyFormat,
    currency: currency || config.currencyFormat.currency,
  };
  
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Format relative time
 */
export function formatRelativeTime(
  date: Date,
  locale: Locale
): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (seconds < 60) {
    return rtf.format(-seconds, 'second');
  } else if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 30) {
    return rtf.format(-days, 'day');
  } else {
    return formatDate(date, locale);
  }
}

// ============================================================================
// React Context
// ============================================================================

interface I18nContextValue {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: InterpolationValues) => string;
  tp: (key: string, count: number, values?: InterpolationValues) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatRelativeTime: (date: Date) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Get browser's preferred locale
 */
function getBrowserLocale(): Locale {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'he' ? 'he' : 'en';
}

/**
 * Get stored locale from localStorage
 */
function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem('spark-locale');
    if (stored === 'he' || stored === 'en') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

/**
 * Store locale in localStorage
 */
function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem('spark-locale', locale);
  } catch {
    // localStorage not available
  }
}

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

/**
 * I18n Provider component
 */
export function I18nProvider({ children, defaultLocale = 'he' }: I18nProviderProps): React.ReactElement {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return getStoredLocale() || defaultLocale || getBrowserLocale();
  });
  
  const direction = LOCALE_CONFIGS[locale].direction;
  
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
    storeLocale(locale);
  }, [locale, direction]);
  
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);
  
  const t = useCallback((key: string, values?: InterpolationValues) => {
    return translate(locale, key, values);
  }, [locale]);
  
  const tp = useCallback((key: string, count: number, values?: InterpolationValues) => {
    return translatePlural(locale, key, count, values);
  }, [locale]);
  
  const formatDateFn = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return formatDate(date, locale, options);
  }, [locale]);
  
  const formatNumberFn = useCallback((value: number, options?: Intl.NumberFormatOptions) => {
    return formatNumber(value, locale, options);
  }, [locale]);
  
  const formatCurrencyFn = useCallback((value: number, currency?: string) => {
    return formatCurrency(value, locale, currency);
  }, [locale]);
  
  const formatRelativeTimeFn = useCallback((date: Date) => {
    return formatRelativeTime(date, locale);
  }, [locale]);
  
  const value = useMemo<I18nContextValue>(() => ({
    locale,
    direction,
    setLocale,
    t,
    tp,
    formatDate: formatDateFn,
    formatNumber: formatNumberFn,
    formatCurrency: formatCurrencyFn,
    formatRelativeTime: formatRelativeTimeFn,
  }), [
    locale,
    direction,
    setLocale,
    t,
    tp,
    formatDateFn,
    formatNumberFn,
    formatCurrencyFn,
    formatRelativeTimeFn,
  ]);
  
  return React.createElement(I18nContext.Provider, { value }, children);
}

/**
 * Hook to access i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
}

/**
 * Hook to get translation function only
 */
export function useTranslation() {
  const { t, tp, locale, direction } = useI18n();
  return { t, tp, locale, direction };
}

/**
 * Hook to get formatters only
 */
export function useFormatters() {
  const { formatDate, formatNumber, formatCurrency, formatRelativeTime, locale } = useI18n();
  return { formatDate, formatNumber, formatCurrency, formatRelativeTime, locale };
}

// ============================================================================
// RTL Utilities
// ============================================================================

/**
 * Get RTL-aware CSS property value
 */
export function rtlValue<T>(ltrValue: T, rtlValueParam: T, direction: Direction): T {
  return direction === 'rtl' ? rtlValueParam : ltrValue;
}

/**
 * Get RTL-aware margin/padding classes
 */
export function rtlMargin(direction: Direction) {
  return {
    start: direction === 'rtl' ? 'mr' : 'ml',
    end: direction === 'rtl' ? 'ml' : 'mr',
  };
}

/**
 * Get RTL-aware flex direction
 */
export function rtlFlex(direction: Direction) {
  return {
    row: direction === 'rtl' ? 'flex-row-reverse' : 'flex-row',
    rowReverse: direction === 'rtl' ? 'flex-row' : 'flex-row-reverse',
  };
}

/**
 * RTL-aware text alignment
 */
export function rtlAlign(direction: Direction) {
  return {
    start: direction === 'rtl' ? 'text-right' : 'text-left',
    end: direction === 'rtl' ? 'text-left' : 'text-right',
  };
}

// ============================================================================
// Translation Utilities
// ============================================================================

/**
 * Create a namespaced translation function
 */
export function createNamespacedT(namespace: string, locale: Locale = 'he') {
  return (key: string, values?: InterpolationValues): string => {
    const fullKey = `${namespace}.${key}`;
    return translate(locale, fullKey, values);
  };
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(locale: Locale, key: string): boolean {
  const dictionary = translations[locale];
  return getNestedValue(dictionary, key) !== undefined;
}

/**
 * Get all translation keys for a namespace
 */
export function getTranslationKeys(locale: Locale, namespace: string): string[] {
  const dictionary = translations[locale];
  const namespaceValue = dictionary[namespace];
  
  if (typeof namespaceValue === 'object' && namespaceValue !== null) {
    return Object.keys(namespaceValue);
  }
  
  return [];
}

// ============================================================================
// Export Types
// ============================================================================

export type { I18nContextValue };
