/**
 * Testing Utilities
 * 
 * Comprehensive testing helpers for React components and hooks.
 * Provides factories, wrappers, and utilities for maintainable tests.
 */

import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult, screen, within, waitFor as waitForElement } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, afterEach, expect } from 'vitest';

// ============================================================================
// Test Wrapper with All Providers
// ============================================================================

/**
 * Create a fresh QueryClient for each test
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

/**
 * All providers wrapper for testing
 */
function AllTheProviders({ children }: WrapperProps): ReactElement {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// ============================================================================
// Custom Render with Providers
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial route for router testing */
  route?: string;
  /** Pre-populated query cache */
  queryData?: Record<string, unknown>;
}

/**
 * Custom render function with all providers
 * @example
 * renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const Wrapper = ({ children }: WrapperProps) => (
    <AllTheProviders>{children}</AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// ============================================================================
// Mock Factories
// ============================================================================

import type { PersonalItem, FeedItem, Space, User } from '../types';

let idCounter = 0;
const generateId = (): string => `test-id-${++idCounter}`;

/**
 * Reset ID counter between tests
 */
export function resetIdCounter(): void {
  idCounter = 0;
}

/**
 * Factory for creating mock PersonalItem
 */
export function createMockPersonalItem(
  overrides: Partial<PersonalItem> = {}
): PersonalItem {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    type: 'task',
    title: 'Test Task',
    description: '',
    isCompleted: false,
    isImportant: false,
    isPinned: false,
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  } as PersonalItem;
}

/**
 * Factory for creating mock FeedItem
 */
export function createMockFeedItem(
  overrides: Partial<FeedItem> = {}
): FeedItem {
  return {
    id: generateId(),
    type: 'rss',
    title: 'Test Feed Item',
    content: 'Test content',
    is_read: false,
    is_spark: false,
    tags: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Factory for creating mock Space
 */
export function createMockSpace(
  overrides: Partial<Space> = {}
): Space {
  return {
    id: generateId(),
    name: 'Test Space',
    icon: 'folder',
    color: '#4A90D9',
    type: 'personal',
    order: 0,
    ...overrides,
  };
}

/**
 * Factory for creating mock User
 */
export function createMockUser(
  overrides: Partial<User> = {}
): User {
  return {
    uid: generateId(),
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Factory for creating multiple items
 */
export function createMockItems<T>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overridesFn?: (index: number) => Partial<T>
): T[] {
  return Array.from({ length: count }, (_, i) => 
    factory(overridesFn?.(i))
  );
}

// ============================================================================
// Async Utilities
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options;
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('waitForCondition timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Wait for a specific amount of time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// Mock Functions
// ============================================================================

/**
 * Create a mock async function that resolves
 */
export function createAsyncMock<T>(
  resolvedValue: T,
  delayMs = 0
) {
  return vi.fn().mockImplementation(
    () =>
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(resolvedValue), delayMs);
      })
  );
}

/**
 * Create a mock that rejects
 */
export function createFailingMock(
  error: Error = new Error('Mock error'),
  delayMs = 0
) {
  return vi.fn().mockImplementation(
    () =>
      new Promise((_, reject) => {
        setTimeout(() => reject(error), delayMs);
      })
  );
}

// ============================================================================
// Accessibility Testing Helpers
// ============================================================================

/**
 * Check if element has proper accessibility attributes
 */
export function checkAccessibility(element: HTMLElement): {
  hasLabel: boolean;
  hasRole: boolean;
  isFocusable: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const hasLabel = Boolean(
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.closest('label') ||
    element.querySelector('label')
  );

  const hasRole = Boolean(element.getAttribute('role') || element.tagName.toLowerCase());

  const isFocusable =
    element.tabIndex >= 0 ||
    ['button', 'a', 'input', 'select', 'textarea'].includes(element.tagName.toLowerCase());

  if (!hasLabel) {
    errors.push('Missing accessible label');
  }

  return { hasLabel, hasRole, isFocusable, errors };
}

// ============================================================================
// Mock Implementations
// ============================================================================

/**
 * Mock localStorage
 */
export function createMockLocalStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

/**
 * Mock IntersectionObserver
 */
export function createMockIntersectionObserver(): typeof IntersectionObserver {
  return class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(
      private callback: IntersectionObserverCallback,
    ) {}

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    // Helper to trigger intersection
    triggerIntersection(isIntersecting: boolean): void {
      this.callback(
        [
          {
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
          } as IntersectionObserverEntry,
        ],
        this
      );
    }
  };
}

/**
 * Setup common mocks for tests
 */
export function setupCommonMocks(): void {
  // Mock IntersectionObserver
  global.IntersectionObserver = createMockIntersectionObserver();

  // Mock ResizeObserver
  global.ResizeObserver = class MockResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// ============================================================================
// Advanced Testing Patterns
// ============================================================================

/**
 * Create a spy that tracks calls and can be reset
 */
export function createTrackedSpy<T extends (...args: unknown[]) => unknown>(
  implementation?: T
) {
  const calls: Parameters<T>[] = [];
  
  const spy = vi.fn((...args: Parameters<T>) => {
    calls.push(args);
    return implementation?.(...args);
  });

  return {
    spy,
    calls,
    reset: () => {
      calls.length = 0;
      spy.mockClear();
    },
    getLastCall: () => calls[calls.length - 1],
    wasCalledWith: (...args: Parameters<T>) => 
      calls.some(call => 
        JSON.stringify(call) === JSON.stringify(args)
      ),
  };
}

/**
 * Builder pattern for creating complex test data
 */
export class TestDataBuilder<T> {
  private data: Partial<T> = {};

  constructor(private factory: (overrides?: Partial<T>) => T) {}

  with<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  build(): T {
    return this.factory(this.data);
  }

  buildMany(count: number): T[] {
    return Array.from({ length: count }, () => this.build());
  }
}

/**
 * Create a builder for PersonalItem
 */
export function personalItemBuilder() {
  return new TestDataBuilder(createMockPersonalItem);
}

/**
 * Create a builder for FeedItem
 */
export function feedItemBuilder() {
  return new TestDataBuilder(createMockFeedItem);
}

/**
 * Create a builder for Space
 */
export function spaceBuilder() {
  return new TestDataBuilder(createMockSpace);
}

// ============================================================================
// State Snapshot Testing
// ============================================================================

/**
 * Capture and compare state snapshots
 */
export function createStateSnapshot<T>(initialState: T) {
  const snapshots: T[] = [structuredClone(initialState)];

  return {
    capture: (state: T) => {
      snapshots.push(structuredClone(state));
    },
    getSnapshots: () => snapshots,
    getLastSnapshot: () => snapshots[snapshots.length - 1],
    getDiff: (index1: number, index2: number) => {
      const s1 = snapshots[index1];
      const s2 = snapshots[index2];
      if (!s1 || !s2) return null;
      
      const diff: Record<string, { before: unknown; after: unknown }> = {};
      const keys = new Set([...Object.keys(s1 as object), ...Object.keys(s2 as object)]);
      
      keys.forEach(key => {
        const v1 = (s1 as Record<string, unknown>)[key];
        const v2 = (s2 as Record<string, unknown>)[key];
        if (JSON.stringify(v1) !== JSON.stringify(v2)) {
          diff[key] = { before: v1, after: v2 };
        }
      });
      
      return diff;
    },
  };
}

// ============================================================================
// Event Testing Helpers
// ============================================================================

/**
 * Create keyboard event helpers
 */
export const keyboard = {
  enter: () => ({ key: 'Enter', code: 'Enter' }),
  escape: () => ({ key: 'Escape', code: 'Escape' }),
  tab: () => ({ key: 'Tab', code: 'Tab' }),
  arrowUp: () => ({ key: 'ArrowUp', code: 'ArrowUp' }),
  arrowDown: () => ({ key: 'ArrowDown', code: 'ArrowDown' }),
  arrowLeft: () => ({ key: 'ArrowLeft', code: 'ArrowLeft' }),
  arrowRight: () => ({ key: 'ArrowRight', code: 'ArrowRight' }),
  space: () => ({ key: ' ', code: 'Space' }),
  backspace: () => ({ key: 'Backspace', code: 'Backspace' }),
};

/**
 * Simulate user typing
 */
export async function typeText(element: HTMLInputElement, text: string): Promise<void> {
  element.focus();
  for (const char of text) {
    element.value += char;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await delay(10);
  }
}

// ============================================================================
// Network Mocking Helpers
// ============================================================================

interface MockResponse {
  status?: number;
  data?: unknown;
  headers?: Record<string, string>;
}

/**
 * Create a mock fetch response
 */
export function createMockFetch(responses: Record<string, MockResponse>) {
  return vi.fn((url: string) => {
    const response = responses[url] || { status: 404, data: { error: 'Not found' } };
    
    return Promise.resolve({
      ok: (response.status || 200) >= 200 && (response.status || 200) < 300,
      status: response.status || 200,
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      headers: new Headers(response.headers),
    });
  });
}

/**
 * Create a fetch that fails with network error
 */
export function createFailingFetch(error: Error = new Error('Network error')) {
  return vi.fn(() => Promise.reject(error));
}

// ============================================================================
// Timer Testing Helpers
// ============================================================================

/**
 * Setup fake timers with cleanup
 */
export function useFakeTimers() {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  return {
    advanceBy: (ms: number) => vi.advanceTimersByTime(ms),
    advanceToNextTimer: () => vi.advanceTimersToNextTimer(),
    runAllTimers: () => vi.runAllTimers(),
    runOnlyPendingTimers: () => vi.runOnlyPendingTimers(),
  };
}

// ============================================================================
// Component Testing Helpers
// ============================================================================

/**
 * Wait for loading state to complete
 */
export async function waitForLoadingToComplete(
  testId = 'loading-spinner'
): Promise<void> {
  await waitForElement(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });
}

/**
 * Assert element is visible and accessible
 */
export function assertAccessible(element: HTMLElement): void {
  expect(element).toBeVisible();
  expect(element).not.toHaveAttribute('aria-hidden', 'true');
  
  // Check focusability for interactive elements
  const interactiveRoles = ['button', 'link', 'textbox', 'checkbox', 'radio'];
  const role = element.getAttribute('role');
  
  if (role && interactiveRoles.includes(role)) {
    expect(element.tabIndex).toBeGreaterThanOrEqual(-1);
  }
}

/**
 * Get all form values
 */
export function getFormValues(form: HTMLFormElement): Record<string, string> {
  const formData = new FormData(form);
  const values: Record<string, string> = {};
  
  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      values[key] = value;
    }
  });
  
  return values;
}

// ============================================================================
// Debug Helpers
// ============================================================================

/**
 * Log element tree for debugging
 */
export function debugElement(element: HTMLElement, depth = 0): void {
  const indent = '  '.repeat(depth);
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
  
  console.log(`${indent}<${tag}${id}${classes}>`);
  
  Array.from(element.children).forEach(child => {
    debugElement(child as HTMLElement, depth + 1);
  });
}

// Re-export testing-library utilities
export { screen, within, waitForElement };
export type { RenderResult };
