import React, { useRef, useState, useCallback } from 'react';

type CardVariant = 'elevated' | 'sunken' | 'floating' | 'glass';

interface UltraCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverEffect?: boolean;
  pressEffect?: boolean;
  cursorGlow?: boolean;
  noPadding?: boolean;
  className?: string;
  // Legacy prop - kept for compatibility but no longer affects colored glows
  glowColor?: 'cyan' | 'violet' | 'magenta' | 'gold' | 'neutral' | 'theme';
}

// Premium redesign: Deep black shadows, no colored glows
const variantStyles: Record<CardVariant, string> = {
  elevated: `
    surface-elevated 
    border border-white/[0.08] 
    shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_8px_40px_-12px_rgba(0,0,0,0.6)]
  `,
  sunken: `
    bg-black/30 backdrop-blur-xl 
    border border-white/[0.04] 
    shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]
  `,
  floating: `
    surface-elevated 
    border border-white/[0.10] 
    shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_16px_48px_-12px_rgba(0,0,0,0.7)]
  `,
  glass: `
    surface-elevated 
    border border-white/[0.08] 
    shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]
  `,
};

// Premium hover: subtle lift with deeper shadow, no color
const hoverShadow = 'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_-12px_rgba(0,0,0,0.7)]';

export const UltraCard: React.FC<UltraCardProps> = ({
  children,
  variant = 'elevated',
  hoverEffect = true,
  pressEffect = true,
  cursorGlow = true,
  noPadding = false,
  className = '',
  glowColor, // Legacy - intentionally unused
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !cursorGlow) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [cursorGlow]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-[24px]
        ${variantStyles[variant]}
        ${hoverEffect ? `${hoverShadow} hover:border-white/[0.12] hover-surface hover:-translate-y-[2px] hover:scale-[1.005]` : ''}
        ${pressEffect ? 'active:scale-[0.985]' : ''}
        transition-all duration-200 ease-out
        animate-in fade-in slide-in-from-bottom-4
        ${className}
      `}
      {...props}
    >
      {/* Subtle cursor spotlight - neutral white only */}
      {cursorGlow && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.04), transparent 60%)`,
          }}
        />
      )}

      {/* Inner highlight for 3D depth */}
      <div className="absolute inset-0 rounded-[24px] border border-white/[0.03] pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};

interface UltraCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const UltraCardHeader: React.FC<UltraCardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border border-white/10 flex items-center justify-center text-accent-cyan">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-bold text-white tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-sm text-theme-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface UltraCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const UltraCardBody: React.FC<UltraCardBodyProps> = ({
  children,
  className = '',
}) => (
  <div className={className}>
    {children}
  </div>
);

interface UltraCardFooterProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export const UltraCardFooter: React.FC<UltraCardFooterProps> = ({
  children,
  className = '',
  bordered = true,
}) => (
  <div className={`mt-4 pt-4 ${bordered ? 'border-t border-white/5' : ''} ${className}`}>
    {children}
  </div>
);

export default UltraCard;