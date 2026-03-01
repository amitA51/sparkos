import React, { useRef, useEffect, useCallback } from 'react';
// Using new modular architecture - see ./core, ./hooks, ./components, ./overlays
import { ActiveWorkout } from '.';
import { useData } from '../../src/contexts/DataContext';
import { PersonalItem } from '../../types';

// Track workout IDs that are currently being completed
// This prevents race conditions where the workout is deleted but context hasn't updated yet
export const completingWorkoutIds = new Set<string>();

// Track IDs that have been permanently completed (persisted across renders)
const permanentlyCompletedIds = new Set<string>();

const ActiveWorkoutOverlay: React.FC = () => {
  const { personalItems, updatePersonalItem, removePersonalItem } = useData();
  
  // Track the last workout we showed to detect if we're in a loop
  const lastShownWorkoutId = useRef<string | null>(null);
  const isExitingRef = useRef(false);

  // Find the active workout - exclude permanently completed ones
  const activeWorkout = personalItems.find(
    item => item.type === 'workout' && item.isActiveWorkout && !item.workoutEndTime && !permanentlyCompletedIds.has(item.id)
  );

  // Handle exit - must be defined before any conditional returns (hooks order rule)
  const handleExit = useCallback(async () => {
    if (!activeWorkout) return;
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    
    console.log('[ActiveWorkoutOverlay] handleExit called for workout:', activeWorkout.id);
    
    // Mark this workout as completing to prevent re-showing
    completingWorkoutIds.add(activeWorkout.id);
    permanentlyCompletedIds.add(activeWorkout.id);
    
    // Clear localStorage to prevent restore
    localStorage.removeItem('active_workout_v3_state');
    
    // Dispatch event to notify listeners
    window.dispatchEvent(new Event('WORKOUT_COMPLETED'));
    
    // Actually remove the item from context
    try {
      console.log('[ActiveWorkoutOverlay] Removing personal item:', activeWorkout.id);
      await removePersonalItem(activeWorkout.id);
      console.log('[ActiveWorkoutOverlay] Personal item removed successfully');
    } catch (e) {
      console.error('[ActiveWorkoutOverlay] Error removing personal item:', e);
      // Even on error, keep the ID in permanentlyCompletedIds to prevent loop
    }
    
    isExitingRef.current = false;
  }, [activeWorkout, removePersonalItem]);

  // Clear completing IDs when activeWorkout becomes null (context updated)
  useEffect(() => {
    if (!activeWorkout && completingWorkoutIds.size > 0) {
      // Context has updated, safe to clear
      completingWorkoutIds.clear();
    }
  }, [activeWorkout]);

  // Guard: If this workout is being completed, don't show it
  // This prevents the loop where the workout is deleted but context hasn't updated yet
  if (activeWorkout && completingWorkoutIds.has(activeWorkout.id)) {
    return null;
  }

  // Guard: If no active workout, don't render
  if (!activeWorkout) {
    lastShownWorkoutId.current = null;
    return null;
  }

  const handleUpdate = (id: string, updates: Partial<PersonalItem>) => {
    void updatePersonalItem(id, updates);
  };

  return <ActiveWorkout item={activeWorkout} onUpdate={handleUpdate} onExit={handleExit} />;
};

export default React.memo(ActiveWorkoutOverlay);
