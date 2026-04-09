import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTierForLevel } from '../../services/gamificationService';

interface LevelUpCelebrationProps {
  show: boolean;
  newLevel: number;
  onDismiss: () => void;
}

// Particle component for the celebration
const Particle: React.FC<{ index: number; total: number }> = ({ index, total }) => {
  const angle = (index / total) * 360;
  const distance = 100 + Math.random() * 120;
  const size = 4 + Math.random() * 6;
  const duration = 1.2 + Math.random() * 0.8;
  const delay = Math.random() * 0.5;
  const colors = [
    '#6366F1', '#8B5CF6', '#A78BFA',
    '#34D399', '#60A5FA', '#FBBF24',
    '#F472B6', '#EC4899', '#F59E0B',
  ];
  const color = colors[index % colors.length];

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: '50%',
        top: '50%',
        boxShadow: `0 0 6px ${color}`,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        scale: [0, 1.8, 0],
        opacity: [0, 1, 0],
        rotate: Math.random() * 720,
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    />
  );
};

// Confetti rain piece
const ConfettiPiece: React.FC<{ index: number }> = ({ index }) => {
  const x = Math.random() * 100;
  const delay = Math.random() * 1;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const colors = ['#6366F1', '#FBBF24', '#34D399', '#F472B6', '#60A5FA', '#A78BFA'];
  const color = colors[index % colors.length];
  const rotation = Math.random() * 720;

  return (
    <motion.div
      className="absolute"
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
        left: `${x}%`,
        top: -20,
      }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: '110vh',
        rotate: rotation,
        opacity: [1, 1, 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'linear',
      }}
    />
  );
};

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  show,
  newLevel,
  onDismiss,
}) => {
  const [phase, setPhase] = useState<'particles' | 'reveal' | 'done'>('particles');
  const tier = getTierForLevel(newLevel);

  useEffect(() => {
    if (!show) return;
    setPhase('particles');
    const revealTimer = setTimeout(() => setPhase('reveal'), 600);
    return () => clearTimeout(revealTimer);
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Confetti rain */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece key={`confetti-${i}`} index={i} />
          ))}
        </div>

        {/* Center content */}
        <div className="relative flex flex-col items-center z-10">
          {/* Particle burst */}
          <div className="absolute pointer-events-none" style={{ width: 0, height: 0 }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <Particle key={`particle-${i}`} index={i} total={30} />
            ))}
          </div>

          {/* Glowing ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              border: '3px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.3), inset 0 0 40px rgba(99, 102, 241, 0.1)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1.2],
              opacity: [0, 0.8, 0.4],
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Level number */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: 0.3,
            }}
          >
            {/* "Level Up" text */}
            <motion.span
              className="text-sm font-bold uppercase tracking-[0.25em] mb-2"
              style={{ color: 'rgba(167, 139, 250, 0.9)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Level Up!
            </motion.span>

            {/* Big level number */}
            <motion.span
              className="font-bold leading-none"
              style={{
                fontSize: 80,
                background: 'linear-gradient(135deg, #6366F1, #A78BFA, #FBBF24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {newLevel}
            </motion.span>

            {/* Tier title reveal */}
            <AnimatePresence>
              {phase === 'reveal' && (
                <motion.div
                  className="flex flex-col items-center mt-4"
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                >
                  <span
                    className="text-xl font-bold mb-1"
                    style={{ color: '#fff' }}
                  >
                    {tier.nameHe}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    רמה {newLevel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={onDismiss}
            className="mt-10 px-8 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            המשך
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(LevelUpCelebration);
