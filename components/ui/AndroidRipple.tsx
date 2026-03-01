import React, { useState, useLayoutEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

interface Ripple {
    x: number;
    y: number;
    size: number;
    key: number;
}

interface AndroidRippleProps {
    color?: string;
    duration?: number;
}

// ============================================================================
// Component
// ============================================================================

/**
 * AndroidRipple
 * 
 * A component that adds a "Material Design" style ripple effect to any container.
 * Must be placed inside a container with `position: relative` and `overflow: hidden`.
 * 
 * @example
 * <button className="relative overflow-hidden ...">
 *   Click Me
 *   <AndroidRipple />
 * </button>
 */
export const AndroidRipple: React.FC<AndroidRippleProps> = React.memo(({
    color = 'rgba(255, 255, 255, 0.3)',
    duration = 600,
}) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    useLayoutEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (ripples.length > 0) {
            timer = setTimeout(() => {
                setRipples([]);
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [ripples, duration]);

    const addRipple = (event: React.MouseEvent) => {
        const container = event.currentTarget.getBoundingClientRect();
        const size = container.width > container.height ? container.width : container.height;
        const x = event.clientX - container.left - size / 2;
        const y = event.clientY - container.top - size / 2;
        const newRipple = { x, y, size, key: Date.now() };

        setRipples((prev) => [...prev, newRipple]);
    };

    return (
        <div
            className="absolute inset-0 pointer-events-auto"
            onMouseDown={addRipple}
        // Note: React 18 event delegation handles touch/click duality automatically 
        // ideally we rely on onClick or onMouseDown for standard elements.
        // But for ripples we explicitly want the "Down" event.
        >
            {ripples.map((ripple) => (
                <span
                    key={ripple.key}
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                        backgroundColor: color,
                        position: 'absolute',
                        borderRadius: '50%',
                        transform: 'scale(0)',
                        animation: `ripple ${duration}ms linear`,
                        pointerEvents: 'none',
                    }}
                />
            ))}
            <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
});

AndroidRipple.displayName = 'AndroidRipple';
