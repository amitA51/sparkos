import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void>;
    resistance?: number; // How hard it is to pull (default 2.5)
    threshold?: number; // Pixels to pull before triggering refresh (default 80)
}

export function usePullToRefresh({
    onRefresh,
    resistance = 2.5,
    threshold = 80,
}: UsePullToRefreshOptions) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const startY = useRef(0);
    const isDragging = useRef(false);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        // Only enable if we are at the top of the page
        if (window.scrollY === 0) {
            if (e.touches && e.touches[0]) {
                startY.current = e.touches[0].clientY;
            }
            isDragging.current = true;
        }
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging.current || isRefreshing || window.scrollY > 0) return;

        if (startY.current === 0 || !e.touches || !e.touches[0]) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow pulling down
        if (diff > 0) {
            // Prevent browser default refresh
            if (e.cancelable) e.preventDefault();

            // Calculate damped distance
            const damped = Math.min(diff / resistance, threshold * 1.5);
            setPullDistance(damped);
        }
    }, [isRefreshing, resistance, threshold]);

    const handleTouchEnd = useCallback(async () => {
        isDragging.current = false;

        if (pullDistance > threshold && !isRefreshing) {
            setIsRefreshing(true);
            setPullDistance(threshold); // Snap to threshold

            // Haptic feedback if available
            if (navigator.vibrate) navigator.vibrate(10);

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    }, [pullDistance, threshold, isRefreshing, onRefresh]);

    useEffect(() => {
        // Add non-passive listeners to allow preventing default
        // This is crucial for stopping browser's native pull-to-refresh
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        pullDistance,
        isRefreshing,
        threshold,
    };
}
