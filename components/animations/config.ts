// Animation Performance Configuration
// This file centralizes animation settings for better performance control

import { Variants, Transition } from 'framer-motion';

// -----------------------------------------------------------------------------
// 🎯 PERFORMANCE DETECTION
// -----------------------------------------------------------------------------

/**
 * Detects if the device is low-end based on hardware capabilities
 */
const detectLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Check CPU cores
  const cpuCores = navigator.hardwareConcurrency || 4;
  
  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory || 8;
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return cpuCores <= 4 || deviceMemory <= 4 || prefersReducedMotion;
};

/**
 * Detects if user prefers reduced motion
 */
const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// -----------------------------------------------------------------------------
// ⚙️ ANIMATION CONFIGURATION
// -----------------------------------------------------------------------------

export const ANIMATION_CONFIG = {
  // Performance detection
  isLowEndDevice: detectLowEndDevice(),
  prefersReducedMotion: detectReducedMotion(),
  
  // Computed settings
  get enableAnimations(): boolean {
    return !this.prefersReducedMotion;
  },
  
  get enableBackgroundAnimations(): boolean {
    return !this.isLowEndDevice && !this.prefersReducedMotion;
  },
  
  get enableMicroInteractions(): boolean {
    return this.enableAnimations;
  },
  
  get enableListStagger(): boolean {
    return !this.isLowEndDevice && this.enableAnimations;
  },
  
  get enableSpringAnimations(): boolean {
    return !this.isLowEndDevice;
  },
  
  // Animation budgets
  maxConcurrentAnimations: 5,
  
  // Duration multipliers based on performance
  get durationMultiplier(): number {
    if (this.prefersReducedMotion) return 0;
    if (this.isLowEndDevice) return 0.5;
    return 1;
  },
};

// -----------------------------------------------------------------------------
// 🚀 OPTIMIZED TRANSITIONS
// -----------------------------------------------------------------------------

/**
 * Fast transition for micro-interactions (replaces spring for better performance)
 */
export const TRANSITION_FAST: Transition = {
  type: 'tween',
  duration: 0.15,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * Normal transition for standard animations
 */
export const TRANSITION_NORMAL: Transition = {
  type: 'tween',
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * Slow transition for emphasis animations
 */
export const TRANSITION_SLOW: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * Spring transition (only used when performance allows)
 */
export const TRANSITION_SPRING: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// -----------------------------------------------------------------------------
// 📦 OPTIMIZED VARIANTS
// -----------------------------------------------------------------------------

/**
 * Simple fade variant - most performant
 */
export const FADE_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Fade with subtle scale - good balance of polish and performance
 */
export const FADE_SCALE_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

/**
 * Slide up variant for modals and sheets
 */
export const SLIDE_UP_VARIANTS: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

/**
 * Instant variant - no animation
 */
export const INSTANT_VARIANTS: Variants = {
  initial: {},
  animate: {},
  exit: {},
};

// -----------------------------------------------------------------------------
// 🎨 CSS TRANSITION UTILITIES
// -----------------------------------------------------------------------------

/**
 * CSS classes for hover/tap effects (use instead of whileHover/whileTap)
 */
export const CSS_HOVER_TAP = {
  subtle: 'transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]',
  normal: 'transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]',
  pronounced: 'transition-transform duration-150 hover:scale-[1.05] active:scale-[0.95]',
  none: '',
};

/**
 * CSS classes for color transitions
 */
export const CSS_COLOR_TRANSITION = {
  fast: 'transition-colors duration-100',
  normal: 'transition-colors duration-150',
  slow: 'transition-colors duration-200',
};

// -----------------------------------------------------------------------------
// 🔧 UTILITY FUNCTIONS
// -----------------------------------------------------------------------------

/**
 * Get appropriate transition based on performance mode
 */
export const getOptimizedTransition = (type: 'fast' | 'normal' | 'slow' = 'normal'): Transition => {
  if (!ANIMATION_CONFIG.enableAnimations) {
    return { duration: 0 };
  }
  
  const multiplier = ANIMATION_CONFIG.durationMultiplier;
  
  switch (type) {
    case 'fast':
      return { ...TRANSITION_FAST, duration: (TRANSITION_FAST.duration ?? 0.15) * multiplier };
    case 'slow':
      return { ...TRANSITION_SLOW, duration: (TRANSITION_SLOW.duration ?? 0.3) * multiplier };
    default:
      return { ...TRANSITION_NORMAL, duration: (TRANSITION_NORMAL.duration ?? 0.2) * multiplier };
  }
};

/**
 * Get appropriate variants based on performance mode
 */
export const getOptimizedVariants = (type: 'fade' | 'fadeScale' | 'slideUp' = 'fade'): Variants => {
  if (!ANIMATION_CONFIG.enableAnimations) {
    return INSTANT_VARIANTS;
  }
  
  switch (type) {
    case 'fadeScale':
      return FADE_SCALE_VARIANTS;
    case 'slideUp':
      return SLIDE_UP_VARIANTS;
    default:
      return FADE_VARIANTS;
  }
};

/**
 * Check if animation should be skipped
 */
export const shouldSkipAnimation = (): boolean => {
  return !ANIMATION_CONFIG.enableAnimations;
};

/**
 * Get stagger delay for list items (0 if disabled)
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.02): number => {
  if (!ANIMATION_CONFIG.enableListStagger) return 0;
  return index * baseDelay * ANIMATION_CONFIG.durationMultiplier;
};
