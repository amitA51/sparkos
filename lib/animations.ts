/**
 * Animation Utilities Library
 * 
 * Comprehensive animation system following UI/UX Pro Max guidelines.
 * Includes micro-interactions, page transitions, and accessibility support.
 */

import { type Variants, type Transition, type TargetAndTransition } from 'framer-motion';

// ============================================================================
// Core Animation Timing Constants
// ============================================================================

/** Standard animation durations in seconds */
export const DURATION = {
  /** Ultra-fast for micro-interactions */
  instant: 0.1,
  /** Fast for small UI changes */
  fast: 0.15,
  /** Standard for most animations */
  normal: 0.2,
  /** Medium for emphasis */
  medium: 0.3,
  /** Slow for page transitions */
  slow: 0.4,
  /** Extra slow for dramatic effect */
  dramatic: 0.6,
} as const;

/** Standard easing curves */
export const EASING = {
  /** Quick start, smooth end - good for entering */
  easeOut: [0.0, 0.0, 0.2, 1],
  /** Smooth start, quick end - good for exiting */
  easeIn: [0.4, 0.0, 1, 1],
  /** Smooth both ends - good for moving/transitioning */
  easeInOut: [0.4, 0.0, 0.2, 1],
  /** Bounce at end */
  bounce: [0.68, -0.55, 0.265, 1.55],
  /** Spring-like */
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

/** Spring physics configurations */
export const SPRING = {
  /** Snappy - quick response */
  snappy: { type: 'spring', stiffness: 500, damping: 30 },
  /** Bouncy - playful */
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  /** Gentle - smooth */
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  /** Stiff - minimal bounce */
  stiff: { type: 'spring', stiffness: 700, damping: 40 },
} as const;

// ============================================================================
// Page Transition Variants
// ============================================================================

/**
 * Fade transition - simplest, works everywhere
 */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Slide up transition - modern, engaging
 */
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/**
 * Slide from right - for navigation forward
 */
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

/**
 * Slide from left - for navigation back
 */
export const slideLeftVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

/**
 * Scale fade - dramatic, attention-grabbing
 */
export const scaleFadeVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
};

/**
 * Pop in - for modals and overlays
 */
export const popInVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING.bouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: DURATION.fast },
  },
};

// ============================================================================
// List Animation Variants
// ============================================================================

/**
 * Container for staggered children
 */
export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * Individual list items
 */
export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION.normal },
  },
  exit: { 
    opacity: 0, 
    y: -5,
    transition: { duration: DURATION.fast },
  },
};

/**
 * Grid items with scale effect
 */
export const gridItemVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATION.normal },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: DURATION.fast },
  },
};

// ============================================================================
// Micro-Interaction Animations
// ============================================================================

/**
 * Button press effect
 */
export const buttonPressVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

/**
 * Card hover effect
 */
export const cardHoverVariants: Variants = {
  idle: { 
    scale: 1, 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
  },
  hover: { 
    scale: 1.01, 
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    transition: { duration: DURATION.fast },
  },
};

/**
 * Icon pulse animation
 */
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { 
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

/**
 * Shake animation (for errors)
 */
export const shakeVariants: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
};

/**
 * Success checkmark animation
 */
export const checkmarkVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { 
      pathLength: { duration: 0.3, delay: 0.1 },
      opacity: { duration: 0.1 },
    },
  },
};

// ============================================================================
// Loading Animations
// ============================================================================

/**
 * Skeleton pulse
 */
export const skeletonVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Spinner rotation
 */
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Dots loading animation
 */
export const dotsContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const dotVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    },
  },
};

// ============================================================================
// Notification Animations
// ============================================================================

/**
 * Toast notification - slide in from top
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: -50, scale: 0.9 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: SPRING.snappy,
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    transition: { duration: DURATION.fast },
  },
};

/**
 * Bottom sheet - slide up from bottom
 */
export const bottomSheetVariants: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING.gentle,
  },
  exit: { 
    opacity: 0, 
    y: '100%',
    transition: { duration: DURATION.medium },
  },
};

/**
 * Backdrop fade
 */
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: DURATION.fast },
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION.fast },
  },
};

// ============================================================================
// Transition Presets
// ============================================================================

export const transitions = {
  /** Fast micro-interaction */
  fast: { duration: DURATION.fast, ease: EASING.easeOut } as Transition,
  /** Normal UI transition */
  normal: { duration: DURATION.normal, ease: EASING.easeInOut } as Transition,
  /** Slower emphasis transition */
  slow: { duration: DURATION.slow, ease: EASING.easeOut } as Transition,
  /** Page transition */
  page: { duration: DURATION.medium, ease: EASING.easeInOut } as Transition,
} as const;

// ============================================================================
// Accessibility Helpers
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation variants that respect prefers-reduced-motion
 */
export const getAccessibleVariants = <T extends Variants>(
  fullVariants: T,
  reducedVariants: T = fadeVariants as T
): T => {
  return prefersReducedMotion() ? reducedVariants : fullVariants;
};

/**
 * Get transition that respects prefers-reduced-motion
 */
export const getAccessibleTransition = (
  fullTransition: Transition,
  reducedDuration = 0.01
): Transition => {
  if (prefersReducedMotion()) {
    return { duration: reducedDuration };
  }
  return fullTransition;
};

// ============================================================================
// Animation Helpers
// ============================================================================

/**
 * Create stagger animation for children
 * @param staggerDelay - Delay between each child
 * @param initialDelay - Delay before first child
 */
export const createStaggerVariants = (
  staggerDelay = 0.05,
  initialDelay = 0
): Variants => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

/**
 * Create hover animation
 */
export const createHoverAnimation = (
  scale = 1.02,
  duration = DURATION.fast
): { whileHover: TargetAndTransition } => ({
  whileHover: {
    scale,
    transition: { duration },
  },
});

/**
 * Create tap animation
 */
export const createTapAnimation = (
  scale = 0.98
): { whileTap: TargetAndTransition } => ({
  whileTap: { scale },
});

// ============================================================================
// CSS Animation Keyframes (for non-Framer elements)
// ============================================================================

export const cssKeyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
      50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
    }
  `,
} as const;
