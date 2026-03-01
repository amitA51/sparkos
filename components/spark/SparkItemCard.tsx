/**
 * ═══════════════════════════════════════════════════════════════
 * SPARK ITEM CARD - Premium Card for AI-Generated Items
 * ═══════════════════════════════════════════════════════════════
 * 
 * A comprehensive card component for displaying SparkItems with:
 * - Subtasks checklist
 * - Tags display
 * - AI metadata (duration, reasoning, links)
 * - Scheduling info
 * - Premium glass design
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { SparkItem } from '../../types/SparkItemTypes';
import { hasSubtasks, hasTags, hasMeta } from '../../types/SparkItemTypes';
import { getPriorityLabel, getPriorityClasses, formatDuration, formatScheduling } from '../../utils/sparkItemUtils';
import { SparkTags } from './SparkTags';
import { SparkSubtasks } from './SparkSubtasks';
import { SparkMeta } from './SparkMeta';
import { UltraCard } from '../ui/UltraCard';
import {
    CheckCircleIcon,
    CalendarIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '../icons';
import { getIconForName } from '../IconMap';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface SparkItemCardProps {
    /** The SparkItem to display */
    item: SparkItem;
    /** Callback when card is clicked/selected */
    onSelect?: (item: SparkItem) => void;
    /** Callback when status is updated */
    onStatusChange?: (id: string, status: SparkItem['status']) => void;
    /** Callback when subtask is toggled */
    onSubtaskToggle?: (itemId: string, subtaskIndex: number) => void;
    /** Set of completed subtask indices */
    completedSubtaskIndices?: Set<number>;
    /** Card index for staggered animations */
    index?: number;
    /** Whether card is in compact mode */
    compact?: boolean;
    /** Custom class name */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════
// TYPE ICON MAPPING
// ═══════════════════════════════════════════════════════════════

const TYPE_ICONS: Record<string, string> = {
    task: 'clipboard',
    event: 'calendar',
    learning: 'book-open',
    idea: 'lightbulb',
    habit: 'sparkles',
    fitness: 'dumbbell',
    project: 'target',
};

const TYPE_COLORS: Record<string, string> = {
    task: 'var(--success)',
    event: '#F472B6',
    learning: '#38BDF8',
    idea: 'var(--warning)',
    habit: '#F472B6',
    fitness: '#F472B6',
    project: '#3B82F6',
};

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export const SparkItemCard: React.FC<SparkItemCardProps> = ({
    item,
    onSelect,
    onStatusChange,
    onSubtaskToggle,
    completedSubtaskIndices = new Set(),
    index = 0,
    compact = false,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isCompleted = item.status === 'done';
    const priorityLabel = getPriorityLabel(item.priority);
    const priorityClasses = getPriorityClasses(item.priority);
    const schedulingText = formatScheduling(item.scheduling);
    const typeIcon = TYPE_ICONS[item.type] || 'sparkles';
    const typeColor = TYPE_COLORS[item.type] || 'var(--accent)';
    const duration = item.meta?.estimatedDuration;

    // Toggle completion status
    const handleToggleComplete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStatusChange) {
            onStatusChange(item.id, isCompleted ? 'todo' : 'done');
        }
    }, [item.id, isCompleted, onStatusChange]);

    // Toggle card expansion
    const handleToggleExpand = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    // Handle subtask toggle
    const handleSubtaskToggle = useCallback((subtaskIndex: number) => {
        if (onSubtaskToggle) {
            onSubtaskToggle(item.id, subtaskIndex);
        }
    }, [item.id, onSubtaskToggle]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <UltraCard
                variant="glass"
                glowColor={isCompleted ? 'neutral' : 'cyan'}
                className={`
          group relative transition-all duration-300
          cursor-pointer hover:shadow-lg hover:-translate-y-1
          ${isCompleted ? 'opacity-60 grayscale-[0.3]' : ''}
          ${className}
        `}
                onClick={() => onSelect?.(item)}
                noPadding
            >
                <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-start gap-3">
                        {/* Type Icon + Completion Toggle */}
                        <button
                            onClick={handleToggleComplete}
                            className="flex-shrink-0 mt-0.5 group/check"
                        >
                            <div
                                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center
                  transition-all duration-300 border
                  ${isCompleted
                                        ? 'bg-gradient-to-br from-cyan-500 to-violet-500 border-transparent'
                                        : 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                                    }
                `}
                                style={{
                                    '--type-color': typeColor,
                                    boxShadow: isCompleted ? '0 0 20px -5px rgba(0, 240, 255, 0.4)' : undefined
                                } as React.CSSProperties}
                            >
                                {isCompleted ? (
                                    <CheckCircleIcon className="w-4 h-4 text-white" />
                                ) : (
                                    React.createElement(getIconForName(typeIcon), {
                                        className: 'w-4 h-4',
                                        style: { color: typeColor }
                                    })
                                )}
                            </div>
                        </button>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Title Row */}
                            <div className="flex items-start justify-between gap-2">
                                <h3 className={`
                  font-heading font-bold text-base leading-tight
                  transition-colors duration-200
                  ${isCompleted
                                        ? 'text-theme-muted line-through'
                                        : 'text-theme-primary group-hover:text-cyan-50'
                                    }
                `}>
                                    {item.title}
                                </h3>

                                {/* Expand Button (if has subtasks) */}
                                {hasSubtasks(item) && (
                                    <button
                                        onClick={handleToggleExpand}
                                        className="p-1 rounded-lg text-white/40 hover:text-white 
                               hover:bg-white/10 transition-colors"
                                    >
                                        {isExpanded
                                            ? <ChevronUpIcon className="w-4 h-4" />
                                            : <ChevronDownIcon className="w-4 h-4" />
                                        }
                                    </button>
                                )}
                            </div>

                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Priority Badge */}
                                {priorityLabel && (
                                    <span className={`
                    text-[10px] px-2 py-0.5 rounded-full border 
                    font-bold tracking-wider ${priorityClasses}
                  `}>
                                        {priorityLabel}
                                    </span>
                                )}

                                {/* Duration Badge */}
                                {duration && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full 
                                   bg-white/5 text-white/60 border border-white/5
                                   font-medium">
                                        {formatDuration(duration)}
                                    </span>
                                )}

                                {/* Scheduling Info */}
                                {schedulingText && (
                                    <span className="flex items-center gap-1 text-[10px] 
                                   px-2 py-0.5 rounded-full
                                   bg-white/5 text-white/60 border border-white/5">
                                        <CalendarIcon className="w-3 h-3" />
                                        {schedulingText}
                                    </span>
                                )}

                                {/* AI Reasoning & Links */}
                                {hasMeta(item) && (
                                    <SparkMeta
                                        meta={item.meta}
                                        itemType={item.type}
                                        hideFields={['duration']} // Already showing duration above
                                        size="sm"
                                    />
                                )}
                            </div>

                            {/* Content Preview (if not expanded) */}
                            {!compact && item.content && !isExpanded && (
                                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                                    {item.content}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Expandable Subtasks Section */}
                    {hasSubtasks(item) && isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-3 border-t border-white/5"
                        >
                            <SparkSubtasks
                                subtasks={item.subtasks!}
                                completedIndices={completedSubtaskIndices}
                                onToggle={handleSubtaskToggle}
                                readOnly={!onSubtaskToggle}
                                defaultCollapsed={false}
                            />
                        </motion.div>
                    )}

                    {/* Tags Row (at bottom) */}
                    {hasTags(item) && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <SparkTags tags={item.tags!} maxVisible={4} />
                        </div>
                    )}
                </div>
            </UltraCard>
        </motion.div>
    );
};

export default SparkItemCard;
