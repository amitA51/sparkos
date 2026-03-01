import { useEffect, useRef, useCallback } from 'react';

interface UseMemoryCleanupOptions {
    /** Cleanup interval in milliseconds */
    interval?: number;
    /** Run cleanup when component unmounts */
    cleanupOnUnmount?: boolean;
    /** Enable memory pressure detection */
    detectMemoryPressure?: boolean;
}

/**
 * useMemoryCleanup - Automatically cleanup resources to prevent memory leaks
 * 
 * This hook provides utilities for:
 * - Cleaning up event listeners
 * - Clearing intervals/timeouts
 * - Revoking blob URLs
 * - Aborting fetch requests
 */
export function useMemoryCleanup(options: UseMemoryCleanupOptions = {}) {
    const {
        interval = 30000,
        cleanupOnUnmount = true,
        detectMemoryPressure = true
    } = options;

    const cleanupFnsRef = useRef<Set<() => void>>(new Set());
    const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
    const blobUrlsRef = useRef<Set<string>>(new Set());
    const abortControllersRef = useRef<Set<AbortController>>(new Set());

    // Register a cleanup function
    const registerCleanup = useCallback((fn: () => void) => {
        cleanupFnsRef.current.add(fn);
        return () => cleanupFnsRef.current.delete(fn);
    }, []);

    // Create a managed interval
    const createInterval = useCallback((fn: () => void, ms: number): NodeJS.Timeout => {
        const id = setInterval(fn, ms);
        intervalsRef.current.add(id);
        return id;
    }, []);

    // Create a managed timeout
    const createTimeout = useCallback((fn: () => void, ms: number): NodeJS.Timeout => {
        const id = setTimeout(() => {
            fn();
            timeoutsRef.current.delete(id);
        }, ms);
        timeoutsRef.current.add(id);
        return id;
    }, []);

    // Create a managed blob URL
    const createBlobUrl = useCallback((blob: Blob): string => {
        const url = URL.createObjectURL(blob);
        blobUrlsRef.current.add(url);
        return url;
    }, []);

    // Revoke a specific blob URL
    const revokeBlobUrl = useCallback((url: string) => {
        URL.revokeObjectURL(url);
        blobUrlsRef.current.delete(url);
    }, []);

    // Create a managed AbortController
    const createAbortController = useCallback((): AbortController => {
        const controller = new AbortController();
        abortControllersRef.current.add(controller);
        return controller;
    }, []);

    // Run all cleanup functions
    const runCleanup = useCallback(() => {
        // Run registered cleanup functions
        cleanupFnsRef.current.forEach(fn => {
            try {
                fn();
            } catch (e) {
                console.error('[useMemoryCleanup] Cleanup function error:', e);
            }
        });

        // Clear all intervals
        intervalsRef.current.forEach(id => clearInterval(id));
        intervalsRef.current.clear();

        // Clear all timeouts
        timeoutsRef.current.forEach(id => clearTimeout(id));
        timeoutsRef.current.clear();

        // Revoke all blob URLs
        blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();

        // Abort all fetch requests
        abortControllersRef.current.forEach(controller => {
            if (!controller.signal.aborted) {
                controller.abort();
            }
        });
        abortControllersRef.current.clear();
    }, []);

    // Memory pressure detection
    useEffect(() => {
        if (!detectMemoryPressure) return;

        // Check if Performance API with memory info is available (Chrome only)
        const hasMemoryInfo = 'memory' in performance;

        if (!hasMemoryInfo) return;

        const checkMemoryPressure = () => {
            const memory = (performance as Performance & {
                memory?: {
                    usedJSHeapSize: number;
                    jsHeapSizeLimit: number;
                }
            }).memory;

            if (memory) {
                const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

                // If memory usage > 80%, trigger cleanup
                if (usageRatio > 0.8) {
                    console.warn('[useMemoryCleanup] High memory pressure detected, running cleanup');
                    runCleanup();
                }
            }
        };

        const intervalId = setInterval(checkMemoryPressure, interval);

        return () => clearInterval(intervalId);
    }, [detectMemoryPressure, interval, runCleanup]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (cleanupOnUnmount) {
                runCleanup();
            }
        };
    }, [cleanupOnUnmount, runCleanup]);

    return {
        registerCleanup,
        createInterval,
        createTimeout,
        createBlobUrl,
        revokeBlobUrl,
        createAbortController,
        runCleanup,
    };
}

/**
 * useCleanupOnUnmount - Simple cleanup on unmount
 */
export function useCleanupOnUnmount(cleanupFn: () => void) {
    const cleanupRef = useRef(cleanupFn);
    cleanupRef.current = cleanupFn;

    useEffect(() => {
        return () => {
            cleanupRef.current();
        };
    }, []);
}

/**
 * useAbortController - Create an AbortController that auto-aborts on unmount
 */
export function useAbortController(): AbortController {
    const controllerRef = useRef<AbortController>(new AbortController());

    useEffect(() => {
        controllerRef.current = new AbortController();

        return () => {
            controllerRef.current.abort();
        };
    }, []);

    return controllerRef.current;
}

export default useMemoryCleanup;
