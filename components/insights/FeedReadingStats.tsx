/**
 * FeedReadingStats
 *
 * Articles read this week, average reading time,
 * top topics/categories, unread backlog size.
 */
// CLEANED - CSS vars fixed
import React from 'react';
import { motion } from 'framer-motion';
import InsightCard from './InsightCard';
import type { FeedStats } from '../../hooks/useInsightsData';

interface Props {
  data: FeedStats;
}

const FeedReadingStats: React.FC<Props> = ({ data }) => {
  const backlogColor = data.unreadBacklog > 50
    ? 'var(--error)'
    : data.unreadBacklog > 20
      ? 'var(--warning)'
      : 'var(--success)';

  return (
    <InsightCard
      title="קריאה"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      }
    >
      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ReadingStat
          value={data.readThisWeek.toString()}
          label="נקראו השבוע"
          color="var(--dynamic-accent-start, #60A5FA)"
        />
        <ReadingStat
          value={`${data.avgReadingTimeMin}\'`}
          label="זמן קריאה ממוצע"
          color="var(--subscore-purple, #A78BFA)"
        />
        <ReadingStat
          value={data.unreadBacklog.toString()}
          label="בהמתנה"
          color={backlogColor}
        />
      </div>

      {/* Total read badge */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-4"
        style={{
          background: 'var(--gray-50)',
          border: '0.5px solid var(--border-subtle)',
        }}
      >
        <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          סה"כ נקראו אי פעם
        </span>
        <span
          className="text-[14px] font-bold tabular-nums"
          style={{ color: 'var(--text-primary)' }}
        >
          {data.totalRead}
        </span>
      </div>

      {/* Top topics */}
      {data.topTopics.length > 0 && (
        <div>
          <div
            className="text-[11px] font-semibold mb-2 uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            נושאים מובילים
          </div>
          <div className="flex flex-wrap gap-2">
            {data.topTopics.map((topic, i) => (
              <motion.div
                key={topic.topic}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  background: 'var(--gray-100)',
                  border: '0.5px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <span>{topic.topic}</span>
                <span
                  className="tabular-nums px-1 py-0.5 rounded text-[9px] font-bold"
                  style={{
                    background: 'var(--gray-200)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {topic.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {data.topTopics.length === 0 && (
        <div className="text-center py-3">
          <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            קרא מאמרים כדי לגלות את הנושאים המובילים שלך
          </span>
        </div>
      )}
    </InsightCard>
  );
};

// ============================================================================
// ReadingStat
// ============================================================================

const ReadingStat: React.FC<{
  value: string;
  label: string;
  color: string;
}> = ({ value, label, color }) => (
  <div className="text-center">
    <motion.div
      className="text-[20px] font-bold tabular-nums leading-none mb-1"
      style={{ color }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.div>
    <div
      className="text-[10px] font-medium leading-tight"
      style={{ color: 'var(--text-muted)' }}
    >
      {label}
    </div>
  </div>
);

export default React.memo(FeedReadingStats);
