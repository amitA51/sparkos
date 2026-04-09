import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon } from '../icons';
import { useData } from '../../src/contexts/DataContext';
import { parseDate } from '../../utils/dateUtils';
import type { PersonalItem } from '../../types';

// ============================================================================
// Types
// ============================================================================

type Urgency = 'overdue' | 'today' | 'tomorrow' | 'upcoming';

interface UpcomingEvent {
  id: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  urgency: Urgency;
  relativeTime: string;
  priority?: 'low' | 'medium' | 'high';
  type: string;
}

// ============================================================================
// Constants
// ============================================================================

const URGENCY_STYLES: Record<
  Urgency,
  { dot: string; text: string; bg: string; border: string }
> = {
  overdue: {
    dot: 'bg-red-500 animate-pulse',
    text: 'text-red-400',
    bg: 'from-red-500/15 to-rose-500/10',
    border: 'border-red-500/20',
  },
  today: {
    dot: 'bg-orange-400',
    text: 'text-orange-400',
    bg: 'from-orange-500/15 to-amber-500/10',
    border: 'border-orange-500/20',
  },
  tomorrow: {
    dot: 'bg-sky-400',
    text: 'text-sky-400',
    bg: 'from-sky-500/15 to-blue-500/10',
    border: 'border-sky-500/20',
  },
  upcoming: {
    dot: 'bg-indigo-400',
    text: 'text-indigo-400',
    bg: 'from-indigo-500/12 to-purple-500/8',
    border: 'border-indigo-500/20',
  },
};

const URGENCY_LABELS: Record<Urgency, string> = {
  overdue: 'באיחור',
  today: 'היום',
  tomorrow: 'מחר',
  upcoming: 'בקרוב',
};

// ============================================================================
// Helpers
// ============================================================================

function getUrgency(dueDateStr: string): Urgency {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  const dayAfterTomorrow = new Date(todayStart);
  dayAfterTomorrow.setDate(todayStart.getDate() + 2);

  const dueDate = parseDate(dueDateStr);
  dueDate.setHours(23, 59, 59, 999);

  if (dueDate < todayStart) return 'overdue';
  if (dueDate < tomorrowStart) return 'today';
  if (dueDate < dayAfterTomorrow) return 'tomorrow';
  return 'upcoming';
}

function formatRelativeTime(dueDateStr: string, dueTime?: string): string {
  const now = new Date();
  const dueDate = parseDate(dueDateStr);

  // If there's a due time, combine it
  if (dueTime) {
    const [hours, minutes] = dueTime.split(':').map(Number);
    if (hours !== undefined && minutes !== undefined) {
      dueDate.setHours(hours, minutes, 0, 0);
    }
  } else {
    dueDate.setHours(23, 59, 59, 999);
  }

  const diffMs = dueDate.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs < 0;

  const minutes = Math.floor(absDiffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return dueDate.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
    });
  }

  let timeStr: string;

  if (minutes < 60) {
    timeStr = `${minutes} דק'`;
  } else if (hours < 24) {
    const remainMinutes = minutes % 60;
    timeStr = remainMinutes > 0
      ? `${hours} שע' ו-${remainMinutes} דק'`
      : `${hours} שעות`;
  } else {
    timeStr = days === 1 ? 'יום' : `${days} ימים`;
  }

  if (isPast) return `לפני ${timeStr}`;

  // Add specific time if available
  if (dueTime && !isPast) {
    return `בעוד ${timeStr} (${dueTime})`;
  }

  return `בעוד ${timeStr}`;
}

function getUpcomingEvents(personalItems: PersonalItem[]): UpcomingEvent[] {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Look 7 days ahead + all overdue
  const weekAhead = new Date(todayStart);
  weekAhead.setDate(todayStart.getDate() + 7);

  return personalItems
    .filter(item => {
      if (item.isCompleted || item.isArchived) return false;
      if (!item.dueDate) return false;
      if (item.type !== 'task') return false;

      const dueDate = parseDate(item.dueDate);
      dueDate.setHours(23, 59, 59, 999);

      // Include overdue items and items within next 7 days
      return dueDate <= weekAhead;
    })
    .map(item => {
      const urgency = getUrgency(item.dueDate!);
      return {
        id: item.id,
        title: item.title || 'משימה',
        dueDate: item.dueDate!,
        dueTime: item.dueTime,
        urgency,
        relativeTime: formatRelativeTime(item.dueDate!, item.dueTime),
        priority: item.priority,
        type: item.type,
      };
    })
    // Sort: overdue first, then by date, then by priority
    .sort((a, b) => {
      const urgencyOrder: Record<Urgency, number> = {
        overdue: 0,
        today: 1,
        tomorrow: 2,
        upcoming: 3,
      };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 3);
}

function getPriorityIcon(priority?: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🔵';
    default:
      return '';
  }
}

// ============================================================================
// Component
// ============================================================================

const UpcomingEventsWidget: React.FC = () => {
  const { personalItems } = useData();

  const events = useMemo(
    () => getUpcomingEvents(personalItems),
    [personalItems]
  );

  const hasEvents = events.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/12 via-blue-400/8 to-transparent pointer-events-none" />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">
              קרוב ובא
            </h3>
            <p className="text-xs text-theme-secondary">
              {hasEvents
                ? `${events.length} אירועים קרובים`
                : 'אין אירועים קרובים'}
            </p>
          </div>
        </div>

        {/* Events list */}
        {hasEvents ? (
          <div className="space-y-2.5">
            {events.map((event, index) => {
              const styles = URGENCY_STYLES[event.urgency];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`rounded-xl bg-gradient-to-r ${styles.bg} border ${styles.border} p-3.5`}
                >
                  <div className="flex items-start gap-3">
                    {/* Urgency indicator */}
                    <div className="flex flex-col items-center gap-1 pt-0.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {event.title}
                        </p>
                        {event.priority && (
                          <span className="text-xs flex-shrink-0">
                            {getPriorityIcon(event.priority)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-medium ${styles.text}`}
                        >
                          {URGENCY_LABELS[event.urgency]}
                        </span>
                        <span className="text-[10px] text-theme-muted">
                          ·
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-theme-secondary">
                          <ClockIcon className="w-3 h-3" />
                          {event.relativeTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <span className="text-3xl block mb-3">🎉</span>
            <p className="text-sm text-theme-secondary">
              אין אירועים קרובים
            </p>
            <p className="text-xs text-theme-muted mt-1.5">
              לוח הזמנים שלך פנוי לשבוע הקרוב
            </p>
          </motion.div>
        )}

        {/* Footer */}
        {hasEvents && events.some(e => e.urgency === 'overdue') && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-[10px] text-red-400/80 text-center font-medium">
              ⚠️ יש משימות באיחור שדורשות טיפול
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(UpcomingEventsWidget);
