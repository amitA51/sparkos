import { describe, it, expect } from 'vitest';
import {
    extractImageFromContent,
    calculateReadingTime,
    getFaviconUrl,
    formatTimeAgo,
    extractDomain,
} from '../../utils/feedUtils';

describe('feedUtils', () => {
    describe('extractImageFromContent', () => {
        it('should extract image src from img tag', () => {
            const content = '<p>Hello</p><img src="https://example.com/image.jpg" alt="test">';
            expect(extractImageFromContent(content)).toBe('https://example.com/image.jpg');
        });

        it('should return null for empty content', () => {
            expect(extractImageFromContent('')).toBeNull();
        });

        it('should filter out tracking pixels', () => {
            const content = '<img src="https://example.com/pixel.gif">';
            expect(extractImageFromContent(content)).toBeNull();
        });

        it('should filter out 1x1 tracking images', () => {
            const content = '<img src="https://example.com/1x1.gif">';
            expect(extractImageFromContent(content)).toBeNull();
        });

        it('should extract from enclosure tag', () => {
            const content = '<enclosure url="https://example.com/media.jpg" type="image/jpeg"/>';
            expect(extractImageFromContent(content)).toBe('https://example.com/media.jpg');
        });

        it('should return null when no image found', () => {
            const content = '<p>No images here</p>';
            expect(extractImageFromContent(content)).toBeNull();
        });
    });

    describe('calculateReadingTime', () => {
        it('should return 1 for empty content', () => {
            expect(calculateReadingTime('')).toBe(1);
        });

        it('should return 1 for short content', () => {
            expect(calculateReadingTime('Hello world')).toBe(1);
        });

        it('should calculate minutes for longer content', () => {
            // 400 words = 2 minutes at 200 wpm
            const words = Array(400).fill('word').join(' ');
            expect(calculateReadingTime(words)).toBe(2);
        });

        it('should strip HTML tags before calculating', () => {
            const content = '<p>hello</p> <strong>world</strong>';
            expect(calculateReadingTime(content)).toBe(1);
        });

        it('should cap at 30 minutes maximum', () => {
            // 10000 words would be 50 minutes, should cap at 30
            const words = Array(10000).fill('word').join(' ');
            expect(calculateReadingTime(words)).toBe(30);
        });
    });

    describe('getFaviconUrl', () => {
        it('should return Google favicon URL for valid link', () => {
            const url = getFaviconUrl('https://example.com/page');
            expect(url).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=64');
        });

        it('should return empty string for empty input', () => {
            expect(getFaviconUrl('')).toBe('');
        });

        it('should return empty string for invalid URL', () => {
            expect(getFaviconUrl('not-a-url')).toBe('');
        });
    });

    describe('formatTimeAgo', () => {
        it('should return "עכשיו" for very recent times', () => {
            const now = new Date();
            expect(formatTimeAgo(now)).toBe('עכשיו');
        });

        it('should return minutes for times under an hour', () => {
            const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
            expect(formatTimeAgo(thirtyMinsAgo)).toBe("לפני 30 דק'");
        });

        it('should return hours for times under a day', () => {
            const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
            expect(formatTimeAgo(fiveHoursAgo)).toBe("לפני 5 שע'");
        });

        it('should return days for times under a week', () => {
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            expect(formatTimeAgo(threeDaysAgo)).toBe('לפני 3 ימים');
        });

        it('should handle string dates', () => {
            const now = new Date().toISOString();
            expect(formatTimeAgo(now)).toBe('עכשיו');
        });
    });

    describe('extractDomain', () => {
        it('should extract domain from valid URL', () => {
            expect(extractDomain('https://www.example.com/page')).toBe('example.com');
        });

        it('should remove www prefix', () => {
            expect(extractDomain('https://www.test.org')).toBe('test.org');
        });

        it('should return empty string for empty input', () => {
            expect(extractDomain('')).toBe('');
        });

        it('should return empty string for invalid URL', () => {
            expect(extractDomain('not-a-url')).toBe('');
        });

        it('should handle URLs without www', () => {
            expect(extractDomain('https://api.example.com')).toBe('api.example.com');
        });
    });
});
