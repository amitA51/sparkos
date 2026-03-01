/**
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM ASSET CARD
 * Apple Stocks-Style Asset Display with Glassmorphism
 * ═══════════════════════════════════════════════════════════════
 */

import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FinancialAsset } from '../../types';
import { TrashIcon, TrendingUpIcon, TrendingDownIcon, FlameIcon } from '../icons';

// ============================================================================
// ANIMATED PRICE COUNTER
// ============================================================================

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const AnimatedPrice: React.FC<AnimatedPriceProps> = memo(
  ({ value, prefix = '', suffix = '', decimals = 2, className = '' }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValue = useRef(value);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
      const start = prevValue.current;
      const end = value;

      // Skip animation for micro-changes
      const percentChange = Math.abs((end - start) / (start || 1));
      if (percentChange < 0.0001) {
        setDisplayValue(value);
        prevValue.current = value;
        return;
      }

      setIsUpdating(true);
      const duration = 500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth ease-out-expo
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * ease;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          prevValue.current = value;
          setIsUpdating(false);
        }
      };

      requestAnimationFrame(animate);
    }, [value]);

    const isUp = value > prevValue.current;

    return (
      <span
        className={`
        font-mono tabular-nums transition-colors duration-300
        ${isUpdating ? (isUp ? 'text-[var(--inv-positive)]' : 'text-[var(--inv-negative)]') : ''}
        ${className}
      `}
      >
        {prefix}
        {displayValue.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </span>
    );
  }
);

AnimatedPrice.displayName = 'AnimatedPrice';

// ============================================================================
// PREMIUM MINI CHART
// ============================================================================

interface PremiumMiniChartProps {
  data?: number[];
  isPositive: boolean;
  height?: number;
  animated?: boolean;
}

const PremiumMiniChart: React.FC<PremiumMiniChartProps> = memo(
  ({ data, isPositive, height = 40, animated = true }) => {
    const [isVisible, setIsVisible] = useState(!animated);

    useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => setIsVisible(true), 200);
        return () => clearTimeout(timer);
      }
      return undefined;
    }, [animated]);

    if (!data || data.length < 2) {
      return <div className="w-full rounded-lg inv-shimmer" style={{ height }} />;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = height - 4 - ((d - min) / range) * (height - 8);
        return `${x},${y}`;
      })
      .join(' ');

    const color = isPositive ? 'var(--inv-positive)' : 'var(--inv-negative)';
    const gradientId = `chart-gradient-${isPositive ? 'up' : 'down'}`;

    return (
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className={`overflow-visible transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon
          fill={`url(#${gradientId})`}
          points={`0,${height} ${points} 100,${height}`}
          className="transition-all duration-500"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />

        {/* End dot */}
        <circle
          cx="100"
          cy={parseFloat(points.split(' ').pop()?.split(',')[1] || '0')}
          r="3"
          fill={color}
          className="transition-all duration-500"
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
    );
  }
);

PremiumMiniChart.displayName = 'PremiumMiniChart';

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

export interface PremiumAssetCardProps {
  asset: FinancialAsset;
  onRemove: (ticker: string) => void;
  onClick: (asset: FinancialAsset) => void;
  index?: number;
}

export const PremiumAssetCard = memo(function PremiumAssetCard({
  asset,
  onRemove,
  onClick,
  index = 0,
}: PremiumAssetCardProps) {
  const isPositive = (asset.change24h || 0) >= 0;
  const changeAbs = Math.abs(asset.change24h || 0);
  const isHot = changeAbs > 5;
  const isCrypto = CRYPTO_TICKERS.includes(asset.ticker);

  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(() => {
    // Haptic feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    onClick(asset);
  }, [onClick, asset]);

  const handleRemove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (window.navigator.vibrate) {
        window.navigator.vibrate([20, 50, 20]);
      }
      onRemove(asset.ticker);
    },
    [onRemove, asset.ticker]
  );

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      x: -100,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileTap="tap"
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        group relative overflow-hidden cursor-pointer
        rounded-[20px] p-4
        backdrop-blur-[var(--inv-blur-card)]
        transition-all duration-300 ease-out
        ${isHot ? 'inv-hot-glow' : ''}
      `}
      style={{
        background: isHot ? 'var(--inv-hot-gradient)' : 'var(--inv-card-gradient)',
        boxShadow: isPressed ? 'var(--inv-shadow-card)' : 'var(--inv-shadow-card-hover)',
        border: `1px solid ${isPressed ? 'var(--inv-border-strong)' : 'var(--inv-border-subtle)'}`,
      }}
    >
      {/* Glass overlay effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />

      {/* Hot indicator badge */}
      <AnimatePresence>
        {isHot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full z-20"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,149,0,0.9) 0%, rgba(255,59,48,0.9) 100%)',
              boxShadow: '0 2px 8px rgba(255,149,0,0.4)',
            }}
          >
            <FlameIcon className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white">HOT</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side color indicator */}
      <div
        className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full transition-all duration-300"
        style={{
          backgroundColor: isPositive ? 'var(--inv-positive)' : 'var(--inv-negative)',
          boxShadow: isPositive
            ? 'var(--inv-shadow-glow-positive)'
            : 'var(--inv-shadow-glow-negative)',
        }}
      />

      {/* Asset type indicator */}
      <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-80 transition-opacity">
        <span className="text-xs">{isCrypto ? '₿' : '📈'}</span>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header row */}
        <div className="flex justify-between items-start mb-3 pr-8">
          <div>
            <h3
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--inv-font-display)' }}
            >
              {asset.ticker}
            </h3>
            <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider">
              {asset.name}
            </span>
          </div>

          <div className="text-left">
            <div className="text-xl font-bold text-white">
              <AnimatedPrice value={asset.price || 0} prefix="$" />
            </div>
            <div
              className={`
                flex items-center justify-end gap-1 text-sm font-semibold
                ${isPositive ? 'text-[var(--inv-positive)]' : 'text-[var(--inv-negative)]'}
              `}
            >
              {isPositive ? (
                <TrendingUpIcon className="w-3.5 h-3.5" />
              ) : (
                <TrendingDownIcon className="w-3.5 h-3.5" />
              )}
              <span className="font-mono tabular-nums">
                {isPositive ? '+' : ''}
                {asset.change24h?.toFixed(2) || '0.00'}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-10 mt-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          <PremiumMiniChart data={asset.sparkline} isPositive={isPositive} height={40} />
        </div>
      </div>

      {/* Delete button - appears on hover */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1, scale: 1 }}
        onClick={handleRemove}
        className={`
          absolute bottom-3 left-3 p-2.5 rounded-full 
          bg-red-500/10 text-red-400 
          hover:bg-red-500/20 hover:text-red-300
          transition-colors duration-200
          opacity-0 group-hover:opacity-100
          backdrop-blur-sm
        `}
        style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        <TrashIcon className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
});

export default PremiumAssetCard;
