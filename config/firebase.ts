import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAnalytics, type Analytics } from 'firebase/analytics';

/**
 * Firebase Configuration
 * All sensitive credentials are loaded from environment variables.
 * See .env.example for required variables.
 */
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Load configuration from environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Validate required configuration at startup
const validateConfig = (): void => {
  const requiredKeys: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.error(
      `Missing required Firebase configuration: ${missingKeys.join(', ')}. ` +
      'Please check your environment variables.'
    );
  }
};

// Validate config on module load
validateConfig();

// Initialize Firebase with proper typing and error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  app = initializeApp(firebaseConfig);

  // Use standard getAuth - Firebase will handle persistence automatically
  auth = getAuth(app);

  // Initialize Firestore with persistent cache (replaces deprecated enableIndexedDbPersistence)
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });

  // Analytics might fail in some environments (localhost, ad blockers)
  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn('Firebase Analytics failed to initialize:', analyticsError);
    analytics = null;
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.warn('App will run in offline mode. Cloud sync features disabled.');
}

// Initialize Firebase Storage
import { getStorage, type FirebaseStorage } from 'firebase/storage';

let storage: FirebaseStorage | null = null;
try {
  if (app) {
    storage = getStorage(app);
  }
} catch (storageError) {
  console.warn('Firebase Storage failed to initialize:', storageError);
  storage = null;
}

// Type-safe exports with null checks for consumers
export { auth, db, analytics, storage };
export default app;

// Helper to check if Firebase is properly initialized
export const isFirebaseInitialized = (): boolean => {
  return app !== null && auth !== null && db !== null;
};

/**
 * Get Auth instance with null safety check.
 * Throws if Firebase is not initialized.
 */
export const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Check your environment configuration.');
  }
  return auth;
};

/**
 * Get Firestore instance with null safety check.
 * Throws if Firebase is not initialized.
 */
export const getDbInstance = (): Firestore => {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Check your environment configuration.');
  }
  return db;
};

/**
 * Get Storage instance with null safety check.
 * Throws if Firebase is not initialized.
 */
export const getStorageInstance = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Check your environment configuration.');
  }
  return storage;
};
// Initialize Messaging (FCM)
import { getMessaging, type Messaging } from 'firebase/messaging';

let messaging: Messaging | null = null;

try {
  if (typeof window !== 'undefined' && app) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn('Firebase Messaging failed to initialize (might be unsupported in this environment):', error);
  messaging = null; // Fallback for environments without SW support (e.g., SSR or strict blocking)
}

export { messaging };
