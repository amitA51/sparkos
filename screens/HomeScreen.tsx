// CLEANED - CSS vars fixed

import React, { useState, useCallback, useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import type { PersonalItem, Screen } from '../types';
import HabitItem from '../components/HabitItem';
import PersonalItemDetailModal from '../components/PersonalItemDetailModal';
import PersonalItemContextMenu from '../components/PersonalItemContextMenu';
import QuickAddTask from '../components/QuickAddTask';
import DailyProgressCircle from '../components/DailyProgressCircle';
import { SettingsIcon, SparklesIcon, EyeIcon } from '../components/icons';
import SkeletonLoader, { HomeScreenSkeleton } from '../components/SkeletonLoader';
import { useData } from '../src/contexts/DataContext';
import { useSettings } from '../src/contexts/SettingsContext';

import { generateDailyBriefing } from '../services/ai';
import { isHabitForToday } from '../hooks/useTodayItems';
import { useContextMenu } from '../hooks/useContextMenu';
import StatusMessage, { StatusMessageType } from '../components/StatusMessage';
import { useHomeInteraction } from '../hooks/useHomeInteraction';
import { rollOverIncompleteTasks } from '../services/dataService';
import { useHaptics } from '../hooks/useHaptics';
import { useItemReordering } from '../hooks/useItemReordering';

import Section from '../components/Section';
import type { ViewMode } from '../components/ViewSwitcher';
import TodayView from '../components/TodayView';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { SmoothLoader } from '../components/ui/SmoothLoader';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../components/animations/presets';
import { PullToRefresh } from '../components/gestures/PullToRefresh';

import DraggableModule from '../components/DraggableModule';
import { rafThrottle } from '../utils/performance';
import PremiumHeader from '../components/PremiumHeader';
import HabitWeekProgress from '../components/HabitWeekProgress';
import HeaderInfoBar from '../components/widgets/HeaderInfoBar';
import { HomeScreenComponentId } from '../types';
import { parseDate } from '../utils/dateUtils';
import { useUser } from '../src/contexts/UserContext';
import { useGamification } from '../hooks/useGamification';
import XPBar from '../components/gamification/XPBar';
import AchievementToast from '../components/gamification/AchievementToast';
import LevelUpCelebration from '../components/gamification/LevelUpCelebration';
const AchievementsModal = lazy(() => import('../components/gamification/AchievementsModal'));

// PERF: Lazy-load optional home widgets -- only fetched when their module is visible in layout
const DailyBriefingModal = lazy(() => import('../components/DailyBriefingModal'));
const GratitudeTracker = lazy(() => import('../components/GratitudeTracker'));
const GoogleCalendarWidget = lazy(() => import('../components/GoogleCalendarWidget'));
const FocusTimerWidget = lazy(() => import('../components/widgets/FocusTimerWidget'));
const MeditationWidget = lazy(() => import('../components/widgets/MeditationWidget'));
const ComfortZoneWidget = lazy(() => import('../components/ComfortZoneWidget'));
const MagazineQuoteWidget = lazy(() => import('../components/widgets/MagazineQuoteWidget'));
const WeatherWidget = lazy(() => import('../components/widgets/WeatherWidget'));
const WeeklyGoalsWidget = lazy(() => import('../components/widgets/WeeklyGoalsWidget'));
const StreakDashboardWidget = lazy(() => import('../components/widgets/StreakDashboardWidget'));
const QuickNotesWidget = lazy(() => import('../components/widgets/QuickNotesWidget'));
const UpcomingEventsWidget = lazy(() => import('../components/widgets/UpcomingEventsWidget'));
const MiniTimerWidget = lazy(() => import('../components/widgets/MiniTimerWidget'));
const DailyQuoteWidget = lazy(() => import('../components/widgets/DailyQuoteWidget'));
const DailyReviewModal = lazy(() => import('../components/review/DailyReviewModal'));
const DailyReviewReminder = lazy(() => import('../components/review/DailyReviewReminder'));
const ReviewHistoryView = lazy(() => import('../components/review/ReviewHistoryView'));

interface HomeScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen }) => {
  const { personalItems, feedItems, isLoading, updatePersonalItem, refreshAll } = useData();
  const { settings } = useSettings();
  const { user } = useUser();
  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu<PersonalItem>();
  const { triggerHaptic } = useHaptics();
  const gamification = useGamification();

  // Check achievements whenever personalItems or feedItems change
  const prevItemCountRef = useRef(personalItems.length);
  useEffect(() => {
    // Only check when items change (not on every render)
    if (personalItems.length !== prevItemCountRef.current) {
      prevItemCountRef.current = personalItems.length;
      gamification.checkAndAwardAchievements(personalItems, feedItems);
    }
  }, [personalItems, feedItems, gamification.checkAndAwardAchievements]);

  // Listen for command palette achievements open event
  useEffect(() => {
    const handler = () => gamification.openAchievementsModal();
    window.addEventListener('sparkos:open-achievements', handler);
    return () => window.removeEventListener('sparkos:open-achievements', handler);
  }, [gamification.openAchievementsModal]);

  // Listen for command palette daily review events
  useEffect(() => {
    const handleReviewEvent = () => setShowDailyReview(true);
    const handleHistoryEvent = () => setShowReviewHistory(true);
    window.addEventListener('sparkos:open-daily-review', handleReviewEvent);
    window.addEventListener('sparkos:open-review-history', handleHistoryEvent);
    return () => {
      window.removeEventListener('sparkos:open-daily-review', handleReviewEvent);
      window.removeEventListener('sparkos:open-review-history', handleHistoryEvent);
    };
  }, []);

  const [statusMessage, setStatusMessage] = useState<{
    type: StatusMessageType;
    text: string;
    id: number;
    onUndo?: () => void;
  } | null>(null);
  const showStatus = useCallback(
    (type: StatusMessageType, text: string, onUndo?: () => void) => {
      if (type === 'error') {
        triggerHaptic('heavy');
      }
      setStatusMessage({ type, text, id: Date.now(), onUndo });
    },
    [triggerHaptic]
  );

  const {
    selectedItem,
    handleSelectItem,
    handleCloseModal,
    handleUpdateItem,
    handleDeleteItem,
    handleDeleteWithConfirmation,
    handleDuplicateItem,
    handleStartFocus,
  } = useHomeInteraction(showStatus);

  // PERFORMANCE: Use const instead of useState since view is always 'today'
  const view: ViewMode = 'today';

  // State for selected date in weekly planner - shared between TodayView and QuickAddTask
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const { updateSettings } = useSettings();

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      const currentLayout = settings.homeScreenLayout;
      const layoutMap = new Map(currentLayout.map(c => [c.id, c]));
      const hiddenItems = currentLayout.filter(c => !c.isVisible);

      const newLayout = [
        ...newOrder.map(id => layoutMap.get(id as HomeScreenComponentId)!),
        ...hiddenItems,
      ];

      updateSettings({ homeScreenLayout: newLayout });
    },
    [settings.homeScreenLayout, updateSettings]
  );

  const handleHideModule = useCallback(
    (moduleId: string) => {
      const currentLayout = settings.homeScreenLayout;
      const newLayout = currentLayout.map(c =>
        c.id === moduleId ? { ...c, isVisible: false } : c
      );
      updateSettings({ homeScreenLayout: newLayout });
      triggerHaptic('light');
      showStatus('success', 'הרכיב הוסתר', () => {
        // Undo: revert the change
        const reverted = newLayout.map(c => (c.id === moduleId ? { ...c, isVisible: true } : c));
        updateSettings({ homeScreenLayout: reverted });
      });
    },
    [settings.homeScreenLayout, updateSettings, triggerHaptic, showStatus]
  );

  const handleRestoreModules = () => {
    const newLayout = settings.homeScreenLayout.map(c => ({ ...c, isVisible: true }));
    updateSettings({ homeScreenLayout: newLayout });
    triggerHaptic('medium');
  };

  const visibleModules = useMemo(
    () => settings.homeScreenLayout.filter(c => c.isVisible).map(c => c.id),
    [settings.homeScreenLayout]
  );

  const hiddenModulesCount = useMemo(
    () => settings.homeScreenLayout.filter(c => !c.isVisible).length,
    [settings.homeScreenLayout]
  );

  const { tasks, habits } = useMemo(() => {
    const allHabits = personalItems.filter(item => item.type === 'habit');
    // Sort habits: pinned first, then by order/createdAt
    const sortedAllHabits = allHabits.sort((a, b) => {
      // Pinned items always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by order/createdAt
      return (
        (a.order ?? new Date(a.createdAt).getTime()) - (b.order ?? new Date(b.createdAt).getTime())
      );
    });

    const openTasks = personalItems.filter(item => item.type === 'task' && !item.isCompleted);

    let filteredTasks: PersonalItem[];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // parseDate imported from utils/dateUtils

    if (view === 'today') {
      const tomorrowEnd = new Date();
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
      tomorrowEnd.setHours(23, 59, 59, 999);

      filteredTasks = openTasks.filter(item => {
        if (!item.dueDate) return false;
        const dueDate = parseDate(item.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        return dueDate <= tomorrowEnd;
      });
    } else if (view === 'tomorrow') {
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(todayStart.getDate() + 1);
      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999);

      filteredTasks = openTasks.filter(item => {
        if (!item.dueDate) return false;
        const dueDate = parseDate(item.dueDate);
        return dueDate >= tomorrowStart && dueDate <= tomorrowEnd;
      });
    } else {
      const weekEnd = new Date(todayStart);
      weekEnd.setDate(todayStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      filteredTasks = openTasks.filter(item => {
        if (!item.dueDate) return false;
        const dueDate = parseDate(item.dueDate);
        return dueDate >= todayStart && dueDate <= weekEnd;
      });
    }

    // Sort tasks: pinned first, then by due date, then by priority
    const sortedTasks = filteredTasks.sort((a, b) => {
      // Pinned items always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // ✅ PERF: Direct string comparison for YYYY-MM-DD (ISO) dates
      // Much faster than creating Date objects + splitting strings
      if (a.dueDate && b.dueDate) {
        if (a.dueDate !== b.dueDate) {
          const dateA = String(a.dueDate);
          const dateB = String(b.dueDate);
          return dateA.localeCompare(dateB);
        }
      } else if (a.dueDate) {
        return -1; // a has date, b doesn't -> a comes first
      } else if (b.dueDate) {
        return 1; // b has date, a doesn't -> b comes first
      }

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
    });

    return {
      tasks: sortedTasks,
      habits: sortedAllHabits,
    };
  }, [personalItems, view]);

  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [briefingContent, setBriefingContent] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  const habitsReordering = useItemReordering(habits, handleUpdateItem, 'order');

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      if (headerRef.current) {
        const scrollY = window.scrollY;
        const translateY = Math.min(scrollY * 0.5, 150);
        headerRef.current.style.transform = `translateY(-${translateY}px)`;
        headerRef.current.style.opacity = `${Math.max(1 - scrollY / 200, 0)}`;
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGetBriefing = useCallback(async () => {
    if (isBriefingLoading) return;
    setIsBriefingLoading(true);
    setBriefingContent('');
    try {
      const gratitudeItem = personalItems.find(
        item =>
          item.type === 'gratitude' &&
          new Date(item.createdAt).toDateString() === new Date().toDateString()
      );
      const habitsForBriefing = personalItems.filter(
        item => item.type === 'habit' && isHabitForToday(item)
      );
      const briefing = await generateDailyBriefing(
        tasks.slice(0, 3),
        habitsForBriefing,
        gratitudeItem?.content || null,
        settings.aiPersonality
      );
      setBriefingContent(briefing);
    } catch {
      setBriefingContent('שגיאה בעת יצירת התדריך. אנא נסה שוב.');
    } finally {
      setIsBriefingLoading(false);
    }
  }, [isBriefingLoading, personalItems, tasks, settings.aiPersonality]);

  const handleRollOverTasks = useCallback(async () => {
    const updates = await rollOverIncompleteTasks();
    if (updates.length > 0) {
      await Promise.all(updates.map(update => updatePersonalItem(update.id, update.updates)));
      showStatus('success', `גלגלת ${updates.length} משימות להיום.`);
    } else {
      showStatus('success', 'אין משימות לגלגל.');
    }
  }, [updatePersonalItem, showStatus]);

  // PERF: Single-pass reduce instead of 6 separate .filter() calls (6x O(n) -> 1x O(n))
  const { completionPercentage, overdueTasksCount } = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTime = todayStart.getTime();

    let totalHabits = 0;
    let uncompletedHabitsToday = 0;
    let totalTasks = 0;
    let openTaskCount = 0;
    let overdueCount = 0;

    for (const item of personalItems) {
      if (item.type === 'habit') {
        totalHabits++;
        if (isHabitForToday(item)) uncompletedHabitsToday++;
      } else if (item.type === 'task') {
        totalTasks++;
        if (!item.isCompleted) {
          openTaskCount++;
          if (item.dueDate && new Date(item.dueDate).getTime() < todayTime) {
            overdueCount++;
          }
        }
      }
    }

    const habitsCompletedToday = totalHabits - uncompletedHabitsToday;
    const tasksCompleted = totalTasks - openTaskCount;
    const totalTrackedItems = totalHabits + totalTasks;
    const totalCompleted = habitsCompletedToday + tasksCompleted;
    const percentage = totalTrackedItems > 0 ? (totalCompleted / totalTrackedItems) * 100 : 0;

    return { completionPercentage: percentage, overdueTasksCount: overdueCount };
  }, [personalItems]);

  // PERFORMANCE: Memoize todayDate - only calculate once per mount
  const todayDate = useMemo(
    () =>
      new Date().toLocaleDateString('he-IL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    []
  );

  const renderModule = useCallback(
    (moduleId: string, variants?: Record<string, unknown>) => {
      switch (moduleId) {
        case 'google_calendar':
          return (
            <DraggableModule
              id="google_calendar"
              onHide={() => handleHideModule('google_calendar')}
              variants={variants}
            >
              <div className="spark-card p-padding-card">
                <Section
                  componentId="google_calendar"
                  title={settings.sectionLabels.google_calendar || 'לוח שנה'}
                  count={0} // Calendar widget handles its own count or doesn't show it
                  isCollapsible={true}
                  isExpanded={true}
                  onToggle={noopToggle}
                  className="pl-2"
                >
                  <Suspense fallback={null}>
                    <GoogleCalendarWidget />
                  </Suspense>
                </Section>
              </div>
            </DraggableModule>
          );
        case 'gratitude':
          return (
            <DraggableModule
              id="gratitude"
              onHide={() => handleHideModule('gratitude')}
              variants={variants}
            >
              <div className="spark-card p-padding-card">
                <Section
                  componentId="gratitude"
                  title={settings.sectionLabels.gratitude || 'הכרת תודה'}
                  count={0}
                  isCollapsible={true}
                  isExpanded={true}
                  onToggle={noopToggle}
                  className="pl-2"
                >
                  <Suspense fallback={null}>
                    <GratitudeTracker />
                  </Suspense>
                </Section>
              </div>
            </DraggableModule>
          );
        case 'comfort_zone':
          return null; // Now part of quote_comfort_row
        case 'quote':
          return null; // Now part of quote_comfort_row
        case 'quote_comfort_row':
          return (
            <DraggableModule
              id="quote_comfort_row"
              onHide={() => handleHideModule('quote_comfort_row' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <div className="flex flex-col gap-4">
                  <MagazineQuoteWidget title={settings.sectionLabels.quote} />
                  <ComfortZoneWidget title={settings.sectionLabels.comfort_zone} />
                </div>
              </Suspense>
            </DraggableModule>
          );
        case 'focus_timer':
          return (
            <DraggableModule
              id="focus_timer"
              onHide={() => handleHideModule('focus_timer' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <FocusTimerWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'meditation':
          return (
            <DraggableModule
              id="meditation"
              onHide={() => handleHideModule('meditation' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <MeditationWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'tasks':
          return (
            <DraggableModule
              id="tasks"
              onHide={() => handleHideModule('tasks')}
              variants={variants}
            >
              {/* Negative margin to counter screen-shell padding for true edge-to-edge */}
              <div className="w-[calc(100%+2rem)] -mx-4">
                <div className="px-4 mb-4">
                  <QuickAddTask
                    onItemAdded={message => showStatus('success', message)}
                    defaultDate={selectedDate}
                  />
                </div>
                <SmoothLoader
                  isLoading={isLoading}
                  skeleton={<div className="px-4"><SkeletonLoader count={5} /></div>}
                  minSkeletonTime={300}
                >
                  <TodayView
                    tasks={tasks}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                    onSelectItem={item =>
                      handleSelectItem(item, {
                        clientX: 0,
                        clientY: 0,
                      } as React.MouseEvent<HTMLElement>)
                    }
                    onContextMenu={handleContextMenu}
                    onStartFocus={handleStartFocus}
                    onRollOverTasks={handleRollOverTasks}
                    overdueTasksCount={overdueTasksCount}
                    selectedDate={selectedDate}
                    onSelectedDateChange={setSelectedDate}
                  />
                </SmoothLoader>
              </div>
            </DraggableModule>
          );
        case 'habits':
          return (
            <DraggableModule
              id="habits"
              onHide={() => handleHideModule('habits')}
              variants={variants}
            >
              <div className="spark-card p-padding-card">
                {/* Weekly Progress Indicator */}
                <HabitWeekProgress className="mb-4" />

                <Section
                  componentId="fixed_habits"
                  title={settings.sectionLabels.habits || 'הרגלים'}
                  count={habits.length}
                  isCollapsible={true}
                  isExpanded={true}
                  onToggle={noopToggle}
                  className="pl-2"
                  emptyMessage="עוד לא יצרת הרגלים קבועים."
                >
                  <div onDrop={habitsReordering.handleDrop}>
                    <AnimatePresence initial={false}>
                    {habits.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{
                          opacity: { duration: 0.2 },
                          height: { type: 'spring', stiffness: 300, damping: 30 },
                          layout: { type: 'spring', stiffness: 300, damping: 30 },
                        }}
                        draggable
                        onDragStart={e => habitsReordering.handleDragStart(e as unknown as React.DragEvent, item)}
                        onDragEnter={e => habitsReordering.handleDragEnter(e as unknown as React.DragEvent, item)}
                        onDragEnd={habitsReordering.handleDragEnd}
                        onDragOver={e => e.preventDefault()}
                        className={`${habitsReordering.draggingItem?.id === item.id ? 'dragging-item opacity-50' : ''} cursor-grab`}
                      >
                        <HabitItem
                          item={item}
                          onUpdate={handleUpdateItem}
                          onDelete={handleDeleteItem}
                          onSelect={handleSelectItem}
                          onContextMenu={handleContextMenu}
                          index={index}
                        />
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                </Section>
              </div>
            </DraggableModule>
          );
        case 'weather':
          return (
            <DraggableModule
              id="weather"
              onHide={() => handleHideModule('weather' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <WeatherWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'weekly_goals':
          return (
            <DraggableModule
              id="weekly_goals"
              onHide={() => handleHideModule('weekly_goals' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <WeeklyGoalsWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'streak_dashboard':
          return (
            <DraggableModule
              id="streak_dashboard"
              onHide={() => handleHideModule('streak_dashboard' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <StreakDashboardWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'quick_notes':
          return (
            <DraggableModule
              id="quick_notes"
              onHide={() => handleHideModule('quick_notes' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <QuickNotesWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'upcoming_events':
          return (
            <DraggableModule
              id="upcoming_events"
              onHide={() => handleHideModule('upcoming_events' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <UpcomingEventsWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'mini_timer':
          return (
            <DraggableModule
              id="mini_timer"
              onHide={() => handleHideModule('mini_timer' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <MiniTimerWidget />
              </Suspense>
            </DraggableModule>
          );
        case 'daily_quote':
          return (
            <DraggableModule
              id="daily_quote"
              onHide={() => handleHideModule('daily_quote' as HomeScreenComponentId)}
              variants={variants}
            >
              <Suspense fallback={null}>
                <DailyQuoteWidget />
              </Suspense>
            </DraggableModule>
          );
        default:
          return null;
      }
    },
    [
      handleHideModule,
      settings.sectionLabels,
      showStatus,
      selectedDate,
      isLoading,
      tasks,
      handleUpdateItem,
      handleDeleteItem,
      handleSelectItem,
      handleContextMenu,
      handleStartFocus,
      handleRollOverTasks,
      overdueTasksCount,
      habits,
      habitsReordering,
    ]
  );

  // PERF: Stable callback for PullToRefresh - avoids re-render of child tree
  const handlePullToRefresh = useCallback(async () => {
    triggerHaptic('medium');
    if (refreshAll) {
      await refreshAll();
      showStatus('success', 'הנתונים רועננו בהצלחה');
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }, [triggerHaptic, refreshAll, showStatus]);

  // PERF: Stable no-op for Section onToggle (sections are always expanded)
  const noopToggle = useCallback(() => {}, []);

  // PERF: Stable callback for settings navigation
  const handleGoToSettings = useCallback(() => setActiveScreen('settings'), [setActiveScreen]);

  // PERF: Stable callback for briefing modal close
  const handleCloseBriefing = useCallback(() => setBriefingContent(''), []);

  // PERF: Stable callback for status message dismiss
  const handleDismissStatus = useCallback(() => setStatusMessage(null), []);

  // === Daily Review ===
  const [showDailyReview, setShowDailyReview] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);
  const handleOpenReview = useCallback(() => setShowDailyReview(true), []);
  const handleCloseReview = useCallback(() => setShowDailyReview(false), []);
  const handleCloseReviewHistory = useCallback(() => setShowReviewHistory(false), []);

  // Smooth crossfade from skeleton to content
  const showInitialSkeleton = isLoading && personalItems.length === 0;

  return (
    <SmoothLoader
      isLoading={showInitialSkeleton}
      skeleton={<HomeScreenSkeleton />}
      minSkeletonTime={350}
      className="min-h-screen"
    >
    <div className="screen-shell space-y-5 sm:space-y-6 transition-all duration-300">
      <PullToRefresh
        onRefresh={handlePullToRefresh}
      >
        {/* Clean Premium Header */}

        <PremiumHeader
          title={user?.displayName || settings.userName || 'הי!'}
          subtitle={settings.homeSettings?.showGreeting !== false ? todayDate : undefined}
          showTimeGreeting
          actions={
            <>
              <button
                onClick={handleGetBriefing}
                className="glass-action-btn group w-touch-min h-touch-min p-3"
                aria-label="תדריך יומי"
              >
                <SparklesIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </button>
              <button
                onClick={handleGoToSettings}
                className="glass-action-btn group w-touch-min h-touch-min p-3"
                aria-label="הגדרות"
              >
                <SettingsIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              </button>
            </>
          }
        >
          <div className="flex items-center gap-3 flex-wrap">
            <DailyProgressCircle percentage={completionPercentage} />
            <div className="flex-1 min-w-[140px]">
              <XPBar
                level={gamification.level}
                tierNameHe={gamification.tierNameHe}
                currentXP={gamification.xpProgress.currentXP}
                levelStartXP={gamification.xpProgress.levelStartXP}
                levelEndXP={gamification.xpProgress.levelEndXP}
                progressPercent={gamification.xpProgress.progressPercent}
                recentXPGain={gamification.recentXPGain}
              />
            </div>
            <HeaderInfoBar />
            {/* Compact stats badges */}
            <div className="flex items-center gap-2">
              {tasks.length > 0 && (
                <span
                  className="badge-glow badge-glow-cyan"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--dynamic-accent-start, #007AFF)' }} />
                  {tasks.length} משימות
                </span>
              )}
              {overdueTasksCount > 0 && (
                <span
                  className="badge-glow badge-glow-error"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {overdueTasksCount} באיחור
                </span>
              )}
            </div>
          </div>
        </PremiumHeader>

        <div className="flex flex-col gap-6 relative z-10">
          <Reorder.Group
            axis="y"
            values={visibleModules}
            onReorder={handleReorder}
            className="flex flex-col gap-5"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="visible"
          >
            {visibleModules.map(moduleId => (
              <React.Fragment key={moduleId}>{renderModule(moduleId, STAGGER_ITEM)}</React.Fragment>
            ))}
          </Reorder.Group>
        </div>

        {hiddenModulesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8 mb-4"
          >
            <motion.button
              onClick={handleRestoreModules}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200"
              style={{
                background: 'var(--gray-50)',
                border: '0.5px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <EyeIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              הצג רכיבים מוסתרים
              <span
                className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  background: 'var(--dynamic-accent-color, var(--gray-100))',
                  color: 'var(--dynamic-accent-start, var(--text-primary))',
                }}
              >
                {hiddenModulesCount}
              </span>
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedItem && (
            <PersonalItemDetailModal
              item={selectedItem}
              onClose={handleCloseModal}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteWithConfirmation}
              initialEditMode={selectedItem.type === 'habit'}
            />
          )}
        </AnimatePresence>
        {contextMenu.isOpen && contextMenu.item && (
          <PersonalItemContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            onClose={closeContextMenu}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            onDuplicate={handleDuplicateItem}
            onStartFocus={handleStartFocus}
          />
        )}
        {(isBriefingLoading || briefingContent) && (
          <Suspense fallback={null}>
            <DailyBriefingModal
              isLoading={isBriefingLoading}
              briefingContent={briefingContent}
              onClose={handleCloseBriefing}
            />
          </Suspense>
        )}
        {statusMessage && (
          <StatusMessage
            key={statusMessage.id}
            type={statusMessage.type}
            message={statusMessage.text}
            onDismiss={handleDismissStatus}
            onUndo={statusMessage.onUndo}
          />
        )}

        {/* Daily Review Reminder & Modals */}
        <Suspense fallback={null}>
          <DailyReviewReminder onStartReview={handleOpenReview} />
        </Suspense>
        {showDailyReview && (
          <Suspense fallback={null}>
            <DailyReviewModal isOpen={showDailyReview} onClose={handleCloseReview} />
          </Suspense>
        )}
        {showReviewHistory && (
          <Suspense fallback={null}>
            <ReviewHistoryView isOpen={showReviewHistory} onClose={handleCloseReviewHistory} />
          </Suspense>
        )}

        {/* Gamification Overlays */}
        <AchievementToast
          achievement={gamification.pendingAchievementToast}
          onDismiss={gamification.dismissAchievementToast}
        />
        <LevelUpCelebration
          show={gamification.showLevelUp}
          newLevel={gamification.levelUpLevel}
          onDismiss={gamification.dismissLevelUp}
        />
        {gamification.showAchievementsModal && (
          <Suspense fallback={null}>
            <AchievementsModal
              isOpen={gamification.showAchievementsModal}
              onClose={gamification.closeAchievementsModal}
              context={gamification.getCheckContext(personalItems, feedItems)}
              unlockedAchievements={gamification.unlockedAchievements}
            />
          </Suspense>
        )}
      </PullToRefresh>
    </div>
    </SmoothLoader>
  );
};

export default React.memo(HomeScreen);
