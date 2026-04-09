import { useEffect } from 'react';
import { ThemeSettings, UiDensity, AnimationIntensity } from '../types';

interface UseThemeEffectProps {
  themeSettings: ThemeSettings;
  uiDensity: UiDensity;
  animationIntensity: AnimationIntensity;
  fontSizeScale: number;
}

/**
 * Simple dual-theme effect: light or dark.
 * Sets data-theme on <html>, updates meta theme-color, applies density/animation/font classes.
 */
export const useThemeEffect = ({
  themeSettings,
  uiDensity,
  animationIntensity,
  fontSizeScale,
}: UseThemeEffectProps) => {
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    // 1. Determine theme: light or dark
    // ---------------------------------
    // Themes that are dark (legacy names map to dark)
    const DARK_THEMES = [
      'ObsidianAir', 'Deep Cosmos', 'Midnight', 'Nebula',
      'Forest Emerald', 'Oceanic Aurora', 'Glacier',
      'Sunset Gold', 'Crimson Bloom', 'Champagne', 'Rose',
    ];

    const isDark = DARK_THEMES.includes(themeSettings.name);
    const theme = isDark ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);

    // 2. Update meta theme-color for browser chrome
    // ----------------------------------------------
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#000000' : '#F2F2F7');
    }

    // 3. Apply density classes
    // ------------------------
    body.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    body.classList.add(`density-${uiDensity}`);

    // 4. Apply animation intensity
    // ----------------------------
    body.classList.remove('animations-off', 'animations-subtle', 'animations-default', 'animations-full');
    body.classList.add(`animations-${animationIntensity}`);

    // 5. Apply font family
    // --------------------
    body.classList.remove(
      'font-inter', 'font-lato', 'font-source-code-pro', 'font-heebo',
      'font-rubik', 'font-alef', 'font-poppins', 'font-marcelo', 'font-satoshi'
    );
    const fontName = themeSettings.font
      ? `font-${themeSettings.font.replace(/_/g, '-')}`
      : 'font-satoshi';
    body.classList.add(fontName);

    // 6. Apply font scale
    // -------------------
    root.style.setProperty('--font-scale', fontSizeScale.toString());

    // 7. Clean up any old inline style overrides from legacy styleUtils
    // ----------------------------------------------------------------
    // Remove all the CSS variable overrides that were injected inline
    const legacyVars = [
      '--bg-primary', '--bg-secondary', '--bg-tertiary', '--bg-card',
      '--border-primary', '--dynamic-accent-start', '--dynamic-accent-end',
      '--text-primary', '--text-secondary', '--accent-gradient',
      '--dynamic-accent-glow', '--dynamic-accent-color', '--bg-image',
      '--glass-background', '--glass-blur', '--glass-saturate',
      '--glass-inner-glow', '--aurora-gradient',
    ];
    legacyVars.forEach(v => root.style.removeProperty(v));

  }, [themeSettings, uiDensity, animationIntensity, fontSizeScale]);
};
