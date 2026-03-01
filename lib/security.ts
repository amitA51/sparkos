/**
 * Advanced Security Utilities
 * 
 * Comprehensive security layer including:
 * - CSRF token management
 * - Rate limiting
 * - Request signing
 * - Secure storage
 * - Input validation
 * - Security headers
 */

// ============================================================================
// Types
// ============================================================================

export interface CSRFConfig {
  tokenName: string;
  headerName: string;
  cookieName: string;
  tokenLength: number;
  regenerateOnUse: boolean;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

// ============================================================================
// CSRF Token Management
// ============================================================================

const DEFAULT_CSRF_CONFIG: CSRFConfig = {
  tokenName: 'csrf_token',
  headerName: 'X-CSRF-Token',
  cookieName: 'spark_csrf',
  tokenLength: 32,
  regenerateOnUse: false,
};

let currentCSRFToken: string | null = null;

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(config: Partial<CSRFConfig> = {}): string {
  const { tokenLength } = { ...DEFAULT_CSRF_CONFIG, ...config };
  currentCSRFToken = generateSecureToken(tokenLength);
  
  // Store in sessionStorage for persistence across page reloads
  try {
    sessionStorage.setItem('spark_csrf_token', currentCSRFToken);
  } catch {
    // sessionStorage not available
  }
  
  return currentCSRFToken;
}

/**
 * Get current CSRF token (generate if not exists)
 */
export function getCSRFToken(config: Partial<CSRFConfig> = {}): string {
  if (currentCSRFToken) {
    return currentCSRFToken;
  }
  
  // Try to restore from sessionStorage
  try {
    const stored = sessionStorage.getItem('spark_csrf_token');
    if (stored) {
      currentCSRFToken = stored;
      return stored;
    }
  } catch {
    // sessionStorage not available
  }
  
  return generateCSRFToken(config);
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(
  token: string,
  config: Partial<CSRFConfig> = {}
): boolean {
  const { regenerateOnUse } = { ...DEFAULT_CSRF_CONFIG, ...config };
  const currentToken = getCSRFToken(config);
  
  // Constant-time comparison to prevent timing attacks
  const isValid = constantTimeCompare(token, currentToken);
  
  if (isValid && regenerateOnUse) {
    generateCSRFToken(config);
  }
  
  return isValid;
}

/**
 * Add CSRF token to fetch options
 */
export function withCSRFToken(
  options: RequestInit = {},
  config: Partial<CSRFConfig> = {}
): RequestInit {
  const { headerName } = { ...DEFAULT_CSRF_CONFIG, ...config };
  const token = getCSRFToken(config);
  
  const headers = new Headers(options.headers);
  headers.set(headerName, token);
  
  return {
    ...options,
    headers,
  };
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// ============================================================================
// Rate Limiting
// ============================================================================

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 5 * 60 * 1000, // 5 minutes
};

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { maxRequests, windowMs, blockDurationMs } = {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    ...config,
  };
  
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // Check if blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }
  
  // Start new window if expired or first request
  if (!entry || now - entry.windowStart >= windowMs) {
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now,
    });
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }
  
  // Increment count
  const newCount = entry.count + 1;
  
  if (newCount > maxRequests) {
    // Block the key
    rateLimitStore.set(key, {
      ...entry,
      blockedUntil: now + blockDurationMs,
    });
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: now + blockDurationMs,
      retryAfter: Math.ceil(blockDurationMs / 1000),
    };
  }
  
  // Update count
  rateLimitStore.set(key, {
    ...entry,
    count: newCount,
  });
  
  return {
    allowed: true,
    remaining: maxRequests - newCount,
    resetTime: entry.windowStart + windowMs,
  };
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clear all rate limit entries
 */
export function clearRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Create a rate-limited function
 */
export function createRateLimitedFn<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  key: string,
  config: Partial<RateLimitConfig> = {}
): (...args: Parameters<T>) => ReturnType<T> | null {
  return (...args: Parameters<T>) => {
    const result = checkRateLimit(key, config);
    
    if (!result.allowed) {
      console.warn(`[Security] Rate limit exceeded for ${key}. Retry after ${result.retryAfter}s`);
      return null;
    }
    
    return fn(...args);
  };
}

// ============================================================================
// Request Signing
// ============================================================================

/**
 * Sign a request payload
 */
export async function signPayload(
  payload: object,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const keyData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return Array.from(new Uint8Array(signature))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify a signed payload
 */
export async function verifySignature(
  payload: object,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = await signPayload(payload, secret);
  return constantTimeCompare(signature, expectedSignature);
}

// ============================================================================
// Secure Storage
// ============================================================================

const ENCRYPTION_ALGORITHM = 'AES-GCM';

/**
 * Generate an encryption key from a password
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with a password
 */
export async function encryptData(
  data: string,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(password, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    encoder.encode(data)
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data with a password
 */
export async function decryptData(
  encryptedData: string,
  password: string
): Promise<string> {
  const decoder = new TextDecoder();
  const combined = new Uint8Array(
    atob(encryptedData)
      .split('')
      .map(c => c.charCodeAt(0))
  );
  
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);
  
  const key = await deriveKey(password, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    data
  );
  
  return decoder.decode(decrypted);
}

/**
 * Secure storage wrapper
 */
export const secureStorage = {
  async set(key: string, value: unknown, password: string): Promise<void> {
    const encrypted = await encryptData(JSON.stringify(value), password);
    localStorage.setItem(`secure_${key}`, encrypted);
  },
  
  async get<T>(key: string, password: string): Promise<T | null> {
    const encrypted = localStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;
    
    try {
      const decrypted = await decryptData(encrypted, password);
      return JSON.parse(decrypted) as T;
    } catch {
      console.error('[Security] Failed to decrypt data');
      return null;
    }
  },
  
  remove(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  },
  
  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('secure_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },
};

// ============================================================================
// Input Validation
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
  score: number; // 0-4
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;
  
  // Length checks
  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');
  
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Use both uppercase and lowercase letters');
  
  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  else feedback.push('Add special characters');
  
  // Penalize common patterns
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }
  
  if (/^(123|abc|qwerty|password)/i.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid common patterns');
  }
  
  const levels: PasswordStrength['level'][] = ['weak', 'fair', 'good', 'strong', 'very_strong'];
  const clampedScore = Math.min(score, 4);
  
  return {
    score: clampedScore,
    level: levels[clampedScore] ?? 'weak',
    feedback,
  };
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate phone number (basic international format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
}

// ============================================================================
// Security Headers Check
// ============================================================================

export interface SecurityHeadersReport {
  score: number;
  headers: Record<string, { present: boolean; value?: string; recommendation?: string }>;
}

/**
 * Recommended security headers to check for
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': 'Prevents XSS attacks',
  'X-Content-Type-Options': 'Prevents MIME sniffing',
  'X-Frame-Options': 'Prevents clickjacking',
  'X-XSS-Protection': 'Legacy XSS protection',
  'Strict-Transport-Security': 'Forces HTTPS',
  'Referrer-Policy': 'Controls referrer information',
  'Permissions-Policy': 'Controls browser features',
};

// ============================================================================
// Content Security Policy Builder
// ============================================================================

export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'frame-src'?: string[];
  'object-src'?: string[];
  'base-uri'?: string[];
  'form-action'?: string[];
  'frame-ancestors'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
}

/**
 * Build a Content Security Policy string
 */
export function buildCSP(directives: CSPDirectives): string {
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(directives)) {
    if (value === true) {
      parts.push(key);
    } else if (Array.isArray(value) && value.length > 0) {
      parts.push(`${key} ${value.join(' ')}`);
    }
  }
  
  return parts.join('; ');
}

/**
 * Default strict CSP for Spark app
 */
export const DEFAULT_CSP: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'", 'https://api.openai.com', 'https://*.firebase.io'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': true,
};

// ============================================================================
// Request Fingerprinting (for anomaly detection)
// ============================================================================

export interface RequestFingerprint {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
}

/**
 * Generate a fingerprint for the current browser
 */
export function generateFingerprint(): RequestFingerprint {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1',
  };
}

/**
 * Hash a fingerprint for comparison
 */
export async function hashFingerprint(fingerprint: RequestFingerprint): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(fingerprint));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// Session Management
// ============================================================================

export interface SessionConfig {
  maxAge: number; // milliseconds
  renewThreshold: number; // milliseconds before expiry to renew
  storageKey: string;
}

const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  renewThreshold: 60 * 60 * 1000, // 1 hour
  storageKey: 'spark_session',
};

interface SessionData {
  id: string;
  createdAt: number;
  expiresAt: number;
  fingerprintHash?: string;
  data: Record<string, unknown>;
}

/**
 * Create a new session
 */
export async function createSession(
  config: Partial<SessionConfig> = {}
): Promise<SessionData> {
  const { maxAge, storageKey } = { ...DEFAULT_SESSION_CONFIG, ...config };
  const now = Date.now();
  
  const fingerprint = generateFingerprint();
  const fingerprintHash = await hashFingerprint(fingerprint);
  
  const session: SessionData = {
    id: generateSecureToken(16),
    createdAt: now,
    expiresAt: now + maxAge,
    fingerprintHash,
    data: {},
  };
  
  sessionStorage.setItem(storageKey, JSON.stringify(session));
  return session;
}

/**
 * Get current session
 */
export function getSession(
  config: Partial<SessionConfig> = {}
): SessionData | null {
  const { storageKey } = { ...DEFAULT_SESSION_CONFIG, ...config };
  
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return null;
    
    const session: SessionData = JSON.parse(stored);
    
    // Check expiry
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(storageKey);
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Renew session if near expiry
 */
export function renewSessionIfNeeded(
  config: Partial<SessionConfig> = {}
): SessionData | null {
  const { maxAge, renewThreshold, storageKey } = { ...DEFAULT_SESSION_CONFIG, ...config };
  const session = getSession(config);
  
  if (!session) return null;
  
  const now = Date.now();
  const timeUntilExpiry = session.expiresAt - now;
  
  if (timeUntilExpiry <= renewThreshold) {
    session.expiresAt = now + maxAge;
    sessionStorage.setItem(storageKey, JSON.stringify(session));
  }
  
  return session;
}

/**
 * Destroy current session
 */
export function destroySession(config: Partial<SessionConfig> = {}): void {
  const { storageKey } = { ...DEFAULT_SESSION_CONFIG, ...config };
  sessionStorage.removeItem(storageKey);
}

// ============================================================================
// Audit Logging
// ============================================================================

export interface AuditEvent {
  timestamp: number;
  eventType: string;
  userId?: string;
  action: string;
  resource?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

const auditLog: AuditEvent[] = [];
const MAX_AUDIT_LOG_SIZE = 1000;

/**
 * Log a security audit event
 */
export function logAuditEvent(event: Omit<AuditEvent, 'timestamp'>): void {
  const auditEvent: AuditEvent = {
    ...event,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
  };
  
  auditLog.push(auditEvent);
  
  // Trim log if too large
  if (auditLog.length > MAX_AUDIT_LOG_SIZE) {
    auditLog.shift();
  }
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // TODO: Send to analytics/monitoring service
    console.log('[Audit]', auditEvent);
  }
}

/**
 * Get recent audit events
 */
export function getAuditLog(limit = 100): AuditEvent[] {
  return auditLog.slice(-limit);
}

/**
 * Clear audit log
 */
export function clearAuditLog(): void {
  auditLog.length = 0;
}
