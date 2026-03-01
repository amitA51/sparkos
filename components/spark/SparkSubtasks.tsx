/**
 * ═══════════════════════════════════════════════════════════════
 * SPARK SUBTASKS - Subtasks Checklist Component
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '../icons';

interface SparkSubtasksProps {
    /** Array of subtask strings */
    subtasks: string[];
    /** Set of completed subtask indices */
    completedIndices?: Set<number>;
    /** Callback when subtask is toggled */
    onToggle?: (index: number) => void;
    /** Whether subtasks are read-only */
    readOnly?: boolean;
    /** Show collapsed by default */
    defaultCollapsed?: boolean;
    /** Maximum visible when collapsed */
    collapsedMax?: number;
    /** Custom class name */
    className?: string;
}

export const SparkSubtasks: React.FC<SparkSubtasksProps> = ({
    subtasks,
    completedIndices = new Set(),
    onToggle,
    readOnly = false,
    defaultCollapsed = true,
    collapsedMax = 3,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);

    if (!subtasks || subtasks.length === 0) return null;

    const visibleSubtasks = isExpanded ? subtasks : subtasks.slice(0, collapsedMax);
    const hiddenCount = subtasks.length - collapsedMax;
    const completedCount = Array.from(completedIndices).length;
    const progressPercent = (completedCount / subtasks.length) * 100;

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Progress Header */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <span className="text-[10px] font-mono text-white/40">
                    {completedCount}/{subtasks.length}
                </span>
            </div>

            {/* Subtasks List */}
            <ul className="space-y-1">
                <AnimatePresence>
                    {visibleSubtasks.map((subtask, index) => {
                        const isCompleted = completedIndices.has(index);

                        return (
                            <motion.li
                                key={`${subtask}-${index}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: index * 0.03 }}
                                className={`
                  flex items-start gap-2 p-2 rounded-lg
                  ${readOnly ? '' : 'cursor-pointer hover:bg-white/5'}
                  transition-colors duration-200
                `}
                                onClick={() => !readOnly && onToggle?.(index)}
                            >
                                {/* Checkbox */}
                                <div className={`
                  flex-shrink-0 w-4 h-4 mt-0.5 rounded-full border-2 
                  flex items-center justify-center transition-all duration-200
                  ${isCompleted
                                        ? 'bg-gradient-to-br from-cyan-500 to-violet-500 border-transparent'
                                        : 'border-white/20 hover:border-cyan-500/50'
                                    }
                `}>
                                    {isCompleted && (
                                        <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                                    )}
                                </div>

                                {/* Text */}
                                <span className={`
                  text-sm leading-tight transition-all duration-200
                  ${isCompleted
                                        ? 'text-white/40 line-through'
                                        : 'text-white/80'
                                    }
                `}>
                                    {subtask}
                                </span>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>

            {/* Expand/Collapse Button */}
            {!isExpanded && hiddenCount > 0 && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full text-center text-xs text-white/40 hover:text-cyan-400 
                     py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                    + {hiddenCount} עוד משימות
                </button>
            )}

            {isExpanded && subtasks.length > collapsedMax && (
                <button
                    onClick={() => setIsExpanded(false)}
                    className="w-full text-center text-xs text-white/40 hover:text-cyan-400 
                     py-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                    הצג פחות
                </button>
            )}
        </div>
    );
};

export default SparkSubtasks;
