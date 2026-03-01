// services/notificationsService.ts

/**
 * Checks if Notifications are supported by the browser.
 * @returns {boolean} True if supported, false otherwise.
 */
export const isSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Requests permission from the user to show notifications.
 * @returns {Promise<NotificationPermission>} The permission result ('granted', 'denied', or 'default').
 */
export const requestPermission = async (): Promise<NotificationPermission> => {
  if (!isSupported()) {
    console.warn('Notifications not supported in this browser.');
    return 'denied';
  }
  const permission = await window.Notification.requestPermission();
  return permission;
};

/**
 * A generic function to show a local notification via the Service Worker.
 * @param title The title of the notification.
 * @param options The standard NotificationOptions object.
 */
export const showNotification = (title: string, options: NotificationOptions): void => {
  if (!isSupported() || Notification.permission !== 'granted') {
    return;
  }
  navigator.serviceWorker.ready.then(registration => {
    registration.showNotification(title, {
      ...options,
      icon: '/images/spark192.png',
      badge: '/images/spark192.png',
    });
  });
};

/**
 * Shows a test notification to the user if permission has been granted.
 */
export const showTestNotification = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupported()) {
    return { success: false, message: 'הדפדפן אינו תומך בהתראות.' };
  }

  if (Notification.permission === 'granted') {
    showNotification('Spark - התראה לדוגמה', {
      body: 'ההתראות פועלות!',
      tag: 'spark-test-notification',
    });
    return { success: true, message: 'ההתראה נשלחה!' };
  } else if (Notification.permission === 'denied') {
    return { success: false, message: 'התראות נחסמו. יש לאפשר אותן בהגדרות הדפדפן.' };
  } else {
    const permission = await requestPermission();
    if (permission === 'granted') {
      showTestNotification();
      return { success: true, message: 'הרשאה התקבלה, שולח התראה...' };
    } else {
      return { success: false, message: 'הבקשה להיתר התראות נדחתה.' };
    }
  }
};

/**
 * Updates the app icon badge with a given count. Clears it if count is 0.
 * @param {number} count The number to display on the badge.
 */
export const updateAppBadge = (count: number): void => {
  if ('setAppBadge' in navigator && 'clearAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).catch((error: Error) => {
        console.error('Failed to set app badge:', error);
      });
    } else {
      navigator.clearAppBadge().catch((error: Error) => {
        console.error('Failed to clear app badge:', error);
      });
    }
  }
};

/**
 * Registers for periodic background sync to check for new feed items.
 */
export const registerPeriodicSync = async (): Promise<void> => {
  const registration = window.swRegistration;
  if (!registration || !registration.periodicSync) {
    console.warn('Periodic Background Sync is not supported.');
    return;
  }

  try {
    await registration.periodicSync.register('feed-sync', {
      minInterval: 12 * 60 * 60 * 1000, // 12 hours
    });
  } catch (error) {
    console.error('Periodic sync registration failed:', error);
  }
};

/**
 * Unregisters from periodic background sync.
 */
export const unregisterPeriodicSync = async (): Promise<void> => {
  const registration = window.swRegistration;
  if (!registration || !registration.periodicSync) {
    return;
  }
  try {
    await registration.periodicSync.unregister('feed-sync');
  } catch (error) {
    console.error('Periodic sync unregistration failed:', error);
  }
};

/**
 * Subscribes the user to push notifications.
 * @param vapidPublicKey The VAPID public key from the server.
 * @returns The PushSubscription object or null if failed.
 */
export const subscribeToPush = async (vapidPublicKey: string): Promise<PushSubscription | null> => {
  if (!isSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// --- FCM Integration ---

import { messaging } from '../config/firebase';
import { getToken } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// VAPID key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
const VAPID_KEY =
  'BEqqa1qXcZ72ulC3wzPOvacVxBolYhf63L-4uo36G9OPuo_VbZFt71JsUZj5-1YOPAjvniLMUiEnWGgdV8QDqVM';

/**
 * Requests the FCM token for the device.
 * Uses the main PWA service worker which now includes Firebase Messaging.
 * @param uid The user's ID to associate the token with.
 * @returns The token string or null if failed.
 */
export const requestFcmToken = async (uid: string): Promise<string | null> => {
  if (!messaging || !isSupported()) {
    console.warn('FCM is not supported or initialized.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied.');
      return null;
    }

    // Wait for the main PWA service worker to be ready
    // The main SW now includes Firebase Messaging initialization
    const swRegistration = await navigator.serviceWorker.ready;
    console.log('Using main PWA service worker for FCM');

    // Get the FCM token with VAPID key (required for web push)
    const token = await getToken(messaging, {
      serviceWorkerRegistration: swRegistration,
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('FCM Token obtained:', token.substring(0, 20) + '...');
      await saveTokenToDatabase(uid, token);
      return token;
    } else {
      console.warn('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

/**
 * Saves the FCM token to the user's document in Firestore.
 */
const saveTokenToDatabase = async (uid: string, token: string): Promise<void> => {
  if (!db) return;

  const tokenRef = doc(db, 'users', uid, 'fcm_tokens', token);

  try {
    await setDoc(tokenRef, {
      token,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      platform: 'web',
      userAgent: navigator.userAgent,
    });
    console.log('FCM token saved to Firestore');
  } catch (err) {
    console.error('Error saving FCM token to Firestore:', err);
  }
};
