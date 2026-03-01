/**
 * AI Workout Insight Service
 * Generates smart recommendations using Gemini AI
 */

import { GoogleGenAI } from '@google/genai';
import { PersonalRecord } from './prService';
import { LastWorkoutSummary } from './analyticsService';
import { loadSettings } from './settingsService';

// Get API key from environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

export interface WorkoutInsightInput {
    lastWorkout: LastWorkoutSummary | null;
    neglectedMuscles: string[];
    recentPRs: PersonalRecord[];
    currentStreak: number;
    workoutsThisWeek: number;
}

/**
 * Generate a personalized workout insight using AI
 */
export async function generateAIWorkoutInsight(input: WorkoutInsightInput): Promise<string> {
    const { lastWorkout, neglectedMuscles, recentPRs, currentStreak, workoutsThisWeek } = input;

    // Fallback if AI is not available
    if (!ai) {
        return getFallbackInsight(neglectedMuscles, recentPRs);
    }

    // Build context for AI
    const contextParts: string[] = [];

    if (lastWorkout) {
        contextParts.push(
            `אימון אחרון: לפני ${lastWorkout.daysSince} ימים, ` +
            `משך ${lastWorkout.durationMinutes} דקות, ` +
            `נפח ${lastWorkout.totalVolume.toLocaleString()} ק"ג, ` +
            `קבוצות שרירים: ${lastWorkout.mainMuscleGroups.join(', ')}`
        );
    } else {
        contextParts.push('אין היסטוריית אימונים');
    }

    if (neglectedMuscles.length > 0) {
        contextParts.push(`קבוצות שרירים שלא אומנו מעל שבוע: ${neglectedMuscles.join(', ')}`);
    }

    if (recentPRs.length > 0) {
        const prSummary = recentPRs
            .slice(0, 3)
            .map(pr => `${pr.exerciseName}: ${pr.maxWeight}kg×${pr.maxReps}`)
            .join(', ');
        contextParts.push(`שיאים אישיים בשבוע האחרון: ${prSummary}`);
    }

    contextParts.push(`רצף אימונים נוכחי: ${currentStreak} ימים`);
    contextParts.push(`אימונים השבוע: ${workoutsThisWeek}`);

    const prompt = `אתה מאמן כושר מקצועי. בהתבסס על הנתונים הבאים על המתאמן, כתוב תובנה קצרה ומעודדת (עד 2 משפטים) עם המלצה אחת ספציפית:

${contextParts.join('\n')}

כתוב בעברית, בסגנון ידידותי אך מקצועי. התמקד בדבר אחד חשוב שהמתאמן יכול לעשות השבוע.`;

    try {
        const settings = loadSettings();
        const response = await ai.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });

        const text = response.text;
        if (!text) {
            return getFallbackInsight(neglectedMuscles, recentPRs);
        }
        return text.trim();
    } catch (error) {
        console.error('Failed to generate AI workout insight:', error);
        return getFallbackInsight(neglectedMuscles, recentPRs);
    }
}

/**
 * Generate a fallback insight when AI is unavailable
 */
function getFallbackInsight(neglectedMuscles: string[], recentPRs: PersonalRecord[]): string {
    if (neglectedMuscles.length > 0) {
        return `שמתי לב שלא אימנת ${neglectedMuscles[0]} כבר זמן מה. השבוע זה הזמן לתת לזה תשומת לב! 💪`;
    }
    if (recentPRs.length > 0) {
        return `כל הכבוד על השיאים האישיים! המשך לדחוף את הגבולות 🔥`;
    }
    return `המשך את המומנטום! כל אימון מקרב אותך למטרה 🎯`;
}
