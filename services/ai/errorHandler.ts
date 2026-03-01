/**
 * AI Error Handler Module
 * 
 * Provides robust error handling with timeouts, validation, retry logic,
 * and graceful fallbacks for AI API calls.
 * 
 * @module errorHandler
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { parseAIError, AIErrorInfo } from './geminiClient';

// ============================================================================
// Types
// ============================================================================

export interface AICallOptions<T> {
    /** Fallback value if all retries fail */
    fallback: T;
    /** Timeout in milliseconds (default: 30000) */
    timeoutMs?: number;
    /** Required fields to validate in response */
    requiredFields?: string[];
    /** Max retry attempts (default: 3) */
    retries?: number;
    /** Callback on each retry */
    onRetry?: (attempt: number, error: Error) => void;
}

export interface AICallResult<T> {
    /** The result data (either from API or fallback) */
    data: T;
    /** Error info if call failed */
    error: AIErrorInfo | null;
    /** Whether the fallback was used */
    fromFallback: boolean;
}

// ============================================================================
// Timeout Wrapper
// ============================================================================

/**
 * Wraps a promise with a timeout.
 */
export const withTimeout = <T>(
    promise: Promise<T>,
    timeoutMs: number = 30000,
    errorMessage: string = 'AI request timed out'
): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage));
        }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timeoutId);
    });
};

// ============================================================================
// Validation
// ============================================================================

/**
 * Validates that a response object has all required fields.
 */
export const validateJsonResponse = <T>(
    data: unknown,
    requiredFields: string[]
): data is T => {
    if (typeof data !== 'object' || data === null) return false;
    return requiredFields.every(field => field in (data as object));
};

// ============================================================================
// Safe AI Call Wrapper
// ============================================================================

/**
 * Wraps any AI call with comprehensive error handling.
 * 
 * Features:
 * - Timeout protection
 * - Response validation
 * - Retry with exponential backoff
 * - Graceful fallback
 * - User-friendly error messages
 * 
 * @example
 * ```ts
 * const { data, error, fromFallback } = await safeAICall(
 *   () => suggestIconForTitle(title),
 *   {
 *     fallback: 'sparkles',
 *     timeoutMs: 10000,
 *     retries: 2,
 *   }
 * );
 * ```
 */
export const safeAICall = async <T>(
    fn: () => Promise<T>,
    options: AICallOptions<T>
): Promise<AICallResult<T>> => {
    const {
        fallback,
        timeoutMs = 30000,
        requiredFields = [],
        retries = 3,
        onRetry,
    } = options;

    let lastError: AIErrorInfo | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const result = await withTimeout(fn(), timeoutMs, `AI request timed out after ${timeoutMs}ms`);

            // Validate response structure if required fields specified
            if (requiredFields.length > 0 && !validateJsonResponse(result, requiredFields)) {
                throw new Error(`Invalid response structure. Missing fields: ${requiredFields.join(', ')}`);
            }

            return { data: result, error: null, fromFallback: false };
        } catch (error) {
            lastError = parseAIError(error);

            // Don't retry non-retryable errors (auth errors, etc.)
            if (!lastError.isRetryable) {
                console.error(`[safeAICall] Non-retryable error: ${lastError.code}`);
                break;
            }

            // Callback for logging/telemetry
            onRetry?.(attempt + 1, error as Error);

            // Exponential backoff before retry
            if (attempt < retries - 1) {
                const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
                console.warn(`[safeAICall] Retry ${attempt + 1}/${retries} in ${delay}ms`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    // All retries exhausted - return fallback
    console.warn(`[safeAICall] All ${retries} retries failed, using fallback`);
    return { data: fallback, error: lastError, fromFallback: true };
};

// ============================================================================
// React Hook
// ============================================================================

export interface UseAIWithFallbackReturn<T> {
    /** The data (from API or fallback) */
    data: T;
    /** Whether the request is loading */
    isLoading: boolean;
    /** Error info if any */
    error: AIErrorInfo | null;
    /** Whether fallback was used */
    usedFallback: boolean;
    /** Refetch the data */
    refetch: () => void;
}

/**
 * React hook for AI calls with automatic fallback handling.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, usedFallback } = useAIWithFallback(
 *   () => generateDailyBriefing(tasks, habits),
 *   'יום טוב! בדוק את המשימות שלך.',
 *   { timeoutMs: 15000 },
 *   [tasks.length, habits.length]
 * );
 * 
 * if (usedFallback) {
 *   // Show subtle indicator that AI wasn't available
 * }
 * ```
 */
export const useAIWithFallback = <T>(
    fetcher: () => Promise<T>,
    fallback: T,
    options?: Omit<AICallOptions<T>, 'fallback'>,
    deps: React.DependencyList = []
): UseAIWithFallbackReturn<T> => {
    const [data, setData] = useState<T>(fallback);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<AIErrorInfo | null>(null);
    const [usedFallback, setUsedFallback] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const result = await safeAICall(fetcher, { fallback, ...options });

        setData(result.data);
        setError(result.error);
        setUsedFallback(result.fromFallback);
        setIsLoading(false);
    }, [fetcher, fallback, ...Object.values(options || {})]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, isLoading, error, usedFallback, refetch: fetchData };
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a debounced version of an AI call to prevent rapid repeated calls.
 */
export const createDebouncedAICall = <TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    delayMs: number = 500
) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastResolve: ((value: TResult) => void) | null = null;
    let lastReject: ((error: Error) => void) | null = null;

    return (...args: TArgs): Promise<TResult> => {
        return new Promise((resolve, reject) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                // Reject previous pending promise
                lastReject?.(new Error('Debounced - superseded by new call'));
            }

            lastResolve = resolve;
            lastReject = reject;

            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn(...args);
                    lastResolve?.(result);
                } catch (error) {
                    lastReject?.(error as Error);
                }
            }, delayMs);
        });
    };
};
