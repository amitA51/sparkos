/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM HERO SECTION
 * Apple-Style Header with Search and Market Status
 * ═══════════════════════════════════════════════════════════════
 */

import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, RefreshIcon, CalendarIcon } from '../icons';

// ============================================================================
// MARKET STATUS BADGE
// ============================================================================

interface MarketStatusBadgeProps {
    isOpen: boolean;
}

export const PremiumMarketStatus: React.FC<MarketStatusBadgeProps> = memo(({ isOpen }) => (
    <div
        className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full
      text-[10px] font-bold uppercase tracking-wide
      backdrop-blur-xl
      ${isOpen
                ? 'bg-[var(--inv-positive-bg)] text-[var(--inv-positive)] border border-[var(--inv-positive)]/20'
                : 'bg-[var(--inv-negative-bg)] text-[var(--inv-negative)] border border-[var(--inv-negative)]/20'
            }
    `}
    >
        <span
            className={`
        w-2 h-2 rounded-full
        ${isOpen ? 'bg-[var(--inv-positive)] animate-pulse' : 'bg-[var(--inv-negative)]'}
      `}
            style={{
                boxShadow: isOpen
                    ? '0 0 8px var(--inv-positive-glow)'
                    : '0 0 8px var(--inv-negative-glow)'
            }}
        />
        {isOpen ? 'שוק פתוח' : 'שוק סגור'}
    </div>
));

PremiumMarketStatus.displayName = 'PremiumMarketStatus';

// ============================================================================
// SEARCH INPUT
// ============================================================================

interface PremiumSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export const PremiumSearchInput: React.FC<PremiumSearchInputProps> = memo(({
    value,
    onChange,
    onSubmit,
    placeholder = 'חפש מניה או מטבע...',
    isLoading = false
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim().toUpperCase());
        }
    }, [value, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="relative">
            {/* Search icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                    animate={{
                        scale: isFocused ? 1.1 : 1,
                        opacity: isFocused ? 1 : 0.5
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <SearchIcon className="w-5 h-5 text-white/50" />
                </motion.div>
            </div>

            {/* Loading indicator */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                dir="rtl"
                className={`
          w-full py-3.5 pr-12 pl-12
          rounded-2xl
          bg-white/[0.04] backdrop-blur-xl
          border transition-all duration-300
          text-white placeholder:text-white/30
          font-medium text-sm
          focus:outline-none
          ${isFocused
                        ? 'border-[var(--inv-accent-primary)]/50 bg-white/[0.08] shadow-[0_0_0_4px_rgba(0,122,255,0.1)]'
                        : 'border-white/[0.08] hover:border-white/[0.12] hover:bg-white/[0.06]'
                    }
        `}
                style={{
                    boxShadow: isFocused
                        ? '0 0 0 4px rgba(0,122,255,0.1), inset 0 1px 2px rgba(0,0,0,0.2)'
                        : 'inset 0 1px 2px rgba(0,0,0,0.15)'
                }}
            />
        </form>
    );
});

PremiumSearchInput.displayName = 'PremiumSearchInput';

// ============================================================================
// QUICK ADD CHIPS
// ============================================================================

interface QuickAddChipProps {
    ticker: string;
    emoji: string;
    isAdded: boolean;
    isLoading?: boolean;
    onAdd: () => void;
}

export const PremiumQuickAddChip: React.FC<QuickAddChipProps> = memo(({
    ticker,
    emoji,
    isAdded,
    isLoading = false,
    onAdd
}) => (
    <motion.button
        onClick={onAdd}
        disabled={isAdded || isLoading}
        whileTap={{ scale: 0.95 }}
        className={`
      flex items-center gap-1.5 px-3 py-2 rounded-xl
      text-[11px] font-semibold
      shrink-0
      transition-all duration-200
      backdrop-blur-xl
      ${isAdded
                ? 'bg-[var(--inv-positive-bg)] text-[var(--inv-positive)] border border-[var(--inv-positive)]/20'
                : isLoading
                    ? 'bg-white/[0.03] text-white/30 animate-pulse border border-white/[0.05]'
                    : 'bg-white/[0.05] text-white/70 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white hover:border-white/[0.15]'
            }
    `}
    >
        <span className="text-sm">{emoji}</span>
        <span>{ticker}</span>
        {isAdded && <span className="text-[9px] ml-0.5">✓</span>}
    </motion.button>
));

PremiumQuickAddChip.displayName = 'PremiumQuickAddChip';

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================

interface PremiumHeroSectionProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (value: string) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
    marketOpen: boolean;
    lastUpdated: number;
    isSearchLoading?: boolean;
}

export const PremiumHeroSection: React.FC<PremiumHeroSectionProps> = memo(({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    isRefreshing,
    onRefresh,
    marketOpen,
    lastUpdated,
    isSearchLoading = false
}) => {
    const formatTimeAgo = (timestamp: number): string => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `לפני ${seconds} שניות`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `לפני ${minutes} דקות`;
        return `לפני ${Math.floor(minutes / 60)} שעות`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden rounded-3xl p-6 mb-4"
            style={{
                background: `
          linear-gradient(180deg, 
            rgba(0, 122, 255, 0.06) 0%, 
            rgba(88, 86, 214, 0.04) 50%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(20, 20, 28, 0.95) 0%, 
            rgba(15, 15, 22, 0.98) 100%
          )
        `,
                boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 24px 48px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.05),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `,
                border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
        >
            {/* Background gradient orb */}
            <div
                className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(0,122,255,0.3) 0%, transparent 70%)'
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* Header row */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h1
                            className="text-2xl font-black text-white mb-1.5"
                            style={{ fontFamily: 'var(--inv-font-display)' }}
                        >
                            שוק ההון
                        </h1>
                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>
                                {new Date().toLocaleDateString('he-IL', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </span>
                            <span className="opacity-50">•</span>
                            <span className={isRefreshing ? 'animate-pulse' : ''}>
                                {formatTimeAgo(lastUpdated)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <PremiumMarketStatus isOpen={marketOpen} />
                        <motion.button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            whileTap={{ scale: 0.9 }}
                            className={`
                p-2.5 rounded-full
                bg-white/[0.05] backdrop-blur-xl
                border border-white/[0.08]
                text-white/60 hover:text-white hover:bg-white/[0.1]
                transition-all duration-200
                disabled:opacity-50
              `}
                        >
                            <motion.div
                                animate={{ rotate: isRefreshing ? 360 : 0 }}
                                transition={{
                                    duration: 1,
                                    repeat: isRefreshing ? Infinity : 0,
                                    ease: 'linear'
                                }}
                            >
                                <RefreshIcon className="w-4 h-4" />
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Search input */}
                <PremiumSearchInput
                    value={searchValue}
                    onChange={onSearchChange}
                    onSubmit={onSearchSubmit}
                    isLoading={isSearchLoading}
                />
            </div>
        </motion.div>
    );
});

PremiumHeroSection.displayName = 'PremiumHeroSection';

export default PremiumHeroSection;
