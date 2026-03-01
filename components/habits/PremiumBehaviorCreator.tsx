/**
 * PremiumBehaviorCreator - Ultra Premium Habit Creation UI
 * 
 * Based on Atomic Habits (James Clear), Tiny Habits (BJ Fogg), 
 * The Power of Habit (Charles Duhigg), and behavioral science research.
 * 
 * Two modes: Build Habit (good) / Quit Habit (bad)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlameIcon,
    ShieldCheckIcon,
    SparklesIcon,
    LinkIcon,
    ClockIcon,
    TargetIcon,
    LightbulbIcon,
    BanIcon,
    CheckCircleIcon,
} from '../icons';
import { useData } from '../../src/contexts/DataContext';
import { PersonalItem } from '../../types';

// --- Types ---
type HabitMode = 'build' | 'quit';

interface FormState {
    title: string;
    content: string;
    habitType: 'good' | 'bad';
    habitStack?: { anchorHabitId: string; stackPosition: 'before' | 'after' };
    temptationBundle?: { wantActivity: string; needActivity: string };
    twoMinuteStarter?: { microVersion: string; currentPhase: 'micro' | 'growing' | 'full' };
    habitIdentity?: { statement: string };
    environmentCues?: { visible: string[]; invisible: string[] };
    breakingStrategy?: { triggers: string[]; substitutionAction: string; frictionMethods: string[] };
    reminderEnabled?: boolean;
    reminderTime?: string;
    antiGoalData?: {
        motivation?: string;
        reward?: string;
        dailyCheckIn?: boolean;
        triggers?: string[];
        alternativeActions?: string[];
    };
    // New fields for enhanced Atomic Habits
    cueDetails?: { when: string; where: string; after: string };
    cravingReason?: string;
    responseDetails?: { duration: string; difficulty: 'easy' | 'medium' | 'hard' };
    rewardType?: string;
    commitmentDevice?: string;
    accountabilityPartner?: string;
    implementationIntention?: string;
}

interface PremiumBehaviorCreatorProps {
    formState: FormState;
    dispatch: React.Dispatch<{ type: string; payload: { field: string; value: any } }>;
}

// --- Mode Card Data ---
const modeData = {
    build: {
        icon: FlameIcon,
        title: 'בניית הרגל',
        subtitle: 'Make it obvious, attractive, easy & satisfying',
        color: '#10B981',
        gradient: 'from-emerald-500 to-teal-500',
        bgGlow: 'rgba(16, 185, 129, 0.4)',
        emoji: '🔥',
    },
    quit: {
        icon: ShieldCheckIcon,
        title: 'גמילה מהרגל',
        subtitle: 'Make it invisible, unattractive, hard & unsatisfying',
        color: '#EF4444',
        gradient: 'from-red-500 to-rose-500',
        bgGlow: 'rgba(239, 68, 68, 0.4)',
        emoji: '🛡️',
    },
};

// --- 4 Laws Badge Component ---
const LawBadge: React.FC<{ number: number; title: string; isActive: boolean; color: string }> = ({
    number, title, isActive, color
}) => (
    <div className={`
    flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all
    ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-white/30'}
  `}>
        <span
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
            style={{ backgroundColor: isActive ? color : 'rgba(255,255,255,0.1)' }}
        >
            {number}
        </span>
        {title}
    </div>
);

// --- Premium Mode Selector Card ---
const ModeCard: React.FC<{
    mode: HabitMode;
    isSelected: boolean;
    onSelect: () => void;
}> = ({ mode, isSelected, onSelect }) => {
    const data = modeData[mode];
    const Icon = data.icon;

    return (
        <motion.button
            type="button"
            onClick={onSelect}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative flex-1 p-6 rounded-[28px] overflow-hidden
        transition-all duration-500 ease-out
        ${isSelected
                    ? `bg-gradient-to-br ${data.gradient} shadow-2xl`
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/10'
                }
      `}
        >
            {/* Glassmorphism overlay */}
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            )}

            {/* Animated glow */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute -inset-20 blur-3xl animate-pulse"
                            style={{ backgroundColor: data.bgGlow }}
                        />
                        {/* Floating particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                                initial={{ opacity: 0, scale: 0, y: 0 }}
                                animate={{
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1, 0],
                                    y: [-20, -60],
                                    x: Math.sin(i) * 30,
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: 'easeOut',
                                }}
                                style={{
                                    bottom: '20%',
                                    left: `${30 + i * 10}%`,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                {/* Animated Icon Container */}
                <motion.div
                    className={`
            w-20 h-20 rounded-[20px] flex items-center justify-center relative
            ${isSelected ? 'bg-white/20' : 'bg-white/5'}
          `}
                    animate={isSelected ? {
                        boxShadow: ['0 0 0px rgba(255,255,255,0.2)', '0 0 30px rgba(255,255,255,0.3)', '0 0 0px rgba(255,255,255,0.2)'],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-3xl absolute -top-1 -right-1">{data.emoji}</span>
                    <Icon
                        className={`w-10 h-10 ${isSelected ? 'text-white' : 'text-white/40'}`}
                    />
                </motion.div>

                <div>
                    <h3 className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-white/60'}`}>
                        {data.title}
                    </h3>
                    <p className={`text-xs mt-2 font-medium tracking-wide ${isSelected ? 'text-white/70' : 'text-white/30'}`}>
                        {data.subtitle}
                    </p>
                </div>

                {/* Selection ring */}
                <motion.div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isSelected ? 'bg-white' : 'border-2 border-white/20'}
          `}
                    animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                        >
                            <CheckCircleIcon className="w-5 h-5" style={{ color: data.color }} />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.button>
    );
};

// --- Atomic Tool Card (Expandable) ---
const AtomicToolCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    lawNumber?: number;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    color: string;
    tip?: string;
}> = ({ icon, title, description, lawNumber, isOpen, onToggle, children, color, tip }) => (
    <motion.div
        layout
        className={`
      rounded-2xl overflow-hidden border transition-all duration-300
      ${isOpen
                ? 'bg-white/[0.05] border-white/20 shadow-lg'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
            }
    `}
    >
        <button
            type="button"
            onClick={onToggle}
            className="w-full p-4 flex items-center gap-4 text-right"
        >
            <div
                className={`
          w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all
          ${isOpen ? 'shadow-lg' : ''}
        `}
                style={{ backgroundColor: isOpen ? `${color}25` : 'rgba(255,255,255,0.05)' }}
            >
                <span style={{ color: isOpen ? color : 'rgba(255,255,255,0.4)' }}>
                    {icon}
                </span>
            </div>
            <div className="flex-1 text-right">
                <div className="flex items-center gap-2">
                    {lawNumber && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${color}30`, color }}
                        >
                            חוק {lawNumber}
                        </span>
                    )}
                    <h4 className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-white/70'}`}>
                        {title}
                    </h4>
                </div>
                <p className="text-xs text-white/40 mt-1">{description}</p>
            </div>
            <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="text-white/30 text-xl font-light"
            >
                ⌄
            </motion.span>
        </button>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="p-5 pt-2 border-t border-white/5 space-y-4">
                        {tip && (
                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <span className="text-amber-400 text-sm">💡</span>
                                <p className="text-xs text-amber-200/80 leading-relaxed">{tip}</p>
                            </div>
                        )}
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- Premium Input Component ---
const PremiumInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    multiline?: boolean;
    rows?: number;
}> = ({ value, onChange, placeholder, multiline, rows = 2 }) => {
    const baseClasses = "w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 focus:bg-black/50 transition-all placeholder-white/20 text-base";

    if (multiline) {
        return (
            <textarea
                dir="auto"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`${baseClasses} resize-none`}
            />
        );
    }

    return (
        <input
            type="text"
            dir="auto"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseClasses}
        />
    );
};

// --- Implementation Intention Builder ---
const ImplementationIntentionBuilder: React.FC<{
    when: string;
    where: string;
    action: string;
    onWhenChange: (v: string) => void;
    onWhereChange: (v: string) => void;
}> = ({ when, where, action, onWhenChange, onWhereChange }) => (
    <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-2xl border border-indigo-500/20">
            <p className="text-sm text-white/60 mb-4 text-center font-medium">
                "כשאגיע ל<span className="text-indigo-400">[מקום]</span> בשעה <span className="text-indigo-400">[זמן]</span>, אני אעשה <span className="text-emerald-400">[פעולה]</span>"
            </p>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">מתי?</label>
                    <input
                        type="time"
                        value={when}
                        onChange={(e) => onWhenChange(e.target.value)}
                        className="w-full bg-black/30 p-3 rounded-xl border border-white/10 text-white focus:outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
                <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">איפה?</label>
                    <PremiumInput
                        value={where}
                        onChange={onWhereChange}
                        placeholder="המטבח, המשרד..."
                    />
                </div>
            </div>
            {action && (
                <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-sm text-emerald-300 text-center">
                        ✓ כש{when ? `השעה ${when}` : '...'} ואני ב{where || '...'}, אני אעשה: <strong>{action}</strong>
                    </p>
                </div>
            )}
        </div>
    </div>
);

// --- Main Component ---
const PremiumBehaviorCreator: React.FC<PremiumBehaviorCreatorProps> = ({
    formState,
    dispatch,
}) => {
    const { personalItems } = useData();

    const currentMode: HabitMode = formState.habitType === 'bad' ? 'quit' : 'build';
    const [openTools, setOpenTools] = useState<string[]>([]);
    const [cueWhen, setCueWhen] = useState('');
    const [cueWhere, setCueWhere] = useState('');

    // Available habits for stacking
    const availableHabits = personalItems.filter(
        (item: PersonalItem) => item.type === 'habit' && item.habitType !== 'bad'
    );

    const handleModeChange = (mode: HabitMode) => {
        dispatch({
            type: 'SET_FIELD',
            payload: { field: 'habitType', value: mode === 'build' ? 'good' : 'bad' },
        });
        setOpenTools([]); // Reset open tools when switching modes
    };

    const toggleTool = (toolId: string) => {
        setOpenTools((prev) =>
            prev.includes(toolId)
                ? prev.filter((id) => id !== toolId)
                : [...prev, toolId]
        );
    };

    const modeColor = modeData[currentMode].color;

    // 4 Laws for good habits
    const goodHabitLaws = [
        { num: 1, title: 'Make it Obvious', hebrew: 'הפוך לברור' },
        { num: 2, title: 'Make it Attractive', hebrew: 'הפוך למושך' },
        { num: 3, title: 'Make it Easy', hebrew: 'הפוך לקל' },
        { num: 4, title: 'Make it Satisfying', hebrew: 'הפוך למספק' },
    ];

    // Inverted laws for breaking habits
    const badHabitLaws = [
        { num: 1, title: 'Make it Invisible', hebrew: 'הפוך לבלתי נראה' },
        { num: 2, title: 'Make it Unattractive', hebrew: 'הפוך לדוחה' },
        { num: 3, title: 'Make it Hard', hebrew: 'הפוך לקשה' },
        { num: 4, title: 'Make it Unsatisfying', hebrew: 'הפוך למתסכל' },
    ];

    const laws = currentMode === 'build' ? goodHabitLaws : badHabitLaws;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Mode Selector */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-black text-white mb-2">עיצוב התנהגות</h2>
                    <p className="text-sm text-white/40">בחר את סוג השינוי שברצונך ליצור</p>
                </motion.div>

                <div className="flex gap-4">
                    <ModeCard
                        mode="build"
                        isSelected={currentMode === 'build'}
                        onSelect={() => handleModeChange('build')}
                    />
                    <ModeCard
                        mode="quit"
                        isSelected={currentMode === 'quit'}
                        onSelect={() => handleModeChange('quit')}
                    />
                </div>

                {/* 4 Laws Preview */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {laws.map((law, i) => (
                        <LawBadge
                            key={law.num}
                            number={law.num}
                            title={law.hebrew}
                            isActive={openTools.length > 0}
                            color={modeColor}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Title Input - Ultra Premium */}
            <motion.div
                layout
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">
                    {currentMode === 'build' ? 'ההרגל החדש שלי' : 'ההרגל שאני עוזב'}
                </label>
                <input
                    type="text"
                    value={formState.title}
                    onChange={(e) =>
                        dispatch({ type: 'SET_FIELD', payload: { field: 'title', value: e.target.value } })
                    }
                    placeholder={currentMode === 'build' ? 'לקרוא 10 דקות כל יום' : 'להפסיק לבדוק את הטלפון כל 5 דקות'}
                    className="w-full bg-transparent text-3xl sm:text-4xl font-black text-white placeholder-white/15 focus:outline-none transition-all leading-tight"
                    autoFocus
                />
                <motion.div
                    className="h-1.5 rounded-full mt-4 shadow-lg"
                    style={{ backgroundColor: modeColor }}
                    initial={{ width: '4rem', opacity: 0.4 }}
                    animate={{
                        width: formState.title ? '100%' : '4rem',
                        opacity: formState.title ? 1 : 0.4,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="group"
            >
                <textarea
                    dir="auto"
                    value={formState.content}
                    onChange={(e) =>
                        dispatch({ type: 'SET_FIELD', payload: { field: 'content', value: e.target.value } })
                    }
                    placeholder="למה ההרגל הזה חשוב לי? (אופציונלי)"
                    rows={2}
                    className="w-full bg-white/[0.03] text-lg text-white p-5 rounded-2xl border border-white/10 focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all resize-none placeholder-white/20"
                />
            </motion.div>

            {/* Atomic Habits Toolkit */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">ארגז הכלים של Atomic Habits</h3>
                        <p className="text-xs text-white/40">בחר כלים שיעזרו לך להצליח</p>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                    {currentMode === 'build' ? (
                        <motion.div
                            key="build-tools"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {/* Law 1: Make it Obvious - Implementation Intention */}
                            <AtomicToolCard
                                icon={<TargetIcon className="w-7 h-7" />}
                                title="כוונת יישום"
                                description="קבע מתי, איפה ואיך תבצע את ההרגל"
                                lawNumber={1}
                                isOpen={openTools.includes('intention')}
                                onToggle={() => toggleTool('intention')}
                                color="#8B5CF6"
                                tip="אנשים שכותבים מתי ואיפה יבצעו הרגל מצליחים פי 2-3 יותר מאלו שלא."
                            >
                                <ImplementationIntentionBuilder
                                    when={cueWhen}
                                    where={cueWhere}
                                    action={formState.title}
                                    onWhenChange={setCueWhen}
                                    onWhereChange={setCueWhere}
                                />
                            </AtomicToolCard>

                            {/* Law 1: Habit Stacking */}
                            <AtomicToolCard
                                icon={<LinkIcon className="w-7 h-7" />}
                                title="שירשור הרגלים"
                                description="חבר את ההרגל החדש להרגל קיים"
                                lawNumber={1}
                                isOpen={openTools.includes('stacking')}
                                onToggle={() => toggleTool('stacking')}
                                color="#818CF8"
                                tip="אחרי [הרגל נוכחי], אני אעשה [הרגל חדש]. זה משתמש במומנטום קיים."
                            >
                                <div className="space-y-4">
                                    <select
                                        value={formState.habitStack?.anchorHabitId || ''}
                                        onChange={(e) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'habitStack',
                                                    value: e.target.value
                                                        ? { ...formState.habitStack, anchorHabitId: e.target.value }
                                                        : undefined,
                                                },
                                            })
                                        }
                                        className="w-full bg-black/30 text-white p-4 rounded-xl border border-white/10 focus:outline-none"
                                    >
                                        <option value="">בחר הרגל עוגן...</option>
                                        {availableHabits.map((h: PersonalItem) => (
                                            <option key={h.id} value={h.id}>
                                                {h.title}
                                            </option>
                                        ))}
                                    </select>

                                    {formState.habitStack?.anchorHabitId && (
                                        <div className="flex gap-2">
                                            {(['before', 'after'] as const).map((pos) => (
                                                <button
                                                    key={pos}
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch({
                                                            type: 'SET_FIELD',
                                                            payload: {
                                                                field: 'habitStack',
                                                                value: { ...formState.habitStack, stackPosition: pos },
                                                            },
                                                        })
                                                    }
                                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${formState.habitStack?.stackPosition === pos
                                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {pos === 'before' ? 'לפני' : 'אחרי'}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </AtomicToolCard>

                            {/* Law 2: Temptation Bundling */}
                            <AtomicToolCard
                                icon={<LightbulbIcon className="w-7 h-7" />}
                                title="חיבור לפיתוי"
                                description="חבר הרגל שאתה צריך לעשות עם משהו שאתה רוצה"
                                lawNumber={2}
                                isOpen={openTools.includes('bundle')}
                                onToggle={() => toggleTool('bundle')}
                                color="#F59E0B"
                                tip="'רק אחרי שאעשה [הרגל שאני צריך], אוכל לעשות [דבר שאני רוצה]'"
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.temptationBundle?.wantActivity || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'temptationBundle',
                                                    value: { ...formState.temptationBundle, wantActivity: v },
                                                },
                                            })
                                        }
                                        placeholder="מה הפעילות שאתה אוהב? (נטפליקס, קפה...)"
                                    />
                                    {formState.title && formState.temptationBundle?.wantActivity && (
                                        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                            <p className="text-sm text-amber-200 text-center leading-relaxed">
                                                ✨ רק אחרי ש<strong>{formState.title}</strong>, אוכל ליהנות מ<strong>{formState.temptationBundle.wantActivity}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </AtomicToolCard>

                            {/* Law 3: Two-Minute Rule */}
                            <AtomicToolCard
                                icon={<ClockIcon className="w-7 h-7" />}
                                title="כלל 2 הדקות"
                                description="התחל בגרסה קטנטנה שאי אפשר לסרב לה"
                                lawNumber={3}
                                isOpen={openTools.includes('twominute')}
                                onToggle={() => toggleTool('twominute')}
                                color="#10B981"
                                tip="'לקרוא לפני השינה' → 'לקרוא עמוד אחד'. התחל כל כך קטן שאי אפשר להיכשל."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.twoMinuteStarter?.microVersion || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'twoMinuteStarter',
                                                    value: {
                                                        ...formState.twoMinuteStarter,
                                                        microVersion: v,
                                                        currentPhase: 'micro',
                                                    },
                                                },
                                            })
                                        }
                                        placeholder="הגרסה הכי קטנה של ההרגל (2 דקות מקס)"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        {['micro', 'growing', 'full'].map((phase) => (
                                            <button
                                                key={phase}
                                                type="button"
                                                onClick={() =>
                                                    dispatch({
                                                        type: 'SET_FIELD',
                                                        payload: {
                                                            field: 'twoMinuteStarter',
                                                            value: { ...formState.twoMinuteStarter, currentPhase: phase },
                                                        },
                                                    })
                                                }
                                                className={`py-2 rounded-lg text-xs font-bold transition-all ${formState.twoMinuteStarter?.currentPhase === phase
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-white/5 text-white/40'
                                                    }`}
                                            >
                                                {phase === 'micro' ? '🌱 מיקרו' : phase === 'growing' ? '🌿 גדל' : '🌳 מלא'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </AtomicToolCard>

                            {/* Law 4: Identity */}
                            <AtomicToolCard
                                icon={<SparklesIcon className="w-7 h-7" />}
                                title="זהות חדשה"
                                description="הפוך לאדם שעושה את ההרגל הזה"
                                lawNumber={4}
                                isOpen={openTools.includes('identity')}
                                onToggle={() => toggleTool('identity')}
                                color="#EC4899"
                                tip="כל פעולה היא הצבעה לזהות שאתה רוצה לבנות. מי אתה רוצה להיות?"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <span>אני</span>
                                        <div className="flex-1">
                                            <PremiumInput
                                                value={formState.habitIdentity?.statement || ''}
                                                onChange={(v) =>
                                                    dispatch({
                                                        type: 'SET_FIELD',
                                                        payload: {
                                                            field: 'habitIdentity',
                                                            value: { statement: v },
                                                        },
                                                    })
                                                }
                                                placeholder="אדם שקורא כל יום / ספורטאי / יוצר..."
                                            />
                                        </div>
                                    </div>
                                    {formState.habitIdentity?.statement && (
                                        <div className="p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20 text-center">
                                            <p className="text-lg font-bold text-white">
                                                "אני {formState.habitIdentity.statement}"
                                            </p>
                                            <p className="text-xs text-white/40 mt-2">
                                                כל פעם שתבצע את ההרגל, תחזק את הזהות הזו
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </AtomicToolCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quit-tools"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            {/* Law 1 Inverted: Make it Invisible */}
                            <AtomicToolCard
                                icon={<BanIcon className="w-7 h-7" />}
                                title="זיהוי טריגרים"
                                description="מתי ההרגל הרע מתעורר?"
                                lawNumber={1}
                                isOpen={openTools.includes('triggers')}
                                onToggle={() => toggleTool('triggers')}
                                color="#EF4444"
                                tip="ברגע שתזהה את הטריגרים, תוכל להפוך אותם לבלתי נראים או להימנע מהם."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.breakingStrategy?.triggers?.join(', ') || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'breakingStrategy',
                                                    value: {
                                                        ...formState.breakingStrategy,
                                                        triggers: v.split(',').map((t) => t.trim()).filter(Boolean),
                                                    },
                                                },
                                            })
                                        }
                                        placeholder="לחץ, שעמום, אחרי העבודה, ליד הטלוויזיה..."
                                    />
                                    <p className="text-xs text-white/30">הפרד עם פסיקים</p>
                                </div>
                            </AtomicToolCard>

                            {/* Law 2 Inverted: Make it Unattractive */}
                            <AtomicToolCard
                                icon={<TargetIcon className="w-7 h-7" />}
                                title="רפריימינג"
                                description="שנה את הסיפור שאתה מספר לעצמך"
                                lawNumber={2}
                                isOpen={openTools.includes('reframe')}
                                onToggle={() => toggleTool('reframe')}
                                color="#F59E0B"
                                tip="במקום 'אני לא יכול', אמור 'אני לא עושה את זה'. זה שינוי זהות."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.antiGoalData?.motivation || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'antiGoalData',
                                                    value: { ...formState.antiGoalData, motivation: v },
                                                },
                                            })
                                        }
                                        placeholder="למה ההרגל הזה מזיק לי באמת?"
                                        multiline
                                        rows={2}
                                    />
                                    <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <p className="text-xs text-red-200/80">
                                            💭 במקום "אני מנסה להפסיק לעשן" → "אני לא מעשן"
                                        </p>
                                    </div>
                                </div>
                            </AtomicToolCard>

                            {/* Law 3 Inverted: Make it Hard */}
                            <AtomicToolCard
                                icon={<ShieldCheckIcon className="w-7 h-7" />}
                                title="הוספת חיכוך"
                                description="הפוך את ההרגל הרע לקשה יותר"
                                lawNumber={3}
                                isOpen={openTools.includes('friction')}
                                onToggle={() => toggleTool('friction')}
                                color="#6366F1"
                                tip="כל שלב נוסף שתוסיף יקטין את הסיכוי שתעשה את ההרגל הרע."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.breakingStrategy?.frictionMethods?.join(', ') || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'breakingStrategy',
                                                    value: {
                                                        ...formState.breakingStrategy,
                                                        frictionMethods: v.split(',').map((t) => t.trim()).filter(Boolean),
                                                    },
                                                },
                                            })
                                        }
                                        placeholder="להוציא מהבית, לנתק, לחסום, להרחיק..."
                                    />
                                    <p className="text-xs text-white/30">הפרד עם פסיקים</p>
                                </div>
                            </AtomicToolCard>

                            {/* Law 3: Substitution */}
                            <AtomicToolCard
                                icon={<LightbulbIcon className="w-7 h-7" />}
                                title="פעולה חלופית"
                                description="מה תעשה במקום?"
                                lawNumber={3}
                                isOpen={openTools.includes('substitution')}
                                onToggle={() => toggleTool('substitution')}
                                color="#10B981"
                                tip="קשה לבטל הרגל רע לגמרי. קל יותר להחליף אותו בהרגל טוב יותר."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.breakingStrategy?.substitutionAction || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: {
                                                    field: 'breakingStrategy',
                                                    value: {
                                                        ...formState.breakingStrategy,
                                                        substitutionAction: v,
                                                    },
                                                },
                                            })
                                        }
                                        placeholder="לשתות מים, לצאת להליכה, לנשום עמוק..."
                                    />
                                    {formState.breakingStrategy?.substitutionAction && (
                                        <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            <p className="text-sm text-emerald-200 text-center">
                                                ✓ כשארגיש את הדחף, אני אעשה: <strong>{formState.breakingStrategy.substitutionAction}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </AtomicToolCard>

                            {/* Law 4 Inverted: Make it Unsatisfying */}
                            <AtomicToolCard
                                icon={<SparklesIcon className="w-7 h-7" />}
                                title="שותף לאחריותיות"
                                description="מישהו שיעזור לך להישאר מחויב"
                                lawNumber={4}
                                isOpen={openTools.includes('accountability')}
                                onToggle={() => toggleTool('accountability')}
                                color="#EC4899"
                                tip="כשמישהו צופה בנו, אנחנו מתנהגים אחרת. זה כוח האחריותיות."
                            >
                                <div className="space-y-4">
                                    <PremiumInput
                                        value={formState.accountabilityPartner || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: { field: 'accountabilityPartner', value: v },
                                            })
                                        }
                                        placeholder="שם השותף / החבר / המנטור..."
                                    />
                                    <PremiumInput
                                        value={formState.commitmentDevice || ''}
                                        onChange={(v) =>
                                            dispatch({
                                                type: 'SET_FIELD',
                                                payload: { field: 'commitmentDevice', value: v },
                                            })
                                        }
                                        placeholder="מה ההתחייבות? (לשלם X אם אכשל...)"
                                    />
                                </div>
                            </AtomicToolCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Reminder Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-white text-xl">תזכורת יומית</h4>
                        <p className="text-sm text-white/40 mt-1">
                            {currentMode === 'build' ? 'קבל תזכורת לבצע את ההרגל' : 'צ\'ק-אין יומי לאחריותיות'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            dispatch({
                                type: 'SET_FIELD',
                                payload: { field: 'reminderEnabled', value: !formState.reminderEnabled },
                            })
                        }
                        className={`
              relative w-16 h-9 rounded-full transition-all duration-300
              ${formState.reminderEnabled
                                ? 'shadow-[0_0_20px_-3px_currentColor]'
                                : 'bg-white/10'
                            }
            `}
                        style={formState.reminderEnabled ? { backgroundColor: modeColor, color: modeColor } : undefined}
                    >
                        <motion.span
                            className={`
                absolute top-1.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300
              `}
                            animate={{ x: formState.reminderEnabled ? 32 : 6 }}
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {formState.reminderEnabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">
                                    שעת התזכורת
                                </label>
                                <input
                                    type="time"
                                    value={formState.reminderTime || '09:00'}
                                    onChange={(e) =>
                                        dispatch({
                                            type: 'SET_FIELD',
                                            payload: { field: 'reminderTime', value: e.target.value },
                                        })
                                    }
                                    className="w-full bg-black/30 p-5 text-white text-2xl font-bold text-center rounded-2xl border border-white/10 focus:outline-none focus:border-white/30 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Success Quote */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-4"
            >
                <p className="text-sm text-white/30 italic">
                    "אתה לא עולה לגובה המטרות שלך. אתה יורד לגובה המערכות שלך."
                </p>
                <p className="text-xs text-white/20 mt-1">— ג'יימס קליר, Atomic Habits</p>
            </motion.div>
        </div>
    );
};

export default PremiumBehaviorCreator;
