import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvironmentCue } from '../../types';
import { ChevronDownIcon, EyeIcon, TrashIcon, AddIcon } from '../icons';

interface EnvironmentDesignerProps {
    value?: EnvironmentCue[];
    onChange: (cues: EnvironmentCue[] | undefined) => void;
}

const CUE_TYPES = [
    { id: 'visual', label: 'ויזואלי', icon: '👁️', examples: ['להשאיר ספר על השולחן', 'לשים נעלי ספורט ליד הדלת'] },
    { id: 'location', label: 'מיקום', icon: '📍', examples: ['לארגן פינת מדיטציה', 'להכין שולחן עבודה נקי'] },
    { id: 'tool', label: 'כלי', icon: '🔧', examples: ['להכין מחברת פתוחה', 'להכין בגדי אימון מוכנים'] },
    { id: 'digital', label: 'דיגיטלי', icon: '📱', examples: ['להגדיר תזכורת', 'לשים אייקון במקום בולט'] },
] as const;

/**
 * Environment Designer - Visual Cues Setup
 * Based on Atomic Habits: "Make it Obvious"
 * Design your environment to make good habits easier
 */
const EnvironmentDesigner: React.FC<EnvironmentDesignerProps> = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = React.useState(!!value?.length);
    const [newCue, setNewCue] = React.useState('');
    const [selectedType, setSelectedType] = React.useState<EnvironmentCue['type']>('visual');

    const handleToggle = () => {
        if (isExpanded && value?.length) {
            onChange(undefined);
        }
        setIsExpanded(!isExpanded);
    };

    const addCue = () => {
        if (!newCue.trim()) return;

        const cue: EnvironmentCue = {
            id: `cue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: selectedType,
            description: newCue.trim(),
            location: '',
            isActive: true,
        };

        onChange([...(value || []), cue]);
        setNewCue('');
    };

    const removeCue = (id: string) => {
        if (!value) return;
        const updated = value.filter(c => c.id !== id);
        onChange(updated.length ? updated : undefined);
    };

    const toggleCue = (id: string) => {
        if (!value) return;
        onChange(value.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20">
                        <EyeIcon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">Environment Design</h4>
                        <p className="text-xs text-white/50">עיצוב הסביבה שלך</p>
                    </div>
                    {value?.length ? (
                        <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs text-cyan-300">
                            {value.length}
                        </span>
                    ) : null}
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className="w-5 h-5 text-white/40" />
                </motion.div>
            </button>

            {/* Content */}
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
                            {/* Explanation */}
                            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                <p className="text-xs text-cyan-200/80 leading-relaxed">
                                    <strong>עקרון "הפוך את זה לברור":</strong> עצב את הסביבה שלך כך שהרמזים
                                    להרגלים הטובים יהיו גלויים ונגישים.
                                </p>
                            </div>

                            {/* Type Selector */}
                            <div className="flex flex-wrap gap-2">
                                {CUE_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setSelectedType(type.id as EnvironmentCue['type'])}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedType === type.id
                                                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                                                : 'bg-white/5 text-white/50 hover:bg-white/10'
                                            }`}
                                    >
                                        {type.icon} {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Add Cue Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={newCue}
                                    onChange={(e) => setNewCue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCue()}
                                    placeholder="הוסף רמז סביבתי..."
                                    className="flex-1 bg-black/30 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/50 placeholder-white/30 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addCue}
                                    disabled={!newCue.trim()}
                                    className="px-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl disabled:opacity-50 transition-colors"
                                >
                                    <AddIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Quick Examples */}
                            {!value?.length && (
                                <div className="space-y-2">
                                    <p className="text-xs text-white/40">דוגמאות מהירות:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {CUE_TYPES.find(t => t.id === selectedType)?.examples.map((ex) => (
                                            <button
                                                key={ex}
                                                type="button"
                                                onClick={() => {
                                                    setNewCue(ex);
                                                }}
                                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                                            >
                                                {ex}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing Cues */}
                            {value && value.length > 0 && (
                                <div className="space-y-2">
                                    {value.map((cue) => (
                                        <div
                                            key={cue.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${cue.isActive
                                                    ? 'bg-cyan-500/10 border-cyan-500/20'
                                                    : 'bg-black/20 border-white/5 opacity-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">
                                                    {CUE_TYPES.find(t => t.id === cue.type)?.icon || '📌'}
                                                </span>
                                                <span className="text-white text-sm">{cue.description}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCue(cue.id)}
                                                    className={`w-8 h-5 rounded-full transition-colors ${cue.isActive ? 'bg-cyan-500' : 'bg-white/10'
                                                        }`}
                                                >
                                                    <span
                                                        className={`block w-4 h-4 rounded-full bg-white transition-transform ${cue.isActive ? 'translate-x-3.5' : 'translate-x-0.5'
                                                            }`}
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCue(cue.id)}
                                                    className="p-1 text-white/30 hover:text-red-400 transition-colors"
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

export default EnvironmentDesigner;
