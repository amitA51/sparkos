import { useState, useCallback, useRef, useEffect } from 'react';
import {
  loadGamificationState,
  saveGamificationState,
  awardXP,
  getXPProgress,
  getDailyXP,
  getWeeklyXP,
  type GamificationState,
  type GamificationAction,
  type AwardResult,
} from '../services/gamificationService';
import {
  loadUnlockedAchievements,
  saveUnlockedAchievements,
  checkAchievements,
  type UnlockedAchievement,
  type AchievementDefinition,
  type AchievementCheckContext,
} from '../services/achievementDefinitions';
import type { PersonalItem, FeedItem } from '../types';
import { triggerHaptic } from '../src/utils/haptics';
import { playSuccess } from '../src/utils/audio';

export interface UseGamificationReturn {
  // State
  gamificationState: GamificationState;
  unlockedAchievements: UnlockedAchievement[];

  // XP info
  level: number;
  tierNameHe: string;
  totalXP: number;
  dailyXP: number;
  weeklyXP: number;
  xpProgress: ReturnType<typeof getXPProgress>;
  recentXPGain: number;

  // Actions
  awardPoints: (action: GamificationAction, multiplier?: number) => AwardResult;
  checkAndAwardAchievements: (personalItems: PersonalItem[], feedItems: FeedItem[]) => void;

  // UI state
  pendingAchievementToast: AchievementDefinition | null;
  dismissAchievementToast: () => void;
  showLevelUp: boolean;
  levelUpLevel: number;
  dismissLevelUp: () => void;
  showAchievementsModal: boolean;
  openAchievementsModal: () => void;
  closeAchievementsModal: () => void;

  // Context for achievement checks
  getCheckContext: (personalItems: PersonalItem[], feedItems: FeedItem[]) => AchievementCheckContext;
}

export function useGamification(): UseGamificationReturn {
  const [gamificationState, setGamificationState] = useState<GamificationState>(() =>
    loadGamificationState()
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>(() =>
    loadUnlockedAchievements()
  );

  // UI state
  const [pendingAchievementToast, setPendingAchievementToast] = useState<AchievementDefinition | null>(null);
  const [achievementQueue, setAchievementQueue] = useState<AchievementDefinition[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(0);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState(0);

  // Prevent double-processing on strict mode
  const processingRef = useRef(false);

  // Process achievement queue - show one at a time
  useEffect(() => {
    if (!pendingAchievementToast && achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      if (next) {
        setPendingAchievementToast(next);
      }
      setAchievementQueue(rest);
    }
  }, [pendingAchievementToast, achievementQueue]);

  const awardPoints = useCallback(
    (action: GamificationAction, multiplier = 1): AwardResult => {
      let result: AwardResult;
      setGamificationState(prev => {
        const { state: newState, result: awardResult } = awardXP(prev, action, multiplier);
        result = awardResult;
        saveGamificationState(newState);
        return newState;
      });

      // Set recent XP gain for animation
      setRecentXPGain(result!.xpGained);
      setTimeout(() => setRecentXPGain(0), 2500);

      // Handle level up
      if (result!.leveledUp) {
        setLevelUpLevel(result!.newLevel);
        setShowLevelUp(true);
        triggerHaptic('success');
        playSuccess();
      }

      return result!;
    },
    []
  );

  const getCheckContext = useCallback(
    (personalItems: PersonalItem[], feedItems: FeedItem[]): AchievementCheckContext => ({
      personalItems,
      feedItems,
      gamificationState,
    }),
    [gamificationState]
  );

  const checkAndAwardAchievements = useCallback(
    (personalItems: PersonalItem[], feedItems: FeedItem[]) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        const ctx: AchievementCheckContext = {
          personalItems,
          feedItems,
          gamificationState,
        };

        const { newlyUnlocked } = checkAchievements(ctx, unlockedAchievements);

        if (newlyUnlocked.length > 0) {
          const now = new Date().toISOString();
          const newUnlocked: UnlockedAchievement[] = newlyUnlocked.map(def => ({
            id: def.id,
            unlockedAt: now,
            xpAwarded: true,
          }));

          // Update unlocked achievements
          const updatedUnlocked = [...unlockedAchievements, ...newUnlocked];
          setUnlockedAchievements(updatedUnlocked);
          saveUnlockedAchievements(updatedUnlocked);

          // Award XP for each achievement
          let currentState = gamificationState;
          for (const def of newlyUnlocked) {
            const { state: newState } = awardXP(currentState, 'COMPLETE_TASK', 0);
            // Manually add XP reward
            currentState = {
              ...newState,
              totalXP: newState.totalXP + def.xpReward,
            };
          }

          // Add total achievement XP
          const totalAchievementXP = newlyUnlocked.reduce((sum, d) => sum + d.xpReward, 0);
          setGamificationState(prev => {
            const updated = { ...prev, totalXP: prev.totalXP + totalAchievementXP };
            saveGamificationState(updated);
            return updated;
          });

          setRecentXPGain(totalAchievementXP);
          setTimeout(() => setRecentXPGain(0), 2500);

          // Queue toasts
          setAchievementQueue(prev => [...prev, ...newlyUnlocked]);

          // Haptic feedback
          triggerHaptic('success');
        }
      } finally {
        processingRef.current = false;
      }
    },
    [gamificationState, unlockedAchievements]
  );

  const dismissAchievementToast = useCallback(() => {
    setPendingAchievementToast(null);
  }, []);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setLevelUpLevel(0);
  }, []);

  const openAchievementsModal = useCallback(() => {
    setShowAchievementsModal(true);
  }, []);

  const closeAchievementsModal = useCallback(() => {
    setShowAchievementsModal(false);
  }, []);

  const xpProgress = getXPProgress(gamificationState);

  return {
    gamificationState,
    unlockedAchievements,

    level: gamificationState.level,
    tierNameHe: gamificationState.currentTierNameHe,
    totalXP: gamificationState.totalXP,
    dailyXP: getDailyXP(gamificationState),
    weeklyXP: getWeeklyXP(gamificationState),
    xpProgress,
    recentXPGain,

    awardPoints,
    checkAndAwardAchievements,

    pendingAchievementToast,
    dismissAchievementToast,
    showLevelUp,
    levelUpLevel,
    dismissLevelUp,
    showAchievementsModal,
    openAchievementsModal,
    closeAchievementsModal,

    getCheckContext,
  };
}
