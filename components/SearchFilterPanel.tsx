import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { CloseIcon, FilterIcon, CalendarDaysIcon, ListIcon, TagIcon } from './icons';
import type { SearchFilters } from '../types';
import { useHaptics } from '../hooks/useHaptics';

interface SearchFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const FilterSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const FilterChip: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({
  label,
  isActive,
  onClick,
}) => {
  const { triggerHaptic } = useHaptics();

  const handleClick = () => {
    triggerHaptic(isActive ? 'light' : 'medium');
    onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
        ${isActive
          ? 'bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] text-white border-transparent shadow-[var(--search-pill-active-shadow)]'
          : 'bg-[var(--search-pill-bg)] border-[var(--search-pill-border)] text-[var(--text-secondary)] hover:bg-[var(--search-result-hover-bg)] hover:border-white/20'
        }
      `}
    >
      {label}
    </motion.button>
  );
};

const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const { triggerHaptic } = useHaptics();

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    triggerHaptic('medium');
    onFilterChange({
      type: 'all',
      dateRange: 'all',
      status: 'all',
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl rounded-t-[32px] overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2" onClick={onClose} >
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                סינון מתקדם
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hidden pb-10">
              <FilterSection title="סוג פריט" icon={<TagIcon className="w-4 h-4" />}>
                <FilterChip label="הכל" isActive={filters.type === 'all'} onClick={() => updateFilter('type', 'all')} />
                <FilterChip label="משימות" isActive={filters.type === 'task'} onClick={() => updateFilter('type', 'task')} />
                <FilterChip label="פתקים" isActive={filters.type === 'note'} onClick={() => updateFilter('type', 'note')} />
                <FilterChip label="פיד" isActive={filters.type === 'rss'} onClick={() => updateFilter('type', 'rss')} />
                <FilterChip label="יומן" isActive={filters.type === 'calendar'} onClick={() => updateFilter('type', 'calendar')} />
                <FilterChip label="אימונים" isActive={filters.type === 'workout'} onClick={() => updateFilter('type', 'workout')} />
              </FilterSection>

              <FilterSection title="טווח תאריכים" icon={<CalendarDaysIcon className="w-4 h-4" />}>
                <FilterChip label="כל הזמן" isActive={filters.dateRange === 'all'} onClick={() => updateFilter('dateRange', 'all')} />
                <FilterChip label="היום" isActive={filters.dateRange === 'today'} onClick={() => updateFilter('dateRange', 'today')} />
                <FilterChip label="השבוע" isActive={filters.dateRange === 'week'} onClick={() => updateFilter('dateRange', 'week')} />
                <FilterChip label="החודש" isActive={filters.dateRange === 'month'} onClick={() => updateFilter('dateRange', 'month')} />
              </FilterSection>

              <FilterSection title="סטטוס" icon={<ListIcon className="w-4 h-4" />}>
                <FilterChip label="הכל" isActive={filters.status === 'all'} onClick={() => updateFilter('status', 'all')} />
                <FilterChip label="פתוח" isActive={filters.status === 'open'} onClick={() => updateFilter('status', 'open')} />
                <FilterChip label="הושלם" isActive={filters.status === 'completed'} onClick={() => updateFilter('status', 'completed')} />
                <FilterChip label="חשוב" isActive={filters.status === 'important'} onClick={() => updateFilter('status', 'important')} />
              </FilterSection>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-black/20 pb-safe">
              <button
                onClick={clearAllFilters}
                className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white font-medium transition-colors border border-white/5 active:scale-95"
              >
                נקה את כל המסננים
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchFilterPanel;
