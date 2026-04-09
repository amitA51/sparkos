/**
 * HabitLeaderboard
 *
 * List of habits sorted by streak length with flame icons,
 * consistency progress bars, and best-ever vs current streak.
 */
import React from 'react';
import { motion } from 'framer-motion';
import InsightCard from './InsightCard';
import type { HabitLeaderboardEntry } from '../../hooks/useInsightsData';

interface Props {
  habits: HabitLeaderboardEntry[];
}

const HabitLeaderboard: React.FC<Props> = ({ habits }) => {
  const topHabits = habits.slice(0, 8);

  return (
    <InsightCard
      title="לוח הרגלים"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      }
      headerRight={
        <span className="text-[11px] font-medium">
          {habits.length} הרגלים
        </span>
      }
    >
      {topHabits.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-2xl mb-2">&#128293;</div>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            עדיין אין הרגלים. הוסף הרגלים כדי לראות סטטיסטיקות.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topHabits.map((habit, index) => (
            <HabitRow key={habit.id} habit={habit} rank={index + 1} />
          ))}
        </div>
      )}
    </InsightCard>
  );
};

// ============================================================================
// HabitRow
// ============================================================================

const HabitRow: React.FC<{ habit: HabitLeaderboardEntry; rank: number }> = ({ habit, rank }) => {
  const streakColor = habit.currentStreak >= 7
    ? 'var(--warning)'
    : habit.currentStreak >= 3
      ? '#FB923C'
      : 'var(--text-muted)';

  const isTop3 = rank <= 3;

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05, duration: 0.25 }}
    >
      {/* Rank badge */}
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{
          background: isTop3
            ? `linear-gradient(135deg, ${streakColor}30, ${streakColor}10)`
            : 'var(--gray-50)',
          color: isTop3 ? streakColor : 'var(--text-muted)',
          border: `0.5px solid ${isTop3 ? streakColor + '30' : 'var(--border-subtle)'}`,
        }}
      >
        {rank}
      </div>

      {/* Icon & Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {habit.icon && <span className="text-sm">{habit.icon}</span>}
          <span
            className="text-[13px] font-medium truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {habit.title}
          </span>
        </div>

        {/* Consistency bar */}
        <div className="flex items-center gap-2">
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--gray-100)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: habit.consistency >= 70
                  ? 'linear-gradient(90deg, #34D399, #059669)'
                  : habit.consistency >= 40
                    ? 'linear-gradient(90deg, #FBBF24, #D97706)'
                    : 'linear-gradient(90deg, #F87171, #DC2626)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${habit.consistency}%` }}
              transition={{ delay: rank * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span
            className="text-[10px] font-medium tabular-nums flex-shrink-0 w-8 text-left"
            style={{ color: 'var(--text-muted)' }}
          >
            {habit.consistency}%
          </span>
        </div>
      </div>

      {/* Streak */}
      <div className="flex flex-col items-end flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-sm">&#128293;</span>
          <span
            className="text-[16px] font-bold tabular-nums"
            style={{ color: streakColor }}
          >
            {habit.currentStreak}
          </span>
        </div>
        {habit.bestStreak > habit.currentStreak && (
          <span
            className="text-[10px] tabular-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            &#127942; {habit.bestStreak}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(HabitLeaderboard);
