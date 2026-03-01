import { useState, useCallback, useRef } from 'react';

interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

interface UseAsyncStateOptions<T> {
    /** Initial data value */
    initialData?: T | null;
    /** Callback on successful execution */
    onSuccess?: (data: T) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
}

interface UseAsyncStateReturn<T> extends AsyncState<T> {
    /** Execute an async function with automatic loading/error state management */
    execute: (asyncFn: () => Promise<T>) => Promise<T | null>;
    /** Manually set the data */
    setData: (data: T | null) => void;
    /** Reset to initial state */
    reset: () => void;
    /** Set loading state manually (useful for external async operations) */
    setLoading: (loading: boolean) => void;
}

/**
 * A hook for managing async state with loading and error handling.
 * 
 * Replaces 33+ instances of duplicated useState(isLoading/loading) patterns.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsyncState<User[]>();
 * 
 * useEffect(() => {
 *   execute(() => fetchUsers());
 * }, []);
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <UserList users={data} />;
 * ```
 */
export function useAsyncState<T>(
    options: UseAsyncStateOptions<T> = {}
): UseAsyncStateReturn<T> {
    const { initialData = null, onSuccess, onError } = options;

    const [state, setState] = useState<AsyncState<T>>({
        data: initialData,
        isLoading: false,
        error: null,
    });

    // Track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    // Track the current execution to handle race conditions
    const executionIdRef = useRef(0);

    const execute = useCallback(
        async (asyncFn: () => Promise<T>): Promise<T | null> => {
            const currentExecutionId = ++executionIdRef.current;

            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const result = await asyncFn();

                // Only update state if this is still the latest execution and component is mounted
                if (isMountedRef.current && currentExecutionId === executionIdRef.current) {
                    setState({ data: result, isLoading: false, error: null });
                    onSuccess?.(result);
                }

                return result;
            } catch (error) {
                const normalizedError = error instanceof Error ? error : new Error(String(error));

                if (isMountedRef.current && currentExecutionId === executionIdRef.current) {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: normalizedError,
                    }));
                    onError?.(normalizedError);
                }

                return null;
            }
        },
        [onSuccess, onError]
    );

    const setData = useCallback((data: T | null) => {
        if (isMountedRef.current) {
            setState(prev => ({ ...prev, data }));
        }
    }, []);

    const setLoading = useCallback((isLoading: boolean) => {
        if (isMountedRef.current) {
            setState(prev => ({ ...prev, isLoading }));
        }
    }, []);

    const reset = useCallback(() => {
        if (isMountedRef.current) {
            setState({ data: initialData, isLoading: false, error: null });
        }
    }, [initialData]);

    // Cleanup on unmount
    useState(() => {
        return () => {
            isMountedRef.current = false;
        };
    });

    return {
        ...state,
        execute,
        setData,
        setLoading,
        reset,
    };
}

/**
 * A simpler hook for just tracking loading state.
 * Use this when you don't need full async state management.
 * 
 * @example
 * ```tsx
 * const { isLoading, withLoading } = useLoadingState();
 * 
 * const handleSubmit = async () => {
 *   await withLoading(async () => {
 *     await saveData();
 *   });
 * };
 * ```
 */
export function useLoadingState(initialLoading = false) {
    const [isLoading, setIsLoading] = useState(initialLoading);

    const withLoading = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        try {
            return await asyncFn();
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, setIsLoading, withLoading };
}

export default useAsyncState;
