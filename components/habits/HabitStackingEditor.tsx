import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitStackConfig, PersonalItem } from '../../types';
import { LinkIcon, ChevronDownIcon, FlameIcon } from '../icons';

interface HabitStackingEditorProps {
    value?: HabitStackConfig;
    onChange: (config: HabitStackConfig | undefined) => void;
    availableHabits: PersonalItem[];
    currentHabitTitle?: string;
}

/**
 * Habit Stacking Editor - צימוד הרגלים
 * Based on James Clear's Atomic Habits: "After I [CURRENT HABIT], I will [NEW HABIT]"
 */
const HabitStackingEditor: React.FC<HabitStackingEditorProps> = ({
    value,
    onChange,
    availableHabits,
    currentHabitTitle = 'ההרגל החדש',
}) => {
    const [isExpanded, setIsExpanded] = React.useState(!!value?.anchorHabitId);

    // Filter out current habit and get only good habits
    const habitOptions = useMemo(() =>
        availableHabits.filter(h => h.type === 'habit' && h.habitType !== 'bad'),
        [availableHabits]
    );

    const selectedAnchor = useMemo(() =>
        habitOptions.find(h => h.id === value?.anchorHabitId),
        [habitOptions, value?.anchorHabitId]
    );

    // Generate formula preview
    const formulaPreview = useMemo(() => {
        if (!selectedAnchor || !value) return null;
        const anchorTitle = selectedAnchor.title || 'הרגל עוגן';

        if (value.stackPosition === 'before') {
            return `לפני ש${anchorTitle}, ${currentHabitTitle}`;
        }
        return `אחרי ש${anchorTitle}, ${currentHabitTitle}`;
    }, [selectedAnchor, value, currentHabitTitle]);

    const handleToggle = () => {
        if (isExpanded && value) {
            onChange(undefined); // Clear config when collapsing
        }
        setIsExpanded(!isExpanded);
    };

    const handleAnchorChange = (habitId: string) => {
        onChange({
            anchorHabitId: habitId,
            stackPosition: value?.stackPosition || 'after',
            formula: formulaPreview || undefined,
        });
    };

    const handlePositionChange = (position: 'before' | 'after') => {
        if (!value?.anchorHabitId) return;
        onChange({
            ...value,
            stackPosition: position,
        });
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 overflow-hidden">
            {/* Header - Toggle */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                        <LinkIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">Habit Stacking</h4>
                        <p className="text-xs text-white/50">קשור להרגל קיים</p>
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
                            {/* Anchor Habit Selector */}
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">
                                    הרגל עוגן
                                </label>
                                <div className="relative">
                                    <select
                                        value={value?.anchorHabitId || ''}
                                        onChange={(e) => handleAnchorChange(e.target.value)}
                                        className="w-full bg-black/30 text-white p-4 pr-12 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 appearance-none transition-all"
                                    >
                                        <option value="" disabled>בחר הרגל קיים...</option>
                                        {habitOptions.map((habit) => (
                                            <option key={habit.id} value={habit.id}>
                                                {habit.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <FlameIcon className="w-5 h-5 text-white/30" />
                                    </div>
                                </div>
                                {habitOptions.length === 0 && (
                                    <p className="text-xs text-amber-400/80 mt-2">
                                        💡 צור קודם הרגל טוב אחד כדי לצמד אליו
                                    </p>
                                )}
                            </div>

                            {/* Position Toggle */}
                            {value?.anchorHabitId && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">
                                        מיקום
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => handlePositionChange('before')}
                                            className={`py-3 rounded-lg text-sm font-medium transition-all ${value.stackPosition === 'before'
                                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            לפני
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePositionChange('after')}
                                            className={`py-3 rounded-lg text-sm font-medium transition-all ${value.stackPosition === 'after'
                                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            אחרי
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Formula Preview */}
                            {formulaPreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
                                >
                                    <p className="text-xs text-indigo-300 mb-1">תצוגה מקדימה:</p>
                                    <p className="text-white font-medium text-lg leading-relaxed" dir="rtl">
                                        "{formulaPreview}"
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HabitStackingEditor;
