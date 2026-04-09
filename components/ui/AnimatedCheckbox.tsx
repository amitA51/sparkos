import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../src/utils/haptics';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Size in pixels (default: 28) */
  size?: number;
  /** Label for accessibility */
  label: string;
  /** Disable the checkbox */
  disabled?: boolean;
  /** Custom color when checked (CSS variable or hex) */
  color?: string;
  /** Whether to show a mini burst animation on check */
  celebrate?: boolean;
  className?: string;
}

/**
 * AnimatedCheckbox - Premium animated checkbox with satisfying check animation
 *
 * Features:
 * - SVG checkmark draws in with spring physics
 * - Subtle scale bounce on toggle
 * - Optional celebration burst particles
 * - Haptic feedback on check
 * - Full accessibility (role, aria-checked, keyboard support)
 */
export const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  size = 28,
  label,
  disabled = false,
  color = 'var(--dynamic-accent-start)',
  celebrate = false,
  className = '',
}) => {
  const [justToggled, setJustToggled] = useState(false);

  const handleToggle = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (disabled) return;

      const newChecked = !checked;
      if (newChecked) {
        triggerHaptic('success');
      } else {
        triggerHaptic('selection');
      }

      setJustToggled(true);
      onChange(newChecked);
      setTimeout(() => setJustToggled(false), 500);
    },
    [checked, onChange, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle(e);
      }
    },
    [handleToggle]
  );

  const strokeWidth = size < 24 ? 3 : 2.5;
  const borderRadius = size * 0.36;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={label}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="relative flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          width: size,
          height: size,
          WebkitTapHighlightColor: 'transparent',
        }}
        animate={{
          scale: justToggled ? [1, 1.15, 1] : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
        }}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          style={{ borderRadius }}
          animate={{
            backgroundColor: checked ? color : 'rgba(255, 255, 255, 0.08)',
            borderColor: checked ? color : 'rgba(255, 255, 255, 0.25)',
            borderWidth: checked ? 0 : 2,
            boxShadow: checked
              ? `0 0 12px ${color}60, inset 0 1px 1px rgba(255,255,255,0.15)`
              : 'inset 0 1px 2px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Checkmark SVG */}
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="checkmark"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute"
              style={{
                width: size * 0.6,
                height: size * 0.6,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Celebration burst */}
      {celebrate && justToggled && checked && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: [
                  '#00F0FF',
                  '#7B61FF',
                  '#FF006E',
                  '#FFB800',
                  '#10B981',
                  '#EC4899',
                ][i],
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 6) * (size * 1.2),
                y: Math.sin((i * Math.PI * 2) / 6) * (size * 1.2),
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: i * 0.02,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedCheckbox;
