// CLEANED - CSS vars fixed
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, FlameIcon, MicrophoneIcon, StopIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { useData } from '../src/contexts/DataContext';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../src/contexts/SettingsContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSmartDefaults } from '../hooks/useSmartDefaults';
import { toDateKey } from '../utils/dateUtils';

interface QuickAddProps {
  onItemAdded: (message: string) => void;
  /** Optional default date for the task - when set, pre-selects that day */
  defaultDate?: Date;
}

const QuickAddTask: React.FC<QuickAddProps> = ({ onItemAdded, defaultDate }) => {
  const { addPersonalItem } = useData();
  const { triggerHaptic } = useHaptics();
  const { settings } = useSettings();
  const { getDefault, saveDefault } = useSmartDefaults({ formKey: 'quick-add' });
  const [title, setTitle] = useState('');

  // Calculate day offset from today for the defaultDate
  const getDefaultDayOffset = useCallback((date?: Date) => {
    if (!date) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    // Clamp to 0-6 range (this week)
    return Math.max(0, Math.min(6, diffDays));
  }, []);

  const [selectedDay, setSelectedDay] = useState<number>(() => getDefaultDayOffset(defaultDate));
  const [itemType, setItemType] = useState<'task' | 'habit'>(() => {
    const saved = getDefault('quickAddType', 'task');
    return saved === 'habit' ? 'habit' : 'task';
  });
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Track save in progress to prevent double-submit

  // Update selectedDay when defaultDate changes
  useEffect(() => {
    setSelectedDay(getDefaultDayOffset(defaultDate));
  }, [defaultDate, getDefaultDayOffset]);


  const {
    isListening,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: 'he-IL',
    continuous: false,
    interimResults: true,
    onTranscript: (transcript) => {
      setTitle(prev => {
        // Simple logic to append valid transcript
        const clean = transcript.trim();
        if (!clean) return prev;
        return clean;
      });
      triggerHaptic('light');
    },
    onError: () => {},
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      index: i,
      date: date,
      label: i === 0 ? 'היום' : i === 1 ? 'מחר' : ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'][date.getDay()],
      dayNum: date.getDate(),
    };
  });

  const getDateString = (daysFromToday: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return toDateKey(date);
  };

  const handleAdd = async () => {
    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    triggerHaptic('medium');

    // 🎯 OPTIMISTIC: Capture values and clear input immediately
    const taskTitle = title.trim();
    const taskDay = selectedDay;
    const taskType = itemType;

    // Clear input immediately for next entry
    setTitle('');
    setSelectedDay(0);
    setIsFocused(false);

    // Show success message immediately (optimistic feedback)
    const dayLabel = taskDay === 0 ? 'להיום' : taskDay === 1 ? 'למחר' : `ל${weekDays[taskDay]?.label}`;
    onItemAdded(taskType === 'task' ? `משימה נוספה ${dayLabel}` : 'הרגל חדש נוסף');

    try {
      if (taskType === 'task') {
        await addPersonalItem({
          type: 'task',
          title: taskTitle,
          dueDate: getDateString(taskDay),
          dueTime: settings.taskSettings?.defaultDueTime || undefined,
          content: '',
          isCompleted: false,
          priority: settings.taskSettings?.defaultPriority || 'medium',
        });
      } else {
        await addPersonalItem({
          type: 'habit',
          title: taskTitle,
          content: '',
          frequency: 'daily',
        });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      // 🔄 ROLLBACK: Restore input on failure
      setTitle(taskTitle);
      setSelectedDay(taskDay);
      onItemAdded('שגיאה בהוספה - נסה שוב');
    } finally {
      setIsSaving(false);
    }
  };


  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
      triggerHaptic('light');
    } else {
      startListening();
      triggerHaptic('medium');
    }
  }, [isListening, startListening, stopListening, triggerHaptic]);

  return (
    <div className={`relative transition-all duration-500 ease-spring ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>

      {/* Main Input Capsule */}
      <motion.div
        className="relative flex items-center p-1.5 pl-2 rounded-[28px] border transition-all duration-400"
        style={{
          background: isFocused ? 'var(--bg-card)' : 'var(--surface-hover, var(--bg-card))',
          borderColor: isFocused ? 'var(--dynamic-accent-start, var(--border-strong))' : 'var(--border-subtle)',
          boxShadow: isFocused ? '0 0 20px -6px var(--dynamic-accent-glow, rgba(0,122,255,0.2))' : 'var(--shadow-sm)',
        }}
        layout
      >
        {/* Type Switcher - Segmented Control Style */}
        <div className="flex rounded-[20px] p-1 mr-1" style={{ background: 'var(--gray-100)' }}>
          <button
            onClick={() => { setItemType('task'); saveDefault('quickAddType', 'task'); triggerHaptic('light'); }}
            className="p-2.5 rounded-[16px] transition-all duration-300"
            style={{
              background: itemType === 'task' ? 'var(--gray-200)' : 'transparent',
              color: itemType === 'task' ? 'var(--dynamic-accent-start, var(--accent))' : 'var(--text-muted)',
            }}
          >
            <CheckCircleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setItemType('habit'); saveDefault('quickAddType', 'habit'); triggerHaptic('light'); }}
            className="p-2.5 rounded-[16px] transition-all duration-300"
            style={{
              background: itemType === 'habit' ? 'var(--gray-200)' : 'transparent',
              color: itemType === 'habit' ? 'var(--warning)' : 'var(--text-muted)',
            }}
          >
            <FlameIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => !title && setIsFocused(false), 200)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
            if (e.key === 'Escape') { setTitle(''); setIsFocused(false); (e.target as HTMLInputElement).blur(); }
          }}
          placeholder={itemType === 'task' ? 'משימה חדשה...' : 'הרגל חדש...'}
          className="flex-1 bg-transparent px-3 py-3 text-[17px] leading-relaxed focus:outline-none font-medium"
          style={{ color: 'var(--text-primary)', }}
        />

        {/* Keyboard Hint - shown when input has text */}
        <AnimatePresence>
          {title.trim() && isFocused && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              <kbd className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: 'var(--gray-100)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>Enter</kbd>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {itemType === 'task' && (
            <button
              onClick={() => { setShowDayPicker(!showDayPicker); triggerHaptic('light'); }}
              className="h-10 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all"
              style={{
                background: selectedDay === 0 ? 'transparent' : 'var(--color-accent-surface-cyan, rgba(0,122,255,0.08))',
                    color: selectedDay === 0 ? 'var(--text-muted)' : 'var(--dynamic-accent-start, var(--accent))',
              }}
            >
              {selectedDay === 0 ? 'היום' : weekDays[selectedDay]?.label}
            </button>
          )}

          {title.trim() ? (
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              disabled={isSaving}
              className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-shadow duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--dynamic-accent-start, var(--accent)), var(--dynamic-accent-end, var(--subscore-purple)))',
                color: 'var(--white)',
                boxShadow: '0 0 15px -3px var(--dynamic-accent-glow, rgba(0,122,255,0.3))',
              }}
            >
              {isSaving ? <LoadingSpinner className="w-4 h-4 text-white" /> : <span className="text-xl leading-none mb-0.5">↑</span>}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceInput}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{
                background: isListening ? 'var(--error)' : 'transparent',
                color: isListening ? 'var(--white)' : 'var(--text-muted)',
                boxShadow: isListening ? '0 0 12px rgba(239,68,68,0.4)' : 'none',
              }}
            >
              {isListening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Date Picker Expansion */}
      <AnimatePresence>
        {showDayPicker && itemType === 'task' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
              {weekDays.map((day) => (
                <button
                  key={day.index}
                  onClick={() => {
                    setSelectedDay(day.index);
                    setShowDayPicker(false);
                    triggerHaptic('light');
                  }}
                  className="flex-shrink-0 flex flex-col items-center justify-center w-[52px] h-[60px] rounded-2xl border transition-all duration-300"
                  style={{
                    background: selectedDay === day.index ? 'var(--color-accent-surface-cyan, rgba(0,122,255,0.08))' : 'var(--gray-50)',
                    borderColor: selectedDay === day.index ? 'var(--dynamic-accent-start, var(--accent))' : 'var(--border-subtle)',
                    boxShadow: selectedDay === day.index ? '0 0 12px -4px var(--dynamic-accent-glow, rgba(0,122,255,0.2))' : 'none',
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase mb-0.5"
                    style={{ color: selectedDay === day.index ? 'var(--dynamic-accent-start, #007AFF)' : 'var(--text-muted)' }}
                  >
                    {day.label}
                  </span>
                  <span
                    className="text-xl font-display font-bold"
                    style={{ color: selectedDay === day.index ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {day.dayNum}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAddTask;
