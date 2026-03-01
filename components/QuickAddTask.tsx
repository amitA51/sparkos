import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, FlameIcon, MicrophoneIcon, StopIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';
import { useData } from '../src/contexts/DataContext';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../src/contexts/SettingsContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
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
  const [itemType, setItemType] = useState<'task' | 'habit'>('task');
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
    onError: (_errorMessage) => {
      // toast.error(errorMessage);
    },
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
        className={`
          relative flex items-center p-1.5 pl-2 rounded-[28px] border transition-all duration-400
          ${isFocused
            ? 'bg-[#1C1C1E] border-[var(--dynamic-accent-start)]/20 shadow-[0_0_20px_-6px_var(--dynamic-accent-glow)]'
            : 'bg-[#1C1C1E]/60 border-white/[0.05] hover:bg-[#1C1C1E] hover:border-white/[0.08]'
          }
        `}
        layout
      >
        {/* Type Switcher - Segmented Control Style */}
        <div className="flex bg-white/5 rounded-[20px] p-1 mr-1">
          <button
            onClick={() => { setItemType('task'); triggerHaptic('light'); }}
            className={`p-2.5 rounded-[16px] transition-all duration-300 ${itemType === 'task'
              ? 'bg-white/10 text-accent-cyan shadow-sm'
              : 'text-white/20 hover:text-white/40'
              }`}
          >
            <CheckCircleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setItemType('habit'); triggerHaptic('light'); }}
            className={`p-2.5 rounded-[16px] transition-all duration-300 ${itemType === 'habit'
              ? 'bg-white/10 text-orange-400 shadow-sm'
              : 'text-white/20 hover:text-white/40'
              }`}
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
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
          placeholder={itemType === 'task' ? 'משימה חדשה...' : 'הרגל חדש...'}
          className="flex-1 bg-transparent text-white placeholder:text-white/20 px-3 py-3 text-[17px] leading-relaxed focus:outline-none font-medium"
        />

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {itemType === 'task' && (
            <button
              onClick={() => { setShowDayPicker(!showDayPicker); triggerHaptic('light'); }}
              className={`
                h-10 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all
                ${selectedDay === 0
                  ? 'bg-transparent text-white/30 hover:bg-white/5 hover:text-white/60'
                  : 'bg-accent-cyan/10 text-accent-cyan'
                }
              `}
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
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--dynamic-accent-start)] to-[var(--dynamic-accent-end)] text-white flex items-center justify-center shadow-[0_0_15px_-3px_var(--dynamic-accent-glow)] disabled:opacity-50 transition-shadow duration-300"
            >
              {isSaving ? <LoadingSpinner className="w-4 h-4 text-white" /> : <span className="text-xl leading-none mb-0.5">↑</span>}
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleVoiceInput}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isListening ? 'bg-red-500/90 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse' : 'text-white/30 hover:bg-white/[0.05] hover:text-white/60'}
              `}
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
                  className={`
                    flex-shrink-0 flex flex-col items-center justify-center w-[52px] h-[60px] rounded-2xl border transition-all duration-300
                    ${selectedDay === day.index
                      ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-[var(--dynamic-accent-start)]/25 shadow-[0_0_12px_-4px_var(--dynamic-accent-glow)]'
                      : 'bg-white/[0.03] border-white/[0.05] text-white/40 hover:bg-white/[0.06] hover:border-white/[0.1]'
                    }
                  `}
                >
                  <span className={`text-[10px] font-bold uppercase mb-0.5 ${selectedDay === day.index ? 'text-[var(--dynamic-accent-start)]' : ''}`}>
                    {day.label}
                  </span>
                  <span className={`text-xl font-display font-bold ${selectedDay === day.index ? 'text-white' : ''}`}>
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
