import React, { useMemo, useState, useEffect } from 'react';
import TimeSection from '../TimeSection';
import { CheckCircleIcon } from '../icons';
import { PersonalItem } from '../../types';
import { Toast } from '../ui/Toast';
import { Reorder, useDragControls } from 'framer-motion';
import { useData } from '../../src/contexts/DataContext';
import { todayKey } from '../../utils/dateUtils';

interface TasksTodayWidgetProps {
  onTaskClick?: (task: PersonalItem) => void;
  onTaskComplete?: (taskId: string) => void;
}

// Config for the static parts of the section
interface SectionData {
  title: string;
  icon: React.ReactNode;
  tasks: PersonalItem[];
  gradient: string;
  borderColor: string;
  onReorder: (newTasks: PersonalItem[]) => void;
}

// SectionItem takes the fully merged props for TimeSection
type SectionId = 'morning' | 'afternoon' | 'evening' | 'anytime';

const SectionItem = ({ section, id }: { section: Omit<React.ComponentProps<typeof TimeSection>, 'dragHandleProps'>; id: string }) => {
  const dragControls = useDragControls();
  return (
    <Reorder.Item value={id} dragListener={false} dragControls={dragControls} className="relative">
      <TimeSection
        {...section}
        isDraggable={true}
        dragHandleProps={{ onPointerDown: (e: React.PointerEvent) => dragControls.start(e) }}
      />
    </Reorder.Item>
  );
};

const TasksTodayWidget: React.FC<TasksTodayWidgetProps> = ({ onTaskClick, onTaskComplete }) => {
  const { personalItems, updatePersonalItem, removePersonalItem, addPersonalItem } = useData();
  const [hiddenTaskIds, setHiddenTaskIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; isVisible: boolean; onUndo?: () => void }>({
    message: '',
    isVisible: false,
  });
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>([
    'morning',
    'afternoon',
    'evening',
    'anytime',
  ]);

  const todayTasks = useMemo(() => {
    const today = todayKey();
    return personalItems
      .filter(
        item =>
          item.type === 'task' && item.dueDate === today && !item.isCompleted && !item.isArchived
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [personalItems]);

  const [orderedTasks, setOrderedTasks] = useState<PersonalItem[]>(todayTasks);

  useEffect(() => {
    setOrderedTasks(todayTasks);
  }, [todayTasks]);

  const completedToday = useMemo(() => {
    const today = todayKey();
    return personalItems.filter(
      item => item.type === 'task' && item.dueDate === today && item.isCompleted && !item.isArchived
    ).length;
  }, [personalItems]);

  const handleReorderTasks = async (newOrder: PersonalItem[]) => {
    setOrderedTasks(newOrder);

    // Update order in DB
    const updates = newOrder.map((item, index) => updatePersonalItem(item.id, { order: index }));

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error('Failed to update task order:', error);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<PersonalItem>) => {
    try {
      await updatePersonalItem(id, updates);
      if (updates.isCompleted !== undefined) {
        onTaskComplete?.(id);
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleHide = async (id: string) => {
    // Optimistic update
    setHiddenTaskIds(prev => new Set(prev).add(id));

    // Persist
    try {
      await updatePersonalItem(id, { isArchived: true });

      setToast({
        message: 'המשימה הוסתרה',
        isVisible: true,
        onUndo: async () => {
          setHiddenTaskIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          await updatePersonalItem(id, { isArchived: false });
          setToast(prev => ({ ...prev, isVisible: false }));
        },
      });
    } catch (error) {
      console.error('Failed to hide task:', error);
      setHiddenTaskIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = orderedTasks.find(t => t.id === id);
    if (!taskToDelete) return;

    // 🎯 OPTIMISTIC: Remove from local state immediately
    setOrderedTasks(prev => prev.filter(t => t.id !== id));

    // Show undo toast immediately
    setToast({
      message: 'המשימה נמחקה',
      isVisible: true,
      onUndo: async () => {
        // Re-add to database (context will update state)
        const { id: oldId, ...rest } = taskToDelete;
        await addPersonalItem({
          ...rest,
          type: 'task',
        });
        setToast(prev => ({ ...prev, isVisible: false }));
      },
    });

    try {
      await removePersonalItem(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      // 🔄 ROLLBACK: DataContext will have the item back on refresh
      // Trigger a manual restore for immediate feedback
      setOrderedTasks(prev => [...prev, taskToDelete].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setToast({ message: 'שגיאה במחיקה', isVisible: true });
    }
  };


  // Helper to filter tasks by time of day
  const isMorning = (time?: string) => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0] || '0');
    return hour >= 5 && hour < 12;
  };

  const isAfternoon = (time?: string) => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0] || '0');
    return hour >= 12 && hour < 17;
  };

  const isEvening = (time?: string) => {
    if (!time) return false;
    const hour = parseInt(time.split(':')[0] || '0');
    return hour >= 17 && hour < 22;
  };

  const visibleTasks = orderedTasks.filter(t => !hiddenTaskIds.has(t.id));

  const morningTasks = visibleTasks.filter(t => isMorning(t.dueTime));
  const afternoonTasks = visibleTasks.filter(t => isAfternoon(t.dueTime));
  const eveningTasks = visibleTasks.filter(t => isEvening(t.dueTime));
  const anytimeTasks = visibleTasks.filter(t => !t.dueTime);

  const sectionsConfig: Record<SectionId, SectionData> = {
    morning: {
      title: 'בוקר',
      icon: <span className="text-xl" aria-hidden="true">🌅</span>,
      tasks: morningTasks,
      gradient: 'from-orange-400 to-yellow-400',
      borderColor: 'border-orange-400/20',
      onReorder: (newTasks: PersonalItem[]) =>
        handleReorderTasks([...newTasks, ...afternoonTasks, ...eveningTasks, ...anytimeTasks]),
    },
    afternoon: {
      title: 'צהריים',
      icon: <span className="text-xl" aria-hidden="true">☀️</span>,
      tasks: afternoonTasks,
      gradient: 'from-blue-400 to-cyan-400',
      borderColor: 'border-blue-400/20',
      onReorder: (newTasks: PersonalItem[]) =>
        handleReorderTasks([...morningTasks, ...newTasks, ...eveningTasks, ...anytimeTasks]),
    },
    evening: {
      title: 'ערב',
      icon: <span className="text-xl" aria-hidden="true">🌙</span>,
      tasks: eveningTasks,
      gradient: 'from-indigo-400 to-purple-400',
      borderColor: 'border-indigo-400/20',
      onReorder: (newTasks: PersonalItem[]) =>
        handleReorderTasks([...morningTasks, ...afternoonTasks, ...newTasks, ...anytimeTasks]),
    },
    anytime: {
      title: 'בכל זמן',
      icon: <span className="text-xl" aria-hidden="true">📋</span>,
      tasks: anytimeTasks,
      gradient: 'from-gray-400 to-slate-400',
      borderColor: 'border-gray-400/20',
      onReorder: (newTasks: PersonalItem[]) =>
        handleReorderTasks([...morningTasks, ...afternoonTasks, ...eveningTasks, ...newTasks]),
    },
  };

  const visibleSections = sectionOrder.filter(id => sectionsConfig[id].tasks.length > 0);

  const handleSectionReorder = (newVisibleOrder: SectionId[]) => {
    // Append hidden sections to the end
    const hiddenSections = sectionOrder.filter(id => !newVisibleOrder.includes(id));
    setSectionOrder([...newVisibleOrder, ...hiddenSections]);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Progress Bar */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 mb-4 border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[var(--text-secondary)] font-medium flex items-center gap-2">
              התקדמות היום
              {completedToday + orderedTasks.length > 0 &&
                completedToday / (completedToday + orderedTasks.length) >= 1 && (
                  <span className="inline-block animate-bounce">🎉</span>
                )}
            </span>
            <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums">
              {completedToday} / {completedToday + orderedTasks.length}
            </span>
          </div>
          <div className="relative w-full bg-[var(--bg-tertiary)] rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${orderedTasks.length + completedToday > 0
                  ? (completedToday / (completedToday + orderedTasks.length)) * 100
                  : 0
                  }%`,
                background: 'linear-gradient(90deg, var(--dynamic-accent-start) 0%, var(--dynamic-accent-end) 100%)',
                boxShadow: '0 0 12px var(--dynamic-accent-glow)',
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>
          {completedToday > 0 && orderedTasks.length === 0 && (
            <p className="text-xs text-emerald-400 mt-2 text-center font-medium">
              ✨ כל המשימות הושלמו! יום מעולה!
            </p>
          )}
        </div>

        <Reorder.Group
          axis="y"
          values={visibleSections}
          onReorder={handleSectionReorder}
          className="space-y-6"
        >
          {visibleSections.map(id => (
            <SectionItem
              key={id}
              id={id}
              section={{
                ...sectionsConfig[id],
                onUpdateTask: handleUpdateTask,
                onDeleteTask: handleDeleteTask,
                onHide: handleHide,
                onSelectTask: (task: PersonalItem) => onTaskClick?.(task),
                isDraggable: true,
              }}
            />
          ))}
        </Reorder.Group>

        {orderedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--text-tertiary)]">
            <CheckCircleIcon className="w-12 h-12 mb-2 opacity-20" />
            <p>היום פנוי. הוסף משימות כדי להתחיל.</p>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onUndo={toast.onUndo}
        onDismiss={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default TasksTodayWidget;
