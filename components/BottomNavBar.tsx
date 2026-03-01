// Apple-Style Premium BottomNavBar
// Clean, minimal, luxurious — inspired by iOS tab bar aesthetics
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
};

// Apple-style NavItem — pill indicator behind active icon, always-visible labels
const AppleNavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  id?: string;
  badge?: number;
  enableAnimations: boolean;
}> = ({ label, icon, isActive, onClick, id, badge, enableAnimations }) => {
  const iconClasses = 'h-[22px] w-[22px]';

  const iconStyle: React.CSSProperties = isActive
    ? {
      color: 'var(--dynamic-accent-start)',
      filter: 'drop-shadow(0 0 6px var(--dynamic-accent-glow))',
    }
    : {
      color: 'rgba(255, 255, 255, 0.5)',
    };

  const finalIcon = React.isValidElement<{ className?: string; filled?: boolean; style?: React.CSSProperties }>(icon)
    ? React.cloneElement(icon, { className: iconClasses, filled: isActive, style: iconStyle })
    : icon;

  return (
    <button
      id={id}
      onClick={onClick}
      className={`
        relative z-10 flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px]
        focus:outline-none rounded-2xl
        ${enableAnimations ? 'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}
        ${enableAnimations ? 'active:scale-[0.92]' : ''}
      `}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active pill backdrop — Apple-style */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          ${enableAnimations ? 'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}
        `}
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(var(--accent-rgb, 99,102,241), 0.12) 0%, rgba(var(--accent-rgb, 99,102,241), 0.06) 100%)'
            : 'transparent',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scale(1)' : 'scale(0.85)',
          border: isActive ? '0.5px solid rgba(var(--accent-rgb, 99,102,241), 0.15)' : '0.5px solid transparent',
        }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <div
          className={enableAnimations ? 'transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}
          style={{ transform: isActive ? 'scale(1.08)' : 'scale(1)' }}
        >
          {finalIcon}
        </div>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <div
            className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{
              background: '#FF3B30',
              boxShadow: '0 1px 4px rgba(255, 59, 48, 0.4)',
            }}
          >
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {/* Label — always visible, Apple-style */}
      <span
        className={`
          text-[10px] mt-1 font-semibold tracking-wide
          ${enableAnimations ? 'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}
        `}
        style={{
          color: isActive ? 'var(--dynamic-accent-start)' : 'rgba(255, 255, 255, 0.5)',
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </span>
    </button>
  );
};

// Apple-style Center Button — clean glass with accent ring
const AppleCenterButton: React.FC<{
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
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      {/* Subtle ambient glow */}
      {enableAnimations && (
        <div
          className="absolute inset-0 rounded-full blur-lg pointer-events-none"
          style={{
            background: 'var(--dynamic-accent-glow)',
            opacity: 0.2,
            transform: 'scale(1.4)',
          }}
        />
      )}

      <button
        id={id}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onContextMenu={(e) => e.preventDefault()}
        className={`
          relative w-[48px] h-[48px] rounded-[16px] flex items-center justify-center overflow-hidden touch-none
          ${enableAnimations ? 'transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]' : ''}
          ${enableAnimations ? 'hover:scale-[1.04] active:scale-[0.92]' : ''}
        `}
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(var(--accent-rgb, 99,102,241), 0.3)',
          boxShadow: `
            0 0 0 0.5px rgba(255, 255, 255, 0.05) inset,
            0 1px 0 rgba(255, 255, 255, 0.08) inset,
            0 4px 12px rgba(0, 0, 0, 0.2)
          `,
          transform: isPressed ? 'scale(0.9)' : undefined,
        }}
        aria-label="הוספה - לחיצה ארוכה לפתק מהיר"
      >
        {/* Accent gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb, 99,102,241), 0.15) 0%, rgba(var(--accent-rgb, 99,102,241), 0.05) 100%)',
            borderRadius: 'inherit',
          }}
        />

        {/* Top highlight — glass depth */}
        <div
          className="absolute top-0 left-[15%] right-[15%] h-[1px]"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />

        <div
          className={enableAnimations ? 'relative z-10 transition-transform duration-200' : 'relative z-10'}
          style={{ transform: isPressed ? 'rotate(45deg) scale(0.85)' : undefined }}
        >
          <AddIcon
            className="w-6 h-6"
            style={{
              color: 'var(--dynamic-accent-start)',
              filter: 'drop-shadow(0 0 8px var(--dynamic-accent-glow))',
            }}
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none flex justify-center pb-safe">
      <div
        className="relative w-full max-w-md pointer-events-auto"
        style={{ padding: '0 12px 8px' }}
      >
        <div
          className="relative h-[72px] overflow-hidden"
          style={{ borderRadius: '22px' }}
        >
          {/* Glass background — Apple-grade frost */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(18, 18, 24, 0.72)',
              backdropFilter: 'blur(64px) saturate(200%)',
              WebkitBackdropFilter: 'blur(64px) saturate(200%)',
              borderRadius: 'inherit',
            }}
          />

          {/* Subtle border — Apple glass edge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 'inherit',
              border: '0.5px solid rgba(255, 255, 255, 0.10)',
              boxShadow: `
                0 0 0 0.5px rgba(255, 255, 255, 0.03) inset,
                0 1px 0 rgba(255, 255, 255, 0.06) inset,
                0 -1px 0 rgba(0, 0, 0, 0.15) inset,
                0 8px 32px rgba(0, 0, 0, 0.35),
                0 2px 8px rgba(0, 0, 0, 0.2)
              `,
            }}
          />

          {/* Top highlight line — subtle shine */}
          <div
            className="absolute top-0 left-[20%] right-[20%] h-[0.5px] pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.15), transparent)',
              borderRadius: '1px',
            }}
          />

          {/* Navigation items layout */}
          <div className="relative z-10 flex items-center justify-between h-full px-2">
            {/* Left group: Feed, Today */}
            <div className="flex items-center justify-evenly flex-1">
              {navItems.slice(0, 2).map((item) => (
                <AppleNavItem
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

            {/* Center: Add button */}
            <div className="flex items-center justify-center mx-1">
              <AppleCenterButton
                id="nav-add"
                onClick={handleAddItemClick}
                onLongPress={handleLongPressAdd}
                enableAnimations={enableAnimations}
              />
            </div>

            {/* Right group: Library, Fitness */}
            <div className="flex items-center justify-evenly flex-1">
              {navItems.slice(2, 4).map((item) => (
                <AppleNavItem
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
      </div>
    </nav>
  );
};

export default React.memo(BottomNavBar);
