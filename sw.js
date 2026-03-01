const CACHE_NAME = 'spark-pwa-v22'; // Bumped for performance optimizations
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Critical JS chunks will be cached at runtime via Cache-First strategy

// Install: Caches the app shell. NO LONGER SKIPS WAITING.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(APP_SHELL);
      })
    // self.skipWaiting() is removed to allow for update prompts.
  );
});

// Activate: Cleans up old caches and takes control of the page.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message listener to handle 'SKIP_WAITING' from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


// Fetch: Handles requests with specific strategies.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 0. Ignore cross-origin requests - Let browser handle external resources
  // This prevents "Failed to fetch" errors for Google Fonts, APIs, Analytics, etc.
  if (url.origin !== self.location.origin) {
    // For cross-origin, just pass through to network without caching
    // Don't call respondWith - let the browser handle it naturally
    return;
  }

  // 1. Navigation: Network First, fall back to cache (index.html)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 2. Assets (Images, Fonts, JS, CSS): Cache First
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. API Calls: Network First (don't cache API by default, or handle specifically)
  // For this app, most data is local (IndexedDB), but if we had API calls:
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // 4. Default: Stale While Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      const fetchPromise = fetch(request).then(async (networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        if (!cachedResponse) throw err;
      });
      return cachedResponse || fetchPromise;
    })
  );
});

// --- PWA Features: Background Sync & Notifications ---

// Periodic Sync: Triggers roughly every 12 hours to re-engage the user.
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'feed-sync') {
    console.log('Periodic sync event fired for feed-sync');
    event.waitUntil(
      self.registration.showNotification('Spark בודק עדכונים', {
        body: 'פתח את האפליקציה כדי לסנכרן את התוכן האחרון שלך.',
        icon: '/images/resized-image.png',
        tag: 'feed-sync-notification',
        data: { action: 'go_feed' }
      })
    );
  }
});

// Push Notifications: Handles push messages from a server
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');

  // Parse push data with robust error handling
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
      console.log('[SW] Push payload parsed as JSON:', data);
    } catch (jsonError) {
      try {
        const textData = event.data.text();
        console.log('[SW] Push payload as text:', textData);
        data = { body: textData };
      } catch (textError) {
        console.warn('[SW] Could not parse push payload:', textError);
      }
    }
  } else {
    console.log('[SW] Push event received without data payload');
  }

  // Extract notification properties with sensible defaults
  const title = data.title || 'Spark';
  const body = data.body || 'יש לך עדכון חדש';
  const icon = data.icon || '/images/resized-image.png';
  const badge = data.badge || '/images/resized-image.png';
  const tag = data.tag || `spark-push-${Date.now()}`;
  const requireInteraction = data.requireInteraction ?? false;
  const silent = data.silent ?? false;
  const timestamp = data.timestamp ? new Date(data.timestamp).getTime() : Date.now();

  const notificationOptions = {
    body,
    icon,
    badge,
    tag,
    requireInteraction,
    silent,
    timestamp,
    vibrate: silent ? undefined : [200, 100, 200],
    data: {
      ...data.data,
      action: data.data?.action || 'go_today',
      url: data.url || data.data?.url || '/',
      receivedAt: new Date().toISOString()
    },
    actions: data.actions || []
  };

  if (data.image) {
    notificationOptions.image = data.image;
  }

  // CRITICAL: Always wrap showNotification in event.waitUntil()
  event.waitUntil(
    self.registration.showNotification(title, notificationOptions)
      .then(() => {
        console.log('[SW] Push notification displayed successfully:', tag);
      })
      .catch((error) => {
        console.error('[SW] Failed to display push notification:', error);
      })
  );
});

// Notification Click: Handles what happens when a user interacts with a notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag, 'Action:', event.action);
  event.notification.close();

  const action = event.notification.data?.action || 'go_today';
  const targetUrl = new URL(`/?action=${action}`, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's an open window for this origin.
      let client = clientList.find(c => c.url.startsWith(self.location.origin) && 'focus' in c);

      if (client) {
        // If a client is found, navigate it to the target URL and focus it.
        if (client.navigate) {
          client.navigate(targetUrl);
        }
        return client.focus();
      } else {
        // If no client is found, open a new one.
        return clients.openWindow(targetUrl);
      }
    })
  );
});