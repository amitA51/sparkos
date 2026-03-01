// Performance Mode Hook
// Detects device capabilities and provides animation settings

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface PerformanceMode {
  isLowPerformance: boolean;
  prefersReducedMotion: boolean;
  enableAnimations: boolean;
  enableBackgroundAnimations: boolean;
  enableListStagger: boolean;
  animationDuration: number;
  animationMultiplier: number;
}

/**
 * Hook to detect device performance and provide animation settings
 */
export const usePerformanceMode = (): PerformanceMode => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detect low-end devices
    const checkPerformance = () => {
      // Check CPU cores
      const cpuCores = navigator.hardwareConcurrency || 4;
      
      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory || 8;
      
      // Check for reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      const isLowEnd = cpuCores <= 4 || deviceMemory <= 4;
      
      setIsLowPerformance(isLowEnd);
      setPrefersReducedMotion(reducedMotion);
    };

    checkPerformance();

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return useMemo(() => ({
    isLowPerformance,
    prefersReducedMotion,
    enableAnimations: !prefersReducedMotion,
    enableBackgroundAnimations: !isLowPerformance && !prefersReducedMotion,
    enableListStagger: !isLowPerformance && !prefersReducedMotion,
    animationDuration: prefersReducedMotion ? 0 : isLowPerformance ? 0.1 : 0.2,
    animationMultiplier: prefersReducedMotion ? 0 : isLowPerformance ? 0.5 : 1,
  }), [isLowPerformance, prefersReducedMotion]);
};

/**
 * Hook to get optimized animation props for motion components
 */
export const useOptimizedAnimation = () => {
  const { enableAnimations, animationDuration, animationMultiplier } = usePerformanceMode();

  const getTransition = useCallback((baseDuration: number = 0.2) => ({
    duration: enableAnimations ? baseDuration * animationMultiplier : 0,
    ease: [0.22, 1, 0.36, 1] as const,
  }), [enableAnimations, animationMultiplier]);

  const getDelay = useCallback((index: number, baseDelay: number = 0.02) => {
    if (!enableAnimations) return 0;
    return index * baseDelay * animationMultiplier;
  }, [enableAnimations, animationMultiplier]);

  const variants = useMemo(() => ({
    initial: enableAnimations ? { opacity: 0, y: 10 } : {},
    animate: { opacity: 1, y: 0 },
    exit: enableAnimations ? { opacity: 0, y: 10 } : {},
  }), [enableAnimations]);

  const fadeVariants = useMemo(() => ({
    initial: enableAnimations ? { opacity: 0 } : {},
    animate: { opacity: 1 },
    exit: enableAnimations ? { opacity: 0 } : {},
  }), [enableAnimations]);

  return {
    enableAnimations,
    animationDuration,
    getTransition,
    getDelay,
    variants,
    fadeVariants,
  };
};

/**
 * Hook to conditionally render animations
 */
export const useConditionalAnimation = <T,>(
  animatedValue: T,
  staticValue: T
): T => {
  const { enableAnimations } = usePerformanceMode();
  return enableAnimations ? animatedValue : staticValue;
};

export default usePerformanceMode;
