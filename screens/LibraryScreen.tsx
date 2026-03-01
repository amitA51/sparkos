import React, { useState, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PersonalItem, Screen, Space, AddableType } from '../types';
import PersonalItemDetailModal from '../components/PersonalItemDetailModal';
import PersonalItemContextMenu from '../components/PersonalItemContextMenu';
import ProjectDetailScreen from './ProjectDetailScreen';
import {
  InboxIcon,
  ChevronLeftIcon,
  PlusIcon,
} from '../components/icons';

import SkeletonLoader from '../components/SkeletonLoader';
import { duplicatePersonalItem, reAddPersonalItem } from '../services/dataService';
import { useContextMenu } from '../hooks/useContextMenu';
import StatusMessage, { StatusMessageType } from '../components/StatusMessage';
import SpaceDetailScreen from './SpaceDetailScreen';
import PersonalItemCard from '../components/PersonalItemCard';
import { useDebounce } from '../hooks/useDebounce';
import { useItemReordering } from '../hooks/useItemReordering';
import { useModal } from '../state/ModalContext';
import QuickNoteModal from '../components/QuickNoteModal';

// Lazy loaded heavy components for code splitting
const NotebookContainer = lazy(() => import('../components/notebook/NotebookContainer'));
const CalendarView = lazy(() => import('../components/CalendarView'));
const TimelineView = lazy(() => import('../components/TimelineView'));
const PasswordManager = lazy(() => import('../components/password/PasswordManager'));
const InvestmentsScreen = lazy(() => import('./InvestmentsScreen'));
const FitnessHubView = lazy(() => import('../components/library/fitness/FitnessHubView').then(module => ({ default: module.FitnessHubView })));

import CategoryAccordion from '../components/CategoryAccordion';
import { useData } from '../src/contexts/DataContext';
import { useSettings } from '../src/contexts/SettingsContext';
import { useFocusSession } from '../src/contexts/FocusContext';

import {
  PremiumViewSwitcher,
  PremiumLibraryHeader,
  PremiumSpaceCard,
  PremiumLibraryEmptyState,
  AddSpaceModal,
  FileGallery,
} from '../components/library';




type HubView = 'dashboard' | 'timeline' | 'fitness' | 'board' | 'calendar' | 'vault' | 'investments' | 'files';
type ActiveView =
  | { type: HubView }
  | { type: 'project'; item: PersonalItem }
  | { type: 'space'; item: Space }
  | { type: 'inbox' };


const LibraryScreen: React.FC<{ setActiveScreen: (screen: Screen) => void }> = ({
  setActiveScreen,
}) => {
  const {
    personalItems,
    spaces,
    isLoading,
    updatePersonalItem,
    removePersonalItem,
    updateSpace,
    addSpace,
    refreshAll,
  } = useData();
  const { settings, updateSettings } = useSettings();

  // DEBUG removed - was causing unnecessary console noise in production

  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu<PersonalItem>();
  const { openModal } = useModal();

  const [activeView, setActiveView] = useState<ActiveView>({ type: 'dashboard' });
  const [selectedItem, setSelectedItem] = useState<PersonalItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: StatusMessageType;
    text: string;
    id: number;
    onUndo?: () => void;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);


  // Space drag & drop state
  const dragSpace = useRef<Space | null>(null);
  const dragOverSpace = useRef<Space | null>(null);
  const [draggingSpaceId, setDraggingSpaceId] = useState<string | null>(null);

  // Add Space Modal state
  const [isAddSpaceModalOpen, setIsAddSpaceModalOpen] = useState(false);

  const [quickNoteDate, setQuickNoteDate] = useState<string | null>(null);

  const showStatus = useCallback((type: StatusMessageType, text: string, onUndo?: () => void) => {
    setStatusMessage({ type, text, id: Date.now(), onUndo });
  }, []);

  const handleQuickAdd = (type: AddableType, defaults: Partial<PersonalItem> = {}) => {
    sessionStorage.setItem('preselect_add', type);
    sessionStorage.setItem('preselect_add_defaults', JSON.stringify(defaults));
    setActiveScreen('add');
  };

  // Check for space redirect on mount/activeView change
  React.useEffect(() => {
    const redirectSpaceId = sessionStorage.getItem('library_redirect_space');
    if (redirectSpaceId) {
      const spaceToOpen = spaces.find(s => s.id === redirectSpaceId);
      if (spaceToOpen) {
        setActiveView({ type: 'space', item: spaceToOpen });
      }
      sessionStorage.removeItem('library_redirect_space');
    }
  }, [spaces]);

  const handleCalendarQuickAdd = (date: string) => {
    setQuickNoteDate(date);
  };

  const handleUpdateItem = useCallback(
    async (id: string, updates: Partial<PersonalItem>) => {
      const originalItem = personalItems.find(item => item.id === id);
      if (!originalItem) return;

      setSelectedItem(prev => (prev && prev.id === id ? { ...prev, ...updates } : prev));

      try {
        await updatePersonalItem(id, updates);
      } catch (error) {
        console.error('Failed to update item:', error);
        setSelectedItem(prev => (prev && prev.id === id ? originalItem : prev));
        showStatus('error', 'שגיאה בעדכון הפריט.');
      }
    },
    [personalItems, showStatus, updatePersonalItem]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const itemToDelete = personalItems.find(item => item.id === id);
      if (!itemToDelete) return;

      await removePersonalItem(id);

      showStatus('success', 'הפריט נמחק.', async () => {
        await reAddPersonalItem(itemToDelete);
        await refreshAll();
      });
    },
    [personalItems, showStatus, removePersonalItem, refreshAll]
  );

  const handleSelectItem = useCallback(
    (item: PersonalItem, event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.stopPropagation();
      if (item.type === 'roadmap') {
        openModal('roadmapScreen', {
          item,
          onUpdate: handleUpdateItem,
          onDelete: handleDeleteItem,
        });
        return;
      }
      setSelectedItem(item);
    },
    [openModal, handleUpdateItem, handleDeleteItem]
  );

  const handleCloseModal = useCallback((nextItem?: PersonalItem) => {
    setSelectedItem(nextItem || null);
  }, []);

  const handleDeleteWithConfirmation = useCallback(
    (id: string) => {
      const itemToDelete = personalItems.find(item => item.id === id);
      if (itemToDelete) {
        handleDeleteItem(id);
        setSelectedItem(null);
      }
    },
    [personalItems, handleDeleteItem]
  );

  const handleDuplicateItem = useCallback(
    async (id: string) => {
      await duplicatePersonalItem(id);
      await refreshAll();
      showStatus('success', 'הפריט שוכפל');
    },
    [refreshAll, showStatus]
  );

  const { startSession } = useFocusSession();

  const handleStartFocus = useCallback(
    (item: PersonalItem) => {
      startSession(item);
    },
    [startSession]
  );

  // PERF: Single-pass O(n) instead of O(3n) triple filter
  const { inboxItems, projectItems, personalSpaces, childItemsByProject, itemCountBySpace } = useMemo(() => {
    const inbox: PersonalItem[] = [];
    const projects: PersonalItem[] = [];
    const childrenByProject = new Map<string, PersonalItem[]>();
    const countBySpace = new Map<string, number>();

    for (const item of personalItems) {
      // Build project children lookup
      if (item.projectId) {
        if (!childrenByProject.has(item.projectId)) childrenByProject.set(item.projectId, []);
        childrenByProject.get(item.projectId)!.push(item);
      }

      // Build space item count lookup
      if (item.spaceId) {
        countBySpace.set(item.spaceId, (countBySpace.get(item.spaceId) || 0) + 1);
      }

      // Classify items
      if (item.type === 'roadmap') {
        projects.push(item);
      } else if (
        !item.spaceId &&
        !item.projectId &&
        item.type !== 'goal' &&
        item.type !== 'habit' &&
        item.type !== 'task' &&
        !item.dueDate
      ) {
        inbox.push(item);
      }
    }

    // Sort smaller arrays after filtering
    inbox.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const pSpaces = spaces.filter(s => s.type === 'personal').sort((a, b) => a.order - b.order);

    return {
      inboxItems: inbox,
      projectItems: projects,
      personalSpaces: pSpaces,
      childItemsByProject: childrenByProject,
      itemCountBySpace: countBySpace,
    };
  }, [personalItems, spaces]);

  const libraryStats = useMemo(() => {
    return {
      inbox: inboxItems.length,
      projects: projectItems.length,
      spaces: personalSpaces.length,
      total: personalItems.length,
    };
  }, [inboxItems.length, projectItems.length, personalSpaces.length, personalItems.length]);

  const inboxReordering = useItemReordering(inboxItems, handleUpdateItem);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const lowerCaseQuery = debouncedQuery.toLowerCase();
    return personalItems.filter(
      item =>
        (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
        (item.content && item.content.toLowerCase().includes(lowerCaseQuery))
    );
  }, [debouncedQuery, personalItems]);


  // Space drag & drop handlers
  const handleSpaceDragStart = useCallback((space: Space) => {
    dragSpace.current = space;
    setDraggingSpaceId(space.id);
  }, []);

  const handleSpaceDragOver = useCallback((space: Space) => {
    dragOverSpace.current = space;
  }, []);

  const handleSpaceDrop = useCallback(() => {
    const draggedSpace = dragSpace.current;
    const targetSpace = dragOverSpace.current;

    if (!draggedSpace || !targetSpace || draggedSpace.id === targetSpace.id) {
      setDraggingSpaceId(null);
      return;
    }

    const currentSpaces = [...personalSpaces];
    const dragItemIndex = currentSpaces.findIndex(s => s.id === draggedSpace.id);
    const dragOverItemIndex = currentSpaces.findIndex(s => s.id === targetSpace.id);

    if (dragItemIndex === -1 || dragOverItemIndex === -1) {
      setDraggingSpaceId(null);
      return;
    }

    let newOrder: number;

    if (dragItemIndex > dragOverItemIndex) {
      const prevItem = currentSpaces[dragOverItemIndex - 1];
      const nextItem = currentSpaces[dragOverItemIndex];
      if (prevItem && nextItem) {
        newOrder = (prevItem.order + nextItem.order) / 2;
      } else if (nextItem) {
        newOrder = nextItem.order - 1000;
      } else {
        newOrder = draggedSpace.order;
      }
    } else {
      const prevItem = currentSpaces[dragOverItemIndex];
      const nextItem = currentSpaces[dragOverItemIndex + 1];
      if (prevItem && nextItem) {
        newOrder = (prevItem.order + nextItem.order) / 2;
      } else if (prevItem) {
        newOrder = prevItem.order + 1000;
      } else {
        newOrder = draggedSpace.order;
      }
    }

    updateSpace(draggedSpace.id, { order: newOrder }).catch(err => {
      console.error('Failed to update space order:', err);
      showStatus('error', 'שגיאה בעדכון סדר המרחבים');
    });

    setDraggingSpaceId(null);
    dragSpace.current = null;
    dragOverSpace.current = null;
  }, [personalSpaces, updateSpace, showStatus]);

  // Get project/roadmap progress based on child items
  const getProjectProgress = useCallback((project: PersonalItem) => {
    const childItems = childItemsByProject.get(project.id) || [];
    const childTasks = childItems.filter(
      i => i.type === 'task' || i.type === 'roadmap' || (i.phases && i.phases.length > 0)
    );

    const completedTasks = childTasks.reduce((acc, i) => {
      if (i.type === 'task' && i.isCompleted) return acc + 1;
      if (i.type === 'roadmap' && i.phases)
        return acc + i.phases.flatMap(p => p.tasks).filter(t => t.isCompleted).length;
      return acc;
    }, 0);

    const totalTasks = childTasks.reduce((acc, i) => {
      if (i.type === 'task') return acc + 1;
      if (i.type === 'roadmap' && i.phases) return acc + i.phases.flatMap(p => p.tasks).length;
      return acc;
    }, 0);

    return {
      completedTasks,
      totalTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }, [childItemsByProject]);

  const handleTogglePinSpace = useCallback(async (space: Space, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateSpace(space.id, { isPinned: !space.isPinned });
    } catch (error) {
      console.error('Failed to toggle pin space:', error);
      showStatus('error', 'שגיאה בעדכון המרחב');
    }
  }, [updateSpace, showStatus]);

  // PERF: Use pre-computed lookup instead of filtering all items per space
  const getSpaceData = useCallback((space: Space) => {
    return {
      id: space.id,
      name: space.name,
      icon: space.icon || '📁',
      color: space.color || 'var(--dynamic-accent-start)',
      itemCount: itemCountBySpace.get(space.id) || 0,
      description: undefined,
    };
  }, [itemCountBySpace]);

  // Sort spaces
  const sortedSpaces = useMemo(() => {
    const result = [...personalSpaces];

    // Sort by pinned first, then by order
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.order - b.order;
    });

    return result;
  }, [personalSpaces]);

  const renderMainHub = () => {
    const hasTimelineItems = personalItems.some(i => i.dueDate);
    const shouldShowProjectsEmpty = !isLoading && projectItems.length === 0;

    return (
      <div className="relative min-h-screen">
        <PremiumLibraryHeader
          title={settings.screenLabels?.library === 'המתכנן' ? 'ספרייה' : (settings.screenLabels?.library || 'ספרייה')}
          stats={libraryStats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenAssistant={() => setActiveScreen('assistant')}
          onOpenSplitView={() => openModal('splitViewConfiguration')}
        />

        <AnimatePresence mode="wait">
          {debouncedQuery ? (
            <motion.div
              key="search-results"
              className="px-4 space-y-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-sm text-theme-secondary">
                {searchResults.length} תוצאות נמצאו עבור "{debouncedQuery}"
              </p>
              {searchResults.length === 0 && (
                <PremiumLibraryEmptyState type="general" />
              )}
              {searchResults.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PersonalItemCard
                    item={item}
                    index={index}
                    searchQuery={debouncedQuery}
                    onSelect={handleSelectItem}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                    onContextMenu={handleContextMenu}
                    onLongPress={() => { }}
                    isInSelectionMode={false}
                    isSelected={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              className={`transition-all duration-500 ${selectedItem ? 'opacity-50 scale-98' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 max-w-5xl mx-auto">
                <PremiumViewSwitcher
                  currentView={activeView.type as HubView}
                  onViewChange={view => setActiveView({ type: view })}
                  tabOrder={settings.libraryTabOrder}
                  onTabOrderChange={(newOrder) => updateSettings({ libraryTabOrder: newOrder })}
                />
              </div>

              <div className="pt-6 sm:pt-8 pb-32">
                {isLoading && <SkeletonLoader count={3} />}

                <AnimatePresence mode="wait">
                  {!isLoading && activeView.type === 'dashboard' && (
                    <motion.div
                      key="dashboard"
                      className="space-y-8 sm:space-y-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {inboxItems.length > 0 ? (
                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <motion.button
                            onClick={() => setActiveView({ type: 'inbox' })}
                            className="spark-card spark-card-interactive w-full p-4 sm:p-5 flex justify-between items-center group cursor-pointer"
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/12 border border-emerald-500/20">
                                <InboxIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                              </div>
                              <div className="text-right">
                                <h2 className="text-base sm:text-lg font-bold text-white">
                                  תיבת דואר נכנס
                                </h2>
                                <p className="text-xs text-theme-muted">
                                  פריטים שממתינים לארגון
                                </p>
                              </div>
                            </div>
                            <span className="spark-badge spark-badge-success text-sm font-mono font-bold px-3 py-1.5">
                              {inboxItems.length}
                            </span>
                          </motion.button>
                        </motion.section>
                      ) : (
                        <PremiumLibraryEmptyState
                          type="inbox"
                          onAction={() => handleQuickAdd('task')}
                          actionLabel="הוסף פריט חדש"
                        />
                      )}

                      {/* Spaces Section */}
                      <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="spark-card p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[13px] font-semibold tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              מרחבים
                            </h2>
                            <button
                              onClick={() => setIsAddSpaceModalOpen(true)}
                              className="spark-btn spark-btn-ghost spark-btn-sm flex items-center gap-1.5 text-xs"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              הוסף
                            </button>
                          </div>

                          <div className="grid gap-3 grid-cols-1">
                            {sortedSpaces.map((space, index) => (
                              <PremiumSpaceCard
                                key={space.id}
                                space={getSpaceData(space)}
                                onOpen={() => setActiveView({ type: 'space', item: space })}
                                index={index}
                                isDragging={draggingSpaceId === space.id}
                                onDragStart={() => handleSpaceDragStart(space)}
                                onDragOver={() => handleSpaceDragOver(space)}
                                onDrop={handleSpaceDrop}
                                viewMode="list"
                                onTogglePin={(e) => handleTogglePinSpace(space, e)}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.section>



                      {projectItems.length > 0 ? (
                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="spark-card p-4 sm:p-5">
                            <h2 className="text-[13px] font-semibold tracking-wide mb-4" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              מפות דרכים
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                              {projectItems.map((roadmap, index) => {
                                const progress = getProjectProgress(roadmap);
                                return (
                                  <motion.div
                                    key={roadmap.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.04 }}
                                    className="relative"
                                  >
                                    <PersonalItemCard
                                      item={roadmap}
                                      index={index}
                                      onSelect={handleSelectItem}
                                      onUpdate={handleUpdateItem}
                                      onDelete={handleDeleteItem}
                                      onContextMenu={handleContextMenu}
                                      onLongPress={() => { }}
                                      isInSelectionMode={false}
                                      isSelected={false}
                                    />
                                    {progress.totalTasks > 0 && (
                                      <div className="mt-2 px-3">
                                        <div className="flex items-center justify-between text-xs text-theme-secondary mb-1">
                                          <span>{progress.completedTasks} / {progress.totalTasks} משימות</span>
                                          <span className="font-mono font-bold" style={{ color: 'var(--dynamic-accent-start)' }}>
                                            {progress.progress}%
                                          </span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                          <motion.div
                                            className="h-full rounded-full"
                                            style={{
                                              background: 'linear-gradient(90deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress.progress}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + index * 0.04 }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.section>
                      ) : (
                        shouldShowProjectsEmpty && (
                          <PremiumLibraryEmptyState
                            type="projects"
                            onAction={() => handleQuickAdd('roadmap')}
                            actionLabel="צור מפת דרכים חדשה"
                          />
                        )
                      )}

                      {personalItems.length > 0 && (
                        <motion.section
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="spark-card p-4 sm:p-5">
                            <h2 className="text-[13px] font-semibold tracking-wide mb-4" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              כל הפריטים לפי קטגוריה
                            </h2>
                            <CategoryAccordion
                              items={personalItems}
                              onSelectItem={handleSelectItem}
                              onUpdateItem={handleUpdateItem}
                              onDeleteItem={handleDeleteItem}
                              onContextMenu={handleContextMenu}
                              groupBy="type"
                            />
                          </div>
                        </motion.section>
                      )}
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'timeline' && (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="px-4 sm:px-6 lg:px-8"
                    >
                      <div className="max-w-5xl mx-auto">
                        <header className="mb-6 flex items-center justify-between gap-3">
                          <div>
                            <h2 className="text-[13px] font-semibold tracking-wide mb-1 px-1"
                              style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              ציר זמן
                            </h2>
                            <p className="text-xs text-theme-secondary px-1">
                              מבט כרונולוגי על כל מה שחשוב לך, עם חיבורים חכמים בין משימות, פרויקטים ומרחבים
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-xs text-theme-secondary">
                            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                              ⌘K לפתיחת פקודות
                            </div>
                            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                              ⌘F לחיפוש
                            </div>
                          </div>
                        </header>

                        {hasTimelineItems ? (
                          <div className="rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 via-white/0 to-white/5 backdrop-blur-xl p-2 sm:p-4">
                            <TimelineView
                              items={personalItems}
                              onSelectItem={handleSelectItem}
                              onUpdate={handleUpdateItem}
                              onDelete={handleDeleteItem}
                              onContextMenu={handleContextMenu}
                              onLongPress={() => { }}
                            />
                          </div>
                        ) : (
                          <PremiumLibraryEmptyState
                            type="timeline"
                            onAction={() => handleQuickAdd('task')}
                            actionLabel="הוסף משימה עם תאריך יעד"
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'fitness' && (
                    <motion.div
                      key="fitness"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="px-4 sm:px-6 lg:px-8"
                    >
                      <div className="max-w-6xl mx-auto">
                        <FitnessHubView />
                      </div>
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'board' && (
                    <motion.div
                      key="board"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="h-full min-h-[60vh]"
                    >
                      <Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-pulse text-theme-secondary">טוען מחברות...</div>
                        </div>
                      }>
                        <NotebookContainer />
                      </Suspense>
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'calendar' && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="px-4 sm:px-6 lg:px-8"
                    >
                      <div className="max-w-6xl mx-auto space-y-4">
                        <header className="flex items-center justify-between gap-3">
                          <div>
                            <h2 className="text-[13px] font-semibold tracking-wide mb-1 px-1"
                              style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              לוח שנה
                            </h2>
                            <p className="text-xs text-theme-secondary px-1">
                              תצוגת זמן פרימיום עם הדגשה חכמה של היום, שבוע העבודה והאירועים הקרובים
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-xs text-theme-secondary">
                            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                              הקלקה כפולה ליצירת משימה
                            </div>
                          </div>
                        </header>

                        <div
                          className="rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 via-white/0 to-white/5 backdrop-blur-xl p-2 sm:p-3 lg:p-4"
                          style={{
                            boxShadow: '0 24px 80px rgba(15,23,42,0.65)',
                          }}
                        >
                          <CalendarView
                            items={personalItems}
                            onUpdate={handleUpdateItem}
                            onSelectItem={(item, e) => handleSelectItem(item, e)}
                            onQuickAdd={(_, date) => handleCalendarQuickAdd(date)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'files' && (
                    <motion.div
                      key="files"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="px-4 sm:px-6 lg:px-8"
                    >
                      <div className="max-w-6xl mx-auto space-y-4">
                        <header className="flex items-center justify-between gap-3">
                          <div>
                            <h2 className="text-[13px] font-semibold tracking-wide mb-1 px-1"
                              style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              קבצים ומסמכים
                            </h2>
                            <p className="text-xs text-theme-secondary px-1">
                              כל הקבצים שלך במקום אחד, עם תצוגת גלריה פרימיום ותצוגה מקדימה מהירה
                            </p>
                          </div>
                          <div className="hidden sm:flex items-center gap-2 text-xs text-theme-secondary">
                            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                              גרור קובץ לכאן כדי להעלות
                            </div>
                          </div>
                        </header>

                        <div
                          className="rounded-3xl border border-white/8 bg-gradient-to-b from-white/5 via-white/0 to-white/5 backdrop-blur-xl p-3 sm:p-4"
                          style={{
                            boxShadow: '0 24px 80px rgba(15,23,42,0.65)',
                          }}
                        >
                          <FileGallery
                            items={personalItems}
                            onSelect={item => handleSelectItem(item)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'investments' && (
                    <motion.div
                      key="investments"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <InvestmentsScreen setActiveScreen={setActiveScreen} />
                    </motion.div>
                  )}

                  {!isLoading && activeView.type === 'vault' && (
                    <motion.div
                      key="vault"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <PasswordManager />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    );
  };

  if (activeView.type === 'project') {
    return (
      <ProjectDetailScreen
        project={activeView.item}
        onBack={() => setActiveView({ type: 'dashboard' })}
        onSelectItem={handleSelectItem}
      />
    );
  }

  if (activeView.type === 'space') {
    return (
      <SpaceDetailScreen
        space={activeView.item}
        onBack={() => setActiveView({ type: 'dashboard' })}
        onSelectItem={handleSelectItem}
        setActiveScreen={setActiveScreen}
      />
    );
  }

  if (activeView.type === 'inbox') {
    const contextItems = inboxItems;
    return (
      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <header className="sticky top-0 z-20 px-4 py-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setActiveView({ type: 'dashboard' })}
              className="p-2.5 rounded-xl text-theme-secondary hover:text-white transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="חזור לדשבורד"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white font-heading">תיבת דואר נכנס</h1>
              <p className="text-sm text-theme-secondary">{inboxItems.length} פריטים ממתינים</p>
            </div>
          </div>
        </header>

        <div className="space-y-3 px-4 pt-4 pb-32" onDrop={inboxReordering.handleDrop}>
          {inboxItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <PersonalItemCard
                item={item}
                index={index}
                onSelect={handleSelectItem}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onContextMenu={handleContextMenu}
                onLongPress={() => { }}
                isInSelectionMode={false}
                isSelected={false}
                onDragStart={(e, item) => inboxReordering.handleDragStart(e, item)}
                onDragEnter={(e, item) => inboxReordering.handleDragEnter(e, item)}
                onDragEnd={inboxReordering.handleDragEnd}
                isDragging={inboxReordering.draggingItem?.id === item.id}
              />
            </motion.div>
          ))}
        </div>

        {selectedItem && (
          <PersonalItemDetailModal
            item={selectedItem}
            contextItems={contextItems}
            onClose={handleCloseModal}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteWithConfirmation}
          />
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {renderMainHub()}

      <PersonalItemDetailModal
        item={selectedItem}
        onClose={handleCloseModal}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteWithConfirmation}
      />

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

      {quickNoteDate && (
        <QuickNoteModal date={quickNoteDate} onClose={() => setQuickNoteDate(null)} />
      )}

      {/* Add Space Modal */}
      <AddSpaceModal
        isOpen={isAddSpaceModalOpen}
        onClose={() => setIsAddSpaceModalOpen(false)}
        onAdd={async (spaceData) => {
          await addSpace(spaceData);
        }}
      />

      {statusMessage && (
        <StatusMessage
          key={statusMessage.id}
          type={statusMessage.type}
          message={statusMessage.text}
          onDismiss={() => setStatusMessage(null)}
          onUndo={statusMessage.onUndo}
        />
      )}
    </div>
  );
};

export default React.memo(LibraryScreen);
