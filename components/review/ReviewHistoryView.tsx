/**
 * ReviewHistoryView
 *
 * A calendar-based view showing mood emojis on each day,
 * with weekly mood trend visualization and monthly stats.
 * Tapping a day opens that day's review details.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../src/contexts/UserContext';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  StarIcon,
  TrophyIcon,
  CalendarDaysIcon,
} from '../icons';
import {
  loadReviewHistory,
  getWeeklyMoodTrend,
  getMonthlyStats,
  type DailyReviewData,
} from '../../services/dailyReviewService';
import LoadingSpinner from '../LoadingSpinner';

// ============================================================================
// Types
// ============================================================================

interface ReviewHistoryViewProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// Helper
// ============================================================================

const WEEKDAYS_HE = ['\u05D0', '\u05D1', '\u05D2', '\u05D3', '\u05D4', '\u05D5', '\u05E9'];

const MONTH_NAMES_HE = [
  '\u05D9\u05E0\u05D5\u05D0\u05E8',
  '\u05E4\u05D1\u05E8\u05D5\u05D0\u05E8',
  '\u05DE\u05E8\u05E5',
  '\u05D0\u05E4\u05E8\u05D9\u05DC',
  '\u05DE\u05D0\u05D9',
  '\u05D9\u05D5\u05E0\u05D9',
  '\u05D9\u05D5\u05DC\u05D9',
  '\u05D0\u05D5\u05D2\u05D5\u05E1\u05D8',
  '\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8',
  '\u05D0\u05D5\u05E7\u05D8\u05D5\u05D1\u05E8',
  '\u05E0\u05D5\u05D1\u05DE\u05D1\u05E8',
  '\u05D3\u05E6\u05DE\u05D1\u05E8',
];

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

// Mood value -> color
const moodColor = (value: number): string => {
  switch (value) {
    case 1: return 'var(--error)';
    case 2: return 'var(--warning)';
    case 3: return 'var(--text-muted)';
    case 4: return 'var(--success)';
    case 5: return 'var(--dynamic-accent-start)';
    default: return 'transparent';
  }
};

// ============================================================================
// Sub-components
// ============================================================================

/** Small stat pill for monthly summary */
const StatPill: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div
    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
    style={{
      background: `color-mix(in srgb, ${color} 6%, var(--bg-card))`,
      border: `1px solid color-mix(in srgb, ${color} 10%, transparent)`,
    }}
  >
    <div style={{ color }}>{icon}</div>
    <div>
      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  </div>
);

/** Mini mood trend bar chart */
const MoodTrend: React.FC<{
  data: Array<{ date: string; mood: number; emoji: string }>;
}> = ({ data }) => (
  <div className="flex items-end gap-1 h-20 mt-2">
    {data.map((d, i) => {
      const height = d.mood > 0 ? `${(d.mood / 5) * 100}%` : '4%';
      const dayLabel = new Date(d.date).toLocaleDateString('he-IL', { weekday: 'narrow' });
      return (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs">{d.emoji || '\u2022'}</span>
          <motion.div
            className="w-full rounded-full"
            style={{
              background: d.mood > 0
                ? `linear-gradient(to top, ${moodColor(d.mood)}, color-mix(in srgb, ${moodColor(d.mood)} 50%, transparent))`
                : 'var(--gray-100)',
              minHeight: 4,
            }}
            initial={{ height: 0 }}
            animate={{ height }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
          />
          <span
            className="text-[9px] font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {dayLabel}
          </span>
        </div>
      );
    })}
  </div>
);

/** Day detail panel */
const DayDetail: React.FC<{
  review: DailyReviewData;
  onClose: () => void;
}> = ({ review, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="rounded-2xl p-4 mt-4"
    style={{
      background: 'var(--gray-50)',
      border: '1px solid var(--border-subtle)',
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{review.mood?.emoji}</span>
        <div>
          <div
            className="text-sm font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {new Date(review.date).toLocaleDateString('he-IL', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {review.mood?.label} | ציון: {review.productivityScore}
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'var(--gray-100)', color: 'var(--text-muted)' }}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
      <div>
        <div className="text-lg font-bold" style={{ color: 'var(--success)' }}>
          {review.stats?.tasksCompleted ?? 0}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          \u05DE\u05E9\u05D9\u05DE\u05D5\u05EA
        </div>
      </div>
      <div>
        <div className="text-lg font-bold" style={{ color: 'var(--warning)' }}>
          {review.stats?.habitsCompleted ?? 0}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          \u05D4\u05E8\u05D2\u05DC\u05D9\u05DD
        </div>
      </div>
      <div>
        <div className="text-lg font-bold" style={{ color: 'var(--dynamic-accent-start)' }}>
          {review.stats?.focusMinutes ?? 0}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          \u05D3\u05E7\u05D5\u05EA \u05E4\u05D5\u05E7\u05D5\u05E1
        </div>
      </div>
    </div>

    {/* Wins */}
    {review.wins?.length > 0 && (
      <div className="space-y-1">
        {review.wins.filter(w => w.trim()).map((w, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs"
            style={{ color: 'var(--text-primary)' }}
          >
            <TrophyIcon
              className="w-3 h-3 mt-0.5 shrink-0"
              style={{ color: 'var(--warning)' }}
            />
            <span>{w}</span>
          </div>
        ))}
      </div>
    )}

    {/* AI Insight */}
    {review.aiInsight && (
      <div
        className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
        style={{
          background: 'color-mix(in srgb, var(--dynamic-accent-start) 5%, var(--bg-card))',
          color: 'var(--text-secondary)',
          border: '1px solid color-mix(in srgb, var(--dynamic-accent-start) 8%, transparent)',
        }}
      >
        {review.aiInsight}
      </div>
    )}
  </motion.div>
);

// ============================================================================
// Main Component
// ============================================================================

const ReviewHistoryView: React.FC<ReviewHistoryViewProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<DailyReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [selectedReview, setSelectedReview] = useState<DailyReviewData | null>(null);

  // Load review history
  useEffect(() => {
    if (!isOpen || !user) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const history = await loadReviewHistory(user.uid, 90);
        setReviews(history);
      } catch (error) {
        console.error('Failed to load review history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isOpen, user]);

  // Reviews mapped by date ID
  const reviewMap = useMemo(() => {
    const map = new Map<string, DailyReviewData>();
    for (const r of reviews) {
      map.set(r.id, r);
    }
    return map;
  }, [reviews]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: Array<{ day: number; dateId: string; review?: DailyReviewData } | null> = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateId = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateId,
        review: reviewMap.get(dateId),
      });
    }

    return days;
  }, [currentYear, currentMonth, reviewMap]);

  // Weekly mood trend
  const weeklyTrend = useMemo(() => getWeeklyMoodTrend(reviews), [reviews]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const monthReviews = reviews.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    return getMonthlyStats(monthReviews);
  }, [reviews, currentMonth, currentYear]);

  // Navigation
  const prevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedReview(null);
  }, [currentMonth]);

  const nextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedReview(null);
  }, [currentMonth]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 'var(--z-modal)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(var(--bg-app-rgb), 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl flex flex-col"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-2xl)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'color-mix(in srgb, var(--dynamic-accent-start) 12%, transparent)',
                  }}
                >
                  <CalendarDaysIcon
                    className="w-5 h-5"
                    style={{ color: 'var(--dynamic-accent-start)' }}
                  />
                </div>
                <h2
                  className="text-base font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  \u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05E1\u05D9\u05DB\u05D5\u05DE\u05D9\u05DD
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--gray-100)', color: 'var(--text-secondary)' }}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <>
                  {/* Weekly mood trend */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      \u05DE\u05D2\u05DE\u05D4 \u05E9\u05D1\u05D5\u05E2\u05D9\u05EA
                    </h3>
                    <MoodTrend data={weeklyTrend} />
                  </motion.div>

                  {/* Month navigator */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--gray-50)', color: 'var(--text-secondary)' }}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </motion.button>
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {MONTH_NAMES_HE[currentMonth]} {currentYear}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--gray-50)', color: 'var(--text-secondary)' }}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Calendar grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {WEEKDAYS_HE.map(day => (
                        <div
                          key={day}
                          className="text-center text-[10px] font-medium py-1"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((cell, i) => {
                        if (!cell) {
                          return <div key={`empty-${i}`} className="aspect-square" />;
                        }

                        const isToday = cell.dateId === new Date().toISOString().split('T')[0];
                        const hasReview = !!cell.review;
                        const isSelected = selectedReview?.id === cell.dateId;
                        const isFuture = new Date(cell.dateId) > new Date();

                        return (
                          <motion.button
                            key={cell.dateId}
                            whileHover={hasReview ? { scale: 1.1 } : {}}
                            whileTap={hasReview ? { scale: 0.9 } : {}}
                            onClick={() => {
                              if (hasReview) {
                                setSelectedReview(isSelected ? null : cell.review!);
                              }
                            }}
                            className="aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-150"
                            style={{
                              background: isSelected
                                ? 'color-mix(in srgb, var(--dynamic-accent-start) 12%, var(--bg-card))'
                                : isToday
                                  ? 'var(--gray-50)'
                                  : 'transparent',
                              border: isSelected
                                ? '2px solid var(--dynamic-accent-start)'
                                : isToday
                                  ? '1.5px solid var(--border-subtle)'
                                  : '1.5px solid transparent',
                              opacity: isFuture ? 0.3 : 1,
                              cursor: hasReview ? 'pointer' : 'default',
                            }}
                          >
                            {hasReview ? (
                              <span className="text-base leading-none">
                                {cell.review!.mood?.emoji}
                              </span>
                            ) : (
                              <span
                                className="text-xs font-medium"
                                style={{
                                  color: isToday
                                    ? 'var(--dynamic-accent-start)'
                                    : 'var(--text-secondary)',
                                }}
                              >
                                {cell.day}
                              </span>
                            )}

                            {/* Score dot indicator */}
                            {hasReview && (
                              <div
                                className="w-1 h-1 rounded-full mt-0.5"
                                style={{
                                  background:
                                    cell.review!.productivityScore >= 70
                                      ? 'var(--success)'
                                      : cell.review!.productivityScore >= 40
                                        ? 'var(--warning)'
                                        : 'var(--error)',
                                }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Selected day detail */}
                  <AnimatePresence mode="wait">
                    {selectedReview && (
                      <DayDetail
                        key={selectedReview.id}
                        review={selectedReview}
                        onClose={() => setSelectedReview(null)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Monthly stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6"
                  >
                    <h3
                      className="text-sm font-semibold mb-3"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      \u05E1\u05D9\u05DB\u05D5\u05DD \u05D7\u05D5\u05D3\u05E9\u05D9
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <StatPill
                        icon={<StarIcon className="w-4 h-4" />}
                        label="\u05E1\u05D9\u05DB\u05D5\u05DE\u05D9\u05DD"
                        value={monthlyStats.totalReviews}
                        color="var(--dynamic-accent-start)"
                      />
                      <StatPill
                        icon={<TrendingUpIcon className="w-4 h-4" />}
                        label="\u05E6\u05D9\u05D5\u05DF \u05DE\u05DE\u05D5\u05E6\u05E2"
                        value={monthlyStats.averageProductivity}
                        color="var(--success)"
                      />
                      <StatPill
                        icon={<ClockIcon className="w-4 h-4" />}
                        label="\u05D3\u05E7\u05D5\u05EA \u05E4\u05D5\u05E7\u05D5\u05E1"
                        value={monthlyStats.totalFocusMinutes}
                        color="var(--color-ios-purple)"
                      />
                      <StatPill
                        icon={<CheckCircleIcon className="w-4 h-4" />}
                        label="\u05DE\u05E9\u05D9\u05DE\u05D5\u05EA"
                        value={monthlyStats.totalTasksCompleted}
                        color="var(--warning)"
                      />
                    </div>

                    {/* Average mood */}
                    {monthlyStats.averageMood > 0 && (
                      <div
                        className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                        style={{
                          background: 'var(--gray-50)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          \u05DE\u05E6\u05D1 \u05E8\u05D5\u05D7 \u05DE\u05DE\u05D5\u05E6\u05E2:
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: moodColor(Math.round(monthlyStats.averageMood)) }}
                        >
                          {monthlyStats.averageMood.toFixed(1)} / 5
                        </span>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ReviewHistoryView);
