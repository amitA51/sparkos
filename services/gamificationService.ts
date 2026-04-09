/**
 * Gamification Service
 *
 * Manages XP, levels, and point tracking.
 * Persists to localStorage with daily/weekly/total tracking.
 */

// ─── Point Values ───────────────────────────────────────────────────────────
export const POINT_VALUES = {
  COMPLETE_TASK: 10,
  COMPLETE_HABIT: 15,
  MAINTAIN_STREAK: 5, // per day
  READ_FEED_ARTICLE: 3,
  FOCUS_SESSION: 20,
  JOURNAL_ENTRY: 10,
  CREATE_ROADMAP: 25,
} as const;

// ─── Level Thresholds ───────────────────────────────────────────────────────
export interface LevelTier {
  name: string;
  nameHe: string;
  minXP: number;
  maxXP: number;
  minLevel: number;
  maxLevel: number;
}

export const LEVEL_TIERS: LevelTier[] = [
  { name: 'Beginner', nameHe: 'מתחיל', minXP: 0, maxXP: 500, minLevel: 1, maxLevel: 5 },
  { name: 'Productive', nameHe: 'פרודוקטיבי', minXP: 500, maxXP: 2000, minLevel: 6, maxLevel: 10 },
  { name: 'Master', nameHe: 'מאסטר', minXP: 2000, maxXP: 10000, minLevel: 11, maxLevel: 20 },
  { name: 'Legend', nameHe: 'אגדה', minXP: 10000, maxXP: Infinity, minLevel: 21, maxLevel: 999 },
];

// ─── Types ──────────────────────────────────────────────────────────────────
export type GamificationAction =
  | 'COMPLETE_TASK'
  | 'COMPLETE_HABIT'
  | 'MAINTAIN_STREAK'
  | 'READ_FEED_ARTICLE'
  | 'FOCUS_SESSION'
  | 'JOURNAL_ENTRY'
  | 'CREATE_ROADMAP';

export interface DayRecord {
  date: string; // YYYY-MM-DD
  xpEarned: number;
  actions: { action: GamificationAction; count: number }[];
}

export interface GamificationState {
  totalXP: number;
  level: number;
  currentTierName: string;
  currentTierNameHe: string;
  dailyRecords: DayRecord[];
  firstUseDate: string; // ISO date
  lastActionDate: string; // ISO date
  totalActions: Record<GamificationAction, number>;
}

const STORAGE_KEY = 'sparkos_gamification';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().slice(0, 10);
}

/**
 * Calculate level from total XP.
 * Levels 1-5:   0-500 XP   (100 XP per level)
 * Levels 6-10:  500-2000 XP (300 XP per level)
 * Levels 11-20: 2000-10000 XP (800 XP per level)
 * Levels 21+:   10000+ XP  (1000 XP per level)
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 500) {
    return Math.max(1, Math.floor(totalXP / 100) + 1);
  }
  if (totalXP < 2000) {
    return Math.floor((totalXP - 500) / 300) + 6;
  }
  if (totalXP < 10000) {
    return Math.floor((totalXP - 2000) / 800) + 11;
  }
  return Math.floor((totalXP - 10000) / 1000) + 21;
}

/**
 * Get XP range for a given level.
 */
export function getXPRangeForLevel(level: number): { start: number; end: number } {
  if (level <= 5) {
    return { start: (level - 1) * 100, end: level * 100 };
  }
  if (level <= 10) {
    return { start: 500 + (level - 6) * 300, end: 500 + (level - 5) * 300 };
  }
  if (level <= 20) {
    return { start: 2000 + (level - 11) * 800, end: 2000 + (level - 10) * 800 };
  }
  return { start: 10000 + (level - 21) * 1000, end: 10000 + (level - 20) * 1000 };
}

export function getTierForLevel(level: number): LevelTier {
  for (const tier of LEVEL_TIERS) {
    if (level >= tier.minLevel && level <= tier.maxLevel) {
      return tier;
    }
  }
  // Fallback to last tier (Legend) - array is always non-empty
  const lastTier = LEVEL_TIERS[LEVEL_TIERS.length - 1];
  if (lastTier) return lastTier;
  return { name: 'Legend', nameHe: 'אגדה', minXP: 10000, maxXP: Infinity, minLevel: 21, maxLevel: 999 };
}

// ─── Default State ──────────────────────────────────────────────────────────

function createDefaultState(): GamificationState {
  const today = getTodayKey();
  return {
    totalXP: 0,
    level: 1,
    currentTierName: 'Beginner',
    currentTierNameHe: 'מתחיל',
    dailyRecords: [],
    firstUseDate: today,
    lastActionDate: today,
    totalActions: {
      COMPLETE_TASK: 0,
      COMPLETE_HABIT: 0,
      MAINTAIN_STREAK: 0,
      READ_FEED_ARTICLE: 0,
      FOCUS_SESSION: 0,
      JOURNAL_ENTRY: 0,
      CREATE_ROADMAP: 0,
    },
  };
}

// ─── Load / Save ────────────────────────────────────────────────────────────

export function loadGamificationState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as GamificationState;
    // Ensure all action keys exist (forward compat)
    const defaults = createDefaultState();
    parsed.totalActions = { ...defaults.totalActions, ...parsed.totalActions };
    return parsed;
  } catch {
    return createDefaultState();
  }
}

export function saveGamificationState(state: GamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save gamification state');
  }
}

// ─── Core API ───────────────────────────────────────────────────────────────

export interface AwardResult {
  xpGained: number;
  newTotalXP: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newTierName: string;
  newTierNameHe: string;
}

/**
 * Award XP for an action. Returns the result including whether a level-up occurred.
 */
export function awardXP(
  state: GamificationState,
  action: GamificationAction,
  multiplier = 1
): { state: GamificationState; result: AwardResult } {
  const xpGained = POINT_VALUES[action] * multiplier;
  const previousLevel = state.level;
  const newTotalXP = state.totalXP + xpGained;
  const newLevel = calculateLevel(newTotalXP);
  const tier = getTierForLevel(newLevel);
  const today = getTodayKey();

  // Update daily record
  let dailyRecords = [...state.dailyRecords];
  const todayRecord = dailyRecords.find(r => r.date === today);
  if (todayRecord) {
    todayRecord.xpEarned += xpGained;
    const actionEntry = todayRecord.actions.find(a => a.action === action);
    if (actionEntry) {
      actionEntry.count += 1;
    } else {
      todayRecord.actions.push({ action, count: 1 });
    }
  } else {
    dailyRecords.push({
      date: today,
      xpEarned: xpGained,
      actions: [{ action, count: 1 }],
    });
  }

  // Keep only last 90 days of records
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  dailyRecords = dailyRecords.filter(r => r.date >= cutoffStr);

  // Update total actions
  const totalActions = { ...state.totalActions };
  totalActions[action] = (totalActions[action] || 0) + 1;

  const newState: GamificationState = {
    ...state,
    totalXP: newTotalXP,
    level: newLevel,
    currentTierName: tier.name,
    currentTierNameHe: tier.nameHe,
    dailyRecords,
    lastActionDate: today,
    totalActions,
  };

  const result: AwardResult = {
    xpGained,
    newTotalXP,
    previousLevel,
    newLevel,
    leveledUp: newLevel > previousLevel,
    newTierName: tier.name,
    newTierNameHe: tier.nameHe,
  };

  return { state: newState, result };
}

// ─── Query Helpers ──────────────────────────────────────────────────────────

export function getDailyXP(state: GamificationState): number {
  const today = getTodayKey();
  const record = state.dailyRecords.find(r => r.date === today);
  return record?.xpEarned || 0;
}

export function getWeeklyXP(state: GamificationState): number {
  const weekStart = getWeekStart();
  return state.dailyRecords
    .filter(r => r.date >= weekStart)
    .reduce((sum, r) => sum + r.xpEarned, 0);
}

export function getXPProgress(state: GamificationState): {
  currentXP: number;
  levelStartXP: number;
  levelEndXP: number;
  progressPercent: number;
} {
  const range = getXPRangeForLevel(state.level);
  const currentInLevel = state.totalXP - range.start;
  const levelSize = range.end - range.start;
  return {
    currentXP: state.totalXP,
    levelStartXP: range.start,
    levelEndXP: range.end,
    progressPercent: Math.min(100, (currentInLevel / levelSize) * 100),
  };
}

/**
 * Get how many days the user has been using the app.
 */
export function getAppUsageDays(state: GamificationState): number {
  if (!state.firstUseDate) return 1;
  const first = new Date(state.firstUseDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}
