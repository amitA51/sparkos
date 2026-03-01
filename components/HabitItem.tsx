import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { PersonalItem } from '../types';
import { FlameIcon, CheckCircleIcon, TrashIcon, ShieldCheckIcon, RefreshIcon, EditIcon } from './icons';
import { PinIcon } from './icons/contentIcons';
import { useHaptics } from '../hooks/useHaptics';
import { useCelebration } from '../hooks/useCelebration';
import { useSettings } from '../src/contexts/SettingsContext';
import { getToday, getYesterday } from '../utils/dateCache'; // ✅ PERF: Date caching

import { UltraCard } from './ui/UltraCard';
import { LongPressMenu, MenuAction } from './ui/LongPressMenu';

interface HabitItemProps {
  item: PersonalItem;
  onUpdate: (id: string, updates: Partial<PersonalItem>) => void;
  onDelete: (id: string) => void;
  onSelect: (item: PersonalItem, event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent, item: PersonalItem) => void;
  index: number;
}

const isDateToday = (isoDate: string | undefined) => {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  const today = getToday(); // ✅ PERF: Cached
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const HabitItem: React.FC<HabitItemProps> = ({
  item,
  onUpdate,
  onDelete,
  onSelect,
  onContextMenu,
  index,
}) => {
  const [justCompleted, setJustCompleted] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const { triggerHaptic, hapticSuccess } = useHaptics();
  const { triggerCelebration } = useCelebration();
  const { settings } = useSettings();

  const showStreak = settings.habitsSettings?.showHabitStats !== false;
  const showMissedHabits = settings.habitsSettings?.showMissedHabits !== false;

  const isCompletedToday = isDateToday(item.lastCompleted);
  const isBadHabit = item.habitType === 'bad';

  // Check if habit was missed yesterday (for showMissedHabits feature)
  const wasMissedYesterday = useMemo(() => {
    if (!showMissedHabits || isBadHabit || isCompletedToday) return false;
    if (!item.lastCompleted) return true; // Never completed = missed

    const lastDate = new Date(item.lastCompleted);
    const yesterday = getYesterday(); // ✅ PERF: Cached
    yesterday.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    // Was missed if last completion was before yesterday
    return lastDate.getTime() < yesterday.getTime();
  }, [item.lastCompleted, showMissedHabits, isBadHabit, isCompletedToday]);

  // Calculate "clean time" for bad habits
  const cleanDays =
    isBadHabit && item.lastCompleted
      ? Math.floor(
        (new Date().getTime() - new Date(item.lastCompleted).getTime()) / (1000 * 3600 * 24)
      )
      : 0;

  const handleUncomplete = useCallback(() => {
    const lastHistory = item.completionHistory?.slice(0, -1) || [];
    const newLastCompleted =
      lastHistory.length > 0 ? lastHistory[lastHistory.length - 1]?.date : undefined;

    // Decrement streak only if it was positive.
    const newStreak = (item.streak || 0) > 0 ? (item.streak || 0) - 1 : 0;

    onUpdate(item.id, {
      lastCompleted: newLastCompleted,
      streak: newStreak,
      completionHistory: lastHistory,
    });
  }, [item.id, item.completionHistory, item.streak, onUpdate]);

  const handleComplete = useCallback(
    async (isAuto: boolean = false) => {
      // 🎯 OPTIMISTIC: Immediate visual feedback
      if (!isAuto) hapticSuccess(); // Premium satisfaction pulse
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 800);

      const today = getToday(); // ✅ PERF: Cached
      const todayISO = today.toISOString();
      let newStreak = item.streak || 0;

      if (item.lastCompleted) {
        const lastDate = new Date(item.lastCompleted);
        const yesterday = getYesterday(); // ✅ PERF: Cached

        if (lastDate.toDateString() === yesterday.toDateString()) {
          newStreak++;
        } else if (lastDate.toDateString() !== today.toDateString()) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newHistory = [...(item.completionHistory || []), { date: todayISO }];

      // 🎉 Celebrate streak milestones (Atomic Habits: 7, 21, 66 days)
      const MILESTONE_DAYS = [7, 21, 66];
      if (MILESTONE_DAYS.includes(newStreak)) {
        triggerCelebration();
      }

      try {

        await onUpdate(item.id, {
          lastCompleted: todayISO,
          streak: newStreak,
          completionHistory: newHistory,
        });
      } catch (error) {
        console.error('Failed to complete habit:', error);
        // Note: Parent context handles state - no manual rollback needed
      }
    },
    [item.id, item.streak, item.lastCompleted, item.completionHistory, onUpdate, hapticSuccess, triggerCelebration]

  );

  const handleRelapse = useCallback(() => {
    triggerHaptic('heavy');
    const nowISO = new Date().toISOString();
    onUpdate(item.id, { lastCompleted: nowISO }); // Reset the "clean since" date to NOW
    setIsConfirmingReset(false);
  }, [item.id, onUpdate, triggerHaptic]);

  // Auto-complete main habit when all sub-habits are done
  useEffect(() => {
    const hasSubHabits = item.subHabits && item.subHabits.length > 0;
    if (!hasSubHabits) return;

    const allSubHabitsCompleted = (item.subHabits || []).every(sh =>
      isDateToday(item.lastCompletedSubHabits?.[sh.id])
    );

    if (allSubHabitsCompleted && !isCompletedToday) {
      handleComplete(true); // Auto-complete
    } else if (!allSubHabitsCompleted && isCompletedToday) {
      // If a sub-habit was unchecked, un-complete the main habit
      handleUncomplete();
    }
  }, [
    item.subHabits,
    item.lastCompletedSubHabits,
    isCompletedToday,
    handleComplete,
    handleUncomplete,
  ]);

  const handleToggleSubHabit = async (subHabitId: string) => {
    triggerHaptic('light');
    const newLastCompletedSubHabits = { ...(item.lastCompletedSubHabits || {}) };
    if (isDateToday(newLastCompletedSubHabits[subHabitId])) {
      delete newLastCompletedSubHabits[subHabitId];
    } else {
      newLastCompletedSubHabits[subHabitId] = getToday().toISOString(); // ✅ PERF: Cached
    }

    try {
      await onUpdate(item.id, { lastCompletedSubHabits: newLastCompletedSubHabits });
    } catch (error) {
      console.error('Failed to toggle sub-habit:', error);
    }
  };

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic('heavy');
      onDelete(item.id);
    },
    [item.id, onDelete, triggerHaptic]
  );

  const hasSubHabits = item.subHabits && item.subHabits.length > 0;

  // Distinct styling for bad habits
  const bgClass = isBadHabit
    ? 'border-red-500/20 bg-red-900/5'
    : isCompletedToday
      ? 'bg-[var(--dynamic-accent-start)]/20 border-[var(--dynamic-accent-start)]/50 completed-habit'
      : '';
  const iconColor = isBadHabit
    ? 'text-red-400'
    : item.streak && item.streak > 0
      ? 'text-[var(--dynamic-accent-start)] svg-glow'
      : 'text-muted';
  const MainIcon = isBadHabit ? ShieldCheckIcon : FlameIcon;

  // Handle pin toggle
  const handleTogglePin = useCallback(() => {
    triggerHaptic('light');
    onUpdate(item.id, { isPinned: !item.isPinned });
  }, [item.id, item.isPinned, onUpdate, triggerHaptic]);

  // Long-press menu actions - context-aware based on habit type
  const longPressActions: MenuAction[] = useMemo(() => {
    const deleteAction = () => {
      triggerHaptic('heavy');
      onDelete(item.id);
    };

    const pinAction: MenuAction = {
      id: 'pin',
      label: item.isPinned ? 'בטל הצמדה' : 'הצמד לראש',
      icon: <PinIcon className="w-5 h-5" filled={item.isPinned} />,
      onClick: handleTogglePin,
    };

    if (isBadHabit) {
      return [
        pinAction,
        {
          id: 'edit',
          label: 'ערוך',
          icon: <EditIcon className="w-5 h-5" />,
          onClick: () => onSelect(item, {} as React.MouseEvent),
        },
        {
          id: 'relapse',
          label: 'דווח מעידה',
          icon: <RefreshIcon className="w-5 h-5" />,
          onClick: () => setIsConfirmingReset(true),
          isDestructive: true,
        },
        {
          id: 'delete',
          label: 'מחק',
          icon: <TrashIcon className="w-5 h-5" />,
          onClick: deleteAction,
          isDestructive: true,
        },
      ];
    }
    return [
      pinAction,
      {
        id: 'complete',
        label: isCompletedToday ? 'בוצע היום!' : 'סמן כהושלם',
        icon: <CheckCircleIcon className="w-5 h-5" />,
        onClick: () => handleComplete(),
        isDisabled: isCompletedToday,
      },
      {
        id: 'edit',
        label: 'ערוך',
        icon: <EditIcon className="w-5 h-5" />,
        onClick: () => onSelect(item, {} as React.MouseEvent),
      },
      {
        id: 'delete',
        label: 'מחק',
        icon: <TrashIcon className="w-5 h-5" />,
        onClick: deleteAction,
        isDestructive: true,
      },
    ];
  }, [isBadHabit, isCompletedToday, item.isPinned, handleComplete, handleTogglePin, triggerHaptic, onDelete, onSelect, item]);

  return (
    <LongPressMenu actions={longPressActions}>
      <UltraCard
        onClick={e => onSelect(item, e)}
        onContextMenu={e => onContextMenu(e, item)}
        className={`group relative transition-all duration-300 ease-[var(--ease-spring-soft)] cursor-pointer active:scale-[0.98] animate-item-enter-fi border border-white/8 hover:border-white/15 ${bgClass}`}
        style={{ animationDelay: `${index * 50}ms`, willChange: 'transform' }}
        variant="glass"
        glowColor={isBadHabit ? 'magenta' : item.streak && item.streak > 0 ? 'cyan' : 'neutral'}
        noPadding
      >
        <div className="p-4">
          {justCompleted &&
            !isBadHabit &&
            Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="celebrate-sparkle"
                style={{
                  top: `${Math.random() * 80 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  width: `${Math.random() * 6 + 6}px`,
                  height: `${Math.random() * 6 + 6}px`,
                }}
              ></div>
            ))}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
              <div className="relative">
                <MainIcon className={`w-10 h-10 shrink-0 transition-all duration-500 ${iconColor}`} />
                {!isBadHabit && showStreak && item.streak && item.streak > 0 ? (
                  <span
                    className="absolute -top-1 -right-2 text-xs font-bold bg-[var(--dynamic-accent-start)] text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-[var(--bg-card)]"
                    style={{ boxShadow: '0 0 8px var(--dynamic-accent-glow)' }}
                  >
                    <span key={item.streak} className="animate-bump-up">
                      {item.streak}
                    </span>
                  </span>
                ) : null}
                {isBadHabit && (
                  <span className="absolute -top-1 -right-2 text-xs font-bold bg-green-500 text-white rounded-full w-auto min-w-[1.25rem] px-1 h-5 flex items-center justify-center border-2 border-[var(--bg-card)]">
                    {cleanDays}d
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p
                  className={`text-lg font-semibold ${isBadHabit ? 'text-red-100' : 'text-[var(--text-primary)]'}`}
                >
                  <span className="flex items-center gap-2">
                    {item.isPinned && (
                      <PinIcon className="w-4 h-4 text-amber-400 shrink-0" filled />
                    )}
                    {item.title}
                  </span>
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {isBadHabit
                    ? `נקי כבר ${cleanDays} ימים`
                    : isCompletedToday
                      ? 'כל הכבוד, נתראה מחר!'
                      : item.streak && item.streak > 0
                        ? `רצף של ${item.streak} ימים`
                        : 'בוא נתחיל הרגל חדש!'}
                </p>

                {/* Atomic Habits Indicators */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {/* Identity Badge */}
                  {item.habitIdentityId && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
                      🪞 זהות
                    </span>
                  )}

                  {/* Stacking Indicator */}
                  {item.habitStack?.anchorHabitId && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                      🔗 {item.habitStack.stackPosition === 'after' ? 'אחרי' : 'לפני'}
                    </span>
                  )}

                  {/* Two-Minute Progress */}
                  {item.twoMinuteStarter && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                      ⏱️ {item.twoMinuteStarter.currentPhase === 'micro' ? '2 דק' : item.twoMinuteStarter.currentPhase === 'growing' ? 'גדל' : 'מלא'}
                    </span>
                  )}

                  {/* Temptation Bundle */}
                  {item.temptationBundle?.wantActivity && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                      🎁 חיבור
                    </span>
                  )}

                  {/* Breaking Strategy Active */}
                  {isBadHabit && item.breakingStrategy?.triggers && item.breakingStrategy.triggers.length > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                      🛡️ {item.breakingStrategy.triggers.length} טריגרים
                    </span>
                  )}

                  {/* Best Streak Badge */}
                  {item.bestStreak && item.bestStreak > 7 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                      🏆 שיא: {item.bestStreak}
                    </span>
                  )}

                  {/* Missed Yesterday Warning */}
                  {wasMissedYesterday && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30 animate-pulse">
                      ⚠️ הוחמץ
                    </span>
                  )}
                </div>

                {/* Weekly Completion Visualization (last 7 days) */}
                {!isBadHabit && item.completionHistory && item.completionHistory.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const day = getToday(); // ✅ PERF: Cached
                      day.setDate(day.getDate() - (6 - i));
                      const dayStr = day.toISOString().split('T')[0];
                      const completed = item.completionHistory?.some(
                        h => h.date.split('T')[0] === dayStr
                      );
                      return (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm transition-all ${completed
                            ? 'bg-[var(--dynamic-accent-start)] shadow-[0_0_4px_var(--dynamic-accent-glow)]'
                            : 'bg-white/10'
                            }`}
                          title={day.toLocaleDateString('he-IL', { weekday: 'short' })}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {!hasSubHabits && !isBadHabit && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleComplete();
                }}
                disabled={isCompletedToday}
                className={`relative w-14 h-14 flex items-center justify-center rounded-full transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${isCompletedToday ? 'bg-[var(--dynamic-accent-start)] text-white' : 'bg-[var(--bg-secondary)] hover:bg-white/10 text-[var(--text-primary)]'}`}
                aria-label={isCompletedToday ? 'הושלם להיום' : 'סמן כהושלם'}
              >
                {isCompletedToday && (
                  <div className="absolute inset-0 rounded-full bg-[var(--dynamic-accent-start)] animate-ping opacity-70"></div>
                )}
                <CheckCircleIcon className="w-8 h-8" />
              </button>
            )}

            {isBadHabit &&
              (isConfirmingReset ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-red-400 text-center">בטוח?</span>
                  <div className="flex gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRelapse();
                      }}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                    >
                      כן
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setIsConfirmingReset(false);
                      }}
                      className="bg-secondary text-white text-xs px-2 py-1 rounded hover:bg-muted"
                    >
                      לא
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsConfirmingReset(true);
                  }}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all transform hover:scale-110 active:scale-95 bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-400"
                  title="אפס ספירה (מעידה)"
                >
                  <RefreshIcon className="w-5 h-5" />
                </button>
              ))}
          </div>

          {hasSubHabits && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              {item.subHabits?.map(sh => {
                const isSubCompleted = isDateToday(item.lastCompletedSubHabits?.[sh.id]);
                return (
                  <div
                    key={sh.id}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleSubHabit(sh.id);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={isSubCompleted}
                      className="h-5 w-5 rounded bg-black/30 border-muted text-[var(--dynamic-accent-start)] focus:ring-[var(--dynamic-accent-start)] cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${isSubCompleted ? 'line-through text-muted' : 'text-secondary'}`}
                    >
                      {sh.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleDelete}
            className="absolute top-2 left-2 text-[var(--text-secondary)] hover:text-[var(--danger)] transition-all transform hover:scale-110 flex-shrink-0 opacity-0 group-hover:opacity-100"
            aria-label="מחק הרגל"
          >
            <TrashIcon className="h-5 h-5" />
          </button>
        </div>
      </UltraCard>
    </LongPressMenu>
  );
};

export default React.memo(HabitItem);
