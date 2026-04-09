/**
 * FocusTimeSummary
 *
 * Total focus minutes this week, average session length,
 * most productive day/hour, distraction count trend.
 */
// CLEANED - CSS vars fixed
import React from 'react';
import { motion } from 'framer-motion';
import InsightCard from './InsightCard';
import type { FocusSummary } from '../../hooks/useInsightsData';

interface Props {
  data: FocusSummary;
}

const FocusTimeSummary: React.FC<Props> = ({ data }) => {
  const hours = Math.floor(data.totalMinutesThisWeek / 60);
  const minutes = data.totalMinutesThisWeek % 60;
  const maxDistraction = Math.max(1, ...data.distractionTrend);

  return (
    <InsightCard
      title="מיקוד"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      }
    >
      {/* Big number: total focus time */}
      <div className="flex items-baseline gap-1 mb-4">
        <motion.span
          className="text-[36px] font-bold tabular-nums leading-none"
          style={{ color: 'var(--dynamic-accent-start, #34D399)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}` : `${minutes}`}
        </motion.span>
        <span
          className="text-[14px] font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {hours > 0 ? 'שעות' : 'דקות'}
        </span>
        <span
          className="text-[12px] mr-1"
          style={{ color: 'var(--text-muted)' }}
        >
          השבוע
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <FocusStat
          value={data.totalSessions.toString()}
          label="סשנים"
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--blue)' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />
        <FocusStat
          value={`${data.averageSessionMinutes}\'`}
          label="ממוצע"
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--ios-purple)' }}>
              <path d="M12 2v20M2 12h20" />
            </svg>
          }
        />
        <FocusStat
          value={`${data.mostProductiveHour}:00`}
          label="שעת שיא"
          icon={
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--amber)' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
        />
      </div>

      {/* Most productive day */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-3"
        style={{
          background: 'var(--gray-50)',
          border: '0.5px solid var(--border-subtle)',
        }}
      >
        <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          היום הכי פרודוקטיבי
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: 'var(--dynamic-accent-start, #34D399)' }}
        >
          יום {data.mostProductiveDay}
        </span>
      </div>

      {/* Distraction trend mini chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
            הסחות דעת (7 ימים)
          </span>
          <span
            className="text-[11px] tabular-nums font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            {data.distractionTrend.reduce((a, b) => a + b, 0)} סה"כ
          </span>
        </div>
        <div className="flex items-end gap-1" style={{ height: 32 }}>
          {data.distractionTrend.map((count, i) => {
            const barHeight = maxDistraction > 0
              ? Math.max(2, (count / maxDistraction) * 28)
              : 2;
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: barHeight,
                  background: count === 0
                    ? 'var(--gray-100)'
                    : count > maxDistraction * 0.7
                      ? 'var(--light-red)'
                      : 'var(--amber)',
                  opacity: count === 0 ? 0.3 : 0.7,
                }}
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>
    </InsightCard>
  );
};

// ============================================================================
// FocusStat
// ============================================================================

const FocusStat: React.FC<{
  value: string;
  label: string;
  icon: React.ReactNode;
}> = ({ value, label, icon }) => (
  <div
    className="flex flex-col items-center gap-1 p-2.5 rounded-xl"
    style={{
      background: 'var(--gray-50)',
      border: '0.5px solid var(--border-subtle)',
    }}
  >
    {icon}
    <span
      className="text-[15px] font-bold tabular-nums leading-none"
      style={{ color: 'var(--text-primary)' }}
    >
      {value}
    </span>
    <span
      className="text-[10px] font-medium"
      style={{ color: 'var(--text-muted)' }}
    >
      {label}
    </span>
  </div>
);

export default React.memo(FocusTimeSummary);
