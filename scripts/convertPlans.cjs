/**
 * convertPlans.js - Converts workout plan MD files → TypeScript data
 * Reads 60 MD files (10 weeks × 6 days) and generates bodybuilding10week.ts
 */
const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(__dirname, '..', 'plans copy');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'bodybuilding10week.ts');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

// Muscle group detection from exercise name
function detectMuscleGroup(exerciseName) {
    const name = exerciseName.toLowerCase();
    if (name.includes('bench press') || name.includes('flye') || name.includes('crossover') || name.includes('chest press') || name.includes('push-up') || name.includes('dip'))
        return 'chest';
    if (name.includes('pull-up') || name.includes('pulldown') || name.includes('row') || name.includes('deadlift') || name.includes('rdl') || name.includes('hyperextension') || name.includes('pull-through'))
        return 'back';
    if (name.includes('shoulder press') || name.includes('lateral raise') || name.includes('rear delt') || name.includes('face pull'))
        return 'shoulders';
    if (name.includes('squat') || name.includes('lunge') || name.includes('leg press') || name.includes('leg extension') || name.includes('hack squat') || name.includes('step-up'))
        return 'quads';
    if (name.includes('leg curl') || name.includes('ham') || name.includes('nordic'))
        return 'hamstrings';
    if (name.includes('calf') || name.includes('calf raise') || name.includes('calf press'))
        return 'calves';
    if (name.includes('curl') || name.includes('bicep') || name.includes('bayesian'))
        return 'biceps';
    if (name.includes('tricep') || name.includes('skull crusher') || name.includes('kickback') || name.includes('pushdown') || name.includes('extension') && name.includes('tricep'))
        return 'triceps';
    if (name.includes('crunch') || name.includes('leg raise') || name.includes('ab') || name.includes('candlestick') || name.includes('plank'))
        return 'abs';
    if (name.includes('shrug') || name.includes('trap'))
        return 'traps';
    if (name.includes('hip abduction') || name.includes('glute') || name.includes('hip thrust'))
        return 'glutes';
    if (name.includes('overhead') && name.includes('extension'))
        return 'triceps';
    return 'other';
}

// Parse a single exercise block from MD
function parseExercise(block) {
    const lines = block.trim().split('\n');
    const titleLine = lines.find(l => l.startsWith('## '));
    if (!titleLine) return null;

    // Extract exercise name (remove "תרגיל X: ")
    const nameMatch = titleLine.replace('## ', '').match(/(?:תרגיל \d+:\s*)?(.+)/);
    const name = nameMatch ? nameMatch[1].trim() : titleLine.replace('## ', '').trim();

    // Parse sets/reps line
    let sets = 1, reps = 10, warmupSets = '', restTime = '';
    const paramLine = lines.find(l => l.includes('**סטים:**'));
    if (paramLine) {
        const setsMatch = paramLine.match(/\*\*סטים:\*\*\s*(\d+)/);
        const repsMatch = paramLine.match(/\*\*חזרות:\*\*\s*([\d-]+)/);
        const warmupMatch = paramLine.match(/\*\*סטי חימום:\*\*\s*([\d-]+)/);
        const restMatch = paramLine.match(/\*\*מנוחה:\*\*\s*([^\|]+)/);

        if (setsMatch) sets = parseInt(setsMatch[1]);
        if (repsMatch) {
            const repRange = repsMatch[1];
            reps = parseInt(repRange.split('-')[0]); // Use lower bound
        }
        if (warmupMatch) warmupSets = warmupMatch[1].trim();
        if (restMatch) restTime = restMatch[1].trim();
    }

    // Parse RPE
    let rpeTarget = '';
    let intensityTechnique = '';
    const rpeLines = [];
    let inRPE = false;
    for (const line of lines) {
        if (line.includes('**עצימות:**')) { inRPE = true; continue; }
        if (inRPE && line.startsWith('-')) {
            rpeLines.push(line.replace(/^-\s*/, '').trim());
        }
        if (inRPE && !line.startsWith('-') && line.trim() !== '' && !line.includes('**עצימות:**')) {
            inRPE = false;
        }
    }
    const lastRPE = rpeLines.find(l => l.includes('Last Set RPE'));
    const earlyRPE = rpeLines.find(l => l.includes('Early Sets RPE'));
    const technique = rpeLines.find(l => l.includes('Intensity Technique'));

    if (lastRPE) {
        const match = lastRPE.match(/RPE:\s*(.*)/);
        if (match) rpeTarget = earlyRPE ? `Early: ${earlyRPE.match(/RPE:\s*(.*)/)?.[1] || ''}, Last: ${match[1]}` : match[1];
    }
    if (technique) {
        const match = technique.match(/Intensity Technique:\s*(.*)/);
        if (match) intensityTechnique = match[1].trim();
    }

    // Parse alternatives
    const alternatives = [];
    let inAlt = false;
    for (const line of lines) {
        if (line.includes('**תרגילי חלופה:**')) { inAlt = true; continue; }
        if (inAlt && line.startsWith('-')) {
            alternatives.push(line.replace(/^-\s*/, '').trim());
        }
        if (inAlt && !line.startsWith('-') && line.trim() !== '' && !line.includes('**תרגילי חלופה:**')) {
            inAlt = false;
        }
    }

    // Parse notes
    let notes = '';
    const noteLine = lines.find(l => l.startsWith('>'));
    if (noteLine) {
        notes = noteLine.replace(/^>\s*/, '').trim();
    }

    const muscleGroup = detectMuscleGroup(name);

    return { name, sets, reps, muscleGroup, warmupSets, restTime, rpeTarget, intensityTechnique, alternatives, notes };
}

// Parse a full day MD file
function parseDayFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const blocks = content.split('---').filter(b => b.trim().startsWith('##'));
    return blocks.map(parseExercise).filter(Boolean);
}

// Map day number (1-6) to actual day of week (skip rest day on Wednesday = index 3)
function dayNumberToWeekday(dayNum) {
    // Day 1=Sunday, 2=Monday, 3=Tuesday, skip Wednesday (rest), 4=Thursday, 5=Friday, 6=Saturday
    const mapping = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 5, 6: 6 }; // 0=sun, 1=mon, ...
    return mapping[dayNum] ?? (dayNum - 1);
}

// Get week phase label
function getWeekLabel(weekNum) {
    if (weekNum <= 2) return 'הסתגלות';
    if (weekNum <= 6) return 'בנייה';
    return 'שיא';
}

// Main conversion
function convert() {
    const weeklySchedules = [];

    for (let week = 1; week <= 10; week++) {
        const weekDir = `שבוע_${String(week).padStart(2, '0')}`;
        const weekPath = path.join(PLANS_DIR, weekDir);

        if (!fs.existsSync(weekPath)) {
            console.warn(`⚠️  Week folder not found: ${weekDir}`);
            continue;
        }

        const days = [];
        for (let day = 1; day <= 6; day++) {
            const dayFile = `יום${day}_Workout_${day}.md`;
            const dayPath = path.join(weekPath, dayFile);

            if (!fs.existsSync(dayPath)) {
                console.warn(`⚠️  Day file not found: ${weekDir}/${dayFile}`);
                continue;
            }

            const exercises = parseDayFile(dayPath);
            const weekdayIndex = dayNumberToWeekday(day);
            const dayName = DAY_NAMES[weekdayIndex];
            const dayNameHe = DAY_NAMES_HE[weekdayIndex];

            // Determine focus from muscle groups
            const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))];
            const focusName = `יום ${day}`;

            // Build exerciseExtras
            const exerciseExtras = {};
            exercises.forEach(ex => {
                const extras = {};
                if (ex.notes) extras.notes = ex.notes;
                if (ex.alternatives.length > 0) extras.alternatives = ex.alternatives;
                if (ex.rpeTarget) extras.rpeTarget = ex.rpeTarget;
                if (ex.warmupSets) extras.warmupSets = ex.warmupSets;
                if (ex.restTime) extras.restTime = ex.restTime;
                if (ex.intensityTechnique) extras.intensityTechnique = ex.intensityTechnique;
                if (Object.keys(extras).length > 0) exerciseExtras[ex.name] = extras;
            });

            days.push({
                day: dayName,
                name: `Week ${week} Day ${day}`,
                nameHe: `שבוע ${week} - ${focusName}`,
                exercises: exercises.map(ex => ({
                    name: ex.name,
                    sets: Array.from({ length: ex.sets }, () => ({ reps: ex.reps, weight: 0 })),
                    muscleGroup: ex.muscleGroup,
                    notes: ex.notes || undefined,
                })),
                exerciseExtras: Object.keys(exerciseExtras).length > 0 ? exerciseExtras : undefined,
            });
        }

        // Add rest day (Wednesday)
        days.splice(3, 0, {
            day: 'wednesday',
            name: `Week ${week} Rest`,
            nameHe: `שבוע ${week} - מנוחה`,
            exercises: [],
            isRestDay: true,
        });

        weeklySchedules.push({
            weekNumber: week,
            label: getWeekLabel(week),
            schedule: days,
        });
    }

    // Generate TypeScript output
    let output = `import type { WorkoutProgram, WeekSchedule, ExerciseExtras } from './workoutPrograms';\n\n`;
    output += `/**\n * Bodybuilding Transformation System - 10 Week Program\n * Auto-generated from workout plan MD files\n * Generated: ${new Date().toISOString()}\n */\n\n`;

    output += `export const BODYBUILDING_10WEEK: WorkoutProgram = {\n`;
    output += `    id: 'bodybuilding-transformation-10w',\n`;
    output += `    name: 'Bodybuilding Transformation System',\n`;
    output += `    nameHe: 'בניית גוף - 10 שבועות',\n`;
    output += `    description: '10-week beginner bodybuilding program with linear periodization. Progresses from adaptation (weeks 1-2) through building (3-6) to peak intensity (7-10).',\n`;
    output += `    descriptionHe: 'תוכנית בניית גוף למתחילים ל-10 שבועות עם פרוגרסיה ליניארית. מתקדמת מהסתגלות (שבועות 1-2) דרך בנייה (3-6) לשיא עצימות (7-10).',\n`;
    output += `    difficulty: 'beginner',\n`;
    output += `    daysPerWeek: 6,\n`;
    output += `    focusAreas: ['hypertrophy', 'strength', 'balanced'],\n`;
    output += `    progressionNotes: 'Weeks 1-2: 1 set/exercise at RPE 6-7 (adaptation). Weeks 3-6: 2 sets at RPE 7-8 (building). Weeks 7-10: 2-3 sets at RPE 8-10 with failure techniques (peak).',\n`;
    output += `    progressionNotesHe: 'שבועות 1-2: סט 1 לתרגיל ב-RPE 6-7 (הסתגלות). שבועות 3-6: 2 סטים ב-RPE 7-8 (בנייה). שבועות 7-10: 2-3 סטים ב-RPE 8-10 עם טכניקות עצימות (שיא).',\n`;
    output += `    color: '#F97316',\n`;
    output += `    icon: 'flame',\n`;
    output += `    totalWeeks: 10,\n`;
    output += `    periodization: 'Linear',\n`;

    // First week as default schedule (backward compat)
    output += `    schedule: ${JSON.stringify(weeklySchedules[0].schedule, null, 8)},\n`;

    // All weeks
    output += `    weeklySchedules: ${JSON.stringify(weeklySchedules, null, 8)},\n`;

    output += `};\n`;

    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

    // Stats
    let totalExercises = 0;
    weeklySchedules.forEach(ws => {
        ws.schedule.forEach(d => {
            totalExercises += d.exercises.length;
        });
    });

    console.log(`\n✅ Conversion complete!`);
    console.log(`   📁 Output: ${OUTPUT_FILE}`);
    console.log(`   📊 Stats:`);
    console.log(`      - ${weeklySchedules.length} weeks`);
    console.log(`      - ${weeklySchedules.reduce((acc, ws) => acc + ws.schedule.filter(d => !d.isRestDay).length, 0)} training days`);
    console.log(`      - ${totalExercises} total exercise entries`);
}

convert();
