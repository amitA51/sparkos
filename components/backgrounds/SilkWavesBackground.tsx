/**
 * ═══════════════════════════════════════════════════════════════
 * SILK WAVES BACKGROUND - Optimized for Performance
 * ═══════════════════════════════════════════════════════════════
 * 
 * Static gradient background with optional subtle animations
 * Animations disabled by default for better performance
 */

import React from 'react';
import { ANIMATION_CONFIG } from '../animations/config';

interface SilkWavesProps {
    /** Primary wave color */
    primaryColor?: string;
    /** Secondary wave color */
    secondaryColor?: string;
    /** Force enable animations (overrides performance detection) */
    forceEnableAnimations?: boolean;
}

export const SilkWavesBackground: React.FC<SilkWavesProps> = ({
    primaryColor = 'rgba(14, 165, 233, 0.08)',   // Ocean blue
    secondaryColor = 'rgba(34, 211, 238, 0.05)', // Cyan
    forceEnableAnimations = false,
}) => {
    // Check if animations should be enabled
    const enableAnimations = forceEnableAnimations || ANIMATION_CONFIG.enableBackgroundAnimations;

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
            {/* Deep gradient base */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #020617 0%, #0a1628 50%, #050505 100%)',
                }}
            />

            {/* Wave Layer 1 - Static by default, animated only on high-end devices */}
            <div
                className="absolute -bottom-[10%] -left-[10%] w-[120%] h-[50%] pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
                    borderRadius: '50% 50% 0 0',
                    filter: 'blur(60px)',
                    // CSS animation instead of Framer Motion for better performance
                    animation: enableAnimations ? 'silkWave1 20s ease-in-out infinite' : 'none',
                }}
            />

            {/* Wave Layer 2 - Static by default */}
            <div
                className="absolute -bottom-[5%] -left-[5%] w-[110%] h-[40%] pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, transparent 0%, ${secondaryColor} 50%, transparent 100%)`,
                    borderRadius: '50% 50% 0 0',
                    filter: 'blur(80px)',
                    animation: enableAnimations ? 'silkWave2 25s ease-in-out infinite' : 'none',
                    animationDelay: enableAnimations ? '2s' : '0s',
                }}
            />

            {/* Wave Layer 3 - Static by default */}
            <div
                className="absolute bottom-0 left-0 w-full h-[30%] pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, transparent 0%, rgba(14, 165, 233, 0.03) 100%)`,
                    filter: 'blur(40px)',
                    animation: enableAnimations ? 'silkWave3 18s ease-in-out infinite' : 'none',
                    animationDelay: enableAnimations ? '1s' : '0s',
                }}
            />

            {/* Ambient glow at top */}
            <div
                className="absolute top-0 left-0 w-full h-[30%] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                }}
            />

            {/* Noise texture */}
            <div
                className="absolute inset-0 opacity-[0.01] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* CSS Keyframes - injected once */}
            <style>{`
                @keyframes silkWave1 {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(10px, -15px); }
                    50% { transform: translate(0, 0); }
                    75% { transform: translate(-10px, 15px); }
                }
                @keyframes silkWave2 {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(-15px, 20px); }
                    50% { transform: translate(0, 0); }
                    75% { transform: translate(15px, -20px); }
                }
                @keyframes silkWave3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(0, -10px) scale(1.02); }
                    50% { transform: translate(0, 0) scale(1); }
                    75% { transform: translate(0, 10px) scale(0.98); }
                }
            `}</style>
        </div>
    );
};

export default SilkWavesBackground;
