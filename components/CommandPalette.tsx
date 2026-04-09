// CLEANED - CSS vars fixed
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SearchIcon,
  TargetIcon,
  FeedIcon,
  AddIcon,
  LayoutDashboardIcon,
  ChartBarIcon,
  SettingsIcon,
  BrainCircuitIcon,
  SunIcon,
  CalendarIcon,
  BookOpenIcon,
  FlameIcon,
  ClipboardListIcon,
  SparklesIcon,
  LockIcon,
  TrendingUpIcon,
} from './icons';
import { useNavigation } from '../src/contexts/NavigationContext';

// Trophy icon for achievements
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

/** Moon + Star icon for daily review command */
const MoonStarCmdIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M19 3v4" />
    <path d="M21 5h-4" />
  </svg>
);

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAchievements?: () => void;
}

type ActionItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  /** Keyboard shortcut hint shown on the right */
  shortcut?: string;
  /** Search keywords that aren't in the label */
  keywords?: string[];
};

/** Compact keyboard badge */
const KBD: React.FC<{ keys: string }> = ({ keys }) => {
  const parts = keys.split('+');
  return (
    <span className="flex items-center gap-0.5">
      {parts.map((k, i) => (
        <React.Fragment key={i}>
          <kbd
            className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[10px] font-mono font-semibold rounded-md"
            style={{
              background: 'var(--gray-100)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {k}
          </kbd>
          {i < parts.length - 1 && (
            <span className="text-[9px] mx-0.5" style={{ color: 'var(--text-muted)' }}>+</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenAchievements }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { navigate, navigateToAdd } = useNavigation();

  const actions: ActionItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-today',
      label: 'עבור להיום',
      group: 'ניווט',
      icon: <TargetIcon className="w-4 h-4" />,
      action: () => navigate('today'),
      shortcut: 'G then T',
      keywords: ['today', 'home', 'dashboard'],
    },
    {
      id: 'nav-feed',
      label: 'עבור לפיד',
      group: 'ניווט',
      icon: <FeedIcon className="w-4 h-4" />,
      action: () => navigate('feed'),
      shortcut: 'G then F',
      keywords: ['feed', 'rss', 'news'],
    },
    {
      id: 'nav-library',
      label: 'עבור לספרייה',
      group: 'ניווט',
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      action: () => navigate('library'),
      shortcut: 'G then L',
      keywords: ['library', 'collection'],
    },
    {
      id: 'nav-calendar',
      label: 'עבור ללוח שנה',
      group: 'ניווט',
      icon: <CalendarIcon className="w-4 h-4" />,
      action: () => navigate('calendar'),
      keywords: ['calendar', 'schedule', 'events'],
    },
    {
      id: 'nav-search',
      label: 'חיפוש',
      group: 'ניווט',
      icon: <SearchIcon className="w-4 h-4" />,
      action: () => navigate('search'),
      shortcut: '/',
      keywords: ['search', 'find'],
    },
    {
      id: 'nav-investments',
      label: 'עבור להשקעות',
      group: 'ניווט',
      icon: <ChartBarIcon className="w-4 h-4" />,
      action: () => navigate('investments'),
      keywords: ['investments', 'stocks', 'money'],
    },
    {
      id: 'nav-assistant',
      label: 'שאל את היועץ',
      group: 'ניווט',
      icon: <BrainCircuitIcon className="w-4 h-4" />,
      action: () => navigate('assistant'),
      keywords: ['ai', 'assistant', 'help'],
    },
    {
      id: 'nav-passwords',
      label: 'מנהל סיסמאות',
      group: 'ניווט',
      icon: <LockIcon className="w-4 h-4" />,
      action: () => navigate('passwords'),
      keywords: ['passwords', 'vault', 'security'],
    },
    {
      id: 'nav-insights',
      label: 'תובנות ואנליטיקה',
      group: 'ניווט',
      icon: <TrendingUpIcon className="w-4 h-4" />,
      action: () => navigate('insights'),
      keywords: ['insights', 'analytics', 'stats', 'productivity', 'statistics', 'score'],
    },
    {
      id: 'nav-settings',
      label: 'הגדרות',
      group: 'ניווט',
      icon: <SettingsIcon className="w-4 h-4" />,
      action: () => navigate('settings'),
      keywords: ['settings', 'preferences', 'config'],
    },

    // Quick Add Actions
    {
      id: 'act-add-task',
      label: 'משימה חדשה',
      group: 'יצירה מהירה',
      icon: <AddIcon className="w-4 h-4" />,
      action: () => navigateToAdd('task'),
      shortcut: 'Q',
      keywords: ['task', 'todo', 'new'],
    },
    {
      id: 'act-add-spark',
      label: 'ספארק חדש',
      group: 'יצירה מהירה',
      icon: <SparklesIcon className="w-4 h-4" />,
      action: () => navigateToAdd('spark'),
      keywords: ['spark', 'idea', 'thought'],
    },
    {
      id: 'act-add-note',
      label: 'פתק חדש',
      group: 'יצירה מהירה',
      icon: <ClipboardListIcon className="w-4 h-4" />,
      action: () => navigateToAdd('note'),
      keywords: ['note', 'memo'],
    },
    {
      id: 'act-add-habit',
      label: 'הרגל חדש',
      group: 'יצירה מהירה',
      icon: <FlameIcon className="w-4 h-4" />,
      action: () => navigateToAdd('habit'),
      keywords: ['habit', 'routine', 'daily'],
    },
    {
      id: 'act-add-book',
      label: 'ספר חדש',
      group: 'יצירה מהירה',
      icon: <BookOpenIcon className="w-4 h-4" />,
      action: () => navigateToAdd('book'),
      keywords: ['book', 'reading'],
    },

    // Gamification
    {
      id: 'gam-achievements',
      label: 'הישגים',
      group: 'גיימיפיקציה',
      icon: <TrophyIcon className="w-4 h-4" />,
      action: () => {
        onOpenAchievements?.();
        window.dispatchEvent(new CustomEvent('sparkos:open-achievements'));
      },
      keywords: ['achievements', 'badges', 'xp', 'level', 'gamification'],
    },

    // Daily Review
    {
      id: 'review-daily',
      label: '\u05E1\u05D9\u05DB\u05D5\u05DD \u05D9\u05D5\u05DE\u05D9',
      group: '\u05E1\u05D9\u05DB\u05D5\u05DD',
      icon: <MoonStarCmdIcon className="w-4 h-4" />,
      action: () => {
        window.dispatchEvent(new CustomEvent('sparkos:open-daily-review'));
      },
      keywords: ['review', 'daily', 'evening', 'mood', 'summary', 'wrap', 'reflection'],
    },
    {
      id: 'review-history',
      label: '\u05D4\u05D9\u05E1\u05D8\u05D5\u05E8\u05D9\u05D9\u05EA \u05E1\u05D9\u05DB\u05D5\u05DE\u05D9\u05DD',
      group: '\u05E1\u05D9\u05DB\u05D5\u05DD',
      icon: <CalendarIcon className="w-4 h-4" />,
      action: () => {
        window.dispatchEvent(new CustomEvent('sparkos:open-review-history'));
      },
      keywords: ['review', 'history', 'calendar', 'mood', 'trend'],
    },

    // System
    {
      id: 'sys-theme',
      label: '\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0',
      group: '\u05DE\u05E2\u05E8\u05DB\u05EA',
      icon: <SunIcon className="w-4 h-4" />,
      action: () => navigate('settings'),
      keywords: ['theme', 'dark', 'light', 'appearance'],
    },
  ], [navigate, navigateToAdd, onOpenAchievements]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    const lowerQuery = query.toLowerCase();
    return actions.filter(action =>
      action.label.toLowerCase().includes(lowerQuery) ||
      action.group.toLowerCase().includes(lowerQuery) ||
      action.keywords?.some(kw => kw.includes(lowerQuery))
    );
  }, [actions, query]);

  // Group filtered actions by group
  const groupedActions = useMemo(() => {
    const groups: { name: string; items: { action: ActionItem; globalIndex: number }[] }[] = [];
    const groupMap = new Map<string, { action: ActionItem; globalIndex: number }[]>();

    filteredActions.forEach((action, globalIndex) => {
      if (!groupMap.has(action.group)) {
        groupMap.set(action.group, []);
      }
      groupMap.get(action.group)!.push({ action, globalIndex });
    });

    groupMap.forEach((items, name) => {
      groups.push({ name, items });
    });

    return groups;
  }, [filteredActions]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector('[data-selected="true"]');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleExecute = useCallback((action: ActionItem) => {
    action.action();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleExecute(filteredActions[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
        } else {
          setSelectedIndex(prev => (prev + 1) % filteredActions.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose, handleExecute]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh] animate-fade-in px-4"
      style={{ background: 'rgba(0,0,0,0.40)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden flex flex-col animate-slide-up-small"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <SearchIcon className="w-5 h-5 shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="חפש פקודה, מסך, או פעולה..."
            className="flex-1 bg-transparent text-base sm:text-lg px-3 focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <KBD keys="ESC" />
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                לא נמצאו תוצאות עבור "{query}"
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                נסה מילות חיפוש אחרות
              </p>
            </div>
          ) : (
            groupedActions.map(group => (
              <div key={group.name} className="mb-1">
                <div
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--text-muted)', opacity: 0.6 }}
                >
                  {group.name}
                </div>
                {group.items.map(({ action, globalIndex }) => {
                  const isSelected = globalIndex === selectedIndex;
                  return (
                    <button
                      key={action.id}
                      data-selected={isSelected}
                      onClick={() => handleExecute(action)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                      style={{
                        background: isSelected ? 'var(--color-accent-surface-cyan)' : 'transparent',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ opacity: isSelected ? 1 : 0.6 }}>{action.icon}</span>
                        <span className="font-medium">{action.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.shortcut && <KBD keys={action.shortcut} />}
                        {isSelected && !action.shortcut && (
                          <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            Enter
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer with hints */}
        <div
          className="px-4 py-2.5 flex justify-between items-center text-[10px]"
          style={{
            background: 'var(--gray-50)',
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <span className="font-medium tracking-wide">SparkOS Command</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <KBD keys="^" />
              <KBD keys="v" />
              <span className="mr-1">ניווט</span>
            </span>
            <span className="flex items-center gap-1">
              <KBD keys="Enter" />
              <span className="mr-1">בחר</span>
            </span>
            <span className="flex items-center gap-1">
              <KBD keys="Tab" />
              <span className="mr-1">הבא</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
