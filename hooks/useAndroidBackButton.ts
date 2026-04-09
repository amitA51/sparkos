/**
 * useAndroidBackButton Hook
 *
 * Integrates Android hardware back button with in-app navigation.
 * When the user presses back:
 *   1. If a modal/overlay is open, close it
 *   2. If on a sub-screen, navigate back to previous screen
 *   3. If on root screen (feed), trigger double-tap-to-exit
 *
 * This replaces the raw popstate listener with navigation-aware behavior.
 */

import { useEffect, useCallback, useRef } from 'react';
import type { Screen } from '../types';

interface AndroidBackButtonOptions {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  /** Screens considered "root" -- back on these triggers exit flow */
  rootScreens?: Screen[];
  /** Callback to close any open modal/overlay -- return true if something was closed */
  onCloseOverlay?: () => boolean;
  /** Callback for when on root screen and back is pressed (double-tap exit) */
  onRootBack?: () => void;
}

const DEFAULT_ROOT_SCREENS: Screen[] = ['feed', 'today'];

/** Screen navigation history for back traversal */
const SCREEN_BACK_MAP: Partial<Record<Screen, Screen>> = {
  settings: 'feed',
  assistant: 'feed',
  calendar: 'feed',
  passwords: 'feed',
  investments: 'feed',
  search: 'feed',
  views: 'feed',
  add: 'today',
  fitness: 'library',
  library: 'feed',
};

export const useAndroidBackButton = ({
  activeScreen,
  setActiveScreen,
  rootScreens = DEFAULT_ROOT_SCREENS,
  onCloseOverlay,
  onRootBack,
}: AndroidBackButtonOptions) => {
  const activeScreenRef = useRef(activeScreen);
  activeScreenRef.current = activeScreen;

  const handleBack = useCallback(() => {
    // Priority 1: Close any open overlay/modal
    if (onCloseOverlay?.()) {
      return true; // Handled -- don't navigate
    }

    const currentScreen = activeScreenRef.current;

    // Priority 2: If on a sub-screen, navigate back
    if (!rootScreens.includes(currentScreen)) {
      const backTo = SCREEN_BACK_MAP[currentScreen] || 'feed';
      setActiveScreen(backTo);
      return true; // Handled
    }

    // Priority 3: On root screen -- delegate to double-tap exit
    onRootBack?.();
    return false; // Let the double-tap-exit handler manage this
  }, [rootScreens, setActiveScreen, onCloseOverlay, onRootBack]);

  useEffect(() => {
    // Push a history entry so we can intercept the back button
    const stateKey = { androidBack: true, screen: activeScreen };
    window.history.pushState(stateKey, '', window.location.href);

    const handlePopState = (_e: PopStateEvent) => {
      const handled = handleBack();
      if (handled) {
        // Re-push state to keep intercepting
        window.history.pushState(stateKey, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeScreen, handleBack]);
};

export default useAndroidBackButton;
