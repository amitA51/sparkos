import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, StopIcon, SparklesIcon, BookOpenIcon, FlameIcon } from '../icons';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccurateTimer } from '../../hooks/useAccurateTimer';
import { useSettings } from '../../src/contexts/SettingsContext';

interface FocusTimerWidgetProps {
    title?: string;
}

// Apple Watch Ultra inspired presets
const PRESETS = [
    { label: '25', minutes: 25, icon: SparklesIcon, accentColor: '#FF9500' }, // Orange
    { label: '45', minutes: 45, icon: BookOpenIcon, accentColor: '#32ADE6' }, // Cyan
    { label: '60', minutes: 60, icon: FlameIcon, accentColor: '#BF5AF2' },    // Purple
] as const;

// Format time to MM:SS
const formatTime = (ms: number): { minutes: string; seconds: string } => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
    };
};

const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({ title = 'טיימר למידה' }) => {
    const { triggerHaptic, hapticSuccess, hapticSelection } = useHaptics();
    const { settings } = useSettings();
    const [selectedPreset, setSelectedPreset] = useState(0);

    // Get the theme accent color from settings
    const themeAccentColor = settings.themeSettings.accentColor || '#FF9500';

    const currentPreset = PRESETS[selectedPreset] ?? PRESETS[0];
    const initialDuration = currentPreset.minutes * 60 * 1000;

    // Use the accurate timer hook
    const timer = useAccurateTimer({
        initialDuration,
        onComplete: () => {
            hapticSuccess();
        },
    });

    // Update timer duration when preset changes (only if idle)
    useEffect(() => {
        if (timer.status === 'idle') {
            timer.reset(initialDuration);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPreset, initialDuration]);

    // Derived state
    const isRunning = timer.status === 'running';
    const isPaused = timer.status === 'paused';
    const isActive = isRunning || isPaused;
    const timeObj = formatTime(timer.remaining);

    // Handlers
    const handleStart = useCallback(() => {
        triggerHaptic('medium');
        timer.start(initialDuration);
    }, [triggerHaptic, timer, initialDuration]);

    const handleToggle = useCallback(() => {
        triggerHaptic('light');
        if (isRunning) {
            timer.pause();
        } else if (isPaused) {
            timer.resume();
        }
    }, [triggerHaptic, isRunning, isPaused, timer]);

    const handleStop = useCallback(() => {
        triggerHaptic('heavy');
        timer.stop();
    }, [triggerHaptic, timer]);

    const handlePresetSelect = useCallback((index: number) => {
        if (isActive) return; // Don't change preset while active
        setSelectedPreset(index);
        hapticSelection();
    }, [isActive, hapticSelection]);

    // SVG Circle calculations
    const strokeWidth = 6;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - timer.progress);

    const CurrentIcon = currentPreset.icon;

    return (
        <div className="relative w-full aspect-square max-w-[380px] mx-auto select-none">
            {/* Background - True Black for OLED */}
            <div className="absolute inset-0 bg-black rounded-[40px] shadow-2xl" />

            {/* Outer Ring Glow Effect - Uses theme accent color */}
            <motion.div
                className="absolute inset-2 rounded-[36px] opacity-30"
                style={{
                    background: `radial-gradient(circle at center, ${themeAccentColor}20 0%, transparent 70%)`
                }}
                animate={{
                    opacity: isRunning ? 0.5 : 0.2,
                    scale: isRunning ? 1.02 : 1
                }}
                transition={{ duration: 0.5 }}
            />

            {/* Main Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6">

                {/* Header Label */}
                <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                        <CurrentIcon className="w-4 h-4" style={{ color: themeAccentColor }} />
                        <span className="text-xs font-semibold text-white/80 tracking-wider uppercase">{title}</span>
                    </div>
                </div>

                {/* Ring + Time Display */}
                <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
                    {/* SVG Progress Ring */}
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 200 200"
                    >
                        <defs>
                            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={themeAccentColor} />
                                <stop offset="100%" stopColor={themeAccentColor} stopOpacity="0.6" />
                            </linearGradient>
                            <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Track */}
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={strokeWidth}
                        />

                        {/* Progress Ring */}
                        <motion.circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="url(#ring-gradient)"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            filter={isRunning ? "url(#ring-glow)" : undefined}
                            style={{ opacity: isActive ? 1 : 0.4 }}
                        />
                    </svg>

                    {/* Digital Time Display */}
                    <div className="flex flex-col items-center justify-center z-10">
                        <div className="flex items-center" dir="ltr">
                            <span
                                className="text-7xl font-thin tracking-tighter text-white tabular-nums"
                                style={{ fontFeatureSettings: '"tnum"' }}
                            >
                                {timeObj.minutes}
                            </span>
                            <motion.span
                                className="text-5xl font-thin text-white/40 mx-1"
                                animate={{ opacity: isRunning ? [1, 0.3, 1] : 1 }}
                                transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                            >
                                :
                            </motion.span>
                            <span
                                className="text-7xl font-thin tracking-tighter text-white tabular-nums"
                                style={{ fontFeatureSettings: '"tnum"' }}
                            >
                                {timeObj.seconds}
                            </span>
                        </div>

                        {/* Status Label */}
                        <AnimatePresence mode="wait">
                            {isRunning && (
                                <motion.div
                                    key="focus"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex items-center gap-2 mt-2"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                            style={{ backgroundColor: themeAccentColor }}
                                        />
                                        <span
                                            className="relative inline-flex rounded-full h-2 w-2"
                                            style={{ backgroundColor: themeAccentColor }}
                                        />
                                    </span>
                                    <span
                                        className="text-xs font-bold tracking-widest uppercase"
                                        style={{ color: themeAccentColor }}
                                    >
                                        בפוקוס
                                    </span>
                                </motion.div>
                            )}
                            {isPaused && (
                                <motion.span
                                    key="paused"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs font-bold tracking-widest uppercase text-white/40 mt-2"
                                >
                                    מושהה
                                </motion.span>
                            )}
                            {!isActive && (
                                <motion.span
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xs font-medium tracking-widest uppercase text-white/30 mt-2"
                                >
                                    דקות
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
                    <AnimatePresence mode="wait">
                        {!isActive ? (
                            /* Preset Selection + Start */
                            <motion.div
                                key="presets"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                            >
                                <div className="flex gap-1">
                                    {PRESETS.map((preset, index) => {
                                        const isSelected = selectedPreset === index;
                                        return (
                                            <button
                                                key={preset.label}
                                                onClick={() => handlePresetSelect(index)}
                                                className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${isSelected
                                                    ? 'text-white'
                                                    : 'text-white/40 hover:text-white/70'
                                                    }`}
                                                style={{
                                                    backgroundColor: isSelected ? `${themeAccentColor}20` : 'transparent',
                                                    borderWidth: isSelected ? 1 : 0,
                                                    borderColor: isSelected ? `${themeAccentColor}40` : 'transparent',
                                                }}
                                            >
                                                <span className="text-base font-bold">{preset.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleStart}
                                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                                    style={{
                                        backgroundColor: themeAccentColor,
                                        boxShadow: `0 8px 32px ${themeAccentColor}40`
                                    }}
                                >
                                    <PlayIcon className="w-5 h-5" />
                                    <span className="text-sm tracking-wide">התחל</span>
                                </button>
                            </motion.div>
                        ) : (
                            /* Active Controls */
                            <motion.div
                                key="controls"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="flex items-center justify-center gap-6"
                            >
                                {/* Pause/Resume Button */}
                                <button
                                    onClick={handleToggle}
                                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: themeAccentColor,
                                        boxShadow: `0 4px 24px ${themeAccentColor}50`
                                    }}
                                >
                                    {isPaused ? (
                                        <PlayIcon className="w-7 h-7 text-black ml-1" />
                                    ) : (
                                        <PauseIcon className="w-7 h-7 text-black" />
                                    )}
                                </button>

                                {/* Stop Button */}
                                <button
                                    onClick={handleStop}
                                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-95"
                                >
                                    <StopIcon className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FocusTimerWidget;
