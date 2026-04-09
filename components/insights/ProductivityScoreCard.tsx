/**
 * ProductivityScoreCard
 *
 * Hero card: Big animated productivity score (0-100) with color gradient,
 * week-over-week comparison, and sub-score breakdown.
 */
// CLEANED - CSS vars fixed
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ProductivityScore } from '../../hooks/useInsightsData';

interface Props {
  data: ProductivityScore;
}

// Score to gradient color mapping
function scoreColor(score: number): {
  start: string;
  end: string;
  glow: string;
  label: string;
} {
  if (score >= 80) return {
    start: 'var(--green)', end: '#059669', glow: 'rgba(16, 185, 129, 0.35)', label: 'מצוין'
  };
  if (score >= 60) return {
    start: 'var(--blue)', end: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)', label: 'טוב'
  };
  if (score >= 40) return {
    start: 'var(--amber)', end: '#D97706', glow: 'rgba(245, 158, 11, 0.3)', label: 'בינוני'
  };
  return {
    start: 'var(--light-red)', end: '#DC2626', glow: 'rgba(248, 113, 113, 0.3)', label: 'צריך שיפור'
  };
}

const ProductivityScoreCard: React.FC<Props> = ({ data }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const colors = scoreColor(data.score);

  // Animate score counter
  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;
    const endValue = data.score;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [data.score]);

  const trendIcon = data.trend === 'up' ? '\u2191' : data.trend === 'down' ? '\u2193' : '\u2192';
  const trendColor = data.trend === 'up'
    ? 'var(--success)'
    : data.trend === 'down'
      ? 'var(--error)'
      : 'var(--text-muted)';

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, var(--bg-card) 0%, var(--bg-card) 100%)`,
        border: '0.5px solid var(--border-subtle)',
        boxShadow: `0 4px 24px ${colors.glow}`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle gradient overlay at top */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          background: `linear-gradient(145deg, ${colors.start} 0%, transparent 60%)`,
        }}
      />

      <div className="relative p-6">
        {/* Top row: Score + Trend */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                className="text-[56px] font-bold leading-none tabular-nums tracking-tight"
                style={{
                  background: `linear-gradient(135deg, ${colors.start}, ${colors.end})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {displayScore}
              </motion.span>
              <span
                className="text-lg font-medium opacity-40"
                style={{ color: 'var(--text-primary)' }}
              >
                /100
              </span>
            </div>
            <div
              className="text-[13px] font-medium mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              ציון פרודוקטיביות שבועי
            </div>
          </div>

          {/* Week-over-week badge */}
          <motion.div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold"
            style={{
              background: `${trendColor}18`,
              color: trendColor,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <span>{trendIcon}</span>
            <span>{Math.abs(data.weekOverWeekChange)}%</span>
            <span className="opacity-70 text-[11px]">מהשבוע שעבר</span>
          </motion.div>
        </div>

        {/* Sub-score breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <SubScore label="משימות" value={data.taskScore} color="var(--accent)" delay={0.2} />
          <SubScore label="הרגלים" value={data.habitScore} color="var(--subscore-purple, var(--ios-purple))" delay={0.3} />
          <SubScore label="מיקוד" value={data.focusScore} color="var(--success)" delay={0.4} />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Sub-Score Mini Card
// ============================================================================

const SubScore: React.FC<{
  label: string;
  value: number;
  color: string;
  delay: number;
}> = ({ label, value, color, delay }) => (
  <motion.div
    className="rounded-xl p-3 text-center"
    style={{
      background: 'var(--gray-50)',
      border: '0.5px solid var(--border-subtle)',
    }}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div
      className="text-[20px] font-bold tabular-nums leading-none mb-1"
      style={{ color }}
    >
      {value}
    </div>
    <div
      className="text-[11px] font-medium"
      style={{ color: 'var(--text-muted)' }}
    >
      {label}
    </div>
  </motion.div>
);

export default React.memo(ProductivityScoreCard);
