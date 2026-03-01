import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreakingStrategy } from '../../types';
import { ShieldCheckIcon, ChevronDownIcon } from '../icons';

// Import sub-components
import TriggerTracker from './TriggerTracker';
import FrictionDesigner from './FrictionDesigner';
import SubstitutionSelector from './SubstitutionSelector';
import CommitmentDevice from './CommitmentDevice';

interface BadHabitBreakerProps {
    value?: BreakingStrategy;
    onChange: (strategy: BreakingStrategy | undefined) => void;
    habitTitle?: string;
}

/**
 * Bad Habit Breaker - Comprehensive system to break bad habits
 * Aggregates 4 sub-modules corresponding to inverting the 4 Laws of Behavior Change:
 * 1. Make it Invisible -> Trigger Tracker (Identify & remove cues)
 * 2. Make it Difficult -> Friction Designer (Increase steps)
 * 3. Make it Unsatisfying -> Commitment Device (Add cost)
 * 4. Replace Strategy -> Substitution Selector
 */
const BadHabitBreaker: React.FC<BadHabitBreakerProps> = ({
    value,
    onChange,
    habitTitle = 'ההרגל'
}) => {
    const [isExpanded, setIsExpanded] = useState(!!value);

    // Helper to ensure value exists before updating
    const updateStrategy = (updates: Partial<BreakingStrategy>) => {
        const current = value || {
            triggers: [],
            substitutionAction: '',
            frictionMethods: [],
        };
        onChange({ ...current, ...updates });
    };

    const handleToggle = () => {
        if (isExpanded && value) {
            // Don't clear data immediately on collapse, just hide.
            // But if user explicitly wants to remove strategy, they would need a clear button.
            // For now, toggle visibility.
            setIsExpanded(false);
        } else if (!isExpanded && !value) {
            // Initialize if empty
            onChange({
                triggers: [],
                substitutionAction: '',
                frictionMethods: [],
            });
            setIsExpanded(true);
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="space-y-4">
            {/* Main Header / Controller */}
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-rose-500/5 overflow-hidden">
                <button
                    type="button"
                    onClick={handleToggle}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                            <ShieldCheckIcon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="text-right">
                            <h4 className="font-bold text-white tracking-tight">Breaking Strategy</h4>
                            <p className="text-xs text-white/50">מערכת לשבירת הרגלים רעים</p>
                        </div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDownIcon className="w-5 h-5 text-white/40" />
                    </motion.div>
                </button>
            </div>

            {/* Expanded Modules */}
            <AnimatePresence>
                {isExpanded && value && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, staggerChildren: 0.1 }}
                        className="space-y-4 overflow-hidden"
                    >
                        {/* 1. Triggers (Make it Invisible) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <TriggerTracker
                                triggers={value.triggers}
                                onChange={(triggers) => updateStrategy({ triggers })}
                            />
                        </motion.div>

                        {/* 2. Friction (Make it Difficult) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <FrictionDesigner
                                methods={value.frictionMethods}
                                onChange={(methods) => updateStrategy({ frictionMethods: methods })}
                                habitTitle={habitTitle}
                            />
                        </motion.div>

                        {/* 3. Substitution (Replacement) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <SubstitutionSelector
                                currentAction={habitTitle}
                                substitution={value.substitutionAction}
                                onChange={(action) => updateStrategy({ substitutionAction: action })}
                            />
                        </motion.div>

                        {/* 4. Commitment (Make it Unsatisfying) */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <CommitmentDevice
                                device={value.commitmentDevice}
                                supportPerson={value.supportPerson}
                                onChange={(device, person) => updateStrategy({ commitmentDevice: device, supportPerson: person })}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BadHabitBreaker;
