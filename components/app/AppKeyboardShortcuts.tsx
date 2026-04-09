import { useEffect } from 'react';
import { useNavigationOptional } from '../../src/contexts/NavigationContext';

interface AppKeyboardShortcutsProps {
  setIsCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * AppKeyboardShortcuts Component
 *
 * Manages global keyboard shortcuts for the application:
 * - Cmd/Ctrl+K: Toggle Command Palette
 * - Cmd/Ctrl+N: Quick add new item (navigate to add screen)
 * - Cmd/Ctrl+,: Open settings
 * - Cmd/Ctrl+/: Focus search
 * - Cmd/Ctrl+.: Toggle command palette (alternative)
 *
 * All shortcuts are suppressed when the user is typing in an
 * input, textarea, or contenteditable element (Cmd combos still work).
 */
const AppKeyboardShortcuts: React.FC<AppKeyboardShortcutsProps> = ({ setIsCommandPaletteOpen }) => {
  const navigation = useNavigationOptional();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // --- Modifier-based shortcuts (always work, even in inputs) ---

      // Cmd/Ctrl+K: Toggle Command Palette
      if (isMod && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Cmd/Ctrl+. : Alternative command palette toggle
      if (isMod && e.key === '.') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Cmd/Ctrl+N: Quick add new item
      if (isMod && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        if (navigation) {
          navigation.navigate('add');
        }
        return;
      }

      // Cmd/Ctrl+,: Open settings
      if (isMod && e.key === ',') {
        e.preventDefault();
        if (navigation) {
          navigation.navigate('settings');
        }
        return;
      }

      // Cmd/Ctrl+/: Focus search
      if (isMod && e.key === '/') {
        e.preventDefault();
        if (navigation) {
          navigation.navigate('search');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCommandPaletteOpen, navigation]);

  // This component doesn't render anything - it's purely for side effects
  return null;
};

export default AppKeyboardShortcuts;
