import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PremiumHeaderProps {
    title: string;
    subtitle?: string | React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode; // For stats or extra content below title
    className?: string;
    icon?: React.ReactNode; // Optional icon next to title
    showTimeGreeting?: boolean; // Show dynamic greeting based on time
}

// Get time-based greeting emoji and text
const getTimeGreeting = (): { emoji: string; greeting: string } => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return { emoji: '🌅', greeting: 'בוקר טוב' };
    } else if (hour >= 12 && hour < 17) {
        return { emoji: '☀️', greeting: 'צהריים טובים' };
    } else if (hour >= 17 && hour < 21) {
        return { emoji: '🌆', greeting: 'ערב טוב' };
    } else {
        return { emoji: '🌙', greeting: 'לילה טוב' };
    }
};

const PremiumHeader: React.FC<PremiumHeaderProps> = ({
    title,
    subtitle,
    actions,
    children,
    className = '',
    icon,
    showTimeGreeting = false,
}) => {
    const timeGreeting = useMemo(() => getTimeGreeting(), []);

    // Instant visibility - no delays
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0,
                delayChildren: 0,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 1, y: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }
        }
    };

    return (
        <header
            className={`sticky top-0 z-30 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-3 pt-[max(env(safe-area-inset-top,20px),1rem)] border-b border-white/5 bg-slate-950/95 ${className}`}
        >
            <motion.div
                className="flex flex-col gap-3 max-w-3xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center justify-between gap-3">
                    {/* Title & Subtitle */}
                    <div className="flex items-center gap-3 min-w-0">
                        {(icon || showTimeGreeting) && (
                            <motion.div
                                variants={itemVariants}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5"
                            >
                                {icon ? icon : <span className="text-xl">{timeGreeting.emoji}</span>}
                            </motion.div>
                        )}

                        <div className="min-w-0">
                            {showTimeGreeting && (
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-0.5 text-[11px] font-medium text-white/60"
                                >
                                    {timeGreeting.greeting}
                                </motion.div>
                            )}

                            <motion.h1
                                variants={itemVariants}
                                className="text-[26px] sm:text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-white"
                            >
                                <span className="block truncate">{title}</span>
                            </motion.h1>

                            {subtitle && (
                                <motion.div
                                    variants={itemVariants}
                                    className="mt-1 text-[13px] font-medium text-white/60 line-clamp-2"
                                >
                                    {subtitle}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {actions && (
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-shrink-0 items-center gap-2"
                        >
                            {actions}
                        </motion.div>
                    )}
                </div>

                {/* Stats / Extra Content */}
                {children && (
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-3 pt-1"
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </header>
    );
};

export default PremiumHeader;
