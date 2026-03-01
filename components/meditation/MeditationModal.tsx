import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, PlayIcon, PauseIcon, RefreshIcon } from '../icons';
import { useHaptics } from '../../hooks/useHaptics';
import { useWakeLock } from '../../hooks/useWakeLock';
import BreathingExercise from '../breathing/BreathingExercise';

interface MeditationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDuration?: number; // in minutes
}

type MeditationMode = 'timer' | 'breathing';
type AmbientSound = 'silence' | 'rain' | 'ocean' | 'forest' | 'bells';

const PRESET_DURATIONS = [5, 10, 15, 20, 30]; // minutes

const AMBIENT_SOUNDS: { id: AmbientSound; label: string; emoji: string }[] = [
    { id: 'silence', label: 'שקט', emoji: '🤫' },
    { id: 'rain', label: 'גשם', emoji: '🌧️' },
    { id: 'ocean', label: 'אוקיינוס', emoji: '🌊' },
    { id: 'forest', label: 'יער', emoji: '🌲' },
    { id: 'bells', label: 'פעמונים', emoji: '🔔' },
];

/**
 * MeditationModal - Full-screen meditation timer with ambient sounds
 * Supports timed meditation sessions and breathing exercises
 */
export const MeditationModal: React.FC<MeditationModalProps> = ({
    isOpen,
    onClose,
    initialDuration = 10,
}) => {
    const [mode, setMode] = useState<MeditationMode>('timer');
    const [duration, setDuration] = useState(initialDuration * 60); // in seconds
    const [remainingTime, setRemainingTime] = useState(initialDuration * 60);
    const [isActive, setIsActive] = useState(false);
    const [selectedSound, setSelectedSound] = useState<AmbientSound>('silence');
    const [showBreathing, setShowBreathing] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { triggerHaptic, hapticSuccess } = useHaptics();
    const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Progress percentage
    const progress = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0;

    // Play bell sound
    const playBell = useCallback(() => {
        // Using Web Audio API for a simple bell sound
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 528; // Healing frequency
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 2);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, []);

    // Start meditation
    const start = useCallback(() => {
        setIsActive(true);
        setRemainingTime(duration);
        requestWakeLock();
        triggerHaptic('medium');
        playBell();
    }, [duration, requestWakeLock, triggerHaptic, playBell]);

    // Pause meditation
    const pause = useCallback(() => {
        setIsActive(false);
        triggerHaptic('light');
    }, [triggerHaptic]);

    // Resume meditation
    const resume = useCallback(() => {
        setIsActive(true);
        triggerHaptic('light');
    }, [triggerHaptic]);

    // Reset meditation
    const reset = useCallback(() => {
        setIsActive(false);
        setRemainingTime(duration);
        triggerHaptic('light');
    }, [duration, triggerHaptic]);

    // Complete meditation
    const complete = useCallback(() => {
        setIsActive(false);
        releaseWakeLock();
        hapticSuccess();
        playBell();

        // Show completion message
        setTimeout(() => {
            playBell();
        }, 1500);
    }, [releaseWakeLock, hapticSuccess, playBell]);

    // Timer interval
    useEffect(() => {
        if (!isActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    complete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, complete]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            releaseWakeLock();
        };
    }, [releaseWakeLock]);

    // Handle duration change
    const handleDurationChange = (minutes: number) => {
        const newDuration = minutes * 60;
        setDuration(newDuration);
        setRemainingTime(newDuration);
    };

    if (!isOpen) return null;

    // Show breathing exercise
    if (showBreathing) {
        return (
            <BreathingExercise
                isOpen={true}
                onClose={() => setShowBreathing(false)}
            />
        );
    }

    const isCompleted = remainingTime === 0 && !isActive;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-cosmos-void via-cosmos-depth to-black flex flex-col overflow-hidden"
        >
            {/* Ambient glow effect */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
                }}
            />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-4 shrink-0">
                <h2 className="text-xl font-bold text-white">מדיטציה</h2>
                <button
                    onClick={() => {
                        pause();
                        releaseWakeLock();
                        onClose();
                    }}
                    className="p-2 text-theme-secondary hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content Container - Flex Col to Distribute Space */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-between pb-8 w-full max-w-lg mx-auto">

                {/* Mode Tabs */}
                {!isActive && !isCompleted && (
                    <div className="w-full px-6 py-2 flex gap-2 shrink-0">
                        <button
                            onClick={() => setMode('timer')}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${mode === 'timer'
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                : 'bg-white/5 text-theme-secondary hover:bg-white/10'
                                }`}
                        >
                            ⏱️ טיימר
                        </button>
                        <button
                            onClick={() => setShowBreathing(true)}
                            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium bg-white/5 text-theme-secondary hover:bg-white/10 transition-all"
                        >
                            💨 תרגילי נשימה
                        </button>
                    </div>
                )}

                {/* Main Timer Circle - Flexible Spacer */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full py-4">
                    <div className="relative w-full max-w-[18rem] aspect-square flex items-center justify-center px-4">
                        {/* Progress ring - using viewBox for responsiveness */}
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#progressGradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                animate={{
                                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
                                }}
                                transition={{ duration: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#EC4899" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            {isCompleted ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-center"
                                >
                                    <span className="text-5xl sm:text-6xl">🙏</span>
                                    <p className="text-xl font-medium text-white mt-4">נמסטה</p>
                                    <p className="text-sm text-violet-300 mt-1">המדיטציה הסתיימה</p>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.span
                                        key={remainingTime}
                                        initial={{ scale: 1.1, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-5xl sm:text-6xl font-mono font-light text-white tracking-wider"
                                    >
                                        {formatTime(remainingTime)}
                                    </motion.span>
                                    <p className="text-sm text-theme-muted mt-2">
                                        {isActive ? 'התמקד בנשימה' : 'מוכן להתחיל'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls Container - Anchored Bottom Logic */}
                <div className="w-full flex flex-col gap-4 px-4 shrink-0">

                    {/* Duration Presets */}
                    {!isActive && !isCompleted && (
                        <div className="w-full">
                            <p className="text-xs text-theme-secondary mb-2 text-center uppercase tracking-wider">משך זמן (דקות)</p>
                            <div className="flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {PRESET_DURATIONS.map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => handleDurationChange(mins)}
                                        className={`flex-shrink-0 w-12 h-12 rounded-full text-base font-medium transition-all ${duration === mins * 60
                                            ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                            : 'bg-white/5 text-theme-secondary hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {mins}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ambient Sound Selector */}
                    {!isActive && !isCompleted && (
                        <div className="w-full">
                            <div className="flex justify-center gap-3">
                                {AMBIENT_SOUNDS.map(sound => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSelectedSound(sound.id)}
                                        className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${selectedSound === sound.id
                                            ? 'bg-white/20 ring-2 ring-violet-500/50 scale-110'
                                            : 'bg-white/5 hover:bg-white/10 grayscale hover:grayscale-0'
                                            }`}
                                        title={sound.label}
                                    >
                                        {sound.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center items-center gap-6 mt-2 min-h-[5rem]">
                        {isCompleted ? (
                            <button
                                onClick={() => {
                                    reset();
                                }}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-violet-500/30"
                            >
                                <RefreshIcon className="w-10 h-10 text-white" />
                            </button>
                        ) : isActive ? (
                            <>
                                <button
                                    onClick={pause}
                                    className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center transition-all active:scale-95 border border-white/10"
                                >
                                    <PauseIcon className="w-10 h-10 text-white" />
                                </button>
                                <button
                                    onClick={reset}
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center transition-all active:scale-95"
                                >
                                    <RefreshIcon className="w-5 h-5 text-theme-secondary" />
                                </button>
                            </>
                        ) : remainingTime < duration ? (
                            <>
                                <button
                                    onClick={resume}
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-violet-500/30"
                                >
                                    <PlayIcon className="w-10 h-10 text-white" />
                                </button>
                                <button
                                    onClick={reset}
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center transition-all active:scale-95"
                                >
                                    <RefreshIcon className="w-5 h-5 text-theme-secondary" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={start}
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-violet-500/30"
                            >
                                <PlayIcon className="w-10 h-10 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MeditationModal;
