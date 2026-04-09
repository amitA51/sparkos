/**
 * DailyReviewModal - Multi-step Daily Review Wizard
 *
 * A beautiful, immersive evening review flow that helps users
 * reflect on their day through 6 sequential steps.
 * Uses framer-motion for step transitions, CSS variables for theming.
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../src/contexts/DataContext';
import { useUser } from '../../src/contexts/UserContext';
import {
  CheckCircleIcon,
  FlameIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  ShareIcon,
  TrophyIcon,
  TargetIcon,
  AddIcon,
} from '../icons';
import {
  saveDailyReview,
  calculateProductivityScore,
  MOOD_OPTIONS,
  type DailyReviewData,
  type DailyReviewStats,
  type DailyReviewMood,
} from '../../services/dailyReviewService';
import { ai } from '../../services/ai/geminiClient';
import { loadSettings } from '../../services/settingsService';
import { withRateLimit } from '../../services/ai/rateLimiter';
import LoadingSpinner from '../LoadingSpinner';

// ============================================================================
// Types
// ============================================================================

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

// ============================================================================
// Slide animation variants
// ============================================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// Sub-components
// ============================================================================

/** Stat card for Step 1 */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}> = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
    className="relative overflow-hidden rounded-2xl p-4"
    style={{
      background: `color-mix(in srgb, ${color} 8%, var(--bg-card))`,
      border: `1px solid color-mix(in srgb, ${color} 15%, transparent)`,
    }}
  >
    {/* Decorative gradient orb */}
    <div
      className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-xl"
      style={{ background: color }}
    />
    <div className="relative flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color: color,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </div>
        <div
          className="text-xs font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </div>
      </div>
    </div>
  </motion.div>
);

/** Mood selector button for Step 2 */
const MoodButton: React.FC<{
  mood: DailyReviewMood;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}> = ({ mood, isSelected, onSelect, delay }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 400, damping: 15 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onSelect}
    className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200"
    style={{
      background: isSelected
        ? 'color-mix(in srgb, var(--dynamic-accent-start) 15%, var(--bg-card))'
        : 'var(--gray-50)',
      border: isSelected
        ? '2px solid var(--dynamic-accent-start)'
        : '2px solid transparent',
      boxShadow: isSelected
        ? '0 0 20px color-mix(in srgb, var(--dynamic-accent-start) 20%, transparent)'
        : 'none',
    }}
  >
    <motion.span
      className="text-4xl"
      animate={isSelected ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {mood.emoji}
    </motion.span>
    <span
      className="text-xs font-medium"
      style={{
        color: isSelected ? 'var(--dynamic-accent-start)' : 'var(--text-secondary)',
      }}
    >
      {mood.label}
    </span>
  </motion.button>
);

/** Progress dots showing the current step */
const StepIndicator: React.FC<{ currentStep: Step; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: totalSteps }, (_, i) => {
      const step = (i + 1) as Step;
      const isActive = step === currentStep;
      const isCompleted = step < currentStep;
      return (
        <motion.div
          key={step}
          className="rounded-full"
          animate={{
            width: isActive ? 24 : 8,
            height: 8,
            backgroundColor: isActive || isCompleted
              ? 'var(--dynamic-accent-start)'
              : 'var(--gray-200)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      );
    })}
  </div>
);

// ============================================================================
// Confetti burst (lightweight canvas-free implementation)
// ============================================================================

const ConfettiBurst: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
        color: [
          'var(--success)',
          'var(--warning)',
          'var(--dynamic-accent-start)',
          'var(--ios-purple)',
          'var(--ios-pink)',
          '#FFD700',
        ][Math.floor(Math.random() * 6)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 100 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            rotate: `${p.rotation}deg`,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 50,
            x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100],
            rotate: [p.rotation, p.rotation + 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ isOpen, onClose }) => {
  const { personalItems, addPersonalItem } = useData();
  const { user } = useUser();

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(0);
  const [selectedMood, setSelectedMood] = useState<DailyReviewMood | null>(null);
  const [moodInfluence, setMoodInfluence] = useState('');
  const [wins, setWins] = useState<string[]>(['', '', '']);
  const [tomorrowTask, setTomorrowTask] = useState('');
  const [tomorrowTasks, setTomorrowTasks] = useState<string[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDirection(0);
      setSelectedMood(null);
      setMoodInfluence('');
      setWins(['', '', '']);
      setTomorrowTask('');
      setTomorrowTasks([]);
      setAiInsight(null);
      setIsLoadingAi(false);
      setShowConfetti(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Calculate today's stats
  const todayStats: DailyReviewStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayISO = new Date().toISOString().split('T')[0] ?? '';

    const allTasks = personalItems.filter(item => item.type === 'task');
    const todayTasks = allTasks.filter(item => {
      if (!item.dueDate) return false;
      return item.dueDate === todayISO;
    });
    const completedTasks = personalItems.filter(
      item =>
        item.type === 'task' &&
        item.isCompleted &&
        item.updatedAt &&
        new Date(item.updatedAt).toDateString() === today
    );

    const allHabits = personalItems.filter(item => item.type === 'habit');
    const completedHabits = allHabits.filter(item => {
      if (!item.completedDates) return false;
      return item.completedDates.includes(todayISO);
    });

    // Focus sessions from today
    const focusMinutes = personalItems.reduce((total, item) => {
      if (!item.focusSessions) return total;
      const todaySessions = item.focusSessions.filter(
        s => new Date(s.date).toDateString() === today
      );
      return total + todaySessions.reduce((sum, s) => sum + s.duration, 0);
    }, 0);

    // Articles read today
    const articlesRead = personalItems.filter(
      item =>
        item.type === 'link' &&
        item.updatedAt &&
        new Date(item.updatedAt).toDateString() === today
    ).length;

    const activeStreaks = allHabits.filter(h => (h.streak ?? 0) > 0).length;

    return {
      tasksCompleted: completedTasks.length,
      totalTasks: Math.max(todayTasks.length, completedTasks.length),
      habitsCompleted: completedHabits.length,
      totalHabits: allHabits.length,
      focusMinutes,
      articlesRead,
      streaksActive: activeStreaks,
    };
  }, [personalItems]);

  // Completed tasks list for display
  const completedTasksList = useMemo(() => {
    const today = new Date().toDateString();
    return personalItems
      .filter(
        item =>
          item.type === 'task' &&
          item.isCompleted &&
          item.updatedAt &&
          new Date(item.updatedAt).toDateString() === today
      )
      .slice(0, 5);
  }, [personalItems]);

  // Habit details for display
  const habitDetails = useMemo(() => {
    const todayISO = new Date().toISOString().split('T')[0] ?? '';
    return personalItems
      .filter(item => item.type === 'habit')
      .map(h => ({
        title: h.title ?? '',
        streak: h.streak ?? 0,
        completedToday: h.completedDates?.includes(todayISO) ?? false,
      }))
      .slice(0, 6);
  }, [personalItems]);

  // Existing tomorrow tasks
  const existingTomorrowTasks = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0] ?? '';
    return personalItems.filter(
      item => item.type === 'task' && !item.isCompleted && item.dueDate === tomorrowISO
    );
  }, [personalItems]);

  const productivityScore = useMemo(() => calculateProductivityScore(todayStats), [todayStats]);

  // Navigation
  const goNext = useCallback(() => {
    setDirection(1);
    setStep(prev => Math.min(prev + 1, 6) as Step);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1) as Step);
  }, []);

  // Handle win input changes
  const handleWinChange = useCallback((index: number, value: string) => {
    setWins(prev => {
      const newWins = [...prev];
      newWins[index] = value;
      return newWins;
    });
  }, []);

  // Add tomorrow task
  const handleAddTomorrowTask = useCallback(async () => {
    const trimmed = tomorrowTask.trim();
    if (!trimmed) return;

    setTomorrowTasks(prev => [...prev, trimmed]);
    setTomorrowTask('');

    // Actually create the task
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await addPersonalItem({
        type: 'task',
        title: trimmed,
        dueDate: tomorrow.toISOString().split('T')[0],
        isCompleted: false,
      } as any);
    } catch (error) {
      console.error('Failed to create tomorrow task:', error);
    }
  }, [tomorrowTask, addPersonalItem]);

  // Generate AI insight
  const generateAiInsight = useCallback(async () => {
    if (!ai) {
      setAiInsight('AI is not configured. Add your API key to enable insights.');
      return;
    }

    setIsLoadingAi(true);
    try {
      const appSettings = loadSettings();
      const moodText = selectedMood?.label ?? 'unknown';
      const winsText = wins.filter(w => w.trim()).join(', ');

      const prompt = `You are a mindful personal productivity coach. Generate a short, warm, and insightful evening reflection in Hebrew (2-3 sentences max).

Context about the user's day:
- Mood: ${moodText} (${selectedMood?.emoji ?? ''})
- Tasks completed: ${todayStats.tasksCompleted} out of ${todayStats.totalTasks}
- Habits maintained: ${todayStats.habitsCompleted} out of ${todayStats.totalHabits}
- Focus time: ${todayStats.focusMinutes} minutes
- Things that went well: ${winsText || 'not specified'}
- Productivity score: ${productivityScore}/100

Write a brief personalized insight that:
1. Acknowledges their effort today
2. Offers one actionable suggestion for tomorrow
3. Ends on an encouraging note

Keep it concise, warm, and genuine. Write ONLY in Hebrew.`;

      const insight = await withRateLimit(async () => {
        const response = await ai!.models.generateContent({
          model: appSettings.aiModel,
          contents: prompt,
        });
        return response.text ?? '';
      });

      setAiInsight(insight);
    } catch (error) {
      console.error('Failed to generate AI insight:', error);
      setAiInsight('לא הצלחנו ליצור תובנה כרגע. נסה שוב מאוחר יותר.');
    } finally {
      setIsLoadingAi(false);
    }
  }, [selectedMood, wins, todayStats, productivityScore]);

  // Auto-generate AI insight when entering step 5
  useEffect(() => {
    if (step === 5 && !aiInsight && !isLoadingAi) {
      generateAiInsight();
    }
  }, [step, aiInsight, isLoadingAi, generateAiInsight]);

  // Save and finish
  const handleFinish = useCallback(async () => {
    if (!user) return;
    setIsSaving(true);

    const todayId = new Date().toISOString().split('T')[0] ?? '';
    const review: DailyReviewData = {
      id: todayId,
      date: new Date().toISOString(),
      mood: selectedMood ?? MOOD_OPTIONS[2]!,
      stats: todayStats,
      wins: wins.filter(w => w.trim()),
      tomorrowTasks,
      tomorrowPriorities: [],
      aiInsight: aiInsight ?? undefined,
      productivityScore,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveDailyReview(user.uid, review);
    } catch (error) {
      console.error('Failed to save review:', error);
    }

    setShowConfetti(true);
    setIsSaving(false);

    // Close after confetti
    setTimeout(() => {
      onClose();
      setShowConfetti(false);
    }, 3000);
  }, [user, selectedMood, todayStats, wins, tomorrowTasks, aiInsight, productivityScore, onClose]);

  // Web Share API
  const handleShare = useCallback(async () => {
    const dateStr = new Date().toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const text = `${selectedMood?.emoji ?? ''} ${dateStr}
Score: ${productivityScore}/100
Tasks: ${todayStats.tasksCompleted}/${todayStats.totalTasks}
Focus: ${todayStats.focusMinutes} min
${wins.filter(w => w.trim()).length > 0 ? `Win: ${wins.find(w => w.trim()) ?? ''}` : ''}

SparkOS Daily Review`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'SparkOS Daily Review', text });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback - ignore
      }
    }
  }, [selectedMood, productivityScore, todayStats, wins]);

  if (!isOpen) return null;

  // Get the score color
  const scoreColor =
    productivityScore >= 80
      ? 'var(--success)'
      : productivityScore >= 50
        ? 'var(--warning)'
        : 'var(--error)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            zIndex: 'var(--z-modal)',
            perspective: 1200,
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgba(var(--bg-app-rgb), 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl flex flex-col"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-2xl)',
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'color-mix(in srgb, var(--dynamic-accent-start) 12%, transparent)',
                  }}
                >
                  <MoonStarIcon className="w-5 h-5" style={{ color: 'var(--dynamic-accent-start)' }} />
                </div>
                <div>
                  <h2
                    className="text-base font-bold leading-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {step === 1 && 'הסיכום היומי שלך'}
                    {step === 2 && 'איך היה היום?'}
                    {step === 3 && 'מה הלך טוב היום?'}
                    {step === 4 && 'מה חשוב למחר?'}
                    {step === 5 && 'תובנה אישית'}
                    {step === 6 && 'סיכום היום'}
                  </h2>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date().toLocaleDateString('he-IL', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: 'var(--gray-100)',
                  color: 'var(--text-secondary)',
                }}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="py-3 shrink-0">
              <StepIndicator currentStep={step} totalSteps={6} />
            </div>

            {/* Step content */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 min-h-0">
              <AnimatePresence mode="wait" custom={direction}>
                {/* ========== STEP 1: Day Summary ========== */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <StatCard
                        icon={<CheckCircleIcon className="w-5 h-5" />}
                        label="משימות הושלמו"
                        value={`${todayStats.tasksCompleted}/${todayStats.totalTasks}`}
                        color="var(--success)"
                        delay={0.1}
                      />
                      <StatCard
                        icon={<FlameIcon className="w-5 h-5" />}
                        label="הרגלים"
                        value={`${todayStats.habitsCompleted}/${todayStats.totalHabits}`}
                        color="var(--warning)"
                        delay={0.15}
                      />
                      <StatCard
                        icon={<ClockIcon className="w-5 h-5" />}
                        label="דקות פוקוס"
                        value={todayStats.focusMinutes}
                        color="var(--dynamic-accent-start)"
                        delay={0.2}
                      />
                      <StatCard
                        icon={<BookOpenIcon className="w-5 h-5" />}
                        label="מאמרים"
                        value={todayStats.articlesRead}
                        color="var(--ios-purple)"
                        delay={0.25}
                      />
                    </div>

                    {/* Productivity score ring */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="flex flex-col items-center py-4"
                    >
                      <div className="relative w-28 h-28">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke="var(--gray-100)"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50" cy="50" r="42"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{
                              strokeDashoffset: 2 * Math.PI * 42 * (1 - productivityScore / 100),
                            }}
                            transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            className="text-3xl font-bold"
                            style={{ color: scoreColor }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            {productivityScore}
                          </motion.span>
                          <span
                            className="text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            ציון יום
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Completed tasks list */}
                    {completedTasksList.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-2"
                      >
                        <h3
                          className="text-sm font-semibold mb-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          משימות שהושלמו
                        </h3>
                        <div className="space-y-1.5">
                          {completedTasksList.map((task, i) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.05 }}
                              className="flex items-center gap-2 py-1.5 px-3 rounded-lg"
                              style={{ background: 'var(--gray-50)' }}
                            >
                              <CheckCircleIcon
                                className="w-4 h-4 shrink-0"
                                style={{ color: 'var(--success)' }}
                              />
                              <span
                                className="text-sm line-clamp-1"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {task.title}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ========== STEP 2: Mood Check ========== */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col items-center py-4"
                  >
                    <motion.p
                      className="text-center mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      בחר את מצב הרוח שלך היום
                    </motion.p>

                    <div className="flex items-center justify-center gap-3 mb-8">
                      {MOOD_OPTIONS.map((mood, i) => (
                        <MoodButton
                          key={mood.value}
                          mood={mood}
                          isSelected={selectedMood?.value === mood.value}
                          onSelect={() => setSelectedMood(mood)}
                          delay={0.1 + i * 0.06}
                        />
                      ))}
                    </div>

                    {/* Selected mood highlight */}
                    <AnimatePresence>
                      {selectedMood && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="w-full"
                        >
                          <p
                            className="text-sm mb-2"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            מה השפיע על מצב הרוח? (אופציונלי)
                          </p>
                          <textarea
                            value={moodInfluence}
                            onChange={e => setMoodInfluence(e.target.value)}
                            placeholder="למשל: ישיבת צוות מוצלחת, עומס עבודה..."
                            className="w-full rounded-xl p-3 text-sm resize-none"
                            style={{
                              background: 'var(--gray-50)',
                              border: '1.5px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                              minHeight: '80px',
                            }}
                            onFocus={e => {
                              e.target.style.borderColor = 'var(--dynamic-accent-start)';
                              e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--dynamic-accent-start) 15%, transparent)';
                            }}
                            onBlur={e => {
                              e.target.style.borderColor = 'var(--border-subtle)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ========== STEP 3: Wins & Gratitude ========== */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="py-4"
                  >
                    <motion.p
                      className="text-center mb-6"
                      style={{ color: 'var(--text-secondary)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ציין 3 דברים טובים שקרו היום
                    </motion.p>

                    <div className="space-y-3">
                      {wins.map((win, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="relative"
                        >
                          <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: win.trim()
                                ? 'color-mix(in srgb, var(--success) 15%, transparent)'
                                : 'var(--gray-100)',
                              color: win.trim()
                                ? 'var(--success)'
                                : 'var(--text-muted)',
                            }}
                          >
                            {win.trim() ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          <input
                            type="text"
                            value={win}
                            onChange={e => handleWinChange(i, e.target.value)}
                            placeholder={
                              i === 0
                                ? 'סיימתי פרויקט חשוב'
                                : i === 1
                                  ? 'עזרתי לחבר'
                                  : 'למדתי משהו חדש'
                            }
                            className="w-full rounded-xl py-3 pr-11 pl-4 text-sm transition-all duration-200"
                            style={{
                              background: 'var(--gray-50)',
                              border: '1.5px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              outline: 'none',
                            }}
                            onFocus={e => {
                              e.target.style.borderColor = 'var(--dynamic-accent-start)';
                              e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--dynamic-accent-start) 15%, transparent)';
                            }}
                            onBlur={e => {
                              e.target.style.borderColor = 'var(--border-subtle)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-center text-xs mt-4"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      ניתן לדלג אם אין מה לכתוב
                    </motion.p>
                  </motion.div>
                )}

                {/* ========== STEP 4: Tomorrow Planning ========== */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="py-4"
                  >
                    <motion.p
                      className="text-center mb-5"
                      style={{ color: 'var(--text-secondary)' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      הוסף משימות חשובות למחר
                    </motion.p>

                    {/* Quick add input */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-2 mb-4"
                    >
                      <input
                        type="text"
                        value={tomorrowTask}
                        onChange={e => setTomorrowTask(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddTomorrowTask();
                        }}
                        placeholder="הוסף משימה למחר..."
                        className="flex-1 rounded-xl py-3 px-4 text-sm transition-all duration-200"
                        style={{
                          background: 'var(--gray-50)',
                          border: '1.5px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = 'var(--dynamic-accent-start)';
                          e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--dynamic-accent-start) 15%, transparent)';
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = 'var(--border-subtle)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddTomorrowTask}
                        disabled={!tomorrowTask.trim()}
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: tomorrowTask.trim()
                            ? 'var(--dynamic-accent-start)'
                            : 'var(--gray-100)',
                          color: tomorrowTask.trim()
                            ? 'var(--text-on-accent)'
                            : 'var(--text-muted)',
                        }}
                      >
                        <AddIcon className="w-5 h-5" />
                      </motion.button>
                    </motion.div>

                    {/* Added tasks */}
                    <AnimatePresence>
                      {tomorrowTasks.map((task, i) => (
                        <motion.div
                          key={`new-${i}`}
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-2"
                        >
                          <div
                            className="flex items-center gap-2 py-2.5 px-3 rounded-lg"
                            style={{
                              background: 'color-mix(in srgb, var(--success) 6%, var(--bg-card))',
                              border: '1px solid color-mix(in srgb, var(--success) 12%, transparent)',
                            }}
                          >
                            <TargetIcon
                              className="w-4 h-4 shrink-0"
                              style={{ color: 'var(--success)' }}
                            />
                            <span
                              className="text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {task}
                            </span>
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full mr-auto"
                              style={{
                                background: 'color-mix(in srgb, var(--success) 12%, transparent)',
                                color: 'var(--success)',
                              }}
                            >
                              חדש
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Existing tomorrow tasks */}
                    {existingTomorrowTasks.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <h3
                          className="text-sm font-semibold mb-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          משימות קיימות למחר
                        </h3>
                        <div className="space-y-1.5">
                          {existingTomorrowTasks.map(task => (
                            <div
                              key={task.id}
                              className="flex items-center gap-2 py-2 px-3 rounded-lg"
                              style={{ background: 'var(--gray-50)' }}
                            >
                              <TargetIcon
                                className="w-3.5 h-3.5 shrink-0"
                                style={{ color: 'var(--text-muted)' }}
                              />
                              <span
                                className="text-sm line-clamp-1"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {task.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ========== STEP 5: AI Insight ========== */}
                {step === 5 && (
                  <motion.div
                    key="step-5"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="py-4 flex flex-col items-center"
                  >
                    {isLoadingAi ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 py-12"
                      >
                        <LoadingSpinner size="lg" />
                        <p
                          className="text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          מייצר תובנה אישית...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full"
                      >
                        {/* AI Quote Card */}
                        <div
                          className="relative overflow-hidden rounded-2xl p-6"
                          style={{
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--dynamic-accent-start) 8%, var(--bg-card)), color-mix(in srgb, var(--dynamic-accent-end) 8%, var(--bg-card)))',
                            border: '1px solid color-mix(in srgb, var(--dynamic-accent-start) 12%, transparent)',
                          }}
                        >
                          {/* Decorative gradient orbs */}
                          <div
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 blur-2xl"
                            style={{ background: 'var(--dynamic-accent-start)' }}
                          />
                          <div
                            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10 blur-2xl"
                            style={{ background: 'var(--dynamic-accent-end)' }}
                          />

                          <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                              <SparklesIcon
                                className="w-5 h-5"
                                style={{ color: 'var(--dynamic-accent-start)' }}
                              />
                              <span
                                className="text-sm font-semibold"
                                style={{ color: 'var(--dynamic-accent-start)' }}
                              >
                                תובנה אישית
                              </span>
                            </div>

                            <p
                              className="text-base leading-relaxed whitespace-pre-line"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {aiInsight}
                            </p>

                            <div className="flex items-center gap-1.5 mt-5">
                              <span
                                className="text-[10px] px-2 py-1 rounded-full font-medium"
                                style={{
                                  background: 'color-mix(in srgb, var(--dynamic-accent-start) 10%, transparent)',
                                  color: 'var(--dynamic-accent-start)',
                                }}
                              >
                                Powered by AI
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Regenerate button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setAiInsight(null);
                            generateAiInsight();
                          }}
                          className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                          style={{
                            background: 'var(--gray-50)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          ייצר תובנה חדשה
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ========== STEP 6: Summary Card ========== */}
                {step === 6 && (
                  <motion.div
                    key="step-6"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="py-4 flex flex-col items-center"
                  >
                    {/* Summary card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring' }}
                      className="w-full rounded-2xl overflow-hidden"
                      style={{
                        background: 'linear-gradient(160deg, color-mix(in srgb, var(--dynamic-accent-start) 10%, var(--bg-card)), color-mix(in srgb, var(--dynamic-accent-end) 6%, var(--bg-card)))',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      {/* Card header with date */}
                      <div
                        className="px-5 py-4"
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className="text-xs font-medium uppercase tracking-wider"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              SparkOS Daily Review
                            </div>
                            <div
                              className="text-base font-bold mt-0.5"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {new Date().toLocaleDateString('he-IL', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <motion.span
                            className="text-5xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                          >
                            {selectedMood?.emoji ?? MOOD_OPTIONS[2]?.emoji}
                          </motion.span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="px-5 py-4 grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: scoreColor }}
                          >
                            {productivityScore}
                          </div>
                          <div
                            className="text-[10px] font-medium"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            ציון יום
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: 'var(--success)' }}
                          >
                            {todayStats.tasksCompleted}
                          </div>
                          <div
                            className="text-[10px] font-medium"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            משימות
                          </div>
                        </div>
                        <div>
                          <div
                            className="text-2xl font-bold"
                            style={{ color: 'var(--dynamic-accent-start)' }}
                          >
                            {todayStats.focusMinutes}
                          </div>
                          <div
                            className="text-[10px] font-medium"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            דקות פוקוס
                          </div>
                        </div>
                      </div>

                      {/* Habit highlights */}
                      {habitDetails.length > 0 && (
                        <div
                          className="px-5 py-3"
                          style={{ borderTop: '1px solid var(--border-subtle)' }}
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {habitDetails.slice(0, 4).map((h, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-1 rounded-full"
                                style={{
                                  background: h.completedToday
                                    ? 'color-mix(in srgb, var(--success) 10%, transparent)'
                                    : 'var(--gray-50)',
                                  color: h.completedToday
                                    ? 'var(--success)'
                                    : 'var(--text-muted)',
                                }}
                              >
                                {h.completedToday ? '\u2713 ' : ''}{h.title}
                                {h.streak > 0 && ` (${h.streak})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Gratitude snippet */}
                      {wins.filter(w => w.trim()).length > 0 && (
                        <div
                          className="px-5 py-3"
                          style={{ borderTop: '1px solid var(--border-subtle)' }}
                        >
                          <div className="flex items-start gap-2">
                            <TrophyIcon
                              className="w-4 h-4 mt-0.5 shrink-0"
                              style={{ color: 'var(--warning)' }}
                            />
                            <p
                              className="text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {wins.find(w => w.trim())}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-6 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        style={{
                          background: 'var(--gray-50)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <ShareIcon className="w-4 h-4" />
                        שתף
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFinish}
                        disabled={isSaving}
                        className="flex-[2] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                          color: 'var(--text-on-accent)',
                          boxShadow: '0 4px 15px var(--dynamic-accent-glow)',
                        }}
                      >
                        {isSaving ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <StarIcon className="w-4 h-4" />
                            סיימתי!
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation footer */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goPrev}
                disabled={step === 1}
                className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  opacity: step === 1 ? 0.3 : 1,
                  color: 'var(--text-secondary)',
                  background: step === 1 ? 'transparent' : 'var(--gray-50)',
                }}
              >
                <ChevronRightIcon className="w-4 h-4" />
                הקודם
              </motion.button>

              {step < 6 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  disabled={step === 2 && !selectedMood}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background:
                      step === 2 && !selectedMood
                        ? 'var(--gray-100)'
                        : 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                    color:
                      step === 2 && !selectedMood
                        ? 'var(--text-muted)'
                        : 'var(--text-on-accent)',
                    boxShadow:
                      step === 2 && !selectedMood
                        ? 'none'
                        : '0 2px 10px var(--dynamic-accent-glow)',
                  }}
                >
                  הבא
                  <ChevronLeftIcon className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Confetti */}
          {showConfetti && <ConfettiBurst />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Inline Icon: MoonStar (not in the existing icon set)
// ============================================================================

const MoonStarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M19 3v4" />
    <path d="M21 5h-4" />
  </svg>
);

export default React.memo(DailyReviewModal);
