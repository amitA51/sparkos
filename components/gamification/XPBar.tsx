import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPBarProps {
  level: number;
  tierNameHe: string;
  currentXP: number;
  levelStartXP: number;
  levelEndXP: number;
  progressPercent: number;
  /** Flashes the bar when XP is gained */
  recentXPGain?: number;
}

const XPBar: React.FC<XPBarProps> = ({
  level,
  tierNameHe,
  currentXP,
  levelStartXP,
  levelEndXP,
  progressPercent,
  recentXPGain,
}) => {
  const [showGain, setShowGain] = useState(false);

  useEffect(() => {
    if (!recentXPGain || recentXPGain <= 0) return;
    setShowGain(true);
    const timer = setTimeout(() => setShowGain(false), 2000);
    return () => clearTimeout(timer);
  }, [recentXPGain]);

  const xpInLevel = currentXP - levelStartXP;
  const xpNeeded = levelEndXP - levelStartXP;

  return (
    <div className="flex items-center gap-2.5 w-full min-w-0">
      {/* Level Badge */}
      <motion.div
        className="shrink-0 flex items-center justify-center rounded-xl relative"
        style={{
          width: 36,
          height: 36,
          background: 'var(--dynamic-accent-color, linear-gradient(135deg, #6366F1, #8B5CF6))',
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-white text-xs font-bold leading-none">{level}</span>
        {/* Subtle shimmer on level badge */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bar Container */}
      <div className="flex-1 min-w-0">
        {/* Top row: Tier name + XP numbers */}
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[10px] font-bold tracking-wide uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {tierNameHe}
          </span>
          <div className="flex items-center gap-1">
            <AnimatePresence>
              {showGain && recentXPGain && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] font-bold"
                  style={{ color: 'var(--success, #34D399)' }}
                >
                  +{recentXPGain}
                </motion.span>
              )}
            </AnimatePresence>
            <span
              className="text-[10px] font-semibold tabular-nums"
              style={{ color: 'var(--text-secondary)' }}
            >
              {xpInLevel}/{xpNeeded} XP
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="relative w-full rounded-full overflow-hidden"
          style={{
            height: 6,
            background: 'var(--gray-100)',
          }}
        >
          {/* Animated fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'var(--dynamic-accent-color, linear-gradient(90deg, #6366F1, #8B5CF6))',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progressPercent)}%` }}
            transition={{ duration: 0.8, ease: 'circOut' }}
          />

          {/* Glow overlay on recent gain */}
          <AnimatePresence>
            {showGain && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default React.memo(XPBar);
