import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlameIcon, TrophyIcon } from '../icons';
import { useData } from '../../src/contexts/DataContext';
import type { PersonalItem } from '../../types';

// ============================================================================
// Types
// ============================================================================

interface HabitStreak {
  id: string;
  title: string;
  streak: number;
  bestStreak: number;
  isCompletedToday: boolean;
  icon: string;
}

// ============================================================================
// Helpers
// ============================================================================

function getHabitStreaks(personalItems: PersonalItem[]): HabitStreak[] {
  const habits = personalItems.filter(
    item => item.type === 'habit' && item.habitType !== 'bad'
  );

  return habits
    .map(habit => {
      const streak = habit.streak ?? 0;
      const bestStreak = habit.bestStreak ?? streak;

      // Check if completed today
      let isCompletedToday = false;
      if (habit.lastCompleted) {
        const lastDate = new Date(habit.lastCompleted);
        const today = new Date();
        isCompletedToday =
          lastDate.getFullYear() === today.getFullYear() &&
          lastDate.getMonth() === today.getMonth() &&
          lastDate.getDate() === today.getDate();
      }

      return {
        id: habit.id,
        title: habit.title || 'הרגל',
        streak,
        bestStreak,
        isCompletedToday,
        icon: habit.icon || '🔥',
      };
    })
    .filter(h => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3); // Top 3
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return 'from-amber-400 to-orange-500';
  if (streak >= 14) return 'from-orange-400 to-red-500';
  if (streak >= 7) return 'from-rose-400 to-pink-500';
  return 'from-cyan-400 to-blue-500';
}

function getStreakMessage(streak: number): string {
  if (streak >= 100) return 'אגדה!';
  if (streak >= 30) return 'אלוף!';
  if (streak >= 14) return 'מדהים!';
  if (streak >= 7) return 'שבוע!';
  if (streak >= 3) return 'מעולה!';
  return '';
}

// ============================================================================
// Sub-Components
// ============================================================================

const StreakCard: React.FC<{ habit: HabitStreak; index: number }> = ({
  habit,
  index,
}) => {
  const colorGradient = getStreakColor(habit.streak);
  const message = getStreakMessage(habit.streak);
  const isNewBest = habit.streak >= habit.bestStreak && habit.streak > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
      className="flex-1 min-w-0 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3.5 text-center relative overflow-hidden"
    >
      {/* Background glow for high streaks */}
      {habit.streak >= 7 && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-10 pointer-events-none`}
        />
      )}

      {/* New best badge */}
      {isNewBest && habit.bestStreak > 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30"
        >
          <TrophyIcon className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[8px] font-bold text-amber-400">שיא!</span>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Icon */}
        <span className="text-2xl block mb-2">{habit.icon}</span>

        {/* Streak counter with animation */}
        <AnimatePresence mode="wait">
          <motion.p
            key={habit.streak}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`}
          >
            {habit.streak}
          </motion.p>
        </AnimatePresence>

        {/* Streak label */}
        {message && (
          <p className="text-[10px] font-semibold text-theme-secondary mt-0.5">
            {message}
          </p>
        )}

        {/* Habit name */}
        <p className="text-xs text-theme-secondary mt-2 truncate">
          {habit.title}
        </p>

        {/* Completed today indicator */}
        {habit.isCompletedToday && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2 flex items-center justify-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-medium">
              בוצע
            </span>
          </motion.div>
        )}

        {/* Best streak comparison */}
        {habit.bestStreak > habit.streak && (
          <p className="text-[10px] text-theme-muted mt-1.5" dir="ltr">
            🏆 {habit.bestStreak}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const StreakDashboardWidget: React.FC = () => {
  const { personalItems } = useData();

  const streaks = useMemo(
    () => getHabitStreaks(personalItems),
    [personalItems]
  );

  const hasStreaks = streaks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-transparent pointer-events-none" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center justify-center">
            <FlameIcon className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">
              רצפים פעילים
            </h3>
            <p className="text-xs text-theme-secondary">
              {hasStreaks
                ? `${streaks.length} הרגלים ברצף`
                : 'אין רצפים פעילים'}
            </p>
          </div>
        </div>

        {/* Content */}
        {hasStreaks ? (
          <div className="flex gap-3">
            {streaks.map((habit, index) => (
              <StreakCard key={habit.id} habit={habit} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <span className="text-3xl block mb-3">🔥</span>
            <p className="text-sm text-theme-secondary">
              התחל הרגל כדי לראות את הרצפים שלך!
            </p>
            <p className="text-xs text-theme-muted mt-2">
              כל יום שאתה מבצע הרגל מוסיף לרצף
            </p>
          </motion.div>
        )}

        {/* Total streak summary */}
        {hasStreaks && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-theme-muted">
              סך הכל{' '}
              {streaks.reduce((sum, s) => sum + s.streak, 0)} ימים ברצף
            </p>
            {streaks.some(s => s.isCompletedToday) && (
              <span className="text-[10px] text-emerald-400 font-medium">
                ✨ יום פעיל
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(StreakDashboardWidget);
