import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TwoMinuteStarter } from '../../types';
import { ClockIcon, ChevronDownIcon, LockIcon, CheckCircleIcon } from '../icons';

interface TwoMinuteRuleWizardProps {
    value?: TwoMinuteStarter;
    onChange: (starter: TwoMinuteStarter | undefined) => void;
    habitTitle?: string;
}

const PHASE_LABELS = {
    micro: { label: 'מיקרו', duration: '2 דקות', description: 'התחלה קטנטנה' },
    growing: { label: 'גדל', duration: '10-15 דקות', description: 'מרחיבים בהדרגה' },
    full: { label: 'מלא', duration: 'הזמן המלא', description: 'ההרגל השלם' },
};

/**
 * Two-Minute Rule Wizard - כלל שתי הדקות
 * Based on Atomic Habits: "When you start a new habit, it should take less than two minutes"
 */
const TwoMinuteRuleWizard: React.FC<TwoMinuteRuleWizardProps> = ({
    value,
    onChange,
    habitTitle = 'ההרגל',
}) => {
    const [isExpanded, setIsExpanded] = React.useState(!!value?.microVersion);

    const handleToggle = () => {
        if (isExpanded && value) {
            onChange(undefined);
        }
        setIsExpanded(!isExpanded);
    };

    const handleMicroChange = (micro: string) => {
        onChange({
            microVersion: micro,
            fullVersion: value?.fullVersion || habitTitle,
            currentPhase: value?.currentPhase || 'micro',
            phaseCompletions: value?.phaseCompletions || 0,
            graduationThreshold: value?.graduationThreshold || 7,
        });
    };

    const handleFullChange = (full: string) => {
        if (!value) return;
        onChange({
            ...value,
            fullVersion: full,
        });
    };

    const getPhaseProgress = () => {
        if (!value) return 0;
        return Math.min((value.phaseCompletions / value.graduationThreshold) * 100, 100);
    };

    const phases: Array<'micro' | 'growing' | 'full'> = ['micro', 'growing', 'full'];
    const currentPhaseIndex = value ? phases.indexOf(value.currentPhase) : 0;

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 overflow-hidden">
            {/* Header - Toggle */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20">
                        <ClockIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">Two-Minute Rule</h4>
                        <p className="text-xs text-white/50">התחל קטן, גדל בהדרגה</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDownIcon className="w-5 h-5 text-white/40" />
                </motion.div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4">
                            {/* Micro Version Input */}
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">
                                    גרסת 2 דקות (התחלה)
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={value?.microVersion || ''}
                                    onChange={(e) => handleMicroChange(e.target.value)}
                                    placeholder="לפתוח את הספר..."
                                    className="w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 placeholder-white/30 transition-all"
                                />
                            </div>

                            {/* Full Version Input */}
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">
                                    הגרסה המלאה (יעד)
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={value?.fullVersion || ''}
                                    onChange={(e) => handleFullChange(e.target.value)}
                                    placeholder="לקרוא 30 דקות..."
                                    className="w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 placeholder-white/30 transition-all"
                                />
                            </div>

                            {/* Phase Progress Visualization */}
                            {value?.microVersion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider">
                                        התקדמות
                                    </p>

                                    {/* Phase Cards */}
                                    <div className="space-y-2">
                                        {phases.map((phase, index) => {
                                            const isActive = value.currentPhase === phase;
                                            const isCompleted = index < currentPhaseIndex;
                                            const isLocked = index > currentPhaseIndex;
                                            const phaseInfo = PHASE_LABELS[phase];

                                            return (
                                                <div
                                                    key={phase}
                                                    className={`p-3 rounded-xl border transition-all ${isActive
                                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                                            : isCompleted
                                                                ? 'bg-white/5 border-emerald-500/20'
                                                                : 'bg-black/20 border-white/5 opacity-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                                                    ? 'bg-emerald-500'
                                                                    : isActive
                                                                        ? 'bg-emerald-500/30 border-2 border-emerald-500'
                                                                        : 'bg-white/10'
                                                                }`}>
                                                                {isCompleted ? (
                                                                    <CheckCircleIcon className="w-5 h-5 text-white" />
                                                                ) : isLocked ? (
                                                                    <LockIcon className="w-4 h-4 text-white/40" />
                                                                ) : (
                                                                    <span className="text-sm font-bold text-white">{index + 1}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white">{phaseInfo.label}</p>
                                                                <p className="text-xs text-white/50">{phaseInfo.description}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-white/40">{phaseInfo.duration}</span>
                                                    </div>

                                                    {/* Progress bar for active phase */}
                                                    {isActive && (
                                                        <div className="mt-3">
                                                            <div className="flex justify-between text-xs text-white/40 mb-1">
                                                                <span>{value.phaseCompletions}/{value.graduationThreshold} השלמות</span>
                                                                <span>{Math.round(getPhaseProgress())}%</span>
                                                            </div>
                                                            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${getPhaseProgress()}%` }}
                                                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Quick Examples */}
                            <div className="space-y-2">
                                <p className="text-xs text-white/40">דוגמאות לגרסת 2 דקות:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        '📖 לפתוח ספר',
                                        '🧘 לשבת על המזרן',
                                        '👟 ללבוש נעלי ספורט',
                                        '✍️ לכתוב משפט אחד',
                                    ].map((example) => (
                                        <button
                                            key={example}
                                            type="button"
                                            onClick={() => handleMicroChange(example)}
                                            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TwoMinuteRuleWizard;
