import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../src/utils/haptics';

interface PressableProps {
  children: React.ReactNode;
  /** Scale factor when pressed (default: 0.97) */
  scale?: number;
  /** Whether to trigger haptic feedback on press */
  haptic?: boolean;
  /** Haptic style */
  hapticStyle?: 'light' | 'medium' | 'selection';
  /** Additional className */
  className?: string;
  /** Whether the element is disabled */
  disabled?: boolean;
  /** onClick handler */
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
  /** Render as a specific element type */
  as?: 'div' | 'button' | 'li';
  /** Pass through any other HTML attributes */
  style?: React.CSSProperties;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  id?: string;
}

/**
 * Pressable - Universal tap feedback wrapper
 *
 * Adds subtle scale-on-press animation to any tappable element,
 * giving native-app-like tactile feedback. Respects reduced motion.
 *
 * Usage:
 *   <Pressable onClick={handleClick}>
 *     <MyCard />
 *   </Pressable>
 *
 *   <Pressable scale={0.95} haptic>
 *     <button>Tap me</button>
 *   </Pressable>
 */
export const Pressable: React.FC<PressableProps> = ({
  children,
  scale = 0.97,
  haptic = false,
  hapticStyle = 'light',
  className = '',
  disabled = false,
  onClick,
  as = 'div',
  style,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
    if (haptic) {
      triggerHaptic(hapticStyle);
    }
  }, [disabled, haptic, hapticStyle]);

  const handlePressEnd = useCallback(() => {
    // Small delay before releasing to ensure the animation is visible
    pressTimerRef.current = setTimeout(() => {
      setIsPressed(false);
    }, 50);
  }, []);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      className={`${className} ${disabled ? 'pointer-events-none' : ''}`}
      animate={{
        scale: isPressed && !disabled ? scale : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 600,
        damping: 30,
        mass: 0.5,
      }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={() => setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      style={{
        ...style,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        cursor: disabled ? 'default' : 'pointer',
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default Pressable;
