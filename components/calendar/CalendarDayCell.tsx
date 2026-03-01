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
                onClick={onSelect}
                className={`w-full text-right text-[11px] p-1.5 rounded-lg transition-shadow flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-${color}/20 shadow-sm`}
                style={{
                    backgroundColor: `${color}15`,
                    color: color
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
            className={`relative bg-[var(--bg-card)]/80 hover:bg-[var(--bg-card)] transition-colors p-2 h-32 md:h-40 flex flex-col group
        ${isDragOver ? 'ring-2 ring-inset ring-[var(--dynamic-accent-start)] bg-[var(--dynamic-accent-start)]/5' : ''}
        ${isWeekend ? 'bg-[var(--bg-secondary)]/30' : ''}
      `}
        >
            <div className="flex justify-between items-start mb-1">
                <span
                    className={`text-sm font-medium transition-all duration-300
            ${isToday
                            ? 'bg-gradient-to-br from-[var(--dynamic-accent-start)] to-[var(--dynamic-accent-end)] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform scale-110'
                            : 'text-[var(--text-secondary)] w-7 h-7 flex items-center justify-center'
                        }`}
                >
                    {day}
                </span>

                {/* Quick Add Button (Visible on Hover) */}
                <button
                    onClick={() => onQuickAdd('note', dateKey)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)]"
                    title={LABELS.ADD_NOTE}
                >
                    <AddIcon className="w-3.5 h-3.5" />
                </button>
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
