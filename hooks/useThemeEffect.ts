import { useEffect } from 'react';

interface ThemeState {
  mode: 'light' | 'dark';
}

/**
 * Simple light/dark theme switcher
 * Sets data-theme on <html> element
 */
export const useThemeEffect = ({ mode }: ThemeState) => {
  useEffect(() => {
    const root = document.documentElement;

    // Set theme attribute
    root.setAttribute('data-theme', mode);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'dark' ? '#000000' : '#F2F2F7');
    }

  }, [mode]);
};

/**
 * Determine if a theme name is dark mode
 */
export const isDarkTheme = (themeName: string | undefined): boolean => {
  if (!themeName) return true; // Default to dark
  
  const lightThemes = ['light', 'white', 'pure light'];
  return !lightThemes.some(t => themeName.toLowerCase().includes(t));
};
