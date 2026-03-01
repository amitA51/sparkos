/**
 * Breathing Patterns - Predefined breathing exercise patterns
 * Based on scientifically-backed techniques for relaxation and focus
 */

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdEmpty';

export interface BreathingPhase {
    action: BreathPhase;
    duration: number; // in seconds
    label: string;
    labelHe: string;
}

export interface BreathingPattern {
    id: string;
    name: string;
    nameHe: string;
    description: string;
    descriptionHe: string;
    phases: BreathingPhase[];
    totalCycleDuration: number; // in seconds
    benefits: string[];
    benefitsHe: string[];
    color: string; // Theme color for the pattern
}

export const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
    boxBreathing: {
        id: 'boxBreathing',
        name: 'Box Breathing',
        nameHe: 'נשימת קופסה',
        description: 'Equal parts inhale, hold, exhale, hold. Used by Navy SEALs for stress management.',
        descriptionHe: 'חלקים שווים של שאיפה, עצירה, נשיפה, עצירה. בשימוש צבאי להתמודדות עם לחץ.',
        phases: [
            { action: 'inhale', duration: 4, label: 'Inhale', labelHe: 'שאף' },
            { action: 'hold', duration: 4, label: 'Hold', labelHe: 'החזק' },
            { action: 'exhale', duration: 4, label: 'Exhale', labelHe: 'נשוף' },
            { action: 'holdEmpty', duration: 4, label: 'Hold', labelHe: 'החזק' },
        ],
        totalCycleDuration: 16,
        benefits: ['Reduces stress', 'Improves focus', 'Lowers blood pressure'],
        benefitsHe: ['מפחית מתח', 'משפר ריכוז', 'מוריד לחץ דם'],
        color: '#3B82F6', // Blue
    },

    relaxing478: {
        id: 'relaxing478',
        name: '4-7-8 Relaxing Breath',
        nameHe: 'נשימה מרגיעה 4-7-8',
        description: 'Dr. Andrew Weil\'s technique for natural tranquilizer effect on the nervous system.',
        descriptionHe: 'טכניקה של ד"ר אנדרו וייל להרגעה טבעית של מערכת העצבים.',
        phases: [
            { action: 'inhale', duration: 4, label: 'Inhale', labelHe: 'שאף' },
            { action: 'hold', duration: 7, label: 'Hold', labelHe: 'החזק' },
            { action: 'exhale', duration: 8, label: 'Exhale', labelHe: 'נשוף' },
        ],
        totalCycleDuration: 19,
        benefits: ['Promotes sleep', 'Reduces anxiety', 'Calms the mind'],
        benefitsHe: ['מקדם שינה', 'מפחית חרדה', 'מרגיע את המוח'],
        color: '#8B5CF6', // Purple
    },

    energizing: {
        id: 'energizing',
        name: 'Energizing Breath',
        nameHe: 'נשימה מעוררת',
        description: 'Quick breaths to increase alertness and energy. Also known as Bellows Breath.',
        descriptionHe: 'נשימות מהירות להגברת ערנות ואנרגיה. ידועה גם כנשימת מפוחים.',
        phases: [
            { action: 'inhale', duration: 1, label: 'In', labelHe: 'שאף' },
            { action: 'exhale', duration: 1, label: 'Out', labelHe: 'נשוף' },
        ],
        totalCycleDuration: 2,
        benefits: ['Increases energy', 'Improves alertness', 'Warms the body'],
        benefitsHe: ['מגביר אנרגיה', 'משפר ערנות', 'מחמם את הגוף'],
        color: '#F59E0B', // Amber
    },

    coherentBreathing: {
        id: 'coherentBreathing',
        name: 'Coherent Breathing',
        nameHe: 'נשימה קוהרנטית',
        description: '5 breaths per minute for heart rate variability optimization.',
        descriptionHe: '5 נשימות לדקה לאופטימיזציה של השונות בקצב הלב.',
        phases: [
            { action: 'inhale', duration: 6, label: 'Inhale', labelHe: 'שאף' },
            { action: 'exhale', duration: 6, label: 'Exhale', labelHe: 'נשוף' },
        ],
        totalCycleDuration: 12,
        benefits: ['Heart coherence', 'Emotional balance', 'Stress resilience'],
        benefitsHe: ['קוהרנטיות לב', 'איזון רגשי', 'עמידות ללחץ'],
        color: '#10B981', // Emerald
    },

    physiologicalSigh: {
        id: 'physiologicalSigh',
        name: 'Physiological Sigh',
        nameHe: 'אנחה פיזיולוגית',
        description: 'Double inhale followed by long exhale. Fastest way to calm down.',
        descriptionHe: 'שאיפה כפולה ואחריה נשיפה ארוכה. הדרך המהירה ביותר להירגע.',
        phases: [
            { action: 'inhale', duration: 2, label: 'Inhale', labelHe: 'שאף' },
            { action: 'inhale', duration: 1, label: '+Inhale', labelHe: '+שאף' },
            { action: 'exhale', duration: 6, label: 'Exhale slowly', labelHe: 'נשוף לאט' },
        ],
        totalCycleDuration: 9,
        benefits: ['Rapid calm', 'Reduces CO2', 'Natural stress relief'],
        benefitsHe: ['הרגעה מהירה', 'מפחית CO2', 'הקלת מתח טבעית'],
        color: '#EC4899', // Pink
    },
};

export const DEFAULT_PATTERN_ID = 'boxBreathing';

export function getPatternById(id: string): BreathingPattern {
    return BREATHING_PATTERNS[id] ?? BREATHING_PATTERNS[DEFAULT_PATTERN_ID]!;
}

export function getAllPatterns(): BreathingPattern[] {
    return Object.values(BREATHING_PATTERNS);
}
