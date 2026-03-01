import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    isLoading?: boolean;
}

// Premium redesign: Tactile, clean, no mushy colored shadows
const variantStyles: Record<ButtonVariant, string> = {
    // Primary: Solid white, dark text, physical "tactile" feel
    primary: `
        bg-white text-theme-primary font-semibold
        shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.08)]
        hover:bg-white/90
        active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
    `,
    // Secondary: Subtle glass
    secondary: `
        bg-white/5 text-white/90 border border-white/10
        hover:bg-white/10 hover:border-white/15
    `,
    // Ghost: Minimal
    ghost: `
        bg-transparent text-white/70
        hover:bg-white/5 hover:text-white
    `,
    // Glass: Frosted glass
    glass: `
        bg-white/5 backdrop-blur-xl border border-white/10 text-white
        hover:bg-white/10 hover:border-white/15
        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
    `,
    // Danger: Subtle red
    danger: `
        bg-red-500/10 text-red-400 border border-red-500/20
        hover:bg-red-500/20 hover:border-red-500/30
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    // Minimum 44px touch target for accessibility (sm: min-h-[44px])
    sm: 'px-4 py-2.5 min-h-[44px] text-[13px] rounded-xl gap-1.5',
    md: 'px-5 py-3 min-h-[48px] text-[15px] rounded-xl gap-2',
    lg: 'px-7 py-4 min-h-[56px] text-base rounded-2xl gap-2.5',
    icon: 'p-3 min-w-[44px] min-h-[44px] rounded-xl justify-center',
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            disabled={disabled || isLoading}
            className={`
                relative inline-flex items-center justify-center font-medium
                transition-all duration-150 ease-out
                hover:scale-[1.02] active:scale-[0.97]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:scale-100
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${className}
            `}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : icon ? (
                <span className={children ? 'mr-2' : ''}>{icon}</span>
            ) : null}
            {children}
        </button>
    );
};
