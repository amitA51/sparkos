import type { Exercise } from '../types';
import { BODYBUILDING_10WEEK } from './bodybuilding10week';

/**
 * Workout Programs - Structured training programs with weekly schedules
 * Includes popular programs: PPL, StrongLifts 5x5, GZCLP
 * Extended with multi-week periodization support (v2)
 */

export interface ExerciseExtras {
    notes?: string;
    alternatives?: string[];
    rpeTarget?: string;
    warmupSets?: string;
    restTime?: string;
    intensityTechnique?: string;
}

export interface WorkoutDay {
    day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
    name: string;
    nameHe: string;
    exercises: Omit<Exercise, 'id'>[];
    isRestDay?: boolean;
    exerciseExtras?: Record<string, ExerciseExtras>;
}

export interface WeekSchedule {
    weekNumber: number;
    label?: string;
    schedule: WorkoutDay[];
}

export interface WorkoutProgram {
    id: string;
    name: string;
    nameHe: string;
    description: string;
    descriptionHe: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    daysPerWeek: number;
    focusAreas: string[];
    schedule: WorkoutDay[];
    progressionNotes: string;
    progressionNotesHe: string;
    color: string;
    icon: string;
    // Multi-week periodization (optional, backward-compatible)
    weeklySchedules?: WeekSchedule[];
    totalWeeks?: number;
    periodization?: string;
}

// Helper to create exercise with sets
const ex = (name: string, sets: number, reps: number, muscleGroup?: string, notes?: string): Omit<Exercise, 'id'> => ({
    name,
    sets: Array(sets).fill({ reps, weight: 0 }),
    muscleGroup,
    notes,
});

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
    // ===== STRONGLIFTS 5x5 =====
    {
        id: 'stronglifts-5x5',
        name: 'StrongLifts 5x5',
        nameHe: 'סטרונגליפטס 5x5',
        description: 'Classic beginner strength program. 3 days/week, alternating workouts A and B.',
        descriptionHe: 'תוכנית כוח קלאסית למתחילים. 3 ימים בשבוע, אימונים מתחלפים A ו-B.',
        difficulty: 'beginner',
        daysPerWeek: 3,
        focusAreas: ['strength', 'compound'],
        progressionNotes: 'Add 2.5kg per workout on all lifts. Deload by 10% after 3 consecutive failures.',
        progressionNotesHe: 'הוסף 2.5 ק"ג לכל תרגיל בכל אימון. הורד 10% לאחר 3 כישלונות רצופים.',
        color: '#EF4444',
        icon: 'dumbbell',
        schedule: [
            {
                day: 'sunday', name: 'Workout A', nameHe: 'אימון A', exercises: [
                    ex('סקוואט', 5, 5, 'legs'),
                    ex('לחיצת חזה', 5, 5, 'chest'),
                    ex('שורה עליונה', 5, 5, 'back'),
                ]
            },
            { day: 'monday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'tuesday', name: 'Workout B', nameHe: 'אימון B', exercises: [
                    ex('סקוואט', 5, 5, 'legs'),
                    ex('לחיצת כתפיים', 5, 5, 'shoulders'),
                    ex('דדליפט', 1, 5, 'back'),
                ]
            },
            { day: 'wednesday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'thursday', name: 'Workout A', nameHe: 'אימון A', exercises: [
                    ex('סקוואט', 5, 5, 'legs'),
                    ex('לחיצת חזה', 5, 5, 'chest'),
                    ex('שורה עליונה', 5, 5, 'back'),
                ]
            },
            { day: 'friday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            { day: 'saturday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
        ],
    },

    // ===== PPL (Push/Pull/Legs) =====
    {
        id: 'ppl-6-day',
        name: 'Push/Pull/Legs (6 Day)',
        nameHe: 'דחיפה/משיכה/רגליים (6 ימים)',
        description: 'Popular 6-day split hitting each muscle group twice per week.',
        descriptionHe: 'פיצול פופולרי של 6 ימים, כל קבוצת שרירים פעמיים בשבוע.',
        difficulty: 'intermediate',
        daysPerWeek: 6,
        focusAreas: ['hypertrophy', 'strength'],
        progressionNotes: 'Increase weight when you hit top of rep range for all sets.',
        progressionNotesHe: 'הגדל משקל כשמגיע לחזרות המקסימליות בכל הסטים.',
        color: '#8B5CF6',
        icon: 'flame',
        schedule: [
            {
                day: 'sunday', name: 'Push A', nameHe: 'דחיפה A', exercises: [
                    ex('לחיצת חזה', 4, 6, 'chest'),
                    ex('לחיצת כתפיים', 3, 8, 'shoulders'),
                    ex('לחיצת חזה משופעת', 3, 10, 'chest'),
                    ex('הרמות צד', 3, 15, 'shoulders'),
                    ex('טריצפס פושדאון', 3, 12, 'arms'),
                    ex('שכיבות סמיכה יהלום', 2, 15, 'arms'),
                ]
            },
            {
                day: 'monday', name: 'Pull A', nameHe: 'משיכה A', exercises: [
                    ex('דדליפט', 3, 5, 'back'),
                    ex('מתח', 3, 8, 'back'),
                    ex('שורה חתירה', 3, 10, 'back'),
                    ex('פייס פול', 3, 15, 'back'),
                    ex('כפיפות ביצפס', 3, 12, 'arms'),
                    ex('כפיפות האמר', 2, 12, 'arms'),
                ]
            },
            {
                day: 'tuesday', name: 'Legs A', nameHe: 'רגליים A', exercises: [
                    ex('סקוואט', 4, 6, 'legs'),
                    ex('RDL', 3, 8, 'legs'),
                    ex('לחיצת רגליים', 3, 12, 'legs'),
                    ex('כפיפות ירך', 3, 12, 'legs'),
                    ex('הרמות שוק', 4, 15, 'legs'),
                ]
            },
            {
                day: 'wednesday', name: 'Push B', nameHe: 'דחיפה B', exercises: [
                    ex('לחיצת כתפיים עומד', 4, 6, 'shoulders'),
                    ex('לחיצת חזה משופעת', 3, 8, 'chest'),
                    ex('מקבילים', 3, 10, 'chest'),
                    ex('הרמות קדמיות', 3, 12, 'shoulders'),
                    ex('מפרקים מעל הראש', 3, 12, 'arms'),
                ]
            },
            {
                day: 'thursday', name: 'Pull B', nameHe: 'משיכה B', exercises: [
                    ex('שורה חתירה', 4, 6, 'back'),
                    ex('מתח רחב', 3, 8, 'back'),
                    ex('שורה בכבל', 3, 10, 'back'),
                    ex('שטוף כתפיים אחוריות', 3, 15, 'back'),
                    ex('כפיפות ביצפס בשיפוע', 3, 12, 'arms'),
                ]
            },
            {
                day: 'friday', name: 'Legs B', nameHe: 'רגליים B', exercises: [
                    ex('דדליפט רומני', 4, 8, 'legs'),
                    ex('מכרעים', 3, 10, 'legs'),
                    ex('פשיטות ירך', 3, 12, 'legs'),
                    ex('כפיפות ירך שכב', 3, 12, 'legs'),
                    ex('הרמות שוק ישיבה', 4, 15, 'legs'),
                ]
            },
            { day: 'saturday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
        ],
    },

    // ===== GZCLP =====
    {
        id: 'gzclp',
        name: 'GZCLP',
        nameHe: 'GZCLP',
        description: 'Linear progression program with tiers: T1 (heavy), T2 (moderate), T3 (accessories).',
        descriptionHe: 'תוכנית התקדמות ליניארית עם רמות: T1 (כבד), T2 (בינוני), T3 (אביזרים).',
        difficulty: 'intermediate',
        daysPerWeek: 4,
        focusAreas: ['strength', 'hypertrophy'],
        progressionNotes: 'T1: Add 2.5kg upper, 5kg lower per session. On failure, reset to 6x2, then 10x1.',
        progressionNotesHe: 'T1: הוסף 2.5 ק"ג עליון, 5 ק"ג תחתון. בכישלון, עבור ל-6x2, אח"כ 10x1.',
        color: '#10B981',
        icon: 'target',
        schedule: [
            {
                day: 'sunday', name: 'Day 1', nameHe: 'יום 1', exercises: [
                    ex('סקוואט (T1)', 5, 3, 'legs'),
                    ex('לחיצת חזה (T2)', 3, 10, 'chest'),
                    ex('פול דאון (T3)', 3, 15, 'back'),
                ]
            },
            { day: 'monday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'tuesday', name: 'Day 2', nameHe: 'יום 2', exercises: [
                    ex('לחיצת כתפיים (T1)', 5, 3, 'shoulders'),
                    ex('דדליפט (T2)', 3, 10, 'back'),
                    ex('שורה ישיבה (T3)', 3, 15, 'back'),
                ]
            },
            { day: 'wednesday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'thursday', name: 'Day 3', nameHe: 'יום 3', exercises: [
                    ex('לחיצת חזה (T1)', 5, 3, 'chest'),
                    ex('סקוואט (T2)', 3, 10, 'legs'),
                    ex('מתח (T3)', 3, 15, 'back'),
                ]
            },
            { day: 'friday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'saturday', name: 'Day 4', nameHe: 'יום 4', exercises: [
                    ex('דדליפט (T1)', 5, 3, 'back'),
                    ex('לחיצת כתפיים (T2)', 3, 10, 'shoulders'),
                    ex('פול דאון רחב (T3)', 3, 15, 'back'),
                ]
            },
        ],
    },

    // ===== Upper/Lower 4-Day =====
    {
        id: 'upper-lower-4',
        name: 'Upper/Lower Split',
        nameHe: 'עליון/תחתון',
        description: 'Classic 4-day split - upper body and lower body twice per week.',
        descriptionHe: 'פיצול קלאסי של 4 ימים - גוף עליון ותחתון פעמיים בשבוע.',
        difficulty: 'beginner',
        daysPerWeek: 4,
        focusAreas: ['balanced', 'strength'],
        progressionNotes: 'Add weight when completing all sets at top of rep range.',
        progressionNotesHe: 'הוסף משקל בהשלמת כל הסטים בכמות החזרות המקסימלית.',
        color: '#F59E0B',
        icon: 'user',
        schedule: [
            {
                day: 'sunday', name: 'Upper A', nameHe: 'עליון A', exercises: [
                    ex('לחיצת חזה', 4, 6, 'chest'),
                    ex('שורה חתירה', 4, 6, 'back'),
                    ex('לחיצת כתפיים', 3, 10, 'shoulders'),
                    ex('מתח', 3, 8, 'back'),
                    ex('כפיפות ביצפס', 2, 12, 'arms'),
                    ex('טריצפס', 2, 12, 'arms'),
                ]
            },
            {
                day: 'monday', name: 'Lower A', nameHe: 'תחתון A', exercises: [
                    ex('סקוואט', 4, 6, 'legs'),
                    ex('RDL', 3, 8, 'legs'),
                    ex('לחיצת רגליים', 3, 12, 'legs'),
                    ex('כפיפות ירך', 3, 10, 'legs'),
                    ex('הרמות שוק', 4, 15, 'legs'),
                ]
            },
            { day: 'tuesday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            {
                day: 'wednesday', name: 'Upper B', nameHe: 'עליון B', exercises: [
                    ex('לחיצת חזה משופעת', 4, 8, 'chest'),
                    ex('מתח', 4, 8, 'back'),
                    ex('הרמות צד', 3, 15, 'shoulders'),
                    ex('שורה בכבל', 3, 12, 'back'),
                    ex('כפיפות האמר', 2, 12, 'arms'),
                    ex('שכיבות סמיכה צרות', 2, 12, 'arms'),
                ]
            },
            {
                day: 'thursday', name: 'Lower B', nameHe: 'תחתון B', exercises: [
                    ex('דדליפט', 4, 5, 'legs'),
                    ex('מכרעים', 3, 10, 'legs'),
                    ex('פשיטות ירך', 3, 12, 'legs'),
                    ex('כפיפות ירך שכב', 3, 12, 'legs'),
                    ex('הרמות שוק ישיבה', 4, 15, 'legs'),
                ]
            },
            { day: 'friday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
            { day: 'saturday', name: 'Rest', nameHe: 'מנוחה', exercises: [], isRestDay: true },
        ],
    },
    // 10-Week Bodybuilding Program (multi-week periodization)
    BODYBUILDING_10WEEK,
];

export function getProgramById(id: string): WorkoutProgram | undefined {
    return WORKOUT_PROGRAMS.find(p => p.id === id);
}

export function getProgramsByDifficulty(difficulty: WorkoutProgram['difficulty']): WorkoutProgram[] {
    return WORKOUT_PROGRAMS.filter(p => p.difficulty === difficulty);
}

export function getAllPrograms(): WorkoutProgram[] {
    return WORKOUT_PROGRAMS;
}
