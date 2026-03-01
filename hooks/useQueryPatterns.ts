/**
 * Advanced React Query Hooks
 * 
 * Custom hooks for data fetching with:
 * - Optimistic updates
 * - Infinite scrolling
 * - Polling
 * - Dependent queries
 * - Prefetching
 * - Offline support
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery,
  QueryKey,
  InfiniteData,
} from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';
import { queryKeys } from '../lib/queryClient';

// ============================================================================
// Types
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

export interface OptimisticContext<T> {
  previousData: T | undefined;
}

export interface MutationCallbacks<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: () => void;
}

// ============================================================================
// Generic Optimistic Mutation Hook
// ============================================================================

/**
 * Create an optimistic mutation with automatic rollback
 */
export function useOptimisticMutation<
  TData,
  TVariables,
  TContext = OptimisticContext<TData>
>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  optimisticUpdate: (variables: TVariables, current: TData | undefined) => TData;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}) {
  const queryClient = useQueryClient();
  const { mutationFn, queryKey, optimisticUpdate, onSuccess, onError } = options;

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn,
    
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey });
      
      // Get current data
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      // Optimistically update
      queryClient.setQueryData(queryKey, (old: TData | undefined) => 
        optimisticUpdate(variables, old)
      );
      
      return { previousData } as TContext;
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context && typeof context === 'object' && 'previousData' in context) {
        queryClient.setQueryData(queryKey, (context as OptimisticContext<TData>).previousData);
      }
      onError?.(error, variables);
    },
    
    onSuccess: (data, variables) => {
      onSuccess?.(data, variables);
    },
    
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// ============================================================================
// List Operations Hooks
// ============================================================================

interface ListItem {
  id: string;
  [key: string]: unknown;
}

/**
 * Optimistic add to list
 */
export function useOptimisticAdd<T extends ListItem>(
  queryKey: QueryKey,
  mutationFn: (item: Omit<T, 'id'>) => Promise<T>,
  callbacks?: MutationCallbacks<T, Omit<T, 'id'>>
) {
  return useOptimisticMutation<T[], Omit<T, 'id'>>({
    queryKey,
    mutationFn: async (item) => {
      const result = await mutationFn(item);
      return [result];
    },
    optimisticUpdate: (newItem, current) => {
      const tempId = `temp_${Date.now()}`;
      return [...(current || []), { ...newItem, id: tempId } as T];
    },
    onSuccess: (data, variables) => {
      const firstItem = data[0];
      if (firstItem !== undefined) {
        callbacks?.onSuccess?.(firstItem, variables);
      }
    },
    onError: callbacks?.onError,
  });
}

/**
 * Optimistic update in list
 */
export function useOptimisticUpdate<T extends ListItem>(
  queryKey: QueryKey,
  mutationFn: (item: T) => Promise<T>,
  callbacks?: MutationCallbacks<T, T>
) {
  return useOptimisticMutation<T[], T>({
    queryKey,
    mutationFn: async (item) => {
      const result = await mutationFn(item);
      return [result];
    },
    optimisticUpdate: (updatedItem, current) => {
      return (current || []).map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
    },
    onSuccess: (data, variables) => {
      const firstItem = data[0];
      if (firstItem !== undefined) {
        callbacks?.onSuccess?.(firstItem, variables);
      }
    },
    onError: callbacks?.onError,
  });
}

/**
 * Optimistic delete from list
 */
export function useOptimisticDelete<T extends ListItem>(
  queryKey: QueryKey,
  mutationFn: (id: string) => Promise<void>,
  callbacks?: MutationCallbacks<void, string>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, OptimisticContext<T[]>>({
    mutationFn,
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<T[]>(queryKey);
      
      queryClient.setQueryData<T[]>(queryKey, (old) => 
        old?.filter(item => item.id !== id) || []
      );
      
      return { previousData };
    },
    
    onError: (error, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      callbacks?.onError?.(error, id);
    },
    
    onSuccess: (_, id) => {
      callbacks?.onSuccess?.(undefined, id);
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      callbacks?.onSettled?.();
    },
  });
}

// ============================================================================
// Infinite Query Hook
// ============================================================================

/**
 * Infinite scrolling query with prefetching
 */
export function useInfiniteList<T>(options: {
  queryKey: QueryKey;
  fetchFn: (cursor?: string) => Promise<PaginatedResponse<T>>;
  staleTime?: number;
  enabled?: boolean;
}) {
  const { queryKey, fetchFn, staleTime = 5 * 60 * 1000, enabled = true } = options;
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<
    PaginatedResponse<T>,
    Error,
    InfiniteData<PaginatedResponse<T>>,
    QueryKey,
    string | undefined
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchFn(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime,
    enabled,
  });

  // Flatten all pages into single array
  const allItems = query.data?.pages.flatMap(page => page.items) ?? [];
  
  // Prefetch next page when nearing end
  const prefetchNext = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  // Optimistic add to infinite list
  const optimisticAdd = useCallback((item: T) => {
    queryClient.setQueryData<InfiniteData<PaginatedResponse<T>>>(queryKey, (old) => {
      if (!old) return old;
      const newPages = [...old.pages];
      if (newPages[0]) {
        newPages[0] = {
          ...newPages[0],
          items: [item, ...newPages[0].items],
        };
      }
      return { ...old, pages: newPages };
    });
  }, [queryClient, queryKey]);

  return {
    ...query,
    items: allItems,
    total: query.data?.pages[0]?.total,
    prefetchNext,
    optimisticAdd,
  };
}

// ============================================================================
// Polling Hook
// ============================================================================

/**
 * Query with automatic polling
 */
export function usePollingQuery<T>(options: {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  pollingInterval: number;
  enabled?: boolean;
  onDataChange?: (data: T) => void;
}) {
  const { queryKey, queryFn, pollingInterval, enabled = true, onDataChange } = options;
  const previousDataRef = useRef<T | undefined>(undefined);

  const query = useQuery({
    queryKey,
    queryFn,
    refetchInterval: enabled ? pollingInterval : false,
    enabled,
  });

  // Detect data changes
  useEffect(() => {
    if (query.data && previousDataRef.current !== undefined) {
      if (JSON.stringify(query.data) !== JSON.stringify(previousDataRef.current)) {
        onDataChange?.(query.data);
      }
    }
    previousDataRef.current = query.data;
  }, [query.data, onDataChange]);

  return {
    ...query,
    stopPolling: () => {
      // Can't directly stop, but can be used with enabled flag
    },
  };
}

// ============================================================================
// Dependent Query Hook
// ============================================================================

/**
 * Query that depends on another query's result
 */
export function useDependentQuery<TParent, TChild>(options: {
  parentQueryKey: QueryKey;
  parentQueryFn: () => Promise<TParent>;
  childQueryKey: (parent: TParent) => QueryKey;
  childQueryFn: (parent: TParent) => Promise<TChild>;
  enabled?: boolean;
}) {
  const { 
    parentQueryKey, 
    parentQueryFn, 
    childQueryKey, 
    childQueryFn,
    enabled = true,
  } = options;

  const parentQuery = useQuery({
    queryKey: parentQueryKey,
    queryFn: parentQueryFn,
    enabled,
  });

  const childQuery = useQuery({
    queryKey: parentQuery.data ? childQueryKey(parentQuery.data) : ['disabled'],
    queryFn: () => childQueryFn(parentQuery.data!),
    enabled: enabled && !!parentQuery.data,
  });

  return {
    parent: parentQuery,
    child: childQuery,
    isLoading: parentQuery.isLoading || childQuery.isLoading,
    isError: parentQuery.isError || childQuery.isError,
    error: parentQuery.error || childQuery.error,
  };
}

// ============================================================================
// Prefetch Hooks
// ============================================================================

/**
 * Prefetch on hover
 */
export function usePrefetchOnHover<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  staleTime = 5 * 60 * 1000
) {
  const queryClient = useQueryClient();
  const isPrefetched = useRef(false);

  const prefetch = useCallback(() => {
    if (!isPrefetched.current) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime,
      });
      isPrefetched.current = true;
    }
  }, [queryClient, queryKey, queryFn, staleTime]);

  const reset = useCallback(() => {
    isPrefetched.current = false;
  }, []);

  return { prefetch, reset };
}

/**
 * Prefetch multiple queries
 */
export function usePrefetchQueries() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(async <T>(
    queries: Array<{
      queryKey: QueryKey;
      queryFn: () => Promise<T>;
      staleTime?: number;
    }>
  ) => {
    await Promise.all(
      queries.map(({ queryKey, queryFn, staleTime }) =>
        queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: staleTime ?? 5 * 60 * 1000,
        })
      )
    );
  }, [queryClient]);

  return { prefetch };
}

// ============================================================================
// Offline Support Hooks
// ============================================================================

/**
 * Query with offline fallback
 */
export function useOfflineQuery<T>(options: {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  offlineFallback: T;
  staleTime?: number;
}) {
  const { queryKey, queryFn, offlineFallback, staleTime } = options;
  const isOnline = useRef(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => { isOnline.current = true; };
    const handleOffline = () => { isOnline.current = false; };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!navigator.onLine) {
        return offlineFallback;
      }
      return queryFn();
    },
    staleTime,
  });

  return {
    ...query,
    isOffline: !navigator.onLine,
    data: query.data ?? offlineFallback,
  };
}

// ============================================================================
// Domain-Specific Hooks
// ============================================================================

/**
 * Tasks query hook
 */
export function useTasks(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.items.list(filters ?? {}),
    queryFn: async () => {
      // Replace with actual API call
      return [] as Array<{ id: string; title: string; completed: boolean }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Habits query hook with streaks
 */
export function useHabits() {
  return useQuery({
    queryKey: queryKeys.habits.list(),
    queryFn: async () => {
      // Replace with actual API call
      return [] as Array<{ id: string; name: string; streak: number }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * User profile hook
 */
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      // Replace with actual API call
      return null as { id: string; name: string; email: string } | null;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Batch Mutation Hook
// ============================================================================

/**
 * Execute multiple mutations in sequence or parallel
 */
export function useBatchMutations<T, V>() {
  const mutations = useRef<Array<{
    mutationFn: (v: V) => Promise<T>;
    variables: V;
  }>>([]);

  const add = useCallback((mutationFn: (v: V) => Promise<T>, variables: V) => {
    mutations.current.push({ mutationFn, variables });
  }, []);

  const executeSequential = useCallback(async () => {
    const results: T[] = [];
    for (const { mutationFn, variables } of mutations.current) {
      const result = await mutationFn(variables);
      results.push(result);
    }
    mutations.current = [];
    return results;
  }, []);

  const executeParallel = useCallback(async () => {
    const results = await Promise.all(
      mutations.current.map(({ mutationFn, variables }) => 
        mutationFn(variables)
      )
    );
    mutations.current = [];
    return results;
  }, []);

  const clear = useCallback(() => {
    mutations.current = [];
  }, []);

  return {
    add,
    executeSequential,
    executeParallel,
    clear,
    pending: mutations.current.length,
  };
}

// ============================================================================
// Retry with Backoff Hook
// ============================================================================

/**
 * Mutation with exponential backoff retry
 */
export function useRetryMutation<TData, TVariables>(options: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  maxRetries?: number;
  baseDelay?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number, error: Error) => void;
}) {
  const {
    mutationFn,
    maxRetries = 3,
    baseDelay = 1000,
    onSuccess,
    onError,
    onRetry,
  } = options;

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await mutationFn(variables);
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < maxRetries) {
            onRetry?.(attempt + 1, lastError);
            await new Promise(resolve => 
              setTimeout(resolve, baseDelay * Math.pow(2, attempt))
            );
          }
        }
      }
      
      throw lastError;
    },
    onSuccess,
    onError,
  });
}

// ============================================================================
// Debounced Query Hook
// ============================================================================

/**
 * Query that debounces the query key changes
 */
export function useDebouncedQuery<T>(options: {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  debounceMs?: number;
  enabled?: boolean;
  staleTime?: number;
}) {
  const { queryKey, queryFn, debounceMs = 300, enabled = true, staleTime } = options;
  const debouncedKey = useRef(queryKey);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      debouncedKey.current = queryKey;
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [queryKey, debounceMs]);

  return useQuery({
    queryKey: debouncedKey.current,
    queryFn,
    enabled,
    staleTime,
  });
}
