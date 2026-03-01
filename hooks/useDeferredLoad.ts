import { useEffect, useRef, useCallback } from 'react';

interface UseDeferredLoadOptions {
  /** Delay before loading in ms */
  delay?: number;
  /** Only load when browser is idle */
  useIdleCallback?: boolean;
  /** Enable/disable the deferred load */
  enabled?: boolean;
}

/**
 * useDeferredLoad - Load non-critical data after initial render
 *
 * This hook defers loading of non-essential data to improve initial page load time.
 * It waits for browser idle time or a specified delay before triggering the load.
 *
 * @example
 * ```tsx
 * const loadAnalytics = useDeferredLoad(
 *   () => fetchAnalyticsData(),
 *   { delay: 2000, useIdleCallback: true }
 * );
 * ```
 */
export function useDeferredLoad<T>(
  loadFn: () => Promise<T> | T,
  options: UseDeferredLoadOptions = {}
): { isLoading: boolean; data: T | null; error: Error | null; reload: () => void } {
  const { delay = 1000, useIdleCallback = true, enabled = true } = options;

  const loadedRef = useRef(false);
  const mountedRef = useRef(true);
  const dataRef = useRef<T | null>(null);
  const errorRef = useRef<Error | null>(null);
  const isLoadingRef = useRef(false);

  const executeLoad = useCallback(async () => {
    if (loadedRef.current || !mountedRef.current || isLoadingRef.current) return;

    isLoadingRef.current = true;
    loadedRef.current = true;

    try {
      const result = await loadFn();
      if (mountedRef.current) {
        dataRef.current = result;
      }
    } catch (err) {
      if (mountedRef.current) {
        errorRef.current = err instanceof Error ? err : new Error(String(err));
        console.error('[useDeferredLoad] Failed to load:', err);
      }
    } finally {
      if (mountedRef.current) {
        isLoadingRef.current = false;
      }
    }
  }, [loadFn]);

  const scheduleLoad = useCallback(() => {
    if (useIdleCallback && 'requestIdleCallback' in window) {
      const idleCallback = (
        window as Window & {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback;

      idleCallback(
        () => {
          if (mountedRef.current) {
            executeLoad();
          }
        },
        { timeout: delay + 500 }
      );
    } else {
      setTimeout(() => {
        if (mountedRef.current) {
          executeLoad();
        }
      }, delay);
    }
  }, [delay, executeLoad, useIdleCallback]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      scheduleLoad();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [enabled, scheduleLoad]);

  const reload = useCallback(() => {
    loadedRef.current = false;
    errorRef.current = null;
    dataRef.current = null;
    scheduleLoad();
  }, [scheduleLoad]);

  return {
    isLoading: isLoadingRef.current,
    data: dataRef.current,
    error: errorRef.current,
    reload,
  };
}

/**
 * useIdleEffect - Run an effect during browser idle time
 *
 * Similar to useEffect but waits for requestIdleCallback
 */
export function useIdleEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList = [],
  timeout: number = 2000
): void {
  const cleanupRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    let cancelled = false;

    const runEffect = () => {
      if (!cancelled) {
        cleanupRef.current = effect();
      }
    };

    if ('requestIdleCallback' in window) {
      const idleCallback = (
        window as Window & {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
        }
      ).requestIdleCallback;

      const id = idleCallback(runEffect, { timeout });

      return () => {
        cancelled = true;
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        }
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    } else {
      const timeoutId = setTimeout(runEffect, timeout);

      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useDeferredLoad;
