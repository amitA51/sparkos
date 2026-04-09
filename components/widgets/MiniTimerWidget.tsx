import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, StopIcon, TimerIcon } from '../icons';
import { useFocusSession, useFocusTimer } from '../../src/contexts/FocusContext';

// ============================================================================
// Helpers
// ============================================================================

function formatTimeCompact(ms: number): { minutes: string; seconds: string } {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

// ============================================================================
// Component
// ============================================================================

const MiniTimerWidget: React.FC = () => {
  const {
    activeSession,
    mode,
    isActive,
    isPaused,
    pauseSession,
    resumeSession,
    cancelSession,
    streak,
    dailyGoal,
  } = useFocusSession();

  const { timeRemaining, progress } = useFocusTimer();

  const isRunning = mode === 'focusing';
  const isSessionActive = isActive || isPaused;

  const timeObj = useMemo(
    () => formatTimeCompact(timeRemaining),
    [timeRemaining]
  );

  // SVG circle calculations for compact ring
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleToggle = useCallback(() => {
    if (isRunning) {
      pauseSession();
    } else if (isPaused) {
      resumeSession();
    }
  }, [isRunning, isPaused, pauseSession, resumeSession]);

  const handleStop = useCallback(() => {
    cancelSession();
  }, [cancelSession]);

  // Daily progress
  const dailyProgress = useMemo(() => {
    if (dailyGoal.targetMinutes <= 0) return 0;
    return Math.min(1, dailyGoal.completedMinutes / dailyGoal.targetMinutes);
  }, [dailyGoal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="spark-card relative overflow-hidden"
    >
      {/* Gradient background -- shifts color when active */}
      <div
        className={`absolute inset-0 bg-gradient-to-br pointer-events-none transition-all duration-500 ${
          isRunning
            ? 'from-emerald-500/20 via-green-400/10 to-transparent'
            : isPaused
              ? 'from-amber-500/20 via-orange-400/10 to-transparent'
              : 'from-slate-500/12 via-gray-400/8 to-transparent'
        }`}
      />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
              isRunning
                ? 'bg-emerald-500/20 border-emerald-500/30'
                : 'bg-[var(--dynamic-accent-color)] border-white/10'
            }`}
          >
            <TimerIcon
              className="w-5 h-5"
              style={{
                color: isRunning
                  ? '#10b981'
                  : 'var(--dynamic-accent-start)',
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight">
              טיימר פוקוס
            </h3>
            <p className="text-xs text-theme-secondary">
              {isRunning
                ? 'בפוקוס'
                : isPaused
                  ? 'מושהה'
                  : `${dailyGoal.completedMinutes} דק' היום`}
            </p>
          </div>

          {/* Streak badge */}
          {streak.currentStreak > 0 && (
            <div className="mr-auto flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/15 border border-orange-500/25">
              <span className="text-xs">🔥</span>
              <span className="text-[11px] font-bold text-orange-400">
                {streak.currentStreak}
              </span>
            </div>
          )}
        </div>

        {/* Timer display */}
        <div className="flex items-center gap-5">
          {/* Compact progress ring */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 80 80"
            >
              {/* Background track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="5"
              />
              {/* Progress ring */}
              {isSessionActive && (
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={
                    isRunning
                      ? '#10b981'
                      : isPaused
                        ? '#f59e0b'
                        : 'var(--dynamic-accent-start, #6366f1)'
                  }
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.15, ease: 'linear' }}
                />
              )}
            </svg>

            {/* Time in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isSessionActive ? (
                <div className="flex items-center text-center" dir="ltr">
                  <span className="text-lg font-bold text-white tabular-nums">
                    {timeObj.minutes}
                  </span>
                  <motion.span
                    className="text-lg font-bold text-white/40 mx-0.5"
                    animate={{
                      opacity: isRunning ? [1, 0.3, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isRunning ? Infinity : 0,
                    }}
                  >
                    :
                  </motion.span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {timeObj.seconds}
                  </span>
                </div>
              ) : (
                <span className="text-2xl">⏱️</span>
              )}
            </div>
          </div>

          {/* Controls + Info */}
          <div className="flex-1 min-w-0">
            {/* Task name if active */}
            {activeSession && (
              <p className="text-sm font-medium text-white mb-2 truncate">
                {activeSession.item.title || 'משימה'}
              </p>
            )}

            {/* Controls */}
            <AnimatePresence mode="wait">
              {isSessionActive ? (
                <motion.div
                  key="active-controls"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-2"
                >
                  {/* Pause/Resume */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggle}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                      isRunning
                        ? 'bg-white/10 text-white hover:bg-white/15'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <PauseIcon className="w-4 h-4" />
                        <span>השהה</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4" />
                        <span>המשך</span>
                      </>
                    )}
                  </motion.button>

                  {/* Stop */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStop}
                    className="p-2.5 rounded-xl bg-white/5 text-theme-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="עצור"
                  >
                    <StopIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="idle-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-xs text-theme-secondary mb-2">
                    בחר משימה מהרשימה כדי להתחיל
                  </p>

                  {/* Daily progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-theme-muted">
                      <span>יעד יומי</span>
                      <span>
                        {dailyGoal.completedMinutes}/{dailyGoal.targetMinutes}{' '}
                        דק'
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(dailyProgress * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active session indicator */}
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
              בפוקוס
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(MiniTimerWidget);
