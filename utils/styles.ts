/**
 * Tailwind CSS Utility Classes
 * 
 * Reusable className compositions following Tailwind v4 patterns.
 * Use with `cn()` helper for conditional class merging.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution
 * @example cn('p-4', 'p-8') => 'p-8'
 * @example cn('text-red-500', isActive && 'text-blue-500') => 'text-blue-500' when isActive
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Layout Utilities
// ============================================================================

export const layout = {
  /** Centered flex container */
  center: 'flex items-center justify-center',
  /** Centered with full height */
  centerScreen: 'min-h-screen flex items-center justify-center',
  /** Vertical stack with gap */
  stack: (gap: number = 4) => `flex flex-col gap-${gap}`,
  /** Horizontal row with gap */
  row: (gap: number = 4) => `flex flex-row gap-${gap}`,
  /** Space between items */
  between: 'flex items-center justify-between',
  /** Full width container */
  container: 'w-full max-w-7xl mx-auto px-4',
  /** Card container */
  card: 'rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]',
} as const;

// ============================================================================
// Interactive State Classes
// ============================================================================

export const interactive = {
  /** Standard button base */
  buttonBase: 'transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  /** Primary action button */
  buttonPrimary: cn(
    'bg-[var(--cosmos-accent-primary)] text-black',
    'hover:brightness-110 active:scale-[0.98]',
    'shadow-[0_0_15px_var(--dynamic-accent-glow)]'
  ),
  /** Secondary/ghost button */
  buttonSecondary: cn(
    'bg-white/5 text-white border border-white/10',
    'hover:bg-white/10 active:bg-white/15'
  ),
  /** Danger/destructive button */
  buttonDanger: cn(
    'bg-red-500/10 text-red-400 border border-red-500/20',
    'hover:bg-red-500/20 active:bg-red-500/30'
  ),
  /** Clickable card hover effect */
  cardHover: 'hover:border-[var(--border-hover)] hover:bg-white/5 transition-all cursor-pointer',
  /** Focus ring for accessibility */
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:ring-offset-2 focus:ring-offset-transparent',
  /** Tap target for mobile */
  tapTarget: 'min-h-[44px] min-w-[44px]',
} as const;

// ============================================================================
// Typography Utilities
// ============================================================================

export const typography = {
  /** Page title */
  pageTitle: 'text-2xl md:text-3xl font-black text-white',
  /** Section heading */
  sectionTitle: 'text-xl font-bold text-white',
  /** Card title */
  cardTitle: 'text-lg font-semibold text-white',
  /** Body text */
  body: 'text-base text-[var(--text-secondary)]',
  /** Small/secondary text */
  small: 'text-sm text-[var(--text-tertiary)]',
  /** Label text */
  label: 'text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]',
  /** Monospace for code/data */
  mono: 'font-mono text-sm',
  /** RTL text alignment (for Hebrew) */
  rtl: 'text-right',
  /** Truncate with ellipsis */
  truncate: 'truncate',
  /** Line clamp */
  lineClamp: (lines: number) => `line-clamp-${lines}`,
} as const;

// ============================================================================
// Animation Utilities
// ============================================================================

export const animation = {
  /** Fade in on mount */
  fadeIn: 'animate-fade-in',
  /** Slide up on mount */
  slideUp: 'animate-slide-up',
  /** Pulse attention */
  pulse: 'animate-pulse',
  /** Spin loader */
  spin: 'animate-spin',
  /** Bounce effect */
  bounce: 'animate-bounce',
  /** Scale on hover */
  scaleHover: 'hover:scale-105 transition-transform',
  /** Smooth transitions */
  transition: {
    all: 'transition-all duration-200',
    colors: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
    transform: 'transition-transform duration-200',
  },
} as const;

// ============================================================================
// Form Utilities
// ============================================================================

export const form = {
  /** Text input field */
  input: cn(
    'w-full px-4 py-3 rounded-xl',
    'bg-white/5 border border-white/10',
    'text-white placeholder:text-[var(--text-tertiary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:border-transparent',
    'transition-all duration-200'
  ),
  /** Textarea field */
  textarea: cn(
    'w-full px-4 py-3 rounded-xl resize-none',
    'bg-white/5 border border-white/10',
    'text-white placeholder:text-[var(--text-tertiary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:border-transparent'
  ),
  /** Select dropdown */
  select: cn(
    'w-full px-4 py-3 rounded-xl appearance-none cursor-pointer',
    'bg-white/5 border border-white/10',
    'text-white',
    'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)]'
  ),
  /** Form label */
  label: 'block text-sm font-medium text-[var(--text-secondary)] mb-2',
  /** Error message */
  error: 'text-sm text-red-400 mt-1',
  /** Help text */
  hint: 'text-xs text-[var(--text-tertiary)] mt-1',
} as const;

// ============================================================================
// Status/Badge Utilities
// ============================================================================

export const status = {
  /** Success indicator */
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  /** Warning indicator */
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  /** Error indicator */
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  /** Info indicator */
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  /** Neutral indicator */
  neutral: 'bg-white/5 text-[var(--text-secondary)] border-white/10',
  /** Badge base */
  badge: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
} as const;

// ============================================================================
// Spacing Utilities
// ============================================================================

export const spacing = {
  /** Page padding */
  page: 'px-4 py-6 md:px-6 md:py-8',
  /** Section spacing */
  section: 'py-8 md:py-12',
  /** Card padding */
  card: 'p-4 md:p-6',
  /** Tight card padding */
  cardCompact: 'p-3 md:p-4',
} as const;

// ============================================================================
// Glassmorphism Effects
// ============================================================================

export const glass = {
  /** Light glass effect */
  light: 'bg-white/5 backdrop-blur-sm',
  /** Medium glass effect */
  medium: 'bg-white/10 backdrop-blur-md',
  /** Strong glass effect */
  strong: 'bg-white/15 backdrop-blur-lg',
  /** Card with glass effect */
  card: cn(
    'bg-[var(--bg-card)]/90 backdrop-blur-xl',
    'border border-white/10',
    'rounded-2xl shadow-xl'
  ),
} as const;

// ============================================================================
// Component Presets
// ============================================================================

export const components = {
  /** Standard page container */
  page: cn(
    'min-h-screen bg-[var(--bg-primary)]',
    'text-white',
    spacing.page
  ),
  /** Modal backdrop */
  modalBackdrop: cn(
    'fixed inset-0 z-50',
    'bg-black/60 backdrop-blur-sm',
    'flex items-center justify-center',
    'p-4'
  ),
  /** Modal content */
  modalContent: cn(
    glass.card,
    'w-full max-w-md max-h-[90vh]',
    'overflow-y-auto',
    'p-6'
  ),
  /** Dropdown menu */
  dropdown: cn(
    glass.card,
    'py-2',
    'shadow-2xl',
    'animate-fade-in'
  ),
  /** Empty state container */
  emptyState: cn(
    layout.center,
    'flex-col gap-4',
    'py-12',
    'text-center'
  ),
  /** Loading spinner */
  spinner: cn(
    'h-8 w-8',
    'border-2 border-[var(--cosmos-accent-primary)] border-t-transparent',
    'rounded-full',
    animation.spin
  ),
} as const;

// ============================================================================
// Responsive Utilities
// ============================================================================

export const responsive = {
  /** Hide on mobile */
  hideOnMobile: 'hidden md:block',
  /** Show only on mobile */
  showOnMobile: 'block md:hidden',
  /** Grid that adapts */
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    auto: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
  },
} as const;

// ============================================================================
// Accessibility Utilities
// ============================================================================

export const a11y = {
  /** Screen reader only */
  srOnly: 'sr-only',
  /** Skip link */
  skipLink: cn(
    'absolute -top-10 left-0 z-50',
    'focus:top-0',
    'bg-[var(--cosmos-accent-primary)] text-black',
    'px-4 py-2 font-medium',
    'transition-all'
  ),
  /** Reduced motion preference */
  reducedMotion: 'motion-reduce:animate-none motion-reduce:transition-none',
} as const;
