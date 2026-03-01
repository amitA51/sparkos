/**
 * Advanced API Patterns
 * 
 * Production-ready patterns for API calls, error handling, and caching.
 * Includes retry logic, request deduplication, and optimistic updates.
 */

import { ApiError, ValidationError } from '../services/errors';

// ============================================================================
// Types
// ============================================================================

export interface RequestConfig extends RequestInit {
  /** Request timeout in ms */
  timeout?: number;
  /** Number of retry attempts */
  retries?: number;
  /** Delay between retries in ms */
  retryDelay?: number;
  /** Custom retry condition */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Transform response before returning */
  transform?: <T>(data: unknown) => T;
  /** Cache key for request deduplication */
  cacheKey?: string;
  /** Cache TTL in ms */
  cacheTTL?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  cached: boolean;
}

// ============================================================================
// Request Cache
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const requestCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Check if cache entry is valid
 */
function isCacheValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  requestCache.forEach((entry, key) => {
    if (now - entry.timestamp >= entry.ttl) {
      requestCache.delete(key);
    }
  });
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  requestCache.clear();
}

/**
 * Invalidate specific cache key
 */
export function invalidateCache(key: string): void {
  requestCache.delete(key);
}

// ============================================================================
// Retry Logic
// ============================================================================

/**
 * Default retry condition - retry on 5xx errors and network failures
 */
function defaultShouldRetry(error: unknown, attempt: number): boolean {
  if (attempt >= 3) return false;
  
  if (error instanceof ApiError) {
    // Retry on server errors and timeouts
    return (error.status && error.status >= 500) || error.status === 408;
  }
  
  // Retry on network errors
  return error instanceof TypeError;
}

/**
 * Calculate delay with exponential backoff
 */
function calculateBackoff(attempt: number, baseDelay: number): number {
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, 30000); // Max 30 seconds
}

/**
 * Sleep for specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Enhanced Fetch
// ============================================================================

/**
 * Enhanced fetch with retry, caching, and timeout
 */
export async function enhancedFetch<T>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 15000,
    retries = 3,
    retryDelay = 1000,
    shouldRetry = defaultShouldRetry,
    transform,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    ...fetchOptions
  } = config;

  // Check cache first
  if (cacheKey && (fetchOptions.method === undefined || fetchOptions.method === 'GET')) {
    const cached = requestCache.get(cacheKey);
    if (isCacheValid(cached)) {
      return {
        data: cached.data as T,
        status: 200,
        headers: new Headers(),
        cached: true,
      };
    }

    // Deduplicate in-flight requests
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      const result = await pending;
      return {
        data: result as T,
        status: 200,
        headers: new Headers(),
        cached: true,
      };
    }
  }

  // Create request promise
  const requestPromise = executeRequest<T>(url, {
    timeout,
    retries,
    retryDelay,
    shouldRetry,
    transform,
    ...fetchOptions,
  });

  // Store pending request
  if (cacheKey) {
    pendingRequests.set(cacheKey, requestPromise);
  }

  try {
    const response = await requestPromise;

    // Cache successful GET responses
    if (cacheKey && (fetchOptions.method === undefined || fetchOptions.method === 'GET')) {
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        ttl: cacheTTL,
      });
    }

    return response;
  } finally {
    if (cacheKey) {
      pendingRequests.delete(cacheKey);
    }
  }
}

/**
 * Execute request with retry logic
 */
async function executeRequest<T>(
  url: string,
  config: RequestConfig
): Promise<ApiResponse<T>> {
  const {
    timeout = 15000,
    retries = 3,
    retryDelay = 1000,
    shouldRetry = defaultShouldRetry,
    transform,
    ...fetchOptions
  } = config;

  let lastError: unknown;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status
        );
      }

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
        if (transform) {
          data = transform(data);
        }
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
        cached: false,
      };
    } catch (error) {
      lastError = error;

      // Handle abort as timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new ApiError(`Request timed out after ${timeout}ms`, 408);
      }

      // Check if we should retry
      if (!shouldRetry(lastError, attempt)) {
        break;
      }

      // Wait before retrying
      if (attempt < retries) {
        await sleep(calculateBackoff(attempt, retryDelay));
      }

      attempt++;
    }
  }

  throw lastError;
}

// ============================================================================
// Specialized API Functions
// ============================================================================

/**
 * GET request helper
 */
export async function get<T>(
  url: string,
  config?: Omit<RequestConfig, 'method' | 'body'>
): Promise<T> {
  const response = await enhancedFetch<T>(url, { ...config, method: 'GET' });
  return response.data;
}

/**
 * POST request helper
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: Omit<RequestConfig, 'method'>
): Promise<T> {
  const response = await enhancedFetch<T>(url, {
    ...config,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.data;
}

/**
 * PUT request helper
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: Omit<RequestConfig, 'method'>
): Promise<T> {
  const response = await enhancedFetch<T>(url, {
    ...config,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.data;
}

/**
 * DELETE request helper
 */
export async function del<T>(
  url: string,
  config?: Omit<RequestConfig, 'method'>
): Promise<T> {
  const response = await enhancedFetch<T>(url, { ...config, method: 'DELETE' });
  return response.data;
}

// ============================================================================
// Optimistic Updates
// ============================================================================

interface OptimisticUpdate<T, R> {
  /** Execute the actual mutation */
  mutate: () => Promise<R>;
  /** Current data before mutation */
  previousData: T;
  /** Optimistic data to show immediately */
  optimisticData: T;
  /** Apply optimistic update */
  onOptimistic: (data: T) => void;
  /** Handle success */
  onSuccess?: (result: R) => void;
  /** Handle error and rollback */
  onError?: (error: unknown, previousData: T) => void;
  /** Rollback to previous data */
  onRollback: (data: T) => void;
}

/**
 * Execute mutation with optimistic update
 */
export async function optimisticMutation<T, R>({
  mutate,
  previousData,
  optimisticData,
  onOptimistic,
  onSuccess,
  onError,
  onRollback,
}: OptimisticUpdate<T, R>): Promise<R> {
  // Apply optimistic update immediately
  onOptimistic(optimisticData);

  try {
    const result = await mutate();
    onSuccess?.(result);
    return result;
  } catch (error) {
    // Rollback on error
    onRollback(previousData);
    onError?.(error, previousData);
    throw error;
  }
}

// ============================================================================
// Request Queue
// ============================================================================

interface QueuedRequest<T> {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

class RequestQueue {
  private queue: QueuedRequest<unknown>[] = [];
  private running = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        execute: request as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.running++;

    try {
      const result = await item.execute();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  clear(): void {
    const error = new Error('Request queue cleared');
    this.queue.forEach(item => item.reject(error));
    this.queue = [];
  }

  get pendingCount(): number {
    return this.queue.length + this.running;
  }
}

export const requestQueue = new RequestQueue();

// ============================================================================
// Batch Requests
// ============================================================================

/**
 * Execute multiple requests in parallel with concurrency limit
 */
export async function batchRequests<T>(
  requests: Array<() => Promise<T>>,
  concurrency = 5
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> {
  const results: Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }> = [];
  const executing: Promise<void>[] = [];

  for (const request of requests) {
    const promise = (async () => {
      try {
        const value = await request();
        results.push({ status: 'fulfilled', value });
      } catch (reason) {
        results.push({ status: 'rejected', reason });
      }
    })();

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      // Remove completed promises
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate request data before sending
 */
export function validateRequest<T extends Record<string, unknown>>(
  data: T,
  required: Array<keyof T>
): void {
  const missing = required.filter(key => {
    const value = data[key];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`
    );
  }
}

/**
 * Sanitize request data by removing undefined/null values
 */
export function sanitizeRequest<T extends Record<string, unknown>>(
  data: T
): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }
  
  return sanitized;
}

// ============================================================================
// URL Builder
// ============================================================================

/**
 * Build URL with query parameters
 */
export function buildUrl(
  base: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(base, window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  
  return url.toString();
}
