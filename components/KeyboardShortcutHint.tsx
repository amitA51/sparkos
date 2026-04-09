import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery, breakpoints } from '../hooks/useMediaQuery';

interface KeyboardShortcutHintProps {
  onOpen: () => void;
}

const HINT_DISMISSED_KEY = 'spark_cmdk_hint_seen';

/**
 * Subtle floating hint that teaches desktop users about Cmd+K.
 * Only appears on desktop, only on first few sessions, and auto-hides after 8s.
 * Clicking it opens the Command Palette.
 */
const KeyboardShortcutHint: React.FC<KeyboardShortcutHintProps> = ({ onOpen }) => {
  const isDesktop = useMediaQuery(breakpoints.desktop);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;

    // Only show a limited number of times
    try {
      const seenCount = parseInt(localStorage.getItem(HINT_DISMISSED_KEY) || '0', 10);
      if (seenCount >= 3) return; // Seen enough times

      // Show after 5s delay to not overwhelm on load
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem(HINT_DISMISSED_KEY, String(seenCount + 1));
      }, 5000);

      // Auto-hide after 13s total (8s visible)
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 13000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } catch {
      return;
    }
  }, [isDesktop]);

  const handleClick = () => {
    setIsVisible(false);
    onOpen();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleClick}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(255, 255, 255, 0.10)',
          }}
          aria-label="פתח Command Palette"
        >
          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
            Command Palette
          </span>
          <div className="flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] text-white/50 font-mono font-semibold group-hover:text-white/70 transition-colors">
              {navigator.platform?.includes('Mac') ? 'Cmd' : 'Ctrl'}
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] text-white/50 font-mono font-semibold group-hover:text-white/70 transition-colors">
              K
            </kbd>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default React.memo(KeyboardShortcutHint);
