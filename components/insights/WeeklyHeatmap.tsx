/**
 * WeeklyHeatmap
 *
 * 7-column (Sun-Sat in Hebrew) activity intensity heatmap.
 * Shows last 4 weeks. Tap a day to see details.
 */
// CLEANED - CSS vars fixed
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InsightCard from './InsightCard';
import type { HeatmapDay } from '../../hooks/useInsightsData';

const HEBREW_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

interface Props {
  days: HeatmapDay[];
  selectedDay: string | null;
  onDaySelect: (date: string | null) => void;
}

function intensityColor(count: number, maxCount: number): string {
  if (count === 0) return 'var(--gray-100)';
  const ratio = maxCount > 0 ? count / maxCount : 0;
  if (ratio > 0.75) return 'var(--dynamic-accent-start, #34D399)';
  if (ratio > 0.5) return 'color-mix(in srgb, var(--dynamic-accent-start, #34D399) 70%, var(--gray-100) 30%)';
  if (ratio > 0.25) return 'color-mix(in srgb, var(--dynamic-accent-start, #34D399) 40%, var(--gray-100) 60%)';
  return 'color-mix(in srgb, var(--dynamic-accent-start, #34D399) 20%, var(--gray-100) 80%)';
}

function intensityOpacity(count: number, maxCount: number): number {
  if (count === 0) return 0.4;
  const ratio = maxCount > 0 ? count / maxCount : 0;
  return 0.5 + ratio * 0.5;
}

const WeeklyHeatmap: React.FC<Props> = ({ days, selectedDay, onDaySelect }) => {
  const maxCount = useMemo(() => Math.max(1, ...days.map(d => d.count)), [days]);

  // Group by week
  const weeks = useMemo(() => {
    const result: HeatmapDay[][] = [[], [], [], []];
    days.forEach(d => {
      const week = result[d.weekIndex];
      if (week) {
        week.push(d);
      }
    });
    return result;
  }, [days]);

  const selectedDayData = useMemo(
    () => days.find(d => d.date === selectedDay),
    [days, selectedDay]
  );

  const today = new Date().toISOString().split('T')[0];

  return (
    <InsightCard
      title="מפת פעילות"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 3v18" />
        </svg>
      }
    >
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {HEBREW_DAYS.map(day => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="space-y-1.5">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1.5">
            {week.map((day) => {
              const isSelected = selectedDay === day.date;
              const isToday = day.date === today;
              const isFuture = day.date > (today ?? '');

              return (
                <motion.button
                  key={day.date}
                  className="relative aspect-square rounded-md transition-colors"
                  style={{
                    background: isFuture
                      ? 'transparent'
                      : intensityColor(day.count, maxCount),
                    opacity: isFuture ? 0.15 : intensityOpacity(day.count, maxCount),
                    border: isSelected
                      ? '2px solid var(--success)'
                      : isToday
                        ? '1.5px solid var(--text-muted)'
                        : '0.5px solid transparent',
                  }}
                  onClick={() => onDaySelect(isSelected ? null : day.date)}
                  whileTap={{ scale: 0.85 }}
                  disabled={isFuture}
                  aria-label={`${day.date}: ${day.count} פעולות`}
                />
              ); // CLEANED
            })}
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDayData && (
          <motion.div
            className="mt-3 p-3 rounded-xl flex items-center justify-between"
            style={{
              background: 'var(--gray-50)',
              border: '0.5px solid var(--border-subtle)',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatHebDate(selectedDayData.date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[18px] font-bold tabular-nums insight-success">
                {selectedDayData.count}
              </span>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                פעולות
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>פחות</span>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{
              background: ratio === 0
                ? 'var(--gray-100)'
                : `color-mix(in srgb, var(--dynamic-accent-start, #34D399) ${ratio * 100}%, var(--gray-100) ${(1 - ratio) * 100}%)`,
              opacity: 0.4 + ratio * 0.6,
            }}
          />
        ))}
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>יותר</span>
      </div>
    </InsightCard>
  );
};

function formatHebDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return `יום ${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
}

export default React.memo(WeeklyHeatmap);
