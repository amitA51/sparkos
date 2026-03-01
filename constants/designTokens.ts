/**
 * Design Tokens for Spark OS
 * Centralized design system values for consistency across the app
 */

// ========================================
// Spacing Scale (4px base unit)
// ========================================
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

// Numeric values for calculations
export const SPACING_NUM = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

// ========================================
// Typography Scale
// ========================================
export const FONT_SIZE = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const FONT_WEIGHT = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LINE_HEIGHT = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

// ========================================
// Border Radius
// ========================================
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ========================================
// Shadows
// ========================================
export const SHADOW = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px var(--dynamic-accent-glow)',
} as const;

// ========================================
// Z-Index Scale (Prevent z-index chaos)
// ========================================
export const Z_INDEX = {
  background: -10,
  base: 0,
  dropdown: 10,
  overlay: 20,
  modal: 30,
  popover: 40,
  toast: 50,
  tooltip: 60,
} as const;

// ========================================
// Transitions & Animations
// ========================================
export const TRANSITION = {
  fast: '150ms ease',
  base: '300ms ease',
  slow: '500ms ease',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const ANIMATION_DURATION = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// ========================================
// Breakpoints (Mobile-first)
// ========================================
export const BREAKPOINT = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ========================================
// Opacity Scale
// ========================================
export const OPACITY = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',
  90: '0.9',
  100: '1',
} as const;

// ========================================
// Component-Specific Tokens
// ========================================

export const INPUT_HEIGHT = {
  sm: '32px',
  md: '40px',
  lg: '48px',
} as const;

export const BUTTON_PADDING = {
  sm: `${SPACING.sm} ${SPACING.lg}`,
  md: `${SPACING.md} ${SPACING.xl}`,
  lg: `${SPACING.lg} ${SPACING['2xl']}`,
} as const;

export const CARD_PADDING = {
  sm: SPACING.lg,
  md: SPACING.xl,
  lg: SPACING['2xl'],
} as const;

// ========================================
// Helper Functions
// ========================================

/**
 * Create a consistent spacing string from multiple values
 * @example spacing('lg', 'xl') => '16px 24px'
 */
export const spacing = (...values: (keyof typeof SPACING)[]) =>
  values.map(v => SPACING[v]).join(' ');

/**
 * Create a box shadow with dynamic accent color
 * @example glowShadow('md') => '0 4px 6px -1px var(--dynamic-accent-glow)'
 */
export const glowShadow = (size: keyof typeof SHADOW = 'md') =>
  SHADOW[size].replace('rgba(0, 0, 0', 'var(--dynamic-accent-glow-rgb');

/**
 * Type-safe design token access
 */
export type Spacing = keyof typeof SPACING;
export type FontSize = keyof typeof FONT_SIZE;
export type BorderRadius = keyof typeof BORDER_RADIUS;
export type Shadow = keyof typeof SHADOW;

// ========================================
// Color Palettes
// ========================================

/**
 * Semantic colors for consistent theming
 */
export const SEMANTIC_COLORS = {
  // Status colors
  success: {
    light: 'rgb(34, 197, 94)',
    DEFAULT: 'rgb(22, 163, 74)',
    dark: 'rgb(21, 128, 61)',
    bg: 'rgba(34, 197, 94, 0.1)',
  },
  warning: {
    light: 'rgb(251, 191, 36)',
    DEFAULT: 'rgb(245, 158, 11)',
    dark: 'rgb(217, 119, 6)',
    bg: 'rgba(251, 191, 36, 0.1)',
  },
  error: {
    light: 'rgb(248, 113, 113)',
    DEFAULT: 'rgb(239, 68, 68)',
    dark: 'rgb(220, 38, 38)',
    bg: 'rgba(239, 68, 68, 0.1)',
  },
  info: {
    light: 'rgb(96, 165, 250)',
    DEFAULT: 'rgb(59, 130, 246)',
    dark: 'rgb(37, 99, 235)',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
} as const;

/**
 * Premium accent color presets
 */
export const ACCENT_PRESETS = {
  cosmic: {
    start: '#a855f7',
    end: '#6366f1',
    glow: 'rgba(168, 85, 247, 0.5)',
  },
  ocean: {
    start: '#06b6d4',
    end: '#3b82f6',
    glow: 'rgba(6, 182, 212, 0.5)',
  },
  sunset: {
    start: '#f97316',
    end: '#ef4444',
    glow: 'rgba(249, 115, 22, 0.5)',
  },
  forest: {
    start: '#22c55e',
    end: '#10b981',
    glow: 'rgba(34, 197, 94, 0.5)',
  },
  aurora: {
    start: '#8b5cf6',
    end: '#06b6d4',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
  rose: {
    start: '#f43f5e',
    end: '#ec4899',
    glow: 'rgba(244, 63, 94, 0.5)',
  },
  gold: {
    start: '#fbbf24',
    end: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.5)',
  },
} as const;

// ========================================
// Glassmorphism Utilities
// ========================================

/**
 * Pre-built glassmorphism effect classes
 */
export const GLASS = {
  /** Subtle glass - light blur, minimal opacity */
  subtle: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  /** Standard glass - balanced blur and opacity */
  standard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  /** Prominent glass - stronger blur and border */
  prominent: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  /** Solid glass - highest opacity, for modals */
  solid: {
    background: 'rgba(10, 12, 16, 0.9)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
} as const;

/**
 * CSS class strings for glassmorphism
 */
export const GLASS_CLASSES = {
  subtle: 'bg-white/[0.03] backdrop-blur-sm border border-white/5',
  standard: 'bg-white/5 backdrop-blur-md border border-white/10',
  prominent: 'bg-white/[0.08] backdrop-blur-lg border border-white/[0.15]',
  solid: 'bg-[#0a0c10]/90 backdrop-blur-2xl border border-white/10',
  card: 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl',
  modal: 'bg-[var(--bg-card)] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl',
} as const;

// ========================================
// Touch Targets (Accessibility)
// ========================================

/**
 * Minimum touch target sizes per WCAG 2.1
 */
export const TOUCH_TARGET = {
  /** Minimum for AAA compliance (44px) */
  minimum: '44px',
  /** Comfortable touch size (48px) */
  comfortable: '48px',
  /** Large touch targets for fat fingers (56px) */
  large: '56px',
} as const;

// ========================================
// Container Widths
// ========================================

export const CONTAINER = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  prose: '65ch', // Optimal reading width
} as const;

// ========================================
// Grid Utilities
// ========================================

export const GRID = {
  gap: {
    xs: SPACING.xs,
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
    xl: SPACING.xl,
  },
  columns: {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    auto: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
} as const;

// ========================================
// Focus States (Accessibility)
// ========================================

export const FOCUS = {
  /** Default focus ring */
  ring: '0 0 0 2px var(--cosmos-accent-primary)',
  /** Focus ring with offset */
  ringOffset: '0 0 0 2px var(--bg-primary), 0 0 0 4px var(--cosmos-accent-primary)',
  /** High contrast focus for accessibility */
  highContrast: '0 0 0 3px #fff, 0 0 0 5px var(--cosmos-accent-primary)',
} as const;

/**
 * Focus ring CSS class
 */
export const FOCUS_CLASSES = {
  default: 'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:ring-offset-2 focus:ring-offset-transparent',
  within: 'focus-within:ring-2 focus-within:ring-[var(--cosmos-accent-primary)]',
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cosmos-accent-primary)]',
} as const;

// ========================================
// Type Exports
// ========================================

export type GlassVariant = keyof typeof GLASS;
export type AccentPreset = keyof typeof ACCENT_PRESETS;
export type SemanticColor = keyof typeof SEMANTIC_COLORS;
