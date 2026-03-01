// WorkoutSessionDetailModal - Modal for viewing workout session details
// Uses Portal rendering via ModalOverlay for proper z-index stacking and focus management
import React from 'react';
import { motion } from 'framer-motion';
import { WorkoutSession } from '../../../types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { CloseIcon } from '../../icons';
import { ModalOverlay } from '../../ui/ModalOverlay';

interface WorkoutSessionDetailModalProps {
    session: WorkoutSession;
    isOpen: boolean;
    onClose: () => void;
}

export const WorkoutSessionDetailModal: React.FC<WorkoutSessionDetailModalProps> = ({
    session,
    isOpen,
    onClose,
}) => {
    const date = new Date(session.startTime);
    const endDate = session.endTime ? new Date(session.endTime) : null;
    const durationMs = endDate ? endDate.getTime() - date.getTime() : 0;
    const durationMins = Math.floor(durationMs / 60000);

    const totalVolume = session.exercises.reduce((acc, ex) =>
        acc + ex.sets
            .filter(s => s.completedAt && s.weight && s.reps)
            .reduce((sAcc, s) => sAcc + (s.weight! * s.reps!), 0)
        , 0);

    const totalSets = session.exercises.reduce((acc, ex) =>
        acc + ex.sets.filter(s => s.completedAt).length, 0);

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            variant="modal"
            zLevel="high"
            backdropOpacity={80}
            blur="md"
            trapFocus
            lockScroll
            closeOnBackdropClick
            closeOnEscape
            ariaLabel={`אימון מ-${format(date, 'd MMMM', { locale: he })}`}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                className="w-full max-w-lg max-h-[80vh] bg-[#1C1C1E] rounded-3xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {format(date, 'EEEE, d MMMM', { locale: he })}
                        </h2>
                        <p className="text-sm text-[#8E8E93] mt-1">
                            {format(date, 'HH:mm')} • {durationMins} דקות
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        aria-label="סגור"
                    >
                        <CloseIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 p-5 border-b border-white/10">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{session.exercises.length}</div>
                        <div className="text-xs text-[#8E8E93]">תרגילים</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{totalSets}</div>
                        <div className="text-xs text-[#8E8E93]">סטים</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{(totalVolume / 1000).toFixed(1)}k</div>
                        <div className="text-xs text-[#8E8E93]">נפח (kg)</div>
                    </div>
                </div>

                {/* Exercises List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {session.exercises.map((exercise, exIdx) => {
                        const completedSets = exercise.sets.filter(s => s.completedAt);
                        if (completedSets.length === 0) return null;

                        return (
                            <div key={exIdx} className="bg-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--dynamic-accent-start)]/20 flex items-center justify-center">
                                        <span className="text-lg">💪</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{exercise.name}</h3>
                                        {exercise.muscleGroup && (
                                            <p className="text-xs text-[#8E8E93]">{exercise.muscleGroup}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Sets */}
                                <div className="space-y-2">
                                    {completedSets.map((set, setIdx) => (
                                        <div
                                            key={setIdx}
                                            className="flex items-center justify-between bg-black/30 rounded-xl px-3 py-2"
                                        >
                                            <span className="text-xs text-[#8E8E93]">סט {setIdx + 1}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-white font-semibold">
                                                    {set.weight || 0} kg
                                                </span>
                                                <span className="text-[#8E8E93]">×</span>
                                                <span className="text-sm text-white font-semibold">
                                                    {set.reps || 0} reps
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </ModalOverlay>
    );
};
