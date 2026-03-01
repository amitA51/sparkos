import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { QuickStatsHeader } from './QuickStatsHeader';
import { LastWorkoutCard } from './LastWorkoutCard';
import { PRMarkee } from './PRMarkee';
import { MuscleHeatmap } from './MuscleHeatmap';
import { HistoryTimeline } from './HistoryTimeline';
import { AIInsightCard } from './AIInsightCard';
import { ExerciseChart } from './ExerciseChart';
import { ChevronDownIcon, AddIcon } from '../../icons';
import WorkoutStartModal from '../../workout/WorkoutStartModal';
import ProgramCard from '../../workout/ProgramCard';
import { WorkoutTemplate, WorkoutSession } from '../../../types';
import { WORKOUT_PROGRAMS, type WorkoutProgram, type WorkoutDay } from '../../../data/workoutPrograms';
import { useData } from '../../../src/contexts/DataContext';
import { triggerHaptic } from '../../../src/utils/haptics';

export const FitnessHubView: React.FC = () => {
    const {
        exerciseNames,
        selectExercise,
        selectedExerciseProgress,
        selectedExerciseDelta,
        loading
    } = useFitnessInsights();

    const [selectedExerciseName, setSelectedExerciseName] = useState(exerciseNames[0] || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const { addPersonalItem } = useData();

    // Multi-week program selector state
    const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
    const [selectedWeek, setSelectedWeek] = useState(1);

    const handleStartWorkout = () => {
        triggerHaptic('medium');
        setShowWorkoutModal(true);
    };

    const handleStartEmpty = async () => {
        triggerHaptic('medium');
        setShowWorkoutModal(false);
        await addPersonalItem({
            type: 'workout',
            title: 'אימון חדש',
            isActiveWorkout: true,
            exercises: [],
        });
    };

    const handleStartFromTemplate = async (template: WorkoutTemplate) => {
        triggerHaptic('medium');
        setShowWorkoutModal(false);
        await addPersonalItem({
            type: 'workout',
            title: template.name,
            isActiveWorkout: true,
            exercises: template.exercises.map(ex => ({
                id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: ex.name,
                muscleGroup: ex.muscleGroup,
                sets: ex.sets?.map((s, i) => ({
                    id: `set_${Date.now()}_${i}`,
                    reps: s.reps || 10,
                    weight: s.weight || 0,
                    completedAt: undefined,
                })) || [{ id: `set_${Date.now()}`, reps: 10, weight: 0, completedAt: undefined }],
            })),
        });
    };

    const handleRepeatLast = async (session: WorkoutSession) => {
        triggerHaptic('medium');
        setShowWorkoutModal(false);
        await addPersonalItem({
            type: 'workout',
            title: 'חזרה על אימון',
            isActiveWorkout: true,
            exercises: session.exercises.map(ex => ({
                ...ex,
                id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                sets: ex.sets.map((s, i) => ({
                    ...s,
                    id: `set_${Date.now()}_${i}`,
                    completedAt: undefined,
                })),
            })),
        });
    };

    const handleExerciseSelect = (name: string) => {
        triggerHaptic('selection');
        setSelectedExerciseName(name);
        selectExercise(name);
        setIsDropdownOpen(false);
    };

    // Start a workout from a specific day in a multi-week program
    const handleStartProgramDay = async (program: WorkoutProgram, weekNum: number, dayWorkout: WorkoutDay) => {
        triggerHaptic('medium');
        setSelectedProgram(null);

        // Access exerciseExtras map (keyed by exercise name)
        const extras = (dayWorkout as unknown as Record<string, unknown>).exerciseExtras as Record<string, Record<string, unknown>> | undefined;

        await addPersonalItem({
            type: 'workout',
            title: `${program.nameHe} - שבוע ${weekNum} - ${dayWorkout.nameHe.split(' - ').pop()}`,
            isActiveWorkout: true,
            exercises: dayWorkout.exercises.map((ex, i) => {
                const exExtras = extras?.[ex.name];

                // Build warmup sets if specified
                const warmupCount = exExtras?.warmupSets ? parseInt(String(exExtras.warmupSets)) : 0;
                const warmupSets = Array.from({ length: warmupCount || 0 }, (_, j) => ({
                    id: `set_${Date.now()}_w${j}`,
                    reps: (ex.sets?.[0] as { reps?: number })?.reps || 10,
                    weight: 0,
                    isWarmup: true,
                    completedAt: undefined,
                }));

                // Working sets
                const workingSets = ex.sets?.map((s, j) => ({
                    id: `set_${Date.now()}_${j}`,
                    reps: (s as { reps?: number }).reps || 10,
                    weight: (s as { weight?: number }).weight || 0,
                    completedAt: undefined,
                })) || [];

                return {
                    id: `ex_${Date.now()}_${i}`,
                    name: ex.name,
                    muscleGroup: ex.muscleGroup,
                    notes: ex.notes,
                    sets: [...warmupSets, ...workingSets],
                    programExtras: exExtras ? {
                        notes: exExtras.notes as string | undefined,
                        alternatives: exExtras.alternatives as string[] | undefined,
                        rpeTarget: exExtras.rpeTarget as string | undefined,
                        warmupSets: exExtras.warmupSets as string | undefined,
                        restTime: exExtras.restTime as string | undefined,
                        intensityTechnique: exExtras.intensityTechnique as string | undefined,
                    } : undefined,
                };
            }),
        });
    };

    // Handle program card click
    const handleProgramClick = async (program: WorkoutProgram) => {
        triggerHaptic('medium');
        if (program.weeklySchedules && program.weeklySchedules.length > 0) {
            setSelectedProgram(program);
            setSelectedWeek(1);
        } else {
            // Single-week program - original behavior
            const dayIndex = new Date().getDay();
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
            const todayName = dayNames[dayIndex];
            const todayWorkout = program.schedule.find(d => d.day === todayName);
            if (todayWorkout && !todayWorkout.isRestDay && todayWorkout.exercises.length > 0) {
                await addPersonalItem({
                    type: 'workout',
                    title: `${program.nameHe} - ${todayWorkout.nameHe}`,
                    isActiveWorkout: true,
                    exercises: todayWorkout.exercises.map((ex, i) => ({
                        id: `ex_${Date.now()}_${i}`,
                        name: ex.name,
                        muscleGroup: ex.muscleGroup,
                        sets: ex.sets?.map((s, j) => ({
                            id: `set_${Date.now()}_${j}`,
                            reps: s.reps || 10,
                            weight: s.weight || 0,
                            completedAt: undefined,
                        })) || [],
                    })),
                });
            } else {
                alert(`היום יום מנוחה ב${program.nameHe}. התוכנית נשמרה והאימון הבא הוא מחר.`);
            }
        }
    };

    const chartData = React.useMemo(() =>
        selectedExerciseProgress.map(p => ({
            date: new Date(p.date),
            value: p.oneRepMax
        }))
        , [selectedExerciseProgress]);

    // Get current week's schedule for multi-week selector
    const currentWeekSchedule = selectedProgram?.weeklySchedules?.find(w => w.weekNumber === selectedWeek);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-t-[var(--dynamic-accent-start)] border-r-[var(--dynamic-accent-start)]/30 border-b-[var(--dynamic-accent-start)]/10 border-l-[var(--dynamic-accent-start)]/60 animate-spin" />
                <span className="text-white/40 font-medium tracking-wide">טוען נתונים...</span>
            </div>
        );
    }

    return (
        <div className="relative pb-[calc(100px_+_env(safe-area-inset-bottom))]">
            <div className="space-y-3 md:space-y-4 px-4 pt-[calc(0.5rem_+_env(safe-area-inset-top))] max-w-5xl mx-auto">

                {/* 1. Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-black text-white tracking-tight">
                            Fitness Hub
                        </h2>
                        <p className="text-[#8E8E93] text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--dynamic-accent-start)]" />
                            מחובר למערכת
                        </p>
                    </div>

                    {/* Quick Start Button - Clean & Solid */}
                    <motion.button
                        onClick={handleStartWorkout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full bg-[var(--dynamic-accent-start)] flex items-center justify-center shadow-lg shadow-[var(--dynamic-accent-start)]/20 hover:brightness-110 transition-all"
                    >
                        <AddIcon className="w-6 h-6 text-black" />
                    </motion.button>
                </motion.div>

                {/* 2. Command Center Stats */}
                <QuickStatsHeader />

                {/* 3. AI Coach Insight */}
                <AIInsightCard />

                {/* 4. Last Workout Hero Card */}
                <LastWorkoutCard onStartWorkout={handleStartWorkout} />

                {/* 5. PR Leaderboard */}
                <PRMarkee />

                {/* 5.5. Workout Programs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            📋 תוכניות אימון
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {WORKOUT_PROGRAMS.map(program => (
                            <ProgramCard
                                key={program.id}
                                program={program}
                                onClick={() => handleProgramClick(program)}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* 6. Exercise Analysis Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#1C1C1E] rounded-[24px] p-4 md:p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                📈 ניתוח ביצועים
                            </h3>
                            <p className="text-[#8E8E93] text-xs mt-1">התקדמות במשקלי עבודה</p>
                        </div>

                        {/* Dropdown - Solid */}
                        <div className="relative">
                            <button
                                onClick={() => { triggerHaptic('light'); setIsDropdownOpen(!isDropdownOpen); }}
                                className="flex items-center gap-3 bg-[#2C2C2E] rounded-xl pl-3 pr-4 py-2 text-sm text-white hover:bg-[#3A3A3C] transition-all active:scale-95 group"
                            >
                                <span className="font-semibold">{selectedExerciseName || 'בחר תרגיל'}</span>
                                <ChevronDownIcon className={`w-4 h-4 text-[#8E8E93] group-hover:text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 mt-2 w-56 max-h-[300px] overflow-y-auto bg-[#2C2C2E] rounded-xl shadow-xl z-50 py-1 scrollbar-hide"
                                    >
                                        {exerciseNames.map(name => (
                                            <button
                                                key={name}
                                                onClick={() => handleExerciseSelect(name)}
                                                className={`w-full text-right px-4 py-3 text-sm transition-colors border-l-2 ${selectedExerciseName === name
                                                    ? 'bg-[#3A3A3C] text-white border-[var(--dynamic-accent-start)] font-bold'
                                                    : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white border-transparent'
                                                    }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="h-[200px] md:h-[250px] w-full">
                        <ExerciseChart
                            data={chartData}
                            trend={selectedExerciseDelta?.trend}
                        />
                    </div>
                </motion.div>

                {/* 7. Muscle Map & History Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <MuscleHeatmap />
                    <HistoryTimeline />
                </div>

                {/* TEMPORARY: Data Reset (Requested by User) */}
                <div className="mt-6 flex justify-center pb-4 opacity-50 hover:opacity-100 transition-opacity">
                    <button
                        onClick={async () => {
                            if (window.confirm('⚠️ פעולה זו תמחק את כל היסטוריית האימונים, השיאים והתרגילים האישיים לצמיתות.\n\nהאם אתה בטוח?')) {
                                try {
                                    const { LOCAL_STORAGE_KEYS } = await import('../../../constants');
                                    const { dbClear, dbDelete, getPersonalItems } = await import('../../../services/dataService');

                                    await dbClear(LOCAL_STORAGE_KEYS.WORKOUT_SESSIONS);
                                    await dbClear(LOCAL_STORAGE_KEYS.WORKOUT_TEMPLATES);
                                    await dbClear(LOCAL_STORAGE_KEYS.PERSONAL_EXERCISES);
                                    await dbClear(LOCAL_STORAGE_KEYS.BODY_WEIGHT);

                                    const items = await getPersonalItems();
                                    const workouts = items.filter(i => i.type === 'workout');
                                    await Promise.all(workouts.map(w => dbDelete(LOCAL_STORAGE_KEYS.PERSONAL_ITEMS, w.id)));

                                    window.location.reload();
                                } catch (e) {
                                    console.error('Reset failed', e);
                                    alert('שגיאה במחיקת הנתונים');
                                }
                            }
                        }}
                        className="text-xs font-mono text-red-500 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/10"
                    >
                        ⚠️ איפוס נתוני אימון (RESET DATA)
                    </button>
                </div>
            </div>

            {/* Workout Start Modal */}
            <WorkoutStartModal
                isOpen={showWorkoutModal}
                onClose={() => setShowWorkoutModal(false)}
                onStartEmpty={handleStartEmpty}
                onStartFromTemplate={handleStartFromTemplate}
                onRepeatLastWorkout={handleRepeatLast}
            />

            {/* Multi-Week Program Selector Modal - Rendered via Portal to document.body */}
            {ReactDOM.createPortal(
                <AnimatePresence>
                    {selectedProgram && currentWeekSchedule && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center"
                            style={{ zIndex: 99999 }}
                            onClick={() => setSelectedProgram(null)}
                        >
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-[#1C1C1E] rounded-t-[28px] w-full sm:max-w-lg flex flex-col"
                                style={{ maxHeight: 'calc(100dvh - 40px)' }}
                            >
                                {/* Drag Handle */}
                                <div className="flex-shrink-0 pt-3 pb-1 flex justify-center">
                                    <div className="w-10 h-1 rounded-full bg-white/20" />
                                </div>

                                {/* Header */}
                                <div className="px-4 pb-3 border-b border-white/5 flex-shrink-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-lg font-bold text-white">
                                            {selectedProgram.nameHe}
                                        </h2>
                                        <button
                                            onClick={() => setSelectedProgram(null)}
                                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                                        >✕</button>
                                    </div>
                                    <p className="text-[#8E8E93] text-xs">{selectedProgram.progressionNotesHe}</p>
                                </div>

                                {/* Week Selector */}
                                <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-white/60 text-xs font-medium">שבוע</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{
                                            background: selectedWeek <= 2 ? '#22C55E20' : selectedWeek <= 6 ? '#F59E0B20' : '#EF444420',
                                            color: selectedWeek <= 2 ? '#22C55E' : selectedWeek <= 6 ? '#F59E0B' : '#EF4444',
                                        }}>
                                            {currentWeekSchedule.label}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                        {selectedProgram.weeklySchedules?.map(ws => (
                                            <button
                                                key={ws.weekNumber}
                                                onClick={() => { triggerHaptic('light'); setSelectedWeek(ws.weekNumber); }}
                                                className={`min-w-[36px] h-9 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${selectedWeek === ws.weekNumber
                                                    ? 'bg-[var(--dynamic-accent-start)] text-black shadow-lg shadow-[var(--dynamic-accent-start)]/30'
                                                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {ws.weekNumber}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Day Cards - scrollable area */}
                                <div className="px-4 py-3 overflow-y-auto flex-1 min-h-0 space-y-2 pb-[calc(80px_+_env(safe-area-inset-bottom))]">
                                    {currentWeekSchedule.schedule.map((day, idx) => (
                                        <motion.button
                                            key={`${selectedWeek}-${idx}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            disabled={day.isRestDay}
                                            onClick={() => handleStartProgramDay(selectedProgram, selectedWeek, day)}
                                            className={`w-full text-right rounded-2xl p-4 transition-all group ${day.isRestDay
                                                ? 'bg-white/3 cursor-default'
                                                : 'bg-white/5 hover:bg-white/10 active:scale-[0.98] cursor-pointer'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${day.isRestDay
                                                        ? 'bg-white/5 text-white/20'
                                                        : 'bg-[var(--dynamic-accent-start)]/10 text-[var(--dynamic-accent-start)]'
                                                        }`}>
                                                        {day.isRestDay ? '😴' : '💪'}
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold text-sm ${day.isRestDay ? 'text-white/30' : 'text-white'}`}>
                                                            {day.nameHe.split(' - ').pop()}
                                                        </p>
                                                        <p className="text-[#8E8E93] text-xs">
                                                            {day.isRestDay
                                                                ? 'יום מנוחה'
                                                                : `${day.exercises.length} תרגילים`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {!day.isRestDay && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-white/30 group-hover:text-[var(--dynamic-accent-start)] transition-colors">
                                                            התחל ▶
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {!day.isRestDay && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {[...new Set(day.exercises.map(e => e.muscleGroup).filter(Boolean))].map(mg => (
                                                        <span key={mg} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                                                            {mg}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
