import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HabitIdentity } from '../../types';
import { ChevronDownIcon, UserIcon } from '../icons';

interface HabitIdentitySectionProps {
    value?: HabitIdentity;
    onChange: (identity: HabitIdentity | undefined) => void;
    habitTitle?: string;
}

const IDENTITY_TEMPLATES = [
    { prefix: 'אני אדם', suffix: 'שדואג לבריאותו' },
    { prefix: 'אני', suffix: 'קורא' },
    { prefix: 'אני אדם', suffix: 'שממחזר' },
    { prefix: 'אני', suffix: 'לומד לכל החיים' },
    { prefix: 'אני אדם', suffix: 'שמתעמל' },
    { prefix: 'אני', suffix: 'יוצר' },
];

/**
 * Habit Identity Section - Identity-Based Habits
 * Based on Atomic Habits: "The key is to become the type of person who..."
 * Focus on WHO you want to become, not WHAT you want to achieve
 */
const HabitIdentitySection: React.FC<HabitIdentitySectionProps> = ({
    value,
    onChange,
    habitTitle,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(!!value?.statement);

    const handleToggle = () => {
        if (isExpanded && value) {
            onChange(undefined);
        } else if (!value) {
            onChange({
                id: `identity-${Date.now()}`,
                statement: '',
                createdAt: new Date().toISOString(),
                reinforcements: 0,
            });
        }
        setIsExpanded(!isExpanded);
    };

    const handleStatementChange = (statement: string) => {
        if (!value) return;
        onChange({
            ...value,
            statement,
        });
    };

    const applyTemplate = (template: typeof IDENTITY_TEMPLATES[0]) => {
        const statement = `${template.prefix} ${template.suffix}`;
        if (!value) {
            onChange({
                id: `identity-${Date.now()}`,
                statement,
                createdAt: new Date().toISOString(),
                reinforcements: 0,
            });
        } else {
            onChange({ ...value, statement });
        }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-purple-500/5 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-500/20">
                        <UserIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white">Identity Statement</h4>
                        <p className="text-xs text-white/50">מי אתה רוצה להיות?</p>
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
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4">
                            {/* Explanation */}
                            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                                <p className="text-xs text-violet-200/80 leading-relaxed">
                                    <strong>הרגלים מבוססי זהות:</strong> במקום "אני רוצה לקרוא יותר",
                                    אמור "אני קורא". הזהות מנחה את ההתנהגות.
                                </p>
                            </div>

                            {/* Identity Input */}
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block">
                                    הזהות שלי
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={value?.statement || ''}
                                    onChange={(e) => handleStatementChange(e.target.value)}
                                    placeholder="אני אדם ש..."
                                    className="w-full bg-black/30 text-white text-lg font-medium p-4 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder-white/30 transition-all"
                                />
                            </div>

                            {/* Preview */}
                            {value?.statement && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/30"
                                >
                                    <p className="text-center text-xl font-bold text-white">
                                        "{value.statement}"
                                    </p>
                                    <p className="text-center text-xs text-violet-300 mt-2">
                                        כאשר תבצע את ההרגל, אמור את זה לעצמך
                                    </p>
                                </motion.div>
                            )}

                            {/* Quick Templates */}
                            <div className="space-y-2">
                                <p className="text-xs text-white/40">דוגמאות לזהויות:</p>
                                <div className="flex flex-wrap gap-2">
                                    {IDENTITY_TEMPLATES.map((template, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => applyTemplate(template)}
                                            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-violet-500/20 rounded-full text-white/60 hover:text-violet-200 transition-colors"
                                        >
                                            {template.prefix} {template.suffix}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reinforcement Counter */}
                            {value?.reinforcements !== undefined && value.reinforcements > 0 && (
                                <div className="flex items-center justify-center gap-2 p-2 bg-white/5 rounded-lg">
                                    <span className="text-xs text-white/40">חיזוקים:</span>
                                    <span className="text-sm font-bold text-violet-400">{value.reinforcements}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HabitIdentitySection;
