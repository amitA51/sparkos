/**
 * useLocalStorage Hook Tests
 * Following testing-patterns skill: AAA pattern
 * Note: These tests work with the mocked localStorage from tests/setup.ts
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

describe('useLocalStorage', () => {
    // Create our own storage mock that we control
    let mockStorage: Map<string, string>;
    let getItemSpy: ReturnType<typeof vi.spyOn>;
    let setItemSpy: ReturnType<typeof vi.spyOn>;
    let removeItemSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        mockStorage = new Map();

        // Override the default mocks from setup.ts
        getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(
            (key: string) => mockStorage.get(key) ?? null
        );
        setItemSpy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(
            (key: string, value: string) => {
                mockStorage.set(key, value);
            }
        );
        removeItemSpy = vi.spyOn(window.localStorage, 'removeItem').mockImplementation(
            (key: string) => {
                mockStorage.delete(key);
            }
        );
    });

    afterEach(() => {
        getItemSpy.mockRestore();
        setItemSpy.mockRestore();
        removeItemSpy.mockRestore();
        mockStorage.clear();
    });

    describe('initialization', () => {
        it('should return initial value when storage is empty', () => {
            // Arrange
            const initialValue = { name: 'test' };

            // Act
            const { result } = renderHook(() =>
                useLocalStorage('testKey', initialValue)
            );

            // Assert
            expect(result.current[0]).toEqual(initialValue);
        });

        it('should return stored value when available', () => {
            // Arrange - pre-populate storage BEFORE rendering hook
            const storedValue = { name: 'stored' };
            mockStorage.set('existingKey', JSON.stringify(storedValue));

            // Act
            const { result } = renderHook(() =>
                useLocalStorage('existingKey', { name: 'default' })
            );

            // Assert
            expect(result.current[0]).toEqual(storedValue);
        });

        it('should return initial value when storage contains invalid JSON', () => {
            // Arrange - setup invalid JSON in storage
            mockStorage.set('invalidKey', 'not valid json {');
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            // Act
            const { result } = renderHook(() =>
                useLocalStorage('invalidKey', 'default')
            );

            // Assert
            expect(result.current[0]).toBe('default');
            expect(warnSpy).toHaveBeenCalled();
            warnSpy.mockRestore();
        });
    });

    describe('setValue', () => {
        it('should update state and localStorage', () => {
            // Arrange
            const { result } = renderHook(() =>
                useLocalStorage('testKey', 'initial')
            );

            // Act
            act(() => {
                result.current[1]('updated');
            });

            // Assert
            expect(result.current[0]).toBe('updated');
            expect(mockStorage.get('testKey')).toBe('"updated"');
        });

        it('should accept function updater', () => {
            // Arrange
            const { result } = renderHook(() => useLocalStorage('counterKey', 0));

            // Act
            act(() => {
                result.current[1]((prev) => prev + 1);
            });
            act(() => {
                result.current[1]((prev) => prev + 1);
            });

            // Assert
            expect(result.current[0]).toBe(2);
        });

        it('should handle complex objects', () => {
            // Arrange
            const complexObj = {
                array: [1, 2, 3],
                nested: { deep: { value: 'test' } },
                date: '2025-01-01',
            };

            const { result } = renderHook(() =>
                useLocalStorage('complexKey', {} as typeof complexObj)
            );

            // Act
            act(() => {
                result.current[1](complexObj);
            });

            // Assert
            expect(result.current[0]).toEqual(complexObj);
            expect(JSON.parse(mockStorage.get('complexKey')!)).toEqual(complexObj);
        });
    });

    describe('removeValue', () => {
        it('should remove from storage and reset to initial', () => {
            // Arrange - pre-populate storage
            mockStorage.set('removeKey', '"stored"');
            const { result } = renderHook(() =>
                useLocalStorage('removeKey', 'initial')
            );

            // Verify stored value is loaded
            expect(result.current[0]).toBe('stored');

            // Act
            act(() => {
                result.current[2](); // removeValue
            });

            // Assert
            expect(result.current[0]).toBe('initial');
            expect(mockStorage.has('removeKey')).toBe(false);
        });
    });

    describe('type safety', () => {
        it('should work with primitive types', () => {
            // String
            const { result: strResult } = renderHook(() =>
                useLocalStorage('str', 'default')
            );
            expect(typeof strResult.current[0]).toBe('string');

            // Number
            const { result: numResult } = renderHook(() =>
                useLocalStorage('num', 42)
            );
            expect(typeof numResult.current[0]).toBe('number');

            // Boolean
            const { result: boolResult } = renderHook(() =>
                useLocalStorage('bool', true)
            );
            expect(typeof boolResult.current[0]).toBe('boolean');
        });

        it('should work with arrays', () => {
            // Arrange
            const { result } = renderHook(() =>
                useLocalStorage<string[]>('arr', ['a', 'b'])
            );

            // Act
            act(() => {
                result.current[1]((prev) => [...prev, 'c']);
            });

            // Assert
            expect(result.current[0]).toEqual(['a', 'b', 'c']);
        });
    });
});
