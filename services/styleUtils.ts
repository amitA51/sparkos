// --- Helper functions for dynamic theme generation ---
import { BackgroundEffectType } from '../types';

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1]!, 16), g: parseInt(result[2]!, 16), b: parseInt(result[3]!, 16) }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string =>
  '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

// Theme Presets Definition
// מעצב את ערכות הנושא כך שירגישו עמוקות, יוקרתיות ו"מיליון דולר".

// ═══════════════════════════════════════════════════════════════
// OBSIDIAN AIR - Apple Premium Aesthetics
// "Obsidian Mesh" - Ambient Light & Titanium
// ═══════════════════════════════════════════════════════════════
const OBSIDIAN_AIR_BASE = {
  name: 'Obsidian Air',
  colors: {
    bgPrimary: '#050505',
    bgSecondary: '#050505', // True Dark
    bgTertiary: 'rgba(30, 30, 35, 0.70)', // Super Glass Base
    borderPrimary: 'rgba(255, 255, 255, 0.15)',
    accentStart: '#FFFFFF', // Titanium White
    accentEnd: '#E5E5E5',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
  },
  // "Ambient Mesh" - will be handled by CSS class .bg-mesh-obsidian
  backgroundImage: 'none',
} as const;

// ═══════════════════════════════════════════════════════════════
// NEBULA - Holographic Void Theme
// "Premium of the Premium" - Cinematic Dark Interface
// ═══════════════════════════════════════════════════════════════
const NEBULA_BASE = {
  name: 'Nebula',
  colors: {
    // The Void Canvas - NEVER solid black, always breathing depth
    bgPrimary: '#050505', // Deep void base
    bgSecondary: '#131318', // Slightly lighter void
    bgTertiary: '#0A0A0F', // Card layer base (opacity applied separately)
    // Light as Borders - edges defined by light, not shadow
    borderPrimary: 'rgba(255, 255, 255, 0.08)',
    // Aurora Gradient Accents - Electric Violet to Cyber Cyan
    accentStart: '#7F00FF', // Electric Violet
    accentEnd: '#00D1FF', // Cyber Cyan
    // Typography - soft whites, cool grays
    textPrimary: '#F0F2F5', // Primary text - nearly white but softer
    textSecondary: '#9CA3AF', // Cool gray metallic
  },
  // Radial gradient for infinite depth - the "breathing" void
  backgroundImage: 'radial-gradient(circle at top center, #131318 0%, #050505 100%)',
  // Glass properties for holographic surfaces
  glass: {
    background: 'rgba(20, 20, 25, 0.7)', // Deep charcoal with high transparency
    blur: '20px', // Heavy blur for premium glass look
    saturate: '150%', // Rich refraction effect
    innerGlow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
  },
} as const;

// בסיסים משותפים לכמה ערכות – כדי שלא נשכפל קוד
const DEEP_COSMOS_BASE = {
  name: 'Deep Cosmos',
  colors: {
    // חלל עמוק עם קונטרסט חזק אבל לא צורם
    bgPrimary: '#020617', // slate-950
    bgSecondary: '#020617',
    bgTertiary: '#0f172a',
    borderPrimary: 'rgba(148, 163, 184, 0.35)',
    accentStart: '#818CF8',
    accentEnd: '#22D3EE',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
  },
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(129,140,248,0.35) 0, transparent 55%),' +
    'radial-gradient(circle at 100% 0%, rgba(56,189,248,0.25) 0, transparent 55%),' +
    'linear-gradient(to bottom, #020617, #020617 40%, #020617)',
} as const;

const FOREST_EMERALD_BASE = {
  name: 'Forest Emerald',
  colors: {
    bgPrimary: '#020b07',
    bgSecondary: '#02130c',
    bgTertiary: '#052e16',
    borderPrimary: 'rgba(34,197,94,0.28)',
    accentStart: '#22C55E',
    accentEnd: '#A3E635',
    textPrimary: '#ECFDF5',
    textSecondary: '#BBF7D0',
  },
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.35) 0, transparent 55%),' +
    'linear-gradient(to bottom, #020b07, #052e16)',
} as const;

const SUNSET_GOLD_BASE = {
  name: 'Sunset Gold',
  colors: {
    bgPrimary: '#05020b',
    bgSecondary: '#111827',
    bgTertiary: '#1f2937',
    borderPrimary: 'rgba(251,191,36,0.3)',
    accentStart: '#FBBF24',
    accentEnd: '#F97316',
    textPrimary: '#FEFCE8',
    textSecondary: '#FACC15',
  },
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(251,191,36,0.35) 0, transparent 50%),' +
    'linear-gradient(to bottom, #05020b, #111827)',
} as const;

const OCEANIC_BASE = {
  name: 'Oceanic Aurora',
  colors: {
    bgPrimary: '#020617',
    bgSecondary: '#020617',
    bgTertiary: '#0b1120',
    borderPrimary: 'rgba(56,189,248,0.3)',
    accentStart: '#0EA5E9',
    accentEnd: '#22C1C3',
    textPrimary: '#E0F2FE',
    textSecondary: '#BAE6FD',
  },
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(14,165,233,0.4) 0, transparent 55%),' +
    'radial-gradient(circle at 100% 0%, rgba(45,212,191,0.28) 0, transparent 55%),' +
    'linear-gradient(to bottom, #020617, #0b1120)',
} as const;

const CRIMSON_BASE = {
  name: 'Crimson Bloom',
  colors: {
    bgPrimary: '#13020f',
    bgSecondary: '#1f0714',
    bgTertiary: '#3b0822',
    borderPrimary: 'rgba(248,113,113,0.3)',
    accentStart: '#EC4899',
    accentEnd: '#FB7185',
    textPrimary: '#FDF2F8',
    textSecondary: '#FECDD3',
  },
  backgroundImage:
    'radial-gradient(circle at 0% 0%, rgba(236,72,153,0.35) 0, transparent 55%),' +
    'linear-gradient(to bottom, #13020f, #1f0714)',
} as const;

const MINIMAL_WHITE_BASE = {
  name: 'Minimal White',
  colors: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F1F5F9',
    bgTertiary: '#E2E8F0',
    borderPrimary: '#CBD5E1',
    accentStart: '#2563EB',
    accentEnd: '#1D4ED8',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
  },
  backgroundImage: 'none',
} as const;

// מפה משותפת לכל ערכות הנושא, כולל שמות ישנים/חדשים
export const THEME_PRESETS = {
  // בסיס מקורי
  deepCosmos: DEEP_COSMOS_BASE,
  neonCyberpunk: CRIMSON_BASE,
  sunsetVibes: SUNSET_GOLD_BASE,
  forestZen: FOREST_EMERALD_BASE,
  minimalWhite: MINIMAL_WHITE_BASE,

  // שמות חדשים שנראים במסך ההגדרות
  ObsidianAir: OBSIDIAN_AIR_BASE,
  Nebula: NEBULA_BASE,
  Emerald: FOREST_EMERALD_BASE,
  Gold: SUNSET_GOLD_BASE,
  Oceanic: OCEANIC_BASE,
  Crimson: CRIMSON_BASE,
  Midnight: DEEP_COSMOS_BASE,

  // שמות ישנים שהיו ב-defaultSettings
  Sage: FOREST_EMERALD_BASE,
  Champagne: SUNSET_GOLD_BASE,
  Glacier: OCEANIC_BASE,
  Rose: CRIMSON_BASE,
} as const;

export const getThemeVariables = (
  themeName: keyof typeof THEME_PRESETS = 'deepCosmos',
  customAccentColor?: string,
  backgroundEffect?: BackgroundEffectType
) => {
  const theme = THEME_PRESETS[themeName] || THEME_PRESETS.deepCosmos;
  const { colors } = theme;

  // Use custom color if provided, otherwise use theme colors
  const accentStart = customAccentColor || colors.accentStart;
  const accentEnd = customAccentColor
    ? adjustColorBrightness(customAccentColor, -20)
    : colors.accentEnd;

  const rgbStart = hexToRgb(accentStart);

  // Apply Strong Black Overrides if enabled
  const isOled = backgroundEffect === 'oled';
  const bgPrimary = isOled ? '#000000' : colors.bgPrimary;
  const bgSecondary = isOled ? '#000000' : colors.bgSecondary;
  const bgTertiary = isOled ? '#0A0A0A' : colors.bgTertiary;
  const backgroundImage = isOled ? 'none' : theme.backgroundImage;

  // Nebula & Obsidian Air Glass Logic
  const isNebula = themeName === 'Nebula';
  const isObsidian = themeName === 'ObsidianAir';

  let glassBackground = 'rgba(15, 15, 26, 0.6)';
  let glassBlur = '16px';
  let glassSaturate = '100%';
  let glassInnerGlow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)';

  if (isNebula) {
    glassBackground = 'rgba(20, 20, 25, 0.7)';
    glassBlur = '20px';
    glassSaturate = '150%';
    glassInnerGlow = 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)';
  } else if (isObsidian) {
    glassBackground = 'rgba(30, 30, 35, 0.70)';
    glassBlur = '24px';
    glassSaturate = '180%';
    glassInnerGlow = 'inset 0 1px 0 0 rgba(255, 255, 255, 1)'; // Inner Highlight
  }

  // Override background image for Obsidian (handled by class)
  const finalBackgroundImage = isObsidian ? 'none' : backgroundImage;

  return {
    '--bg-primary': bgPrimary,
    '--bg-secondary': bgSecondary,
    '--bg-tertiary': bgTertiary,
    '--border-primary': colors.borderPrimary,
    '--dynamic-accent-start': accentStart,
    '--dynamic-accent-end': accentEnd,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    '--accent-gradient': `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
    '--dynamic-accent-glow': rgbStart
      ? `rgba(${rgbStart.r}, ${rgbStart.g}, ${rgbStart.b}, 0.3)`
      : 'rgba(0, 240, 255, 0.3)',
    '--dynamic-accent-color': rgbStart
      ? `rgba(${rgbStart.r}, ${rgbStart.g}, ${rgbStart.b}, 0.08)`
      : 'rgba(0, 240, 255, 0.08)',
    '--bg-image': finalBackgroundImage,
    // Glass Surface Variables
    '--glass-background': glassBackground,
    '--glass-blur': glassBlur,
    '--glass-saturate': glassSaturate,
    '--glass-inner-glow': glassInnerGlow,
    // Aurora/Titanium accent
    '--aurora-gradient': isNebula
      ? 'linear-gradient(135deg, #7F00FF 0%, #00D1FF 100%)'
      : isObsidian
        ? 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)'
        : `linear-gradient(135deg, ${accentStart}, ${accentEnd})`,
  };
};

// Helper function to convert hex to HSL (Hue, Saturation, Lightness)
export const hexToHSL = (hex: string): [number, number, number] => {
  const rgb = hexToRgb(hex || '#000000'); // Added fallback for hex1 parameter as per instruction
  if (!rgb) return [0, 0, 0]; // Default to black HSL if hex is invalid

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => Math.max(0, Math.min(255, value + (value * percent) / 100));

  return rgbToHex(Math.round(adjust(rgb.r)), Math.round(adjust(rgb.g)), Math.round(adjust(rgb.b)));
};
