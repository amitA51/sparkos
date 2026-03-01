/**
 * Tests for lib/keyboard.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  parseShortcut,
  formatShortcut,
  matchesShortcut,
  getFocusableElements,
  getFirstFocusable,
  getLastFocusable,
  COMMON_SHORTCUTS,
} from '../../lib/keyboard';

// ============================================================================
// parseShortcut Tests
// ============================================================================

describe('parseShortcut', () => {
  it('should parse simple key', () => {
    const result = parseShortcut('k');
    expect(result.key).toBe('k');
    expect(result.ctrl).toBeFalsy();
    expect(result.alt).toBeFalsy();
    expect(result.shift).toBeFalsy();
    expect(result.meta).toBeFalsy();
  });

  it('should parse ctrl+key', () => {
    const result = parseShortcut('ctrl+k');
    expect(result.key).toBe('k');
    expect(result.ctrl).toBe(true);
  });

  it('should parse alt+key', () => {
    const result = parseShortcut('alt+s');
    expect(result.key).toBe('s');
    expect(result.alt).toBe(true);
  });

  it('should parse shift+key', () => {
    const result = parseShortcut('shift+?');
    expect(result.key).toBe('?');
    expect(result.shift).toBe(true);
  });

  it('should parse meta+key', () => {
    const result = parseShortcut('meta+k');
    expect(result.key).toBe('k');
    expect(result.meta).toBe(true);
  });

  it('should parse cmd as meta', () => {
    const result = parseShortcut('cmd+k');
    expect(result.meta).toBe(true);
  });

  it('should parse complex combinations', () => {
    const result = parseShortcut('ctrl+shift+alt+k');
    expect(result.key).toBe('k');
    expect(result.ctrl).toBe(true);
    expect(result.shift).toBe(true);
    expect(result.alt).toBe(true);
  });

  it('should be case insensitive', () => {
    const result = parseShortcut('CTRL+K');
    expect(result.key).toBe('k');
    expect(result.ctrl).toBe(true);
  });
});

// ============================================================================
// formatShortcut Tests
// ============================================================================

describe('formatShortcut', () => {
  it('should format simple key', () => {
    const result = formatShortcut({ key: 'k' });
    expect(result).toBe('K');
  });

  it('should format with modifiers', () => {
    const result = formatShortcut({ key: 'k', ctrl: true });
    expect(result).toBe('Ctrl+K');
  });

  it('should format multiple modifiers', () => {
    const result = formatShortcut({ key: 'k', ctrl: true, shift: true });
    expect(result).toBe('Ctrl+Shift+K');
  });

  it('should use Mac symbols when requested', () => {
    const result = formatShortcut({ key: 'k', ctrl: true }, true);
    expect(result).toContain('⌃');
  });

  it('should format Space key correctly', () => {
    const result = formatShortcut({ key: 'Space' });
    expect(result).toBe('Space');
  });
});

// ============================================================================
// matchesShortcut Tests
// ============================================================================

describe('matchesShortcut', () => {
  it('should match simple key', () => {
    const event = new KeyboardEvent('keydown', { key: 'k' });
    const shortcut = { key: 'k' as const };
    expect(matchesShortcut(event, shortcut)).toBe(true);
  });

  it('should not match different key', () => {
    const event = new KeyboardEvent('keydown', { key: 'j' });
    const shortcut = { key: 'k' as const };
    expect(matchesShortcut(event, shortcut)).toBe(false);
  });

  it('should match with ctrl modifier', () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    const shortcut = { key: 'k' as const, ctrl: true };
    expect(matchesShortcut(event, shortcut)).toBe(true);
  });

  it('should not match if ctrl is missing', () => {
    const event = new KeyboardEvent('keydown', { key: 'k' });
    const shortcut = { key: 'k' as const, ctrl: true };
    expect(matchesShortcut(event, shortcut)).toBe(false);
  });

  it('should not match if extra ctrl is present', () => {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    const shortcut = { key: 'k' as const };
    expect(matchesShortcut(event, shortcut)).toBe(false);
  });

  it('should be case insensitive', () => {
    const event = new KeyboardEvent('keydown', { key: 'K' });
    const shortcut = { key: 'k' as const };
    expect(matchesShortcut(event, shortcut)).toBe(true);
  });

  it('should match Space key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });
    const shortcut = { key: 'Space' as const };
    expect(matchesShortcut(event, shortcut)).toBe(true);
  });
});

// ============================================================================
// DOM Focus Utilities Tests
// ============================================================================

describe('getFocusableElements', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should find buttons', () => {
    container.innerHTML = '<button>Click me</button>';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(1);
    expect(elements[0]?.tagName).toBe('BUTTON');
  });

  it('should find inputs', () => {
    container.innerHTML = '<input type="text" />';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(1);
    expect(elements[0]?.tagName).toBe('INPUT');
  });

  it('should exclude disabled elements', () => {
    container.innerHTML = '<button disabled>Disabled</button><button>Enabled</button>';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(1);
  });

  it('should find links with href', () => {
    container.innerHTML = '<a href="#">Link</a>';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(1);
    expect(elements[0]?.tagName).toBe('A');
  });

  it('should find elements with tabindex', () => {
    container.innerHTML = '<div tabindex="0">Focusable div</div>';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(1);
  });

  it('should exclude tabindex="-1"', () => {
    container.innerHTML = '<div tabindex="-1">Not focusable</div>';
    const elements = getFocusableElements(container);
    expect(elements.length).toBe(0);
  });
});

describe('getFirstFocusable', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should return first focusable element', () => {
    container.innerHTML = '<input id="first" /><button id="second">Button</button>';
    const first = getFirstFocusable(container);
    expect(first?.id).toBe('first');
  });

  it('should return null if no focusable elements', () => {
    container.innerHTML = '<div>Not focusable</div>';
    const first = getFirstFocusable(container);
    expect(first).toBeNull();
  });
});

describe('getLastFocusable', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should return last focusable element', () => {
    container.innerHTML = '<input id="first" /><button id="second">Button</button>';
    const last = getLastFocusable(container);
    expect(last?.id).toBe('second');
  });

  it('should return null if no focusable elements', () => {
    container.innerHTML = '<div>Not focusable</div>';
    const last = getLastFocusable(container);
    expect(last).toBeNull();
  });
});

// ============================================================================
// COMMON_SHORTCUTS Tests
// ============================================================================

describe('COMMON_SHORTCUTS', () => {
  it('should have search shortcut', () => {
    expect(COMMON_SHORTCUTS.search.key).toBe('/');
  });

  it('should have command palette shortcut', () => {
    expect(COMMON_SHORTCUTS.commandPalette.key).toBe('k');
    expect(COMMON_SHORTCUTS.commandPalette.ctrl).toBe(true);
  });

  it('should have escape shortcut', () => {
    expect(COMMON_SHORTCUTS.escape.key).toBe('Escape');
  });

  it('should have save shortcut', () => {
    expect(COMMON_SHORTCUTS.save.key).toBe('s');
    expect(COMMON_SHORTCUTS.save.ctrl).toBe(true);
  });

  it('should have Hebrew descriptions', () => {
    expect(COMMON_SHORTCUTS.search.description).toBe('חיפוש');
  });
});
