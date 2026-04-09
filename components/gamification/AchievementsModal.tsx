import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ACHIEVEMENTS,
  RARITY_CONFIG,
  type AchievementRarity,
  type AchievementCheckContext,
  type UnlockedAchievement,
} from '../../services/achievementDefinitions';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: AchievementCheckContext;
  unlockedAchievements: UnlockedAchievement[];
}

type FilterTab = 'all' | AchievementRarity;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'הכל' },
  { key: 'common', label: 'נפוץ' },
  { key: 'rare', label: 'נדיר' },
  { key: 'epic', label: 'אפי' },
  { key: 'legendary', label: 'אגדי' },
];

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  context,
  unlockedAchievements,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const unlockedIds = useMemo(
    () => new Set(unlockedAchievements.map(u => u.id)),
    [unlockedAchievements]
  );

  const achievementStatuses = useMemo(() => {
    return ACHIEVEMENTS.map(def => {
      const { progress, unlocked } = def.checkCondition(context);
      const isUnlocked = unlocked || unlockedIds.has(def.id);
      const unlockedData = unlockedAchievements.find(u => u.id === def.id);
      return {
        def,
        progress: isUnlocked ? 100 : progress,
        unlocked: isUnlocked,
        unlockedAt: unlockedData?.unlockedAt,
      };
    }).sort((a, b) => {
      // Unlocked first, then by progress descending
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return b.progress - a.progress;
    });
  }, [context, unlockedIds, unlockedAchievements]);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return achievementStatuses;
    return achievementStatuses.filter(s => s.def.rarity === activeFilter);
  }, [achievementStatuses, activeFilter]);

  const totalUnlocked = achievementStatuses.filter(s => s.unlocked).length;
  const totalAchievements = ACHIEVEMENTS.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          }}
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between shrink-0"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                הישגים
              </h2>
              <p
                className="text-xs font-medium mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {totalUnlocked}/{totalAchievements} שוחררו
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{
                background: 'var(--gray-100)',
                color: 'var(--text-muted)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Overall progress bar */}
          <div className="px-5 py-3 shrink-0">
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ background: 'var(--gray-100)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #6366F1, #A78BFA, #FBBF24)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
                transition={{ duration: 0.8, ease: 'circOut' }}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div
            className="px-5 pb-3 flex gap-1.5 overflow-x-auto shrink-0"
            style={{ scrollbarWidth: 'none' }}
          >
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all"
                style={{
                  background: activeFilter === tab.key
                    ? 'var(--dynamic-accent-color, var(--gray-200))'
                    : 'var(--gray-50)',
                  color: activeFilter === tab.key
                    ? '#fff'
                    : 'var(--text-secondary)',
                  border: `1px solid ${activeFilter === tab.key ? 'transparent' : 'var(--border-subtle)'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Achievements grid */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <div className="grid grid-cols-1 gap-2.5">
              {filtered.map((status, index) => {
                const { def, progress, unlocked, unlockedAt } = status;
                const rarity = RARITY_CONFIG[def.rarity];

                return (
                  <motion.div
                    key={def.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative rounded-xl p-3.5 transition-all"
                    style={{
                      background: unlocked
                        ? 'var(--gray-50)'
                        : 'var(--gray-50)',
                      border: unlocked
                        ? `1px solid ${rarity.color}30`
                        : '1px solid var(--border-subtle)',
                      opacity: unlocked ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{
                          background: unlocked ? rarity.bgGradient : 'var(--gray-100)',
                          boxShadow: unlocked ? `0 2px 8px ${rarity.color}30` : 'none',
                          filter: unlocked ? 'none' : 'grayscale(1)',
                        }}
                      >
                        <span className="text-lg">{unlocked ? def.icon : '🔒'}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="text-sm font-bold truncate"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {def.title}
                          </span>
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0"
                            style={{
                              background: `${rarity.color}20`,
                              color: rarity.color,
                            }}
                          >
                            {rarity.labelHe}
                          </span>
                        </div>
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {unlocked ? def.description : '???'}
                        </p>

                        {/* Progress bar for partially completed */}
                        {!unlocked && progress > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <div
                              className="flex-1 h-1.5 rounded-full overflow-hidden"
                              style={{ background: 'var(--gray-100)' }}
                            >
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: rarity.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: 'circOut' }}
                              />
                            </div>
                            <span
                              className="text-[10px] font-semibold tabular-nums shrink-0"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {Math.round(progress)}%
                            </span>
                          </div>
                        )}

                        {/* Unlocked date + XP */}
                        {unlocked && (
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-[10px] font-semibold"
                              style={{ color: 'var(--success, #34D399)' }}
                            >
                              +{def.xpReward} XP
                            </span>
                            {unlockedAt && (
                              <span
                                className="text-[10px] font-medium"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {new Date(unlockedAt).toLocaleDateString('he-IL')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  אין הישגים בקטגוריה זו
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(AchievementsModal);
