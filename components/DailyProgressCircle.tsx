import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyProgressCircleProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Circle size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Label text (default: "היום") */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Animate on mount */
  animate?: boolean;
  /** Custom center content */
  centerContent?: React.ReactNode;
  /** Current streak count */
  streak?: number;
  /** Show celebration at 100% */
  showCelebration?: boolean;
}

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number; size: number }> = ({ delay, size }) => {
  const angle = Math.random() * 360;
  const distance = size * 0.8 + Math.random() * size * 0.4;
  const particleSize = 3 + Math.random() * 4;
  const colors = ['#34D399', '#60A5FA', '#FBBF24', '#F472B6', '#A78BFA'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: particleSize,
        height: particleSize,
        backgroundColor: color,
        left: '50%',
        top: '50%',
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1
      }}
      animate={{
        x: Math.cos(angle * Math.PI / 180) * distance,
        y: Math.sin(angle * Math.PI / 180) * distance,
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
    />
  );
};

const DailyProgressCircle: React.FC<DailyProgressCircleProps> = ({
  percentage,
  size = 56,
  strokeWidth = 5,
  label = 'היום',
  showPercentage = true,
  animate = true,
  centerContent,
  streak,
  showCelebration = true,
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(animate ? 0 : percentage);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevPercentage, setPrevPercentage] = useState(percentage);

  const radius = size / 2 - strokeWidth;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayPercentage / 100) * circumference;

  const isComplete = percentage >= 100;

  const colors = useMemo(() => {
    if (percentage >= 100) return { start: '#34D399', end: '#059669', glow: 'rgba(52, 211, 153, 0.5)' };
    if (percentage >= 75) return { start: '#60A5FA', end: '#2563EB', glow: 'rgba(96, 165, 250, 0.4)' };
    if (percentage >= 50) return { start: '#FBBF24', end: '#D97706', glow: 'rgba(251, 191, 36, 0.4)' };
    return { start: '#F87171', end: '#DC2626', glow: 'rgba(248, 113, 113, 0.4)' };
  }, [percentage]);

  const gradientId = useMemo(() => `progress-gradient-${Math.random().toString(36).substr(2, 9)}`, []);
  const glowGradientId = useMemo(() => `glow-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  // Trigger celebration when reaching 100%
  useEffect(() => {
    if (percentage >= 100 && prevPercentage < 100 && showCelebration) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    setPrevPercentage(percentage);
  }, [percentage, prevPercentage, showCelebration]);

  useEffect(() => {
    if (!animate) {
      setDisplayPercentage(percentage);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const startValue = displayPercentage;
    const endValue = percentage;

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercentage(startValue + (endValue - startValue) * eased);

      if (progress < 1) requestAnimationFrame(animateValue);
    };

    requestAnimationFrame(animateValue);
    // displayPercentage is intentionally used only as animation start value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, animate]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Celebration Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {Array.from({ length: 12 }).map((_, i) => (
              <ConfettiParticle key={i} delay={i * 0.03} size={size} />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Pulsing Glow Ring for 100% */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Container Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl transition-colors duration-1000"
        style={{ background: colors.start }}
        animate={{ opacity: isComplete ? 0.4 : 0.2 }}
      />

      <svg className="relative w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id={glowGradientId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "circOut" }}
          filter={isComplete ? `url(#${glowGradientId})` : undefined}
          style={{
            filter: isComplete ? undefined : 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {centerContent || (
          <>
            {showPercentage && (
              <motion.span
                className="font-display font-bold text-white tracking-tight leading-none"
                style={{ fontSize: size * 0.28 }}
                animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {isComplete ? (
                  <span className="text-emerald-400">✓</span>
                ) : (
                  <>
                    {Math.round(displayPercentage)}
                    <span className="text-[0.6em] opacity-60 ml-0.5">%</span>
                  </>
                )}
              </motion.span>
            )}
            {label && !isComplete && (
              <span className="text-white/40 font-medium uppercase tracking-widest mt-0.5"
                style={{ fontSize: size * 0.14 }}>
                {label}
              </span>
            )}
            {isComplete && (
              <span className="text-emerald-400/80 font-medium text-[10px] mt-0.5">
                הושלם!
              </span>
            )}
          </>
        )}
      </div>

      {/* Streak Badge */}
      {streak !== undefined && streak > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
        >
          <div
            className="relative flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
            }}
          >
            <span className="text-[10px]">🔥</span>
            <span>{streak}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(DailyProgressCircle);
