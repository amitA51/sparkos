import React, { useMemo, useState, useCallback } from 'react';
import { PersonalItem } from '../types';
import TaskItem from './TaskItem';
import HabitItem from './HabitItem';
import AnimatedProgressRing from './AnimatedProgressRing';
import Section from './Section';
import { AnimatePresence, motion } from 'framer-motion';
import { useHaptics } from '../hooks/useHaptics';
import { useSound } from '../hooks/useSound';
import { useData } from '../src/contexts/DataContext';
import { isHabitForToday } from '../hooks/useTodayItems';
import { toDateKey } from '../utils/dateUtils';

interface TodayViewProps {
  tasks: PersonalItem[];
  onUpdateItem: (id: string, updates: Partial<PersonalItem>) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: PersonalItem) => void;
  onContextMenu: (event: React.MouseEvent, item: PersonalItem) => void;
  onStartFocus: (item: PersonalItem) => void;
  onRollOverTasks: () => void;
  overdueTasksCount: number;
  /** Currently selected date in the weekly planner */
  selectedDate?: Date;
  /** Callback when user selects a different date */
  onSelectedDateChange?: (date: Date) => void;
}

const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onUpdateItem,
  onDeleteItem,
  onSelectItem,
  onContextMenu,
  onStartFocus: _onStartFocus,
  onRollOverTasks,
  overdueTasksCount: _overdueTasksCount,
  selectedDate: externalSelectedDate,
  onSelectedDateChange,
}) => {
  const { personalItems } = useData();
  const { hapticSelection } = useHaptics();
  const { playClick } = useSound();
  // Use external date if provided, otherwise internal state
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());
  const selectedDate = externalSelectedDate ?? internalSelectedDate;

  // ✅ PERF: Memoize today to prevent breaking downstream memoization
  // We only update 'today' if the real day changes (unlikely during session, but good for correctness)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []); // Empty dep array is fine for session lifetime

  const selectedDateStr = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const todayStr = useMemo(() => toDateKey(today), [today]);
  const isToday = selectedDateStr === todayStr;

  // ✅ PERF: Memoize week generation (stable for the session)
  const weekDays = useMemo(() => {
    const days = [];
    const t = new Date(); // Use distinct instance
    t.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const date = new Date(t);
      date.setDate(t.getDate() + i);
      days.push(date);
    }
    return days;
  }, []); // Stable

  // ✅ PERF: Cache parsed dates efficiently
  const taskDatesCache = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      if (t.dueDate) map.set(t.id, new Date(t.dueDate).setHours(0, 0, 0, 0));
    });
    return map;
  }, [tasks]);

  // Get tasks for selected date
  const { dateTasks, overdueTasks, completedTasks, stats } = useMemo(() => {
    const selected: PersonalItem[] = [];
    const overdue: PersonalItem[] = [];
    const completed: PersonalItem[] = [];
    const todayTime = today.getTime();

    // Create a safe copy for comparison to avoid mutating state
    const selectedDateTime = new Date(selectedDate).setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      // Handle Completed Tasks
      if (task.isCompleted) {
        // Check if completed on the selected date
        if (task.lastCompleted) {
          const completedTime = new Date(task.lastCompleted).setHours(0, 0, 0, 0);
          if (completedTime === selectedDateTime) {
            completed.push(task);
          }
        }
        return;
      }

      // Handle Unscheduled Tasks (show on Today)
      if (!task.dueDate) {
        if (isToday) selected.push(task);
        return;
      }

      // Handle Scheduled Tasks
      const dueTime = taskDatesCache.get(task.id);

      if (dueTime === undefined) {
        if (isToday) selected.push(task);
        return;
      }

      if (dueTime === selectedDateTime) {
        selected.push(task);
      } else if (dueTime < todayTime && isToday) {
        overdue.push(task);
      }
    });

    const sortByPriority = (a: PersonalItem, b: PersonalItem) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority || 'medium'] - order[b.priority || 'medium']);
    };

    selected.sort(sortByPriority);
    overdue.sort(sortByPriority);

    const totalTasks = selected.length + overdue.length;
    const completedCount = completed.length;
    const percentage = totalTasks + completedCount > 0
      ? Math.round((completedCount / (totalTasks + completedCount)) * 100) : 0;

    return {
      dateTasks: selected,
      overdueTasks: overdue,
      completedTasks: completed,
      stats: { total: totalTasks, completed: completedCount, percentage }
    };
  }, [tasks, selectedDate, isToday, today, taskDatesCache]);

  // Get habits (only show on today)
  const habits = useMemo(() => {
    if (!isToday) return [];
    return personalItems.filter(item => item.type === 'habit' && isHabitForToday(item));
  }, [personalItems, isToday]);

  const handleDateSelect = useCallback((date: Date) => {
    hapticSelection();
    playClick();
    // Notify parent if callback provided, otherwise use internal state
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
  }, [hapticSelection, playClick, onSelectedDateChange]);

  // ✅ PERF: Memoize day formatter to avoid re-creation
  const formatDayLabel = useCallback((date: Date) => {
    const dayNames = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    return dayNames[date.getDay()];
  }, []);

  return (
    <div className="w-full">
      {/* Weekly Planner - Obsidian Air Premium */}
      <div className="w-full bg-white/[0.02] backdrop-blur-xl border-y border-white/[0.06] py-5 mb-8">
        <div className="flex items-center justify-between px-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">תכנון שבועי</span>
            {isToday && stats.total > 0 && (
              <span className="text-[10px] bg-accent-cyan/10 text-accent-cyan/90 px-2.5 py-1 rounded-xl border border-accent-cyan/15 font-semibold tabular-nums">
                {stats.completed}/{stats.total + stats.completed}
              </span>
            )}
          </div>
          <AnimatedProgressRing percentage={stats.percentage} size={40} strokeWidth={5} />
        </div>

        {/* Days - premium glass buttons */}
        <div className="flex gap-2 px-4">
          {weekDays.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = tasks.filter(t => t.dueDate === dateStr && !t.isCompleted);
            const isSelectedDay = date.toDateString() === selectedDate.toDateString();
            const isTodayDay = date.toDateString() === today.toDateString();

            return (
              <motion.button
                key={dateStr}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -1 }}
                onClick={() => handleDateSelect(date)}
                className={`flex-1 py-3 rounded-2xl text-center transition-all duration-300 min-w-0 border ${isSelectedDay
                  ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-[var(--dynamic-accent-start)]/30 shadow-[0_0_16px_-4px_var(--dynamic-accent-glow)]'
                  : isTodayDay
                    ? 'bg-white/[0.04] border-accent-cyan/20 hover:bg-white/[0.06]'
                    : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1]'
                  }`}
                style={{ willChange: 'transform' }}
              >
                <span className={`text-[10px] block font-semibold ${isSelectedDay ? 'text-[var(--dynamic-accent-start)]' : isTodayDay ? 'text-accent-cyan/70' : 'text-white/30'}`}>
                  {formatDayLabel(date)}
                </span>
                <span className={`text-base font-bold block mt-0.5 ${isSelectedDay ? 'text-white' : isTodayDay ? 'text-accent-cyan' : 'text-white/60'}`}>
                  {date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full mx-auto mt-1.5 block transition-all ${isSelectedDay ? 'bg-[var(--dynamic-accent-start)] shadow-[0_0_6px_var(--dynamic-accent-glow)]' : isTodayDay ? 'bg-accent-cyan/50' : 'bg-white/20'}`} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Label (only if not today) */}
      {!isToday && (
        <div className="flex items-center justify-between px-4 mb-6">
          <button onClick={() => handleDateSelect(new Date())} className="text-xs text-accent-cyan font-medium">
            ← חזור להיום
          </button>
          <span className="text-sm font-medium text-white">
            {selectedDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
      )}

      {/* Overdue Tasks (only on Today) - Premium Warning Style */}
      {isToday && overdueTasks.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-red-500/[0.08] via-red-500/[0.03] to-transparent border-y border-red-500/15">
          <div className="px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[13px] font-bold text-red-400/90">באיחור ({overdueTasks.length})</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onRollOverTasks}
                className="text-[11px] text-accent-cyan font-semibold px-3.5 py-1.5 rounded-xl bg-accent-cyan/[0.08] border border-accent-cyan/20 hover:bg-accent-cyan/15 transition-all duration-300"
              >
                גלגל להיום
              </motion.button>
            </div>
            <div className="space-y-3">
              {overdueTasks.map((task, index) => (
                <TaskItem key={task.id} item={task} onUpdate={onUpdateItem} onDelete={onDeleteItem}
                  onSelect={onSelectItem} onContextMenu={onContextMenu} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tasks Section - Premium Glass Container */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
            {isToday ? 'משימות היום' : 'משימות'}
          </span>
          <span className="text-[10px] text-white/35 bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/[0.05] font-semibold">{dateTasks.length} פריטים</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="sync">
            {dateTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
                layout
              >
                <TaskItem
                  item={task}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                  onSelect={onSelectItem}
                  onContextMenu={onContextMenu}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {dateTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-14 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
          >
            <motion.span
              className="text-4xl mb-4 block"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✨
            </motion.span>
            <p className="text-white/50 text-[15px] font-medium">
              {isToday ? 'יום נקי! אין משימות להיום' : 'אין משימות ליום זה'}
            </p>
            <p className="text-white/25 text-[12px] mt-1.5">הוסף משימה חדשה כדי להתחיל</p>
          </motion.div>
        )}
      </div>

      {/* Habits (only on Today) - Premium Section */}
      {isToday && habits.length > 0 && (
        <div className="bg-white/[0.02] backdrop-blur-xl border-y border-white/[0.06] py-6 mb-8">
          <div className="px-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🔥</span>
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">הרגלים</span>
              </div>
              <span className="text-[10px] text-white/35 bg-white/[0.04] px-2.5 py-1 rounded-xl border border-white/[0.05] font-semibold">{habits.length} פריטים</span>
            </div>
            <div className="space-y-3">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <HabitItem
                    item={habit}
                    onUpdate={onUpdateItem}
                    onDelete={onDeleteItem}
                    onSelect={onSelectItem}
                    onContextMenu={onContextMenu}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="px-4 opacity-50 hover:opacity-70 transition-opacity duration-500">
          <Section
            componentId="completed"
            title="הושלמו"
            count={completedTasks.length}
            isCollapsible={true}
            isExpanded={false}
            onToggle={() => { }}
          >
            <div className="space-y-2">
              {completedTasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  item={task}
                  onUpdate={onUpdateItem}
                  onDelete={onDeleteItem}
                  onSelect={onSelectItem}
                  onContextMenu={onContextMenu}
                  index={index}
                />
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

export default TodayView;
