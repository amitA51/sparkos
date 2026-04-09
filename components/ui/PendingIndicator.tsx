import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingIndicatorProps {
  /** Number of pending operations */
  count: number;
  /** Whether currently syncing */
  isSyncing?: boolean;
  /** Position on screen */
  position?: 'top-right' | 'bottom-right' | 'inline';
  /** Additional className */
  className?: string;
}

/**
 * PendingIndicator - Shows count of queued offline operations
 *
 * Displays a subtle badge when operations are queued for sync.
 * Shows a syncing animation when the queue is being processed.
 *
 * Usage:
 *   <PendingIndicator count={pendingCount} isSyncing={isSyncing} />
 */
export const PendingIndicator: React.FC<PendingIndicatorProps> = ({
  count,
  isSyncing = false,
  position = 'inline',
  className = '',
}) => {
  if (count === 0 && !isSyncing) return null;

  const positionClasses =
    position === 'top-right'
      ? 'fixed top-16 right-4 z-50'
      : position === 'bottom-right'
        ? 'fixed bottom-24 right-4 z-50'
        : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5
          bg-amber-500/15 border border-amber-500/25
          rounded-full backdrop-blur-sm
          ${positionClasses}
          ${className}
        `}
      >
        {isSyncing ? (
          <motion.div
            className="w-3 h-3 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}

        <span className="text-xs font-medium text-amber-300">
          {isSyncing
            ? '\u05DE\u05E1\u05E0\u05DB\u05E8\u05DF...'
            : count === 1
              ? '\u05E4\u05E2\u05D5\u05DC\u05D4 \u05D1\u05D4\u05DE\u05EA\u05E0\u05D4'
              : `${count} \u05E4\u05E2\u05D5\u05DC\u05D5\u05EA \u05D1\u05D4\u05DE\u05EA\u05E0\u05D4`}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default PendingIndicator;
