import { useState, useEffect, useCallback, useRef } from 'react';
import { triggerHaptic } from '../src/utils/haptics';

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void>;
    resistance?: number; // How hard it is to pull (default 2.5)
    threshold?: number; // Pixels to pull before triggering refresh (default 80)
    /** Ref to the scrollable container (defaults to document if not provided) */
    containerRef?: React.RefObject<HTMLElement | null>;
    /** Whether pull-to-refresh is enabled (default true) */
    enabled?: boolean;
}

/**
 * Pull-to-refresh hook optimized for Android.
 *
 * Key Android optimizations:
 * - Uses requestAnimationFrame for smooth 60fps animation
 * - Passive touchstart listener (only touchmove is non-passive for preventDefault)
 * - Haptic feedback at threshold via triggerHaptic utility
 * - CSS transform for GPU-composited pull indicator
 * - Cleans up listeners properly to avoid memory leaks
 */
export function usePullToRefresh({
    onRefresh,
    resistance = 2.5,
    threshold = 80,
    containerRef,
    enabled = true,
}: UsePullToRefreshOptions) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const startY = useRef(0);
    const currentPull = useRef(0);
    const isDragging = useRef(false);
    const didCrossThreshold = useRef(false);
    const rafId = useRef<number | null>(null);

    const isAtTop = useCallback(() => {
        if (containerRef?.current) {
            return containerRef.current.scrollTop <= 0;
        }
        return window.scrollY <= 0;
    }, [containerRef]);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled || isRefreshing) return;
        if (isAtTop() && e.touches?.[0]) {
            startY.current = e.touches[0].clientY;
            isDragging.current = true;
            didCrossThreshold.current = false;
        }
    }, [enabled, isRefreshing, isAtTop]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current || isRefreshing || !isAtTop()) return;
        if (startY.current === 0 || !e.touches?.[0]) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        if (diff > 0) {
            // Prevent browser's native pull-to-refresh
            if (e.cancelable) e.preventDefault();

            // Damped distance with diminishing returns
            const damped = Math.min(diff / resistance, threshold * 1.5);
            currentPull.current = damped;

            // Haptic feedback when crossing threshold for the first time
            if (damped >= threshold && !didCrossThreshold.current) {
                didCrossThreshold.current = true;
                triggerHaptic('medium');
            }

            // Use rAF to batch DOM updates for smooth animation
            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(() => {
                    setPullDistance(currentPull.current);
                    rafId.current = null;
                });
            }
        }
    }, [isRefreshing, resistance, threshold, isAtTop]);

    const handleTouchEnd = useCallback(async () => {
        isDragging.current = false;

        // Cancel any pending rAF
        if (rafId.current !== null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }

        const finalPull = currentPull.current;
        currentPull.current = 0;

        if (finalPull >= threshold && !isRefreshing) {
            setIsRefreshing(true);
            setPullDistance(threshold); // Snap to threshold during refresh

            triggerHaptic('success');

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    }, [threshold, isRefreshing, onRefresh]);

    useEffect(() => {
        if (!enabled) return;

        const target = containerRef?.current || document;

        // touchstart: passive (we don't need to prevent default here)
        target.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
        // touchmove: non-passive (we need preventDefault to stop browser refresh)
        target.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
        // touchend: passive
        target.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });

        return () => {
            target.removeEventListener('touchstart', handleTouchStart as EventListener);
            target.removeEventListener('touchmove', handleTouchMove as EventListener);
            target.removeEventListener('touchend', handleTouchEnd as EventListener);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd, containerRef]);

    return {
        pullDistance,
        isRefreshing,
        threshold,
        /** Progress 0-1 toward threshold */
        progress: Math.min(pullDistance / threshold, 1),
        /** Whether the pull has crossed the threshold */
        isReady: pullDistance >= threshold,
    };
}
