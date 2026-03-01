import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useData } from '../../src/contexts/DataContext';
import * as dataService from '../../services/dataService';
import { checkGoogleRedirectResult } from '../../services/authService';
import { refreshAllFeeds } from '../../services/feedService';
import type { Screen } from '../../types';

const LAST_REFRESH_KEY = 'spark_last_refresh_time';
const ONE_HOUR = 60 * 60 * 1000;

interface UseAppLifecycleProps {
    isGuest: boolean;
    setActiveScreen: (screen: Screen | ((prev: Screen) => Screen)) => void;
    setIsAuthLoading: (loading: boolean) => void;
}

/**
 * Custom hook to manage application lifecycle events.
 * Replaces the headless AppLifecycle component.
 */
export const useAppLifecycle = ({
    isGuest,
    setActiveScreen,
    setIsAuthLoading,
}: UseAppLifecycleProps) => {
    const { removePersonalItem, refreshAll } = useData();
    const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

    // 1. Handle Google redirect result (Mobile Auth Flow)
    useEffect(() => {
        const handleRedirect = async () => {
            try {
                const user = await checkGoogleRedirectResult();
                if (user) {
                    setActiveScreen('today');
                }
            } catch (error) {
                console.error('Error checking Google redirect result:', error);
            } finally {
                setIsCheckingRedirect(false);
                setIsAuthLoading(false);
            }
        };

        handleRedirect();
    }, [setActiveScreen, setIsAuthLoading]);

    // 2. Auth State Listener
    useEffect(() => {
        if (!auth || isCheckingRedirect) return;

        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is logged in - redirect from auth screens
                setActiveScreen(prev => (prev === 'login' || prev === 'signup' ? 'today' : prev));
            } else {
                // User is logged out - redirect to login unless guest
                if (!isGuest) {
                    setActiveScreen(prev => (prev !== 'signup' && prev !== 'login' ? 'login' : prev));
                }
            }
        });
        return () => unsubscribe();
    }, [isGuest, setActiveScreen, isCheckingRedirect]);

    // 3. Data Cleanup & Refresh
    useEffect(() => {
        const autoRefreshFeeds = async () => {
            try {
                const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
                const now = Date.now();

                if (!lastRefresh || now - parseInt(lastRefresh, 10) > ONE_HOUR) {
                    await refreshAllFeeds();
                    localStorage.setItem(LAST_REFRESH_KEY, now.toString());
                    await refreshAll();
                }
            } catch (error) {
                console.error('[AppLifecycle] Auto-refresh failed:', error);
            }
        };

        const cleanupTasks = async () => {
            try {
                const deletedIds = await dataService.cleanupCompletedTasks();
                if (deletedIds.length > 0) {
                    await Promise.all(deletedIds.map(id => removePersonalItem(id)));
                }
            } catch (error) {
                console.error('[AppLifecycle] Cleanup failed:', error);
            }
        };

        // Initialize built-in templates
        dataService.initializeBuiltInWorkoutTemplates();

        // Run async tasks
        const timeoutId = setTimeout(() => {
            autoRefreshFeeds();
            cleanupTasks();
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [refreshAll, removePersonalItem]);
};
