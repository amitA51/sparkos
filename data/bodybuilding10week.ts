import type { WorkoutProgram } from './workoutPrograms';

/**
 * Bodybuilding Transformation System - 10 Week Program
 * Auto-generated from workout plan MD files
 * Generated: 2026-02-10T15:47:01.709Z
 */

export const BODYBUILDING_10WEEK: WorkoutProgram = {
        id: 'bodybuilding-transformation-10w',
        name: 'Bodybuilding Transformation System',
        nameHe: 'בניית גוף - 10 שבועות',
        description: '10-week beginner bodybuilding program with linear periodization. Progresses from adaptation (weeks 1-2) through building (3-6) to peak intensity (7-10).',
        descriptionHe: 'תוכנית בניית גוף למתחילים ל-10 שבועות עם פרוגרסיה ליניארית. מתקדמת מהסתגלות (שבועות 1-2) דרך בנייה (3-6) לשיא עצימות (7-10).',
        difficulty: 'beginner',
        daysPerWeek: 6,
        focusAreas: ['hypertrophy', 'strength', 'balanced'],
        progressionNotes: 'Weeks 1-2: 1 set/exercise at RPE 6-7 (adaptation). Weeks 3-6: 2 sets at RPE 7-8 (building). Weeks 7-10: 2-3 sets at RPE 8-10 with failure techniques (peak).',
        progressionNotesHe: 'שבועות 1-2: סט 1 לתרגיל ב-RPE 6-7 (הסתגלות). שבועות 3-6: 2 סטים ב-RPE 7-8 (בנייה). שבועות 7-10: 2-3 סטים ב-RPE 8-10 עם טכניקות עצימות (שיא).',
        color: '#F97316',
        icon: 'flame',
        totalWeeks: 10,
        periodization: 'Linear',
        schedule: [
                {
                        "day": "sunday",
                        "name": "Week 1 Day 1",
                        "nameHe": "שבוע 1 - יום 1",
                        "exercises": [
                                {
                                        "name": "45° Incline Barbell Press",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "other",
                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                },
                                {
                                        "name": "Cable Crossover Ladder",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "chest",
                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                },
                                {
                                        "name": "Wide-Grip Pull-Up",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                },
                                {
                                        "name": "High-Cable Lateral Raise",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "shoulders",
                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                },
                                {
                                        "name": "Pendlay Deficit Row",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                },
                                {
                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "triceps",
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                },
                                {
                                        "name": "Bayesian Cable Curl",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "biceps",
                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                }
                        ],
                        "exerciseExtras": {
                                "45° Incline Barbell Press": {
                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                        "alternatives": [
                                                "45° Incline DB Press",
                                                "45° Incline Machine Press"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "3-5 min"
                                },
                                "Cable Crossover Ladder": {
                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                        "alternatives": [
                                                "Pec Deck",
                                                "Bottom-Half DB Flye"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Wide-Grip Pull-Up": {
                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                        "alternatives": [
                                                "Wide-Grip Lat Pulldown",
                                                "Dual-Handle Lat Pulldown"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "1-2",
                                        "restTime": "2-3 min"
                                },
                                "High-Cable Lateral Raise": {
                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                        "alternatives": [
                                                "High-Cable Cuffed Lateral Raise",
                                                "Lean-In DB Lateral Raise"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Pendlay Deficit Row": {
                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                        "alternatives": [
                                                "Smith Machine Row",
                                                "Single-Arm DB Row"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "1-2",
                                        "restTime": "2-3 min"
                                },
                                "Overhead Cable Triceps Extension (Bar)": {
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                        "alternatives": [
                                                "Overhead Cable Triceps Extension (Rope)",
                                                "DB Skull Crusher"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Bayesian Cable Curl": {
                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                        "alternatives": [
                                                "Seated Super- Bayesian High Cable Curl",
                                                "Incline DB Stretch Curl"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                }
                        }
                },
                {
                        "day": "monday",
                        "name": "Week 1 Day 2",
                        "nameHe": "שבוע 1 - יום 2",
                        "exercises": [
                                {
                                        "name": "Lying Leg Curl",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "hamstrings",
                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                },
                                {
                                        "name": "Smith Machine Squat",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "quads",
                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                },
                                {
                                        "name": "Barbell RDL",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                },
                                {
                                        "name": "Leg Extension",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "quads",
                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                },
                                {
                                        "name": "Standing Calf Raise",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "calves",
                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                },
                                {
                                        "name": "Cable Crunch",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "abs",
                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                }
                        ],
                        "exerciseExtras": {
                                "Lying Leg Curl": {
                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                        "alternatives": [
                                                "Seated Leg Curl",
                                                "Nordic Ham Curl"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "2",
                                        "restTime": "1-2 min"
                                },
                                "Smith Machine Squat": {
                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                        "alternatives": [
                                                "DB Bulgarian Split Squat",
                                                "High-Bar Back Squat"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-4",
                                        "restTime": "3-5 min"
                                },
                                "Barbell RDL": {
                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                        "alternatives": [
                                                "DB RDL",
                                                "Snatch-Grip RDL"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-4",
                                        "restTime": "2-3 min"
                                },
                                "Leg Extension": {
                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                        "alternatives": [
                                                "Reverse Nordic",
                                                "Sissy Squat"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Standing Calf Raise": {
                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                        "alternatives": [
                                                "Seated Calf Raise",
                                                "Leg Press Calf Press"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Cable Crunch": {
                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                        "alternatives": [
                                                "Decline Weighted Crunch",
                                                "Machine Crunch"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                }
                        }
                },
                {
                        "day": "tuesday",
                        "name": "Week 1 Day 3",
                        "nameHe": "שבוע 1 - יום 3",
                        "exercises": [
                                {
                                        "name": "Neutral-Grip Lat Pulldown",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                },
                                {
                                        "name": "Chest-Supported Machine Row",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                },
                                {
                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "chest",
                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                },
                                {
                                        "name": "Machine Shrug",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "traps",
                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                },
                                {
                                        "name": "EZ-Bar Cable Curl",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "biceps",
                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                },
                                {
                                        "name": "Machine Preacher Curl",
                                        "sets": [
                                                {
                                                        "reps": 12,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "biceps",
                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                }
                        ],
                        "exerciseExtras": {
                                "Neutral-Grip Lat Pulldown": {
                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                        "alternatives": [
                                                "Neutral-Grip Pull- Up",
                                                "Dual-Handle Lat Pulldown"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "2-3 min"
                                },
                                "Chest-Supported Machine Row": {
                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                        "alternatives": [
                                                "Chest-Supported T-Bar Row",
                                                "Incline Chest- Supported DB Row"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "2-3 min"
                                },
                                "1-Arm 45° Cable Rear Delt Flye": {
                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                        "alternatives": [
                                                "Rope Face Pull",
                                                "Reverse Pec Deck"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Machine Shrug": {
                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                        "alternatives": [
                                                "Cable Paused Shrug-In",
                                                "DB Shrug"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "1-2 min"
                                },
                                "EZ-Bar Cable Curl": {
                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                        "alternatives": [
                                                "EZ-Bar Curl",
                                                "DB Curl"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Machine Preacher Curl": {
                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                        "alternatives": [
                                                "EZ-Bar Preacher Curl",
                                                "DB Preacher Curl"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                }
                        }
                },
                {
                        "day": "wednesday",
                        "name": "Week 1 Rest",
                        "nameHe": "שבוע 1 - מנוחה",
                        "exercises": [],
                        "isRestDay": true
                },
                {
                        "day": "thursday",
                        "name": "Week 1 Day 4",
                        "nameHe": "שבוע 1 - יום 4",
                        "exercises": [
                                {
                                        "name": "Barbell Bench Press",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "chest",
                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                },
                                {
                                        "name": "Machine Shoulder Press",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "shoulders",
                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                },
                                {
                                        "name": "Bottom-Half DB Flye",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "chest",
                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                },
                                {
                                        "name": "High-Cable Lateral Raise",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "shoulders",
                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                },
                                {
                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "triceps",
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                },
                                {
                                        "name": "Cable Triceps Kickback",
                                        "sets": [
                                                {
                                                        "reps": 12,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "triceps",
                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                },
                                {
                                        "name": "Lying Leg Raise",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "abs",
                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set"
                                }
                        ],
                        "exerciseExtras": {
                                "Barbell Bench Press": {
                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                        "alternatives": [
                                                "Machine Chest Press",
                                                "DB Bench Press"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-4",
                                        "restTime": "3-5 min"
                                },
                                "Machine Shoulder Press": {
                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                        "alternatives": [
                                                "Cable Shoulder Press",
                                                "Seated DB Shoulder Press"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "2-3 min"
                                },
                                "Bottom-Half DB Flye": {
                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                        "alternatives": [
                                                "Bottom-Half Seated Cable Flye",
                                                "Low-to-High Cable Crossover"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "High-Cable Lateral Raise": {
                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                        "alternatives": [
                                                "High-Cable Cuffed Lateral Raise",
                                                "Lean-In DB Lateral Raise"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Overhead Cable Triceps Extension (Bar)": {
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                        "alternatives": [
                                                "Overhead Cable Triceps Extension (Rope)",
                                                "DB Skull Crusher"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Cable Triceps Kickback": {
                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                        "alternatives": [
                                                "DB Triceps Kickback",
                                                "Bench Dip"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Lying Leg Raise": {
                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set",
                                        "alternatives": [
                                                "Hanging Leg Raise",
                                                "Modified Candlestick"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                }
                        }
                },
                {
                        "day": "friday",
                        "name": "Week 1 Day 5",
                        "nameHe": "שבוע 1 - יום 5",
                        "exercises": [
                                {
                                        "name": "Leg Press",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "quads",
                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                },
                                {
                                        "name": "Seated Leg Curl",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "hamstrings",
                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                },
                                {
                                        "name": "Walking Lunge",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "quads",
                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                },
                                {
                                        "name": "Machine Hip Abduction",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "abs",
                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                },
                                {
                                        "name": "Standing Calf Raise",
                                        "sets": [
                                                {
                                                        "reps": 10,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "calves",
                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                }
                        ],
                        "exerciseExtras": {
                                "Leg Press": {
                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                        "alternatives": [
                                                "Smith Machine Static Lunge",
                                                "DB Walking Lunge"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-4",
                                        "restTime": "2-3 min"
                                },
                                "Seated Leg Curl": {
                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                        "alternatives": [
                                                "Lying Leg Curl",
                                                "Nordic Ham Curl"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Walking Lunge": {
                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                        "alternatives": [
                                                "DB Step-Up",
                                                "Goblet Squat"
                                        ],
                                        "rpeTarget": "~6",
                                        "warmupSets": "2-3",
                                        "restTime": "2-3 min"
                                },
                                "Machine Hip Abduction": {
                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                        "alternatives": [
                                                "Cable Hip Abduction",
                                                "Lateral Band Walk"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Standing Calf Raise": {
                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                        "alternatives": [
                                                "Seated Calf Raise",
                                                "Leg Press Calf Press"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                }
                        }
                },
                {
                        "day": "saturday",
                        "name": "Week 1 Day 6",
                        "nameHe": "שבוע 1 - יום 6",
                        "exercises": [
                                {
                                        "name": "45° Incline Barbell Press",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "other",
                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                },
                                {
                                        "name": "Cable Crossover Ladder",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "chest",
                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                },
                                {
                                        "name": "Wide-Grip Pull-Up",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                },
                                {
                                        "name": "High-Cable Lateral Raise",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "shoulders",
                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                },
                                {
                                        "name": "Pendlay Deficit Row",
                                        "sets": [
                                                {
                                                        "reps": 6,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "back",
                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                },
                                {
                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "triceps",
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                },
                                {
                                        "name": "Bayesian Cable Curl",
                                        "sets": [
                                                {
                                                        "reps": 8,
                                                        "weight": 0
                                                }
                                        ],
                                        "muscleGroup": "biceps",
                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                }
                        ],
                        "exerciseExtras": {
                                "45° Incline Barbell Press": {
                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                        "alternatives": [
                                                "45° Incline DB Press",
                                                "45° Incline Machine Press"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "2-3",
                                        "restTime": "3-5 min"
                                },
                                "Cable Crossover Ladder": {
                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                        "alternatives": [
                                                "Pec Deck",
                                                "Bottom-Half DB Flye"
                                        ],
                                        "rpeTarget": "~8",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Wide-Grip Pull-Up": {
                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                        "alternatives": [
                                                "Wide-Grip Lat Pulldown",
                                                "Dual-Handle Lat Pulldown"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "2-3 min"
                                },
                                "High-Cable Lateral Raise": {
                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                        "alternatives": [
                                                "High-Cable Cuffed Lateral Raise",
                                                "Lean-In DB Lateral Raise"
                                        ],
                                        "rpeTarget": "~8",
                                        "warmupSets": "1-2",
                                        "restTime": "1-2 min"
                                },
                                "Pendlay Deficit Row": {
                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                        "alternatives": [
                                                "Smith Machine Row",
                                                "Single-Arm DB Row"
                                        ],
                                        "rpeTarget": "~7",
                                        "warmupSets": "1-2",
                                        "restTime": "2-3 min"
                                },
                                "Overhead Cable Triceps Extension (Bar)": {
                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                        "alternatives": [
                                                "Overhead Cable Triceps Extension (Rope)",
                                                "DB Skull Crusher"
                                        ],
                                        "rpeTarget": "~8",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                },
                                "Bayesian Cable Curl": {
                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                        "alternatives": [
                                                "Seated Super- Bayesian High Cable Curl",
                                                "Incline DB Stretch Curl"
                                        ],
                                        "rpeTarget": "~8",
                                        "warmupSets": "1",
                                        "restTime": "1-2 min"
                                }
                        }
                }
        ],
        weeklySchedules: [
                {
                        "weekNumber": 1,
                        "label": "הסתגלות",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 1 Day 1",
                                        "nameHe": "שבוע 1 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline Barbell Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Cable Crossover Ladder",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                                },
                                                {
                                                        "name": "Wide-Grip Pull-Up",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Pendlay Deficit Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline Barbell Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline DB Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Cable Crossover Ladder": {
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                                        "alternatives": [
                                                                "Pec Deck",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Wide-Grip Pull-Up": {
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Pendlay Deficit Row": {
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                                        "alternatives": [
                                                                "Smith Machine Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 1 Day 2",
                                        "nameHe": "שבוע 1 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                                },
                                                {
                                                        "name": "Barbell RDL",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Cable Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Squat": {
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Barbell RDL": {
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                                        "alternatives": [
                                                                "DB RDL",
                                                                "Snatch-Grip RDL"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Machine Crunch"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 1 Day 3",
                                        "nameHe": "שבוע 1 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Neutral-Grip Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                                },
                                                {
                                                        "name": "Chest-Supported Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Machine Shrug",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "traps",
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                                },
                                                {
                                                        "name": "EZ-Bar Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                                },
                                                {
                                                        "name": "Machine Preacher Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Neutral-Grip Lat Pulldown": {
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                                        "alternatives": [
                                                                "Neutral-Grip Pull- Up",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported Machine Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported T-Bar Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Shrug": {
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                                        "alternatives": [
                                                                "Cable Paused Shrug-In",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Cable Curl": {
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                                        "alternatives": [
                                                                "EZ-Bar Curl",
                                                                "DB Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Preacher Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "EZ-Bar Preacher Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 1 Rest",
                                        "nameHe": "שבוע 1 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 1 Day 4",
                                        "nameHe": "שבוע 1 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Barbell Bench Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                                },
                                                {
                                                        "name": "Machine Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half DB Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Cable Triceps Kickback",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                                },
                                                {
                                                        "name": "Lying Leg Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set"
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Barbell Bench Press": {
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                                        "alternatives": [
                                                                "Machine Chest Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Machine Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Seated DB Shoulder Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half DB Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half Seated Cable Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Triceps Kickback": {
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                                        "alternatives": [
                                                                "DB Triceps Kickback",
                                                                "Bench Dip"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Lying Leg Raise": {
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set",
                                                        "alternatives": [
                                                                "Hanging Leg Raise",
                                                                "Modified Candlestick"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 1 Day 5",
                                        "nameHe": "שבוע 1 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Leg Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Leg Press": {
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "DB Step-Up",
                                                                "Goblet Squat"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 1 Day 6",
                                        "nameHe": "שבוע 1 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline Barbell Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Cable Crossover Ladder",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                                },
                                                {
                                                        "name": "Wide-Grip Pull-Up",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Pendlay Deficit Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline Barbell Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "45° Incline DB Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Cable Crossover Ladder": {
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                                        "alternatives": [
                                                                "Pec Deck",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Wide-Grip Pull-Up": {
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Pendlay Deficit Row": {
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                                        "alternatives": [
                                                                "Smith Machine Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 2,
                        "label": "הסתגלות",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 2 Day 1",
                                        "nameHe": "שבוע 2 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                                },
                                                {
                                                        "name": "Barbell RDL",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Cable Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Squat": {
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Barbell RDL": {
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                                        "alternatives": [
                                                                "DB RDL",
                                                                "Snatch-Grip RDL"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Machine Crunch"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 2 Day 2",
                                        "nameHe": "שבוע 2 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Neutral-Grip Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                                },
                                                {
                                                        "name": "Chest-Supported Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Machine Shrug",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "traps",
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                                },
                                                {
                                                        "name": "EZ-Bar Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                                },
                                                {
                                                        "name": "Machine Preacher Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Neutral-Grip Lat Pulldown": {
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                                        "alternatives": [
                                                                "Neutral-Grip Pull- Up",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported Machine Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported T-Bar Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Shrug": {
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                                        "alternatives": [
                                                                "Cable Paused Shrug-In",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Cable Curl": {
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                                        "alternatives": [
                                                                "EZ-Bar Curl",
                                                                "DB Curl"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Preacher Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "EZ-Bar Preacher Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 2 Day 3",
                                        "nameHe": "שבוע 2 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Barbell Bench Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                                },
                                                {
                                                        "name": "Machine Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half DB Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Cable Triceps Kickback",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                                },
                                                {
                                                        "name": "Lying Leg Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Barbell Bench Press": {
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                                        "alternatives": [
                                                                "Machine Chest Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Machine Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Seated DB Shoulder Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half DB Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half Seated Cable Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Triceps Kickback": {
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                                        "alternatives": [
                                                                "DB Triceps Kickback",
                                                                "Bench Dip"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Lying Leg Raise": {
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set.",
                                                        "alternatives": [
                                                                "Hanging Leg Raise",
                                                                "Modified Candlestick"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 2 Rest",
                                        "nameHe": "שבוע 2 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 2 Day 4",
                                        "nameHe": "שבוע 2 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Leg Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Leg Press": {
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "DB Step-Up",
                                                                "Goblet Squat"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 2 Day 5",
                                        "nameHe": "שבוע 2 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline Barbell Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Cable Crossover Ladder",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                                },
                                                {
                                                        "name": "Wide-Grip Pull-Up",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Pendlay Deficit Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline Barbell Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "45° Incline DB Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Cable Crossover Ladder": {
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                                        "alternatives": [
                                                                "Pec Deck",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Wide-Grip Pull-Up": {
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Pendlay Deficit Row": {
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                                        "alternatives": [
                                                                "Smith Machine Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 2 Day 6",
                                        "nameHe": "שבוע 2 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                                },
                                                {
                                                        "name": "Barbell RDL",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Cable Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Squat": {
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Barbell RDL": {
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                                        "alternatives": [
                                                                "DB RDL",
                                                                "Snatch-Grip RDL"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Machine Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 3,
                        "label": "בנייה",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 3 Day 1",
                                        "nameHe": "שבוע 3 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Neutral-Grip Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                                },
                                                {
                                                        "name": "Chest-Supported Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Machine Shrug",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "traps",
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                                },
                                                {
                                                        "name": "EZ-Bar Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                                },
                                                {
                                                        "name": "Machine Preacher Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Neutral-Grip Lat Pulldown": {
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                                        "alternatives": [
                                                                "Neutral-Grip Pull- Up",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported Machine Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported T-Bar Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Shrug": {
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                                        "alternatives": [
                                                                "Cable Paused Shrug-In",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Cable Curl": {
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                                        "alternatives": [
                                                                "EZ-Bar Curl",
                                                                "DB Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Preacher Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "EZ-Bar Preacher Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 3 Day 2",
                                        "nameHe": "שבוע 3 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Barbell Bench Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                                },
                                                {
                                                        "name": "Machine Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half DB Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Cable Triceps Kickback",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                                },
                                                {
                                                        "name": "Lying Leg Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Barbell Bench Press": {
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                                        "alternatives": [
                                                                "Machine Chest Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Machine Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Seated DB Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half DB Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half Seated Cable Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Triceps Kickback": {
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                                        "alternatives": [
                                                                "DB Triceps Kickback",
                                                                "Bench Dip"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Lying Leg Raise": {
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set.",
                                                        "alternatives": [
                                                                "Hanging Leg Raise",
                                                                "Modified Candlestick"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 3 Day 3",
                                        "nameHe": "שבוע 3 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Leg Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Leg Press": {
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "DB Step-Up",
                                                                "Goblet Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 3 Rest",
                                        "nameHe": "שבוע 3 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 3 Day 4",
                                        "nameHe": "שבוע 3 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline Barbell Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Cable Crossover Ladder",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                                },
                                                {
                                                        "name": "Wide-Grip Pull-Up",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Pendlay Deficit Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline Barbell Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "45° Incline DB Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Cable Crossover Ladder": {
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                                        "alternatives": [
                                                                "Pec Deck",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Wide-Grip Pull-Up": {
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Pendlay Deficit Row": {
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                                        "alternatives": [
                                                                "Smith Machine Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 3 Day 5",
                                        "nameHe": "שבוע 3 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                                },
                                                {
                                                        "name": "Barbell RDL",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Cable Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Squat": {
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Barbell RDL": {
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                                        "alternatives": [
                                                                "DB RDL",
                                                                "Snatch-Grip RDL"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Machine Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 3 Day 6",
                                        "nameHe": "שבוע 3 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Neutral-Grip Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                                },
                                                {
                                                        "name": "Chest-Supported Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Machine Shrug",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "traps",
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                                },
                                                {
                                                        "name": "EZ-Bar Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                                },
                                                {
                                                        "name": "Machine Preacher Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Neutral-Grip Lat Pulldown": {
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                                        "alternatives": [
                                                                "Neutral-Grip Pull- Up",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported Machine Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported T-Bar Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Shrug": {
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                                        "alternatives": [
                                                                "Cable Paused Shrug-In",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Cable Curl": {
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                                        "alternatives": [
                                                                "EZ-Bar Curl",
                                                                "DB Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Preacher Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "EZ-Bar Preacher Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 4,
                        "label": "בנייה",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 4 Day 1",
                                        "nameHe": "שבוע 4 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Barbell Bench Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                                },
                                                {
                                                        "name": "Machine Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half DB Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Cable Triceps Kickback",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                                },
                                                {
                                                        "name": "Lying Leg Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Barbell Bench Press": {
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                                        "alternatives": [
                                                                "Machine Chest Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Machine Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Seated DB Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half DB Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half Seated Cable Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Triceps Kickback": {
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                                        "alternatives": [
                                                                "DB Triceps Kickback",
                                                                "Bench Dip"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Lying Leg Raise": {
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set.",
                                                        "alternatives": [
                                                                "Hanging Leg Raise",
                                                                "Modified Candlestick"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 4 Day 2",
                                        "nameHe": "שבוע 4 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Leg Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Leg Press": {
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "DB Step-Up",
                                                                "Goblet Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 4 Day 3",
                                        "nameHe": "שבוע 4 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline Barbell Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Cable Crossover Ladder",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer."
                                                },
                                                {
                                                        "name": "Wide-Grip Pull-Up",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Pendlay Deficit Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline Barbell Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "45° Incline DB Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Cable Crossover Ladder": {
                                                        "notes": "Do one set with low cable position, one set with medium-height cable position, and one height with a high cable position. If you only have one or two sets, choose the one or two cable positions you prefer.",
                                                        "alternatives": [
                                                                "Pec Deck",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Wide-Grip Pull-Up": {
                                                        "notes": "1.5x shoulder width overhand grip. Slow 2-3 second negative. Feel your lats pulling apart on the way down.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Pendlay Deficit Row": {
                                                        "notes": "Stand on a bumper plate. Focus on getting a big stretch and touch your stomach/chest on each rep!",
                                                        "alternatives": [
                                                                "Smith Machine Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 4 Rest",
                                        "nameHe": "שבוע 4 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 4 Day 4",
                                        "nameHe": "שבוע 4 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit."
                                                },
                                                {
                                                        "name": "Barbell RDL",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion)."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 6,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Cable Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Squat": {
                                                        "notes": "Once you are under the bar, set up your feet as you would a normal squat and then bring them forward ~3-6 inches. This will cause you to lean back into the bar slightly, allowing for a more upright squat, while also placing more tension on the quads. If your heels are raising at the bottom, you may need to bring your feet more forward. If your feet feel like they are slipping or your lower back is rounding at the bottom, try bringing your feet back a bit.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Barbell RDL": {
                                                        "notes": "To keep tension on the hamstrings, stop about 75% of the way to full lockout on each rep (i.e. stay in the bottom 3/4 of the range of motion).",
                                                        "alternatives": [
                                                                "DB RDL",
                                                                "Snatch-Grip RDL"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Machine Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 4 Day 5",
                                        "nameHe": "שבוע 4 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Neutral-Grip Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using."
                                                },
                                                {
                                                        "name": "Chest-Supported Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Machine Shrug",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "traps",
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!"
                                                },
                                                {
                                                        "name": "EZ-Bar Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!"
                                                },
                                                {
                                                        "name": "Machine Preacher Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Neutral-Grip Lat Pulldown": {
                                                        "notes": "Do these pulldowns with the handle more out in front of you, more like a cross between pullover and a pulldown. Focus on feeling your lats working more than the weight you're using.",
                                                        "alternatives": [
                                                                "Neutral-Grip Pull- Up",
                                                                "Dual-Handle Lat Pulldown"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported Machine Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported T-Bar Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Shrug": {
                                                        "notes": "Brief pause at the top of the bottom of ROM. Think about pulling your shoulders up to your ears!",
                                                        "alternatives": [
                                                                "Cable Paused Shrug-In",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Cable Curl": {
                                                        "notes": "Set up the cable at the lowest position. Maintain constant tension on the biceps. Slow, controlled reps!",
                                                        "alternatives": [
                                                                "EZ-Bar Curl",
                                                                "DB Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Preacher Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "EZ-Bar Preacher Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 4 Day 6",
                                        "nameHe": "שבוע 4 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Barbell Bench Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep."
                                                },
                                                {
                                                        "name": "Machine Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half DB Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Cable Triceps Kickback",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso."
                                                },
                                                {
                                                        "name": "Lying Leg Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Barbell Bench Press": {
                                                        "notes": "Set up a comfortable arch, quick pause on the chest and explode up on each rep.",
                                                        "alternatives": [
                                                                "Machine Chest Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Machine Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Seated DB Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half DB Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half Seated Cable Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Triceps Kickback": {
                                                        "notes": "There are two ways you can do this: upright or bent over. Choose the one that feels more comfortable for you. The main thing is that when you're in the full squeeze, your shoulder should be positioned back behind your torso.",
                                                        "alternatives": [
                                                                "DB Triceps Kickback",
                                                                "Bench Dip"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Lying Leg Raise": {
                                                        "notes": "Perform these slowly, focus on keeping your lower back against the ground throughout the set.",
                                                        "alternatives": [
                                                                "Hanging Leg Raise",
                                                                "Modified Candlestick"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 5,
                        "label": "בנייה",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 5 Day 1",
                                        "nameHe": "שבוע 5 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Leg Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Leg Press": {
                                                        "notes": "Feet lower on the platform for more quad focus. Get as deep as you can without excessive back rounding. Control the negative and do a slight pause at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "DB Step-Up",
                                                                "Goblet Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~7",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 5 Day 2",
                                        "nameHe": "שבוע 5 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 5 Day 3",
                                        "nameHe": "שבוע 5 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 5 Rest",
                                        "nameHe": "שבוע 5 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 5 Day 4",
                                        "nameHe": "שבוע 5 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 5 Day 5",
                                        "nameHe": "שבוע 5 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 5 Day 6",
                                        "nameHe": "שבוע 5 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "~6",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "~7",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 6,
                        "label": "בנייה",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 6 Day 1",
                                        "nameHe": "שבוע 6 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 6 Day 2",
                                        "nameHe": "שבוע 6 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 6 Day 3",
                                        "nameHe": "שבוע 6 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 6 Rest",
                                        "nameHe": "שבוע 6 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 6 Day 4",
                                        "nameHe": "שבוע 6 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 6 Day 5",
                                        "nameHe": "שבוע 6 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 6 Day 6",
                                        "nameHe": "שבוע 6 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 7,
                        "label": "שיא",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 7 Day 1",
                                        "nameHe": "שבוע 7 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 7 Day 2",
                                        "nameHe": "שבוע 7 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 7 Day 3",
                                        "nameHe": "שבוע 7 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 7 Rest",
                                        "nameHe": "שבוע 7 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 7 Day 4",
                                        "nameHe": "שבוע 7 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 7 Day 5",
                                        "nameHe": "שבוע 7 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 7 Day 6",
                                        "nameHe": "שבוע 7 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 8,
                        "label": "שיא",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 8 Day 1",
                                        "nameHe": "שבוע 8 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 8 Day 2",
                                        "nameHe": "שבוע 8 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 8 Day 3",
                                        "nameHe": "שבוע 8 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 8 Rest",
                                        "nameHe": "שבוע 8 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 8 Day 4",
                                        "nameHe": "שבוע 8 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 8 Day 5",
                                        "nameHe": "שבוע 8 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 8 Day 6",
                                        "nameHe": "שבוע 8 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 9,
                        "label": "שיא",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 9 Day 1",
                                        "nameHe": "שבוע 9 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 9 Day 2",
                                        "nameHe": "שבוע 9 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 9 Day 3",
                                        "nameHe": "שבוע 9 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 9 Rest",
                                        "nameHe": "שבוע 9 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 9 Day 4",
                                        "nameHe": "שבוע 9 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 9 Day 5",
                                        "nameHe": "שבוע 9 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 9 Day 6",
                                        "nameHe": "שבוע 9 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                }
                        ]
                },
                {
                        "weekNumber": 10,
                        "label": "שיא",
                        "schedule": [
                                {
                                        "day": "sunday",
                                        "name": "Week 10 Day 1",
                                        "nameHe": "שבוע 10 - יום 1",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "monday",
                                        "name": "Week 10 Day 2",
                                        "nameHe": "שבוע 10 - יום 2",
                                        "exercises": [
                                                {
                                                        "name": "45° Incline DB Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs"
                                                },
                                                {
                                                        "name": "Pec Deck",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "other",
                                                        "notes": "Focus on bringing your elbows together - not your hands"
                                                },
                                                {
                                                        "name": "Dual-Handle Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "Smith Machine Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle"
                                                },
                                                {
                                                        "name": "Overhead Cable Triceps Extension (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep"
                                                },
                                                {
                                                        "name": "Bayesian Cable Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "45° Incline DB Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs",
                                                        "alternatives": [
                                                                "45° Incline Barbell Press",
                                                                "45° Incline Machine Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "3-5 min"
                                                },
                                                "Pec Deck": {
                                                        "notes": "Focus on bringing your elbows together - not your hands",
                                                        "alternatives": [
                                                                "Cable Crossover Ladder",
                                                                "Bottom-Half DB Flye"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Dual-Handle Lat Pulldown": {
                                                        "notes": "Lean back by ~15° and drive your elbows down as you squeeze your shoulder blades together. This should feel like a mix of lats and mid-traps.",
                                                        "alternatives": [
                                                                "Wide-Grip Lat Pulldown",
                                                                "Wide-Grip Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Smith Machine Row": {
                                                        "notes": "Focus on squeezing your shoulder blades together, keeping your elbows at a ~45° angle",
                                                        "alternatives": [
                                                                "Pendlay Deficit Row",
                                                                "Single-Arm DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "1-2",
                                                        "restTime": "2-3 min"
                                                },
                                                "Overhead Cable Triceps Extension (Bar)": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep",
                                                        "alternatives": [
                                                                "Overhead Cable Triceps Extension (Rope)",
                                                                "DB Skull Crusher"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Bayesian Cable Curl": {
                                                        "notes": "If you have a left-right bicep size imbalance, do these 1 arm at a time, starting with the weaker arm. Take the weaker arm to the listed RPE. Then match the reps with the other arm (stop once you've matched the reps, even if the RPE is lower). If you don't have a size imbalance, do these both arms at the same time.",
                                                        "alternatives": [
                                                                "Seated Super- Bayesian High Cable Curl",
                                                                "Incline DB Stretch Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "tuesday",
                                        "name": "Week 10 Day 3",
                                        "nameHe": "שבוע 10 - יום 3",
                                        "exercises": [
                                                {
                                                        "name": "Lying Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl."
                                                },
                                                {
                                                        "name": "Smith Machine Static Lunge w/ Elevated Front Foot",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg."
                                                },
                                                {
                                                        "name": "45° Hyperextension",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive."
                                                },
                                                {
                                                        "name": "Leg Extension",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative."
                                                },
                                                {
                                                        "name": "Leg Press Calf Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 8,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                },
                                                {
                                                        "name": "Machine Crunch",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lying Leg Curl": {
                                                        "notes": "Set the machine so that you get the biggest stretch possible at the bottom. Prevent your butt from popping up as you curl.",
                                                        "alternatives": [
                                                                "Seated Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "2",
                                                        "restTime": "1-2 min"
                                                },
                                                "Smith Machine Static Lunge w/ Elevated Front Foot": {
                                                        "notes": "Elevate your front foot on a small box. Minimize contribution from your back leg.",
                                                        "alternatives": [
                                                                "DB Bulgarian Split Squat",
                                                                "High-Bar Back Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "45° Hyperextension": {
                                                        "notes": "Squeeze your glutes hard at the top of each rep. Slow controlled reps on the way down, followed by an explosive positive.",
                                                        "alternatives": [
                                                                "Glute-Ham Raise",
                                                                "Cable Pull- Through"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Leg Extension": {
                                                        "notes": "Set the seat back as far as it will go while still feeling comfortable. Grab the handles as hard as you can to pull your butt down into the seat. Use a 2-3 second negative. Feel your quads pulling apart on the negative.",
                                                        "alternatives": [
                                                                "Reverse Nordic",
                                                                "Sissy Squat"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Leg Press Calf Press": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Standing Calf Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Machine Crunch": {
                                                        "notes": "Round your lower back as you crunch. Maintain a mind-muscle connection with your 6-pack.",
                                                        "alternatives": [
                                                                "Decline Weighted Crunch",
                                                                "Cable Crunch"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "wednesday",
                                        "name": "Week 10 Rest",
                                        "nameHe": "שבוע 10 - מנוחה",
                                        "exercises": [],
                                        "isRestDay": true
                                },
                                {
                                        "day": "thursday",
                                        "name": "Week 10 Day 4",
                                        "nameHe": "שבוע 10 - יום 4",
                                        "exercises": [
                                                {
                                                        "name": "Lean-Back Lat Pulldown",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!"
                                                },
                                                {
                                                        "name": "Chest-Supported T-Bar Row",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "back",
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep."
                                                },
                                                {
                                                        "name": "1-Arm 45° Cable Rear Delt Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!"
                                                },
                                                {
                                                        "name": "Cable Paused Shrug-In",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep."
                                                },
                                                {
                                                        "name": "Cable Rope Hammer Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "DB Concentration Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "biceps",
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Lean-Back Lat Pulldown": {
                                                        "notes": "Initiate the pulldown with a straight up posture. As you pull the bar down, lean back by about 15-30° to get the mid-back more involved. Softly touch the bar to your chest on every rep and, even though you're leaning back, still control the weight!",
                                                        "alternatives": [
                                                                "Lean-Back Machine Pulldown",
                                                                "Pull-Up"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Chest-Supported T-Bar Row": {
                                                        "notes": "Flare elbows out at roughly 45° and squeeze your shoulder blades together hard at the top of each rep.",
                                                        "alternatives": [
                                                                "Chest-Supported Machine Row",
                                                                "Incline Chest- Supported DB Row"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "1-Arm 45° Cable Rear Delt Flye": {
                                                        "notes": "Pause for 1-2 seconds in the squeeze of each rep. Contract the rear delts hard!",
                                                        "alternatives": [
                                                                "Rope Face Pull",
                                                                "Reverse Pec Deck"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Cable Paused Shrug-In": {
                                                        "notes": "Shrug up and in. Think about shrugging \"up to your ears.\" 1-2 second pause in the squeeze (at the top) of each rep, then another 1-2 second pause in the stretch (at the bottom) of each rep.",
                                                        "alternatives": [
                                                                "Machine Shrug",
                                                                "DB Shrug"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "2-3",
                                                        "restTime": "1-2 min"
                                                },
                                                "Cable Rope Hammer Curl": {
                                                        "notes": "Squeeze the rope hard as you curl the weight up. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "DB Hammer Curl",
                                                                "Hammer Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~7, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "DB Concentration Curl": {
                                                        "notes": "Smooth, controlled reps. Mind-muscle connection with the biceps.",
                                                        "alternatives": [
                                                                "Concentration Cable Curl",
                                                                "DB Preacher Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "friday",
                                        "name": "Week 10 Day 5",
                                        "nameHe": "שבוע 10 - יום 5",
                                        "exercises": [
                                                {
                                                        "name": "Machine Chest Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs."
                                                },
                                                {
                                                        "name": "Seated DB Shoulder Press",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps."
                                                },
                                                {
                                                        "name": "Bottom-Half Seated Cable Flye",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "chest",
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep."
                                                },
                                                {
                                                        "name": "High-Cable Lateral Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "shoulders",
                                                        "notes": "Focus on squeezing your lateral delt to move the weight."
                                                },
                                                {
                                                        "name": "EZ-Bar Skull Crusher",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep."
                                                },
                                                {
                                                        "name": "Triceps Pressdown (Bar)",
                                                        "sets": [
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 15,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "triceps",
                                                        "notes": "Focus on squeezing your triceps to move the weight."
                                                },
                                                {
                                                        "name": "Ab Wheel Rollout",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Machine Chest Press": {
                                                        "notes": "1 second pause at the bottom of each rep while maintaining tension on the pecs.",
                                                        "alternatives": [
                                                                "Barbell Bench Press",
                                                                "DB Bench Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "3-5 min"
                                                },
                                                "Seated DB Shoulder Press": {
                                                        "notes": "Ensure that your elbows break at least 90°. Mind-muscle connection with your delts. Smooth, controlled reps.",
                                                        "alternatives": [
                                                                "Cable Shoulder Press",
                                                                "Machine Shoulder Press"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Bottom-Half Seated Cable Flye": {
                                                        "notes": "All reps and sets are to be performed in the bottom half of the ROM. Focus on feeling a deep stretch in your pecs at the bottom of each rep.",
                                                        "alternatives": [
                                                                "Bottom-Half DB Flye",
                                                                "Low-to-High Cable Crossover"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "High-Cable Lateral Raise": {
                                                        "notes": "Focus on squeezing your lateral delt to move the weight.",
                                                        "alternatives": [
                                                                "High-Cable Cuffed Lateral Raise",
                                                                "Lean-In DB Lateral Raise"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "EZ-Bar Skull Crusher": {
                                                        "notes": "Optionally pause for 0.5-1 second in the stretched aspect of each rep.",
                                                        "alternatives": [
                                                                "DB Skull Crusher",
                                                                "Katana Triceps Extension"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~8-9",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min"
                                                },
                                                "Triceps Pressdown (Bar)": {
                                                        "notes": "Focus on squeezing your triceps to move the weight.",
                                                        "alternatives": [
                                                                "Triceps Pressdown (Rope)",
                                                                "DB Triceps Kickback"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Ab Wheel Rollout": {
                                                        "notes": "Don't just bend at your hips, use your abs to lower yourself down under control and pull yourself back up. If you don't have the core strength to get all the way extended at the bottom, try to progressively increase the ROM week to week.",
                                                        "alternatives": [
                                                                "Swiss Ball Rollout",
                                                                "Long-Lever Plank"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                },
                                {
                                        "day": "saturday",
                                        "name": "Week 10 Day 6",
                                        "nameHe": "שבוע 10 - יום 6",
                                        "exercises": [
                                                {
                                                        "name": "Hack Squat",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive."
                                                },
                                                {
                                                        "name": "Seated Leg Curl",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "hamstrings",
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings."
                                                },
                                                {
                                                        "name": "Walking Lunge",
                                                        "sets": [
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 10,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "quads",
                                                        "notes": "Take medium strides. Minimize contribution from the back leg."
                                                },
                                                {
                                                        "name": "Machine Hip Abduction",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "abs",
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further."
                                                },
                                                {
                                                        "name": "Standing Calf Raise",
                                                        "sets": [
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                },
                                                                {
                                                                        "reps": 12,
                                                                        "weight": 0
                                                                }
                                                        ],
                                                        "muscleGroup": "calves",
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet."
                                                }
                                        ],
                                        "exerciseExtras": {
                                                "Hack Squat": {
                                                        "notes": "Use a controlled negative (don't free fall) and then explode on the positive.",
                                                        "alternatives": [
                                                                "Leg Press",
                                                                "DB Walking Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-4",
                                                        "restTime": "2-3 min"
                                                },
                                                "Seated Leg Curl": {
                                                        "notes": "Lean forward over the machine to get a maximum stretch in your hamstrings.",
                                                        "alternatives": [
                                                                "Lying Leg Curl",
                                                                "Nordic Ham Curl"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Walking Lunge": {
                                                        "notes": "Take medium strides. Minimize contribution from the back leg.",
                                                        "alternatives": [
                                                                "Smith Machine Static Lunge",
                                                                "DB Static Lunge"
                                                        ],
                                                        "rpeTarget": "Early: ~7-8, Last: ~7-8",
                                                        "warmupSets": "2-3",
                                                        "restTime": "2-3 min"
                                                },
                                                "Machine Hip Abduction": {
                                                        "notes": "If possible, use pads to increase the range of motion on the machine. Lean forward and grab onto the machine rails to stretch the glutes further.",
                                                        "alternatives": [
                                                                "Cable Hip Abduction",
                                                                "Lateral Band Walk"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                },
                                                "Standing Calf Raise": {
                                                        "notes": "1-2 second pause at the bottom of each rep. Instead of just going up onto your toes, think about rolling your ankle back and forth on the balls of your feet.",
                                                        "alternatives": [
                                                                "Seated Calf Raise",
                                                                "Leg Press Calf Press"
                                                        ],
                                                        "rpeTarget": "Early: ~8-9, Last: 10",
                                                        "warmupSets": "1-2",
                                                        "restTime": "1-2 min",
                                                        "intensityTechnique": "Failure"
                                                }
                                        }
                                }
                        ]
                }
        ],
};
