import React, { useState } from 'react';
import { ClockIcon } from '../icons';

interface QuickRestPresetsProps {
    onSelectDuration: (seconds: number) => void;
    currentRestTime?: number;
    onClose?: () => void;
}

const PRESET_DURATIONS = [
    { seconds: 30, label: '30s', emoji: '⚡' },
    { seconds: 60, label: '1:00', emoji: '🔋' },
    { seconds: 90, label: '1:30', emoji: '💪' },
    { seconds: 120, label: '2:00', emoji: '🏋️' },
    { seconds: 180, label: '3:00', emoji: '🧘' },
];

/**
 * QuickRestPresets - Quick buttons for selecting rest timer duration
 * Features premium styling with CSS transitions for better performance
 */
const QuickRestPresets: React.FC<QuickRestPresetsProps> = ({
    onSelectDuration,
    currentRestTime = 90,
    onClose,
}) => {
    const [customTime, setCustomTime] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const handleCustomSubmit = () => {
        const seconds = parseInt(customTime, 10);
        if (!isNaN(seconds) && seconds > 0 && seconds <= 600) {
            onSelectDuration(seconds);
            setShowCustom(false);
            setCustomTime('');
        }
    };

    return (
        <div className="space-y-4">
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
                {PRESET_DURATIONS.map((preset) => {
                    const isSelected = currentRestTime === preset.seconds;
                    return (
                        <button
                            key={preset.seconds}
                            onClick={() => onSelectDuration(preset.seconds)}
                            className={`relative px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 hover:scale-105 active:scale-95 ${isSelected
                                ? 'bg-gradient-to-br from-[var(--cosmos-accent-primary)] to-[var(--cosmos-accent-cyan)] text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-lg">{preset.emoji}</span>
                                <span>{preset.label}</span>
                            </span>
                            {isSelected && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Custom Time Input */}
            {showCustom ? (
                <div className="flex gap-2 justify-center animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                        type="number"
                        value={customTime}
                        onChange={e => setCustomTime(e.target.value)}
                        placeholder="שניות (10-600)"
                        min="10"
                        max="600"
                        className="w-32 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center text-white placeholder-white/30 focus:border-[var(--cosmos-accent-primary)] outline-none"
                        autoFocus
                    />
                    <button
                        onClick={handleCustomSubmit}
                        className="px-4 py-2 rounded-xl bg-[var(--cosmos-accent-primary)] text-white font-bold transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                        אישור
                    </button>
                    <button
                        onClick={() => setShowCustom(false)}
                        className="px-4 py-2 rounded-xl bg-white/5 text-white/60 transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                        ביטול
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowCustom(true)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.03] border border-dashed border-white/10 text-white/40 text-sm hover:text-white/60 hover:border-white/20 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <ClockIcon className="w-4 h-4" />
                    זמן מותאם אישית
                </button>
            )}

            {/* Close Button (if provided) */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                >
                    סגור
                </button>
            )}
        </div>
    );
};

export default React.memo(QuickRestPresets);
