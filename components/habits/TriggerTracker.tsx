import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitTrigger } from '../../types';
import { ChevronDownIcon, EyeIcon, TrashIcon, AddIcon } from '../icons';

interface TriggerTrackerProps {
    triggers?: HabitTrigger[];
    onChange: (triggers: HabitTrigger[]) => void;
}

const TRIGGER_CATEGORIES = [
    { id: 'emotional', label: 'רגשי', icon: '😔', examples: ['לחץ', 'שעמום', 'עצבות'] },
    { id: 'situational', label: 'מצבי', icon: '📍', examples: ['בבית', 'בעבודה', 'אחרי ארוחה'] },
    { id: 'social', label: 'חברתי', icon: '👥', examples: ['עם חברים', 'לבד', 'במסיבה'] },
    { id: 'time', label: 'זמן', icon: '🕐', examples: ['בוקר', 'ערב', 'סוף שבוע'] },
    { id: 'preceding', label: 'פעולה קודמת', icon: '⏮️', examples: ['אחרי קפה', 'אחרי אוכל'] },
] as const;

/**
 * Trigger Tracker - Log and analyze urge triggers
 * Based on Atomic Habits: "Make it Invisible" - identify cues to avoid
 */
const TriggerTracker: React.FC<TriggerTrackerProps> = ({ triggers = [], onChange }) => {
    const [isExpanded, setIsExpanded] = React.useState(triggers.length > 0);
    const [newTrigger, setNewTrigger] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState<HabitTrigger['category']>('emotional');
    const [intensity, setIntensity] = React.useState<1 | 2 | 3 | 4 | 5>(3);

    const addTrigger = () => {
        if (!newTrigger.trim()) return;

        const trigger: HabitTrigger = {
            id: `trigger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            category: selectedCategory,
            description: newTrigger.trim(),
            intensity,
            occurrenceCount: 0,
        };

        onChange([...triggers, trigger]);
        setNewTrigger('');
    };

    const removeTrigger = (id: string) => {
        onChange(triggers.filter(t => t.id !== id));
    };

    const incrementOccurrence = (id: string) => {
        onChange(triggers.map(t =>
            t.id === id ? { ...t, occurrenceCount: t.occurrenceCount + 1 } : t
        ));
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/5 to-red-500/5 overflow-hidden">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-500/20">
                        <EyeIcon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">מעקב טריגרים</h4>
                        <p className="text-xs text-white/50">זהה מה גורם לדחף</p>
                    </div>
                    {triggers.length > 0 && (
                        <span className="px-2 py-0.5 bg-orange-500/20 rounded-full text-xs text-orange-300">
                            {triggers.length}
                        </span>
                    )}
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className="w-5 h-5 text-white/40" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4">
                            {/* Category Selector */}
                            <div className="flex flex-wrap gap-2">
                                {TRIGGER_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id as HabitTrigger['category'])}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id
                                                ? 'bg-orange-500/30 text-orange-200 border border-orange-500/50'
                                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Intensity Slider */}
                            <div>
                                <label className="text-xs text-white/40 mb-2 block">עוצמת הדחף: {intensity}/5</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={5}
                                    value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                                    className="w-full accent-orange-500"
                                />
                            </div>

                            {/* Add Trigger */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={newTrigger}
                                    onChange={(e) => setNewTrigger(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTrigger()}
                                    placeholder="תאר את הטריגר..."
                                    className="flex-1 bg-black/30 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-orange-500/50 placeholder-white/30 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addTrigger}
                                    disabled={!newTrigger.trim()}
                                    className="px-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-xl disabled:opacity-50"
                                >
                                    <AddIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Triggers List */}
                            {triggers.length > 0 && (
                                <div className="space-y-2">
                                    {triggers.map((trigger) => (
                                        <div
                                            key={trigger.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{TRIGGER_CATEGORIES.find(c => c.id === trigger.category)?.icon}</span>
                                                <span className="text-white text-sm">{trigger.description}</span>
                                                <span className="text-xs text-orange-300">({trigger.intensity}/5)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => incrementOccurrence(trigger.id)}
                                                    className="px-2 py-1 text-xs bg-white/10 rounded text-white/70 hover:bg-white/20"
                                                >
                                                    +{trigger.occurrenceCount}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTrigger(trigger.id)}
                                                    className="p-1 text-white/30 hover:text-red-400"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TriggerTracker;
