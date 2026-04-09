import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface AnimatedListProps {
  children: React.ReactNode;
  /** Stagger delay between items in seconds (default: 0.03) */
  staggerDelay?: number;
  /** Additional className for the list container */
  className?: string;
  /** Animation direction for items entering */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Initial delay before first item (default: 0) */
  initialDelay?: number;
}

interface AnimatedListItemProps {
  children: React.ReactNode;
  /** Unique key for AnimatePresence tracking */
  itemKey: string | number;
  /** Additional className */
  className?: string;
  /** Override animation direction */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Layout animation for reordering */
  layout?: boolean;
}

const getItemVariants = (direction: string = 'up'): Variants => {
  const offsets: Record<string, { x?: number; y?: number }> = {
    up: { y: 12 },
    down: { y: -12 },
    left: { x: -20 },
    right: { x: 20 },
    fade: {},
  };

  const offset = offsets[direction] || offsets.up;

  return {
    initial: {
      opacity: 0,
      ...offset,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      ...offset,
      transition: {
        duration: 0.15,
        ease: 'easeIn',
      },
    },
  };
};

const containerVariants: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

/**
 * AnimatedList - Container for animated list items
 *
 * Provides staggered enter animations and smooth exit animations
 * for list items. Works with AnimatedListItem for per-item animations.
 *
 * Usage:
 *   <AnimatedList>
 *     {items.map(item => (
 *       <AnimatedListItem key={item.id} itemKey={item.id}>
 *         <ItemCard item={item} />
 *       </AnimatedListItem>
 *     ))}
 *   </AnimatedList>
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  staggerDelay = 0.03,
  className = '',
  initialDelay = 0,
}) => {
  const customContainerVariants: Variants = {
    ...containerVariants,
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      variants={customContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * AnimatedListItem - Individual item with enter/exit animations
 *
 * Must be used inside an AnimatedList container.
 * Each item smoothly enters on mount and exits on unmount.
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  itemKey,
  className = '',
  direction = 'up',
  layout = true,
}) => {
  const variants = getItemVariants(direction);

  return (
    <motion.div
      key={itemKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout={layout}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30,
        mass: 0.8,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedGrid - Same as AnimatedList but uses CSS grid layout
 */
export const AnimatedGrid: React.FC<
  AnimatedListProps & {
    columns?: number | string;
    gap?: number | string;
  }
> = ({
  children,
  staggerDelay = 0.04,
  className = '',
  columns = 2,
  gap = '1rem',
}) => {
  const customContainerVariants: Variants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns:
      typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
  };

  return (
    <motion.div
      variants={customContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
      style={gridStyle}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedList;
