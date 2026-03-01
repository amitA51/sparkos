# Replace Search Screen with Fitness Hub Screen

## Steps:
- [x] 1. Add `'fitness'` to `Screen` type in `types.ts`
- [x] 2. Update `BottomNavBar.tsx` - Replace `search` with `fitness`, change icon to `DumbbellIcon`, label to 'כושר'
- [x] 3. Update `AppRouter.tsx` - Add `fitness` case rendering `FitnessHubView`
- [x] 4. All changes complete!

## Mobile Layout Fixes (Completed):
- [x] FitnessHubView: Changed `space-y-8` → `space-y-4 md:space-y-6`
- [x] FitnessHubView: Changed top padding for mobile
- [x] FitnessHubView: Removed `mb-6` from workout programs section
- [x] FitnessHubView: Changed Exercise Analysis `p-6` → `p-4 md:p-6`
- [x] FitnessHubView: Changed chart `h-[250px]` → `h-[200px] md:h-[250px]`
- [x] FitnessHubView: Changed grid `gap-6` → `gap-4 md:gap-6`
- [x] QuickStatsHeader: Removed `mb-6`, changed `p-6` → `p-4 md:p-6`
- [x] AIInsightCard: Removed `mb-8`, changed `p-6` → `p-4 md:p-6`
- [x] LastWorkoutCard: Removed `mb-6`, changed `p-6` → `p-4 md:p-6`
- [x] PRMarkee: Removed `mb-6`, reduced `pb-8` → `pb-4`
- [x] MuscleHeatmap: Changed `p-6` → `p-4 md:p-6`
- [x] WorkoutStartModal: Changed `max-h-[80vh]` → `max-h-[90dvh]`, content `max-h-[72vh]` → `max-h-[calc(90dvh-140px)]`

## Summary of Changes:
The Search tab (חיפוש) has been replaced with the Fitness tab (כושר) in the bottom navigation.
All mobile layout issues have been addressed by:
1. Reducing vertical spacing between sections (parent `space-y` handles gaps)
2. Removing duplicate margin-bottom from child components
3. Using responsive padding (`p-4 md:p-6`) for better mobile experience
4. Using dynamic viewport height units (`dvh`) for modals
5. Reducing chart height on mobile screens
