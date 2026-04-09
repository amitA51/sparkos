/**
 * useAndroidOptimizations Hook
 *
 * A single hook that applies all Android-specific runtime enhancements:
 * - Detects Android environment
 * - Sets theme-color meta tag dynamically based on current theme
 * - Registers for background sync
 * - Requests persistent storage
 * - Handles display-cutout (notch/punch-hole) via safe-area
 * - Listens for offline-queue replay messages from service worker
 *
 * Should be called once at the app root level (AppCore).
 */

import { useEffect, useRef } from 'react';

interface AndroidOptimizationsOptions {
  /** Current theme-color value to apply to status bar */
  themeColor?: string;
  /** Callback when an offline operation should be replayed */
  onReplayOfflineOperation?: (operation: unknown) => void;
}

/** Detect Android Chrome/WebView */
export const isAndroid = typeof navigator !== 'undefined' &&
  /Android/i.test(navigator.userAgent);

/** Detect if running as installed PWA (standalone mode) */
export const isStandalone = typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches ||
   (window.navigator as { standalone?: boolean }).standalone === true);

export function useAndroidOptimizations(options: AndroidOptimizationsOptions = {}) {
  const { themeColor, onReplayOfflineOperation } = options;
  const hasRegisteredSync = useRef(false);

  // 1. Dynamic theme-color meta tag for Android status bar
  useEffect(() => {
    if (!themeColor) return;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])') ||
      document.querySelector('meta[name="theme-color"]');

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [themeColor]);

  // 2. Register for background sync (one-time)
  useEffect(() => {
    if (hasRegisteredSync.current) return;
    hasRegisteredSync.current = true;

    (async () => {
      try {
        const registration = await navigator.serviceWorker?.ready;
        if (!registration) return;

        // Register periodic sync for feed updates (Android Chrome supports this)
        if ('periodicSync' in registration) {
          try {
            await (registration as unknown as { periodicSync: { register: (tag: string, opts: { minInterval: number }) => Promise<void> } })
              .periodicSync.register('feed-sync', {
                minInterval: 12 * 60 * 60 * 1000, // 12 hours
              });
          } catch {
            // Periodic sync requires site engagement score or permission
          }
        }

        // Request persistent storage so Android doesn't evict our cache
        if (navigator.storage?.persist) {
          const isPersisted = await navigator.storage.persisted();
          if (!isPersisted) {
            await navigator.storage.persist();
          }
        }
      } catch {
        // Non-critical: graceful degradation
      }
    })();
  }, []);

  // 3. Listen for offline queue replay messages from service worker
  useEffect(() => {
    if (!onReplayOfflineOperation) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REPLAY_OFFLINE_OPERATION') {
        onReplayOfflineOperation(event.data.operation);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [onReplayOfflineOperation]);

  // 4. Apply Android-specific CSS class for conditional styling
  useEffect(() => {
    if (isAndroid) {
      document.documentElement.classList.add('android');
    }
    if (isStandalone) {
      document.documentElement.classList.add('standalone');
    }
  }, []);

  return { isAndroid, isStandalone };
}

/**
 * Queue an operation for background sync when offline.
 * The service worker will replay these when connectivity is restored.
 */
export async function queueOfflineOperation(operation: {
  type: string;
  data: unknown;
  timestamp?: number;
}) {
  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('SparkOffline', 1);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('offlineQueue')) {
          db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const tx = db.transaction('offlineQueue', 'readwrite');
    const store = tx.objectStore('offlineQueue');
    store.add({
      ...operation,
      timestamp: operation.timestamp || Date.now(),
      status: 'pending',
    });

    // Request background sync
    const registration = await navigator.serviceWorker?.ready;
    if (registration && 'sync' in registration) {
      await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } })
        .sync.register('spark-offline-queue');
    }
  } catch {
    // If sync registration fails, the queue will be replayed on next app load
  }
}

export default useAndroidOptimizations;
