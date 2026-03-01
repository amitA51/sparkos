/**
 * useDebounce Hook Tests
 * Following testing-patterns skill: AAA pattern, fast tests, isolated
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useThrottle, useDebouncedState } from '../../hooks/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('basic debounce', () => {
        it('should return initial value immediately', () => {
            // Arrange
            const initialValue = 'test';

            // Act
            const { result } = renderHook(() => useDebounce(initialValue, 500));

            // Assert
            expect(result.current).toBe(initialValue);
        });

        it('should debounce value updates', async () => {
            // Arrange
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'initial', delay: 300 } }
            );

            // Act - update value
            rerender({ value: 'updated', delay: 300 });

            // Assert - value should NOT be updated yet
            expect(result.current).toBe('initial');

            // Act - advance timer past delay
            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Assert - value should now be updated
            expect(result.current).toBe('updated');
        });

        it('should reset timer on rapid value changes', () => {
            // Arrange
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                { initialProps: { value: 'a', delay: 300 } }
            );

            // Act - rapid changes
            rerender({ value: 'b', delay: 300 });
            act(() => vi.advanceTimersByTime(100));

            rerender({ value: 'c', delay: 300 });
            act(() => vi.advanceTimersByTime(100));

            rerender({ value: 'd', delay: 300 });
            act(() => vi.advanceTimersByTime(100));

            // Assert - still has initial value (300ms hasn't passed since last change)
            expect(result.current).toBe('a');

            // Act - complete the delay
            act(() => vi.advanceTimersByTime(300));

            // Assert - should have final value
            expect(result.current).toBe('d');
        });

        it('should handle different delay values', () => {
            // Arrange
            const { result: fast } = renderHook(() => useDebounce('fast', 100));
            const { result: slow } = renderHook(() => useDebounce('slow', 500));

            // Act & Assert - both start with initial values
            expect(fast.current).toBe('fast');
            expect(slow.current).toBe('slow');
        });

        it('should handle zero delay', () => {
            // Arrange
            const { result, rerender } = renderHook(
                ({ value }) => useDebounce(value, 0),
                { initialProps: { value: 'start' } }
            );

            // Act
            rerender({ value: 'end' });
            act(() => vi.advanceTimersByTime(0));

            // Assert - should update immediately
            expect(result.current).toBe('end');
        });
    });

    describe('cleanup', () => {
        it('should cleanup timer on unmount', () => {
            // Arrange
            const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
            const { unmount, rerender } = renderHook(
                ({ value }) => useDebounce(value, 300),
                { initialProps: { value: 'test' } }
            );

            // Act - trigger a pending timer
            rerender({ value: 'changed' });
            unmount();

            // Assert - clearTimeout was called
            expect(clearTimeoutSpy).toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
        });
    });
});

describe('useThrottle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return initial value immediately', () => {
        // Arrange & Act
        const { result } = renderHook(() => useThrottle('test', 100));

        // Assert
        expect(result.current).toBe('test');
    });

    it('should throttle rapid value changes and update after interval', () => {
        // Arrange
        const { result, rerender } = renderHook(
            ({ value }) => useThrottle(value, 100),
            { initialProps: { value: 'first' } }
        );

        // Assert - initial value is set
        expect(result.current).toBe('first');

        // Act - update value and advance timer past interval
        rerender({ value: 'second' });
        act(() => vi.advanceTimersByTime(100));

        // Assert - should update after throttle interval
        expect(result.current).toBe('second');
    });
});

describe('useDebouncedState', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should return immediate and debounced values', () => {
        // Arrange & Act
        const { result } = renderHook(() => useDebouncedState('initial', 300));
        const [immediate, debounced, setValue] = result.current;

        // Assert
        expect(immediate).toBe('initial');
        expect(debounced).toBe('initial');
        expect(typeof setValue).toBe('function');
    });

    it('should update immediate value immediately, debounced after delay', () => {
        // Arrange
        const { result } = renderHook(() => useDebouncedState('start', 300));

        // Act - update state
        act(() => {
            result.current[2]('updated');
        });

        // Assert - immediate is updated, debounced is not
        expect(result.current[0]).toBe('updated');
        expect(result.current[1]).toBe('start');

        // Act - wait for debounce
        act(() => vi.advanceTimersByTime(300));

        // Assert - both are now updated
        expect(result.current[1]).toBe('updated');
    });
});
