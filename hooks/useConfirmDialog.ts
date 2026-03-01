/**
 * Hook for confirm dialogs that respects user settings
 * If showConfirmDialogs is false, bypass confirmation and return true immediately
 */

import { useCallback } from 'react';
import { useSettings } from '../src/contexts/SettingsContext';

export const useConfirmDialog = () => {
    const { settings } = useSettings();

    const confirm = useCallback(
        (message: string): boolean => {
            // If setting is disabled, skip confirmation
            if (settings.showConfirmDialogs === false) {
                return true;
            }
            return window.confirm(message);
        },
        [settings.showConfirmDialogs]
    );

    return { confirm };
};
