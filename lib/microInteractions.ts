/**
 * Premium Micro-Interactions
 * 
 * Advanced UI micro-interactions for a polished user experience.
 * Follows WCAG 2.1 accessibility guidelines and respects reduced motion preferences.
 * 
 * @module lib/microInteractions
 * @description Production-ready micro-interactions for Spark Personal OS
 */

import { type Variants, type TargetAndTransition, type Transition } from 'framer-motion';

// ============================================================================
// Constants
// ============================================================================

/**
 * Standard durations for consistent timing across the app
 * @category Constants
 */
export const MICRO_DURATION = {
  /** Instant feedback (50ms) */
  instant: 0.05,
  /** Quick interactions like hovers (100ms) */
  quick: 0.1,
  /** Standard micro-interactions (150ms) */
  standard: 0.15,
  /** Comfortable transitions (200ms) */
  comfortable: 0.2,
  /** Emphasis transitions (300ms) */
  emphasis: 0.3,
  /** Complex animations (400ms) */
  complex: 0.4,
} as const;

/**
 * Spring configurations for natural motion
 * @category Constants
 */
export const SPRINGS = {
  /** Snappy spring for quick interactions */
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  /** Bouncy spring for playful effects */
  bouncy: { type: 'spring', stiffness: 300, damping: 20, mass: 0.8 } as Transition,
  /** Gentle spring for subtle movements */
  gentle: { type: 'spring', stiffness: 200, damping: 30 } as Transition,
  /** Heavy spring for deliberate motion */
  heavy: { type: 'spring', stiffness: 150, damping: 35, mass: 1.2 } as Transition,
} as const;

// ============================================================================
// Button Micro-Interactions
// ============================================================================

/**
 * Subtle tap effect for buttons
 * @description Provides tactile feedback on press
 * @example
 * <motion.button
 *   variants={buttonTap}
 *   whileTap="tap"
 *   whileHover="hover"
 * >
 *   Click me
 * </motion.button>
 */
export const buttonTap: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: MICRO_DURATION.quick },
  },
  tap: { 
    scale: 0.97,
    transition: { duration: MICRO_DURATION.instant },
  },
};

/**
 * Glow effect for primary action buttons
 * @description Adds ambient glow on hover for emphasis
 */
export const buttonGlow: Variants = {
  initial: { 
    boxShadow: '0 0 0 0 rgba(var(--accent-rgb), 0)',
  },
  hover: { 
    boxShadow: '0 0 20px 4px rgba(var(--accent-rgb), 0.3)',
    transition: { duration: MICRO_DURATION.comfortable },
  },
  tap: { 
    boxShadow: '0 0 10px 2px rgba(var(--accent-rgb), 0.5)',
    transition: { duration: MICRO_DURATION.instant },
  },
};

/**
 * Icon button with rotation effect
 */
export const iconButtonSpin: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 15,
    transition: SPRINGS.snappy,
  },
  tap: { 
    rotate: -15,
    scale: 0.9,
    transition: { duration: MICRO_DURATION.instant },
  },
};

// ============================================================================
// Card Micro-Interactions
// ============================================================================

/**
 * Card hover lift effect
 * @description Lifts card on hover with subtle shadow
 */
export const cardLift: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: SPRINGS.gentle,
  },
  tap: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: { duration: MICRO_DURATION.instant },
  },
};

/**
 * Card tilt effect (3D perspective)
 * @description Subtle 3D tilt following cursor position
 */
export const cardTilt: Variants = {
  initial: { 
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: { 
    rotateX: -2,
    rotateY: 2,
    transition: SPRINGS.gentle,
  },
};

/**
 * Expandable card animation
 */
export const cardExpand: Variants = {
  collapsed: { 
    height: 'auto',
    transition: { duration: MICRO_DURATION.emphasis },
  },
  expanded: { 
    height: 'auto',
    transition: { duration: MICRO_DURATION.emphasis },
  },
};

// ============================================================================
// List Item Micro-Interactions
// ============================================================================

/**
 * List item stagger animation
 * @param index Item index for stagger delay calculation
 */
export const listItemStagger = (index: number): Variants => ({
  hidden: { 
    opacity: 0,
    x: -20,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: MICRO_DURATION.comfortable,
    },
  },
  exit: { 
    opacity: 0,
    x: 20,
    transition: { duration: MICRO_DURATION.quick },
  },
});

/**
 * Swipe to reveal actions
 */
export const swipeReveal: Variants = {
  closed: { x: 0 },
  open: { 
    x: -80,
    transition: SPRINGS.snappy,
  },
};

/**
 * Drag reorder feedback
 */
export const dragItem: Variants = {
  idle: { 
    scale: 1,
    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    zIndex: 0,
  },
  dragging: { 
    scale: 1.02,
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
    zIndex: 10,
    transition: { duration: MICRO_DURATION.quick },
  },
};

// ============================================================================
// Input Micro-Interactions
// ============================================================================

/**
 * Focus ring animation for inputs
 */
export const inputFocus: Variants = {
  blur: { 
    boxShadow: '0 0 0 0 rgba(var(--accent-rgb), 0)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  focus: { 
    boxShadow: '0 0 0 3px rgba(var(--accent-rgb), 0.3)',
    borderColor: 'var(--accent)',
    transition: { duration: MICRO_DURATION.quick },
  },
  error: { 
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.3)',
    borderColor: 'rgb(239, 68, 68)',
  },
};

/**
 * Floating label animation
 */
export const floatingLabel: Variants = {
  rest: { 
    y: 0,
    scale: 1,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  float: { 
    y: -24,
    scale: 0.85,
    color: 'var(--accent)',
    transition: SPRINGS.snappy,
  },
};

/**
 * Character counter animation
 */
export const characterCounter: Variants = {
  normal: { color: 'rgba(255, 255, 255, 0.4)' },
  warning: { 
    color: 'rgb(251, 191, 36)',
    transition: { duration: MICRO_DURATION.quick },
  },
  error: { 
    color: 'rgb(239, 68, 68)',
    scale: 1.05,
    transition: { duration: MICRO_DURATION.quick },
  },
};

// ============================================================================
// Toggle/Switch Micro-Interactions
// ============================================================================

/**
 * Toggle switch animation
 */
export const toggleSwitch: Variants = {
  off: { 
    x: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  on: { 
    x: 20,
    backgroundColor: 'var(--accent)',
    transition: SPRINGS.bouncy,
  },
};

/**
 * Checkbox check animation
 */
export const checkboxCheck: Variants = {
  unchecked: { 
    pathLength: 0,
    opacity: 0,
  },
  checked: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      pathLength: { duration: MICRO_DURATION.comfortable, ease: 'easeOut' },
      opacity: { duration: MICRO_DURATION.instant },
    },
  },
};

// ============================================================================
// Modal/Overlay Micro-Interactions
// ============================================================================

/**
 * Modal backdrop animation
 */
export const modalBackdrop: Variants = {
  hidden: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: { 
    opacity: 1,
    backdropFilter: 'blur(8px)',
    transition: { duration: MICRO_DURATION.comfortable },
  },
  exit: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: MICRO_DURATION.quick },
  },
};

/**
 * Modal content animation (slide up + fade)
 */
export const modalContent: Variants = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRINGS.gentle,
  },
  exit: { 
    opacity: 0,
    y: 30,
    scale: 0.95,
    transition: { duration: MICRO_DURATION.quick },
  },
};

/**
 * Bottom sheet animation
 */
export const bottomSheet: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0.8,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: SPRINGS.heavy,
  },
  exit: { 
    y: '100%',
    opacity: 0.8,
    transition: { duration: MICRO_DURATION.comfortable },
  },
};

// ============================================================================
// Notification/Toast Micro-Interactions
// ============================================================================

/**
 * Toast notification animation
 */
export const toastSlide: Variants = {
  hidden: { 
    x: '100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: SPRINGS.snappy,
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: { duration: MICRO_DURATION.quick },
  },
};

/**
 * Progress bar animation
 */
export const progressBar = (progress: number): TargetAndTransition => ({
  width: `${progress}%`,
  transition: { duration: MICRO_DURATION.emphasis, ease: 'easeOut' },
});

// ============================================================================
// Icon Animations
// ============================================================================

/**
 * Loading spinner
 */
export const spinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

/**
 * Success checkmark animation
 */
export const successCheck: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: SPRINGS.bouncy,
  },
};

/**
 * Error shake animation
 */
export const errorShake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};

/**
 * Pulse animation for attention
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// Skeleton Loading Animations
// ============================================================================

/**
 * Skeleton shimmer effect
 */
export const skeletonShimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};

// ============================================================================
// Gesture Feedback
// ============================================================================

/**
 * Long press feedback
 */
export const longPress: Variants = {
  initial: { scale: 1 },
  pressing: { 
    scale: 0.95,
    transition: { duration: 0.5 },
  },
  complete: { 
    scale: 1,
    transition: SPRINGS.bouncy,
  },
};

/**
 * Pull to refresh indicator
 */
export const pullToRefresh = (progress: number): TargetAndTransition => ({
  rotate: progress * 360,
  opacity: Math.min(progress, 1),
  scale: 0.5 + (progress * 0.5),
  transition: { duration: 0 },
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if user prefers reduced motion
 * @returns Whether reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get motion-safe variants
 * @description Returns static variants if reduced motion is preferred
 */
export function getMotionSafeVariants<T extends Variants>(variants: T): T | Variants {
  if (prefersReducedMotion()) {
    const safeVariants: Variants = {};
    for (const key of Object.keys(variants)) {
      safeVariants[key] = { opacity: 1, scale: 1, x: 0, y: 0 };
    }
    return safeVariants;
  }
  return variants;
}

/**
 * Delay helper for staggered animations
 * @param index Item index
 * @param baseDelay Base delay in seconds
 * @param maxDelay Maximum total delay
 */
export function staggerDelay(
  index: number,
  baseDelay = 0.05,
  maxDelay = 0.5
): number {
  return Math.min(index * baseDelay, maxDelay);
}
