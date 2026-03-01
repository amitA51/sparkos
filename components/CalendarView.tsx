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
  const changeDate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(currentDate.getMonth() + delta);
    else newDate.setDate(currentDate.getDate() + delta * 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      {/* Date Navigation */}
      <div className="flex items-center gap-4 bg-[var(--bg-secondary)]/40 p-1.5 rounded-full backdrop-blur-md border border-[var(--border-primary)]/30">
        <button
          onClick={() => setCurrentDate(new Date())}
          className="text-xs font-bold bg-[var(--dynamic-accent-start)] text-white px-4 py-2 rounded-full shadow-lg shadow-[var(--dynamic-accent-start)]/20 hover:brightness-110 transition-all"
        >
          היום
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)]/50 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 transform rotate-180" />
          </button>
          <span className="text-lg font-bold text-[var(--text-primary)] min-w-[140px] text-center capitalize">
            {currentDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-full hover:bg-[var(--bg-tertiary)]/50 text-[var(--text-secondary)] transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex p-1 bg-[var(--bg-secondary)]/40 rounded-full border border-[var(--border-primary)]/30 backdrop-blur-sm">
        <button
          onClick={() => setViewMode('month')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === 'month'
            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          חודש
        </button>
        <button
          onClick={() => setViewMode('week')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === 'week'
            ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
        >
          שבוע
        </button>
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
      <div className="rounded-3xl overflow-hidden border border-[var(--border-primary)]/50 bg-[var(--bg-card)]/30 backdrop-blur-xl shadow-2xl">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[var(--border-primary)]/30 bg-[var(--bg-secondary)]/50">
          {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
            <div
              key={d}
              className="text-center font-bold text-xs text-[var(--text-secondary)] py-3"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 bg-[var(--border-primary)]/10 gap-[1px]">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[var(--bg-card)]/50 h-32 md:h-40" />
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
            <div
              key={dateKey}
              onDragOver={e => {
                e.preventDefault();
                setDragOverDate(dateKey);
              }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={e => handleDrop(e, day)}
              className={`snap-center flex-shrink-0 w-[85vw] sm:w-[300px] h-[65vh] rounded-3xl border border-[var(--border-primary)]/50 p-4 flex flex-col relative transition-all duration-300
                ${isToday
                  ? 'bg-gradient-to-b from-[var(--dynamic-accent-start)]/10 to-[var(--bg-card)] border-[var(--dynamic-accent-start)]/30 shadow-lg shadow-[var(--dynamic-accent-start)]/5'
                  : 'bg-[var(--bg-card)]/60 backdrop-blur-md'
                }
                ${dragOverDate === dateKey ? 'scale-[1.02] ring-2 ring-[var(--dynamic-accent-start)]' : ''}
              `}
            >
              <div className="text-center mb-4 pb-4 border-b border-[var(--border-primary)]/20">
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isToday ? 'text-[var(--dynamic-accent-start)]' : 'text-[var(--text-secondary)]'}`}>
                  {['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'][day.getDay()]}
                </p>
                <div className={`text-4xl font-bold ${isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
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

              <button
                onClick={() => onQuickAdd('note', dateKey)}
                className="w-full mt-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 text-sm font-medium group"
              >
                <AddIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>הוסף פתק</span>
              </button>
            </div>
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
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' ? renderMonthView() : renderWeekView()}
        </motion.div>
      </AnimatePresence>

      {/* Habit Legend */}
      {habits.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl bg-[var(--bg-card)]/40 border border-[var(--border-primary)]/30 backdrop-blur-md">
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
