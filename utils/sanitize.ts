/**
 * Security Utilities - HTML Sanitization
 *
 * SECURITY FIX: Prevent XSS attacks by sanitizing all user-generated content
 * before rendering it in the DOM.
 *
 * Usage:
 * import { sanitizeHTML } from './utils/sanitize';
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userContent) }} />
 */

import DOMPurify from 'dompurify';

/**
 * Default allowed tags for rich text content
 */
const DEFAULT_ALLOWED_TAGS = [
  'b',
  'i',
  'em',
  'strong',
  'a',
  'p',
  'br',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'span',
  'div',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
];

/**
 * Default allowed attributes
 */
const DEFAULT_ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'id'];

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * @param dirty - The potentially unsafe HTML string
 * @param options - Configuration options
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * const userInput = '<script>alert("XSS")</script><p>Safe content</p>';
 * const safe = sanitizeHTML(userInput);
 * // Returns: '<p>Safe content</p>'
 */
export const sanitizeHTML = (dirty: string, options: SanitizeOptions = {}): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const config = {
    ALLOWED_TAGS: options.allowedTags || DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: options.allowedAttributes || DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: options.allowDataAttributes || false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
    // Remove all scripts and event handlers
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  };

  return DOMPurify.sanitize(dirty, config) as string;
};

/**
 * Sanitize plain text (remove all HTML tags)
 *
 * @param dirty - The potentially unsafe string
 * @returns Plain text with all HTML removed
 *
 * @example
 * const userInput = '<script>alert("XSS")</script>Hello';
 * const safe = sanitizeText(userInput);
 * // Returns: 'Hello'
 */
export const sanitizeText = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }) as string;
};

/**
 * Sanitize and validate URL
 *
 * @param url - The potentially unsafe URL
 * @returns Sanitized URL or empty string if invalid
 *
 * @example
 * const userUrl = 'javascript:alert("XSS")';
 * const safe = sanitizeURL(userUrl);
 * // Returns: ''
 *
 * const validUrl = 'https://example.com';
 * const safe2 = sanitizeURL(validUrl);
 * // Returns: 'https://example.com'
 */
export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn(`[Security] Blocked unsafe URL protocol: ${parsed.protocol}`);
      return '';
    }

    return parsed.href;
  } catch (error) {
    console.warn('[Security] Invalid URL:', url);
    return '';
  }
};

/**
 * Sanitize markdown content (allows basic markdown syntax)
 *
 * @param dirty - The potentially unsafe markdown string
 * @returns Sanitized markdown string
 */
export const sanitizeMarkdown = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Allow markdown-specific tags
  const markdownTags = [...DEFAULT_ALLOWED_TAGS, 'del', 'ins', 'mark', 'sub', 'sup'];

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: markdownTags,
    ALLOWED_ATTR: [...DEFAULT_ALLOWED_ATTR, 'checked', 'disabled'],
    ALLOW_DATA_ATTR: false,
  }) as string;
};

/**
 * Sanitize user input for storage (before saving to database)
 * More permissive than sanitizeHTML for display
 *
 * @param dirty - The user input
 * @returns Sanitized string safe for storage
 */
export const sanitizeForStorage = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Remove only the most dangerous elements
  return DOMPurify.sanitize(dirty, {
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'applet'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout'],
    ALLOW_DATA_ATTR: false,
  }) as string;
};

/**
 * Validate and sanitize email address
 *
 * @param email - The email address to validate
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) {
    return '';
  }

  // Remove any HTML tags
  return sanitizeText(trimmed);
};

/**
 * Sanitize filename (remove path traversal attempts)
 *
 * @param filename - The filename to sanitize
 * @returns Safe filename
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return 'untitled';
  }

  // Remove path traversal attempts and dangerous characters
  return (
    filename
      .replace(/[/\\]/g, '') // Remove slashes
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/[<>:"|?*]/g, '') // Remove Windows-forbidden characters
      .replace(/^\.+/, '') // Remove leading dots
      .trim()
      .slice(0, 255) || 'untitled'
  ); // Limit length
};

/**
 * Check if content contains potential XSS
 * Useful for logging/monitoring suspicious activity
 *
 * @param content - The content to check
 * @returns true if suspicious patterns detected
 */
export const containsSuspiciousContent = (content: string): boolean => {
  if (!content || typeof content !== 'string') {
    return false;
  }

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(content));
};

/**
 * Log security event (for monitoring)
 *
 * @param event - The security event type
 * @param details - Additional details
 */
export const logSecurityEvent = (
  event: 'xss_attempt' | 'invalid_url' | 'suspicious_content',
  details: string
): void => {
  // In production, send to monitoring service
  console.warn(`[Security Event] ${event}:`, details);

  // TODO: Send to Firebase Analytics or monitoring service
  // analytics.logEvent('security_event', { type: event, details });
};
