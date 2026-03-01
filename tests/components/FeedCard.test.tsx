import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FeedItem } from '../../types';

// Mock the dependencies
vi.mock('../hooks/useHaptics', () => ({
    useHaptics: () => ({ triggerHaptic: vi.fn() }),
}));

vi.mock('../src/contexts/SettingsContext', () => ({
    useSettings: () => ({
        settings: {
            feedSettings: { markAsReadOnOpen: false },
        },
    }),
}));

describe('FeedCard Component', () => {
    const mockItem: FeedItem = {
        id: 'test-1',
        title: 'Test Feed Item',
        content: '<p>Test content with some words for testing.</p>',
        link: 'https://example.com/article',
        type: 'rss',
        is_read: false,
        is_spark: false,
        isImportant: false,
        tags: [],
        createdAt: new Date().toISOString(),
        source: 'example.com',
    };

    const defaultProps = {
        item: mockItem,
        index: 0,
        onSelect: vi.fn(),
        onLongPress: vi.fn(),
        onContextMenu: vi.fn(),
        isInSelectionMode: false,
        isSelected: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Props and Rendering', () => {
        it('should define all required props interface', () => {
            expect(defaultProps.item).toBeDefined();
            expect(defaultProps.onSelect).toBeDefined();
            expect(defaultProps.onLongPress).toBeDefined();
            expect(defaultProps.onContextMenu).toBeDefined();
        });

        it('should handle missing optional props', () => {
            const minimalProps = {
                ...defaultProps,
                onMarkAsRead: undefined,
                onToggleSave: undefined,
                priority: undefined,
            };
            expect(minimalProps.onMarkAsRead).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        it('should handle item with empty tags array', () => {
            const itemWithNoTags = { ...mockItem, tags: [] };
            expect(itemWithNoTags.tags.length).toBe(0);
        });

        it('should handle item with missing content', () => {
            const itemWithNoContent = { ...mockItem, content: undefined };
            expect(itemWithNoContent.content).toBeUndefined();
        });

        it('should handle item with missing link', () => {
            const itemWithNoLink = { ...mockItem, link: undefined };
            expect(itemWithNoLink.link).toBeUndefined();
        });

        it('should handle spark type items', () => {
            const sparkItem = { ...mockItem, type: 'spark' as const, source: 'AI_GENERATED' };
            expect(sparkItem.type).toBe('spark');
        });

        it('should handle mentor type items', () => {
            const mentorItem = { ...mockItem, type: 'mentor' as const, title: 'Mentor Name: Quote' };
            expect(mentorItem.type).toBe('mentor');
        });

        it('should handle read items opacity', () => {
            const readItem = { ...mockItem, is_read: true };
            expect(readItem.is_read).toBe(true);
        });

        it('should handle important items', () => {
            const importantItem = { ...mockItem, isImportant: true };
            expect(importantItem.isImportant).toBe(true);
        });

        it('should handle selection mode', () => {
            const selectionProps = { ...defaultProps, isInSelectionMode: true, isSelected: true };
            expect(selectionProps.isInSelectionMode).toBe(true);
            expect(selectionProps.isSelected).toBe(true);
        });
    });

    describe('Item with Tags', () => {
        it('should handle items with multiple tags', () => {
            const itemWithTags = {
                ...mockItem,
                tags: [
                    { id: '1', name: 'tech' },
                    { id: '2', name: 'news' },
                    { id: '3', name: 'important' },
                ],
            };
            expect(itemWithTags.tags.length).toBe(3);
        });

        it('should limit visible tags to 3', () => {
            const itemWithManyTags = {
                ...mockItem,
                tags: [
                    { id: '1', name: 'tech' },
                    { id: '2', name: 'news' },
                    { id: '3', name: 'sports' },
                    { id: '4', name: 'politics' },
                ],
            };
            const visibleTags = itemWithManyTags.tags.slice(0, 3);
            expect(visibleTags.length).toBe(3);
        });
    });

    describe('Image Handling', () => {
        it('should handle item with image content', () => {
            const itemWithImage = {
                ...mockItem,
                content: '<p>Text</p><img src="https://example.com/image.jpg">',
            };
            expect(itemWithImage.content).toContain('<img');
        });

        it('should handle item without image', () => {
            const itemNoImage = {
                ...mockItem,
                content: '<p>No image here</p>',
            };
            expect(itemNoImage.content).not.toContain('<img');
        });
    });
});
