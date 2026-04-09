import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

/**
 * Enhanced QueryClient with:
 * - Global error handling
 * - Optimistic update patterns
 * - Smart caching strategies
 * - Retry with exponential backoff
 */

// Error handler for global query errors
const handleQueryError = (error: unknown) => {
  // Log error for debugging
  console.error('[QueryClient] Query error:', error);
  
  // In production, send to error reporting service
  // Sentry.captureException(error);
};

// Error handler for global mutation errors
const handleMutationError = (error: unknown) => {
  console.error('[QueryClient] Mutation error:', error);
};

// Create a QueryClient instance with enhanced configuration
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 30 minutes (increased for better UX)
      gcTime: 30 * 60 * 1000,
      // Don't refetch on window focus by default (saves API calls)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect automatically
      refetchOnReconnect: 'always',
      // Retry failed requests with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        // Retry up to 2 times for network errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Network mode for offline support
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry mutations once on network errors
      retry: 1,
      retryDelay: 1000,
      networkMode: 'offlineFirst',
    },
  },
});

/**
 * Query key factory for type-safe query keys
 * Use this pattern for consistent query key management
 */
export const queryKeys = {
  // Personal items
  items: {
    all: ['items'] as const,
    lists: () => [...queryKeys.items.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.items.lists(), filters] as const,
    details: () => [...queryKeys.items.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.items.details(), id] as const,
  },
  // Feed items
  feed: {
    all: ['feed'] as const,
    lists: () => [...queryKeys.feed.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.feed.lists(), filters] as const,
  },
  // User data
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
  },
  // Habits
  habits: {
    all: ['habits'] as const,
    list: () => [...queryKeys.habits.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.habits.all, 'detail', id] as const,
    streaks: () => [...queryKeys.habits.all, 'streaks'] as const,
  },
  // Investments
  investments: {
    all: ['investments'] as const,
    portfolio: () => [...queryKeys.investments.all, 'portfolio'] as const,
    watchlist: () => [...queryKeys.investments.all, 'watchlist'] as const,
  },
  // AI/Assistant
  ai: {
    all: ['ai'] as const,
    chat: (sessionId: string) => [...queryKeys.ai.all, 'chat', sessionId] as const,
    summary: (itemId: string) => [...queryKeys.ai.all, 'summary', itemId] as const,
  },
} as const;

/**
 * Invalidation helpers for common patterns
 */
export const invalidateQueries = {
  allItems: () => queryClient.invalidateQueries({ queryKey: queryKeys.items.all }),
  allFeed: () => queryClient.invalidateQueries({ queryKey: queryKeys.feed.all }),
  allHabits: () => queryClient.invalidateQueries({ queryKey: queryKeys.habits.all }),
  user: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
};

/**
 * Prefetch helpers
 */
export const prefetchQueries = {
  // Prefetch commonly needed data on app load
  essentials: async () => {
    // Add prefetch calls here as needed
    // await queryClient.prefetchQuery({ queryKey: queryKeys.user.settings(), ... });
  },
};
