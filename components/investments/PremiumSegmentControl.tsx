/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM SEGMENT CONTROL
 * Apple iOS-Style Segmented Filter with Sliding Pill Animation
 * ═══════════════════════════════════════════════════════════════
 */

import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export type FilterOption = 'all' | 'stocks' | 'crypto';

interface SegmentOption {
    key: FilterOption;
    label: string;
    icon: string;
}

const SEGMENTS: SegmentOption[] = [
    { key: 'all', label: 'הכל', icon: '📊' },
    { key: 'stocks', label: 'מניות', icon: '📈' },
    { key: 'crypto', label: 'קריפטו', icon: '₿' },
];

interface PremiumSegmentControlProps {
    value: FilterOption;
    onChange: (value: FilterOption) => void;
    className?: string;
}

export const PremiumSegmentControl: React.FC<PremiumSegmentControlProps> = memo(({
    value,
    onChange,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

    // Calculate pill position based on selected segment
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const activeIndex = SEGMENTS.findIndex(s => s.key === value);
        const buttons = container.querySelectorAll('button');

        if (buttons[activeIndex]) {
            const button = buttons[activeIndex] as HTMLButtonElement;
            const containerRect = container.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            setPillStyle({
                left: buttonRect.left - containerRect.left,
                width: buttonRect.width
            });
        }
    }, [value]);

    const handleClick = useCallback((key: FilterOption) => {
        // Haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
        onChange(key);
    }, [onChange]);

    return (
        <div
            ref={containerRef}
            className={`
        relative flex p-1 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.08]
        ${className}
      `}
            style={{
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.03)'
            }}
        >
            {/* Animated pill background */}
            <motion.div
                className="absolute top-1 bottom-1 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
                animate={{
                    left: pillStyle.left,
                    width: pillStyle.width
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30
                }}
            />

            {/* Segment buttons */}
            {SEGMENTS.map((segment) => (
                <button
                    key={segment.key}
                    onClick={() => handleClick(segment.key)}
                    className={`
            relative z-10 flex items-center gap-1.5 
            px-4 py-2.5 rounded-xl
            text-xs font-semibold
            transition-colors duration-200
            ${value === segment.key
                            ? 'text-white'
                            : 'text-white/40 hover:text-white/70'
                        }
          `}
                >
                    <span className="text-sm">{segment.icon}</span>
                    <span>{segment.label}</span>
                </button>
            ))}
        </div>
    );
});

PremiumSegmentControl.displayName = 'PremiumSegmentControl';

// ============================================================================
// PREMIUM SORT DROPDOWN
// ============================================================================

export type SortOption = 'default' | 'change_desc' | 'change_asc' | 'price_desc' | 'price_asc' | 'name';

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
    className?: string;
}

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: 'default', label: 'ברירת מחדל' },
    { key: 'change_desc', label: '📈 עליות' },
    { key: 'change_asc', label: '📉 ירידות' },
    { key: 'price_desc', label: '💰 מחיר ↓' },
    { key: 'price_asc', label: '💰 מחיר ↑' },
    { key: 'name', label: '🔤 שם' },
];

export const PremiumSortDropdown: React.FC<SortDropdownProps> = memo(({
    value,
    onChange,
    className = ''
}) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={e => onChange(e.target.value as SortOption)}
                className={`
          appearance-none cursor-pointer
          bg-white/[0.04] backdrop-blur-xl
          border border-white/[0.08]
          rounded-xl px-3 py-2
          text-xs font-medium text-white/70
          hover:bg-white/[0.08] hover:border-white/[0.12]
          focus:outline-none focus:border-[var(--inv-accent-primary)]/50
          transition-all duration-200
          pr-8
        `}
                style={{
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)'
                }}
            >
                {SORT_OPTIONS.map(opt => (
                    <option
                        key={opt.key}
                        value={opt.key}
                        className="bg-gray-900 text-white"
                    >
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/50">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
});

PremiumSortDropdown.displayName = 'PremiumSortDropdown';

export default PremiumSegmentControl;
