import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemptationBundle } from '../../types';
import { HeartIcon, ChevronDownIcon } from '../icons';

interface TemptationBundleEditorProps {
    value?: TemptationBundle;
    onChange: (bundle: TemptationBundle | undefined) => void;
    habitTitle?: string;
}

/**
 * Temptation Bundling Editor - צימוד פיתויים
 * Based on Atomic Habits: Pair what you NEED to do with what you WANT to do
 * "Only while doing [NEED], I will allow myself [WANT]"
 */
const TemptationBundleEditor: React.FC<TemptationBundleEditorProps> = ({
    value,
    onChange,
    habitTitle = 'ההרגל',
}) => {
    const [isExpanded, setIsExpanded] = React.useState(!!value?.wantActivity);

    // Generate formula preview
    const formulaPreview = React.useMemo(() => {
        if (!value?.wantActivity) return null;
        return `רק בזמן ש${habitTitle}, ${value.wantActivity}`;
    }, [value?.wantActivity, habitTitle]);

    const handleToggle = () => {
        if (isExpanded && value) {
            onChange(undefined);
        }
        setIsExpanded(!isExpanded);
    };

    const handleWantChange = (want: string) => {
        onChange({
            wantActivity: want,
            formula: formulaPreview || undefined,
        });
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/5 to-orange-500/5 overflow-hidden">
            {/* Header - Toggle */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20">
                        <HeartIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">Temptation Bundling</h4>
                        <p className="text-xs text-white/50">חבר עם משהו שאתה רוצה</p>
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
                            {/* Explanation */}
                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <span className="text-amber-400 text-lg">✨</span>
                                <p className="text-xs text-amber-200/80 leading-relaxed">
                                    חבר את ההרגל עם פעילות שאתה נהנה ממנה.
                                    למשל: "רק בזמן הליכה, אשמע פודקאסטים"
                                </p>
                            </div>

                            {/* Want Activity Input */}
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">
                                    רק בזמן ההרגל, אאפשר לעצמי...
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={value?.wantActivity || ''}
                                    onChange={(e) => handleWantChange(e.target.value)}
                                    placeholder="לשמוע את הפודקאסט האהוב..."
                                    className="w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 placeholder-white/30 transition-all"
                                />
                            </div>

                            {/* Formula Preview */}
                            {formulaPreview && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20"
                                >
                                    <p className="text-xs text-amber-300 mb-1">הנוסחה שלך:</p>
                                    <p className="text-white font-medium text-lg leading-relaxed" dir="rtl">
                                        "{formulaPreview}"
                                    </p>
                                </motion.div>
                            )}

                            {/* Examples */}
                            <div className="space-y-2">
                                <p className="text-xs text-white/40">דוגמאות:</p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        '🎧 לשמוע מוזיקה',
                                        '📺 לצפות בסדרה',
                                        '☕ לשתות קפה מיוחד',
                                        '🍫 לאכול חטיף',
                                    ].map((example) => (
                                        <button
                                            key={example}
                                            type="button"
                                            onClick={() => handleWantChange(example)}
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

export default TemptationBundleEditor;
