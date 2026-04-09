import { QueryClientProvider } from '@tanstack/react-query';
import { useCallback, type FC, type PropsWithChildren } from 'react';
import { KeyboardShortcutsProvider } from '@components/KeyboardShortcutsProvider';
import ModalRoot from '@components/ModalRoot';
import { OfflineBanner } from '@components/OfflineBanner';
import AppCore from '@components/app/AppCore';
import ErrorBoundary from '@components/ErrorBoundary';
import { AppProviders } from '@contexts/AppProviders';
import { useNavigationOptional } from '@contexts/NavigationContext';
import { ModalProvider, useModal } from '@/state/ModalContext';
import { queryClient } from '@/utils/queryClient';

/**
 * App Component
 *
 * Root component that sets up all providers and wraps the application.
 * Note: StrictMode is applied in main.tsx - not duplicated here.
 */
const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppProviders>
          <ModalProvider>
            <KeyboardShortcutsProviderWrapper>
              {/* Offline connectivity banner */}
              <OfflineBanner position="top" />
              <AppCore />
              <ModalRoot />
            </KeyboardShortcutsProviderWrapper>
          </ModalProvider>
        </AppProviders>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

/**
 * KeyboardShortcutsProviderWrapper Component
 *
 * Wrapper component to access modal context for keyboard shortcuts.
 */
const KeyboardShortcutsProviderWrapper: FC<PropsWithChildren> = ({
  children,
}) => {
  const { openModal } = useModal();
  const navigation = useNavigationOptional();

  const handleQuickAdd = useCallback(() => {
    openModal('smart-capture');
  }, [openModal]);

  const handleSearch = useCallback(() => {
    if (navigation) {
      navigation.navigate('search');
    }
  }, [navigation]);

  return (
    <KeyboardShortcutsProvider
      onQuickAdd={handleQuickAdd}
      onSearch={handleSearch}
    >
      {children}
    </KeyboardShortcutsProvider>
  );
};

export default App;
