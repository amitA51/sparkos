// iOS Light Mode Tab Bar
// Authentic Apple iOS tab bar aesthetics - white/frosted glass, system blue active state
import React, { useMemo, useCallback, useState, useRef } from 'react';
import { usePerformanceMode } from '../hooks/usePerformanceMode';
import {
  FeedIcon,
  TargetIcon,
  LayoutDashboardIcon,
  SearchIcon,
  DumbbellIcon,
  AddIcon,
} from './icons';
import type { Screen } from '../types';
import { useSettings } from '../src/contexts/SettingsContext';
import { useHaptics } from '../hooks/useHaptics';
import { useSound } from '../hooks/useSound';
import { useModal } from '../state/ModalContext';

const allNavItems: Record<Screen, {
  label: string;
  icon: React.ReactNode;
}> = {
  feed: { label: 'פיד', icon: <FeedIcon /> },
  today: { label: 'היום', icon: <TargetIcon /> },
  add: { label: 'הוספה', icon: <AddIcon /> },
  library: { label: 'ספרייה', icon: <LayoutDashboardIcon /> },
  search: { label: 'חיפוש', icon: <SearchIcon /> },
  fitness: { label: 'כושר', icon: <DumbbellIcon /> },
  investments: { label: 'השקעות', icon: <React.Fragment /> },
  settings: { label: 'הגדרות', icon: <React.Fragment /> },
  assistant: { label: 'יועץ', icon: <React.Fragment /> },
  calendar: { label: 'לוח שנה', icon: <React.Fragment /> },
  passwords: { label: 'סיסמאות', icon: <React.Fragment /> },
  views: { label: 'תצוגות', icon: <React.Fragment /> },
  login: { label: 'התחברות', icon: <React.Fragment /> },
  signup: { label: 'הרשמה', icon: <React.Fragment /> },
  dashboard: { label: 'דשבורד', icon: <React.Fragment /> },
  logos: { label: 'לוגואים', icon: <React.Fragment /> },
  insights: { label: 'תובנות', icon: <React.Fragment /> },
};

// iOS Tab Bar Item - Clean, minimal, system font aesthetics
// PERF: Memoized - only re-renders when its own isActive state changes
const IOSTabItem = React.memo<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  id?: string;
  badge?: number;
  enableAnimations: boolean;
}>(({ label, icon, isActive, onClick, id, badge, enableAnimations }) => {
  const iconClasses = 'h-[22px] w-[22px]';

  // Active: accent color, Inactive: theme-aware muted gray
  const iconStyle: React.CSSProperties = {
    color: isActive ? 'var(--dynamic-accent-start, #007AFF)' : 'var(--text-muted, #8E8E93)',
    transition: enableAnimations ? 'color 0.2s ease, transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
    transform: isActive ? 'scale(1.04)' : 'scale(1)',
  };

  const finalIcon = React.isValidElement<{ className?: string; filled?: boolean; style?: React.CSSProperties }>(icon)
    ? React.cloneElement(icon, { className: iconClasses, filled: isActive, style: iconStyle })
    : icon;

  return (
    <button
      id={id}
      onClick={onClick}
      className={`
        relative z-10 flex flex-col items-center justify-center py-1 px-2 min-w-[64px] min-h-[48px]
        focus:outline-none
        ${enableAnimations ? 'active:opacity-60' : ''}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
        transition: enableAnimations ? 'opacity 0.15s ease' : 'none',
        touchAction: 'manipulation',
      }}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Icon */}
      <div className="relative">
        {finalIcon}

        {/* iOS-style red notification badge */}
        {badge !== undefined && badge > 0 && (
          <div
            className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white nav-badge"
          >
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {/* Label - iOS 10px system font style */}
      <span
        className="mt-0.5 font-medium"
        style={{
          fontSize: '10px',
          lineHeight: '12px',
          color: isActive ? 'var(--dynamic-accent-start, #007AFF)' : 'var(--text-muted, #8E8E93)',
          transition: enableAnimations ? 'color 0.2s ease' : 'none',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </button>
  );
});
IOSTabItem.displayName = 'IOSTabItem';

// iOS Center Add Button - Elevated, system blue filled circle
const IOSCenterButton: React.FC<{
  onClick: () => void;
  onLongPress: () => void;
  id?: string;
  enableAnimations: boolean;
}> = ({ onClick, onLongPress, id, enableAnimations }) => {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handlePressStart = () => {
    setIsPressed(true);
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
      setIsPressed(false);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!didLongPress.current && isPressed) {
      onClick();
    }
    setIsPressed(false);
  };

  const handlePressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsPressed(false);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: 50, height: 50, marginTop: '-8px' }}>
      <button
        id={id}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center touch-none"
        style={{
          background: 'var(--dynamic-accent-start, #007AFF)',
          boxShadow: isPressed
            ? '0 2px 8px var(--dynamic-accent-glow, rgba(0, 122, 255, 0.25))'
            : '0 4px 14px var(--dynamic-accent-glow, rgba(0, 122, 255, 0.30)), 0 2px 6px var(--dynamic-accent-glow, rgba(0, 122, 255, 0.15))',
          transform: isPressed ? 'scale(0.92)' : 'scale(1)',
          transition: enableAnimations ? 'transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s ease' : 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="הוספה - לחיצה ארוכה לפתק מהיר"
      >
        {/* Inner highlight for depth */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 50%)',
          }}
        />

        <div
          className="relative z-10"
          style={{
            transform: isPressed ? 'rotate(45deg)' : 'none',
            transition: enableAnimations ? 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          }}
        >
          <AddIcon
            className="w-6 h-6"
            style={{ color: '#FFFFFF' }}
          />
        </div>
      </button>
    </div>
  );
};

const BottomNavBar: React.FC<{
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}> = ({ activeScreen, setActiveScreen }) => {
  const { settings } = useSettings();
  const { screenLabels } = settings;
  const { triggerHaptic } = useHaptics();
  const { playClick, playPop } = useSound();
  const { openModal } = useModal();
  const { enableAnimations } = usePerformanceMode();

  const handleLongPressAdd = useCallback(() => {
    triggerHaptic('medium');
    playPop();
    openModal('quickNote');
  }, [triggerHaptic, playPop, openModal]);

  const handleAddItemClick = useCallback(() => {
    playPop();
    triggerHaptic('light');
    if (activeScreen === 'investments') {
      sessionStorage.setItem('preselect_add', 'ticker');
    }
    setActiveScreen('add');
  }, [activeScreen, setActiveScreen, playPop, triggerHaptic]);

  const handleNavClick = useCallback(
    (screenId: Screen) => {
      if (screenId !== activeScreen) {
        playClick();
        triggerHaptic('light');
        setActiveScreen(screenId);
      }
    },
    [activeScreen, playClick, setActiveScreen, triggerHaptic]
  );

  const navItems = useMemo(() => {
    const layout: Screen[] = ['feed', 'today', 'library', 'fitness'];
    return layout.map(screenId => {
      const item = allNavItems[screenId] || allNavItems.today;
      const label = screenId === 'library' && screenLabels[screenId] === 'המתכנן'
        ? 'ספרייה'
        : (screenLabels[screenId] || item.label);
      return {
        id: screenId,
        label,
        icon: item.icon,
        onClick: () => handleNavClick(screenId),
      };
    });
  }, [screenLabels, handleNavClick]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="pointer-events-auto w-full">
        {/* 0.33px top separator -- theme-aware */}
        <div className="nav-separator" />

        {/* Tab bar body - frosted glass -- theme-aware */}
        <div
          className="relative"
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
            WebkitBackdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 4px)',
          }}
        >
          {/* Navigation items layout */}
          <div className="flex items-end justify-around pt-1.5 pb-0.5 max-w-lg mx-auto">
            {/* Left group: Feed, Today */}
            {navItems.slice(0, 2).map((item) => (
              <IOSTabItem
                key={item.id}
                id={`nav-${item.id}`}
                label={item.label}
                icon={item.icon}
                isActive={activeScreen === item.id}
                onClick={item.onClick}
                enableAnimations={enableAnimations}
              />
            ))}

            {/* Center: Add button */}
            <IOSCenterButton
              id="nav-add"
              onClick={handleAddItemClick}
              onLongPress={handleLongPressAdd}
              enableAnimations={enableAnimations}
            />

            {/* Right group: Library, Fitness */}
            {navItems.slice(2, 4).map((item) => (
              <IOSTabItem
                key={item.id}
                id={`nav-${item.id}`}
                label={item.label}
                icon={item.icon}
                isActive={activeScreen === item.id}
                onClick={item.onClick}
                enableAnimations={enableAnimations}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(BottomNavBar);
