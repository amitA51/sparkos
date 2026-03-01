/**
 * useSmartText Hook
 * Provides smart text features: auto-link detection, markdown rendering, and backlinks
 * Reads settings from smartFeaturesSettings
 */

import { useMemo, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { useSettings } from '../src/contexts/SettingsContext';

// URL regex pattern - matches http, https, and www URLs
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+/gi;

// Backlink pattern - matches [[text]]
const BACKLINK_REGEX = /\[\[([^\]]+)\]\]/g;

// Simple markdown patterns
const MARKDOWN_PATTERNS = {
  bold: /\*\*([^*]+)\*\*/g,
  italic: /\*([^*]+)\*/g,
  code: /`([^`]+)`/g,
  strikethrough: /~~([^~]+)~~/g,
  heading: /^(#{1,6})\s+(.+)$/gm,
};

export interface SmartTextResult {
  /** Whether auto-link detection is enabled */
  autoLinksEnabled: boolean;
  /** Whether markdown is enabled */
  markdownEnabled: boolean;
  /** Whether backlinks are enabled */
  backlinksEnabled: boolean;
  /** Extract URLs from text */
  extractUrls: (text: string) => string[];
  /** Extract backlinks from text */
  extractBacklinks: (text: string) => string[];
  /** Convert text to HTML with smart features applied */
  renderSmartText: (text: string) => string;
  /** Check if text contains any URLs */
  hasUrls: (text: string) => boolean;
  /** Check if text contains backlinks */
  hasBacklinks: (text: string) => boolean;
}

export function useSmartText(): SmartTextResult {
  const { settings } = useSettings();

  const smartSettings = settings.smartFeaturesSettings || {
    autoLinkDetection: true,
    markdownEnabled: true,
    autoBacklinks: false,
  };

  const autoLinksEnabled = smartSettings.autoLinkDetection;
  const markdownEnabled = smartSettings.markdownEnabled;
  const backlinksEnabled = smartSettings.autoBacklinks;

  const extractUrls = useCallback(
    (text: string): string[] => {
      if (!text || !autoLinksEnabled) return [];
      const matches = text.match(URL_REGEX);
      return matches ? [...new Set(matches)] : [];
    },
    [autoLinksEnabled]
  );

  const extractBacklinks = useCallback(
    (text: string): string[] => {
      if (!text || !backlinksEnabled) return [];
      const matches: string[] = [];
      let match;
      while ((match = BACKLINK_REGEX.exec(text)) !== null) {
        if (match[1]) matches.push(match[1]);
      }
      BACKLINK_REGEX.lastIndex = 0; // Reset regex state
      return [...new Set(matches)];
    },
    [backlinksEnabled]
  );

  const hasUrls = useCallback(
    (text: string): boolean => {
      if (!text || !autoLinksEnabled) return false;
      return URL_REGEX.test(text);
    },
    [autoLinksEnabled]
  );

  const hasBacklinks = useCallback(
    (text: string): boolean => {
      if (!text || !backlinksEnabled) return false;
      BACKLINK_REGEX.lastIndex = 0;
      return BACKLINK_REGEX.test(text);
    },
    [backlinksEnabled]
  );

  const renderSmartText = useCallback(
    (text: string): string => {
      if (!text) return '';
      let result = text;

      // Escape HTML first to prevent XSS
      result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // Apply markdown if enabled
      if (markdownEnabled) {
        // Bold: **text**
        result = result.replace(MARKDOWN_PATTERNS.bold, '<strong>$1</strong>');

        // Italic: *text*
        result = result.replace(MARKDOWN_PATTERNS.italic, '<em>$1</em>');

        // Code: `code`
        result = result.replace(MARKDOWN_PATTERNS.code, '<code class="smart-text-code">$1</code>');

        // Strikethrough: ~~text~~
        result = result.replace(MARKDOWN_PATTERNS.strikethrough, '<del>$1</del>');
      }

      // Apply backlinks if enabled
      if (backlinksEnabled) {
        result = result.replace(
          BACKLINK_REGEX,
          '<a class="smart-text-backlink" href="#" data-backlink="$1">$1</a>'
        );
      }

      // Apply auto-links if enabled (do this last to not interfere with other patterns)
      if (autoLinksEnabled) {
        result = result.replace(URL_REGEX, url => {
          const href = url.startsWith('www.') ? `https://${url}` : url;
          return `<a class="smart-text-link" href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
      }

      // Sanitize with DOMPurify to prevent XSS attacks
      return DOMPurify.sanitize(result, {
        ALLOWED_TAGS: ['a', 'strong', 'em', 'code', 'del'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'data-backlink'],
      });
    },
    [autoLinksEnabled, markdownEnabled, backlinksEnabled]
  );

  return useMemo(
    () => ({
      autoLinksEnabled,
      markdownEnabled,
      backlinksEnabled,
      extractUrls,
      extractBacklinks,
      renderSmartText,
      hasUrls,
      hasBacklinks,
    }),
    [
      autoLinksEnabled,
      markdownEnabled,
      backlinksEnabled,
      extractUrls,
      extractBacklinks,
      renderSmartText,
      hasUrls,
      hasBacklinks,
    ]
  );
}

export default useSmartText;
