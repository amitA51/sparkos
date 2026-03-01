import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    getAllPatterns,
    getPatternById,
    BreathingPattern,
    BreathPhase
} from '../../data/breathingPatterns';
import { CloseIcon, PlayIcon, PauseIcon } from '../icons';
import { useHaptics } from '../../hooks/useHaptics';
import { useWakeLock } from '../../hooks/useWakeLock';

interface BreathingExerciseProps {
    isOpen: boolean;
    onClose: () => void;
    initialPatternId?: string;
}

/**
 * BreathingExercise - Guided breathing exercise component
 * Features animated breathing circle, multiple patterns, and haptic feedback
 */
export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
    isOpen,
    onClose,
    initialPatternId = 'boxBreathing',
}) => {
    const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(
        getPatternById(initialPatternId)
    );
    const [isActive, setIsActive] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const { triggerHaptic } = useHaptics();
    const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

    const currentPhase = selectedPattern.phases[currentPhaseIndex];

    // Get animation scale based on phase
    const getBreathScale = useCallback((phase: BreathPhase, progress: number): number => {
        switch (phase) {
            case 'inhale':
                return 1 + (0.4 * progress); // 1 -> 1.4
            case 'exhale':
                return 1.4 - (0.4 * progress); // 1.4 -> 1
            case 'hold':
                return 1.4; // Stay expanded
            case 'holdEmpty':
                return 1; // Stay contracted
            default:
                return 1;
        }
    }, []);

    // Move to next phase
    const advancePhase = useCallback(() => {
        const nextIndex = (currentPhaseIndex + 1) % selectedPattern.phases.length;
        setCurrentPhaseIndex(nextIndex);
        setPhaseProgress(0);

        // Vibrate on phase change
        triggerHaptic('light');

        // Increment cycle count when starting over
        if (nextIndex === 0) {
            setCycleCount(prev => prev + 1);
        }
    }, [currentPhaseIndex, selectedPattern.phases.length, triggerHaptic]);

    // Start the exercise
    const start = useCallback(() => {
        setIsActive(true);
        setCurrentPhaseIndex(0);
        setPhaseProgress(0);
        setCycleCount(0);
        setTotalDuration(0);
        startTimeRef.current = Date.now();
        requestWakeLock();
        triggerHaptic('medium');
    }, [requestWakeLock, triggerHaptic]);

    // Stop the exercise
    const stop = useCallback(() => {
        setIsActive(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        releaseWakeLock();
    }, [releaseWakeLock]);

    // Handle phase timing
    useEffect(() => {
        if (!isActive || !currentPhase) return;

        const phaseDuration = currentPhase.duration * 1000;
        const updateInterval = 50; // Update every 50ms for smooth animation

        // Update progress
        intervalRef.current = setInterval(() => {
            setPhaseProgress(prev => {
                const newProgress = prev + (updateInterval / phaseDuration);
                return Math.min(newProgress, 1);
            });
            setTotalDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, updateInterval);

        // Advance to next phase when complete
        timerRef.current = setTimeout(() => {
            advancePhase();
        }, phaseDuration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, currentPhase, advancePhase]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            releaseWakeLock();
        };
    }, [releaseWakeLock]);

    // Handle pattern change
    const handlePatternChange = (patternId: string) => {
        stop();
        setSelectedPattern(getPatternById(patternId));
        setCurrentPhaseIndex(0);
        setPhaseProgress(0);
    };

    // Format duration
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    const breathScale = isActive && currentPhase ? getBreathScale(currentPhase.action, phaseProgress) : 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
        >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">תרגילי נשימה</h2>
                <button
                    onClick={() => {
                        stop();
                        onClose();
                    }}
                    className="p-2 text-theme-secondary hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Pattern Selector */}
            {!isActive && (
                <div className="px-4 py-6 border-b border-white/10">
                    <p className="text-sm text-theme-secondary mb-3">בחר טכניקת נשימה:</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {getAllPatterns().map(pattern => (
                            <button
                                key={pattern.id}
                                onClick={() => handlePatternChange(pattern.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedPattern.id === pattern.id
                                    ? 'text-white shadow-lg'
                                    : 'bg-white/5 text-theme-secondary hover:bg-white/10 hover:text-white'
                                    }`}
                                style={{
                                    backgroundColor: selectedPattern.id === pattern.id ? pattern.color : undefined,
                                }}
                            >
                                {pattern.nameHe}
                            </button>
                        ))}
                    </div>

                    {/* Pattern Description */}
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-sm text-theme-primary leading-relaxed">
                            {selectedPattern.descriptionHe}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedPattern.benefitsHe.map((benefit, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-xs rounded-lg bg-white/10 text-theme-primary"
                                >
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Breathing Circle */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Outer glow ring */}
                    <motion.div
                        animate={{
                            scale: breathScale,
                            opacity: isActive ? 0.3 : 0.1,
                        }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                        className="absolute w-full h-full rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${selectedPattern.color}40, transparent 70%)`,
                        }}
                    />

                    {/* Main breathing circle */}
                    <motion.div
                        animate={{
                            scale: breathScale,
                        }}
                        transition={{ duration: 0.1, ease: 'linear' }}
                        className="relative w-48 h-48 rounded-full flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${selectedPattern.color}60, ${selectedPattern.color}30)`,
                            boxShadow: isActive ? `0 0 60px ${selectedPattern.color}50` : 'none',
                        }}
                    >
                        {/* Inner circle with instruction */}
                        <div className="w-32 h-32 rounded-full bg-black/50 backdrop-blur-xl flex flex-col items-center justify-center">
                            {isActive ? (
                                <>
                                    <span
                                        className="text-2xl font-bold text-white"
                                        style={{ color: selectedPattern.color }}
                                    >
                                        {currentPhase?.labelHe}
                                    </span>
                                    <span className="text-4xl font-mono text-white/80 mt-1">
                                        {currentPhase ? Math.ceil(currentPhase.duration * (1 - phaseProgress)) : 0}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg text-theme-secondary">לחץ להתחלה</span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Stats during exercise */}
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex gap-8 text-center"
                    >
                        <div>
                            <p className="text-3xl font-mono text-white">{cycleCount}</p>
                            <p className="text-sm text-theme-muted">מחזורים</p>
                        </div>
                        <div>
                            <p className="text-3xl font-mono text-white">{formatDuration(totalDuration)}</p>
                            <p className="text-sm text-theme-muted">זמן</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Control Button */}
            <div className="p-8 flex justify-center">
                <button
                    onClick={isActive ? stop : start}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95"
                    style={{
                        background: isActive
                            ? 'rgba(255,255,255,0.1)'
                            : `linear-gradient(135deg, ${selectedPattern.color}, ${selectedPattern.color}cc)`,
                        boxShadow: !isActive ? `0 0 30px ${selectedPattern.color}50` : 'none',
                    }}
                >
                    {isActive ? (
                        <PauseIcon className="w-10 h-10 text-white" />
                    ) : (
                        <PlayIcon className="w-10 h-10 text-white" />
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default BreathingExercise;
