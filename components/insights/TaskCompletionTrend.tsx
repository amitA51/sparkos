/**
 * TaskCompletionTrend
 *
 * Pure SVG bar chart showing tasks completed per day (last 14 days).
 * Average line overlay. This week vs last week comparison.
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import InsightCard from './InsightCard';
import type { TaskTrend } from '../../hooks/useInsightsData';

interface Props {
  data: TaskTrend;
}

const CHART_HEIGHT = 120;
const BAR_GAP = 3;

const TaskCompletionTrend: React.FC<Props> = ({ data }) => {
  const { dailyCounts, average, thisWeekTotal, lastWeekTotal, weekOverWeekChange } = data;
  const maxCount = useMemo(() => Math.max(1, ...dailyCounts.map(d => d.count)), [dailyCounts]);

  const trendColor = weekOverWeekChange > 0
    ? '#34D399'
    : weekOverWeekChange < 0
      ? '#F87171'
      : 'var(--text-muted)';

  const trendArrow = weekOverWeekChange > 0 ? '\u2191' : weekOverWeekChange < 0 ? '\u2193' : '\u2192';

  return (
    <InsightCard
      title="השלמת משימות"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      }
      headerRight={
        <div className="flex items-center gap-1.5">
          <span
            className="text-[11px] font-semibold tabular-nums"
            style={{ color: trendColor }}
          >
            {trendArrow} {Math.abs(weekOverWeekChange)}%
          </span>
        </div>
      }
    >
      {/* Summary stats */}
      <div className="flex items-center gap-4 mb-4">
        <StatPill label="השבוע" value={thisWeekTotal} accent />
        <StatPill label="שבוע שעבר" value={lastWeekTotal} />
        <StatPill label="ממוצע יומי" value={average} />
      </div>

      {/* SVG Bar Chart */}
      <div className="relative" style={{ height: CHART_HEIGHT + 28 }}>
        <svg
          width="100%"
          height={CHART_HEIGHT + 28}
          viewBox={`0 0 ${dailyCounts.length * 24} ${CHART_HEIGHT + 28}`}
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--dynamic-accent-start, #60A5FA)" />
              <stop offset="100%" stopColor="var(--dynamic-accent-end, #2563EB)" />
            </linearGradient>
          </defs>

          {/* Average line */}
          {average > 0 && (
            <>
              <line
                x1="0"
                y1={CHART_HEIGHT - (average / maxCount) * CHART_HEIGHT}
                x2={dailyCounts.length * 24}
                y2={CHART_HEIGHT - (average / maxCount) * CHART_HEIGHT}
                stroke="var(--text-muted)"
                strokeWidth="0.5"
                strokeDasharray="4 3"
                opacity="0.5"
              />
              <text
                x={dailyCounts.length * 24 - 2}
                y={CHART_HEIGHT - (average / maxCount) * CHART_HEIGHT - 4}
                fill="var(--text-muted)"
                fontSize="8"
                textAnchor="end"
                opacity="0.6"
              >
                &#8709; {average}
              </text>
            </>
          )}

          {/* Bars */}
          {dailyCounts.map((day, i) => {
            const barHeight = maxCount > 0
              ? (day.count / maxCount) * CHART_HEIGHT
              : 0;
            const x = i * 24 + BAR_GAP;
            const barWidth = 24 - BAR_GAP * 2;
            const isThisWeek = i >= 7;

            return (
              <g key={day.date}>
                {/* Bar */}
                <motion.rect
                  x={x}
                  y={CHART_HEIGHT - barHeight}
                  width={barWidth}
                  height={Math.max(barHeight, 0)}
                  rx={3}
                  fill={isThisWeek ? 'url(#bar-gradient)' : 'var(--gray-200)'}
                  opacity={day.count === 0 ? 0.2 : isThisWeek ? 0.9 : 0.5}
                  initial={{ height: 0, y: CHART_HEIGHT }}
                  animate={{
                    height: Math.max(barHeight, 0),
                    y: CHART_HEIGHT - barHeight,
                  }}
                  transition={{
                    delay: i * 0.03,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />

                {/* Count label on top */}
                {day.count > 0 && (
                  <motion.text
                    x={x + barWidth / 2}
                    y={CHART_HEIGHT - barHeight - 4}
                    fill="var(--text-muted)"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: i * 0.03 + 0.3 }}
                  >
                    {day.count}
                  </motion.text>
                )}

                {/* Day label */}
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT + 14}
                  fill="var(--text-muted)"
                  fontSize="8"
                  fontWeight="500"
                  textAnchor="middle"
                  opacity="0.7"
                >
                  {day.label}
                </text>
              </g>
            );
          })}

          {/* Week separator */}
          <line
            x1={7 * 24}
            y1={0}
            x2={7 * 24}
            y2={CHART_HEIGHT}
            stroke="var(--border-subtle)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
        </svg>

        {/* Week labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around">
          <span
            className="text-[9px] font-medium"
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}
          >
            שבוע שעבר
          </span>
          <span
            className="text-[9px] font-medium"
            style={{ color: 'var(--dynamic-accent-start, #60A5FA)' }}
          >
            השבוע
          </span>
        </div>
      </div>
    </InsightCard>
  );
};

// ============================================================================
// StatPill
// ============================================================================

const StatPill: React.FC<{
  label: string;
  value: number;
  accent?: boolean;
}> = ({ label, value, accent }) => (
  <div className="flex flex-col items-center">
    <span
      className="text-[18px] font-bold tabular-nums leading-none"
      style={{
        color: accent
          ? 'var(--dynamic-accent-start, #60A5FA)'
          : 'var(--text-primary)',
      }}
    >
      {value}
    </span>
    <span
      className="text-[10px] font-medium mt-1"
      style={{ color: 'var(--text-muted)' }}
    >
      {label}
    </span>
  </div>
);

export default React.memo(TaskCompletionTrend);
