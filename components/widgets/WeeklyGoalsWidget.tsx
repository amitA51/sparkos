import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetIcon, PlusIcon, CheckIcon, TrashIcon } from '../icons';

// ============================================================================
// Types
// ============================================================================

interface WeeklyGoal {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface WeeklyGoalsData {
  weekKey: string;
  goals: WeeklyGoal[];
}

// ============================================================================
// Constants
// ============================================================================

const MAX_GOALS = 5;

const MOTIVATIONAL_MESSAGES = [
  'כל המטרות הושגו! שבוע מדהים!',
  'אתה מכונה! הצלחת בכל המטרות!',
  'אלוף! סיימת את השבוע בשיא!',
  'מדהים! אתה מוכיח שאפשר הכל!',
  'פשוט מושלם! המשך ככה!',
];

// ============================================================================
// Helpers
// ============================================================================

function getISOWeekKey(): string {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (now.getTime() - yearStart.getTime()) / 86400000
  );
  const weekNumber = Math.ceil((dayOfYear + yearStart.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

function getStorageKey(): string {
  return `sparkos_weekly_goals_${getISOWeekKey()}`;
}

function loadGoals(): WeeklyGoalsData {
  const key = getStorageKey();
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed: WeeklyGoalsData = JSON.parse(stored);
      if (parsed.weekKey === getISOWeekKey()) return parsed;
    }
  } catch {
    // Corrupted data -- start fresh
  }
  return { weekKey: getISOWeekKey(), goals: [] };
}

function saveGoals(data: WeeklyGoalsData): void {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(data));
  } catch {
    // Storage full -- silent fail
  }
}

function generateId(): string {
  return `g-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

// ============================================================================
// Component
// ============================================================================

const WeeklyGoalsWidget: React.FC = () => {
  const [goalsData, setGoalsData] = useState<WeeklyGoalsData>(loadGoals);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const goals = goalsData.goals;
  const completedCount = useMemo(
    () => goals.filter(g => g.isCompleted).length,
    [goals]
  );
  const totalCount = goals.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Persist on change
  useEffect(() => {
    saveGoals(goalsData);
  }, [goalsData]);

  // Celebration when all completed
  useEffect(() => {
    if (allCompleted && totalCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [allCompleted, totalCount]);

  const handleToggleGoal = useCallback((id: string) => {
    setGoalsData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
      ),
    }));
  }, []);

  const handleAddGoal = useCallback(() => {
    const trimmed = newGoalText.trim();
    if (!trimmed) return;

    setGoalsData(prev => ({
      ...prev,
      goals: [
        ...prev.goals,
        { id: generateId(), title: trimmed, isCompleted: false },
      ],
    }));
    setNewGoalText('');
    setIsAdding(false);
  }, [newGoalText]);

  const handleRemoveGoal = useCallback((id: string) => {
    setGoalsData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddGoal();
      } else if (e.key === 'Escape') {
        setIsAdding(false);
        setNewGoalText('');
      }
    },
    [handleAddGoal]
  );

  // Progress ring SVG calculations
  const ringRadius = 28;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progressPercent / 100);

  const motivationalMessage = useMemo(() => {
    if (!allCompleted) return null;
    const index = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[index];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-purple-400/10 to-transparent pointer-events-none" />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-emerald-500/30 to-teal-500/20 backdrop-blur-sm rounded-2xl"
          >
            <div className="text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className="text-5xl block mb-3"
              >
                🎯
              </motion.span>
              <p className="text-base font-bold text-white">
                {motivationalMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-5">
        {/* Header with progress ring */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--dynamic-accent-color)] border border-white/10 flex items-center justify-center">
              <TargetIcon
                className="w-5 h-5"
                style={{ color: 'var(--dynamic-accent-start)' }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                יעדים שבועיים
              </h3>
              <p className="text-xs text-theme-secondary">
                {completedCount}/{totalCount} הושלמו
              </p>
            </div>
          </div>

          {/* Progress ring */}
          {totalCount > 0 && (
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                <circle
                  cx="35"
                  cy="35"
                  r={ringRadius}
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="5"
                />
                <motion.circle
                  cx="35"
                  cy="35"
                  r={ringRadius}
                  fill="none"
                  stroke={allCompleted ? 'var(--success)' : 'var(--dynamic-accent-start, #8b5cf6)'} // CLEANED
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  animate={{ strokeDashoffset: ringOffset }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {Math.round(progressPercent)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Goals list */}
        {totalCount === 0 && !isAdding ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <span className="text-3xl block mb-3">🎯</span>
            <p className="text-sm text-theme-secondary mb-4">
              הגדר יעדים לשבוע הזה
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'var(--dynamic-accent-color, rgba(139, 92, 246, 0.15))',
                color: 'var(--dynamic-accent-start, #8b5cf6)',
                border: '1px solid var(--dynamic-accent-start, rgba(139, 92, 246, 0.3))',
              }}
            >
              <PlusIcon className="w-4 h-4" />
              הגדר יעדים
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {goals.map(goal => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                >
                  {/* Checkbox */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleToggleGoal(goal.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      goal.isCompleted
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {goal.isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        <CheckIcon className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Title */}
                  <span
                    className={`flex-1 text-sm transition-all ${
                      goal.isCompleted
                        ? 'text-theme-muted line-through'
                        : 'text-white'
                    }`}
                  >
                    {goal.title}
                  </span>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-theme-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="הסר יעד"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add new goal input */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.05] border border-white/10">
                    <input
                      type="text"
                      value={newGoalText}
                      onChange={e => setNewGoalText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="הקלד יעד..."
                      autoFocus
                      maxLength={80}
                      className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none px-2 py-1.5"
                      dir="rtl"
                    />
                    <button
                      onClick={handleAddGoal}
                      disabled={!newGoalText.trim()}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-30"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add button (when not at max) */}
            {!isAdding && totalCount < MAX_GOALS && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-medium text-theme-secondary hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-white/10 hover:border-white/20 transition-all"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                הוסף יעד
              </motion.button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-theme-muted text-center">
            שבוע {getISOWeekKey().split('-W')[1]} - מתאפס בכל יום שני
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(WeeklyGoalsWidget);
