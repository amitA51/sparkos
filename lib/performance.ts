/**
 * Performance Utilities
 * 
 * Collection of utilities for optimizing React application performance.
 * Following Vercel's React Best Practices.
 */

// ============================================================================
// Deferred Component Loading
// ============================================================================

import { lazy, type ComponentType } from 'react';

/**
 * Enhanced lazy loading with preload capability
 * Based on Vercel's bundle-preload pattern
 */
export function lazyWithPreload<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
): {
  Component: React.LazyExoticComponent<T>;
  preload: () => Promise<void>;
} {
  let modulePromise: Promise<{ default: T }> | null = null;

  const preload = () => {
    if (!modulePromise) {
      modulePromise = factory();
    }
    return modulePromise.then(() => undefined);
  };

  const Component = lazy(() => {
    if (modulePromise) {
      return modulePromise;
    }
    modulePromise = factory();
    return modulePromise;
  });

  return { Component, preload };
}

// ============================================================================
// Request Idle Callback Wrapper
// ============================================================================

/**
 * Run callback during browser idle time
 * Gracefully falls back for unsupported browsers
 */
export function runWhenIdle(
  callback: () => void,
  options?: { timeout?: number }
): () => void {
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, options);
    return () => window.cancelIdleCallback(handle);
  }

  // Fallback using setTimeout
  const handle = setTimeout(callback, options?.timeout ?? 1);
  return () => clearTimeout(handle);
}

// ============================================================================
// Batched Updates
// ============================================================================

/**
 * Batch multiple DOM reads/writes to prevent layout thrashing
 * Based on js-batch-dom-css pattern
 */
export function batchDOMOperations<T>(
  reads: () => T,
  writes: (readResults: T) => void
): void {
  requestAnimationFrame(() => {
    const readResults = reads();
    requestAnimationFrame(() => {
      writes(readResults);
    });
  });
}

// ============================================================================
// Memoization Helpers
// ============================================================================

/**
 * Create a memoized version of a function with LRU cache
 * Based on js-cache-function-results pattern
 */
export function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: { maxSize?: number; keyFn?: (...args: TArgs) => string } = {}
): (...args: TArgs) => TResult {
  const { maxSize = 100, keyFn = (...args) => JSON.stringify(args) } = options;
  const cache = new Map<string, TResult>();

  return (...args: TArgs): TResult => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      // Move to end (most recently used)
      const value = cache.get(key)!;
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn(...args);

    // Evict oldest if at capacity
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    cache.set(key, result);
    return result;
  };
}

// ============================================================================
// Intersection Observer Pool
// ============================================================================

/**
 * Shared IntersectionObserver pool to reduce observer instances
 * Improves performance when tracking many elements
 */
class IntersectionObserverPool {
  private observers = new Map<string, IntersectionObserver>();
  private callbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>();

  observe(
    element: Element,
    callback: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit
  ): () => void {
    const key = this.getOptionsKey(options);
    let observer = this.observers.get(key);

    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const cb = this.callbacks.get(entry.target);
          if (cb) cb(entry);
        });
      }, options);
      this.observers.set(key, observer);
    }

    this.callbacks.set(element, callback);
    observer.observe(element);

    return () => {
      this.callbacks.delete(element);
      observer?.unobserve(element);
    };
  }

  private getOptionsKey(options?: IntersectionObserverInit): string {
    if (!options) return 'default';
    return JSON.stringify({
      root: options.root?.toString(),
      rootMargin: options.rootMargin,
      threshold: options.threshold,
    });
  }
}

export const intersectionObserverPool = new IntersectionObserverPool();

// ============================================================================
// RAF Throttle
// ============================================================================

/**
 * Throttle a function to run at most once per animation frame
 * Useful for scroll/resize handlers
 */
export function rafThrottle<T extends (...args: unknown[]) => void>(
  fn: T
): T & { cancel: () => void } {
  let rafId: number | null = null;
  let lastArgs: unknown[] | null = null;

  const throttled = ((...args: unknown[]) => {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (lastArgs) {
          fn(...lastArgs);
        }
      });
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled;
}

// ============================================================================
// Measure Performance
// ============================================================================

/**
 * Measure execution time of a function
 * @param name - Name for the performance mark
 * @param fn - Function to measure
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  if (typeof performance === 'undefined' || !import.meta.env.DEV) {
    return fn();
  }

  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
}

/**
 * Async version of measurePerformance
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  if (typeof performance === 'undefined' || !import.meta.env.DEV) {
    return fn();
  }

  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    console.debug(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }
}

// ============================================================================
// Chunk Array Processing
// ============================================================================

/**
 * Process large arrays in chunks to avoid blocking the main thread
 * Based on js-combine-iterations pattern
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  chunkSize = 50
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    // Process chunk
    const chunkResults = chunk.map((item, idx) => processor(item, i + idx));
    results.push(...chunkResults);

    // Yield to main thread between chunks
    if (i + chunkSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return results;
}

// ============================================================================
// Debounce with Leading/Trailing Options
// ============================================================================

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): T & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] | null = null;

  const invoke = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  const cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (maxTimeoutId) clearTimeout(maxTimeoutId);
    timeoutId = null;
    maxTimeoutId = null;
    lastArgs = null;
  };

  const flush = () => {
    cancel();
    invoke();
  };

  const debounced = ((...args: unknown[]) => {
    lastArgs = args;

    const shouldCallLeading = leading && !timeoutId;

    if (timeoutId) clearTimeout(timeoutId);

    if (trailing) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
          maxTimeoutId = null;
        }
        invoke();
      }, wait);
    }

    if (maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        maxTimeoutId = null;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        invoke();
      }, maxWait);
    }

    if (shouldCallLeading) {
      invoke();
    }
  }) as T & { cancel: () => void; flush: () => void };

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}

// ============================================================================
// Image Loading Optimization
// ============================================================================

/**
 * Preload images for faster display
 * @param urls - Array of image URLs to preload
 */
export function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * Load image with intersection observer (lazy loading)
 * @param element - Image element
 * @param src - Image source URL
 */
export function lazyLoadImage(
  element: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          element.src = src;
          observer.unobserve(element);
        }
      });
    },
    { rootMargin: '50px', ...options }
  );

  observer.observe(element);

  return () => observer.disconnect();
}

// ============================================================================
// Resource Hints
// ============================================================================

/**
 * Add prefetch hint for a resource
 */
export function prefetch(url: string, as?: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (as) link.as = as;
  document.head.appendChild(link);
}

/**
 * Add preconnect hint for a domain
 */
export function preconnect(url: string): void {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// ============================================================================
// Idle Callback
// ============================================================================

/**
 * Schedule work during browser idle time
 */
export function scheduleIdleWork<T>(
  work: () => T,
  timeout = 2000
): Promise<T> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void })
        .requestIdleCallback(() => resolve(work()), { timeout });
    } else {
      // Fallback for Safari
      setTimeout(() => resolve(work()), 1);
    }
  });
}

// ============================================================================
// Bundle Splitting Helpers
// ============================================================================

/**
 * Create a lazy component with retry logic
 */
export function lazyWithRetry<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return React.lazy(() => retryImport(importFn, retries, delay));
}

async function retryImport<T>(
  importFn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryImport(importFn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// ============================================================================
// Memory Management
// ============================================================================

/**
 * Weak cache for objects that can be garbage collected
 */
export function createWeakCache<K extends object, V>() {
  const cache = new WeakMap<K, V>();

  return {
    get: (key: K): V | undefined => cache.get(key),
    set: (key: K, value: V): void => {
      cache.set(key, value);
    },
    has: (key: K): boolean => cache.has(key),
    delete: (key: K): boolean => cache.delete(key),
  };
}

/**
 * Get memory usage info (if available)
 */
export function getMemoryInfo(): { usedJSHeapSize?: number; totalJSHeapSize?: number } {
  const memory = (performance as Performance & { 
    memory?: { usedJSHeapSize: number; totalJSHeapSize: number } 
  }).memory;
  
  if (memory) {
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
    };
  }
  return {};
}

// ============================================================================
// Event Listener Optimization
// ============================================================================

/**
 * Passive event listener options for scroll/touch events
 */
export const passiveEventOptions: AddEventListenerOptions = {
  passive: true,
  capture: false,
};

/**
 * Create a shared event listener (multiple handlers, one listener)
 */
export function createSharedListener<E extends Event>(
  target: EventTarget,
  eventType: string,
  options?: AddEventListenerOptions
) {
  const handlers = new Set<(event: E) => void>();

  const handleEvent = (event: Event) => {
    handlers.forEach((handler) => handler(event as E));
  };

  target.addEventListener(eventType, handleEvent, options);

  return {
    add: (handler: (event: E) => void) => {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    remove: (handler: (event: E) => void) => handlers.delete(handler),
    destroy: () => {
      target.removeEventListener(eventType, handleEvent, options);
      handlers.clear();
    },
    size: () => handlers.size,
  };
}

// ============================================================================
// React Import for lazy components
// ============================================================================

import React from 'react';
