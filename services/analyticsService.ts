import { WorkoutSession } from '../types';

export interface VolumeDataPoint {
  date: string;
  totalVolume: number; // sum of (weight × reps) for all exercises
  sessionCount: number;
}

export interface StrengthProgressPoint {
  date: string;
  oneRepMax: number;
  weight: number;
  reps: number;
}

export interface FrequencyData {
  date: string;
  workoutCount: number;
}

export interface MuscleGroupData {
  name: string;
  count: number;
  volume: number;
  color: string;
  percentage: number;
}

/**
 * Calculate total volume per workout session
 */
export const calculateVolumeHistory = (sessions: WorkoutSession[]): VolumeDataPoint[] => {
  return sessions
    .filter(s => s.endTime) // Only completed sessions
    .map(session => {
      const totalVolume = session.exercises.reduce((sessionSum, exercise) => {
        const exerciseVolume = exercise.sets.reduce((setSum, set) => {
          if (set.completedAt && set.weight && set.reps) {
            return setSum + set.weight * set.reps;
          }
          return setSum;
        }, 0);
        return sessionSum + exerciseVolume;
      }, 0);

      return {
        date: session.startTime,
        totalVolume,
        sessionCount: 1,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculate strength progression for a specific exercise
 */
export const calculateStrengthProgression = (
  sessions: WorkoutSession[],
  exerciseName: string
): StrengthProgressPoint[] => {
  const progressPoints: StrengthProgressPoint[] = [];

  sessions
    .filter(s => s.endTime)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .forEach(session => {
      const exercise = session.exercises.find(ex => ex.name === exerciseName);
      if (!exercise) return;

      // Find best set in this session
      const bestSet = exercise.sets
        .filter(s => s.completedAt && s.weight && s.reps)
        .reduce((best, current) => {
          if (!best) return current;
          const currentOneRM = calculateOneRM(current.weight!, current.reps!);
          const bestOneRM = calculateOneRM(best.weight!, best.reps!);
          return currentOneRM > bestOneRM ? current : best;
        }, exercise.sets[0]);

      if (bestSet && bestSet.weight && bestSet.reps) {
        progressPoints.push({
          date: session.startTime,
          oneRepMax: calculateOneRM(bestSet.weight, bestSet.reps),
          weight: bestSet.weight,
          reps: bestSet.reps,
        });
      }
    });

  return progressPoints;
};

/**
 * Calculate workout frequency (sessions per week)
 */
export const calculateFrequency = (
  sessions: WorkoutSession[],
  weeks: number = 12
): FrequencyData[] => {
  const now = new Date();
  const startDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  // Group by week
  const weekMap = new Map<string, number>();

  sessions
    .filter(s => s.endTime && new Date(s.startTime) >= startDate)
    .forEach(session => {
      const sessionDate = new Date(session.startTime);
      const weekKey = getWeekKey(sessionDate);
      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
    });

  // Convert to array and fill gaps
  const frequencyData: FrequencyData[] = [];
  for (let i = 0; i < weeks; i++) {
    const weekDate = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    const weekKey = getWeekKey(weekDate);
    frequencyData.push({
      date: weekDate.toISOString(),
      workoutCount: weekMap.get(weekKey) || 0,
    });
  }

  return frequencyData;
};

/**
 * Get average volume per session over last N sessions
 */
export const getAverageVolume = (sessions: WorkoutSession[], lastN: number = 10): number => {
  const recentSessions = sessions.filter(s => s.endTime).slice(-lastN);

  if (recentSessions.length === 0) return 0;

  const totalVolume = recentSessions.reduce((sum, session) => {
    const sessionVolume = session.exercises.reduce((exSum, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setSum, set) => {
        if (set.completedAt && set.weight && set.reps) {
          return setSum + set.weight * set.reps;
        }
        return setSum;
      }, 0);
      return exSum + exerciseVolume;
    }, 0);
    return sum + sessionVolume;
  }, 0);

  return Math.round(totalVolume / recentSessions.length);
};

// Muscle group color mapping
const MUSCLE_GROUP_COLORS: Record<string, string> = {
  'חזה': 'rgba(239, 68, 68, 0.8)',   // Red
  'Chest': 'rgba(239, 68, 68, 0.8)',
  'גב': 'rgba(59, 130, 246, 0.8)',   // Blue
  'Back': 'rgba(59, 130, 246, 0.8)',
  'רגליים': 'rgba(34, 197, 94, 0.8)', // Green
  'Legs': 'rgba(34, 197, 94, 0.8)',
  'כתפיים': 'rgba(168, 85, 247, 0.8)', // Purple
  'Shoulders': 'rgba(168, 85, 247, 0.8)',
  'ידיים': 'rgba(251, 146, 60, 0.8)', // Orange
  'Arms': 'rgba(251, 146, 60, 0.8)',
  'בטן': 'rgba(236, 72, 153, 0.8)',  // Pink
  'Core': 'rgba(236, 72, 153, 0.8)',
  'אחר': 'rgba(156, 163, 175, 0.8)', // Gray
  'Other': 'rgba(156, 163, 175, 0.8)',
};

// Exercise name patterns for muscle group inference
const MUSCLE_GROUP_PATTERNS: Record<string, RegExp> = {
  'חזה': /bench|press|push.*up|chest|fly|dip|חזה|לחיצ/i,
  'גב': /row|pull|lat|back|deadlift|גב|משיכ/i,
  'רגליים': /squat|leg|lunge|calf|ham|quad|רגל|כריעה/i,
  'כתפיים': /shoulder|ohp|lateral|raise|delt|כתפ|הרמ/i,
  'ידיים': /curl|tricep|bicep|extension|hammer|יד|זרוע/i,
  'בטן': /crunch|plank|ab|core|twist|בטן|מתח/i,
};

const inferMuscleGroup = (exerciseName: string): string => {
  for (const [group, pattern] of Object.entries(MUSCLE_GROUP_PATTERNS)) {
    if (pattern.test(exerciseName)) {
      return group;
    }
  }
  return 'אחר';
};

/**
 * Calculate muscle group distribution from workout sessions
 */
export const calculateMuscleGroupDistribution = (
  sessions: WorkoutSession[],
  lastN: number = 30
): MuscleGroupData[] => {
  const recentSessions = sessions.filter(s => s.endTime).slice(-lastN);

  const groupStats = new Map<string, { count: number; volume: number }>();

  recentSessions.forEach(session => {
    session.exercises.forEach(exercise => {
      const group = exercise.muscleGroup || inferMuscleGroup(exercise.name);
      const current = groupStats.get(group) || { count: 0, volume: 0 };

      const exerciseVolume = exercise.sets.reduce((sum, set) => {
        if (set.completedAt && set.weight && set.reps) {
          return sum + set.weight * set.reps;
        }
        return sum;
      }, 0);

      groupStats.set(group, {
        count: current.count + 1,
        volume: current.volume + exerciseVolume,
      });
    });
  });

  const totalCount = Array.from(groupStats.values()).reduce((sum, g) => sum + g.count, 0);

  return Array.from(groupStats.entries())
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      volume: stats.volume,
      color: MUSCLE_GROUP_COLORS[name] ?? 'rgba(156, 163, 175, 0.8)',
      percentage: totalCount > 0 ? Math.round((stats.count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
};
const calculateOneRM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

const getWeekKey = (date: Date): string => {
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}-W${weekNumber}`;
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// ============================================================
// FITNESS HUB - New Types & Functions
// ============================================================

/**
 * Last session data for a specific exercise
 */
export interface LastExerciseSession {
  exerciseName: string;
  date: string;
  daysSince: number;
  sets: Array<{ weight: number; reps: number; volume: number }>;
  totalVolume: number;
  bestSet: { weight: number; reps: number; oneRM: number };
}

/**
 * Muscle group with days since last trained
 */
export interface MuscleGroupLastTrained {
  muscleGroup: string;
  lastTrainedDate: string | null;
  daysSince: number | null; // null = never trained
  isNeglected: boolean; // More than 7 days
  color: string;
}

/**
 * Week-over-week progress for an exercise
 */
export interface ProgressDelta {
  exerciseName: string;
  currentWeekBest: { weight: number; reps: number; oneRM: number } | null;
  previousWeekBest: { weight: number; reps: number; oneRM: number } | null;
  deltaWeight: number;
  deltaOneRM: number;
  trend: 'up' | 'down' | 'stable' | 'no_data';
}

/**
 * Last workout summary
 */
export interface LastWorkoutSummary {
  id: string;
  date: string;
  daysSince: number;
  durationMinutes: number;
  totalVolume: number;
  exerciseCount: number;
  setCount: number;
  mainMuscleGroups: string[];
  prCount: number;
}

/**
 * Get last session data for a specific exercise
 * @param sessions All workout sessions
 * @param exerciseName Name of the exercise to look up
 */
export const getLastSessionForExercise = (
  sessions: WorkoutSession[],
  exerciseName: string
): LastExerciseSession | null => {
  const now = new Date();

  // Find sessions containing this exercise, sorted by date desc
  const relevantSessions = sessions
    .filter(s => s.endTime && s.exercises.some(ex => ex.name === exerciseName))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  if (relevantSessions.length === 0) return null;

  const lastSession = relevantSessions[0];
  if (!lastSession) return null;
  const exercise = lastSession.exercises.find(ex => ex.name === exerciseName);
  if (!exercise) return null;
  const sessionDate = new Date(lastSession.startTime);
  const daysSince = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

  const sets = exercise.sets
    .filter(s => s.completedAt && s.weight && s.reps)
    .map(s => ({
      weight: s.weight!,
      reps: s.reps!,
      volume: s.weight! * s.reps!,
    }));

  const totalVolume = sets.reduce((sum, s) => sum + s.volume, 0);

  // Find best set by 1RM
  const bestSet = sets.reduce((best, current) => {
    const currentOneRM = calculateOneRM(current.weight, current.reps);
    const bestOneRM = best ? calculateOneRM(best.weight, best.reps) : 0;
    return currentOneRM > bestOneRM ? current : best;
  }, sets[0]);

  return {
    exerciseName,
    date: lastSession.startTime,
    daysSince,
    sets,
    totalVolume,
    bestSet: bestSet ? {
      weight: bestSet.weight,
      reps: bestSet.reps,
      oneRM: calculateOneRM(bestSet.weight, bestSet.reps),
    } : { weight: 0, reps: 0, oneRM: 0 },
  };
};

/**
 * Get days since each muscle group was last trained
 * @param sessions All workout sessions
 */
export const getMuscleGroupDaysSince = (
  sessions: WorkoutSession[]
): MuscleGroupLastTrained[] => {
  const now = new Date();
  const muscleGroups = ['חזה', 'גב', 'רגליים', 'כתפיים', 'ידיים', 'בטן'];

  const lastTrainedMap = new Map<string, Date>();

  // Find last trained date for each muscle group
  sessions
    .filter(s => s.endTime)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .forEach(session => {
      session.exercises.forEach(exercise => {
        const group = exercise.muscleGroup || inferMuscleGroup(exercise.name);
        if (!lastTrainedMap.has(group)) {
          lastTrainedMap.set(group, new Date(session.startTime));
        }
      });
    });

  return muscleGroups.map(muscleGroup => {
    const lastDate = lastTrainedMap.get(muscleGroup);
    const daysSince = lastDate
      ? Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      muscleGroup,
      lastTrainedDate: lastDate?.toISOString() || null,
      daysSince,
      isNeglected: daysSince === null || daysSince > 7,
      color: MUSCLE_GROUP_COLORS[muscleGroup] || 'rgba(156, 163, 175, 0.8)',
    };
  });
};

/**
 * Calculate week-over-week progress for an exercise
 * @param sessions All workout sessions
 * @param exerciseName Name of the exercise
 */
export const getWeekOverWeekProgress = (
  sessions: WorkoutSession[],
  exerciseName: string
): ProgressDelta => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const getBestSetInRange = (start: Date, end: Date): { weight: number; reps: number; oneRM: number } | null => {
    let best: { weight: number; reps: number; oneRM: number } | null = null;

    sessions
      .filter(s => {
        if (!s.endTime) return false;
        const d = new Date(s.startTime);
        return d >= start && d < end;
      })
      .forEach(session => {
        const exercise = session.exercises.find(ex => ex.name === exerciseName);
        if (!exercise) return;

        exercise.sets
          .filter(s => s.completedAt && s.weight && s.reps)
          .forEach(set => {
            const oneRM = calculateOneRM(set.weight!, set.reps!);
            if (!best || oneRM > best.oneRM) {
              best = { weight: set.weight!, reps: set.reps!, oneRM };
            }
          });
      });

    return best;
  };

  const currentWeekBest = getBestSetInRange(oneWeekAgo, now);
  const previousWeekBest = getBestSetInRange(twoWeeksAgo, oneWeekAgo);

  let trend: 'up' | 'down' | 'stable' | 'no_data' = 'no_data';
  let deltaWeight = 0;
  let deltaOneRM = 0;

  if (currentWeekBest && previousWeekBest) {
    deltaWeight = currentWeekBest.weight - previousWeekBest.weight;
    deltaOneRM = currentWeekBest.oneRM - previousWeekBest.oneRM;

    if (deltaOneRM > 0) trend = 'up';
    else if (deltaOneRM < 0) trend = 'down';
    else trend = 'stable';
  } else if (currentWeekBest) {
    trend = 'stable';
  }

  return {
    exerciseName,
    currentWeekBest,
    previousWeekBest,
    deltaWeight,
    deltaOneRM,
    trend,
  };
};

/**
 * Get summary of the last workout
 * @param sessions All workout sessions
 */
export const getLastWorkoutSummary = (
  sessions: WorkoutSession[]
): LastWorkoutSummary | null => {
  const now = new Date();

  const completedSessions = sessions
    .filter(s => s.endTime)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  if (completedSessions.length === 0) return null;

  const last = completedSessions[0];
  if (!last) return null;
  const startDate = new Date(last.startTime);
  const endDate = new Date(last.endTime!);
  const daysSince = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  let totalVolume = 0;
  let setCount = 0;
  const muscleGroupsSet = new Set<string>();

  last.exercises.forEach(exercise => {
    const group = exercise.muscleGroup || inferMuscleGroup(exercise.name);
    muscleGroupsSet.add(group);

    exercise.sets
      .filter(s => s.completedAt && s.weight && s.reps)
      .forEach(set => {
        totalVolume += set.weight! * set.reps!;
        setCount++;
      });
  });

  return {
    id: last.id,
    date: last.startTime,
    daysSince,
    durationMinutes,
    totalVolume,
    exerciseCount: last.exercises.length,
    setCount,
    mainMuscleGroups: Array.from(muscleGroupsSet),
    prCount: last.prs || 0,
  };
};

/**
 * Get all unique exercise names from history
 * @param sessions All workout sessions
 */
export const getAllExerciseNames = (sessions: WorkoutSession[]): string[] => {
  const names = new Set<string>();
  sessions.forEach(session => {
    session.exercises.forEach(ex => names.add(ex.name));
  });
  return Array.from(names).sort();
};
