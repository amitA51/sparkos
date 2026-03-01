import { Variants, Transition } from 'framer-motion';
import { ANIMATION_CONFIG } from './config';

// -----------------------------------------------------------------------------
// 🎭 SPARK OS MOTION SYSTEM - OPTIMIZED
// -----------------------------------------------------------------------------
// Core physics and transition definitions optimized for performance.
// Springs replaced with tween animations for better performance.
// -----------------------------------------------------------------------------

/**
 * FAST transition - for micro-interactions (replaces spring for better performance)
 * Duration: 0.15s
 */
export const SPRING_PREMIUM: Transition = {
    type: 'tween',
    duration: 0.15,
    ease: [0.22, 1, 0.36, 1],
};

/**
 * BOUNCY transition - for playful micro-interactions
 * Duration: 0.2s with overshoot
 */
export const SPRING_BOUNCY: Transition = {
    type: 'tween',
    duration: 0.2,
    ease: [0.34, 1.56, 0.64, 1], // Overshoot easing
};

/**
 * ELEGANT transition - for large entrances (modals, pages)
 * Duration: 0.25s
 */
export const SPRING_ELEGANT: Transition = {
    type: 'tween',
    duration: 0.25,
    ease: [0.22, 1, 0.36, 1],
};

/**
 * Get optimized transition based on performance mode
 */
export const getOptimizedSpring = (type: 'premium' | 'bouncy' | 'elegant' = 'premium'): Transition => {
    if (!ANIMATION_CONFIG.enableAnimations) {
        return { duration: 0 };
    }
    
    const multiplier = ANIMATION_CONFIG.durationMultiplier;
    
    switch (type) {
        case 'bouncy':
            return { ...SPRING_BOUNCY, duration: (SPRING_BOUNCY.duration ?? 0.2) * multiplier };
        case 'elegant':
            return { ...SPRING_ELEGANT, duration: (SPRING_ELEGANT.duration ?? 0.25) * multiplier };
        default:
            return { ...SPRING_PREMIUM, duration: (SPRING_PREMIUM.duration ?? 0.15) * multiplier };
    }
};

// -----------------------------------------------------------------------------
// VARIANTS
// -----------------------------------------------------------------------------

/**
 * Standard Page Transition
 * Fast fade-in without heavy blur for instant content visibility.
 */
export const PAGE_VARIANTS: Variants = {
    initial: {
        opacity: 0,
        scale: 0.99,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.99,
        transition: {
            duration: 0.15,
            ease: 'easeIn',
        }
    },
};

/**
 * Bottom Sheet / Modal Entrance
 */
export const SHEET_VARIANTS: Variants = {
    hidden: {
        y: '100%',
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: SPRING_ELEGANT,
    },
    exit: {
        y: '100%',
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1], // easeOut
        },
    },
};

/**
 * Stagger Container
 * Use this on the parent list. Minimal delays for instant feel.
 */
export const STAGGER_CONTAINER: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.02,
            delayChildren: 0,
        },
    },
};

/**
 * Stagger Item
 * Use this on list items. No blur for instant rendering.
 */
export const STAGGER_ITEM: Variants = {
    hidden: {
        opacity: 0,
        y: 6,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/**
 * Micro-interaction: Scale on press
 */
export const TOUCH_SCALE: Variants = {
    tap: { scale: 0.96 },
    hover: { scale: 1.02 },
};

export const BUTTON_HOVER: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.03,
        transition: SPRING_BOUNCY,
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};
