/**
 * Advanced React Hooks
 * 
 * Modern hooks following React 19 patterns and best practices.
 * Includes optimistic updates, debouncing, and more.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react';

// ============================================================================
// useDebounce - Debounce any value
// ============================================================================

/**
 * Debounce a value with configurable delay
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// useDebouncedCallback - Debounce a callback function
// ============================================================================

/**
 * Returns a debounced version of the callback
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

// ============================================================================
// useThrottle - Throttle a value
// ============================================================================

/**
 * Throttle a value with configurable interval
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
      return;
    }

    const handler = setTimeout(() => {
      lastUpdated.current = Date.now();
      setThrottledValue(value);
    }, interval - timeSinceLastUpdate);

    return () => clearTimeout(handler);
  }, [value, interval]);

  return throttledValue;
}

// ============================================================================
// useLocalStorage - Persist state to localStorage
// ============================================================================

/**
 * useState that persists to localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ============================================================================
// usePrevious - Get previous value
// ============================================================================

/**
 * Returns the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================================================
// useLatest - Always get latest value without re-renders
// ============================================================================

/**
 * Returns a ref that always points to the latest value
 * Useful for callbacks that need latest value without deps
 */
export function useLatest<T>(value: T): React.RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// ============================================================================
// useOnClickOutside - Detect clicks outside element
// ============================================================================

/**
 * Calls callback when clicking outside of ref element
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
}

// ============================================================================
// useMediaQuery - Respond to media queries
// ============================================================================

/**
 * Hook to check if a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    handleChange();

    // Add listener (modern API)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

// ============================================================================
// useToggle - Boolean toggle state
// ============================================================================

/**
 * Simple boolean toggle hook
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle, setValue];
}

// ============================================================================
// useIsFirstRender - Check if it's the first render
// ============================================================================

/**
 * Returns true on first render, false on subsequent renders
 */
export function useIsFirstRender(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }

  return false;
}

// ============================================================================
// useUpdateEffect - useEffect that skips first render
// ============================================================================

/**
 * Like useEffect but skips the first render
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ============================================================================
// useOnlineStatus - Network status detection
// ============================================================================

/**
 * Returns current online status with real-time updates
 */
export function useOnlineStatus(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }, []);

  const getSnapshot = useCallback(() => navigator.onLine, []);
  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ============================================================================
// useTransitionValue - Non-urgent state updates (React 19)
// ============================================================================

/**
 * Wraps setState in startTransition for non-urgent updates
 */
export function useTransitionValue<T>(
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  const setTransitionValue = useCallback(
    (newValue: T) => {
      startTransition(() => {
        setValue(newValue);
      });
    },
    []
  );

  return [value, setTransitionValue, isPending];
}

// ============================================================================
// useIntersectionObserver - Visibility detection
// ============================================================================

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Observe element visibility using IntersectionObserver
 */
export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [React.RefCallback<T>, boolean, IntersectionObserverEntry | undefined] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<T | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    if (!node || frozen) return;

    const observer = new IntersectionObserver(
      ([e]) => setEntry(e),
      { threshold, root, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, root, rootMargin, frozen]);

  const isVisible = !!entry?.isIntersecting;

  return [setNode, isVisible, entry];
}

// ============================================================================
// useCopyToClipboard - Copy text to clipboard
// ============================================================================

type CopyState = 'idle' | 'copied' | 'error';

/**
 * Copy text to clipboard with state feedback
 */
export function useCopyToClipboard(
  resetDelay = 2000
): [CopyState, (text: string) => Promise<void>] {
  const [state, setState] = useState<CopyState>('idle');

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setState('copied');
        setTimeout(() => setState('idle'), resetDelay);
      } catch {
        setState('error');
        setTimeout(() => setState('idle'), resetDelay);
      }
    },
    [resetDelay]
  );

  return [state, copy];
}

// ============================================================================
// useInterval - setInterval as a hook
// ============================================================================

/**
 * Declarative setInterval hook
 * @param callback - Function to call
 * @param delay - Interval in ms (null to pause)
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useLatest(callback);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current?.();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, savedCallback]);
}

// ============================================================================
// useTimeout - setTimeout as a hook
// ============================================================================

/**
 * Declarative setTimeout hook with reset capability
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): { reset: () => void; clear: () => void } {
  const savedCallback = useLatest(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => savedCallback.current?.(), delay);
    }
  }, [delay, clear, savedCallback]);

  useEffect(() => {
    reset();
    return clear;
  }, [delay, reset, clear]);

  return { reset, clear };
}

// ============================================================================
// useEventListener - Declarative event listener
// ============================================================================

/**
 * Declarative event listener hook
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | HTMLElement | null,
  options?: AddEventListenerOptions
): void {
  const savedHandler = useLatest(handler);
  const targetElement = element ?? (typeof window !== 'undefined' ? window : null);

  useEffect(() => {
    if (!targetElement) return;

    const eventListener = (event: Event) => {
      savedHandler.current?.(event as WindowEventMap[K]);
    };

    targetElement.addEventListener(eventName, eventListener, options);
    return () => targetElement.removeEventListener(eventName, eventListener, options);
  }, [eventName, targetElement, options, savedHandler]);
}

// ============================================================================
// useStableCallback - Stable callback ref (useLatest pattern)
// ============================================================================

/**
 * Returns a stable callback that always calls the latest version
 * Useful to avoid re-renders while maintaining latest closure
 */
export function useStableCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T
): T {
  const callbackRef = useLatest(callback);
  
  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current?.(...args)) as T,
    [callbackRef]
  );
}

// ============================================================================
// useDocumentTitle - Update document title
// ============================================================================

/**
 * Updates document title and restores on unmount
 */
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle.current;
      }
    };
  }, [title, restoreOnUnmount]);
}

// ============================================================================
// useIsMounted - Check if component is mounted
// ============================================================================

/**
 * Returns a function that returns true if component is mounted
 * Useful for avoiding setState on unmounted components in async code
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

// ============================================================================
// useAsync - Async operation management
// ============================================================================

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Manages async operation state
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  immediate = true
): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const isMounted = useIsMounted();

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFn();
      if (isMounted()) {
        setState({ data: result, error: null, isLoading: false });
      }
    } catch (err) {
      if (isMounted()) {
        setState({ data: null, error: err as Error, isLoading: false });
      }
    }
  }, [asyncFn, isMounted]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
}

// ============================================================================
// useOptimistic - Optimistic updates with rollback
// ============================================================================

/**
 * Manages optimistic updates with automatic rollback on error
 * @param initialValue - Initial state value
 * @param updateFn - Async function to perform actual update
 */
export function useOptimistic<T>(
  initialValue: T,
  updateFn: (optimisticValue: T) => Promise<T>
) {
  const [value, setValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const previousValueRef = useRef(initialValue);

  const update = useCallback(
    async (optimisticValue: T) => {
      // Store previous value for rollback
      previousValueRef.current = value;
      
      // Apply optimistic update
      setValue(optimisticValue);
      setIsPending(true);

      try {
        // Perform actual update
        const result = await updateFn(optimisticValue);
        setValue(result);
        return result;
      } catch (error) {
        // Rollback on error
        setValue(previousValueRef.current);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [value, updateFn]
  );

  return { value, update, isPending };
}

// ============================================================================
// useScrollPosition - Track scroll position
// ============================================================================

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

/**
 * Track scroll position and direction
 * @param element - Element to track (defaults to window)
 * @param threshold - Threshold for direction change detection
 */
export function useScrollPosition(
  element?: React.RefObject<HTMLElement>,
  threshold = 10
): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    isAtTop: true,
    isAtBottom: false,
  });

  const previousY = useRef(0);

  useEffect(() => {
    const target = element?.current || window;
    
    const handleScroll = () => {
      const scrollY = element?.current?.scrollTop ?? window.scrollY;
      const scrollX = element?.current?.scrollLeft ?? window.scrollX;
      
      const scrollHeight = element?.current?.scrollHeight ?? document.documentElement.scrollHeight;
      const clientHeight = element?.current?.clientHeight ?? window.innerHeight;
      
      let direction: 'up' | 'down' | null = null;
      const diff = scrollY - previousY.current;
      
      if (Math.abs(diff) > threshold) {
        direction = diff > 0 ? 'down' : 'up';
        previousY.current = scrollY;
      }

      setPosition({
        x: scrollX,
        y: scrollY,
        direction,
        isAtTop: scrollY <= 0,
        isAtBottom: scrollY + clientHeight >= scrollHeight - 10,
      });
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => target.removeEventListener('scroll', handleScroll);
  }, [element, threshold]);

  return position;
}

// ============================================================================
// useHotkey - Keyboard shortcut handler
// ============================================================================

type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';

interface HotkeyOptions {
  modifiers?: ModifierKey[];
  enabled?: boolean;
  preventDefault?: boolean;
}

/**
 * Register keyboard shortcuts
 * @param key - Key to listen for
 * @param callback - Handler function
 * @param options - Configuration options
 */
export function useHotkey(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {}
) {
  const { modifiers = [], enabled = true, preventDefault = true } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      
      const ctrlMatch = modifiers.includes('ctrl') === (event.ctrlKey || event.metaKey);
      const altMatch = modifiers.includes('alt') === event.altKey;
      const shiftMatch = modifiers.includes('shift') === event.shiftKey;
      const metaMatch = modifiers.includes('meta') === event.metaKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        if (preventDefault) event.preventDefault();
        callbackRef.current(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, modifiers, enabled, preventDefault]);
}

// ============================================================================
// useVirtualList - Virtualized list for performance
// ============================================================================

interface VirtualListConfig {
  itemCount: number;
  itemHeight: number;
  overscan?: number;
}

interface VirtualListResult {
  virtualItems: Array<{ index: number; start: number }>;
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Virtual list for rendering large lists efficiently
 * @param config - Virtualization configuration
 */
export function useVirtualList(config: VirtualListConfig): VirtualListResult {
  const { itemCount, itemHeight, overscan = 3 } = config;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    const handleResize = () => setContainerHeight(container.clientHeight);

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const totalHeight = itemCount * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const virtualItems: Array<{ index: number; start: number }> = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
    });
  }

  return { virtualItems, totalHeight, containerRef };
}

// ============================================================================
// useMeasure - Measure element dimensions
// ============================================================================

interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/**
 * Measure element dimensions with ResizeObserver
 */
export function useMeasure<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  Dimensions
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height, top, left, bottom, right } = entry.contentRect;
        setDimensions({ width, height, top, left, bottom, right });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, dimensions];
}

// ============================================================================
// useIdle - Detect user inactivity
// ============================================================================

/**
 * Detect if user is idle
 * @param timeout - Idle timeout in milliseconds
 */
export function useIdle(timeout = 60000): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    const resetTimer = () => {
      setIsIdle(false);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsIdle(true), timeout);
    };

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      window.clearTimeout(timeoutRef.current);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout]);

  return isIdle;
}

// ============================================================================
// useNetworkState - Network connectivity status
// ============================================================================

interface NetworkState {
  online: boolean;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Track network connectivity and quality
 */
export function useNetworkState(): NetworkState {
  const getState = useCallback((): NetworkState => {
    const connection = (navigator as unknown as {
      connection?: {
        downlink?: number;
        effectiveType?: string;
        rtt?: number;
        saveData?: boolean;
      };
    }).connection;

    return {
      online: navigator.onLine,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
    };
  }, []);

  const [state, setState] = useState(getState);

  useEffect(() => {
    const handleChange = () => setState(getState());

    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    
    const connection = (navigator as unknown as { connection?: EventTarget }).connection;
    connection?.addEventListener('change', handleChange);

    return () => {
      window.removeEventListener('online', handleChange);
      window.removeEventListener('offline', handleChange);
      connection?.removeEventListener('change', handleChange);
    };
  }, [getState]);

  return state;
}

// ============================================================================
// useReducedMotion - Check user's motion preference
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// ============================================================================
// useClipboard - Enhanced clipboard with feedback
// ============================================================================

interface ClipboardState {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Enhanced clipboard hook with copy feedback
 * @param resetTimeout - Time before copied state resets (ms)
 */
export function useClipboard(resetTimeout = 2000): ClipboardState {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), resetTimeout);
      
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, [resetTimeout]);

  const reset = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    setCopied(false);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return { copied, copy, reset };
}
