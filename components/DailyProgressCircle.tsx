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
    if (percentage >= 100) return {
      start: '#34D399', mid: '#10B981', end: '#059669',
      glow: 'rgba(52, 211, 153, 0.5)', track: 'rgba(52, 211, 153, 0.12)'
    };
    if (percentage >= 75) return {
      start: '#818CF8', mid: '#60A5FA', end: '#2563EB',
      glow: 'rgba(96, 165, 250, 0.4)', track: 'rgba(96, 165, 250, 0.08)'
    };
    if (percentage >= 50) return {
      start: '#FCD34D', mid: '#FBBF24', end: '#D97706',
      glow: 'rgba(251, 191, 36, 0.4)', track: 'rgba(251, 191, 36, 0.08)'
    };
    return {
      start: '#FCA5A5', mid: '#F87171', end: '#DC2626',
      glow: 'rgba(248, 113, 113, 0.4)', track: 'rgba(248, 113, 113, 0.08)'
    };
  }, [percentage]);

  const gradientId = useMemo(() => `progress-gradient-${Math.random().toString(36).substring(2, 11)}`, []);
  const glowGradientId = useMemo(() => `glow-gradient-${Math.random().toString(36).substring(2, 11)}`, []);

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

      {/* Container Glow - Layered for depth */}
      <motion.div
        className="absolute inset-[-4px] rounded-full transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{ opacity: isComplete ? 0.6 : 0.25 }}
      />

      <svg className="relative w-full h-full transform -rotate-90">
        <defs>
          {/* Premium 3-stop gradient for richer color */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id={glowGradientId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track - Tinted for cohesion */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={strokeWidth}
          opacity={0.8}
        />

        {/* Subtle track glow underneath */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gray-150)"
          strokeWidth={strokeWidth * 0.6}
          opacity={0.3}
        />

        {/* Progress Arc with glow filter */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth + 0.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={animate ? { strokeDashoffset: circumference } : false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "circOut" }}
          filter={`url(#${glowGradientId})`}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {centerContent || (
          <>
            {showPercentage && (
              <motion.span
                className="font-heading font-bold tracking-tight leading-none tabular-nums"
                style={{ color: 'var(--text-primary)', fontSize: size * 0.26 }}
                animate={isComplete ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5, type: 'spring', stiffness: 400 }}
              >
                {isComplete ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                    style={{ color: colors.end, display: 'inline-block' }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <>
                    {Math.round(displayPercentage)}
                    <span className="text-[0.55em] opacity-50 ml-0.5 font-medium">%</span>
                  </>
                )}
              </motion.span>
            )}
            {label && !isComplete && (
              <span className="font-semibold uppercase tracking-[0.12em] mt-0.5"
                style={{ color: 'var(--text-muted)', fontSize: Math.max(size * 0.13, 8) }}>
                {label}
              </span>
            )}
            {isComplete && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-semibold mt-0.5"
                style={{ color: colors.end, fontSize: Math.max(size * 0.15, 9) }}
              >
                הושלם!
              </motion.span>
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
