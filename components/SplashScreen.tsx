// Optimized SplashScreen - Reduced animation overhead
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparklesIcon } from './icons';
import { ANIMATION_CONFIG } from './animations/config';

interface SplashScreenProps {
    onComplete?: () => void;
    minDisplayTime?: number; // Minimum time to show splash in ms
}

const SplashScreen: React.FC<SplashScreenProps> = ({
    onComplete,
    minDisplayTime = 800 // Reduced from 1200ms for faster UX
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const enableAnimations = ANIMATION_CONFIG.enableAnimations;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                // Reduced exit animation wait
                setTimeout(onComplete, 300);
            }
        }, minDisplayTime);

        return () => clearTimeout(timer);
    }, [minDisplayTime, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Background Effects - Static by default */}
                    <div className="absolute inset-0 z-0">
                        {/* Deep Cosmos Gradient */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--dynamic-accent-start)]/20 via-black to-black opacity-60" />

                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%2F%3E%3C%2Fsvg%3E')] mix-blend-overlay" />

                        {/* Static Orbs - CSS animation only if enabled */}
                        <div
                            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--dynamic-accent-start)]/10 blur-[100px]"
                            style={{
                                animation: enableAnimations ? 'splashOrb1 4s ease-in-out infinite' : 'none',
                            }}
                        />
                        <div
                            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[var(--dynamic-accent-end)]/10 blur-[80px]"
                            style={{
                                animation: enableAnimations ? 'splashOrb2 5s ease-in-out infinite' : 'none',
                                animationDelay: enableAnimations ? '1s' : '0s',
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className="relative"
                            style={{
                                animation: enableAnimations ? 'splashLogo 0.6s ease-out forwards' : 'none',
                            }}
                        >
                            {/* Logo Glow */}
                            <div className="absolute inset-0 bg-[var(--dynamic-accent-highlight)] blur-2xl opacity-20" />

                            {/* Logo Icon */}
                            <SparklesIcon className="w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        </div>

                        <div
                            className="mt-8 flex flex-col items-center gap-3"
                            style={{
                                animation: enableAnimations ? 'splashContent 0.5s ease-out 0.2s forwards' : 'none',
                                opacity: enableAnimations ? 0 : 1,
                            }}
                        >
                            <h1 className="text-4xl font-bold tracking-tight text-white font-[Clash Display, sans-serif]">
                                Spark<span className="text-[var(--dynamic-accent-highlight)]">OS</span>
                            </h1>

                            <div className="h-1 w-12 rounded-full overflow-hidden bg-white/10 mt-4">
                                <div
                                    className="h-full bg-[var(--dynamic-accent-highlight)]"
                                    style={{
                                        animation: enableAnimations ? 'splashProgress 1s ease-in-out infinite' : 'none',
                                    }}
                                />
                            </div>

                            <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-medium mt-2">
                                Personal OS
                            </p>
                        </div>
                    </div>

                    {/* CSS Keyframes */}
                    <style>{`
                        @keyframes splashOrb1 {
                            0%, 100% { transform: scale(1); opacity: 0.3; }
                            50% { transform: scale(1.2); opacity: 0.5; }
                        }
                        @keyframes splashOrb2 {
                            0%, 100% { transform: scale(1.2); opacity: 0.3; }
                            50% { transform: scale(1); opacity: 0.5; }
                        }
                        @keyframes splashLogo {
                            from { transform: scale(0.9); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        @keyframes splashContent {
                            from { transform: translateY(15px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        @keyframes splashProgress {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(200%); }
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
