import React, { useState, useMemo } from 'react';
import type { PersonalItem, AddableType, GoogleCalendarEvent } from '../types';
import { ChevronLeftIcon, AddIcon } from './icons';
import { useData } from '../src/contexts/DataContext';
import { useCalendar } from '../src/contexts/CalendarContext';
import { HabitCalendarStripes, HabitCalendarLegend, CalendarDayCell, CalendarItem, GoogleEventItem } from './calendar';
import { buildHabitColorMap, buildCompletionsIndex, buildHabitTitleMap } from '../utils/habitCalendarUtils';
import { motion, AnimatePresence } from 'framer-motion';

// Types and Props
type CalendarViewMode = 'month' | 'week';

interface CalendarViewProps {
  items: PersonalItem[];
  onSelectItem: (item: PersonalItem, event: React.MouseEvent) => void;
  onUpdate: (id: string, updates: Partial<PersonalItem>) => void;
  onQuickAdd: (type: AddableType, date: string) => void;
}

// Utility to get a YYYY-MM-DD string from a Date object, timezone-agnostic.
const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- Sub-Components ---

// Header for navigation and view switching
const CalendarHeader: React.FC<{
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;
}> = ({ currentDate, setCurrentDate, viewMode, setViewMode }) => {
  const [navDirection, setNavDirection] = useState(0);

  const changeDate = (delta: number) => {
    setNavDirection(delta);
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(currentDate.getMonth() + delta);
    else newDate.setDate(currentDate.getDate() + delta * 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* Date Navigation */}
      <div
        className="flex items-center gap-3 p-1.5 rounded-2xl backdrop-blur-md cal-nav-container"
      >
        <motion.button
          onClick={() => setCurrentDate(new Date())}
          whileTap={{ scale: 0.93 }}
          className="text-xs font-bold text-white px-4 py-2 rounded-xl transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
            boxShadow: '0 2px 8px var(--dynamic-accent-glow)',
          }}
        >
          היום
        </motion.button>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={() => changeDate(-1)}
            whileTap={{ scale: 0.88 }}
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeftIcon className="w-5 h-5 transform rotate-180" />
          </motion.button>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
              initial={{ opacity: 0, x: navDirection * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: navDirection * -20 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg font-bold min-w-[140px] text-center capitalize"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
            </motion.span>
          </AnimatePresence>
          <motion.button
            onClick={() => changeDate(1)}
            whileTap={{ scale: 0.88 }}
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* View Switcher */}
      <div
        className="flex p-1 rounded-2xl backdrop-blur-sm relative cal-nav-container"
      >
        {['month', 'week'].map((mode) => {
          const isActive = viewMode === mode;
          return (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode as CalendarViewMode)}
              whileTap={{ scale: 0.95 }}
              className="relative px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 z-10"
              style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="calViewIndicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{mode === 'month' ? 'חודש' : 'שבוע'}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};



// --- Main View Component ---

const CalendarView: React.FC<CalendarViewProps> = ({
  items,
  onSelectItem,
  onUpdate,
  onQuickAdd,
}) => {
  const { calendarEvents } = useCalendar();
  const { personalItems } = useData();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // === Habit Calendar Visualization ===
  const habits = useMemo(() =>
    personalItems.filter(item => item.type === 'habit'),
    [personalItems]
  );

  const habitColorMap = useMemo(() =>
    buildHabitColorMap(habits),
    [habits]
  );

  const habitTitleMap = useMemo(() =>
    buildHabitTitleMap(habits),
    [habits]
  );

  const completionsIndex = useMemo(() =>
    buildCompletionsIndex(habits),
    [habits]
  );

  const combinedItemsByDate = useMemo(() => {
    const map = new Map<string, (PersonalItem | GoogleCalendarEvent)[]>();

    const addOrPush = (key: string, item: PersonalItem | GoogleCalendarEvent) => {
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    };

    // Add Personal Items
    items.forEach(item => {
      const dateStr = item.dueDate || (item.metadata as { targetDate?: string } | undefined)?.targetDate;
      if (dateStr) {
        addOrPush(dateStr, item);
      }
    });

    // Add Google Calendar Events
    calendarEvents.forEach(event => {
      const dateStr = event.start?.dateTime || event.start?.date;
      if (dateStr) {
        const dateKey = dateStr.substring(0, 10);
        addOrPush(dateKey, event);
      }
    });

    // Sort items within each day
    map.forEach(dayItems => {
      dayItems.sort((a, b) => {
        const timeA =
          'start' in a ? (a.start?.dateTime ? new Date(a.start.dateTime).getTime() : -1) : 0;
        const timeB =
          'start' in b ? (b.start?.dateTime ? new Date(b.start.dateTime).getTime() : -1) : 0;
        if (timeA !== timeB) return timeA - timeB;
        return 0; // Keep personal item order for now
      });
    });

    return map;
  }, [items, calendarEvents]);

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);
    try {
      if (!e.dataTransfer) {
        return;
      }
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      const item = JSON.parse(raw) as PersonalItem;
      if (item && item.id) {
        // Check if it's a PersonalItem
        const newDate = getDateKey(targetDate);
        const updates: Partial<PersonalItem> = {};
        if ('dueDate' in item || item.type === 'task' || item.type === 'note')
          updates.dueDate = newDate;
        if (item.metadata && 'targetDate' in item.metadata) {
          updates.metadata = { ...item.metadata, targetDate: newDate };
        } else if (item.type === 'goal') {
          updates.metadata = { targetDate: newDate };
        }
        if (Object.keys(updates).length > 0) {
          onUpdate(item.id, updates);
        }
      }
    } catch (err) {
      console.error('Failed to handle drop:', err);
    }
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    return (
      <div className="rounded-3xl overflow-hidden backdrop-blur-xl" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)' }}>
        {/* Days Header */}
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((d, i) => (
            <div
              key={d}
              className="text-center font-bold text-xs py-3 cal-day-header"
              style={{ color: (i === 5 || i === 6) ? 'var(--dynamic-accent-start)' : 'var(--text-secondary)' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 md:h-40 cal-empty-cell" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dateKey = getDateKey(date);
            const itemsForDay = combinedItemsByDate.get(dateKey) || [];
            const isToday = getDateKey(new Date()) === dateKey;
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

            return (
              <CalendarDayCell
                key={day}
                day={day}
                date={date}
                dateKey={dateKey}
                items={itemsForDay}
                isToday={isToday}
                isWeekend={isWeekend}
                isDragOver={dragOverDate === dateKey}
                onDragOver={setDragOverDate}
                onDragLeave={() => setDragOverDate(null)}
                onDrop={handleDrop}
                onQuickAdd={onQuickAdd}
                onSelectItem={onSelectItem}
                completionsIndex={completionsIndex[dateKey] || []}
                habitColorMap={habitColorMap}
                habitTitleMap={habitTitleMap}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scroll-smooth hide-scrollbar">
        {weekDays.map(day => {
          const dateKey = getDateKey(day);
          const itemsForDay = combinedItemsByDate.get(dateKey) || [];
          const isToday = getDateKey(new Date()) === dateKey;

          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(weekDays.indexOf(day) * 0.04, 0.24), duration: 0.3 }}
              onDragOver={e => {
                e.preventDefault();
                setDragOverDate(dateKey);
              }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={e => handleDrop(e, day)}
              className={`snap-center flex-shrink-0 w-[85vw] sm:w-[300px] h-[65vh] rounded-3xl p-4 flex flex-col relative transition-all duration-300 backdrop-blur-md
                ${dragOverDate === dateKey ? 'scale-[1.02] ring-2 ring-[var(--dynamic-accent-start)]' : ''}
              `}
              style={{
                background: isToday
                  ? 'color-mix(in srgb, var(--dynamic-accent-start) 6%, var(--bg-card))'
                  : 'var(--bg-card)',
                border: isToday
                  ? '1px solid color-mix(in srgb, var(--dynamic-accent-start) 30%, transparent)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isToday ? '0 8px 32px var(--dynamic-accent-glow)' : 'var(--shadow-md)',
              }}
            >
              <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: isToday ? 'var(--dynamic-accent-start)' : 'var(--text-secondary)' }}>
                  {['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'][day.getDay()]}
                </p>
                <div className="text-4xl font-bold" style={{ color: isToday ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {day.getDate()}
                </div>
              </div>

              {/* Habit Stripes */}
              <div className="mb-3">
                <HabitCalendarStripes
                  completedHabitIds={completionsIndex[dateKey] || []}
                  habitColorMap={habitColorMap}
                  habitTitleMap={habitTitleMap}
                />
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {itemsForDay.length === 0 && (
                  <div className="h-full flex items-center justify-center text-[var(--text-tertiary)] text-xs italic">
                    אין אירועים
                  </div>
                )}
                {itemsForDay.map((item, index) => {
                  if ('summary' in item) {
                    return (
                      <GoogleEventItem
                        key={`g-${(item as GoogleCalendarEvent).summary}-${index}`}
                        event={item as GoogleCalendarEvent}
                      />
                    );
                  } else {
                    return (
                      <CalendarItem
                        key={item.id}
                        item={item as PersonalItem}
                        onSelect={e => onSelectItem(item as PersonalItem, e)}
                      />
                    );
                  }
                })}
              </div>

              <motion.button
                onClick={() => onQuickAdd('note', dateKey)}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium group cal-quick-add"
              >
                <AddIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>הוסף פתק</span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animation-fade-in">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${currentDate.getMonth()}-${currentDate.getFullYear()}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {viewMode === 'month' ? renderMonthView() : renderWeekView()}
        </motion.div>
      </AnimatePresence>

      {/* Habit Legend */}
      {habits.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl backdrop-blur-md" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <HabitCalendarLegend
            habits={habits}
            habitColorMap={habitColorMap}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(CalendarView);
