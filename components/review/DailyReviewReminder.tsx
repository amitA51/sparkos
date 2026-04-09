/**
 * DailyReviewReminder
 *
 * A floating card that appears on the HomeScreen after 8 PM
 * if the daily review hasn't been completed yet.
 * Dismissable once per day, with a subtle attention-drawing animation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  isTodayReviewDone,
  isDismissedToday,
  dismissReminder,
} from '../../services/dailyReviewService';
import { XIcon, StarIcon } from '../icons';

// ============================================================================
// Types
// ============================================================================

interface DailyReviewReminderProps {
  onStartReview: () => void;
}

// ============================================================================
// Component
// ============================================================================

const DailyReviewReminder: React.FC<DailyReviewReminderProps> = ({ onStartReview }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Check visibility conditions
  useEffect(() => {
    const checkVisibility = () => {
      const hour = new Date().getHours();
      const isEvening = hour >= 20; // After 8 PM
      const reviewDone = isTodayReviewDone();
      const dismissed = isDismissedToday();

      setIsVisible(isEvening && !reviewDone && !dismissed);
    };

    checkVisibility();

    // Re-check every minute (handles transitioning past 8 PM while app is open)
    const interval = setInterval(checkVisibility, 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = useCallback(() => {
    dismissReminder();
    setIsVisible(false);
  }, []);

  const handleStart = useCallback(() => {
    onStartReview();
    setIsVisible(false);
  }, [onStartReview]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--dynamic-accent-start) 8%, var(--bg-card)), color-mix(in srgb, var(--dynamic-accent-end) 5%, var(--bg-card)))',
            border: '1px solid color-mix(in srgb, var(--dynamic-accent-start) 15%, var(--border-subtle))',
            boxShadow: '0 4px 20px color-mix(in srgb, var(--dynamic-accent-start) 8%, transparent)',
          }}
        >
          {/* Animated glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: '0 0 30px color-mix(in srgb, var(--dynamic-accent-start) 15%, transparent)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Decorative gradient orb */}
          <div
            className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-15 blur-2xl"
            style={{ background: 'var(--dynamic-accent-start)' }}
          />

          <div className="relative p-4 flex items-center gap-4">
            {/* Moon icon with pulse */}
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--dynamic-accent-start) 12%, transparent)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MoonStarIconSmall />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-bold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                סיימת את היום?
              </h3>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                בוא נסכם את מה שהשגת היום
              </p>

              {/* CTA button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="mt-2.5 py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                  color: 'var(--text-on-accent)',
                  boxShadow: '0 2px 10px var(--dynamic-accent-glow)',
                }}
              >
                <StarIcon className="w-3.5 h-3.5" />
                סכם את היום
              </motion.button>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: 'var(--gray-100)',
                color: 'var(--text-muted)',
              }}
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Inline Moon + Star Icon
// ============================================================================

const MoonStarIconSmall: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
    style={{ color: 'var(--dynamic-accent-start)' }}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M19 3v4" />
    <path d="M21 5h-4" />
  </svg>
);

export default React.memo(DailyReviewReminder);
