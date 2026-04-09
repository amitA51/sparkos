/**
 * useInsightsData Hook
 *
 * Computes all analytics/insights from real user data.
 * Drives the InsightsScreen dashboard with production-ready calculations.
 */
import { useMemo } from 'react';
import { useData } from '../src/contexts/DataContext';
import { useFocusSession } from '../src/contexts/FocusContext';

// ============================================================================
// Types
// ============================================================================

export interface ProductivityScore {
  score: number; // 0-100
  taskScore: number;
  habitScore: number;
  focusScore: number;
  weekOverWeekChange: number; // percentage change vs last week
  trend: 'up' | 'down' | 'stable';
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  dayOfWeek: number; // 0=Sun, 6=Sat
  weekIndex: number; // 0=current week, 3=oldest
}

export interface HabitLeaderboardEntry {
  id: string;
  title: string;
  icon?: string;
  currentStreak: number;
  bestStreak: number;
  consistency: number; // 0-100, percentage over last 30 days
  totalCompletions: number;
}

export interface DailyTaskCount {
  date: string;
  count: number;
  label: string; // Hebrew day abbreviation
}

export interface TaskTrend {
  dailyCounts: DailyTaskCount[];
  average: number;
  thisWeekTotal: number;
  lastWeekTotal: number;
  weekOverWeekChange: number;
}

export interface FocusSummary {
  totalMinutesThisWeek: number;
  averageSessionMinutes: number;
  mostProductiveDay: string; // Hebrew day name
  mostProductiveHour: number;
  distractionTrend: number[]; // last 7 days
  totalSessions: number;
}

export interface FeedStats {
  readThisWeek: number;
  avgReadingTimeMin: number;
  topTopics: { topic: string; count: number }[];
  unreadBacklog: number;
  totalRead: number;
}

export interface InsightsData {
  productivity: ProductivityScore;
  heatmap: HeatmapDay[];
  habitLeaderboard: HabitLeaderboardEntry[];
  taskTrend: TaskTrend;
  focusSummary: FocusSummary;
  feedStats: FeedStats;
  isLoading: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const HEBREW_DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function getDateKey(d: Date): string {
  return d.toISOString().split('T')[0] ?? '';
}

function getDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

function startOfWeek(d: Date): Date {
  const result = new Date(d);
  result.setDate(result.getDate() - result.getDay()); // Sunday start
  result.setHours(0, 0, 0, 0);
  return result;
}

// ============================================================================
// Hook
// ============================================================================

export function useInsightsData(): InsightsData {
  const { personalItems, feedItems, isLoading } = useData();
  const { sessionHistory, stats: focusStats } = useFocusSession();

  return useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    // ====================================================================
    // Filter items by type
    // ====================================================================
    const tasks = personalItems.filter(i => i.type === 'task');
    const habits = personalItems.filter(i => i.type === 'habit');

    // ====================================================================
    // PRODUCTIVITY SCORE
    // ====================================================================
    const computeWeekScore = (weekStart: Date, weekEnd: Date) => {
      // Task completion rate
      const weekTasks = tasks.filter(t => {
        const created = new Date(t.createdAt);
        return created >= weekStart && created <= weekEnd;
      });
      const completedTasks = weekTasks.filter(t => t.isCompleted);
      const taskRate = weekTasks.length > 0
        ? (completedTasks.length / weekTasks.length) * 100
        : 50; // neutral if no tasks

      // Also count tasks completed (regardless of creation date) this week
      const tasksCompletedThisWeek = tasks.filter(t => {
        if (!t.isCompleted) return false;
        const completedDate = t.updatedAt ? new Date(t.updatedAt) : null;
        return completedDate && completedDate >= weekStart && completedDate <= weekEnd;
      }).length;

      // Habit consistency
      const habitScores = habits.map(h => {
        const dates = h.completedDates ?? [];
        let daysInWeek = 0;
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          if (dates.includes(getDateKey(d))) daysInWeek++;
        }
        return (daysInWeek / 7) * 100;
      });
      const habitAvg = habitScores.length > 0
        ? habitScores.reduce((a, b) => a + b, 0) / habitScores.length
        : 50;

      // Focus time (target: 2 hours/day = 14 hours/week = 840 minutes)
      const weekSessions = sessionHistory.filter(s => {
        const d = new Date(s.startTime);
        return d >= weekStart && d <= weekEnd;
      });
      const focusMinutes = weekSessions.reduce((sum, s) => sum + s.duration / 60000, 0);
      const focusRate = Math.min(100, (focusMinutes / 840) * 100);

      const overall = Math.round(taskRate * 0.4 + habitAvg * 0.35 + focusRate * 0.25);
      return {
        score: Math.min(100, Math.max(0, overall)),
        taskScore: Math.round(taskRate),
        habitScore: Math.round(habitAvg),
        focusScore: Math.round(focusRate),
        tasksCompleted: tasksCompletedThisWeek,
      };
    };

    const thisWeekEnd = new Date(now);
    const thisWeek = computeWeekScore(thisWeekStart, thisWeekEnd);
    const lastWeek = computeWeekScore(lastWeekStart, lastWeekEnd);

    const weekChange = lastWeek.score > 0
      ? Math.round(((thisWeek.score - lastWeek.score) / lastWeek.score) * 100)
      : 0;

    const productivity: ProductivityScore = {
      score: thisWeek.score,
      taskScore: thisWeek.taskScore,
      habitScore: thisWeek.habitScore,
      focusScore: thisWeek.focusScore,
      weekOverWeekChange: weekChange,
      trend: weekChange > 2 ? 'up' : weekChange < -2 ? 'down' : 'stable',
    };

    // ====================================================================
    // WEEKLY ACTIVITY HEATMAP (4 weeks)
    // ====================================================================
    const heatmap: HeatmapDay[] = [];
    for (let weekIdx = 3; weekIdx >= 0; weekIdx--) {
      const wStart = new Date(thisWeekStart);
      wStart.setDate(wStart.getDate() - weekIdx * 7);
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const d = new Date(wStart);
        d.setDate(d.getDate() + dayIdx);
        const dk = getDateKey(d);

        // Count completions on this day
        let count = 0;
        // Completed tasks
        count += tasks.filter(t => {
          if (!t.isCompleted) return false;
          const updated = t.updatedAt ? getDateKey(new Date(t.updatedAt)) : null;
          return updated === dk;
        }).length;
        // Habit completions
        habits.forEach(h => {
          if (h.completedDates?.includes(dk)) count++;
        });
        // Focus sessions
        count += sessionHistory.filter(s => getDateKey(new Date(s.startTime)) === dk).length;

        heatmap.push({
          date: dk,
          count,
          dayOfWeek: dayIdx,
          weekIndex: 3 - weekIdx,
        });
      }
    }

    // ====================================================================
    // HABIT STREAK LEADERBOARD
    // ====================================================================
    const habitLeaderboard: HabitLeaderboardEntry[] = habits
      .filter(h => h.habitType !== 'bad')
      .map(h => {
        const dates = h.completedDates ?? [];
        const thirtyDaysAgo = getDaysAgo(30);
        let daysInLast30 = 0;
        for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
          if (dates.includes(getDateKey(d))) daysInLast30++;
        }

        return {
          id: h.id,
          title: h.title ?? 'ללא שם',
          icon: h.icon,
          currentStreak: h.streak ?? 0,
          bestStreak: h.bestStreak ?? h.streak ?? 0,
          consistency: Math.round((daysInLast30 / 30) * 100),
          totalCompletions: h.totalCompletions ?? dates.length,
        };
      })
      .sort((a, b) => b.currentStreak - a.currentStreak);

    // ====================================================================
    // TASK COMPLETION TREND (14 days)
    // ====================================================================
    const dailyCounts: DailyTaskCount[] = [];
    let thisWeekTaskTotal = 0;
    let lastWeekTaskTotal = 0;

    for (let i = 13; i >= 0; i--) {
      const d = getDaysAgo(i);
      const dk = getDateKey(d);
      const dayCount = tasks.filter(t => {
        if (!t.isCompleted) return false;
        const updated = t.updatedAt ? getDateKey(new Date(t.updatedAt)) : null;
        return updated === dk;
      }).length;

      dailyCounts.push({
        date: dk,
        count: dayCount,
        label: HEBREW_DAYS[d.getDay()] ?? '',
      });

      if (i < 7) thisWeekTaskTotal += dayCount;
      else lastWeekTaskTotal += dayCount;
    }

    const avgTasks = dailyCounts.length > 0
      ? dailyCounts.reduce((s, d) => s + d.count, 0) / dailyCounts.length
      : 0;

    const taskWeekChange = lastWeekTaskTotal > 0
      ? Math.round(((thisWeekTaskTotal - lastWeekTaskTotal) / lastWeekTaskTotal) * 100)
      : 0;

    const taskTrend: TaskTrend = {
      dailyCounts,
      average: Math.round(avgTasks * 10) / 10,
      thisWeekTotal: thisWeekTaskTotal,
      lastWeekTotal: lastWeekTaskTotal,
      weekOverWeekChange: taskWeekChange,
    };

    // ====================================================================
    // FOCUS TIME SUMMARY
    // ====================================================================
    const weekFocusSessions = sessionHistory.filter(s => {
      const d = new Date(s.startTime);
      return d >= thisWeekStart && d <= now;
    });

    const focusByDay: Record<number, number> = {};
    const focusByHour: Record<number, number> = {};

    weekFocusSessions.forEach(s => {
      const d = new Date(s.startTime);
      const day = d.getDay();
      const hour = d.getHours();
      focusByDay[day] = (focusByDay[day] ?? 0) + s.duration;
      focusByHour[hour] = (focusByHour[hour] ?? 0) + s.duration;
    });

    let bestDay = 0;
    let bestDayTime = 0;
    for (const [day, time] of Object.entries(focusByDay)) {
      if (time > bestDayTime) {
        bestDayTime = time;
        bestDay = Number(day);
      }
    }

    let bestHour = 0;
    let bestHourTime = 0;
    for (const [hour, time] of Object.entries(focusByHour)) {
      if (time > bestHourTime) {
        bestHourTime = time;
        bestHour = Number(hour);
      }
    }

    // Distraction trend (last 7 days)
    const distractionTrend: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = getDaysAgo(i);
      const dk = getDateKey(d);
      const dayDistractions = sessionHistory
        .filter(s => getDateKey(new Date(s.startTime)) === dk)
        .reduce((sum, s) => sum + s.distractionCount, 0);
      distractionTrend.push(dayDistractions);
    }

    const totalWeekFocusMinutes = weekFocusSessions.reduce(
      (sum, s) => sum + s.duration / 60000, 0
    );

    const focusSummary: FocusSummary = {
      totalMinutesThisWeek: Math.round(totalWeekFocusMinutes),
      averageSessionMinutes: weekFocusSessions.length > 0
        ? Math.round(totalWeekFocusMinutes / weekFocusSessions.length)
        : 0,
      mostProductiveDay: HEBREW_DAY_NAMES[bestDay] ?? 'ראשון',
      mostProductiveHour: bestHour,
      distractionTrend,
      totalSessions: weekFocusSessions.length,
    };

    // ====================================================================
    // FEED READING STATS
    // ====================================================================
    const readItems = feedItems.filter(f => f.is_read);
    const readThisWeek = readItems.filter(f =>
      isInRange(f.createdAt, thisWeekStart, now)
    ).length;

    const avgReadTime = readItems.length > 0
      ? readItems.reduce((s, f) => s + (f.estimated_read_time_min ?? 3), 0) / readItems.length
      : 0;

    // Top topics from topics/tags
    const topicMap = new Map<string, number>();
    readItems.forEach(f => {
      const topics = f.topics ?? [];
      const tags = f.tags?.map(t => t.name) ?? [];
      [...topics, ...tags].forEach(topic => {
        topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
      });
    });
    const topTopics = Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    const feedStats: FeedStats = {
      readThisWeek,
      avgReadingTimeMin: Math.round(avgReadTime * 10) / 10,
      topTopics,
      unreadBacklog: feedItems.filter(f => !f.is_read).length,
      totalRead: readItems.length,
    };

    return {
      productivity,
      heatmap,
      habitLeaderboard,
      taskTrend,
      focusSummary,
      feedStats,
      isLoading,
    };
  }, [personalItems, feedItems, sessionHistory, focusStats, isLoading]);
}
