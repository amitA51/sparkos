import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './UserContext';
import { SettingsProvider } from './SettingsContext';
import { DataProvider } from './DataContext';
import { CalendarProvider } from './CalendarContext';
import { UIProvider } from './UIContext';
import { FocusProvider } from './FocusContext';
import { NavigationProvider } from './NavigationContext';
import { ToastProvider } from './ToastContext';
import { NotebookProvider } from './NotebookContext';



export interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <UserProvider>
      <SettingsProvider>
        <DataProvider>
          <FocusProvider>
            <CalendarProvider>
              <UIProvider>
                <NavigationProvider>
                  <ToastProvider>
                    <NotebookProvider>
                      {children}
                      <Toaster
                        position="top-center"
                        toastOptions={{
                          style: {
                            // Use theme-aware surface + border so it looks right on both dark and light modes
                            background: 'var(--surface-glass)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                            borderRadius: '16px',
                            fontSize: '0.9rem',
                            fontFamily: 'var(--font-body)',
                            boxShadow: '0 10px 30px -14px rgba(15,23,42,0.45)',
                          },
                          className: 'glass-morphism',
                        }}
                      />
                    </NotebookProvider>
                  </ToastProvider>
                </NavigationProvider>
              </UIProvider>
            </CalendarProvider>
          </FocusProvider>
        </DataProvider>
      </SettingsProvider>
    </UserProvider>
  );
};