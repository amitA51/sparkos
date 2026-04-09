import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AchievementDefinition, AchievementRarity } from '../../services/achievementDefinitions';
import { RARITY_CONFIG } from '../../services/achievementDefinitions';

interface AchievementToastProps {
  achievement: AchievementDefinition | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

// Confetti particle for the toast
const ToastConfetti: React.FC<{ index: number }> = ({ index }) => {
  const angle = (index / 12) * 360 + Math.random() * 30;
  const distance = 60 + Math.random() * 40;
  const size = 3 + Math.random() * 3;
  const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA', '#6366F1'];
  const color = colors[index % colors.length];
  const shape = Math.random() > 0.5 ? '50%' : '2px';

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: shape,
        left: '50%',
        top: '50%',
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        rotate: Math.random() * 360,
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.03,
        ease: 'easeOut',
      }}
    />
  );
};

const rarityGlow: Record<AchievementRarity, string> = {
  common: '0 0 20px rgba(156, 163, 175, 0.3)',
  rare: '0 0 20px rgba(96, 165, 250, 0.4)',
  epic: '0 0 25px rgba(167, 139, 250, 0.5)',
  legendary: '0 0 30px rgba(251, 191, 36, 0.5)',
};

const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
  autoDismissMs = 4000,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setShowConfetti(true);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 1000);
    const dismissTimer = setTimeout(onDismiss, autoDismissMs);
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(dismissTimer);
    };
  }, [achievement, autoDismissMs, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="fixed top-4 left-1/2 z-[200] pointer-events-auto"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ y: -100, x: '-50%', opacity: 0, scale: 0.8 }}
          animate={{ y: 0, x: '-50%', opacity: 1, scale: 1 }}
          exit={{ y: -60, x: '-50%', opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div
            className="relative flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer select-none"
            style={{
              background: 'var(--bg-card)',
              border: `1.5px solid ${RARITY_CONFIG[achievement.rarity].color}40`,
              boxShadow: `${rarityGlow[achievement.rarity]}, 0 8px 32px rgba(0,0,0,0.3)`,
              backdropFilter: 'blur(20px)',
              minWidth: 280,
              maxWidth: 380,
            }}
            onClick={onDismiss}
          >
            {/* Confetti burst */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-visible pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <ToastConfetti key={i} index={i} />
                ))}
              </div>
            )}

            {/* Icon */}
            <motion.div
              className="shrink-0 flex items-center justify-center rounded-xl relative"
              style={{
                width: 44,
                height: 44,
                background: RARITY_CONFIG[achievement.rarity].bgGradient,
                boxShadow: `0 2px 12px ${RARITY_CONFIG[achievement.rarity].color}40`,
              }}
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
            >
              <span className="text-xl">{achievement.icon}</span>
            </motion.div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: RARITY_CONFIG[achievement.rarity].color }}
                >
                  הישג חדש!
                </div>
                <div
                  className="text-sm font-bold leading-tight truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {achievement.title}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: 'var(--success, #34D399)' }}
                  >
                    +{achievement.xpReward} XP
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                    style={{
                      background: `${RARITY_CONFIG[achievement.rarity].color}20`,
                      color: RARITY_CONFIG[achievement.rarity].color,
                    }}
                  >
                    {RARITY_CONFIG[achievement.rarity].labelHe}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Progress bar at bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl overflow-hidden"
              style={{ background: 'transparent' }}
            >
              <motion.div
                className="h-full"
                style={{ background: RARITY_CONFIG[achievement.rarity].color }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoDismissMs / 1000, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(AchievementToast);
