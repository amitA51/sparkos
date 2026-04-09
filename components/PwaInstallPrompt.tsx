import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, DownloadIcon } from './icons';

interface PwaInstallPromptProps {
  canInstall: boolean;
  onInstall: () => Promise<boolean>;
}

const DISMISS_KEY = 'spark_pwa_install_dismissed';
const DISMISS_COOLDOWN_DAYS = 7;

/**
 * Smart PWA install prompt that appears after the user has used the app
 * for a session, and only if:
 * 1. The browser has fired `beforeinstallprompt` (canInstall = true)
 * 2. User hasn't dismissed it within the cooldown period
 * 3. User has been on the page for at least 60 seconds (shows real engagement)
 */
const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ canInstall, onInstall }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (!canInstall) return;

    // Check if user dismissed recently
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        if (daysSince < DISMISS_COOLDOWN_DAYS) return;
      }
    } catch {
      // Ignore storage errors
    }

    // Show after 60s of engagement -- not immediately on load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 60_000);

    return () => clearTimeout(timer);
  }, [canInstall]);

  const handleInstall = useCallback(async () => {
    setIsInstalling(true);
    try {
      const accepted = await onInstall();
      if (accepted) {
        setIsVisible(false);
      }
    } finally {
      setIsInstalling(false);
    }
  }, [onInstall]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-4"
            style={{
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
              WebkitBackdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
              border: '0.5px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Accent gradient top line */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-[1px]"
              style={{
                background: 'linear-gradient(to right, transparent, var(--dynamic-accent-start), transparent)',
              }}
            />

            <div className="flex items-start gap-3">
              {/* App icon */}
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                  boxShadow: '0 4px 12px var(--dynamic-accent-glow)',
                }}
              >
                <DownloadIcon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                    התקן את Spark OS
                  </h4>
                  <button
                    onClick={handleDismiss}
                    className="shrink-0 p-1 rounded-lg transition-colors hover:opacity-80"
                    aria-label="סגור"
                  >
                    <XIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  גישה מהירה ממסך הבית, עבודה אופליין וחוויה טובה יותר.
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                      boxShadow: '0 4px 12px -2px var(--dynamic-accent-glow)',
                    }}
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    {isInstalling ? 'מתקין...' : 'התקן עכשיו'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    לא עכשיו
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(PwaInstallPrompt);
