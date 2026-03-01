/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM TICKER TAPE
 * Smooth GPU-Accelerated Scrolling Marquee
 * ═══════════════════════════════════════════════════════════════
 */

import React, { memo } from 'react';
import { motion as _motion } from 'framer-motion';
import type { TopMover } from '../../services/financialsService';

// ============================================================================
// TICKER TAPE ITEM
// ============================================================================

interface TickerItemProps {
  ticker: string;
  price: number;
  change: number;
}

const TickerItem: React.FC<TickerItemProps> = memo(({ ticker, price, change }) => {
  const isPositive = change >= 0;

  return (
    <div
      className={`
        flex items-center gap-3 px-5 
        border-l border-white/[0.06]
        cursor-pointer 
        hover:bg-white/[0.04] 
        transition-colors duration-200
      `}
    >
      <span className="font-bold text-white/90 text-xs tracking-wide">{ticker}</span>
      <span className="font-mono text-white/50 text-xs tabular-nums">${price.toFixed(2)}</span>
      <span
        className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums
          ${
            isPositive
              ? 'text-[var(--inv-positive)] bg-[var(--inv-positive-bg)]'
              : 'text-[var(--inv-negative)] bg-[var(--inv-negative-bg)]'
          }
        `}
      >
        {isPositive ? '+' : ''}
        {change.toFixed(2)}%
      </span>
    </div>
  );
});

TickerItem.displayName = 'TickerItem';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface PremiumTickerTapeProps {
  items: TopMover[];
  className?: string;
}

export const PremiumTickerTape: React.FC<PremiumTickerTapeProps> = memo(
  ({ items, className = '' }) => {
    if (!items.length) return null;

    return (
      <div
        className={`
        relative w-full overflow-hidden
        h-10 flex items-center
        bg-gradient-to-b from-black/60 to-black/40
        border-b border-white/[0.04]
        backdrop-blur-xl
        ${className}
      `}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, var(--inv-surface-base) 0%, transparent 100%)',
          }}
        />

        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(270deg, var(--inv-surface-base) 0%, transparent 100%)',
          }}
        />

        {/* Scrolling content - using CSS animation for GPU acceleration */}
        <div
          className="flex items-center whitespace-nowrap ticker-scroll"
          style={{
            animation: 'inv-ticker-scroll 40s linear infinite',
          }}
        >
          {/* First set */}
          {items.map((item, i) => (
            <TickerItem
              key={`${item.ticker}-${i}`}
              ticker={item.ticker}
              price={item.price}
              change={item.changePercent}
            />
          ))}
          {/* Duplicate for seamless loop */}
          {items.map((item, i) => (
            <TickerItem
              key={`dup-${item.ticker}-${i}`}
              ticker={item.ticker}
              price={item.price}
              change={item.changePercent}
            />
          ))}
        </div>

        {/* Inline styles for ticker animation */}
        <style>{`
        @keyframes inv-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
        
        .ticker-scroll {
          will-change: transform;
        }
      `}</style>
      </div>
    );
  }
);

PremiumTickerTape.displayName = 'PremiumTickerTape';

export default PremiumTickerTape;
