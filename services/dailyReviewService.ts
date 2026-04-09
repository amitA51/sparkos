/**
 * Daily Review Service
 *
 * Handles persistence and retrieval of daily review data.
 * Stores reviews in Firestore (users/{userId}/dailyReviews/{date})
 * with localStorage fallback for offline support.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================================================
// Types
// ============================================================================

export interface DailyReviewMood {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  emoji: string;
  influence?: string;
}

export interface DailyReviewStats {
  tasksCompleted: number;
  totalTasks: number;
  habitsCompleted: number;
  totalHabits: number;
  focusMinutes: number;
  articlesRead: number;
  streaksActive: number;
}

export interface DailyReviewData {
  id: string;               // YYYY-MM-DD
  date: string;             // ISO date string
  mood: DailyReviewMood;
  stats: DailyReviewStats;
  wins: string[];           // 3 gratitude/wins items
  tomorrowTasks: string[];  // Quick tasks for tomorrow
  tomorrowPriorities: string[]; // Top 3 priority IDs
  aiInsight?: string;       // AI-generated insight
  productivityScore: number; // 0-100 calculated score
  createdAt: string;        // ISO timestamp
}

// ============================================================================
// Firestore References
// ============================================================================

const getDailyReviewsRef = (userId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return collection(db, `users/${userId}/dailyReviews`);
};

// ============================================================================
// Local Storage Keys
// ============================================================================

const LS_PREFIX = 'spark_daily_review';
const LS_REVIEWS_KEY = `${LS_PREFIX}_data`;
const LS_DISMISSED_KEY = `${LS_PREFIX}_dismissed`;

// ============================================================================
// Helper Functions
// ============================================================================

const getDateId = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0] ?? '';
};

const getLocalReviews = (): Record<string, DailyReviewData> => {
  try {
    const stored = localStorage.getItem(LS_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveLocalReviews = (reviews: Record<string, DailyReviewData>) => {
  try {
    localStorage.setItem(LS_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error('Failed to save reviews to localStorage:', error);
  }
};

// ============================================================================
// Core Service Functions
// ============================================================================

/**
 * Save a daily review to Firestore and localStorage.
 */
export const saveDailyReview = async (
  userId: string,
  review: DailyReviewData
): Promise<void> => {
  // Save to localStorage first (offline support)
  const localReviews = getLocalReviews();
  localReviews[review.id] = review;
  saveLocalReviews(localReviews);

  // Save to Firestore
  try {
    const docRef = doc(getDailyReviewsRef(userId), review.id);
    await setDoc(docRef, {
      ...review,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to save daily review to Firestore:', error);
    // Data is still in localStorage, no throw
  }
};

/**
 * Load a specific day's review.
 */
export const loadDailyReview = async (
  userId: string,
  dateId?: string
): Promise<DailyReviewData | null> => {
  const id = dateId ?? getDateId();

  // Try localStorage first
  const localReviews = getLocalReviews();
  if (localReviews[id]) {
    return localReviews[id] ?? null;
  }

  // Try Firestore
  try {
    const docRef = doc(getDailyReviewsRef(userId), id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data() as DailyReviewData;
      // Cache locally
      localReviews[id] = data;
      saveLocalReviews(localReviews);
      return data;
    }
  } catch (error) {
    console.error('Failed to load daily review from Firestore:', error);
  }

  return null;
};

/**
 * Check if today's review is already done.
 */
export const isTodayReviewDone = (): boolean => {
  const todayId = getDateId();
  const localReviews = getLocalReviews();
  return !!localReviews[todayId];
};

/**
 * Load review history (last N reviews).
 */
export const loadReviewHistory = async (
  userId: string,
  count: number = 30
): Promise<DailyReviewData[]> => {
  // First, get from localStorage
  const localReviews = getLocalReviews();
  const localEntries = Object.values(localReviews)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);

  // Try to augment from Firestore
  try {
    const q = query(
      getDailyReviewsRef(userId),
      orderBy('date', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    const firestoreReviews: DailyReviewData[] = [];
    snapshot.forEach(doc => {
      firestoreReviews.push(doc.data() as DailyReviewData);
    });

    // Merge: Firestore takes precedence
    const merged = new Map<string, DailyReviewData>();
    for (const r of localEntries) merged.set(r.id, r);
    for (const r of firestoreReviews) merged.set(r.id, r);

    // Update local cache
    const updatedLocal = getLocalReviews();
    for (const r of firestoreReviews) {
      updatedLocal[r.id] = r;
    }
    saveLocalReviews(updatedLocal);

    return Array.from(merged.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  } catch {
    // Offline - return local only
    return localEntries;
  }
};

/**
 * Calculate a productivity score from the day's stats.
 */
export const calculateProductivityScore = (stats: DailyReviewStats): number => {
  let score = 0;

  // Task completion (40 points max)
  if (stats.totalTasks > 0) {
    score += Math.round((stats.tasksCompleted / stats.totalTasks) * 40);
  } else {
    score += 20; // No tasks planned = neutral
  }

  // Habits (30 points max)
  if (stats.totalHabits > 0) {
    score += Math.round((stats.habitsCompleted / stats.totalHabits) * 30);
  } else {
    score += 15;
  }

  // Focus time (20 points max, 120 min = full)
  score += Math.min(Math.round((stats.focusMinutes / 120) * 20), 20);

  // Articles read bonus (10 points max, 3 articles = full)
  score += Math.min(Math.round((stats.articlesRead / 3) * 10), 10);

  return Math.min(score, 100);
};

/**
 * Calculate weekly mood trend.
 * Returns an array of { date, mood } for the last 7 days.
 */
export const getWeeklyMoodTrend = (
  reviews: DailyReviewData[]
): Array<{ date: string; mood: number; emoji: string }> => {
  const trend: Array<{ date: string; mood: number; emoji: string }> = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateId = getDateId(date);
    const review = reviews.find(r => r.id === dateId);

    trend.push({
      date: dateId,
      mood: review?.mood?.value ?? 0,
      emoji: review?.mood?.emoji ?? '',
    });
  }

  return trend;
};

/**
 * Get monthly stats summary.
 */
export const getMonthlyStats = (
  reviews: DailyReviewData[]
): {
  totalReviews: number;
  averageMood: number;
  averageProductivity: number;
  bestDay: DailyReviewData | null;
  totalFocusMinutes: number;
  totalTasksCompleted: number;
} => {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageMood: 0,
      averageProductivity: 0,
      bestDay: null,
      totalFocusMinutes: 0,
      totalTasksCompleted: 0,
    };
  }

  const totalMood = reviews.reduce((sum, r) => sum + (r.mood?.value ?? 0), 0);
  const totalProd = reviews.reduce((sum, r) => sum + r.productivityScore, 0);
  const totalFocus = reviews.reduce((sum, r) => sum + (r.stats?.focusMinutes ?? 0), 0);
  const totalTasks = reviews.reduce((sum, r) => sum + (r.stats?.tasksCompleted ?? 0), 0);

  const bestDay = reviews.reduce<DailyReviewData | null>((best, r) => {
    if (!best || r.productivityScore > best.productivityScore) return r;
    return best;
  }, null);

  return {
    totalReviews: reviews.length,
    averageMood: Math.round((totalMood / reviews.length) * 10) / 10,
    averageProductivity: Math.round(totalProd / reviews.length),
    bestDay,
    totalFocusMinutes: totalFocus,
    totalTasksCompleted: totalTasks,
  };
};

/**
 * Check if the daily review reminder was dismissed today.
 */
export const isDismissedToday = (): boolean => {
  try {
    const dismissed = localStorage.getItem(LS_DISMISSED_KEY);
    if (!dismissed) return false;
    return dismissed === getDateId();
  } catch {
    return false;
  }
};

/**
 * Dismiss the daily review reminder for today.
 */
export const dismissReminder = (): void => {
  try {
    localStorage.setItem(LS_DISMISSED_KEY, getDateId());
  } catch (error) {
    console.error('Failed to dismiss reminder:', error);
  }
};

/**
 * Get mood emoji and label from value.
 */
export const MOOD_OPTIONS: DailyReviewMood[] = [
  { value: 1, label: 'קשה', emoji: '\uD83D\uDE2B' },
  { value: 2, label: 'לא משהו', emoji: '\uD83D\uDE14' },
  { value: 3, label: 'בסדר', emoji: '\uD83D\uDE10' },
  { value: 4, label: 'טוב', emoji: '\uD83D\uDE0A' },
  { value: 5, label: 'מעולה!', emoji: '\uD83E\uDD29' },
];
