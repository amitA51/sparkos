/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM PORTFOLIO SUMMARY
 * Apple Wallet-Style Portfolio Overview Card
 * ═══════════════════════════════════════════════════════════════
 */

import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { FinancialAsset } from '../../types';
import type { FilterOption } from './PremiumSegmentControl';

// ============================================================================
// ANIMATED VALUE DISPLAY
// ============================================================================

interface AnimatedValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: 'sm' | 'lg';
  className?: string;
}

const AnimatedValue: React.FC<AnimatedValueProps> = memo(
  ({ value, prefix = '', suffix = '', decimals = 2, size = 'lg', className = '' }) => {
    const formattedValue = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return (
      <motion.span
        className={`font-mono tabular-nums ${className}`}
        key={formattedValue}
        initial={{ opacity: 0.5, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {prefix}
        {formattedValue}
        {suffix}
      </motion.span>
    );
  }
);

AnimatedValue.displayName = 'AnimatedValue';

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = memo(
  ({ label, value, subValue, icon, trend = 'neutral' }) => {
    return (
      <div
        className={`
        flex-1 p-3 rounded-xl
        bg-white/[0.03] backdrop-blur-lg
        border border-white/[0.05]
        transition-all duration-300
        hover:bg-white/[0.06] hover:border-white/[0.08]
      `}
      >
        <div className="flex items-center gap-1.5 mb-1">
          {icon && <span className="text-xs opacity-70">{icon}</span>}
          <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div
          className={`
        text-sm font-bold
        ${
          trend === 'up'
            ? 'text-[var(--inv-positive)]'
            : trend === 'down'
              ? 'text-[var(--inv-negative)]'
              : 'text-white'
        }
      `}
        >
          {typeof value === 'number' ? <AnimatedValue value={value} prefix="$" size="sm" /> : value}
        </div>
        {subValue && <div className="text-[9px] text-white/30 mt-0.5">{subValue}</div>}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

// ============================================================================
// CRYPTO DETECTION
// ============================================================================

const CRYPTO_TICKERS = [
  'BTC',
  'ETH',
  'SOL',
  'XRP',
  'DOGE',
  'ADA',
  'AVAX',
  'DOT',
  'MATIC',
  'LINK',
  'UNI',
  'LTC',
  'ATOM',
  'SHIB',
  'APT',
  'ARB',
  'OP',
  'NEAR',
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface PremiumPortfolioSummaryProps {
  watchlist: FinancialAsset[];
  filter: FilterOption;
}

export const PremiumPortfolioSummary: React.FC<PremiumPortfolioSummaryProps> = memo(
  ({ watchlist, filter }) => {
    const stats = useMemo(() => {
      let filtered = watchlist;

      if (filter === 'crypto') {
        filtered = watchlist.filter(a => CRYPTO_TICKERS.includes(a.ticker));
      } else if (filter === 'stocks') {
        filtered = watchlist.filter(a => !CRYPTO_TICKERS.includes(a.ticker));
      }

      const totalValue = filtered.reduce((sum, a) => sum + (a.price || 0), 0);
      const avgChange =
        filtered.length > 0
          ? filtered.reduce((sum, a) => sum + (a.change24h || 0), 0) / filtered.length
          : 0;

      const stocksValue = watchlist
        .filter(a => !CRYPTO_TICKERS.includes(a.ticker))
        .reduce((sum, a) => sum + (a.price || 0), 0);

      const cryptoValue = watchlist
        .filter(a => CRYPTO_TICKERS.includes(a.ticker))
        .reduce((sum, a) => sum + (a.price || 0), 0);

      return {
        totalValue,
        avgChange,
        stocksValue,
        cryptoValue,
        assetCount: filtered.length,
        isPositive: avgChange >= 0,
      };
    }, [watchlist, filter]);

    if (watchlist.length === 0) return null;

    const cardVariants = {
      initial: { opacity: 0, y: 20, scale: 0.98 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        },
      },
    };

    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="relative overflow-hidden rounded-3xl p-5 mb-5"
        style={{
          background: `
          linear-gradient(135deg, 
            rgba(0, 122, 255, 0.08) 0%, 
            rgba(88, 86, 214, 0.06) 50%,
            rgba(175, 82, 222, 0.04) 100%
          )
        `,
          boxShadow: `
          0 4px 24px rgba(0, 0, 0, 0.3),
          0 12px 40px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Background gradient orb */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{
            background: stats.isPositive
              ? 'radial-gradient(circle, var(--inv-positive) 0%, transparent 70%)'
              : 'radial-gradient(circle, var(--inv-negative) 0%, transparent 70%)',
          }}
        />

        {/* Main content */}
        <div className="relative z-10">
          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💼</span>
            <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
              {filter === 'all' ? 'סה"כ תיק' : filter === 'crypto' ? 'תיק קריפטו' : 'תיק מניות'}
            </span>
          </div>

          {/* Total value */}
          <div className="mb-4">
            <div
              className="text-3xl font-black text-white mb-1"
              style={{ fontFamily: 'var(--inv-font-display)' }}
            >
              <AnimatedValue value={stats.totalValue} prefix="$" decimals={2} />
            </div>

            <div
              className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
            ${
              stats.isPositive
                ? 'bg-[var(--inv-positive-bg)] text-[var(--inv-positive)]'
                : 'bg-[var(--inv-negative-bg)] text-[var(--inv-negative)]'
            }
          `}
            >
              <span className="text-xs">{stats.isPositive ? '↑' : '↓'}</span>
              <span className="text-xs font-bold font-mono tabular-nums">
                {stats.isPositive ? '+' : ''}
                {stats.avgChange.toFixed(2)}%
              </span>
              <span className="text-[10px] opacity-70">היום</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-2">
            <StatCard label="מניות" value={stats.stocksValue} icon="📈" />
            <StatCard label="קריפטו" value={stats.cryptoValue} icon="₿" />
            <StatCard label="נכסים" value={stats.assetCount.toString()} icon="📊" />
          </div>
        </div>
      </motion.div>
    );
  }
);

PremiumPortfolioSummary.displayName = 'PremiumPortfolioSummary';

export default PremiumPortfolioSummary;
