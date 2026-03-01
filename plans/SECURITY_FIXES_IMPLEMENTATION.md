# מדריך יישום תיקוני אבטחה - SparkOS
## Security Fixes Implementation Guide

תיעוד זה מפרט את כל השלבים הנדרשים ליישום תיקוני האבטחה שזוהו בביקורת.

---

## ✅ תיקונים שבוצעו

### 1. הסרת API Keys מהקוד
- ✅ עודכן [`services/financials/config.ts`](../services/financials/config.ts) - הוסרו כל ה-API keys
- ✅ נוצר [`functions/src/financialsApi.ts`](../functions/src/financialsApi.ts) - Firebase Functions למשיכת נתונים פיננסיים

---

## 🔧 תיקונים שנדרשים (Manual Steps)

### תיקון #1: השלמת העברת API Keys לשרת

#### שלב 1: עדכון functions/src/index.ts
הוסף את השורות הבאות אחרי שורה 12:

```typescript
// Re-export Financial API functions (secure proxy)
export { getStockQuote, getCryptoData, getChartData } from './financialsApi';
```

#### שלב 2: הגדרת Environment Variables ב-Firebase
רץ את הפקודות הבאות בטרמינל:

```bash
# הגדר את מפתחות Alpha Vantage (החלף במפתחות שלך)
firebase functions:config:set alphavantage.keys="key1,key2,key3,key4,key5,key6,key7"

# הגדר את מפתח FreeCrypto (החלף במפתח שלך)
firebase functions:config:set freecrypto.key="your_freecrypto_key"

# בדוק שההגדרות נשמרו
firebase functions:config:get
```

#### שלב 3: עדכון Client-side Code
צור קובץ חדש: `services/financials/secureApiClient.ts`

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuthInstance } from '../../config/firebase';

const functions = getFunctions();

export interface StockQuoteRequest {
    symbol: string;
}

export interface CryptoDataRequest {
    symbol: string;
}

export interface ChartDataRequest {
    symbol: string;
    interval?: 'intraday' | 'daily' | 'weekly' | 'monthly';
    isCrypto?: boolean;
}

/**
 * Get stock quote securely through Firebase Functions
 */
export const getStockQuote = async (symbol: string) => {
    const auth = getAuthInstance();
    if (!auth.currentUser) {
        throw new Error('חובה להיות מחובר');
    }
    
    const callable = httpsCallable<StockQuoteRequest, any>(functions, 'getStockQuote');
    const result = await callable({ symbol });
    return result.data;
};

/**
 * Get crypto data securely through Firebase Functions
 */
export const getCryptoData = async (symbol: string) => {
    const auth = getAuthInstance();
    if (!auth.currentUser) {
        throw new Error('חובה להיות מחובר');
    }
    
    const callable = httpsCallable<CryptoDataRequest, any>(functions, 'getCryptoData');
    const result = await callable({ symbol });
    return result.data;
};

/**
 * Get chart data securely through Firebase Functions
 */
export const getChartData = async (
    symbol: string,
    interval: 'intraday' | 'daily' | 'weekly' | 'monthly' = 'daily',
    isCrypto: boolean = false
) => {
    const auth = getAuthInstance();
    if (!auth.currentUser) {
        throw new Error('חובה להיות מחובר');
    }
    
    const callable = httpsCallable<ChartDataRequest, any>(functions, 'getChartData');
    const result = await callable({ symbol, interval, isCrypto });
    return result.data;
};
```

#### שלב 4: עדכן את services/financialsService.ts
החלף את כל הקריאות הישירות ל-API בקריאות לפונקציות החדשות:

```typescript
// ❌ הסר את זה
import { ALPHA_VANTAGE_API_KEYS, FREECRYPTOAPI_KEY } from './financials/config';

// ✅ הוסף את זה
import { getStockQuote, getCryptoData, getChartData } from './financials/secureApiClient';
```

#### שלב 5: Deploy Functions
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

### תיקון #2: Firebase Security Rules (קריטי!)

עדכן את `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function hasRecentWrite() {
      return !('lastWrite' in resource.data) || 
             request.time > resource.data.lastWrite + duration.value(1, 's');
    }
    
    // User documents
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId) && hasRecentWrite();
      
      // Personal Items
      match /personalItems/{itemId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Workout Sessions
      match /workoutSessions/{sessionId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Workout Templates
      match /workoutTemplates/{templateId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Body Weight
      match /bodyWeight/{entryId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Spaces
      match /spaces/{spaceId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Tags
      match /tags/{tagId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Quotes
      match /quotes/{quoteId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Feed Items
      match /feedItems/{itemId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Templates
      match /templates/{templateId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Watchlist
      match /watchlist/{itemId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Personal Exercises
      match /personalExercises/{exerciseId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // RSS Feeds
      match /rssFeeds/{feedId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // Custom Mentors
      match /customMentors/{mentorId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && hasRecentWrite();
        allow update, delete: if isOwner(userId);
      }
      
      // FCM Tokens
      match /fcm_tokens/{tokenId} {
        allow read, write: if isOwner(userId);
      }
      
      // Data subcollection
      match /data/{docId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId) && hasRecentWrite();
      }
    }
    
    // Rate Limits (only functions can write)
    match /rate_limits/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // Audit Logs (only functions can write)
    match /audit_logs/{logId} {
      allow read: if false; // Only admins (implement custom claims)
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

Deploy:
```bash
firebase deploy --only firestore:rules
```

---

### תיקון #3: הסרת Google Token מ-localStorage

עדכן `services/authService.ts`:

```typescript
// ❌ הסר את הפונקציה הזו לגמרי
const handleGoogleAuthResult = (result: import('firebase/auth').UserCredential): User => {
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;

  if (accessToken) {
    try {
      localStorage.setItem('google_access_token', accessToken);
      localStorage.setItem('google_access_token_expiry', String(Date.now() + 3600000));
    } catch (storageError) {
      console.warn('Could not store Google access token:', storageError);
    }
  }

  return result.user;
};

// ✅ החלף בזה
const handleGoogleAuthResult = (result: import('firebase/auth').UserCredential): User => {
  // Firebase Auth מנהל את ה-tokens באופן מאובטח
  // אין צורך לשמור אותם ב-localStorage
  return result.user;
};

// ❌ הסר את כל הפונקציות האלה
export const getGoogleAccessToken = (): string | null => { ... };
export const getGoogleAccessTokenWithReason = (): GoogleTokenResult => { ... };
export const hasGoogleApiAccess = (): boolean => { ... };
export const clearGoogleAccessToken = (): void => { ... };

// ✅ החלף בפונקציה חדשה שמשתמשת ב-Firebase Auth
export const getGoogleAccessToken = async (): Promise<string | null> => {
  try {
    const auth = getAuthInstance();
    const user = auth.currentUser;
    
    if (!user) return null;
    
    // Firebase Auth מחזיר token תקף אוטומטית
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};
```

---

### תיקון #4: הוספת DOMPurify Sanitization

#### שלב 1: התקן DOMPurify
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

#### שלב 2: צור Utility Function
צור קובץ `utils/sanitize.ts`:

```typescript
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHTML = (dirty: string, options?: {
  allowedTags?: string[];
  allowedAttributes?: string[];
}): string => {
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: options?.allowedTags || [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: options?.allowedAttributes || ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };
  
  return DOMPurify.sanitize(dirty, config);
};

/**
 * Sanitize plain text (remove all HTML)
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};

/**
 * Sanitize URL
 */
export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
};
```

#### שלב 3: עדכן כל מקום שמשתמש ב-dangerouslySetInnerHTML

חפש בקוד:
```bash
grep -r "dangerouslySetInnerHTML" components/
```

עדכן כל מופע:
```typescript
// ❌ לפני
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ אחרי
import { sanitizeHTML } from '../utils/sanitize';

<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userContent) }} />
```

---

### תיקון #5: הוספת CSP Headers

עדכן `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/*"
  [headers.values]
    # Content Security Policy
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com;
      style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' data: https://api.fontshare.com https://fonts.gstatic.com;
      connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net wss://*.firebaseio.com;
      frame-src 'self' https://accounts.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    """
    
    # Security Headers
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=(), payment=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    
    # CORS (if needed)
    Access-Control-Allow-Origin = "https://yourdomain.com"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

---

### תיקון #6: הסרת Debug Logs רגישים

עדכן `services/ai/geminiClient.ts`:

```typescript
// ❌ הסר את זה
if (import.meta.env.DEV) {
    console.log('[GeminiService] API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('[GeminiService] All env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
}

// ✅ החלף בזה
if (import.meta.env.DEV) {
    console.log('[GeminiService] API Key:', API_KEY ? 'Configured ✓' : 'Missing ✗');
}
```

חפש ותקן logs נוספים:
```bash
grep -r "console.log.*API" services/
grep -r "console.log.*KEY" services/
grep -r "console.log.*TOKEN" services/
```

---

### תיקון #7: עדכון firestoreService.ts

עדכן את כל הפונקציות להסיר את פרמטר ה-userId ולהשתמש ב-currentUser:

```typescript
// ❌ לפני
export const syncPersonalItem = async (userId: string, item: PersonalItem) => {
  try {
    const docRef = doc(getPersonalItemsRef(userId), item.id);
    await setDoc(docRef, { ...item, updatedAt: Timestamp.now() }, { merge: true });
  } catch (error) {
    console.error('Error syncing personal item:', error);
    throw error;
  }
};

// ✅ אחרי
export const syncPersonalItem = async (item: PersonalItem) => {
  try {
    const auth = getAuthInstance();
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const docRef = doc(getPersonalItemsRef(userId), item.id);
    await setDoc(docRef, { ...item, updatedAt: Timestamp.now() }, { merge: true });
  } catch (error) {
    console.error('Error syncing personal item:', error);
    throw error;
  }
};
```

עשה זאת לכל הפונקציות ב-firestoreService.ts.

---

## 📋 Checklist לפני Production

- [ ] כל ה-API keys הוסרו מהקוד
- [ ] Firebase Functions deployed ועובדות
- [ ] Firebase Security Rules deployed ונבדקו
- [ ] Google tokens לא נשמרים ב-localStorage
- [ ] DOMPurify מותקן ומשמש בכל מקום
- [ ] CSP Headers מוגדרים ב-netlify.toml
- [ ] Debug logs רגישים הוסרו
- [ ] firestoreService.ts עודכן לא לקבל userId
- [ ] בדיקות אבטחה ידניות בוצעו
- [ ] Penetration testing בוצע

---

## 🧪 בדיקות אבטחה

### בדיקה 1: IDOR
```javascript
// נסה לגשת לנתונים של משתמש אחר
// צריך להיכשל עם Permission Denied
const otherUserId = 'some-other-user-id';
await getDoc(doc(db, `users/${otherUserId}/personalItems/test`));
// Expected: FirebaseError: Missing or insufficient permissions
```

### בדיקה 2: XSS
```javascript
// נסה להזריק script
const maliciousContent = '<script>alert("XSS")</script>';
const sanitized = sanitizeHTML(maliciousContent);
console.log(sanitized); // Should be empty or safe
```

### בדיקה 3: Rate Limiting
```javascript
// נסה לבצע יותר מדי בקשות
for (let i = 0; i < 20; i++) {
  await getStockQuote('AAPL');
}
// Expected: Error after 10 requests
```

---

## 📞 תמיכה

אם נתקלת בבעיות:
1. בדוק את Firebase Console → Functions → Logs
2. בדוק את Firestore Rules → Rules Playground
3. בדוק את Browser Console לשגיאות CSP
4. הרץ `firebase deploy --only functions,firestore:rules`

---

**עדכון אחרון:** 21 דצמבר 2025
