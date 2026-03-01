/**
 * Unit Tests for textUtils
 */
import { describe, it, expect } from 'vitest';
import { stripHtmlAndDecodeEntities, truncateText } from '../../utils/textUtils';

describe('stripHtmlAndDecodeEntities', () => {
    it('should return empty string for null/undefined input', () => {
        expect(stripHtmlAndDecodeEntities('')).toBe('');
        expect(stripHtmlAndDecodeEntities(null as unknown as string)).toBe('');
        expect(stripHtmlAndDecodeEntities(undefined as unknown as string)).toBe('');
    });

    it('should strip basic HTML tags', () => {
        expect(stripHtmlAndDecodeEntities('<p>Hello World</p>')).toBe('Hello World');
        expect(stripHtmlAndDecodeEntities('<strong>Bold</strong> text')).toBe('Bold text');
        expect(stripHtmlAndDecodeEntities('<a href="http://example.com">Link</a>')).toBe('Link');
    });

    it('should decode common HTML entities', () => {
        expect(stripHtmlAndDecodeEntities('Hello &amp; World')).toBe('Hello & World');
        expect(stripHtmlAndDecodeEntities('&lt;not a tag&gt;')).toBe('<not a tag>');
        expect(stripHtmlAndDecodeEntities('&quot;quoted&quot;')).toBe('"quoted"');
        expect(stripHtmlAndDecodeEntities('&#39;apostrophe&#39;')).toBe("'apostrophe'");
        expect(stripHtmlAndDecodeEntities('&nbsp;space&nbsp;')).toBe('space'); // nbsp at edges gets trimmed
    });

    it('should decode numeric entities', () => {
        expect(stripHtmlAndDecodeEntities('&#65;&#66;&#67;')).toBe('ABC');
        expect(stripHtmlAndDecodeEntities('&#x41;&#x42;&#x43;')).toBe('ABC');
    });

    it('should remove script tags with their contents', () => {
        const input = 'Before<script>alert("XSS")</script>After';
        expect(stripHtmlAndDecodeEntities(input)).toBe('BeforeAfter');
    });

    it('should remove style tags with their contents', () => {
        const input = 'Before<style>.class { color: red; }</style>After';
        expect(stripHtmlAndDecodeEntities(input)).toBe('BeforeAfter');
    });

    it('should handle nested HTML', () => {
        const input = '<div><p>Nested <strong>content</strong></p></div>';
        expect(stripHtmlAndDecodeEntities(input)).toContain('Nested content');
    });

    it('should convert block elements to newlines', () => {
        const input = '<p>Paragraph 1</p><p>Paragraph 2</p>';
        const result = stripHtmlAndDecodeEntities(input);
        expect(result).toContain('Paragraph 1');
        expect(result).toContain('Paragraph 2');
    });

    it('should normalize excessive whitespace', () => {
        const input = 'Too     many    spaces';
        expect(stripHtmlAndDecodeEntities(input)).toBe('Too many spaces');
    });

    it('should handle real-world RSS content', () => {
        const rssContent = `
      <p>Breaking news: &quot;Tech stocks surge&quot; as markets rally.</p>
      <p>Analysts say &mdash; this could be the start of a new trend.</p>
      <script>trackEvent('page_view')</script>
    `;
        const result = stripHtmlAndDecodeEntities(rssContent);
        expect(result).toContain('Breaking news: "Tech stocks surge"');
        expect(result).toContain('—');
        expect(result).not.toContain('trackEvent');
        expect(result).not.toContain('<script>');
    });
});

describe('truncateText', () => {
    it('should return original text if under max length', () => {
        expect(truncateText('Short text', 100)).toBe('Short text');
    });

    it('should truncate at word boundary', () => {
        const result = truncateText('This is a longer sentence that needs truncation', 30);
        expect(result).toBe('This is a longer sentence...');
        expect(result.length).toBeLessThanOrEqual(30);
    });

    it('should handle empty input', () => {
        expect(truncateText('', 100)).toBe('');
        expect(truncateText(null as unknown as string, 100)).toBe('');
    });

    it('should use custom suffix', () => {
        const result = truncateText('This is a test sentence', 18, ' [more]');
        expect(result).toContain('[more]');
    });
});
