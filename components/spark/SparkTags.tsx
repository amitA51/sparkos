/**
 * ═══════════════════════════════════════════════════════════════
 * SPARK TAGS - Tag Chips Display Component
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { motion } from 'framer-motion';

interface SparkTagsProps {
    /** Array of tag strings (can include # prefix) */
    tags: string[];
    /** Maximum visible tags before showing +N more */
    maxVisible?: number;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Custom class name */
    className?: string;
}

/** Color palette for tag chips */
const TAG_COLORS = [
    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'bg-violet-500/10 text-violet-400 border-violet-500/20',
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'bg-pink-500/10 text-pink-400 border-pink-500/20',
];

/** Get consistent color for a tag based on its content */
function getTagColor(tag: string): string {
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[hash % TAG_COLORS.length]!;
}

/** Clean tag string (remove # prefix if present) */
function cleanTag(tag: string): string {
    return tag.startsWith('#') ? tag.slice(1) : tag;
}

export const SparkTags: React.FC<SparkTagsProps> = ({
    tags,
    maxVisible = 3,
    size = 'sm',
    className = '',
}) => {
    if (!tags || tags.length === 0) return null;

    const visibleTags = tags.slice(0, maxVisible);
    const hiddenCount = tags.length - maxVisible;

    const sizeClasses = size === 'sm'
        ? 'text-[10px] px-2 py-0.5'
        : 'text-xs px-2.5 py-1';

    return (
        <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
            {visibleTags.map((tag, index) => (
                <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
            ${sizeClasses}
            rounded-full border font-medium
            transition-all duration-200
            hover:scale-105
            ${getTagColor(tag)}
          `}
                >
                    #{cleanTag(tag)}
                </motion.span>
            ))}

            {hiddenCount > 0 && (
                <span className={`
          ${sizeClasses}
          rounded-full bg-white/5 text-white/40 
          border border-white/10 font-medium
        `}>
                    +{hiddenCount}
                </span>
            )}
        </div>
    );
};

export default SparkTags;
