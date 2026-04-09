/**
 * InsightsScreen
 *
 * Premium analytics dashboard showing productivity insights from real user data.
 * Cards: Productivity Score, Weekly Heatmap, Habit Leaderboard,
 *        Task Trend, Focus Summary, Feed Stats.
 */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PremiumHeader from '../components/PremiumHeader';
import { PullToRefresh } from '../components/gestures/PullToRefresh';
import { SkeletonBox } from '../components/SkeletonLoader';
import { useInsightsData } from '../hooks/useInsightsData';
import { useData } from '../src/contexts/DataContext';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../components/animations/presets';
import type { Screen } from '../types';

// Sub-components
import ProductivityScoreCard from '../components/insights/ProductivityScoreCard';
import WeeklyHeatmap from '../components/insights/WeeklyHeatmap';
import HabitLeaderboard from '../components/insights/HabitLeaderboard';
import TaskCompletionTrend from '../components/insights/TaskCompletionTrend';
import FocusTimeSummary from '../components/insights/FocusTimeSummary';
import FeedReadingStats from '../components/insights/FeedReadingStats';

interface InsightsScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ setActiveScreen }) => {
  const data = useInsightsData();
  const { refreshAll } = useData();
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    await refreshAll();
  }, [refreshAll]);

  if (data.isLoading) {
    return <InsightsSkeleton />;
  }

  return (
    <div className="screen-shell pb-24">
      <PremiumHeader
        title="תובנות"
        subtitle="ניתוח הפרודוקטיביות שלך"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--dynamic-accent-start)' }}>
            <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />

      <PullToRefresh onRefresh={handleRefresh}>
        <motion.div
          className="space-y-4 px-1"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
        >
          {/* Productivity Score - The Hero Card */}
          <motion.div variants={STAGGER_ITEM}>
            <ProductivityScoreCard data={data.productivity} />
          </motion.div>

          {/* Weekly Activity Heatmap */}
          <motion.div variants={STAGGER_ITEM}>
            <WeeklyHeatmap
              days={data.heatmap}
              selectedDay={selectedHeatmapDay}
              onDaySelect={setSelectedHeatmapDay}
            />
          </motion.div>

          {/* Task Completion Trend */}
          <motion.div variants={STAGGER_ITEM}>
            <TaskCompletionTrend data={data.taskTrend} />
          </motion.div>

          {/* Habit Streak Leaderboard */}
          {data.habitLeaderboard.length > 0 && (
            <motion.div variants={STAGGER_ITEM}>
              <HabitLeaderboard habits={data.habitLeaderboard} />
            </motion.div>
          )}

          {/* Focus Time Summary */}
          <motion.div variants={STAGGER_ITEM}>
            <FocusTimeSummary data={data.focusSummary} />
          </motion.div>

          {/* Feed Reading Stats */}
          <motion.div variants={STAGGER_ITEM}>
            <FeedReadingStats data={data.feedStats} />
          </motion.div>
        </motion.div>
      </PullToRefresh>
    </div>
  );
};

// ============================================================================
// Skeleton Loader
// ============================================================================

const InsightsSkeleton: React.FC = () => (
  <div className="screen-shell pb-24">
    <div className="pt-[max(env(safe-area-inset-top,20px),1rem)] pb-3 px-1">
      <SkeletonBox height={32} width="30%" borderRadius="lg" />
      <div className="mt-2">
        <SkeletonBox height={16} width="55%" />
      </div>
    </div>
    <div className="space-y-4 px-1">
      <SkeletonBox height={200} borderRadius="xl" />
      <SkeletonBox height={180} borderRadius="xl" />
      <SkeletonBox height={200} borderRadius="xl" />
      <SkeletonBox height={160} borderRadius="xl" />
    </div>
  </div>
);

export default InsightsScreen;
