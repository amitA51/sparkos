import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFitnessInsights } from '../../../hooks/useFitnessInsights';
import { format, startOfWeek, isThisWeek, differenceInWeeks } from 'date-fns';
import { he } from 'date-fns/locale';
import { WorkoutSession } from '../../../types';
import { deleteWorkoutSession } from '../../../services/dataService';
import { TrashIcon } from '../../icons';
import { WorkoutSessionDetailModal } from './WorkoutSessionDetailModal';

interface GroupedSessions {
    label: string;
    sessions: WorkoutSession[];
    isExpanded: boolean;
}

export const HistoryTimeline = React.memo(() => {
    const { workoutSessions } = useFitnessInsights();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

    const handleDeleteWorkout = useCallback(async (sessionId: string) => {
        if (confirmDeleteId === sessionId) {
            setDeletingId(sessionId);
            try {
                await deleteWorkoutSession(sessionId);
                // window.location.reload();
            } catch (error) {
                console.error('Failed to delete workout session:', error);
                setDeletingId(null);
                setConfirmDeleteId(null);
            }
        } else {
            setConfirmDeleteId(sessionId);
            setTimeout(() => setConfirmDeleteId(null), 3000);
        }
    }, [confirmDeleteId]);

    const groupedSessions = useMemo((): GroupedSessions[] => {
        if (workoutSessions.length === 0) return [];

        const groups = new Map<string, WorkoutSession[]>();
        const now = new Date();

        workoutSessions
            .filter(s => s.endTime)
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .slice(0, 20)
            .forEach(session => {
                const sessionDate = new Date(session.startTime);
                let label: string;

                if (isThisWeek(sessionDate, { weekStartsOn: 0 })) {
                    label = 'השבוע';
                } else {
                    const weeksAgo = differenceInWeeks(now, sessionDate);
                    if (weeksAgo === 1) {
                        label = 'שבוע שעבר';
                    } else if (weeksAgo <= 4) {
                        label = `לפני ${weeksAgo} שבועות`;
                    } else {
                        label = format(startOfWeek(sessionDate), 'MMMM yyyy', { locale: he });
                    }
                }

                const existing = groups.get(label) || [];
                existing.push(session);
                groups.set(label, existing);
            });

        return Array.from(groups.entries()).map(([label, sessions]) => ({
            label,
            sessions,
            isExpanded: label === 'השבוע' || label === 'שבוע שעבר',
        }));
    }, [workoutSessions]);

    if (groupedSessions.length === 0) {
        return (
            <div className="p-8 text-center bg-[#1C1C1E] rounded-3xl border border-dashed border-[#3A3A3C]">
                <span className="text-4xl block mb-2 opacity-30 grayscale">📅</span>
                <span className="text-[#8E8E93] text-sm">ההיסטוריה ריקה... בינתיים</span>
            </div>
        );
    }

    return (
        <>
            <div className="relative pl-6">
                {/* The Beam - Clean Line */}
                <div className="absolute top-0 bottom-0 right-[15px] w-[2px] bg-[#3A3A3C]" />

                <div className="space-y-8 relative z-10">
                    {groupedSessions.map((group, groupIndex) => (
                        <motion.div
                            key={group.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: groupIndex * 0.1 }}
                        >
                            {/* Group Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] flex items-center justify-center relative z-10 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-[#8E8E93]" />
                                </div>
                                <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest bg-[#1C1C1E] px-3 py-1 rounded-full border border-[#3A3A3C]">
                                    {group.label}
                                </span>
                            </div>

                            {/* Sessions */}
                            <div className="pr-12 space-y-4">
                                {group.sessions.map((session) => {
                                    const date = new Date(session.startTime);
                                    const totalVolume = session.exercises.reduce((acc, ex) =>
                                        acc + ex.sets
                                            .filter(s => s.completedAt && s.weight && s.reps)
                                            .reduce((sAcc, s) => sAcc + (s.weight! * s.reps!), 0)
                                        , 0);

                                    return (
                                        <motion.div
                                            key={session.id}
                                            whileHover={{ scale: 1.02, x: -5 }}
                                            onClick={() => setSelectedSession(session)}
                                            className="bg-[#1C1C1E] rounded-2xl p-4 relative group cursor-pointer border border-transparent hover:border-[#3A3A3C] transition-all shadow-sm"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-white mb-1">
                                                        {format(date, 'EEEE, d MMMM', { locale: he })}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-[#8E8E93]">
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--dynamic-accent-start)]" />
                                                            {session.exercises.length} תרגילים
                                                        </span>
                                                        <span>•</span>
                                                        <span>{(totalVolume / 1000).toFixed(1)}k kg</span>
                                                    </div>
                                                </div>

                                                {/* Delete Button */}
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteWorkout(session.id);
                                                    }}
                                                    disabled={deletingId === session.id}
                                                    className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center transition-all
                                                        ${confirmDeleteId === session.id
                                                            ? 'bg-red-500/20 text-red-500'
                                                            : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-red-500/10 hover:text-red-500'
                                                        }
                                                        ${deletingId === session.id ? 'opacity-50' : ''}
                                                    `}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {deletingId === session.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : confirmDeleteId === session.id ? (
                                                        <span className="text-[10px] font-bold">מחק?</span>
                                                    ) : (
                                                        <TrashIcon className="w-4 h-4" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Workout Detail Modal */}
            {selectedSession && (
                <WorkoutSessionDetailModal
                    isOpen={true}
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                />
            )}
        </>
    );
});
