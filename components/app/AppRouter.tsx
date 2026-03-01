import React, { lazy, Suspense, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../PageTransition';
import BottomNavBar from '../BottomNavBar';
import SessionTimer from '../SessionTimer';
import DynamicBackground from '../DynamicBackground';
import StatusMessage, { StatusMessageType } from '../StatusMessage';
import CommandPalette from '../CommandPalette';
import AppLoading from '../AppLoading';

import ActiveWorkoutOverlay from '../workout/ActiveWorkoutOverlay';
import { RefreshIcon } from '../icons';
import { screenSkeletonMap } from '../SkeletonLoader';
import { useScreenData } from '../../hooks/useScreenData';
import type { Screen, PersonalItem, BackgroundEffectType } from '../../types';
import * as dataService from '../../services/dataService';

// Error Boundaries
import FeedErrorBoundary from '../boundaries/FeedErrorBoundary';
import CalendarErrorBoundary from '../boundaries/CalendarErrorBoundary';
import PasswordErrorBoundary from '../boundaries/PasswordErrorBoundary';
import SettingsErrorBoundary from '../boundaries/SettingsErrorBoundary';
import AssistantErrorBoundary from '../boundaries/AssistantErrorBoundary';
import HomeErrorBoundary from '../boundaries/HomeErrorBoundary';
import LibraryErrorBoundary from '../boundaries/LibraryErrorBoundary';
import AddScreenErrorBoundary from '../boundaries/AddScreenErrorBoundary';

// Lazy loaded screens
const FeedScreen = lazy(() => import('../../screens/FeedScreen'));
const HomeScreen = lazy(() => import('../../screens/HomeScreen'));
const AddScreen = lazy(() => import('../../screens/AddScreen'));
const SearchScreen = lazy(() => import('../../screens/SearchScreen'));
const SettingsScreen = lazy(() => import('../../screens/SettingsScreen'));
const LibraryScreen = lazy(() => import('../../screens/LibraryScreen'));
const InvestmentsScreen = lazy(() => import('../../screens/InvestmentsScreen'));
const AssistantScreen = lazy(() => import('../../screens/AssistantScreen'));
const CalendarScreen = lazy(() => import('../../screens/CalendarScreen'));
const PasswordManagerScreen = lazy(() => import('../../screens/PasswordManagerScreen'));
const ViewsScreen = lazy(() => import('../../screens/ViewsScreen'));
const LoginScreen = lazy(() => import('../../screens/LoginScreen'));
const SignupScreen = lazy(() => import('../../screens/SignupScreen'));
const FitnessHubView = lazy(() => import('../../components/library/fitness/FitnessHubView').then(module => ({ default: module.FitnessHubView })));

interface AppRouterProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  activeSession: { item: PersonalItem } | null;

  themeSettings: {
    backgroundEffect: BackgroundEffectType;
  };
  statusMessage: {
    type: StatusMessageType;
    text: string;
    id: number;
    onUndo?: () => Promise<void> | void;
  } | null;
  setStatusMessage: (
    message: {
      type: StatusMessageType;
      text: string;
      id: number;
      onUndo?: () => Promise<void> | void;
    } | null
  ) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  updateAvailable: boolean;
  handleUpdate: () => void;
  handleGuestAccess: () => void;
  showStatus: (type: StatusMessageType, text: string, onUndo?: () => Promise<void> | void) => void;
  updatePersonalItem: (id: string, item: PersonalItem) => Promise<void>;
  startSession: (item: PersonalItem) => void;
  cancelSession: () => void;
}

/**
 * AppRouter Component
 *
 * Handles all screen rendering logic and layout structure:
 * - Screen switching based on activeScreen
 * - Special modes (SessionTimer, SplitView)
 * - Layout with background, navbar, modals, overlays
 * - Error boundaries for critical features
 */
const AppRouter: React.FC<AppRouterProps> = ({
  activeScreen,
  setActiveScreen,
  activeSession,

  themeSettings: _themeSettings,
  statusMessage,
  setStatusMessage,
  isCommandPaletteOpen,
  setIsCommandPaletteOpen,
  updateAvailable,
  handleUpdate,
  handleGuestAccess,
  showStatus,
  updatePersonalItem,
  startSession,
  cancelSession,
}) => {
  // Lazy load data for the current screen
  useScreenData(activeScreen);

  // Efficient Screen Rendering with Error Boundaries
  const renderScreen = useCallback(
    (screen: Screen) => {
      switch (screen) {
        case 'feed':
          return (
            <FeedErrorBoundary>
              <FeedScreen setActiveScreen={setActiveScreen} />
            </FeedErrorBoundary>
          );
        case 'today':
          return (
            <HomeErrorBoundary>
              <HomeScreen setActiveScreen={setActiveScreen} />
            </HomeErrorBoundary>
          );
        case 'add':
          return (
            <AddScreenErrorBoundary>
              <AddScreen setActiveScreen={setActiveScreen} />
            </AddScreenErrorBoundary>
          );
        case 'library':
          return (
            <LibraryErrorBoundary>
              <LibraryScreen setActiveScreen={setActiveScreen} />
            </LibraryErrorBoundary>
          );
        case 'investments':
          return <InvestmentsScreen setActiveScreen={setActiveScreen} />;
        case 'search':
          return <SearchScreen setActiveScreen={setActiveScreen} />;
        case 'fitness':
          return <FitnessHubView />;
        case 'settings':
          return (
            <SettingsErrorBoundary>
              <SettingsScreen setActiveScreen={setActiveScreen} />
            </SettingsErrorBoundary>
          );
        case 'assistant':
          return (
            <AssistantErrorBoundary>
              <AssistantScreen setActiveScreen={setActiveScreen} />
            </AssistantErrorBoundary>
          );
        case 'dashboard':
          return (
            <HomeErrorBoundary>
              <HomeScreen setActiveScreen={setActiveScreen} />
            </HomeErrorBoundary>
          );
        case 'calendar':
          return (
            <CalendarErrorBoundary>
              <CalendarScreen setActiveScreen={setActiveScreen} />
            </CalendarErrorBoundary>
          );
        case 'passwords':
          return (
            <PasswordErrorBoundary>
              <PasswordManagerScreen setActiveScreen={setActiveScreen} />
            </PasswordErrorBoundary>
          );
        case 'views':
          return <ViewsScreen setActiveScreen={setActiveScreen} />;
        case 'login':
          return (
            <LoginScreen
              onNavigateToSignup={() => setActiveScreen('signup')}
              onSkip={handleGuestAccess}
            />
          );
        case 'signup':
          return (
            <SignupScreen
              onNavigateToLogin={() => setActiveScreen('login')}
              onSkip={handleGuestAccess}
            />
          );
        case 'logos':
          // SparkLogoConcepts removed - redirect to home
          return (
            <HomeErrorBoundary>
              <HomeScreen setActiveScreen={setActiveScreen} />
            </HomeErrorBoundary>
          );
        default:
          return (
            <HomeErrorBoundary>
              <HomeScreen setActiveScreen={setActiveScreen} />
            </HomeErrorBoundary>
          );
      }
    },
    [handleGuestAccess, setActiveScreen]
  );

  const handleEndSession = async (loggedDuration?: number, isCancel: boolean = false) => {
    const sessionToRestore = activeSession;
    if (loggedDuration && sessionToRestore) {
      const updatedItem = await dataService.logFocusSession(
        sessionToRestore.item.id,
        loggedDuration
      );
      await updatePersonalItem(updatedItem.id, updatedItem);
    }
    cancelSession();

    if (isCancel && sessionToRestore) {
      showStatus('success', 'הסשן הופסק.', () => {
        startSession(sessionToRestore.item);
      });
    }
  };

  // Special case: Active session takes over the screen
  if (activeSession) {
    return <SessionTimer item={activeSession.item} onEndSession={handleEndSession} />;
  }

  // Normal rendering: Main app layout
  return (
    <div className="app-container overflow-x-hidden min-h-[100dvh] flex flex-col">
      {/* Background Effects - DynamicBackground handles all effect types */}
      <DynamicBackground />

      <main className="flex-grow">
        <Suspense fallback={<ScreenSpecificSkeleton screen={activeScreen} />}>
          <AnimatePresence mode="wait">
            <PageTransition key={activeScreen} className="h-full">
              {renderScreen(activeScreen)}
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </main>

      <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

      {updateAvailable && (
        <div className="fixed bottom-24 right-4 z-50 animate-screen-enter">
          <div className="themed-card p-3 flex items-center gap-4">
            <p className="text-sm text-white font-medium">עדכון חדש זמין!</p>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 bg-[var(--accent-gradient)] text-black text-sm font-bold px-4 py-2 rounded-full hover:brightness-110 transition-all shadow-[0_4px_15px_var(--dynamic-accent-glow)]"
            >
              <RefreshIcon className="w-4 h-4" />
              רענן
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <StatusMessage
          key={statusMessage.id}
          type={statusMessage.type}
          message={statusMessage.text}
          onDismiss={() => setStatusMessage(null)}
          onUndo={statusMessage.onUndo}
        />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <ActiveWorkoutOverlay />
    </div>
  );
};

/**
 * Screen-specific skeleton component
 * Uses the skeleton map to render the appropriate skeleton for each screen
 */
const ScreenSpecificSkeleton: React.FC<{ screen: Screen }> = ({ screen }) => {
  const SkeletonComponent = screenSkeletonMap[screen];

  if (SkeletonComponent) {
    return <SkeletonComponent />;
  }

  // Fallback to generic loading spinner
  return <AppLoading />;
};

export default AppRouter;
