# Fitness Hub UI Specification

> **For UI Agent**: This document describes the data layer and components you need to build.

---

## 🎯 Overview

Create a "כושר" (Fitness) tab in the Library screen that displays workout history, progress tracking, and AI insights.

---

## 📍 Location

**Tab already added** to `PremiumViewSwitcher.tsx` at position 3 (between "ציר זמן" and "מחברת")

```typescript
{ id: 'fitness', icon: DumbbellIcon, label: 'כושר', gradient: 'from-orange-500 to-red-500' }
```

---

## 🪝 Data Hook

Use the `useFitnessInsights` hook from `hooks/useFitnessInsights.ts`:

```typescript
import { useFitnessInsights } from '../hooks/useFitnessInsights';

const {
  loading,
  error,
  
  // Stats
  currentStreak,         // number - consecutive workout days
  longestStreak,         // number
  totalWorkouts,         // number - all time
  workoutsThisWeek,      // number
  workoutsThisMonth,     // number
  
  // Last workout
  lastWorkout,           // LastWorkoutSummary | null
  // { id, date, daysSince, durationMinutes, totalVolume, 
  //   exerciseCount, setCount, mainMuscleGroups, prCount }
  
  // Muscle groups
  muscleGroups,          // MuscleGroupLastTrained[]
  // { muscleGroup, daysSince, isNeglected, color }
  neglectedMuscles,      // string[] - muscles not trained 7+ days
  
  // PRs
  allPRs,                // PersonalRecord[]
  recentPRs,             // PersonalRecord[] - from last 7 days
  
  // Exercise progress
  exerciseNames,         // string[] - all exercises from history
  selectedExerciseProgress, // StrengthProgressPoint[] - for chart
  selectedExerciseDelta,    // ProgressDelta - week over week
  
  // AI
  aiInsight,             // string | null
  aiInsightLoading,      // boolean
  
  // Raw sessions for history
  workoutSessions,       // WorkoutSession[] - for history timeline
  
  // Actions
  refresh,               // () => Promise<void>
  selectExercise,        // (name: string) => void
  generateAIInsight,     // () => Promise<void>
} = useFitnessInsights();
```

---

## 📐 UI Components to Build

### 1. FitnessHubView.tsx
**Location**: `components/library/FitnessHubView.tsx`

Main container with premium styling. Use `workout-glass-card` class.

### 2. Sections (top to bottom):

#### A. Quick Stats Header
```
🔥 רצף: {currentStreak} ימים  |  💪 החודש: {workoutsThisMonth} אימונים
```

#### B. Last Workout Card
```
📊 אימון אחרון: {lastWorkout.mainMuscleGroups.join(' + ')}
לפני {lastWorkout.daysSince} ימים • {lastWorkout.durationMinutes} דקות • {lastWorkout.totalVolume} ק"ג
[👀 צפה] [🔄 חזור על אימון]
```
- "חזור על אימון" should start a new workout with same exercises

#### C. PR Board
Show top 3-5 recent PRs with exercise name, weight, reps
```
🏆 {pr.exerciseName}: {pr.maxWeight}kg × {pr.maxReps}
```

#### D. Exercise Progress Chart
- Dropdown: `exerciseNames` array
- On select: call `selectExercise(name)`
- Chart data: `selectedExerciseProgress` (x: date, y: oneRepMax)
- Show delta arrow: `selectedExerciseDelta.trend` ('up'|'down'|'stable')

#### E. Muscle Heatmap + Alert
- Show `muscleGroups` with color intensity based on `daysSince`
- Alert for `neglectedMuscles`:
  ```
  ⚠️ לא אימנת {muscle} {daysSince} ימים
  ```

#### F. History Timeline
Group workout sessions by week, show:
- Date, duration, volume
- Main muscle groups
- PR count badge if > 0

#### G. AI Insights
- Button to call `generateAIInsight()`
- Show `aiInsight` when available
- Loading state: `aiInsightLoading`

---

## 🎨 Design Guidelines

| Element | Style |
|---------|-------|
| Background | Glass blur with `workout-glass-card` class |
| Accent | Orange-red gradient (`from-orange-500 to-red-500`) |
| Cards | Rounded corners, subtle shadow |
| Animations | Framer Motion spring, staggered entry |
| Empty State | Motivational message + "התחל אימון" CTA |

---

## 📁 Files to Create

1. `components/library/FitnessHubView.tsx` - Main view
2. Add fitness section in `screens/LibraryScreen.tsx`:
   ```typescript
   {!isLoading && activeView.type === 'fitness' && (
     <FitnessHubView />
   )}
   ```

---

## ✅ Data Layer Complete

The following are already implemented:
- ✅ `useFitnessInsights` hook
- ✅ `analyticsService.ts` enhanced functions
- ✅ `aiWorkoutInsightService.ts`
- ✅ HubView type includes 'fitness'
- ✅ Tab config in PremiumViewSwitcher
