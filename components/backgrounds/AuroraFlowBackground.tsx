/**
 * ═══════════════════════════════════════════════════════════════
 * AURORA FLOW BACKGROUND - Optimized for Performance
 * ═══════════════════════════════════════════════════════════════
 * 
 * Static gradient background with optional subtle animations
 * Animations disabled by default for better performance
 */

import React from 'react';
import { ANIMATION_CONFIG } from '../animations/config';

interface AuroraFlowProps {
    /** Start color for gradient */
    gradientStart?: string;
    /** End color for gradient */
    gradientEnd?: string;
    /** Force enable animations (overrides performance detection) */
    forceEnableAnimations?: boolean;
}

export const AuroraFlowBackground: React.FC<AuroraFlowProps> = ({
    gradientStart = '#7F00FF', // Electric Violet
    gradientEnd = '#00D1FF',   // Cyber Cyan
    forceEnableAnimations = false,
}) => {
    // Check if animations should be enabled
    const enableAnimations = forceEnableAnimations || ANIMATION_CONFIG.enableBackgroundAnimations;

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
            {/* Base void */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 30%, #0f0f18 0%, #050505 70%)',
                }}
            />

            {/* Aurora Ribbon 1 - Static by default */}
            <div
                className="absolute top-[-10%] left-[-20%] w-[100vw] h-[60vh] pointer-events-none"
                style={{
                    background: `linear-gradient(135deg, ${gradientStart}15 0%, ${gradientEnd}10 50%, transparent 100%)`,
                    filter: 'blur(80px)',
                    borderRadius: '50%',
                    animation: enableAnimations ? 'auroraFlow1 40s ease-in-out infinite' : 'none',
                }}
            />

            {/* Aurora Ribbon 2 - Static by default */}
            <div
                className="absolute top-[20%] right-[-20%] w-[80vw] h-[50vh] pointer-events-none"
                style={{
                    background: `linear-gradient(225deg, ${gradientEnd}12 0%, ${gradientStart}08 50%, transparent 100%)`,
                    filter: 'blur(100px)',
                    borderRadius: '50%',
                    animation: enableAnimations ? 'auroraFlow2 50s ease-in-out infinite' : 'none',
                    animationDelay: enableAnimations ? '5s' : '0s',
                }}
            />

            {/* Central Glow - Static by default */}
            <div
                className="absolute top-[30%] left-[30%] w-[40vw] h-[40vh] pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${gradientStart}08 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    animation: enableAnimations ? 'auroraPulse 8s ease-in-out infinite' : 'none',
                }}
            />

            {/* Bottom Horizon Glow */}
            <div
                className="absolute bottom-0 left-0 w-full h-[20%] pointer-events-none"
                style={{
                    background: `linear-gradient(180deg, transparent 0%, ${gradientEnd}05 100%)`,
                }}
            />

            {/* Noise overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* CSS Keyframes */}
            <style>{`
                @keyframes auroraFlow1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    25% { transform: translate(100px, -30px) rotate(5deg) scale(1.1); }
                    50% { transform: translate(50px, 20px) rotate(-5deg) scale(0.95); }
                    75% { transform: translate(0, 0) rotate(0deg) scale(1); }
                }
                @keyframes auroraFlow2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    25% { transform: translate(-80px, 40px) rotate(-8deg) scale(0.9); }
                    50% { transform: translate(-30px, -20px) rotate(5deg) scale(1.05); }
                    75% { transform: translate(0, 0) rotate(0deg) scale(1); }
                }
                @keyframes auroraPulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default AuroraFlowBackground;
