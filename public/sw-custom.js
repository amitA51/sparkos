// Import Workbox libraries from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Firebase Messaging for background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: 'AIzaSyDKhyJl15r0jIT2pb3cLcjoCbGdIPoH2Ok',
  authDomain: 'spark-antigravity.firebaseapp.com',
  projectId: 'spark-antigravity',
  storageBucket: 'spark-antigravity.firebasestorage.app',
  messagingSenderId: '997177904978',
  appId: '1:997177904978:web:8d3e8daef1273f5d97348b',
  measurementId: 'G-KRFNKBPQG2'
});

const firebaseMessaging = firebase.messaging();

// Handle FCM background messages (when app is closed or in background)
firebaseMessaging.onBackgroundMessage((payload) => {
  console.log('[SW] FCM Background message received:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'Spark';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'יש לך עדכון חדש',
    icon: '/images/spark192.png',
    badge: '/images/spark192.png',
    tag: payload.data?.tag || `fcm-${Date.now()}`,
    requireInteraction: payload.data?.requireInteraction === 'true',
    vibrate: [200, 100, 200],
    data: {
      ...payload.data,
      action: payload.data?.action || 'go_today',
      url: payload.fcmOptions?.link || payload.data?.url || '/',
      receivedAt: new Date().toISOString()
    }
  };

  // Add image if provided
  if (payload.notification?.image) {
    notificationOptions.image = payload.notification.image;
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

console.log('[SW] Firebase Messaging initialized in service worker');

const CACHE_VERSION = 'spark-v4';  // Bumped for Firebase Messaging integration
const NOTIFICATION_CACHE = 'spark-notifications';
const WIDGET_CACHE = 'spark-widget-data';

// Workbox manifest injection point - DO NOT MODIFY THIS LINE
// Workbox will replace self.__WB_MANIFEST with the actual precache manifest
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// -----------------------------------------------------------------------------
// Runtime Caching Configuration
// -----------------------------------------------------------------------------

// Cache Google Fonts Stylesheets
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache Google Fonts Webfonts
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Cache Images
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

const DB_NAME = 'SparkOS';
const DB_VERSION = 1;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('scheduledNotifications')) {
        const store = db.createObjectStore('scheduledNotifications', { keyPath: 'id' });
        store.createIndex('scheduledFor', 'scheduledFor', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('widgetData')) {
        db.createObjectStore('widgetData', { keyPath: 'type' });
      }
    };
  });
}

async function getScheduledNotifications() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['scheduledNotifications'], 'readonly');
    const store = transaction.objectStore('scheduledNotifications');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

async function updateNotificationStatus(id, status) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['scheduledNotifications'], 'readwrite');
    const store = transaction.objectStore('scheduledNotifications');
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const notification = getRequest.result;
      if (notification) {
        notification.status = status;
        notification.updatedAt = new Date().toISOString();
        const putRequest = store.put(notification);
        putRequest.onsuccess = () => resolve(true);
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve(false);
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function checkAndSendScheduledNotifications() {
  try {
    const notifications = await getScheduledNotifications();
    const now = new Date();

    const pendingNotifications = notifications.filter(n =>
      n.status === 'pending' &&
      new Date(n.scheduledFor) <= now
    );

    for (const notification of pendingNotifications) {
      try {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: '/images/spark192.png',
          badge: '/images/spark192.png',
          tag: notification.id,
          data: notification.data || {},
          actions: notification.actions || [],
          requireInteraction: notification.type === 'task_reminder',
          vibrate: [200, 100, 200],
          silent: false
        });

        await updateNotificationStatus(notification.id, 'sent');

        if (notification.repeatPattern === 'daily') {
          const nextTime = new Date(notification.scheduledFor);
          nextTime.setDate(nextTime.getDate() + 1);

          const db = await openDatabase();
          const transaction = db.transaction(['scheduledNotifications'], 'readwrite');
          const store = transaction.objectStore('scheduledNotifications');

          store.put({
            ...notification,
            id: `${notification.id}-${nextTime.getTime()}`,
            scheduledFor: nextTime.toISOString(),
            status: 'pending'
          });
        }
      } catch (error) {
        console.error('[SW] Failed to send notification:', notification.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Error checking scheduled notifications:', error);
  }
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkAndSendScheduledNotifications());
  }

  if (event.tag === 'update-widget-data') {
    event.waitUntil(updateWidgetData());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkAndSendScheduledNotifications());
  }
});

async function updateWidgetData() {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['widgetData'], 'readonly');
    const store = transaction.objectStore('widgetData');

    const todayData = await new Promise((resolve, reject) => {
      const request = store.get('today');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (todayData) {
      const cache = await caches.open(WIDGET_CACHE);
      await cache.put(
        '/widgets/today-data.json',
        new Response(JSON.stringify(todayData), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }
  } catch (error) {
    console.error('[SW] Error updating widget data:', error);
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const action = event.action;

  if (action === 'complete') {
    event.waitUntil(
      handleCompleteAction(data)
    );
  } else if (action === 'snooze') {
    event.waitUntil(
      handleSnoozeAction(data)
    );
  } else if (action === 'skip') {
    event.waitUntil(
      handleSkipAction(data)
    );
  } else {
    event.waitUntil(
      openApp(data.deepLink || '/')
    );
  }
});

async function handleCompleteAction(data) {
  if (data.itemId) {
    const allClients = await clients.matchAll({ type: 'window' });

    for (const client of allClients) {
      client.postMessage({
        type: 'COMPLETE_ITEM',
        itemId: data.itemId,
        itemType: data.actionType
      });
    }
  }

  await openApp('/?action=go_today');
}

async function handleSnoozeAction(data) {
  const snoozeMinutes = 60;
  const newTime = new Date(Date.now() + snoozeMinutes * 60 * 1000);

  if (data.itemId) {
    const db = await openDatabase();
    const transaction = db.transaction(['scheduledNotifications'], 'readwrite');
    const store = transaction.objectStore('scheduledNotifications');

    store.put({
      id: `snooze-${data.itemId}-${Date.now()}`,
      type: data.actionType || 'task_reminder',
      scheduledFor: newTime.toISOString(),
      title: data.title || 'תזכורת',
      body: `נדחה מ-${new Date().toLocaleTimeString('he-IL')}`,
      status: 'pending',
      data: data,
      actions: [
        { action: 'complete', title: 'סיימתי' },
        { action: 'snooze', title: 'דחה שעה' }
      ]
    });
  }
}

async function handleSkipAction(data) {
  console.log('[SW] Skipped:', data.itemId);
}

async function openApp(path) {
  const allClients = await clients.matchAll({ type: 'window' });

  for (const client of allClients) {
    if (client.url.includes(self.registration.scope) && 'focus' in client) {
      await client.focus();
      if (path !== '/') {
        client.postMessage({
          type: 'NAVIGATE',
          path: path
        });
      }
      return;
    }
  }

  if (clients.openWindow) {
    await clients.openWindow(path);
  }
}

self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');

  // Parse push data with robust error handling
  let data = {};

  if (event.data) {
    try {
      // Try JSON first
      data = event.data.json();
      console.log('[SW] Push payload parsed as JSON:', data);
    } catch (jsonError) {
      // Fallback to text if JSON parsing fails
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
  const icon = data.icon || '/images/spark192.png';
  const badge = data.badge || '/images/spark192.png';
  const tag = data.tag || `spark-push-${Date.now()}`;
  const requireInteraction = data.requireInteraction ?? false;
  const silent = data.silent ?? false;
  const timestamp = data.timestamp ? new Date(data.timestamp).getTime() : Date.now();

  // Build notification options
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
      url: data.url || data.data?.url || '/',
      receivedAt: new Date().toISOString()
    },
    actions: data.actions || []
  };

  // Add image if provided (for rich notifications)
  if (data.image) {
    notificationOptions.image = data.image;
  }

  // CRITICAL: Always wrap showNotification in event.waitUntil()
  // This prevents the browser from terminating the SW before the notification is shown
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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CHECK_NOTIFICATIONS') {
    event.waitUntil(checkAndSendScheduledNotifications());
  }

  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    event.waitUntil(scheduleNotification(event.data.notification));
  }
});

async function scheduleNotification(notification) {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['scheduledNotifications'], 'readwrite');
    const store = transaction.objectStore('scheduledNotifications');

    await new Promise((resolve, reject) => {
      const request = store.put({
        ...notification,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[SW] Notification scheduled:', notification.id);
  } catch (error) {
    console.error('[SW] Error scheduling notification:', error);
  }
}

self.addEventListener('install', (event) => {
  console.log('[SW] Custom service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Custom service worker activated');

  // Clean up old caches on activation
  const currentCaches = [
    CACHE_VERSION,
    NOTIFICATION_CACHE,
    WIDGET_CACHE,
    'google-fonts-stylesheets',
    'google-fonts-webfonts',
    'images',
    'workbox-precache-v2-https://spark-antigravity.web.app/',
  ];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete any cache that isn't in our current list
          if (!currentCaches.includes(cacheName) && !cacheName.includes('workbox')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});