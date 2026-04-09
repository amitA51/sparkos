import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { SettingsProvider } from './SettingsContext';
import { DataProvider } from './DataContext';
import { CalendarProvider } from './CalendarContext';
import { UIProvider } from './UIContext';
import { FocusProvider } from './FocusContext';
import { NavigationProvider } from './NavigationContext';
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
                  <NotebookProvider>
                    {children}
                  </NotebookProvider>
                </NavigationProvider>
              </UIProvider>
            </CalendarProvider>
          </FocusProvider>
        </DataProvider>
      </SettingsProvider>
    </UserProvider>
  );
};
