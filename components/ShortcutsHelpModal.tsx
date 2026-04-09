import React from 'react';
import { useKeyboardShortcuts } from './KeyboardShortcutsProvider';
import { CloseIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ShortcutsHelpModal
 *
 * Shows all registered keyboard shortcuts in a premium overlay.
 * Triggered by pressing Shift+? anywhere in the app.
 *
 * Also shows "built-in" shortcuts that are handled by AppKeyboardShortcuts
 * and not registered in the provider (Cmd+K, Cmd+N, etc).
 */

/** Built-in shortcuts handled by AppKeyboardShortcuts (not registered in provider) */
const BUILTIN_SHORTCUTS = [
  { key: 'Ctrl+K', description: 'פתח/סגור לוח פקודות', category: 'quick' as const },
  { key: 'Ctrl+N', description: 'יצירת פריט חדש', category: 'quick' as const },
  { key: 'Ctrl+/', description: 'פתח חיפוש', category: 'quick' as const },
  { key: 'Ctrl+,', description: 'פתח הגדרות', category: 'quick' as const },
];

const CATEGORY_LABELS: Record<string, string> = {
  quick: 'פעולות מהירות',
  navigation: 'ניווט',
  actions: 'פעולות על פריטים',
  views: 'תצוגות',
};

const CATEGORY_ORDER = ['quick', 'navigation', 'actions', 'views'];

const KeyBadge = ({ keys }: { keys: string }) => {
  const keyParts = keys.split('+');
  return (
    <div className="flex gap-1 items-center">
      {keyParts.map((key, index) => (
        <React.Fragment key={index}>
          <kbd
            className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-[11px] font-mono font-bold rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            {key === 'Ctrl' ? (navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl') : key.toUpperCase()}
          </kbd>
          {index < keyParts.length - 1 && (
            <span className="text-[10px] mx-0.5" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>
              {key === 'g' || keyParts[0] === 'g' ? 'then' : '+'}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const ShortcutCategory = ({
  title,
  shortcuts,
}: {
  title: string;
  shortcuts: { key: string; description: string }[];
}) => {
  if (shortcuts.length === 0) return null;
  return (
    <div className="mb-6">
      <h3
        className="text-[10px] font-bold uppercase tracking-[0.12em] mb-3 px-1"
        style={{ color: 'rgba(255, 255, 255, 0.35)' }}
      >
        {title}
      </h3>
      <div className="space-y-1">
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors hover:bg-white/5"
          >
            <span className="text-sm text-white/80">{shortcut.description}</span>
            <KeyBadge keys={shortcut.key} />
          </div>
        ))}
      </div>
    </div>
  );
};

const ShortcutsHelpModal: React.FC = () => {
  const { shortcuts, showHelp, toggleHelp } = useKeyboardShortcuts();

  // Merge provider shortcuts with built-in shortcuts
  const allCategorized: Record<string, { key: string; description: string }[]> = {};

  CATEGORY_ORDER.forEach(cat => {
    allCategorized[cat] = [];
  });

  // Add built-in shortcuts first
  BUILTIN_SHORTCUTS.forEach(s => {
    allCategorized[s.category]?.push(s);
  });

  // Add registered provider shortcuts
  Object.values(shortcuts).forEach(shortcut => {
    if (!allCategorized[shortcut.category]) {
      allCategorized[shortcut.category] = [];
    }
    const categoryList = allCategorized[shortcut.category];
    if (categoryList) {
      categoryList.push({
        key: shortcut.key,
        description: shortcut.description,
      });
    }
  });

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.60)', backdropFilter: 'blur(8px)' }}
          onClick={toggleHelp}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 5 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="relative max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-2xl p-6"
            style={{
              background: 'rgba(28, 28, 35, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <h2 className="text-xl font-bold text-white">קיצורי מקלדת</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                  נווט מהר יותר עם קיצורי מקלדת
                </p>
              </div>
              <button
                onClick={toggleHelp}
                className="p-2 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts by Category */}
            {CATEGORY_ORDER.map(cat => (
              <ShortcutCategory
                key={cat}
                title={CATEGORY_LABELS[cat] || cat}
                shortcuts={allCategorized[cat] || []}
              />
            ))}

            {/* Footer */}
            <div className="mt-4 pt-4 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <p className="text-[11px]" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                לחץ <KeyBadge keys="ESC" /> או <KeyBadge keys="Shift+?" /> לסגירה
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutsHelpModal;
