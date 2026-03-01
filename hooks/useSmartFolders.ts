import { useMemo, useCallback } from 'react';
import type { PersonalItem, SmartFolder, SmartFolderFilter } from '../types';

/**
 * useSmartFolders - Hook for filtering items based on Smart Folder criteria
 * Provides functions to filter items and check if an item matches a folder's criteria
 */

/**
 * Check if a single filter matches an item
 */
function matchesFilter(item: PersonalItem, filter: SmartFolderFilter): boolean {
  const { field, operator, value } = filter;

  // Get the item's value for the field
  const itemValue = (item as any)[field];

  switch (operator) {
    case 'equals':
      if (Array.isArray(itemValue)) {
        return Array.isArray(value)
          ? value.every(v => itemValue.includes(v))
          : itemValue.includes(value);
      }
      return itemValue === value;

    case 'notEquals':
      if (Array.isArray(itemValue)) {
        return Array.isArray(value)
          ? !value.some(v => itemValue.includes(v))
          : !itemValue.includes(value);
      }
      return itemValue !== value;

    case 'contains':
      if (typeof itemValue === 'string' && typeof value === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      if (Array.isArray(itemValue) && typeof value === 'string') {
        return itemValue.some(
          v => typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())
        );
      }
      return false;

    case 'before':
      if (!itemValue) return false;
      return new Date(itemValue) < new Date(value as string);

    case 'after':
      if (!itemValue) return false;
      return new Date(itemValue) > new Date(value as string);

    case 'within': {
      // Value is number of days
      if (!itemValue) return false;
      const itemDate = new Date(itemValue);
      const now = new Date();
      const daysFromNow = (itemDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysFromNow >= 0 && daysFromNow <= (value as number);
    }

    case 'isEmpty':
      return (
        itemValue === undefined ||
        itemValue === null ||
        itemValue === '' ||
        (Array.isArray(itemValue) && itemValue.length === 0)
      );

    case 'isNotEmpty':
      return (
        itemValue !== undefined &&
        itemValue !== null &&
        itemValue !== '' &&
        (!Array.isArray(itemValue) || itemValue.length > 0)
      );

    default:
      return false;
  }
}

/**
 * Check if an item matches all or any of the folder's filters
 */
export function matchesSmartFolder(item: PersonalItem, folder: SmartFolder): boolean {
  if (folder.filters.length === 0) return false;

  if (folder.matchMode === 'all') {
    return folder.filters.every(filter => matchesFilter(item, filter));
  } else {
    return folder.filters.some(filter => matchesFilter(item, filter));
  }
}

/**
 * Filter items by a smart folder
 */
export function filterBySmartFolder(items: PersonalItem[], folder: SmartFolder): PersonalItem[] {
  return items.filter(item => matchesSmartFolder(item, folder));
}

/**
 * Hook for working with Smart Folders
 */
export function useSmartFolders(items: PersonalItem[], folders: SmartFolder[]) {
  // Get items for a specific folder
  const getItemsForFolder = useCallback(
    (folderId: string): PersonalItem[] => {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) return [];
      return filterBySmartFolder(items, folder);
    },
    [items, folders]
  );

  // Get item counts for all folders
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const folder of folders) {
      counts[folder.id] = filterBySmartFolder(items, folder).length;
    }
    return counts;
  }, [items, folders]);

  // Check if an item matches any smart folder
  const getMatchingFolders = useCallback(
    (item: PersonalItem): SmartFolder[] => {
      return folders.filter(folder => matchesSmartFolder(item, folder));
    },
    [folders]
  );

  return {
    getItemsForFolder,
    folderCounts,
    getMatchingFolders,
    matchesSmartFolder,
    filterBySmartFolder,
  };
}

export default useSmartFolders;
