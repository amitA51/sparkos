import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface UseAccurateTimerOptions {
    /** Duration in milliseconds */
    initialDuration: number;
    /** Called every tick with remaining time in ms */
    onTick?: (remaining: number) => void;
    /** Called when timer completes */
    onComplete?: () => void;
    /** Tick interval in ms (default 100ms for smooth UI) */
    tickInterval?: number;
}

interface UseAccurateTimerReturn {
    /** Time remaining in milliseconds */
    remaining: number;
    /** Time elapsed in milliseconds */
    elapsed: number;
    /** Progress from 0 to 1 */
    progress: number;
    /** Current timer status */
    status: TimerStatus;
    /** Start or restart the timer */
    start: (durationMs?: number) => void;
    /** Pause the timer */
    pause: () => void;
    /** Resume a paused timer */
    resume: () => void;
    /** Stop and reset the timer */
    stop: () => void;
    /** Reset to initial duration without starting */
    reset: (newDurationMs?: number) => void;
}

/**
 * High-precision timer hook using Date.now() for accuracy.
 * Handles background tabs correctly by computing delta on each tick.
 */
export function useAccurateTimer(options: UseAccurateTimerOptions): UseAccurateTimerReturn {
    const {
        initialDuration,
        onTick,
        onComplete,
        tickInterval = 100,
    } = options;

    const [status, setStatus] = useState<TimerStatus>('idle');
    const [remaining, setRemaining] = useState(initialDuration);

    // Store target end time for accuracy
    const endTimeRef = useRef<number>(0);
    // Store paused remaining time
    const pausedRemainingRef = useRef<number>(initialDuration);
    // Store total duration for progress calculation
    const totalDurationRef = useRef<number>(initialDuration);
    // Interval reference
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const tick = useCallback(() => {
        const now = Date.now();
        const newRemaining = Math.max(0, endTimeRef.current - now);

        setRemaining(newRemaining);
        onTick?.(newRemaining);

        if (newRemaining <= 0) {
            // Timer completed
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setStatus('completed');
            onComplete?.();
        }
    }, [onTick, onComplete]);

    const start = useCallback((durationMs?: number) => {
        const duration = durationMs ?? totalDurationRef.current;
        totalDurationRef.current = duration;

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set end time based on current time + duration
        endTimeRef.current = Date.now() + duration;
        setRemaining(duration);
        setStatus('running');

        // Start interval
        intervalRef.current = setInterval(tick, tickInterval);
    }, [tick, tickInterval]);

    const pause = useCallback(() => {
        if (status !== 'running') return;

        // Store remaining time
        pausedRemainingRef.current = Math.max(0, endTimeRef.current - Date.now());

        // Clear interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setRemaining(pausedRemainingRef.current);
        setStatus('paused');
    }, [status]);

    const resume = useCallback(() => {
        if (status !== 'paused') return;

        // Set new end time based on paused remaining
        endTimeRef.current = Date.now() + pausedRemainingRef.current;
        setStatus('running');

        // Restart interval
        intervalRef.current = setInterval(tick, tickInterval);
    }, [status, tick, tickInterval]);

    const stop = useCallback(() => {
        // Clear interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setRemaining(totalDurationRef.current);
        pausedRemainingRef.current = totalDurationRef.current;
        setStatus('idle');
    }, []);

    const reset = useCallback((newDurationMs?: number) => {
        const duration = newDurationMs ?? initialDuration;
        totalDurationRef.current = duration;
        pausedRemainingRef.current = duration;

        // Clear interval if running
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setRemaining(duration);
        setStatus('idle');
    }, [initialDuration]);

    // Calculate derived values
    const elapsed = totalDurationRef.current - remaining;
    const progress = totalDurationRef.current > 0
        ? Math.min(1, Math.max(0, elapsed / totalDurationRef.current))
        : 0;

    return {
        remaining,
        elapsed,
        progress,
        status,
        start,
        pause,
        resume,
        stop,
        reset,
    };
}

export default useAccurateTimer;
