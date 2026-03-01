/**
 * useNetworkStatus Hook Tests
 * Following testing-patterns skill: AAA pattern, mocking browser APIs
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

describe('useNetworkStatus', () => {
    let mockConnection: any;

    beforeEach(() => {
        // Create mock connection object
        mockConnection = {
            effectiveType: '4g',
            downlink: 10,
            rtt: 50,
            type: 'wifi',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        // Mock navigator.onLine
        vi.stubGlobal('navigator', {
            ...window.navigator,
            onLine: true,
            connection: mockConnection,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    describe('initial state', () => {
        it('should return online status based on navigator.onLine', () => {
            // Arrange - navigator.onLine is mocked as true (default)

            // Act
            const { result } = renderHook(() => useNetworkStatus());

            // Assert
            expect(result.current.isOnline).toBe(true);
            expect(result.current.wasOffline).toBe(false);
        });

        it('should include connection info when available', () => {
            // Act
            const { result } = renderHook(() => useNetworkStatus());

            // Assert
            expect(result.current.effectiveType).toBe('4g');
            expect(result.current.downlink).toBe(10);
            expect(result.current.rtt).toBe(50);
            expect(result.current.connectionType).toBe('wifi');
        });
    });

    describe('online/offline events', () => {
        it('should update isOnline when going offline', () => {
            // Arrange
            const { result } = renderHook(() => useNetworkStatus());
            expect(result.current.isOnline).toBe(true);

            // Act - simulate offline event
            act(() => {
                // Update the mocked property
                Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
                window.dispatchEvent(new Event('offline'));
            });

            // Assert
            expect(result.current.isOnline).toBe(false);
        });

        it('should update isOnline and wasOffline when coming back online', () => {
            // Arrange - start offline
            Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

            const { result } = renderHook(() => useNetworkStatus());

            // Act - come back online
            act(() => {
                Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
                window.dispatchEvent(new Event('online'));
            });

            // Assert
            expect(result.current.isOnline).toBe(true);
            expect(result.current.wasOffline).toBe(true);
        });
    });

    describe('event listener management', () => {
        it('should add event listeners on mount', () => {
            // Arrange
            const addEventSpy = vi.spyOn(window, 'addEventListener');

            // Act
            renderHook(() => useNetworkStatus());

            // Assert
            expect(addEventSpy).toHaveBeenCalledWith('online', expect.any(Function));
            expect(addEventSpy).toHaveBeenCalledWith('offline', expect.any(Function));
        });

        it('should remove event listeners on unmount', () => {
            // Arrange
            const removeEventSpy = vi.spyOn(window, 'removeEventListener');
            const { unmount } = renderHook(() => useNetworkStatus());

            // Act
            unmount();

            // Assert
            expect(removeEventSpy).toHaveBeenCalledWith('online', expect.any(Function));
            expect(removeEventSpy).toHaveBeenCalledWith('offline', expect.any(Function));
        });

        it('should listen for connection changes when supported', () => {
            // Act
            renderHook(() => useNetworkStatus());

            // Assert
            expect(mockConnection.addEventListener).toHaveBeenCalledWith(
                'change',
                expect.any(Function)
            );
        });
    });

    describe('graceful degradation', () => {
        it('should work without connection API', () => {
            // Arrange - mock navigator without connection
            vi.stubGlobal('navigator', {
                ...window.navigator,
                onLine: true,
                connection: undefined,
            });

            // Act
            const { result } = renderHook(() => useNetworkStatus());

            // Assert
            expect(result.current.isOnline).toBe(true);
            expect(result.current.connectionType).toBeUndefined();
            expect(result.current.effectiveType).toBeUndefined();
        });
    });
});
