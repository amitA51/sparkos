/**
 * React Query Hooks for Data Access
 * 
 * Type-safe hooks that combine React Query with the existing DataContext.
 * Use these hooks for server state management with caching, refetching, and mutations.
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { queryKeys } from '../lib/queryClient';
import * as dataService from '../services/dataService';
import type { PersonalItem, FeedItem, Space } from '../types';

// ============================================================================
// Personal Items Hooks
// ============================================================================

interface UsePersonalItemsOptions {
  type?: PersonalItem['type'];
  spaceId?: string;
  isCompleted?: boolean;
  enabled?: boolean;
}

/**
 * Fetch and cache personal items with optional filtering
 */
export function usePersonalItems(options: UsePersonalItemsOptions = {}) {
  const { type, spaceId, isCompleted, enabled = true } = options;
  
  const filters = useMemo(() => ({ type, spaceId, isCompleted }), [type, spaceId, isCompleted]);

  return useQuery({
    queryKey: queryKeys.items.list(filters),
    queryFn: async () => {
      const items = await dataService.getPersonalItems();
      // Apply filters
      return items.filter((item: PersonalItem) => {
        if (type && item.type !== type) return false;
        if (spaceId && item.spaceId !== spaceId) return false;
        if (isCompleted !== undefined && item.isCompleted !== isCompleted) return false;
        return true;
      });
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single personal item by ID
 */
export function usePersonalItem(id: string | undefined, options?: Partial<UseQueryOptions<PersonalItem | null>>) {
  return useQuery({
    queryKey: queryKeys.items.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const items = await dataService.getPersonalItems();
      return items.find((item: PersonalItem) => item.id === id) ?? null;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Add a new personal item
 */
export function useAddPersonalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<PersonalItem, 'id' | 'createdAt' | 'updatedAt'>) => 
      dataService.addPersonalItem(item),
    onSuccess: () => {
      // Invalidate all item queries
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}

/**
 * Update a personal item
 */
export function useUpdatePersonalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PersonalItem> }) =>
      dataService.updatePersonalItem(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.items.detail(id) });

      // Snapshot the previous value
      const previousItem = queryClient.getQueryData<PersonalItem>(queryKeys.items.detail(id));

      // Optimistically update to the new value
      if (previousItem) {
        queryClient.setQueryData(queryKeys.items.detail(id), {
          ...previousItem,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousItem };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousItem) {
        queryClient.setQueryData(queryKeys.items.detail(id), context.previousItem);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}

/**
 * Delete a personal item
 */
export function useDeletePersonalItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dataService.removePersonalItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}

// ============================================================================
// Tasks Specific Hooks
// ============================================================================

/**
 * Get all tasks (convenience hook)
 */
export function useTasks(options?: { isCompleted?: boolean }) {
  return usePersonalItems({ type: 'task', ...options });
}

/**
 * Get overdue tasks
 */
export function useOverdueTasks() {
  const { data: tasks, ...rest } = useTasks({ isCompleted: false });
  
  const overdueTasks = useMemo(() => {
    if (!tasks) return [];
    const now = new Date();
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < now;
    });
  }, [tasks]);

  return { data: overdueTasks, ...rest };
}

/**
 * Toggle task completion
 */
export function useToggleTaskComplete() {
  const updateMutation = useUpdatePersonalItem();

  return useCallback(
    (task: PersonalItem) => {
      updateMutation.mutate({
        id: task.id,
        updates: { isCompleted: !task.isCompleted },
      });
    },
    [updateMutation]
  );
}

// ============================================================================
// Habits Hooks
// ============================================================================

/**
 * Get all habits
 */
export function useHabits() {
  return usePersonalItems({ type: 'habit' });
}

/**
 * Get habits with streak information
 */
export function useHabitsWithStreaks() {
  const { data: habits, ...rest } = useHabits();

  const habitsWithStreaks = useMemo(() => {
    if (!habits) return [];
    
    return habits.map(habit => {
      const completedDates = habit.completedDates || [];
      const currentStreak = calculateStreak(completedDates);
      
      return {
        ...habit,
        currentStreak,
        isCompletedToday: isCompletedToday(completedDates),
      };
    });
  }, [habits]);

  return { data: habitsWithStreaks, ...rest };
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const sorted = [...completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sorted.length; i++) {
    const dateStr = sorted[i];
    if (!dateStr) continue;
    
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (date.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (i === 0 && date.getTime() === today.getTime() - 86400000) {
      // Allow yesterday as the first day
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function isCompletedToday(completedDates: string[]): boolean {
  const today = new Date().toISOString().split('T')[0];
  if (!today) return false;
  return completedDates.some(date => date.startsWith(today));
}

// ============================================================================
// Feed Items Hooks
// ============================================================================

interface UseFeedItemsOptions {
  type?: FeedItem['type'];
  isRead?: boolean;
  enabled?: boolean;
}

/**
 * Fetch and cache feed items
 */
export function useFeedItems(options: UseFeedItemsOptions = {}) {
  const { type, isRead, enabled = true } = options;
  const filters = useMemo(() => ({ type, isRead }), [type, isRead]);

  return useQuery({
    queryKey: queryKeys.feed.list(filters),
    queryFn: async () => {
      const items = await dataService.getFeedItems();
      return items.filter((item: FeedItem) => {
        if (type && item.type !== type) return false;
        if (isRead !== undefined && item.is_read !== isRead) return false;
        return true;
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get unread feed count
 */
export function useUnreadFeedCount() {
  const { data: items } = useFeedItems({ isRead: false });
  return items?.length ?? 0;
}

// ============================================================================
// Spaces Hooks
// ============================================================================

/**
 * Get all spaces
 */
export function useSpaces() {
  return useQuery({
    queryKey: ['spaces', 'all'],
    queryFn: () => dataService.getSpaces(),
    staleTime: 10 * 60 * 1000, // 10 minutes - spaces change infrequently
  });
}

/**
 * Get a single space by ID
 */
export function useSpace(id: string | undefined) {
  const { data: spaces } = useSpaces();
  
  return useMemo(() => {
    if (!spaces || !id) return null;
    return spaces.find((space: Space) => space.id === id) ?? null;
  }, [spaces, id]);
}

/**
 * Add a new space
 */
export function useAddSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (space: Omit<Space, 'id'>) => dataService.addSpace(space),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
    },
  });
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Bulk update multiple items
 */
export function useBulkUpdateItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Array<{ id: string; updates: Partial<PersonalItem> }>) => {
      const promises = updates.map(({ id, updates: itemUpdates }) =>
        dataService.updatePersonalItem(id, itemUpdates)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}

/**
 * Bulk delete multiple items
 */
export function useBulkDeleteItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => dataService.removePersonalItem(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}
