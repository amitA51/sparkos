import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { PersonalItem, GoogleCalendarEvent, AddableType } from '../../types';
import { AddIcon, GoogleCalendarIcon } from '../icons';
import HabitCalendarStripes from './HabitCalendarStripes';
import { useData } from '../../src/contexts/DataContext';
import { getIconForName } from '../IconMap';
import { PERSONAL_ITEM_TYPE_COLORS } from '../../constants';

// --- i18n Constants ---
const LABELS = {
    ALL_DAY: 'כל היום', // Localized 'All-day' for he-IL context
    ADD_NOTE: 'הוסף פתק'
};

const formatTime = (isoString?: string) => {
    if (!isoString) return LABELS.ALL_DAY;
    return new Intl.DateTimeFormat('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(isoString));
};

// --- Sub-Components ---

// Component for a PersonalItem in the calendar
export const CalendarItem: React.FC<{ item: PersonalItem; onSelect: (e: React.MouseEvent) => void }> = ({
    item,
    onSelect,
}) => {
    const { spaces } = useData();
    const space = item.spaceId ? spaces.find(s => s.id === item.spaceId) : null;
    const color = space?.color || PERSONAL_ITEM_TYPE_COLORS[item.type];
    const Icon = item.icon ? getIconForName(item.icon) : null;

    return (
        <div
            draggable
            onDragStart={(e: React.DragEvent) => {
                if (e.dataTransfer) {
                    e.dataTransfer.setData('application/json', JSON.stringify(item));
                    e.dataTransfer.effectAllowed = 'move';
                }
                (e.currentTarget as HTMLElement).style.opacity = '0.5';
            }}
            onDragEnd={(e: React.DragEvent) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            className="w-full"
        >
            <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSelect}
                className="w-full text-right text-[11px] p-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    border: `0.5px solid ${color}25`,
                }}
            >
                <div className="w-1 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />}
                <p className="truncate font-medium leading-tight">
                    {item.title}
                </p>
            </motion.button>
        </div>
    );
};

// Component for a Google Calendar event
export const GoogleEventItem: React.FC<{ event: GoogleCalendarEvent }> = ({ event }) => {
    const startTime = formatTime(event.start?.dateTime);

    return (
        <motion.a
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-right text-[11px] p-1.5 rounded-lg transition-all flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/10 hover:border-blue-500/30 shadow-sm group"
        >
            <div className="w-1 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <GoogleCalendarIcon className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
            <div className="truncate flex-1">
                <span className="font-medium mr-1">{event.summary}</span>
                <span className="opacity-60 text-[10px]">{startTime}</span>
            </div>
        </motion.a>
    );
};


interface CalendarDayCellProps {
    day: number;
    date: Date;
    dateKey: string;
    items: (PersonalItem | GoogleCalendarEvent)[];
    isToday: boolean;
    isWeekend: boolean;
    isDragOver: boolean;
    onDragOver: (dateKey: string) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent, date: Date) => void;
    onQuickAdd: (type: AddableType, date: string) => void;
    onSelectItem: (item: PersonalItem, event: React.MouseEvent) => void;
    completionsIndex: string[];
    habitColorMap: Record<string, string>;
    habitTitleMap: Record<string, string>;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
    day,
    date,
    dateKey,
    items,
    isToday,
    isWeekend,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onQuickAdd,
    onSelectItem,
    completionsIndex,
    habitColorMap,
    habitTitleMap
}) => {
    return (
        <div
            onDragOver={e => {
                e.preventDefault();
                onDragOver(dateKey);
            }}
            onDragLeave={onDragLeave}
            onDrop={e => onDrop(e, date)}
            className={`relative p-2 h-32 md:h-40 flex flex-col group transition-all duration-200
        ${isDragOver ? 'ring-2 ring-inset ring-[var(--dynamic-accent-start)]' : ''}
      `}
            style={{
                background: isDragOver
                    ? 'color-mix(in srgb, var(--dynamic-accent-start) 5%, var(--bg-card))'
                    : isToday
                        ? 'color-mix(in srgb, var(--dynamic-accent-start) 4%, var(--bg-card))'
                        : isWeekend
                            ? 'color-mix(in srgb, var(--bg-secondary) 30%, var(--bg-card))'
                            : 'var(--bg-card)',
            }}
        >
            <div className="flex justify-between items-start mb-1">
                <motion.span
                    whileTap={{ scale: 0.9 }}
                    className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300
            ${isToday
                            ? 'text-white shadow-lg'
                            : 'text-[var(--text-secondary)]'
                        }`}
                    style={isToday ? {
                        background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                        boxShadow: '0 2px 8px var(--dynamic-accent-glow)',
                    } : undefined}
                >
                    {day}
                </motion.span>

                {/* Quick Add Button (Visible on Hover) */}
                <motion.button
                    onClick={() => onQuickAdd('note', dateKey)}
                    whileTap={{ scale: 0.85 }}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full text-secondary"
                    title={LABELS.ADD_NOTE}
                >
                    <AddIcon className="w-3.5 h-3.5" />
                </motion.button>
            </div>

            {/* Habit Stripes */}
            <HabitCalendarStripes
                completedHabitIds={completionsIndex}
                habitColorMap={habitColorMap}
                habitTitleMap={habitTitleMap}
            />

            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 -mr-1 pr-1 mt-1">
                {items.map((item, index) => {
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
        </div>
    );
};

export default memo(CalendarDayCell);
