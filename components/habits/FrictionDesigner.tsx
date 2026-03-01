import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, TrashIcon, AddIcon } from '../icons';

interface FrictionDesignerProps {
    methods?: string[];
    onChange: (methods: string[]) => void;
    habitTitle?: string;
}

const FRICTION_PRESETS = [
    { id: 'hide', label: 'להחביא', icon: '🙈', text: 'לשים במקום לא נגיש' },
    { id: 'delete', label: 'למחוק', icon: '📱', text: 'למחוק את האפליקציה' },
    { id: 'unplug', label: 'לנתק', icon: '🔌', text: 'לנתק מהחשמל אחרי שימוש' },
    { id: 'lock', label: 'לנעול', icon: '🔒', text: 'לשים במגירה נעולה' },
    { id: 'wait', label: 'להמתין', icon: '⏳', text: 'לחכות 10 דקות לפני' },
];

/**
 * Friction Designer - "Make it Difficult"
 * Part of Atomic Habits bad habit breaking strategy
 */
const FrictionDesigner: React.FC<FrictionDesignerProps> = ({
    methods = [],
    onChange,
    habitTitle = 'ההרגל הרע'
}) => {
    const [isExpanded, setIsExpanded] = useState(methods.length > 0);
    const [newMethod, setNewMethod] = useState('');

    const addMethod = (text: string) => {
        if (!text.trim() || methods.includes(text)) return;
        onChange([...methods, text]);
        setNewMethod('');
    };

    const removeMethod = (text: string) => {
        onChange(methods.filter(m => m !== text));
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/5 to-rose-500/5 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <LockIcon className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white tracking-tight">הגברת חיכוך</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-red-400/80 tracking-wider border border-red-500/20 px-1.5 py-0.5 rounded">Make it Difficult</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {methods.length > 0 && (
                        <span className="flex items-center justify-center w-6 h-6 bg-red-500/20 rounded-full text-xs font-bold text-red-300 border border-red-500/20">
                            {methods.length}
                        </span>
                    )}
                </div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 space-y-5">
                            <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/10 backdrop-blur-sm">
                                <p className="text-xs text-red-200/90 leading-relaxed">
                                    הוסף שלבים ומכשולים בינך לבין ב-{habitTitle}. ככל שיהיה קשה יותר לבצע את הפעולה, הסבירות שתבצע אותה תרד.
                                </p>
                            </div>

                            {/* Presets Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {FRICTION_PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => addMethod(preset.text)}
                                        className="flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 hover:border-white/10 rounded-xl transition-all group"
                                    >
                                        <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{preset.icon}</span>
                                        <span className="text-[10px] font-medium text-white/60 group-hover:text-white transition-colors">
                                            {preset.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                                <div className="relative flex gap-2">
                                    <input
                                        type="text"
                                        dir="rtl"
                                        value={newMethod}
                                        onChange={(e) => setNewMethod(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addMethod(newMethod)}
                                        placeholder="הוסף מכשול מותאם אישית..."
                                        className="flex-1 bg-black/40 text-white p-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/30 placeholder-white/20 text-sm transition-all shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addMethod(newMethod)}
                                        disabled={!newMethod.trim()}
                                        className="px-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white rounded-xl transition-all border border-white/5"
                                    >
                                        <AddIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* List */}
                            <AnimatePresence mode="popLayout">
                                {methods.length > 0 && (
                                    <motion.div className="space-y-2">
                                        {methods.map((method, index) => (
                                            <motion.div
                                                key={`${method}-${index}`}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center justify-between p-3.5 bg-gradient-to-r from-white/5 to-transparent border border-white/5 rounded-xl hover:border-red-500/20 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.6)] transition-all"></div>
                                                    <span className="text-sm text-white/90 font-medium">{method}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMethod(method)}
                                                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FrictionDesigner;
