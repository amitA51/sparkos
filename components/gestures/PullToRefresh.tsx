import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { RefreshIcon } from '../icons';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
    isRefreshing?: boolean;
}

const RELEASE_THRESHOLD = 80;
const MAX_PULL = 150;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
    onRefresh,
    children,
    isRefreshing: externalIsRefreshing
}) => {
    const [internalIsRefreshing, setInternalIsRefreshing] = useState(false);
    const isRefreshing = externalIsRefreshing ?? internalIsRefreshing;

    const containerRef = useRef<HTMLDivElement>(null);
    const y = useMotionValue(0);
    const startY = useRef(0);
    const isDragging = useRef(false);

    // Visual transforms
    const rotate = useTransform(y, [0, RELEASE_THRESHOLD], [0, 360]);
    const opacity = useTransform(y, [0, RELEASE_THRESHOLD / 2, RELEASE_THRESHOLD], [0, 0.5, 1]);
    const scale = useTransform(y, [0, RELEASE_THRESHOLD], [0.8, 1]);

    useEffect(() => {
        if (!isRefreshing) {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
        } else {
            animate(y, RELEASE_THRESHOLD, { type: "spring", stiffness: 300, damping: 30 });
        }
    }, [isRefreshing, y]);

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY > 0 || isRefreshing) return;
        if (e.touches.length > 0 && e.touches[0]) {
            startY.current = e.touches[0].clientY;
            isDragging.current = false;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 0 || !e.touches[0]) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only activate if we are at the top and pulling down
        if (window.scrollY <= 0 && diff > 0 && !isRefreshing) {
            isDragging.current = true;
            // Add resistance
            const damped = diff * 0.4;
            y.set(Math.min(damped, MAX_PULL));

            // Prevent default to stop native scroll bouncing if supported (though passive listeners might block this)
            if (e.cancelable) e.preventDefault();
        }
    };

    const handleTouchEnd = async () => {
        if (!isDragging.current || isRefreshing) return;

        const currentPull = y.get();
        isDragging.current = false;

        if (currentPull > RELEASE_THRESHOLD) {
            setInternalIsRefreshing(true);
            animate(y, RELEASE_THRESHOLD, { type: "spring", stiffness: 300, damping: 30 });

            try {
                await onRefresh();
            } finally {
                if (!externalIsRefreshing) {
                    setInternalIsRefreshing(false);
                    animate(y, 0); // Will be handled by useEffect but safe here too
                }
            }
        } else {
            animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-[100dvh]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Loading Indicator */}
            <motion.div
                className="fixed top-20 left-0 right-0 flex justify-center z-50 pointer-events-none"
                style={{ y, opacity }}
            >
                <motion.div
                    className="bg-[var(--bg-secondary)] p-3 rounded-full shadow-xl border border-[var(--border-primary)]"
                    style={{ rotate, scale }}
                >
                    <RefreshIcon className={`w-5 h-5 text-[var(--dynamic-accent-highlight)] ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.div>
            </motion.div>

            {/* Content wrapper that moves */}
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </div>
    );
};
