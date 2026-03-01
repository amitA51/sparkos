
import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PersonalExercise } from '../../../types';
import { StarIcon, DumbbellIcon, FlameIcon, TargetIcon } from '../../icons';
import { PersonalRecord } from '../../../services/prService';
import { triggerHaptic } from '../../../src/utils/haptics';

interface ExerciseStats {
    last?: { weight: number; reps: number };
    pr?: PersonalRecord;
}

interface ExerciseCardProps {
    exercise: PersonalExercise;
    stats?: ExerciseStats;
    isSelected: boolean;
    onSelectExercise: (exercise: PersonalExercise) => void;
    onToggleFavoriteId: (exerciseId: string) => void;
    index: number;
}

// Memoized card component for performance in large lists
export const ExerciseCard = memo<ExerciseCardProps>(({ exercise, stats, isSelected, onSelectExercise, onToggleFavoriteId, index }) => {
    // Get muscle group icon as SVG
    const getMuscleIcon = (muscleGroup: string = '') => {
        const iconClass = "w-5 h-5";
        switch (muscleGroup.toLowerCase()) {
            case 'chest':
            case 'back':
            case 'shoulders':
            case 'arms':
                return <DumbbellIcon className={iconClass} />;
            case 'legs':
                return <DumbbellIcon className={iconClass} />;
            case 'core':
                return <TargetIcon className={iconClass} />;
            case 'cardio':
                return <FlameIcon className={iconClass} />;
            default:
                return <DumbbellIcon className={iconClass} />;
        }
    };

    const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('medium');
        onToggleFavoriteId(exercise.id);
    }, [onToggleFavoriteId, exercise.id]);

    const handleSelectClick = useCallback(() => {
        triggerHaptic('success');
        onSelectExercise(exercise);
    }, [onSelectExercise, exercise]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.02,
                duration: 0.2
            }}
            className={`
        w-full text-right p-4 rounded-xl
        transition-all duration-200
        min-h-[72px] flex items-center gap-4
        ${isSelected
                    ? 'bg-[#1C1C1E] ring-1 ring-[#a3e635]'
                    : 'bg-[#2C2C2E]'
                }
      `}
        >
            {/* Favorite button */}
            <button
                type="button"
                onClick={handleFavoriteClick}
                className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          transition-all active:scale-90
          ${exercise.isFavorite
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-[#3A3A3C] text-[#636366] hover:text-amber-400'
                    }
        `}
            >
                <StarIcon className="w-5 h-5" filled={exercise.isFavorite} />
            </button>

            {/* Main content - clickable */}
            <button
                type="button"
                onClick={handleSelectClick}
                className="flex-1 min-w-0 flex items-center gap-4 text-right active:opacity-70 transition-opacity"
            >
                {/* Icon */}
                <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${isSelected
                        ? 'bg-[#a3e635] text-black'
                        : 'bg-[#3A3A3C] text-[#8E8E93]'
                    }
        `}>
                    {getMuscleIcon(exercise.muscleGroup)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
                    <h3 className={`
            font-semibold text-[17px] truncate leading-tight
            ${isSelected ? 'text-white' : 'text-white'}
          `}>
                        {exercise.name}
                    </h3>

                    <div className="flex items-center gap-2 text-[13px] text-[#8E8E93]">
                        {exercise.muscleGroup && (
                            <span>{exercise.muscleGroup}</span>
                        )}
                        {stats?.last && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    {stats.last.weight}kg × {stats.last.reps}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-[#a3e635] flex items-center justify-center text-black text-xs font-bold"
                    >
                        ✓
                    </motion.div>
                )}
            </button>
        </motion.div>
    );
});

ExerciseCard.displayName = 'ExerciseCard';
