// RestTimerOverlay - Premium Rest Timer with Mini/Full Modes
// Features: Minimizable timer, strong finish notifications, voice countdown
// Connected to settings via useRestTimerSettings hook
// Uses Portal rendering via ModalOverlay for proper z-index stacking and focus management

import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useRestTimer } from '../hooks/useWorkoutTimer';
import { useRestTimerSettings } from '../hooks/useWorkoutSettings';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import '../workout-premium.css';
import { triggerHaptic, vibratePattern } from '../../../src/utils/haptics';
import { Z_INDEX } from '../../../constants/zIndex';

// ============================================================
// ANIMATION CONSTANTS (stable references to prevent re-renders)
// ============================================================

const MINI_TIMER_INITIAL = { y: 100, opacity: 0 };
const MINI_TIMER_ANIMATE = { y: 0, opacity: 1 };
const MINI_TIMER_EXIT = { y: 100, opacity: 0 };
const MINI_TIMER_TRANSITION = { type: 'spring' as const, damping: 25, stiffness: 300 };

const PULSING_DOT_ANIMATE = { scale: [1, 1.2, 1] };
const PULSING_TIME_ANIMATE = { scale: [1, 1.05, 1] };
const PULSING_TRANSITION = { duration: 0.5, repeat: Infinity };

const FULL_TIMER_FADE_INITIAL = { opacity: 0 };
const FULL_TIMER_FADE_ANIMATE = { opacity: 1 };
const FULL_TIMER_FADE_EXIT = { opacity: 0 };

const DRAG_HINT_ANIMATE = { y: [0, 5, 0] };
const DRAG_HINT_TRANSITION = { duration: 2, repeat: Infinity };

const TIMER_CIRCLE_INITIAL = { scale: 0.8, opacity: 0 };
const TIMER_CIRCLE_ANIMATE = { scale: 1, opacity: 1 };

const LAST_FIVE_PULSE_ANIMATE = { scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] };
const LAST_FIVE_PULSE_TRANSITION = { duration: 1, repeat: Infinity };

const LARGE_TIME_PULSE_ANIMATE = { scale: [1, 1.1, 1] };

const NEXT_EXERCISE_INITIAL = { opacity: 0, y: 20 };
const NEXT_EXERCISE_ANIMATE = { opacity: 1, y: 0 };

const EMPTY_ANIMATION = {};

const LAST_FIVE_BOX_SHADOW = [
    '0 0 20px var(--cosmos-accent-primary)',
    '0 0 40px var(--cosmos-accent-primary)',
    '0 0 20px var(--cosmos-accent-primary)',
];
const BOX_SHADOW_TRANSITION = { duration: 0.5, repeat: Infinity };

// ============================================================
// TYPES
// ============================================================

export interface NextExerciseInfo {
    name: string;
    sets: number;
    targetReps?: number;
    targetWeight?: number;
}

interface RestTimerOverlayProps {
    active: boolean;
    endTime: number | null;
    oledMode?: boolean;
    nextExercise?: NextExerciseInfo | null;
    onSkip: () => void;
    onAddTime: (seconds: number) => void;
    onUndo?: () => void;
}



// Strong vibration pattern for timer end - gets attention!
const STRONG_VIBRATION_PATTERN = [
    200, 100, 200, 100, 200, // First burst
    200, // Pause
    300, 100, 300, 100, 300, // Second burst (stronger)
    200, // Pause
    500, // Final long vibration
];

// ============================================================
// MINI TIMER PILL (Floating at bottom - no portal needed)
// ============================================================

interface MiniTimerProps {
    formatted: string;
    progress: number;
    timeLeft: number;
    onExpand: () => void;
    onSkip: () => void;
    onAddTime: (seconds: number) => void;
}

const MiniTimer = memo<MiniTimerProps>(({
    formatted,
    progress,
    timeLeft,
    onExpand,
    onSkip,
    onAddTime
}) => {
    const isLastFive = timeLeft <= 5 && timeLeft > 0;

    // Mini timer uses portal for proper z-index
    const content = (
        <motion.div
            initial={MINI_TIMER_INITIAL}
            animate={MINI_TIMER_ANIMATE}
            exit={MINI_TIMER_EXIT}
            transition={MINI_TIMER_TRANSITION}
            className="fixed bottom-6 inset-x-4 pointer-events-auto"
            style={{ zIndex: Z_INDEX.modal }}
        >
            <motion.div
                className={`
                    relative mx-auto max-w-md rounded-2xl overflow-hidden
                    backdrop-blur-xl border
                    ${isLastFive
                        ? 'bg-[var(--cosmos-accent-primary)]/20 border-[var(--cosmos-accent-primary)]/40'
                        : 'bg-[#1C1C1E]/95 border-white/10'
                    }
                `}
                animate={isLastFive ? { boxShadow: LAST_FIVE_BOX_SHADOW } : EMPTY_ANIMATION}
                transition={BOX_SHADOW_TRANSITION}
            >
                {/* Progress bar at top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-white/10">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[var(--cosmos-accent-primary)] to-[var(--cosmos-accent-secondary)]"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="flex items-center gap-3 p-4 pt-5">
                    {/* Timer display - tap to expand */}
                    <button
                        onClick={onExpand}
                        className="flex-1 flex items-center gap-3 active:opacity-70 transition-opacity"
                    >
                        {/* Circular mini progress */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                            <svg className="w-12 h-12 -rotate-90">
                                <circle
                                    cx="24" cy="24" r="20"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="4"
                                />
                                <circle
                                    cx="24" cy="24" r="20"
                                    fill="none"
                                    stroke={isLastFive ? 'var(--cosmos-accent-primary)' : 'var(--cosmos-accent-secondary)'}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray={125.6}
                                    strokeDashoffset={125.6 * (1 - progress / 100)}
                                />
                            </svg>
                            {/* Pulsing dot for last 5 seconds */}
                            {isLastFive && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={PULSING_DOT_ANIMATE}
                                    transition={PULSING_TRANSITION}
                                >
                                    <div className="w-2 h-2 rounded-full bg-[var(--cosmos-accent-primary)]" />
                                </motion.div>
                            )}
                        </div>

                        {/* Time and label */}
                        <div className="text-start flex-1">
                            <motion.div
                                className={`text-3xl font-bold tabular-nums ${isLastFive ? 'text-[var(--cosmos-accent-primary)]' : 'text-white'
                                    }`}
                                animate={isLastFive ? PULSING_TIME_ANIMATE : EMPTY_ANIMATION}
                                transition={PULSING_TRANSITION}
                            >
                                {formatted}
                            </motion.div>
                            <div className={`text-xs font-medium ${isLastFive ? 'text-[var(--cosmos-accent-primary)]/70' : 'text-white/50'
                                }`}>
                                {isLastFive ? 'התכונן!' : 'מנוחה • הקש להגדלה'}
                            </div>
                        </div>
                    </button>

                    {/* Quick actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onAddTime(30)}
                            onPointerDown={(e) => { e.preventDefault(); onAddTime(30); }}
                            className="w-11 h-11 rounded-xl bg-[var(--cosmos-accent-secondary)]/10 flex items-center justify-center text-[var(--cosmos-accent-secondary)] font-bold text-sm active:bg-[var(--cosmos-accent-secondary)]/20 transition-colors"
                        >
                            +30
                        </button>
                        <button
                            onClick={onSkip}
                            onPointerDown={(e) => { e.preventDefault(); onSkip(); }}
                            className="w-11 h-11 rounded-xl bg-[var(--cosmos-accent-primary)] flex items-center justify-center active:brightness-90 transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                <polygon points="5 4 15 12 5 20 5 4" fill="black" />
                                <line x1="19" y1="5" x2="19" y2="19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );

    // Render via portal
    if (typeof document !== 'undefined') {
        return createPortal(content, document.body);
    }
    return content;
});

MiniTimer.displayName = 'MiniTimer';

// ============================================================
// FULL TIMER (Centered overlay with Portal)
// ============================================================

interface FullTimerProps {
    formatted: string;
    progress: number;
    timeLeft: number;
    nextExercise?: NextExerciseInfo | null;
    oledMode: boolean;
    onMinimize: () => void;
    onSkip: () => void;
    onAddTime: (seconds: number) => void;
    onUndo?: () => void;
}

const RingProgress = memo<{ progress: number; size?: number; strokeWidth?: number }>(
    ({ progress, size = 240, strokeWidth = 8 }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress / 100);

        return (
            <svg width={size} height={size} className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="url(#timerGradient)" strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />
                <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--cosmos-accent-primary)" />
                        <stop offset="100%" stopColor="var(--cosmos-accent-secondary)" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
);
RingProgress.displayName = 'RingProgress';

const FullTimer = memo<FullTimerProps>(({
    formatted,
    progress,
    timeLeft,
    nextExercise,
    oledMode,
    onMinimize,
    onSkip,
    onAddTime,
    onUndo,
}) => {
    const isLastFive = timeLeft <= 5 && timeLeft > 0;
    const containerRef = useRef<HTMLDivElement>(null);

    // Focus trap for full timer
    useFocusTrap(containerRef, {
        isOpen: true,
        lockScroll: true,
        autoFocus: false, // Don't auto-focus, user might be mid-workout
        restoreFocus: false,
    });

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.y > 80) {
            onMinimize();
        }
    };

    const content = (
        <motion.div
            ref={containerRef}
            initial={FULL_TIMER_FADE_INITIAL}
            animate={FULL_TIMER_FADE_ANIMATE}
            exit={FULL_TIMER_FADE_EXIT}
            className="fixed inset-0 flex items-center justify-center"
            style={{
                zIndex: Z_INDEX.overlay,
                background: oledMode
                    ? 'rgba(0,0,0,0.98)'
                    : 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                backdropFilter: 'blur(30px)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="טיימר מנוחה"
        >
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={handleDragEnd}
                className="relative flex flex-col items-center w-full max-w-md px-6"
            >
                {/* Minimize hint */}
                <motion.div
                    className="flex flex-col items-center mb-8"
                    animate={DRAG_HINT_ANIMATE}
                    transition={DRAG_HINT_TRANSITION}
                >
                    <div className="w-12 h-1 rounded-full bg-white/30 mb-2" />
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">
                        גרור למטה למזער
                    </span>
                </motion.div>

                {/* Timer Circle */}
                <motion.div
                    className="relative w-[240px] h-[240px] flex items-center justify-center mb-8"
                    initial={TIMER_CIRCLE_INITIAL}
                    animate={TIMER_CIRCLE_ANIMATE}
                >
                    <RingProgress progress={progress} size={240} />

                    {/* Pulse effect for last 5 seconds */}
                    {isLastFive && (
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={LAST_FIVE_PULSE_ANIMATE}
                            transition={LAST_FIVE_PULSE_TRANSITION}
                            style={{ background: 'radial-gradient(circle, var(--cosmos-accent-primary) 0%, transparent 70%)', opacity: 0.4 }}
                        />
                    )}

                    {/* Time Display */}
                    <div className="relative flex flex-col items-center">
                        <motion.span
                            className={`text-7xl font-[800] tabular-nums tracking-tighter ${isLastFive ? 'text-[var(--cosmos-accent-primary)]' : 'text-white'
                                }`}
                            animate={isLastFive ? LARGE_TIME_PULSE_ANIMATE : EMPTY_ANIMATION}
                            transition={PULSING_TRANSITION}
                            style={{ textShadow: isLastFive ? '0 0 40px var(--cosmos-accent-primary)' : 'none' }}
                        >
                            {formatted}
                        </motion.span>
                        <span className={`text-sm font-bold uppercase tracking-[0.2em] mt-2 ${isLastFive ? 'text-[var(--cosmos-accent-primary)]' : 'text-white/50'
                            }`}>
                            {isLastFive ? 'התכונן!' : 'מנוחה'}
                        </span>
                    </div>
                </motion.div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => onAddTime(-10)}
                        onPointerDown={(e) => { e.preventDefault(); onAddTime(-10); }}
                        className="w-14 h-14 rounded-2xl bg-[var(--cosmos-accent-secondary)]/10 flex items-center justify-center text-[var(--cosmos-accent-secondary)] font-bold border border-[var(--cosmos-accent-secondary)]/10 active:bg-[var(--cosmos-accent-secondary)]/20 transition-colors"
                    >
                        -10
                    </button>

                    <button
                        onClick={onSkip}
                        onPointerDown={(e) => { e.preventDefault(); onSkip(); }}
                        className="px-8 h-14 rounded-2xl bg-gradient-to-br from-[var(--cosmos-accent-primary)] to-[var(--cosmos-accent-secondary)] text-white font-bold text-lg flex items-center gap-2 shadow-lg shadow-[var(--cosmos-accent-primary)]/30 active:opacity-80 transition-opacity"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                            <polygon points="5 4 15 12 5 20 5 4" />
                            <rect x="17" y="5" width="2" height="14" />
                        </svg>
                        דלג
                    </button>

                    <button
                        onClick={() => onAddTime(30)}
                        onPointerDown={(e) => { e.preventDefault(); onAddTime(30); }}
                        className="w-14 h-14 rounded-2xl bg-[var(--cosmos-accent-secondary)]/10 flex items-center justify-center text-[var(--cosmos-accent-secondary)] font-bold border border-[var(--cosmos-accent-secondary)]/10 active:bg-[var(--cosmos-accent-secondary)]/20 transition-colors"
                    >
                        +30
                    </button>
                </div>

                {/* Undo button */}
                {onUndo && (
                    <button
                        onClick={onUndo}
                        onPointerDown={(e) => { e.preventDefault(); onUndo(); }}
                        className="mb-6 px-4 py-2 rounded-xl text-red-400 font-medium text-sm flex items-center gap-2 active:bg-red-500/10 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 7v6h6" />
                            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                        </svg>
                        ביטול סיום סט
                    </button>
                )}

                {/* Next Exercise */}
                {nextExercise && (
                    <motion.div
                        initial={NEXT_EXERCISE_INITIAL}
                        animate={NEXT_EXERCISE_ANIMATE}
                        className="w-full rounded-2xl p-4 text-center bg-white/5 border border-white/10"
                    >
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
                            התרגיל הבא
                        </div>
                        <div className="text-lg font-bold text-white mb-2">
                            {nextExercise.name}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                            <span className="px-2 py-1 rounded-lg bg-white/10">{nextExercise.sets} סטים</span>
                            {nextExercise.targetReps && (
                                <span className="px-2 py-1 rounded-lg bg-white/10">{nextExercise.targetReps} חזרות</span>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Minimize button */}
                <button
                    onClick={onMinimize}
                    onPointerDown={(e) => { e.preventDefault(); onMinimize(); }}
                    className="mt-6 px-6 py-3 rounded-xl text-white/50 font-medium text-sm flex items-center gap-2 active:bg-white/5 transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 14 10 14 10 20" />
                        <polyline points="20 10 14 10 14 4" />
                        <line x1="14" y1="10" x2="21" y2="3" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    מזער ותכין את התרגיל הבא
                </button>
            </motion.div>
        </motion.div>
    );

    // Render via portal
    if (typeof document !== 'undefined') {
        return createPortal(content, document.body);
    }
    return content;
});

FullTimer.displayName = 'FullTimer';

// ============================================================
// MAIN COMPONENT
// ============================================================

const RestTimerOverlay = memo<RestTimerOverlayProps>(({
    active,
    endTime,
    oledMode = false,
    nextExercise,
    onSkip,
    onAddTime,
    onUndo,
}) => {
    const { formatted, progress, timeLeft } = useRestTimer(endTime, active);
    const prevTimeLeft = useRef(timeLeft);
    const totalTimeRef = useRef<number>(0);
    const hasAnnouncedReadyRef = useRef(false);

    // Mini/Full mode state
    const [isMinimized, setIsMinimized] = useState(false);

    // Get settings from hook
    const {
        vibrate,
        voiceEnabled,
        announceCountdown,
        announceReady,
        playRestEndSound
    } = useRestTimerSettings();

    // Reset to full mode when timer starts
    useEffect(() => {
        if (active && endTime) {
            const total = Math.round((endTime - Date.now()) / 1000);
            if (total > 0) {
                totalTimeRef.current = total;
            }
            hasAnnouncedReadyRef.current = false;
            // Start in full mode for first few seconds, then user can minimize
        }
    }, [active, endTime]);

    // Voice countdown and haptic feedback
    useEffect(() => {
        if (!active || timeLeft === prevTimeLeft.current) return;

        const prevTime = prevTimeLeft.current;
        prevTimeLeft.current = timeLeft;

        // Last 5 seconds - haptic feedback (medium)
        if (timeLeft <= 5 && timeLeft > 0) {
            if (vibrate) {
                vibratePattern([50 + (5 - timeLeft) * 20]); // Gets stronger as time decreases
            }
        }

        // Voice/beep countdown at specific intervals
        const announcePoints = [30, 10, 5, 4, 3, 2, 1];
        if (announcePoints.includes(timeLeft)) {
            announceCountdown(timeLeft, totalTimeRef.current);
        }

        // Timer finished - STRONG notification!
        if (timeLeft === 0 && prevTime > 0) {
            if (!hasAnnouncedReadyRef.current) {
                // Strong vibration pattern
                if (vibrate) {
                    vibratePattern(STRONG_VIBRATION_PATTERN);
                }

                // Play sound and announce
                playRestEndSound();
                announceReady();

                // Expand to full mode when timer ends
                setIsMinimized(false);

                hasAnnouncedReadyRef.current = true;
            }
        }
    }, [active, timeLeft, vibrate, voiceEnabled, announceCountdown, announceReady, playRestEndSound]);

    // Handlers
    const handleSkip = useCallback(() => {
        triggerHaptic('light');
        onSkip();
    }, [onSkip]);

    const handleAddTime = useCallback((seconds: number) => {
        triggerHaptic('light');
        onAddTime(seconds);
    }, [onAddTime]);

    const handleUndo = useCallback(() => {
        triggerHaptic('light');
        onUndo?.();
    }, [onUndo]);

    const handleMinimize = useCallback(() => {
        triggerHaptic('light');
        setIsMinimized(true);
    }, []);

    const handleExpand = useCallback(() => {
        triggerHaptic('light');
        setIsMinimized(false);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {active && (
                isMinimized ? (
                    <MiniTimer
                        key="mini"
                        formatted={formatted}
                        progress={progress}
                        timeLeft={timeLeft}
                        onExpand={handleExpand}
                        onSkip={handleSkip}
                        onAddTime={handleAddTime}
                    />
                ) : (
                    <FullTimer
                        key="full"
                        formatted={formatted}
                        progress={progress}
                        timeLeft={timeLeft}
                        nextExercise={nextExercise}
                        oledMode={oledMode}
                        onMinimize={handleMinimize}
                        onSkip={handleSkip}
                        onAddTime={handleAddTime}
                        onUndo={handleUndo}
                    />
                )
            )}
        </AnimatePresence>
    );
});

RestTimerOverlay.displayName = 'RestTimerOverlay';

export default RestTimerOverlay;
