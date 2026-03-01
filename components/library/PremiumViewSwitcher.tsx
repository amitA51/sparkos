import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  LayoutDashboardIcon,
  ListIcon,
  CalendarIcon,
  ChartBarIcon,
  FileIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  DumbbellIcon,
} from '../icons';

// NOTE: 'fitness' tab added for Fitness Hub feature - UI to be implemented by UI agent
export type HubView = 'dashboard' | 'timeline' | 'fitness' | 'board' | 'calendar' | 'vault' | 'investments' | 'files';

interface ViewConfig {
  id: HubView;
  icon: React.FC<{ className?: string }>;
  label: string;
  gradient?: string;
}

const defaultViews: ViewConfig[] = [
  { id: 'dashboard', icon: LayoutDashboardIcon, label: 'דשבורד', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'timeline', icon: ListIcon, label: 'ציר זמן', gradient: 'from-violet-500 to-purple-500' },
  { id: 'fitness', icon: DumbbellIcon, label: 'כושר', gradient: 'from-orange-500 to-red-500' }, // [UI] Fitness Hub tab
  { id: 'board', icon: BookOpenIcon, label: 'מחברת', gradient: 'from-indigo-500 to-purple-500' },
  { id: 'calendar', icon: CalendarIcon, label: 'לוח שנה', gradient: 'from-pink-500 to-rose-500' },
  { id: 'files', icon: FileIcon, label: 'קבצים', gradient: 'from-amber-500 to-orange-500' },
  { id: 'investments', icon: ChartBarIcon, label: 'השקעות', gradient: 'from-green-500 to-emerald-500' },
  { id: 'vault', icon: ShieldCheckIcon, label: 'כספת', gradient: 'from-slate-500 to-gray-500' },
];

// Helper to get views in custom order
export const getOrderedViews = (order?: string[]): ViewConfig[] => {
  if (!order || order.length === 0) return defaultViews;

  const orderedViews: ViewConfig[] = [];
  for (const id of order) {
    const view = defaultViews.find(v => v.id === id);
    if (view) orderedViews.push(view);
  }
  // Add any missing views at the end
  for (const view of defaultViews) {
    if (!orderedViews.some(v => v.id === view.id)) {
      orderedViews.push(view);
    }
  }
  return orderedViews;
};

interface PremiumViewSwitcherProps {
  currentView: HubView;
  onViewChange: (view: HubView) => void;
  tabOrder?: string[];
  onTabOrderChange?: (newOrder: string[]) => void;
}

const PremiumViewSwitcher: React.FC<PremiumViewSwitcherProps> = ({
  currentView,
  onViewChange,
  tabOrder,
  onTabOrderChange,
}) => {
  // Get views in the correct order based on tabOrder prop
  const views = useMemo(() => getOrderedViews(tabOrder), [tabOrder]);

  // State for drag mode
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Long press state for enabling drag mode on mobile
  const [longPressActive, setLongPressActive] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const LONG_PRESS_DURATION = 400; // ms

  // Handle reorder change
  const handleReorder = useCallback((newOrder: ViewConfig[]) => {
    const newIds = newOrder.map(v => v.id);
    onTabOrderChange?.(newIds);
  }, [onTabOrderChange]);

  // Long press handlers for mobile drag activation
  const handleTouchStart = useCallback((viewId: string) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      setDraggedId(viewId);
      // Haptic feedback would go here if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, LONG_PRESS_DURATION);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    // Delay to allow drop animation
    setTimeout(() => {
      setLongPressActive(false);
      setDraggedId(null);
      setIsDragging(false);
    }, 100);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setLongPressActive(false);
    setDraggedId(null);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, viewId: HubView) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewChange(viewId);
      return;
    }

    // Arrow key navigation between tabs
    const currentIndex = views.findIndex(v => v.id === currentView);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + views.length) % views.length;
      const nextView = views[nextIndex];
      if (nextView) {
        onViewChange(nextView.id);
      }
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Long press hint - shows when dragging is enabled */}
      {longPressActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-accent-cyan surface-elevated px-3 py-1 rounded-full whitespace-nowrap z-50"
        >
          גרור לשינוי סדר
        </motion.div>
      )}

      {/* Outer container with premium glass effect */}
      <div
        className={`relative flex items-center gap-1 p-1 sm:p-1.5 md:p-2 rounded-2xl overflow-hidden max-w-full transition-all duration-200 ${longPressActive ? 'ring-2 ring-accent-cyan/50 bg-accent-cyan/5' : ''
          }`}
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        role="tablist"
        aria-label="תצוגות הספרייה"
      >
        {/* Background blur layer */}
        <div className="absolute inset-0 backdrop-blur-xl -z-10" />

        {/* Reorderable container for tabs */}
        <Reorder.Group
          axis="x"
          values={views}
          onReorder={handleReorder}
          className="flex items-stretch gap-1 sm:gap-1.5 overflow-x-auto hide-scrollbar w-full px-0.5"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {views.map(view => {
            const isActive = currentView === view.id;
            const Icon = view.icon;
            const isBeingDragged = draggedId === view.id;

            return (
              <Reorder.Item
                key={view.id}
                value={view}
                dragListener={longPressActive}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                whileDrag={{
                  scale: 1.05,
                  zIndex: 50,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
                className={`
                  relative inline-flex items-center justify-center gap-1.5 sm:gap-2
                  px-3 sm:px-3.5 md:px-4 py-2.5 sm:py-2.5 rounded-xl
                  font-medium text-[13px] xs:text-sm leading-tight
                  transition-colors duration-200
                  shrink-0 whitespace-nowrap
                  min-w-[auto] sm:min-w-[88px]
                  select-none cursor-pointer
                  ${isActive ? 'text-white' : 'text-theme-secondary hover:text-theme-primary'}
                  ${isBeingDragged ? 'opacity-90' : ''}
                  ${longPressActive && !isBeingDragged ? 'animate-pulse' : ''}
                `}
                onTouchStart={() => handleTouchStart(view.id)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onClick={() => {
                  if (!longPressActive && !isDragging) {
                    onViewChange(view.id);
                  }
                }}
                onKeyDown={e => handleKeyDown(e, view.id)}
                role="tab"
                aria-selected={isActive}
                aria-label={view.label}
                tabIndex={isActive ? 0 : -1}
              >
                {/* Active indicator background */}
                {isActive && (
                  <motion.div
                    layoutId="view-indicator"
                    className="absolute inset-0 rounded-xl overflow-hidden"
                    style={{
                      background: 'var(--dynamic-accent-color)',
                      opacity: 0.85,
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 28,
                    }}
                  />
                )}


                {/* Drag indicator when long press active */}
                {longPressActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-cyan"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  animate={{
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-colors duration-200 ${isActive ? 'text-white' : ''}`}
                  />
                </motion.div>

                {/* Label - always visible now for better UX, but smaller on mobile */}
                <span className="relative z-10">
                  {view.label}
                </span>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      {/* Subtle gradient edge indicators for scroll - enhanced for mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none opacity-80 sm:hidden rounded-l-2xl" />
      <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-8 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none opacity-80 sm:hidden rounded-r-2xl" />
    </div>
  );
};

export default PremiumViewSwitcher;