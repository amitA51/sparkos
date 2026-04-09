/**
 * Keyboard Navigation System
 * 
 * Production-ready keyboard navigation with:
 * - Focus management
 * - Keyboard shortcuts
 * - Arrow key navigation
 * - Roving tabindex
 * - Accessibility support
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type KeyboardKey = 
  | 'Enter' | 'Escape' | 'Space' | 'Tab'
  | 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  | 'Home' | 'End' | 'PageUp' | 'PageDown'
  | 'Backspace' | 'Delete'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
  | '/' | '?' | ',' | '.' | '+' | '-' | '*';

export interface KeyboardShortcut {
  key: KeyboardKey;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description?: string;
}

export interface ShortcutHandler {
  shortcut: KeyboardShortcut;
  handler: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface FocusableElement {
  element: HTMLElement;
  id: string;
  group?: string;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Parse shortcut string to KeyboardShortcut object
 * @example parseShortcut('ctrl+k') // { key: 'k', ctrl: true }
 * @example parseShortcut('alt+shift+s') // { key: 's', alt: true, shift: true }
 */
export function parseShortcut(shortcutString: string): KeyboardShortcut {
  const parts = shortcutString.toLowerCase().split('+');
  const key = parts.pop() as KeyboardKey;
  
  return {
    key,
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
  };
}

/**
 * Format KeyboardShortcut to display string
 * @example formatShortcut({ key: 'k', ctrl: true }) // 'Ctrl+K' or '⌘K' on Mac
 */
export function formatShortcut(shortcut: KeyboardShortcut, useMacSymbols = false): string {
  const parts: string[] = [];
  
  if (useMacSymbols) {
    if (shortcut.ctrl) parts.push('⌃');
    if (shortcut.alt) parts.push('⌥');
    if (shortcut.shift) parts.push('⇧');
    if (shortcut.meta) parts.push('⌘');
  } else {
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.meta) parts.push('Meta');
  }
  
  const keyDisplay = shortcut.key === 'Space' ? 'Space' : shortcut.key.toUpperCase();
  parts.push(keyDisplay);
  
  return useMacSymbols ? parts.join('') : parts.join('+');
}

/**
 * Check if keyboard event matches shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
    (shortcut.key === 'Space' && event.key === ' ');
  
  const ctrlMatches = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
  const altMatches = !!shortcut.alt === event.altKey;
  const shiftMatches = !!shortcut.shift === event.shiftKey;
  const metaMatches = !!shortcut.meta === event.metaKey;
  
  return keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches;
}

/**
 * Check if user is in Mac OS
 */
export function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');
  
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
    .filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
}

/**
 * Get first focusable element
 */
export function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[0] || null;
}

/**
 * Get last focusable element
 */
export function getLastFocusable(container: HTMLElement): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[elements.length - 1] || null;
}

// ============================================================================
// Keyboard Shortcut Manager (Singleton)
// ============================================================================

class KeyboardManager {
  private handlers: Map<string, ShortcutHandler[]> = new Map();
  private isListening = false;
  private globalListener: ((event: KeyboardEvent) => void) | null = null;

  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.meta) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  register(handler: ShortcutHandler): () => void {
    const key = this.getShortcutKey(handler.shortcut);
    
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    
    this.handlers.get(key)!.push(handler);
    this.startListening();
    
    // Return unregister function
    return () => {
      const handlers = this.handlers.get(key);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
        if (handlers.length === 0) {
          this.handlers.delete(key);
        }
      }
      
      if (this.handlers.size === 0) {
        this.stopListening();
      }
    };
  }

  private startListening(): void {
    if (this.isListening) return;
    
    this.globalListener = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.isContentEditable;
      
      for (const [, handlers] of this.handlers) {
        for (const handler of handlers) {
          if (handler.enabled === false) continue;
          
          if (matchesShortcut(event, handler.shortcut)) {
            // Allow shortcuts with modifiers even when typing
            if (isTyping && !handler.shortcut.ctrl && !handler.shortcut.alt && !handler.shortcut.meta) {
              continue;
            }
            
            if (handler.preventDefault !== false) {
              event.preventDefault();
            }
            if (handler.stopPropagation) {
              event.stopPropagation();
            }
            
            handler.handler(event);
            return;
          }
        }
      }
    };
    
    document.addEventListener('keydown', this.globalListener);
    this.isListening = true;
  }

  private stopListening(): void {
    if (!this.isListening || !this.globalListener) return;
    
    document.removeEventListener('keydown', this.globalListener);
    this.isListening = false;
    this.globalListener = null;
  }

  getRegisteredShortcuts(): KeyboardShortcut[] {
    const shortcuts: KeyboardShortcut[] = [];
    for (const [, handlers] of this.handlers) {
      for (const handler of handlers) {
        if (handler.enabled !== false && handler.shortcut.description) {
          shortcuts.push(handler.shortcut);
        }
      }
    }
    return shortcuts;
  }
}

export const keyboardManager = new KeyboardManager();

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut | string,
  handler: (event: KeyboardEvent) => void,
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
): void {
  const { enabled = true, preventDefault = true, stopPropagation = false } = options;
  const handlerRef = useRef(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const parsedShortcut = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;
    
    const unregister = keyboardManager.register({
      shortcut: parsedShortcut,
      handler: (e) => handlerRef.current(e),
      enabled,
      preventDefault,
      stopPropagation,
    });
    
    return unregister;
  }, [shortcut, enabled, preventDefault, stopPropagation]);
}

/**
 * Hook for registering multiple keyboard shortcuts
 */
export function useKeyboardShortcuts(
  shortcuts: Array<{
    shortcut: KeyboardShortcut | string;
    handler: (event: KeyboardEvent) => void;
    enabled?: boolean;
  }>
): void {
  useEffect(() => {
    const unregisters = shortcuts.map(({ shortcut, handler, enabled = true }) => {
      const parsedShortcut = typeof shortcut === 'string' ? parseShortcut(shortcut) : shortcut;
      return keyboardManager.register({
        shortcut: parsedShortcut,
        handler,
        enabled,
      });
    });
    
    return () => {
      unregisters.forEach(unregister => unregister());
    };
  }, [shortcuts]);
}

/**
 * Hook for focus trap within a container
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    enabled?: boolean;
    initialFocus?: 'first' | 'container' | React.RefObject<HTMLElement>;
    returnFocus?: boolean;
  } = {}
): void {
  const { enabled = true, initialFocus = 'first', returnFocus = true } = options;
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!enabled || !containerRef.current) return;
    
    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Set initial focus
    const container = containerRef.current;
    if (initialFocus === 'first') {
      const first = getFirstFocusable(container);
      first?.focus();
    } else if (initialFocus === 'container') {
      container.focus();
    } else if (initialFocus && 'current' in initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    }
    
    // Handle tab key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      
      const focusables = getFocusableElements(container);
      if (focusables.length === 0) return;
      
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      
      if (event.shiftKey) {
        if (document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last && first) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      // Return focus
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [enabled, containerRef, initialFocus, returnFocus]);
}

/**
 * Hook for arrow key navigation (roving tabindex)
 */
export function useArrowNavigation<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onNavigate?: (index: number, element: HTMLElement) => void;
    selector?: string;
  } = {}
): {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
} {
  const { 
    orientation = 'vertical', 
    loop = true, 
    onNavigate,
    selector = '[role="option"], [role="menuitem"], [role="tab"], button, a'
  } = options;
  
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current) return;
    
    const items = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(selector)
    ).filter(el => !el.hasAttribute('disabled'));
    
    if (items.length === 0) return;
    
    let newIndex = focusedIndex;
    
    const isNext = (orientation === 'horizontal' && event.key === 'ArrowRight') ||
                   (orientation === 'vertical' && event.key === 'ArrowDown') ||
                   (orientation === 'both' && (event.key === 'ArrowRight' || event.key === 'ArrowDown'));
    
    const isPrev = (orientation === 'horizontal' && event.key === 'ArrowLeft') ||
                   (orientation === 'vertical' && event.key === 'ArrowUp') ||
                   (orientation === 'both' && (event.key === 'ArrowLeft' || event.key === 'ArrowUp'));
    
    if (isNext) {
      event.preventDefault();
      newIndex = loop 
        ? (focusedIndex + 1) % items.length 
        : Math.min(focusedIndex + 1, items.length - 1);
    } else if (isPrev) {
      event.preventDefault();
      newIndex = loop 
        ? (focusedIndex - 1 + items.length) % items.length 
        : Math.max(focusedIndex - 1, 0);
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = items.length - 1;
    }
    
    const item = items[newIndex];
    if (newIndex !== focusedIndex && item) {
      setFocusedIndex(newIndex);
      item.focus();
      onNavigate?.(newIndex, item);
    }
  }, [containerRef, focusedIndex, orientation, loop, onNavigate, selector]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, handleKeyDown]);
  
  return { focusedIndex, setFocusedIndex };
}

/**
 * Hook for escape key handling
 */
export function useEscapeKey(
  handler: () => void,
  options: { enabled?: boolean } = {}
): void {
  const { enabled = true } = options;
  
  useKeyboardShortcut(
    { key: 'Escape' },
    handler,
    { enabled }
  );
}

/**
 * Hook for enter key handling
 */
export function useEnterKey(
  handler: () => void,
  options: { enabled?: boolean; preventDefault?: boolean } = {}
): void {
  const { enabled = true, preventDefault = true } = options;
  
  useKeyboardShortcut(
    { key: 'Enter' },
    handler,
    { enabled, preventDefault }
  );
}

/**
 * Hook for command palette (Ctrl/Cmd + K)
 */
export function useCommandPalette(
  handler: () => void,
  options: { enabled?: boolean } = {}
): void {
  const { enabled = true } = options;
  
  useKeyboardShortcut(
    { key: 'k', ctrl: true },
    handler,
    { enabled }
  );
}

/**
 * Hook for search (/)
 */
export function useSearchShortcut(
  handler: () => void,
  options: { enabled?: boolean } = {}
): void {
  const { enabled = true } = options;
  
  useKeyboardShortcut(
    { key: '/' },
    handler,
    { enabled }
  );
}

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Focus an element by ID
 */
export function focusElement(id: string): boolean {
  const element = document.getElementById(id);
  if (element) {
    element.focus();
    return true;
  }
  return false;
}

/**
 * Focus next focusable element
 */
export function focusNext(container?: HTMLElement): boolean {
  const root = container || document.body;
  const focusables = getFocusableElements(root);
  const currentIndex = focusables.findIndex(el => el === document.activeElement);
  
  const nextElement = focusables[currentIndex + 1];
  if (currentIndex >= 0 && currentIndex < focusables.length - 1 && nextElement) {
    nextElement.focus();
    return true;
  }
  
  return false;
}

/**
 * Focus previous focusable element
 */
export function focusPrevious(container?: HTMLElement): boolean {
  const root = container || document.body;
  const focusables = getFocusableElements(root);
  const currentIndex = focusables.findIndex(el => el === document.activeElement);
  
  const prevElement = focusables[currentIndex - 1];
  if (currentIndex > 0 && prevElement) {
    prevElement.focus();
    return true;
  }
  
  return false;
}

// ============================================================================
// Common Shortcuts Configuration
// ============================================================================

export const COMMON_SHORTCUTS = {
  // Navigation
  search: { key: '/' as const, description: 'חיפוש' },
  commandPalette: { key: 'k' as const, ctrl: true, description: 'פתח Command Palette' },
  escape: { key: 'Escape' as const, description: 'סגור/בטל' },
  
  // Actions
  save: { key: 's' as const, ctrl: true, description: 'שמור' },
  newItem: { key: 'n' as const, ctrl: true, description: 'פריט חדש' },
  delete: { key: 'Delete' as const, description: 'מחק' },
  edit: { key: 'e' as const, description: 'ערוך' },
  
  // Navigation
  goHome: { key: 'h' as const, alt: true, description: 'בית' },
  goTasks: { key: 't' as const, alt: true, description: 'משימות' },
  goCalendar: { key: 'c' as const, alt: true, description: 'לוח שנה' },
  goSettings: { key: ',' as const, ctrl: true, description: 'הגדרות' },
  
  // View
  toggleSidebar: { key: 'b' as const, ctrl: true, description: 'הצג/הסתר סרגל צד' },
  toggleDarkMode: { key: 'd' as const, ctrl: true, shift: true, description: 'החלף מצב כהה' },
  
  // Help
  showShortcuts: { key: '?' as const, shift: true, description: 'הצג קיצורי מקלדת' },
} as const;

export type CommonShortcutKey = keyof typeof COMMON_SHORTCUTS;
