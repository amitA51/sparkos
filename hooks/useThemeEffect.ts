import { useEffect } from 'react';
import { ThemeSettings, UiDensity, AnimationIntensity } from '../types';
import { getThemeVariables } from '../services/styleUtils';

interface UseThemeEffectProps {
  themeSettings: ThemeSettings;
  uiDensity: UiDensity;
  animationIntensity: AnimationIntensity;
  fontSizeScale: number;
}

export const useThemeEffect = ({
  themeSettings,
  uiDensity,
  animationIntensity,
  fontSizeScale,
}: UseThemeEffectProps) => {
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;

    // 0. Restore Legacy Injection (Fix for Missing Colors)
    // --------------------------------------------------
    // Map human-readable theme names to design token presets where needed
    let presetKey: any = themeSettings.name as any;
    if (themeSettings.name === 'Minimal White') {
      presetKey = 'minimalWhite';
    }

    const palette = getThemeVariables(
      presetKey,
      themeSettings.accentColor,
      themeSettings.backgroundEffect
    );
    for (const [key, value] of Object.entries(palette)) {
      root.style.setProperty(key, value);
    }

    // 1. Map Legacy Theme Names to New Physics Universes
    // ------------------------------------------------
    let universe = 'obsidian'; // Default

    const themeName = themeSettings.name;
    if (themeName === 'Nebula' || themeName === 'Forest Emerald') {
      universe = 'neon';
    } else if (themeName === 'Oceanic Aurora' || themeName === 'Glacier') {
      universe = 'ocean';
    } else if (themeName === 'Sunset Gold' || themeName === 'Crimson Bloom' || themeName === 'Champagne' || themeName === 'Rose') {
      universe = 'solar';
    } else {
      // 'ObsidianAir', 'Deep Cosmos', 'Midnight', 'Minimal White'
      universe = 'obsidian';
    }

    // Explicit override for premium light theme
    if (themeName === 'Minimal White') {
      universe = 'light';
    }

    // 2. Activate the Physics Engine
    // ----------------------------
    root.setAttribute('data-theme', universe);

    // 3. Apply Utility Classes (Density/Animation)
    // -------------------------------------------
    body.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    body.classList.add(`density-${uiDensity}`);

    body.classList.remove('animations-off', 'animations-subtle', 'animations-default', 'animations-full');
    body.classList.add(`animations-${animationIntensity}`);

    // 4. Apply Font Family
    // ------------------
    body.classList.remove(
      'font-inter', 'font-lato', 'font-source-code-pro', 'font-heebo',
      'font-rubik', 'font-alef', 'font-poppins', 'font-marcelo', 'font-satoshi'
    );
    // Default to Satoshi if not specified or clean up the string
    const fontName = themeSettings.font
      ? `font-${themeSettings.font.replace(/_/g, '-')}`
      : 'font-satoshi';
    body.classList.add(fontName);

    // 5. Apply Font Scale
    // -----------------
    root.style.setProperty('--font-scale', fontSizeScale.toString());

    // 6. Premium Backgrounds Visibility (Ensure body is transparent)
    // -----------------------------------------------------------
    // The body background (set earlier) is opaque and covers the fixed DynamicBackground components.
    // We must make it transparent when using a premium effect so the background component (z-index: -50) is visible.
    const isPremiumEffect = ['ambient-mesh', 'aurora-flow', 'silk-waves', 'particle-dust', 'particles', 'aurora', 'dark', 'oled'].includes(themeSettings.backgroundEffect);

    if (isPremiumEffect && themeSettings.backgroundEffect !== 'off') {
      root.style.setProperty('--bg-image', 'none');
      root.style.setProperty('--bg-primary', 'transparent');
    }

  }, [themeSettings, uiDensity, animationIntensity, fontSizeScale]);
};
