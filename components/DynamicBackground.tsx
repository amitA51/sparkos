/**
 * ═══════════════════════════════════════════════════════════════
 * DYNAMIC BACKGROUND - Apple-Style Premium Backgrounds
 * ═══════════════════════════════════════════════════════════════
 *
 * Renders the appropriate background based on theme settings.
 * All backgrounds use GPU-accelerated animations for 60fps.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { useSettings as useSettingsContext } from '../src/contexts/SettingsContext';
import { AmbientMeshBackground, SilkWavesBackground, AuroraFlowBackground } from './backgrounds';
import { AuroraBackground } from './ui/AuroraBackground';

// Particle class for particle-dust effect
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  canvasWidth: number;
  canvasHeight: number;

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = Math.random() * 0.2 - 0.1;
    this.speedY = Math.random() * 0.15 - 0.05;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.twinkleOffset = Math.random() * Math.PI * 2;
  }

  update(time: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around
    if (this.x > this.canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = this.canvasWidth;
    if (this.y > this.canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = this.canvasHeight;

    // Twinkle effect
    return this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));
  }

  draw(ctx: CanvasRenderingContext2D, currentOpacity: number) {
    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// iOS Light Mode background - clean system background
const StaticDepthBackground: React.FC = () => (
  <div
    className="fixed inset-0 -z-50"
    style={{ background: 'var(--bg-primary)' }}
  />
);

// Studio background - soft light gradient + noise, works for light & dark
const StudioBackground: React.FC = () => (
  <div
    className="fixed inset-0 -z-50"
    style={{
      background:
        'radial-gradient(circle at 20% 0%, rgba(0, 122, 255, 0.08) 0%, transparent 45%),' +
        'radial-gradient(circle at 80% 0%, rgba(88, 86, 214, 0.07) 0%, transparent 50%),' +
        'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
    }}
  >
    <div
      className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E")`,
      }}
    />
  </div>
);

// Particle Dust Canvas (refined Apple TV style)
const ParticleDustBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const startTime = performance.now();

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Reduced count for elegance
      const particleCount = width < 768 ? 25 : 40;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      const time = performance.now() - startTime;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach(particle => {
        const opacity = particle.update(time);
        particle.draw(ctx, opacity);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    handleResize();
    animate();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      <StaticDepthBackground />
      <canvas ref={canvasRef} className="fixed inset-0 -z-40 pointer-events-none w-full h-full" />
    </>
  );
};

// OLED Pure Black (legacy - kept for compatibility)
const OledBackground: React.FC = () => <div className="fixed inset-0 -z-50 bg-black" />;

/**
 * Get theme-aware colors for backgrounds
 */
const useBackgroundColors = () => {
  const { settings } = useSettingsContext();
  const theme = settings.themeSettings;

  return useMemo(
    () => ({
      primary: theme.gradientStart || '#3B82F6',
      secondary: theme.gradientEnd || '#8B5CF6',
      tertiary: theme.secondaryAccent || '#EC4899',
    }),
    [theme.gradientStart, theme.gradientEnd, theme.secondaryAccent]
  );
};

/**
 * Main Dynamic Background Component
 */
const DynamicBackground: React.FC = () => {
  const { settings } = useSettingsContext();
  const colors = useBackgroundColors();
  const effect = settings.themeSettings.backgroundEffect;

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Always render static for reduced motion
  if (prefersReducedMotion && effect !== 'oled') {
    return effect === 'studio' ? <StudioBackground /> : <StaticDepthBackground />;
  }

  switch (effect) {
    case 'oled':
      return <OledBackground />;

    case 'ambient-mesh':
      return (
        <AmbientMeshBackground
          primaryColor={`${colors.primary}15`}
          secondaryColor={`${colors.secondary}12`}
          tertiaryColor={`${colors.tertiary}08`}
        />
      );

    case 'silk-waves':
      return (
        <SilkWavesBackground
          primaryColor={`${colors.primary}08`}
          secondaryColor={`${colors.secondary}05`}
        />
      );

    case 'aurora-flow':
      return <AuroraFlowBackground gradientStart={colors.primary} gradientEnd={colors.secondary} />;

    case 'particles':
    case 'particle-dust':
      return <ParticleDustBackground />;

    case 'aurora':
      return <AuroraBackground />;
    case 'studio':
      return <StudioBackground />;

    case 'dark':
    default:
      return <StaticDepthBackground />;
  }
};

// PERF: Memoize to prevent re-renders on screen changes.
// Background only changes when theme settings change (captured via useSettingsContext inside).
export default React.memo(DynamicBackground);
