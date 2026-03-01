"use strict";
/**
 * Financial Data API - Server-side proxy
 *
 * SECURITY: This function acts as a secure proxy for financial API calls.
 * API keys are stored in Firebase Functions environment variables, not in client code.
 *
 * Setup:
 * firebase functions:config:set alphavantage.keys="key1,key2,key3" freecrypto.key="your_key"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = exports.getCryptoData = exports.getStockQuote = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Rate limiting configuration
const RATE_LIMITS = {
    perUser: {
        perMinute: 10,
        perHour: 100,
        perDay: 500,
    },
};
/**
 * Check if user has exceeded rate limits
 */
async function checkRateLimit(userId) {
    const db = admin.firestore();
    const now = Date.now();
    const userRef = db.collection('rate_limits').doc(userId);
    const doc = await userRef.get();
    const data = doc.data();
    // Check minute limit
    if ((data === null || data === void 0 ? void 0 : data.minute) && data.minute.resetAt > now) {
        if (data.minute.count >= RATE_LIMITS.perUser.perMinute) {
            throw new functions.https.HttpsError('resource-exhausted', 'יותר מדי בקשות. נסה שוב בעוד דקה.');
        }
    }
    // Check hour limit
    if ((data === null || data === void 0 ? void 0 : data.hour) && data.hour.resetAt > now) {
        if (data.hour.count >= RATE_LIMITS.perUser.perHour) {
            throw new functions.https.HttpsError('resource-exhausted', 'חרגת ממגבלת הבקשות השעתית.');
        }
    }
    // Check day limit
    if ((data === null || data === void 0 ? void 0 : data.day) && data.day.resetAt > now) {
        if (data.day.count >= RATE_LIMITS.perUser.perDay) {
            throw new functions.https.HttpsError('resource-exhausted', 'חרגת ממגבלת הבקשות היומית. נסה שוב מחר.');
        }
    }
    // Update counters
    const updates = {};
    if (!(data === null || data === void 0 ? void 0 : data.minute) || data.minute.resetAt <= now) {
        updates.minute = { count: 1, resetAt: now + 60 * 1000 };
    }
    else {
        updates.minute = { count: data.minute.count + 1, resetAt: data.minute.resetAt };
    }
    if (!(data === null || data === void 0 ? void 0 : data.hour) || data.hour.resetAt <= now) {
        updates.hour = { count: 1, resetAt: now + 60 * 60 * 1000 };
    }
    else {
        updates.hour = { count: data.hour.count + 1, resetAt: data.hour.resetAt };
    }
    if (!(data === null || data === void 0 ? void 0 : data.day) || data.day.resetAt <= now) {
        updates.day = { count: 1, resetAt: now + 24 * 60 * 60 * 1000 };
    }
    else {
        updates.day = { count: data.day.count + 1, resetAt: data.day.resetAt };
    }
    await userRef.set(updates, { merge: true });
}
/**
 * Get stock quote from Alpha Vantage
 */
exports.getStockQuote = functions.https.onCall(async (data, context) => {
    var _a;
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'חובה להיות מחובר לשימוש בשירות זה.');
    }
    // Rate limiting
    await checkRateLimit(context.auth.uid);
    const { symbol } = data;
    if (!symbol || typeof symbol !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'סימול לא תקין.');
    }
    // Get API keys from environment
    const apiKeysStr = (_a = functions.config().alphavantage) === null || _a === void 0 ? void 0 : _a.keys;
    if (!apiKeysStr) {
        throw new functions.https.HttpsError('failed-precondition', 'שירות זמנית לא זמין.');
    }
    const apiKeys = apiKeysStr.split(',');
    const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        const result = await response.json();
        // Check for API errors
        if (result['Error Message']) {
            throw new functions.https.HttpsError('not-found', 'לא נמצאו נתונים עבור הסימול הזה.');
        }
        if (result['Note']) {
            throw new functions.https.HttpsError('resource-exhausted', 'חרגת ממגבלת הבקשות. נסה שוב מאוחר יותר.');
        }
        return result;
    }
    catch (error) {
        console.error('Error fetching stock quote:', error);
        throw new functions.https.HttpsError('internal', 'שגיאה בשרת. נסה שוב מאוחר יותר.');
    }
});
/**
 * Get crypto data from FreeCryptoAPI
 */
exports.getCryptoData = functions.https.onCall(async (data, context) => {
    var _a;
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'חובה להיות מחובר לשימוש בשירות זה.');
    }
    // Rate limiting
    await checkRateLimit(context.auth.uid);
    const { symbol } = data;
    if (!symbol || typeof symbol !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'סימול לא תקין.');
    }
    // Get API key from environment
    const apiKey = (_a = functions.config().freecrypto) === null || _a === void 0 ? void 0 : _a.key;
    if (!apiKey) {
        throw new functions.https.HttpsError('failed-precondition', 'שירות זמנית לא זמין.');
    }
    try {
        const url = `https://api.freecryptoapi.com/v1/getData?symbol=${symbol}&token=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error('Error fetching crypto data:', error);
        throw new functions.https.HttpsError('internal', 'שגיאה בשרת. נסה שוב מאוחר יותר.');
    }
});
/**
 * Get historical chart data
 */
exports.getChartData = functions.https.onCall(async (data, context) => {
    var _a, _b;
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'חובה להיות מחובר לשימוש בשירות זה.');
    }
    // Rate limiting
    await checkRateLimit(context.auth.uid);
    const { symbol, interval = 'daily', isCrypto = false } = data;
    if (!symbol || typeof symbol !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'סימול לא תקין.');
    }
    if (isCrypto) {
        // Use FreeCryptoAPI for crypto
        const apiKey = (_a = functions.config().freecrypto) === null || _a === void 0 ? void 0 : _a.key;
        if (!apiKey) {
            throw new functions.https.HttpsError('failed-precondition', 'שירות זמנית לא זמין.');
        }
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const url = `https://api.freecryptoapi.com/v1/getTimeframe?symbol=${symbol}-USDT&start_date=${startDate}&end_date=${endDate}&token=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error('Error fetching crypto chart:', error);
            throw new functions.https.HttpsError('internal', 'שגיאה בשרת. נסה שוב מאוחר יותר.');
        }
    }
    else {
        // Use Alpha Vantage for stocks
        const apiKeysStr = (_b = functions.config().alphavantage) === null || _b === void 0 ? void 0 : _b.keys;
        if (!apiKeysStr) {
            throw new functions.https.HttpsError('failed-precondition', 'שירות זמנית לא זמין.');
        }
        const apiKeys = apiKeysStr.split(',');
        const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
        const functionMap = {
            'intraday': 'TIME_SERIES_INTRADAY',
            'daily': 'TIME_SERIES_DAILY',
            'weekly': 'TIME_SERIES_WEEKLY',
            'monthly': 'TIME_SERIES_MONTHLY',
        };
        const func = functionMap[interval] || 'TIME_SERIES_DAILY';
        try {
            let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}`;
            if (interval === 'intraday') {
                url += '&interval=60min';
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            const result = await response.json();
            if (result['Error Message']) {
                throw new functions.https.HttpsError('not-found', 'לא נמצאו נתונים עבור הסימול הזה.');
            }
            if (result['Note']) {
                throw new functions.https.HttpsError('resource-exhausted', 'חרגת ממגבלת הבקשות. נסה שוב מאוחר יותר.');
            }
            return result;
        }
        catch (error) {
            console.error('Error fetching chart data:', error);
            throw new functions.https.HttpsError('internal', 'שגיאה בשרת. נסה שוב מאוחר יותר.');
        }
    }
});
//# sourceMappingURL=financialsApi.js.map