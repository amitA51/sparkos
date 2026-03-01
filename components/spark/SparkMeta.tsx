/**
 * ═══════════════════════════════════════════════════════════════
 * SPARK META - AI Metadata Display Component
 * ═══════════════════════════════════════════════════════════════
 * 
 * Displays rich metadata from AI analysis including:
 * - Estimated duration
 * - Reading time
 * - AI reasoning tooltip
 * - Original URL link
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, LinkIcon, SparklesIcon } from '../icons';
import type { SparkMeta as SparkMetaType } from '../../types/SparkItemTypes';
import { formatDuration } from '../../utils/sparkItemUtils';

interface SparkMetaProps {
    /** Meta object from SparkItem */
    meta?: SparkMetaType;
    /** Item type for context-aware display */
    itemType?: string;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Hide specific fields */
    hideFields?: ('duration' | 'readingTime' | 'aiReasoning' | 'url')[];
    /** Custom class name */
    className?: string;
}

export const SparkMeta: React.FC<SparkMetaProps> = ({
    meta,
    itemType,
    size = 'sm',
    hideFields = [],
    className = '',
}) => {
    const [showReasoning, setShowReasoning] = useState(false);

    if (!meta) return null;

    const showDuration = meta.estimatedDuration && !hideFields.includes('duration');
    const showReadingTime = meta.readingTime && !hideFields.includes('readingTime');
    const showAiReasoning = meta.aiReasoning && !hideFields.includes('aiReasoning');
    const showUrl = meta.url && itemType === 'learning' && !hideFields.includes('url');

    if (!showDuration && !showReadingTime && !showAiReasoning && !showUrl) {
        return null;
    }

    const sizeClasses = size === 'sm'
        ? 'text-[10px] gap-1.5'
        : 'text-xs gap-2';

    return (
        <div className={`flex flex-wrap items-center ${sizeClasses} ${className}`}>
            {/* Duration Badge */}
            {showDuration && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full 
                         bg-white/5 text-white/60 border border-white/5
                         font-medium">
                    <ClockIcon className="w-3 h-3" />
                    {formatDuration(meta.estimatedDuration)}
                </span>
            )}

            {/* Reading Time */}
            {showReadingTime && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full 
                         bg-blue-500/10 text-blue-400 border border-blue-500/20
                         font-medium">
                    📖 {meta.readingTime}
                </span>
            )}

            {/* AI Reasoning Toggle */}
            {showAiReasoning && (
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowReasoning(!showReasoning);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full 
                       bg-violet-500/10 text-violet-400 border border-violet-500/20
                       hover:bg-violet-500/20 transition-colors font-medium"
                        title="הסבר AI"
                    >
                        <SparklesIcon className="w-3 h-3" />
                        ✨
                    </button>

                    {/* Reasoning Tooltip/Dropdown */}
                    <AnimatePresence>
                        {showReasoning && (
                            <motion.div
                                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                className="absolute bottom-full right-0 mb-2 z-50
                           w-64 p-3 rounded-xl
                           bg-[var(--bg-card)]/95 backdrop-blur-xl
                           border border-violet-500/20
                           shadow-xl shadow-violet-500/10"
                            >
                                <div className="flex items-center gap-2 mb-2 text-violet-400 font-medium">
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>הסבר AI</span>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {meta.aiReasoning}
                                </p>
                                {/* Arrow */}
                                <div className="absolute -bottom-2 right-4 w-3 h-3 rotate-45 
                                bg-[var(--bg-card)]/95 border-r border-b border-violet-500/20" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Read Original Link */}
            {showUrl && (
                <a
                    href={meta.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full 
                     bg-cyan-500/10 text-cyan-400 border border-cyan-500/20
                     hover:bg-cyan-500/20 transition-colors font-medium"
                >
                    <LinkIcon className="w-3 h-3" />
                    קרא מקור
                </a>
            )}

            {/* Author */}
            {meta.author && (
                <span className="text-white/40">
                    מאת: {meta.author}
                </span>
            )}
        </div>
    );
};

export default SparkMeta;
