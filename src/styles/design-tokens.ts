/**
 * ============================================================================
 * SPARKOS - DESIGN TOKENS (TypeScript)
 * Type-safe design tokens mapped to CSS variables
 * Single source of truth for all design decisions
 * ============================================================================
 */

/**
 * Color Palettes
 */
export const COLORS = {
  /** Primary accent (Blue iOS default) */
  accent: {
    DEFAULT: 'var(--accent)',
    hover: 'var(--accent-hover)',
    rgb: 'var(--accent-rgb)',
  },

  /** Semantic status colors */
  semantic: {
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    info: 'var(--info)',
    danger: 'var(--danger)',
    link: 'var(--link)',
  },

  /** Gray scale */
  gray: {
    50: 'var(--gray-50)',
    100: 'var(--gray-100)',
    150: 'var(--gray-150)',
    200: 'var(--gray-200)',
    300: 'var(--gray-300)',
    400: 'var(--gray-400)',
    500: 'var(--gray-500)',
    600: 'var(--gray-600)',
    700: 'var(--gray-700)',
    800: 'var(--gray-800)',
    900: 'var(--gray-900)',
  },

  /** Background colors */
  background: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    card: 'var(--bg-card)',
  },

  /** Text colors */
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
    inverse: 'var(--text-inverse)',
  },

  /** Border colors */
  border: {
    subtle: 'var(--border-subtle)',
    DEFAULT: 'var(--border-default)',
    strong: 'var(--border-strong)',
  },

  /** Surface colors */
  surface: {
    hover: 'var(--surface-hover)',
    pressed: 'var(--surface-pressed)',
    glass: 'var(--surface-glass)',
  },

  /** Dynamic accent (theme-aware) */
  dynamicAccent: {
    start: 'var(--dynamic-accent-start)',
    end: 'var(--dynamic-accent-end)',
    glow: 'var(--dynamic-accent-glow)',
    highlight: 'var(--dynamic-accent-highlight)',
    color: 'var(--dynamic-accent-color)',
  },

  /** iOS theme colors */
  ios: {
    pink: 'var(--color-ios-pink)',
    purple: 'var(--color-ios-purple)',
  },

  /** Cosmos theme colors */
  cosmos: {
    black: 'var(--color-cosmos-black)',
    depth: 'var(--color-cosmos-depth)',
  },

  /** =================================================================
     SPARK ACCENT SYSTEM
     Primary visual identity colors
     ================================================================= */
  spark: {
    /** Primary lime green accent */
    accent: {
      DEFAULT: 'var(--spark-accent)',
      hover: 'var(--spark-accent-hover)',
      rgb: 'var(--spark-accent-rgb)',
    },
    /** Secondary purple accent */
    accentSecondary: {
      DEFAULT: 'var(--spark-accent-secondary)',
      hover: 'var(--spark-accent-secondary-hover)',
      rgb: 'var(--spark-accent-secondary-rgb)',
    },
    /** Achievement colors */
    gold: 'var(--spark-gold)',
    cyan: 'var(--spark-cyan)',
    violet: 'var(--spark-violet)',
    magenta: 'var(--spark-magenta)',
    rose: 'var(--spark-rose)',
  },

  /** =================================================================
     FITNESS DATA COLOR SYSTEM
     For heatmaps, calendar stripes, progress indicators
     ================================================================= */
  fitness: {
    hot: 'var(--spark-fitness-hot)',       // Most active / priority
    warm: 'var(--spark-fitness-warm)',     // Recently active (1-3 days)
    good: 'var(--spark-fitness-good)',     // Moderately active (4-7 days)
    cool: 'var(--spark-fitness-cool)',     // Active / completed
    moderate: 'var(--spark-fitness-moderate)', // Moderate activity
    inactive: 'var(--spark-inactive)',     // No activity / future
    pr: 'var(--spark-fitness-pr)',         // Personal Record
    streak: 'var(--spark-fitness-streak)', // Active streak
  },

  /** Achievement / Gamification colors */
  achievement: {
    gold: 'var(--spark-gold)',
    cyan: 'var(--spark-cyan)',
    violet: 'var(--spark-violet)',
    magenta: 'var(--spark-magenta)',
    rose: 'var(--spark-rose)',
  },
} as const;

/**
 * Typography
 */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },

  fontSize: {
    micro: '0.6875rem', // 11px - micro labels
    xs: 'var(--text-xs)',    // 12px
    sm: 'var(--text-sm)',    // 14px
    base: 'var(--text-base)', // 16px
    lg: 'var(--text-lg)',    // 18px
    xl: 'var(--text-xl)',    // 20px
    '2xl': 'var(--text-2xl)', // 24px
    '3xl': 'var(--text-3xl)', // 30px
    '4xl': 'var(--text-4xl)', // 36px
  },

  fontWeight: {
    normal: 'var(--weight-normal)',
    medium: 'var(--weight-medium)',
    semibold: 'var(--weight-semibold)',
    bold: 'var(--weight-bold)',
  },

  lineHeight: {
    none: 'var(--leading-none)',
    tight: 'var(--leading-tight)',
    normal: 'var(--leading-normal)',
    relaxed: 'var(--leading-relaxed)',
  },

  letterSpacing: {
    tight: 'var(--tracking-tight)',
    normal: 'var(--tracking-normal)',
    wide: 'var(--tracking-wide)',
  },
} as const;

/**
 * Spacing (8px base grid)
 */
export const SPACING = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',  // 4px
  2: 'var(--space-2)',   // 8px
  3: 'var(--space-3)',   // 12px
  4: 'var(--space-4)',   // 16px
  5: 'var(--space-5)',   // 20px
  6: 'var(--space-6)',   // 24px
  8: 'var(--space-8)',   // 32px
  10: 'var(--space-10)', // 40px
  12: 'var(--space-12)', // 48px
  16: 'var(--space-16)', // 64px
  20: 'var(--space-20)', // 80px

  /** Semantic spacing */
  semantic: {
    xs: 'var(--gap-xs)',  // 4px
    sm: 'var(--gap-sm)',  // 8px
    md: 'var(--gap-md)',  // 16px
    lg: 'var(--gap-lg)',  // 24px
    xl: 'var(--gap-xl)',  // 32px
  },
} as const;

/**
 * Border Radius
 * Standardized radius values across the app
 */
export const RADIUS = {
  /** 6px - Micro elements (badges, tags) */
  sm: 'var(--radius-sm)',
  /** 10px - Base elements (buttons, inputs) */
  md: 'var(--radius-md)',
  /** 14px - Medium elements (cards, modals) */
  lg: 'var(--radius-lg)',
  /** 18px - Large elements */
  xl: 'var(--radius-xl)',
  /** 24px - Extra large elements (bottom sheets, full modals) */
  '2xl': 'var(--radius-2xl)',
  /** Full circle */
  full: 'var(--radius-full)',
  /** Semantic */
  modal: 'var(--radius-modal)',
} as const;

/**
 * Border Widths
 */
export const BORDER_WIDTH = {
  DEFAULT: 'var(--border-width)',
  2: 'var(--border-width-2)',
} as const;

/**
 * Shadows
 * Elevation system with theme-aware variants
 */
export const SHADOWS = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const;

/**
 * Glow Effects
 * Theme-aware glow shadows for emphasis
 */
export const GLOWS = {
  accent: {
    DEFAULT: 'var(--glow-accent)',
    strong: 'var(--glow-accent-strong)',
  },
  secondary: 'var(--glow-secondary)',
  gold: 'var(--glow-gold)',
  success: 'var(--glow-success)',
  cyan: 'var(--glow-cyan)',
  warning: 'var(--glow-warning)',
} as const;

/**
 * Motion / Animation
 */
export const MOTION = {
  easing: {
    out: 'var(--ease-out)',
    'in-out': 'var(--ease-in-out)',
    spring: 'var(--ease-spring)',
  },
  duration: {
    fast: 'var(--duration-fast)',   // 150ms
    base: 'var(--duration-base)',    // 250ms
    slow: 'var(--duration-slow)',   // 400ms
  },
} as const;

/**
 * Z-Index Scale
 */
export const Z_INDEX = {
  base: 'var(--z-base)',
  dropdown: 'var(--z-dropdown)',
  sticky: 'var(--z-sticky)',
  fixed: 'var(--z-fixed)',
  modal: 'var(--z-modal)',
  tooltip: 'var(--z-tooltip)',
} as const;

/**
 * Layout
 */
export const LAYOUT = {
  navHeight: 'var(--nav-height)',
  contentMaxWidth: 'var(--content-max-width)',
  gutter: 'var(--gutter)',
  touchTarget: 'var(--touch-target)',
  touchTargetLg: 'var(--touch-target-lg)',
  safeAreaTop: 'var(--safe-area-top)',
  safeAreaBottom: 'var(--safe-area-bottom)',
} as const;

/**
 * ============================================================================
 * TAILWIND HELPER CLASSES
 * Common class name combinations for quick reference
 * ============================================================================
 */

/** Button base classes */
export const BUTTON_BASE = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'transition-all',
  'duration-fast',
  'ease-out',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
].join(' ');

/** Card base classes */
export const CARD_BASE = [
  'bg-bg-card',
  'rounded-xl',
  'border',
  'border-border-subtle',
  'shadow-md',
].join(' ');

/** Input base classes */
export const INPUT_BASE = [
  'w-full',
  'px-4',
  'py-3',
  'bg-bg-secondary',
  'border',
  'border-border-default',
  'rounded-lg',
  'text-text-primary',
  'placeholder:text-text-muted',
  'focus:outline-none',
  'focus:border-primary',
  'focus:ring-2',
  'focus:ring-primary/20',
  'transition-all',
  'duration-base',
].join(' ');

/**
 * ============================================================================
 * DESIGN TOKEN GROUPINGS BY USE CASE
 * ============================================================================
 */

/** Colors for creating gradients */
export const GRADIENTS = {
  /** Accent gradient (blue → purple) */
  accent: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
  /** Spark accent gradient */
  spark: 'linear-gradient(135deg, var(--spark-accent), var(--spark-accent-secondary))',
  /** Gold gradient */
  gold: 'linear-gradient(135deg, var(--spark-gold), var(--spark-amber))',
  /** Achievement gradient */
  achievement: 'linear-gradient(135deg, var(--spark-cyan), var(--spark-violet))',
  /** Fitness intensity gradient */
  fitnessIntensity: [
    'var(--spark-inactive)',
    'var(--spark-fitness-moderate)',
    'var(--spark-fitness-good)',
    'var(--spark-fitness-warm)',
    'var(--spark-fitness-hot)',
  ],
} as const;

/** Colors for badges / status indicators */
export const BADGE_COLORS = {
  success: ['bg-success/10', 'text-success', 'ring-success/20'],
  warning: ['bg-warning/10', 'text-warning', 'ring-warning/20'],
  error: ['bg-error/10', 'text-error', 'ring-error/20'],
  info: ['bg-info/10', 'text-info', 'ring-info/20'],
  accent: ['bg-spark-accent/10', 'text-spark-accent', 'ring-spark-accent/20'],
  gold: ['bg-achievement-gold/10', 'text-achievement-gold', 'ring-achievement-gold/20'],
  violet: ['bg-achievement-violet/10', 'text-achievement-violet', 'ring-achievement-violet/20'],
} as const;

/**
 * ============================================================================
 * USAGE EXAMPLE
 * ============================================================================
 *
 * // Using Tailwind classes (recommended for most cases)
 * <div className="bg-spark-accent text-text-primary rounded-xl shadow-glow-accent">
 *
 * // Using CSS variables directly (for inline styles)
 * <div style={{ backgroundColor: 'var(--spark-accent)' }}>
 *
 * // Using TypeScript tokens
 * import { COLORS, TYPOGRAPHY, RADIUS } from './design-tokens';
 * <div style={{ backgroundColor: COLORS.spark.accent.DEFAULT, borderRadius: RADIUS.lg }}>
 *
 * ============================================================================
 */

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  BORDER_WIDTH,
  SHADOWS,
  GLOWS,
  MOTION,
  Z_INDEX,
  LAYOUT,
  GRADIENTS,
  BADGE_COLORS,
  BUTTON_BASE,
  CARD_BASE,
  INPUT_BASE,
};
