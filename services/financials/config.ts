/**
 * Financial Services - Configuration
 * 
 * API keys, endpoints, and cache configuration.
 * 
 * SECURITY: API keys have been moved to server-side (Firebase Functions)
 * This file now only contains public configuration.
 */

// ⚠️ SECURITY FIX: API keys removed from client-side code
// API keys are now stored securely in Firebase Functions environment variables
// See functions/src/financialsApi.ts for server-side implementation

// Placeholder exports for backward compatibility (empty/disabled)
// These services should use server-side API calls instead
export const ALPHA_VANTAGE_API_KEYS: string[] = [];
export const FREECRYPTOAPI_KEY = '';

export const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
export const FREECRYPTO_BASE_URL = 'https://api.freecryptoapi.com/v1';

// Cache configuration
export const CACHE_PREFIX = 'spark_finance_';

export const CACHE_DURATIONS = {
    quote: 5 * 60 * 1000,        // 5 minutes for quotes
    chart: 30 * 60 * 1000,       // 30 minutes for charts
    news: 15 * 60 * 1000,        // 15 minutes for news
    company: 24 * 60 * 60 * 1000, // 24 hours for company info
    topMovers: 10 * 60 * 1000,   // 10 minutes for top gainers/losers
};

// Rate limiting per API key (Alpha Vantage free: 25/day, 5/minute)
export const RATE_LIMIT_PER_KEY = {
    requestsPerMinute: 5,
    requestsPerDay: 25,
    minDelayMs: 12000, // 12 seconds between requests
};

// Hebrew error messages
export const ERROR_MESSAGES = {
    RATE_LIMIT: 'חרגת ממגבלת הבקשות היומית. נסה שוב מחר.',
    RATE_LIMIT_MINUTE: 'יותר מדי בקשות. נסה שוב בעוד דקה.',
    NETWORK_ERROR: 'שגיאת רשת. בדוק את החיבור לאינטרנט.',
    NO_DATA: 'לא נמצאו נתונים עבור הסימול הזה.',
    API_ERROR: 'שגיאה בשרת. נסה שוב מאוחר יותר.',
    INVALID_SYMBOL: 'סימול לא תקין.',
    UNAUTHORIZED: 'שגיאת אימות. אנא התחבר מחדש.',
};

// Common crypto tickers for identification
export const COMMON_CRYPTOS: Record<string, string> = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    SOL: 'Solana',
    XRP: 'XRP',
    DOGE: 'Dogecoin',
    ADA: 'Cardano',
    AVAX: 'Avalanche',
    MATIC: 'Polygon',
    LINK: 'Chainlink',
    UNI: 'Uniswap',
    LTC: 'Litecoin',
    ATOM: 'Cosmos',
    ETC: 'Ethereum Classic',
    SHIB: 'Shiba Inu',
    APT: 'Aptos',
    ARB: 'Arbitrum',
    OP: 'Optimism',
    NEAR: 'NEAR Protocol',
};
