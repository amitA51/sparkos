import { useState, useCallback } from 'react';
import { triggerHaptic } from '../src/utils/haptics';
import { playSuccess } from '../src/utils/audio';
import { PersonalRecord } from '../services/prService';

interface UseCelebrationReturn {
  showConfetti: boolean;
  triggerCelebration: () => void;
  currentPR: PersonalRecord | null;
  showPRCelebration: (pr: PersonalRecord) => void;
  hidePRCelebration: () => void;
}

export const useCelebration = (duration = 3000): UseCelebrationReturn => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPR, setCurrentPR] = useState<PersonalRecord | null>(null);

  const triggerCelebration = useCallback(() => {
    setShowConfetti(true);
    triggerHaptic('success');
    playSuccess();

    // Auto hide confetti
    setTimeout(() => {
      setShowConfetti(false);
    }, duration);
  }, [duration]);

  const showPRCelebration = useCallback((pr: PersonalRecord) => {
    setCurrentPR(pr);
    triggerCelebration();
  }, [triggerCelebration]);

  const hidePRCelebration = useCallback(() => {
    setCurrentPR(null);
  }, []);

  return {
    showConfetti,
    triggerCelebration,
    currentPR,
    showPRCelebration,
    hidePRCelebration
  };
};
