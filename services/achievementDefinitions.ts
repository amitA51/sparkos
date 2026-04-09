/**
 * Achievement Definitions
 *
 * Defines 25+ achievements with Hebrew names, conditions, and XP rewards.
 */

import type { GamificationState } from './gamificationService';
import type { PersonalItem, FeedItem } from '../types';

// ─── Types ──────────────────────────────────────────────────────────────────

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementDefinition {
  id: string;
  title: string; // Hebrew
  description: string; // Hebrew
  icon: string; // Emoji
  xpReward: number;
  rarity: AchievementRarity;
  /** Returns progress 0-100, and whether the achievement is unlocked */
  checkCondition: (ctx: AchievementCheckContext) => { progress: number; unlocked: boolean };
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO date
  xpAwarded: boolean; // Whether XP was already given
}

export interface AchievementCheckContext {
  personalItems: PersonalItem[];
  feedItems: FeedItem[];
  gamificationState: GamificationState;
}

// ─── Rarity Colors ──────────────────────────────────────────────────────────

export const RARITY_CONFIG: Record<AchievementRarity, { color: string; label: string; labelHe: string; bgGradient: string }> = {
  common: {
    color: '#9CA3AF',
    label: 'Common',
    labelHe: 'נפוץ',
    bgGradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
  },
  rare: {
    color: '#60A5FA',
    label: 'Rare',
    labelHe: 'נדיר',
    bgGradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
  },
  epic: {
    color: '#A78BFA',
    label: 'Epic',
    labelHe: 'אפי',
    bgGradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
  },
  legendary: {
    color: '#FBBF24',
    label: 'Legendary',
    labelHe: 'אגדי',
    bgGradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  },
};

// ─── Helper Functions ───────────────────────────────────────────────────────

function countCompletedTasks(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'task' && i.isCompleted).length;
}

function countHabits(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'habit').length;
}

function getMaxHabitStreak(items: PersonalItem[]): number {
  return items
    .filter(i => i.type === 'habit')
    .reduce((max, h) => Math.max(max, h.bestStreak || h.streak || 0), 0);
}

function countReadArticles(feedItems: FeedItem[]): number {
  return feedItems.filter(i => i.is_read).length;
}

function countFocusSessions(items: PersonalItem[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.focusSessions?.length || 0);
  }, 0);
}

function getMaxFocusDuration(items: PersonalItem[]): number {
  let max = 0;
  for (const item of items) {
    if (item.focusSessions) {
      for (const session of item.focusSessions) {
        if (session.duration > max) max = session.duration;
      }
    }
  }
  return max;
}

function countJournalEntries(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'journal').length;
}

function countRoadmaps(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'goal' && i.phases && i.phases.length > 0).length;
}

function countUniqueTypes(items: PersonalItem[]): number {
  const types = new Set(items.map(i => i.type));
  return types.size;
}

function countBooks(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'book').length;
}

function countFinishedBooks(items: PersonalItem[]): number {
  return items.filter(
    i => i.type === 'book' && i.metadata && 'bookStatus' in i.metadata && i.metadata.bookStatus === 'finished'
  ).length;
}

function countNotes(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'note').length;
}

function countSparks(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'idea').length;
}

function countLinks(items: PersonalItem[]): number {
  return items.filter(i => i.type === 'link').length;
}

// ─── Achievement Definitions ────────────────────────────────────────────────

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ── Tasks ─────────────────────────────────
  {
    id: 'first_step',
    title: 'צעד ראשון',
    description: 'השלם את המשימה הראשונה שלך',
    icon: '🎯',
    xpReward: 20,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countCompletedTasks(ctx.personalItems);
      return { progress: Math.min(100, count * 100), unlocked: count >= 1 };
    },
  },
  {
    id: 'task_master_10',
    title: 'שולט במשימות',
    description: 'השלם 10 משימות',
    icon: '✅',
    xpReward: 30,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countCompletedTasks(ctx.personalItems);
      return { progress: Math.min(100, (count / 10) * 100), unlocked: count >= 10 };
    },
  },
  {
    id: 'task_master_50',
    title: 'מכונת ביצועים',
    description: 'השלם 50 משימות',
    icon: '🏅',
    xpReward: 75,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countCompletedTasks(ctx.personalItems);
      return { progress: Math.min(100, (count / 50) * 100), unlocked: count >= 50 };
    },
  },
  {
    id: 'super_programmer',
    title: 'מתכנת על',
    description: 'השלם 100 משימות',
    icon: '💻',
    xpReward: 150,
    rarity: 'epic',
    checkCondition: (ctx) => {
      const count = countCompletedTasks(ctx.personalItems);
      return { progress: Math.min(100, (count / 100) * 100), unlocked: count >= 100 };
    },
  },

  // ── Habits ────────────────────────────────
  {
    id: 'habit_starter',
    title: 'מתחיל הרגל',
    description: 'צור את ההרגל הראשון שלך',
    icon: '🌱',
    xpReward: 15,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countHabits(ctx.personalItems);
      return { progress: Math.min(100, count * 100), unlocked: count >= 1 };
    },
  },
  {
    id: 'habit_monster',
    title: 'מפלצת הרגלים',
    description: 'שמור על סטריק של 7 ימים בהרגל',
    icon: '🔥',
    xpReward: 50,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const streak = getMaxHabitStreak(ctx.personalItems);
      return { progress: Math.min(100, (streak / 7) * 100), unlocked: streak >= 7 };
    },
  },
  {
    id: 'iron_month',
    title: 'חודש של ברזל',
    description: 'שמור על סטריק של 30 ימים בהרגל',
    icon: '🦾',
    xpReward: 200,
    rarity: 'epic',
    checkCondition: (ctx) => {
      const streak = getMaxHabitStreak(ctx.personalItems);
      return { progress: Math.min(100, (streak / 30) * 100), unlocked: streak >= 30 };
    },
  },
  {
    id: 'habit_legend',
    title: 'אגדת ההרגלים',
    description: 'שמור על סטריק של 100 ימים בהרגל',
    icon: '👑',
    xpReward: 500,
    rarity: 'legendary',
    checkCondition: (ctx) => {
      const streak = getMaxHabitStreak(ctx.personalItems);
      return { progress: Math.min(100, (streak / 100) * 100), unlocked: streak >= 100 };
    },
  },

  // ── Reading ───────────────────────────────
  {
    id: 'first_read',
    title: 'קורא מתחיל',
    description: 'קרא 10 מאמרים',
    icon: '📖',
    xpReward: 20,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countReadArticles(ctx.feedItems);
      return { progress: Math.min(100, (count / 10) * 100), unlocked: count >= 10 };
    },
  },
  {
    id: 'avid_reader',
    title: 'קורא נלהב',
    description: 'קרא 50 מאמרים',
    icon: '📚',
    xpReward: 75,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countReadArticles(ctx.feedItems);
      return { progress: Math.min(100, (count / 50) * 100), unlocked: count >= 50 };
    },
  },
  {
    id: 'knowledge_seeker',
    title: 'צייד ידע',
    description: 'קרא 200 מאמרים',
    icon: '🧠',
    xpReward: 200,
    rarity: 'epic',
    checkCondition: (ctx) => {
      const count = countReadArticles(ctx.feedItems);
      return { progress: Math.min(100, (count / 200) * 100), unlocked: count >= 200 };
    },
  },

  // ── Focus ─────────────────────────────────
  {
    id: 'zen_master',
    title: 'זן מאסטר',
    description: 'השלם 10 סשנים של פוקוס',
    icon: '🧘',
    xpReward: 50,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countFocusSessions(ctx.personalItems);
      return { progress: Math.min(100, (count / 10) * 100), unlocked: count >= 10 };
    },
  },
  {
    id: 'focus_marathon',
    title: 'מרתון מיקוד',
    description: 'השלם סשן פוקוס של 60 דקות',
    icon: '🏃',
    xpReward: 75,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const maxDuration = getMaxFocusDuration(ctx.personalItems);
      return { progress: Math.min(100, (maxDuration / 60) * 100), unlocked: maxDuration >= 60 };
    },
  },
  {
    id: 'deep_work',
    title: 'עבודה עמוקה',
    description: 'השלם 50 סשנים של פוקוס',
    icon: '🎧',
    xpReward: 150,
    rarity: 'epic',
    checkCondition: (ctx) => {
      const count = countFocusSessions(ctx.personalItems);
      return { progress: Math.min(100, (count / 50) * 100), unlocked: count >= 50 };
    },
  },

  // ── Journal ───────────────────────────────
  {
    id: 'first_journal',
    title: 'כותב יומן',
    description: 'כתוב את רשומת היומן הראשונה שלך',
    icon: '📝',
    xpReward: 15,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countJournalEntries(ctx.personalItems);
      return { progress: Math.min(100, count * 100), unlocked: count >= 1 };
    },
  },
  {
    id: 'journal_habit',
    title: 'הרגל כתיבה',
    description: 'כתוב 30 רשומות יומן',
    icon: '✍️',
    xpReward: 100,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countJournalEntries(ctx.personalItems);
      return { progress: Math.min(100, (count / 30) * 100), unlocked: count >= 30 };
    },
  },

  // ── Roadmaps ──────────────────────────────
  {
    id: 'planner',
    title: 'מתכנן',
    description: 'צור מפת דרכים ראשונה',
    icon: '🗺️',
    xpReward: 25,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countRoadmaps(ctx.personalItems);
      return { progress: Math.min(100, count * 100), unlocked: count >= 1 };
    },
  },
  {
    id: 'leader',
    title: 'מנהיג',
    description: 'צור 3 מפות דרכים',
    icon: '🚀',
    xpReward: 75,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countRoadmaps(ctx.personalItems);
      return { progress: Math.min(100, (count / 3) * 100), unlocked: count >= 3 };
    },
  },

  // ── Diversity ─────────────────────────────
  {
    id: 'collector',
    title: 'אספן',
    description: 'צור פריטים ב-5 סוגים שונים',
    icon: '🎨',
    xpReward: 50,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countUniqueTypes(ctx.personalItems);
      return { progress: Math.min(100, (count / 5) * 100), unlocked: count >= 5 };
    },
  },

  // ── App Usage ─────────────────────────────
  {
    id: 'sparkos_veteran',
    title: 'ספארקוס ותיק',
    description: 'השתמש באפליקציה 30 ימים',
    icon: '⭐',
    xpReward: 100,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const firstUse = ctx.gamificationState.firstUseDate;
      if (!firstUse) return { progress: 0, unlocked: false };
      const days = Math.floor(
        (Date.now() - new Date(firstUse).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      return { progress: Math.min(100, (days / 30) * 100), unlocked: days >= 30 };
    },
  },
  {
    id: 'sparkos_legend',
    title: 'אגדה חיה',
    description: 'השתמש באפליקציה 100 ימים',
    icon: '🏛️',
    xpReward: 300,
    rarity: 'legendary',
    checkCondition: (ctx) => {
      const firstUse = ctx.gamificationState.firstUseDate;
      if (!firstUse) return { progress: 0, unlocked: false };
      const days = Math.floor(
        (Date.now() - new Date(firstUse).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      return { progress: Math.min(100, (days / 100) * 100), unlocked: days >= 100 };
    },
  },

  // ── XP Milestones ─────────────────────────
  {
    id: 'xp_500',
    title: 'חצי אלף',
    description: 'צבור 500 XP',
    icon: '💎',
    xpReward: 25,
    rarity: 'common',
    checkCondition: (ctx) => {
      const xp = ctx.gamificationState.totalXP;
      return { progress: Math.min(100, (xp / 500) * 100), unlocked: xp >= 500 };
    },
  },
  {
    id: 'xp_5000',
    title: 'חמשת אלפים',
    description: 'צבור 5,000 XP',
    icon: '💰',
    xpReward: 100,
    rarity: 'epic',
    checkCondition: (ctx) => {
      const xp = ctx.gamificationState.totalXP;
      return { progress: Math.min(100, (xp / 5000) * 100), unlocked: xp >= 5000 };
    },
  },

  // ── Books ─────────────────────────────────
  {
    id: 'bookworm',
    title: 'תולעת ספרים',
    description: 'הוסף 5 ספרים',
    icon: '📕',
    xpReward: 30,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countBooks(ctx.personalItems);
      return { progress: Math.min(100, (count / 5) * 100), unlocked: count >= 5 };
    },
  },
  {
    id: 'book_finisher',
    title: 'מסיים ספרים',
    description: 'סיים 3 ספרים',
    icon: '🏆',
    xpReward: 75,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countFinishedBooks(ctx.personalItems);
      return { progress: Math.min(100, (count / 3) * 100), unlocked: count >= 3 };
    },
  },

  // ── Notes & Ideas ─────────────────────────
  {
    id: 'note_taker',
    title: 'רושם פתקים',
    description: 'צור 20 פתקים',
    icon: '🗒️',
    xpReward: 30,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countNotes(ctx.personalItems);
      return { progress: Math.min(100, (count / 20) * 100), unlocked: count >= 20 };
    },
  },
  {
    id: 'idea_machine',
    title: 'מכונת רעיונות',
    description: 'צור 15 ספארקים',
    icon: '💡',
    xpReward: 40,
    rarity: 'rare',
    checkCondition: (ctx) => {
      const count = countSparks(ctx.personalItems);
      return { progress: Math.min(100, (count / 15) * 100), unlocked: count >= 15 };
    },
  },

  // ── Links ─────────────────────────────────
  {
    id: 'link_collector',
    title: 'אוסף קישורים',
    description: 'שמור 25 קישורים',
    icon: '🔗',
    xpReward: 30,
    rarity: 'common',
    checkCondition: (ctx) => {
      const count = countLinks(ctx.personalItems);
      return { progress: Math.min(100, (count / 25) * 100), unlocked: count >= 25 };
    },
  },
];

// ─── Achievement Storage ────────────────────────────────────────────────────

const UNLOCKED_KEY = 'sparkos_unlocked_achievements';

export function loadUnlockedAchievements(): UnlockedAchievement[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUnlockedAchievements(unlocked: UnlockedAchievement[]): void {
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  } catch {
    console.error('Failed to save unlocked achievements');
  }
}

/**
 * Check all achievements and return newly unlocked ones.
 */
export function checkAchievements(
  ctx: AchievementCheckContext,
  alreadyUnlocked: UnlockedAchievement[]
): { newlyUnlocked: AchievementDefinition[]; allStatuses: { def: AchievementDefinition; progress: number; unlocked: boolean; unlockedAt?: string }[] } {
  const unlockedIds = new Set(alreadyUnlocked.map(u => u.id));
  const newlyUnlocked: AchievementDefinition[] = [];
  const allStatuses: { def: AchievementDefinition; progress: number; unlocked: boolean; unlockedAt?: string }[] = [];

  for (const def of ACHIEVEMENTS) {
    const { progress, unlocked } = def.checkCondition(ctx);
    const wasAlreadyUnlocked = unlockedIds.has(def.id);
    const existing = alreadyUnlocked.find(u => u.id === def.id);

    if (unlocked && !wasAlreadyUnlocked) {
      newlyUnlocked.push(def);
    }

    allStatuses.push({
      def,
      progress,
      unlocked: unlocked || wasAlreadyUnlocked,
      unlockedAt: existing?.unlockedAt,
    });
  }

  return { newlyUnlocked, allStatuses };
}
