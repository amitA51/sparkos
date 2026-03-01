import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshIcon, SparklesIcon, ChevronDownIcon } from '../icons';

interface SubstitutionSelectorProps {
    currentAction?: string; // e.g., "Drinking soda" (implied from title)
    substitution?: string;
    onChange: (substitution: string) => void;
}

const SUBSTITUTION_IDEAS = [
    { category: 'Health', items: ['שתיית מים עם לימון', 'הליכה קצרה בחוץ', 'ביצוע 5 נשימות עמוקות'] },
    { category: 'Creativity', items: ['כתיבת רעיון במחברת', 'שרבוט מהיר', 'קריאת עמוד אחד'] },
    { category: 'Productivity', items: ['סידור שולחן העבודה', 'מעבר על רשימת המשימות', 'מחיקת מייל אחד לא רצוי'] },
];

/**
 * Substitution Selector - "Make it Unsatisfying" (by replacing with satisfying alternative)
 * Implements strict type checking and premium UI
 */
const SubstitutionSelector: React.FC<SubstitutionSelectorProps> = ({
    currentAction = 'ההרגל הרע',
    substitution,
    onChange
}) => {
    const [isExpanded, setIsExpanded] = useState(!!substitution);

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <RefreshIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white tracking-tight">התנהגות חלופית</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider border border-emerald-500/20 px-1.5 py-0.5 rounded">Substitution</span>
                        </div>
                    </div>
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
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 space-y-6">
                            {/* Logic Visualization */}
                            <div className="flex items-center justify-between gap-2 text-sm">
                                <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5 text-center text-white/60 line-through decoration-red-400/50">
                                    {currentAction}
                                </div>
                                <div className="text-emerald-400 font-bold px-1">➜</div>
                                <div className={`flex-1 p-3 rounded-xl border text-center transition-all ${substitution ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-medium' : 'bg-transparent border-dashed border-white/10 text-white/30'}`}>
                                    {substitution || '?'}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="space-y-3">
                                <label className="text-xs text-white/40 font-medium block">
                                    במקום זאת, אני אעשה...
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={substitution || ''}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="הגדר פעולה חיובית..."
                                    className="w-full bg-black/40 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-lg font-medium shadow-inner"
                                />
                            </div>

                            {/* Ideas Carousel */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <SparklesIcon className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs font-bold text-white/40 uppercase tracking-wider">רעיונות להחלפה</span>
                                </div>

                                <div className="space-y-2">
                                    {SUBSTITUTION_IDEAS.map((cat) => (
                                        <div key={cat.category} className="space-y-1">
                                            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none mask-image-linear-to-r">
                                                {cat.items.map((item) => (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() => onChange(item)}
                                                        className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-200 hover:border-emerald-500/20 border border-white/5 rounded-full text-xs text-white/60 transition-all active:scale-95"
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
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

export default SubstitutionSelector;
