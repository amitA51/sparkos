import React, { useMemo } from 'react';
import { motion, Variants, Transition } from 'framer-motion';

export type TransitionDirection = 'left' | 'right' | 'up' | 'down' | 'fade' | 'scale' | 'slide-up';
export type TransitionStyle = 'spring' | 'smooth' | 'snappy' | 'elastic';

/**
 * Detect if we're on a mobile device where blur transitions are expensive.
 * On Android, filter:blur() triggers software rasterization which kills frame rate.
 * We skip blur entirely on mobile and use transform+opacity only (GPU-composited).
 */
const isMobileDevice = typeof window !== 'undefined' &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: TransitionDirection;
  style?: TransitionStyle;
  delay?: number;
  duration?: number;
  /** Custom variants override */
  customVariants?: Variants;
}

// Premium transition configurations
const transitionStyles: Record<TransitionStyle, Transition> = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  smooth: {
    type: 'tween',
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1], // Material Design easing
  },
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 35,
    mass: 0.5,
  },
  elastic: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
    mass: 1,
    bounce: 0.25,
  },
};

// Helper type for variant objects (framer-motion compatible)
type VariantTarget = {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  filter?: string;
  rotateX?: number;
};

// Direction-based variants
// On mobile: skip filter:blur (causes software rasterization on Android, kills FPS)
// Only use transform + opacity (GPU-composited, 60fps)
const getVariants = (direction: TransitionDirection): Variants => {
  // Mobile uses smaller displacement values for snappier feel
  const d = isMobileDevice ? 0.6 : 1;

  const withBlur = (target: VariantTarget, blur: string): VariantTarget => {
    if (isMobileDevice) return target;
    return { ...target, filter: blur };
  };

  const enter = (target: VariantTarget) => withBlur(target, 'blur(8px)');
  const done = (target: VariantTarget) => withBlur(target, 'blur(0px)');

  switch (direction) {
    case 'left':
      return {
        initial: enter({ opacity: 0, x: 100 * d, scale: 0.95 }),
        in: done({ opacity: 1, x: 0, scale: 1 }),
        out: enter({ opacity: 0, x: -100 * d, scale: 0.95 }),
      };
    case 'right':
      return {
        initial: enter({ opacity: 0, x: -100 * d, scale: 0.95 }),
        in: done({ opacity: 1, x: 0, scale: 1 }),
        out: enter({ opacity: 0, x: 100 * d, scale: 0.95 }),
      };
    case 'up':
      return {
        initial: enter({ opacity: 0, y: 60 * d, scale: 0.97 }),
        in: done({ opacity: 1, y: 0, scale: 1 }),
        out: enter({ opacity: 0, y: -40 * d, scale: 0.97 }),
      };
    case 'down':
      return {
        initial: enter({ opacity: 0, y: -60 * d, scale: 0.97 }),
        in: done({ opacity: 1, y: 0, scale: 1 }),
        out: enter({ opacity: 0, y: 40 * d, scale: 0.97 }),
      };
    case 'fade':
      return {
        initial: enter({ opacity: 0, scale: 1 }),
        in: done({ opacity: 1, scale: 1 }),
        out: enter({ opacity: 0, scale: 1 }),
      };
    case 'scale':
      return {
        initial: enter({
          opacity: 0,
          scale: 0.85,
          ...(isMobileDevice ? {} : { rotateX: 10 }),
        }),
        in: done({
          opacity: 1,
          scale: 1,
          ...(isMobileDevice ? {} : { rotateX: 0 }),
        }),
        out: enter({
          opacity: 0,
          scale: 1.1,
          ...(isMobileDevice ? {} : { rotateX: -5 }),
        }),
      };
    case 'slide-up':
    default:
      return {
        initial: enter({ opacity: 0, y: 30 * d, scale: 0.98 }),
        in: done({ opacity: 1, y: 0, scale: 1 }),
        out: enter({ opacity: 0, y: -20 * d, scale: 0.98 }),
      };
  }
};

/**
 * PageTransition - Enhanced Premium Page Transition Component
 * 
 * Features:
 * - Multiple directional transitions (left, right, up, down, fade, scale)
 * - Customizable transition styles (spring, smooth, snappy, elastic)
 * - GPU-accelerated animations with blur effects
 * - Configurable delay and duration
 * - RTL-aware (Hebrew support)
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  direction = 'slide-up',
  style = 'spring',
  delay = 0,
  duration,
  customVariants,
}) => {
  const variants = useMemo(() => 
    customVariants || getVariants(direction),
    [direction, customVariants]
  );

  const transition = useMemo(() => {
    const baseTransition = { ...transitionStyles[style] };
    
    if (delay > 0) {
      baseTransition.delay = delay;
    }
    
    if (duration && baseTransition.type === 'tween') {
      baseTransition.duration = duration;
    }
    
    return baseTransition;
  }, [style, delay, duration]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className={`will-change-transform ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideTransition - Horizontal slide transition for navigation
 * Perfect for tab-style navigation with direction awareness
 */
export const SlideTransition: React.FC<PageTransitionProps & { 
  from?: 'left' | 'right';
}> = ({ children, className, from = 'right' }) => {
  const variants: Variants = {
    initial: {
      opacity: 0,
      x: from === 'right' ? 80 : -80,
      scale: 0.96,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: from === 'right' ? -80 : 80,
      scale: 0.96,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 32,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeScaleTransition - Elegant fade with subtle scale
 * Perfect for modals, overlays, and content reveals
 */
export const FadeScaleTransition: React.FC<PageTransitionProps & {
  origin?: 'center' | 'top' | 'bottom';
}> = ({ children, className, origin = 'center' }) => {
  const originY = origin === 'top' ? -20 : origin === 'bottom' ? 20 : 0;
  
  const variants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.92,
      y: originY,
      ...(isMobileDevice ? {} : { filter: 'blur(10px)' }),
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      ...(isMobileDevice ? {} : { filter: 'blur(0px)' }),
    },
    out: {
      opacity: 0,
      scale: 0.95,
      y: -originY / 2,
      ...(isMobileDevice ? {} : { filter: 'blur(5px)' }),
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerTransition - For animating lists of children with stagger
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className, staggerDelay = 0.05 }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

/**
 * SharedLayoutTransition - For smooth layout animations
 * Use with AnimatePresence and layoutId
 */
export const SharedLayoutTransition: React.FC<{
  children: React.ReactNode;
  layoutId: string;
  className?: string;
}> = ({ children, layoutId, className }) => {
  return (
    <motion.div
      layoutId={layoutId}
      layout
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * PresenceTransition - Simple presence-based animation
 * For toggling visibility with animation
 */
export const PresenceTransition: React.FC<{
  children: React.ReactNode;
  isVisible: boolean;
  className?: string;
}> = ({ children, isVisible, className }) => {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
        y: isVisible ? 0 : 10,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
