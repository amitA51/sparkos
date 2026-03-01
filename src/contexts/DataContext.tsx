import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import type { FeedItem, PersonalItem, Space } from '../../types';
import * as dataService from '../../services/dataService';
import { syncService } from '../../services/syncService';
import { cloudSyncService } from '../../services/cloudSyncService';
import { googleSyncService } from '../../services/googleSyncService';

export interface DataContextValue {
  feedItems: FeedItem[];
  personalItems: PersonalItem[];
  spaces: Space[];
  isLoading: boolean;
  isStale: boolean;
  error: string | null;

  // Lazy loading
  loadDataType: (type: string) => Promise<void>;
  isDataTypeLoaded: (type: string) => boolean;

  refreshAll: () => Promise<void>;

  updateFeedItem: (id: string, updates: Partial<FeedItem>) => Promise<FeedItem>;
  removeFeedItem: (id: string) => Promise<void>;

  addPersonalItem: (
    item: Omit<PersonalItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PersonalItem>;
  updatePersonalItem: (id: string, updates: Partial<PersonalItem>) => Promise<PersonalItem>;
  removePersonalItem: (id: string) => Promise<void>;

  addSpace: (space: Omit<Space, 'id'>) => Promise<Space>;
  updateSpace: (id: string, updates: Partial<Space>) => Promise<Space>;
  removeSpace: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export interface DataProviderProps {
  children: ReactNode;
}

const triggerAutoSave = () => {
  try {
    syncService.triggerAutoSave();
  } catch (error) {
    console.error('Failed to trigger auto-save:', error);
  }
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [personalItems, setPersonalItems] = useState<PersonalItem[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true, will be set false after initial load
  const [isStale, setIsStale] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track which data types have been loaded
  const loadedTypesRef = useRef<Set<string>>(new Set());
  const loadingTypesRef = useRef<Set<string>>(new Set());

  // Generation counter to handle React StrictMode - ignore stale async operations
  const mountGenerationRef = useRef(0);

  // Track mounted state to prevent state updates after unmount
  const mountedRef = useRef(true);

  // Reset state on mount and cleanup on unmount (handles React StrictMode)
  useEffect(() => {
    // Increment generation on each mount - stale async ops will be ignored
    mountGenerationRef.current++;
    mountedRef.current = true;
    loadedTypesRef.current.clear();
    loadingTypesRef.current.clear();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Check if a data type is loaded
  const isDataTypeLoaded = useCallback((type: string): boolean => {
    return loadedTypesRef.current.has(type);
  }, []);

  // Load a specific data type on demand
  const loadDataType = useCallback(async (type: string): Promise<void> => {
    // Skip if already loaded or currently loading
    if (loadedTypesRef.current.has(type) || loadingTypesRef.current.has(type)) {
      return;
    }

    // Capture current generation to detect stale operations
    const loadGeneration = mountGenerationRef.current;

    loadingTypesRef.current.add(type);

    setIsLoading(true);

    try {
      switch (type) {
        case 'feedItems': {
          const feed = await dataService.getFeedItems();
          // Check if this load is still valid (same generation)
          if (mountedRef.current && mountGenerationRef.current === loadGeneration) {
            setFeedItems(feed);
          }
          break;
        }

        case 'personalItems': {
          const personal = await dataService.getPersonalItems();
          if (mountedRef.current && mountGenerationRef.current === loadGeneration) {
            setPersonalItems(personal);
          }
          break;
        }

        case 'spaces': {
          const spaceList = await dataService.getSpaces();
          if (mountedRef.current && mountGenerationRef.current === loadGeneration) {
            setSpaces(spaceList);
          }
          break;
        }
      }

      // Only mark as loaded if still valid generation
      if (mountGenerationRef.current === loadGeneration) {
        loadedTypesRef.current.add(type);

        // Initialize sync service after first data load
        if (loadedTypesRef.current.size === 1) {
          syncService.init();
        }
      }
    } catch (err) {
      console.error(`Failed to load ${type}:`, err);
      if (mountedRef.current && mountGenerationRef.current === loadGeneration) {
        setError(`Failed to load ${type}`);
      }
    } finally {
      // Only update loading state if still valid generation
      if (mountGenerationRef.current === loadGeneration) {
        loadingTypesRef.current.delete(type);

        // Set loading to false when no more types are loading
        if (mountedRef.current && loadingTypesRef.current.size === 0) {
          setIsLoading(false);
        }
      } else {
        // Generation mismatch - skip state update
      }
    }
  }, []);

  // CLOUD SYNC: Initialize centralized sync service
  useEffect(() => {
    cloudSyncService.initialize({
      onPersonalItemsUpdate: async items => {
        if (!mountedRef.current) return;

        // Update local DB and State
        await dataService.replacePersonalItemsFromCloud(items);
        setPersonalItems(items);
        loadedTypesRef.current.add('personalItems');
      },
      onBodyWeightUpdate: async entries => {
        await dataService.replaceBodyWeightFromCloud(entries);
      },
      onWorkoutSessionsUpdate: async sessions => {
        await dataService.replaceWorkoutSessionsFromCloud(sessions);
      },
      onWorkoutTemplatesUpdate: async templates => {
        await dataService.replaceWorkoutTemplatesFromCloud(templates);
      },
    });

    // ✅ PERF: Store cleanup function to prevent memory leaks
    const googleCleanup = googleSyncService.initGoogleSync();

    return () => {
      cloudSyncService.cleanup();
      googleCleanup?.(); // ✅ Clean up Google sync listener
    };
  }, []);

  // Load essential data for initial screen (personalItems for Today view)
  useEffect(() => {
    // Load personal items immediately for the default Today screen
    void loadDataType('personalItems');
  }, [loadDataType]);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [feed, personal, spaceList] = await Promise.all([
        dataService.getFeedItems(),
        dataService.getPersonalItems(),
        dataService.getSpaces(),
      ]);

      if (!mountedRef.current) return;

      setFeedItems(feed);
      setPersonalItems(personal);
      setSpaces(spaceList);

      loadedTypesRef.current.add('feedItems');
      loadedTypesRef.current.add('personalItems');
      loadedTypesRef.current.add('spaces');

      syncService.init();
    } catch (err) {
      console.error('Failed to load initial data:', err);
      if (mountedRef.current) {
        setError('Failed to load data');
        setIsStale(true); // Mark data as potentially stale after load failure
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshAll = useCallback(async () => {
    // Clear loaded types to force reload
    loadedTypesRef.current.clear();
    setIsStale(false); // Clear stale flag before reload attempt
    await loadAll();
  }, [loadAll]);

  const updateFeedItem = useCallback(
    async (id: string, updates: Partial<FeedItem>): Promise<FeedItem> => {
      // 🎯 OPTIMISTIC: Store original for rollback using setState callback
      let originalItem: FeedItem | undefined;

      setFeedItems(prev => {
        originalItem = prev.find(item => item.id === id);
        if (!originalItem) return prev;
        return prev.map(item => (item.id === id ? { ...item, ...updates } : item));
      });

      try {
        const updated = await dataService.updateFeedItem(id, updates);
        setFeedItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
        triggerAutoSave();
        return updated;
      } catch (error) {
        // 🎯 ROLLBACK: Restore original on failure
        if (originalItem) {
          setFeedItems(prev => prev.map(item => (item.id === id ? originalItem! : item)));
        }
        console.error('Failed to update feed item, rolled back:', error);
        throw error;
      }
    },
    [] // ✅ PERF: No dependencies - uses setState callback pattern
  );

  const removeFeedItem = useCallback(async (id: string): Promise<void> => {
    // 🎯 OPTIMISTIC: Store original for rollback using setState callback
    let originalItem: FeedItem | undefined;
    let originalIndex = -1;

    setFeedItems(prev => {
      originalIndex = prev.findIndex(item => item.id === id);
      originalItem = prev[originalIndex];
      return prev.filter(item => item.id !== id);
    });

    try {
      await dataService.removeFeedItem(id);
      triggerAutoSave();
    } catch (error) {
      // 🎯 ROLLBACK: Restore item at original position on failure
      if (originalItem && originalIndex !== -1) {
        setFeedItems(prev => [
          ...prev.slice(0, originalIndex),
          originalItem!,
          ...prev.slice(originalIndex),
        ]);
      }
      console.error('Failed to delete feed item, rolled back:', error);
      throw error;
    }
  }, []); // ✅ PERF: No dependencies - uses setState callback pattern

  const addPersonalItem = useCallback(
    async (
      itemData: Omit<PersonalItem, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<PersonalItem> => {
      // 🎯 OPTIMISTIC: Create temp item and add immediately
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const now = new Date().toISOString();
      const tempItem: PersonalItem = {
        ...itemData,
        id: tempId,
        createdAt: now,
        updatedAt: now,
      } as PersonalItem;

      setPersonalItems(prev => [tempItem, ...prev]);

      try {
        const newItem = await dataService.addPersonalItem(itemData);
        // Replace temp item with real item from server
        setPersonalItems(prev => prev.map(item => (item.id === tempId ? newItem : item)));
        triggerAutoSave();
        return newItem;
      } catch (error) {
        // 🎯 ROLLBACK: Remove temp item on failure
        setPersonalItems(prev => prev.filter(item => item.id !== tempId));
        console.error('Failed to add personal item, rolled back:', error);
        throw error;
      }
    },
    []
  );

  const updatePersonalItem = useCallback(
    async (id: string, updates: Partial<PersonalItem>): Promise<PersonalItem> => {
      // 🎯 OPTIMISTIC: Store original for rollback using setState callback
      let originalItem: PersonalItem | undefined;

      setPersonalItems(prev => {
        originalItem = prev.find(item => item.id === id);
        if (!originalItem) return prev;
        return prev.map(item =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
        );
      });

      try {
        // Server call in background
        const updated = await dataService.updatePersonalItem(id, updates);
        // Sync with actual server response (may have server-side changes)
        setPersonalItems(prev => prev.map(item => (item.id === id ? updated : item)));
        triggerAutoSave();
        return updated;
      } catch (error) {
        // 🎯 ROLLBACK: Restore original on failure
        if (originalItem) {
          setPersonalItems(prev => prev.map(item => (item.id === id ? originalItem! : item)));
        }
        console.error('Failed to update personal item, rolled back:', error);
        throw error; // Re-throw so callers can handle
      }
    },
    [] // ✅ PERF: No dependencies - uses setState callback pattern
  );

  const removePersonalItem = useCallback(async (id: string): Promise<void> => {
    // 🎯 OPTIMISTIC: Store original for rollback using setState callback
    let originalItem: PersonalItem | undefined;
    let originalIndex = -1;

    setPersonalItems(prev => {
      originalIndex = prev.findIndex(item => item.id === id);
      originalItem = prev[originalIndex];
      return prev.filter(item => item.id !== id);
    });

    try {
      await dataService.removePersonalItem(id);
      triggerAutoSave();
    } catch (error) {
      // 🎯 ROLLBACK: Restore item at original position on failure
      if (originalItem && originalIndex !== -1) {
        setPersonalItems(prev => [
          ...prev.slice(0, originalIndex),
          originalItem!,
          ...prev.slice(originalIndex),
        ]);
      }
      console.error('Failed to delete personal item, rolled back:', error);
      throw error;
    }
  }, []); // ✅ PERF: No dependencies - uses setState callback pattern

  const addSpace = useCallback(async (spaceData: Omit<Space, 'id'>): Promise<Space> => {
    const newSpace = await dataService.addSpace(spaceData);
    setSpaces(prev => [...prev, newSpace].sort((a, b) => a.order - b.order));
    triggerAutoSave();
    return newSpace;
  }, []);

  const updateSpace = useCallback(async (id: string, updates: Partial<Space>): Promise<Space> => {
    const updated = await dataService.updateSpace(id, updates);
    setSpaces(prev =>
      prev.map(space => (space.id === id ? updated : space)).sort((a, b) => a.order - b.order)
    );
    triggerAutoSave();
    return updated;
  }, []);

  const removeSpace = useCallback(async (id: string): Promise<void> => {
    // 🎯 OPTIMISTIC: Store original for rollback using setState callback
    let originalSpace: Space | undefined;

    setSpaces(prev => {
      originalSpace = prev.find(space => space.id === id);
      return prev.filter(space => space.id !== id);
    });

    try {
      await dataService.removeSpace(id);
      triggerAutoSave();
    } catch (error) {
      // 🎯 ROLLBACK: Restore space on failure (respecting order)
      if (originalSpace) {
        setSpaces(prev => [...prev, originalSpace!].sort((a, b) => a.order - b.order));
      }
      console.error('Failed to delete space, rolled back:', error);
      throw error;
    }
  }, []); // ✅ PERF: No dependencies - uses setState callback pattern

  const value = useMemo<DataContextValue>(
    () => ({
      feedItems,
      personalItems,
      spaces,
      isLoading,
      isStale,
      error,
      // These functions have stable refs via useCallback([]) - including them
      // in deps is unnecessary and would cause excessive re-renders
      loadDataType,
      isDataTypeLoaded,
      refreshAll,
      updateFeedItem,
      removeFeedItem,
      addPersonalItem,
      updatePersonalItem,
      removePersonalItem,
      addSpace,
      updateSpace,
      removeSpace,
    }),
    // PERF: Only include data deps - callbacks are stable refs and excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedItems, personalItems, spaces, isLoading, isStale, error]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
};
