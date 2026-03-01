import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumHeader from '../PremiumHeader';
import {
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  CloseIcon,
  InboxIcon,
  RoadmapIcon,
  LayoutDashboardIcon,
} from '../icons';

interface LibraryStats {
  inbox: number;
  projects: number;
  spaces: number;
  total: number;
}

interface PremiumLibraryHeaderProps {
  title: string;
  stats: LibraryStats;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  onOpenAssistant: () => void;
  onOpenSplitView: () => void;
}

const PremiumLibraryHeader: React.FC<PremiumLibraryHeaderProps> = ({
  title,
  stats,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenAssistant,
  onOpenSplitView,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <PremiumHeader
      title={title}
      actions={
        <>
          <button
            onClick={onOpenAssistant}
            className="group w-touch-min h-touch-min p-3 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '0.5px solid rgba(255, 255, 255, 0.06)',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
            aria-label="Assistant"
          >
            <SparklesIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          </button>
          <button
            onClick={onOpenSettings}
            className="group w-touch-min h-touch-min p-3 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '0.5px solid rgba(255, 255, 255, 0.06)',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
            aria-label="הגדרות"
          >
            <SettingsIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        {/* Stats Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { icon: InboxIcon, count: stats.inbox, label: 'בתיבה' },
            { icon: RoadmapIcon, count: stats.projects, label: 'פרוייקטים' },
            { icon: LayoutDashboardIcon, count: stats.spaces, label: 'מרחבים' },
          ].map(({ icon: Icon, count, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap bg-[var(--color-surface-hover)] border border-white/10 text-theme-secondary"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="font-mono">{count}</span>
              <span className="opacity-60">{label}</span>
            </span>
          ))}
        </div>

        {/* Search Bar */}
        <div
          className={`spark-input flex items-center gap-2 transition-all duration-200 !py-2.5
            ${isSearchFocused ? '!border-[var(--dynamic-accent-start)]' : ''}`}
        >
          <SearchIcon className={`w-4 h-4 shrink-0 transition-colors duration-200 ${isSearchFocused ? 'text-[var(--dynamic-accent-start)]' : 'text-theme-muted'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="חיפוש בספרייה..."
            className="w-full bg-transparent text-sm text-theme-primary outline-none font-sans"
          />
          <AnimatePresence>
            {!searchQuery && !isSearchFocused && (
              <motion.kbd
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:block px-1.5 py-0.5 text-[10px] font-mono text-theme-muted bg-[var(--color-surface-hover)] rounded border border-white/8 shrink-0"
              >
                ⌘K
              </motion.kbd>
            )}
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange('')}
                className="p-0.5 rounded-full text-theme-secondary hover:text-theme-primary hover:bg-[var(--color-surface-hover)] shrink-0"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PremiumHeader>
  );
};

export default PremiumLibraryHeader;