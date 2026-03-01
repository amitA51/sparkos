/**
 * ═══════════════════════════════════════════════════════════════
 * AMBIENT MESH BACKGROUND - Optimized for Performance
 * ═══════════════════════════════════════════════════════════════
 * 
 * Static gradient background with optional subtle animations
 * Animations disabled by default for better performance
 */

import React from 'react';
import { ANIMATION_CONFIG } from '../animations/config';

interface AmbientMeshProps {
    /** Primary accent color from theme */
    primaryColor?: string;
    /** Secondary accent color from theme */
    secondaryColor?: string;
    /** Tertiary color for depth */
    tertiaryColor?: string;
    /** Force enable animations (overrides performance detection) */
    forceEnableAnimations?: boolean;
}

export const AmbientMeshBackground: React.FC<AmbientMeshProps> = ({
    primaryColor = 'rgba(59, 130, 246, 0.15)',    // Soft blue
    secondaryColor = 'rgba(139, 92, 246, 0.12)',  // Soft purple
    tertiaryColor = 'rgba(236, 72, 153, 0.08)',   // Soft pink
    forceEnableAnimations = false,
}) => {
    // Check if animations should be enabled
    const enableAnimations = forceEnableAnimations || ANIMATION_CONFIG.enableBackgroundAnimations;

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
            {/* Base gradient for depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(15, 15, 25, 1) 0%, #050505 70%)',
                }}
            />

            {/* Orb 1 - Top Left - Static by default */}
            <div
                className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
                    filter: 'blur(120px)',
                    animation: enableAnimations ? 'ambientOrb1 45s ease-in-out infinite' : 'none',
                }}
            />

            {/* Orb 2 - Bottom Right - Static by default */}
            <div
                className="absolute -bottom-[15%] -right-[15%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
                    filter: 'blur(140px)',
                    animation: enableAnimations ? 'ambientOrb2 55s ease-in-out infinite' : 'none',
                }}
            />

            {/* Orb 3 - Center - Static by default */}
            <div
                className="absolute top-[25%] left-[35%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${tertiaryColor} 0%, transparent 70%)`,
                    filter: 'blur(100px)',
                    animation: enableAnimations ? 'ambientOrb3 30s ease-in-out infinite' : 'none',
                }}
            />

            {/* Subtle noise texture for premium feel */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* CSS Keyframes */}
            <style>{`
                @keyframes ambientOrb1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(80px, 40px) scale(1.1); }
                    66% { transform: translate(40px, -30px) scale(0.95); }
                }
                @keyframes ambientOrb2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-60px, -50px) scale(0.9); }
                    66% { transform: translate(-20px, 30px) scale(1.05); }
                }
                @keyframes ambientOrb3 {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AmbientMeshBackground;
