import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '../icons';

export interface PremiumEmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    illustration?: string;
    color?: string;
    suggestions?: string[];
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const PremiumEmptyState: React.FC<PremiumEmptyStateProps> = ({
    title,
    description,
    icon,
    illustration = '◊',
    color = 'var(--dynamic-accent-start)',
    suggestions = [],
    actionLabel,
    onAction,
    className = '',
}) => {
    return (
        <motion.div
            className={`relative flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center ${className}`}
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className="relative mb-6 sm:mb-8"
                animate={{
                    y: [0, -6, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl"
                    style={{
                        background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
                        border: `1px solid ${color}30`,
                        color: color,
                    }}
                >
                    {icon || illustration}

                    <motion.div
                        className="absolute -inset-4 rounded-[2rem]"
                        style={{
                            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
                            filter: 'blur(24px)',
                        }}
                        animate={{
                            opacity: [0.2, 0.35, 0.2],
                            scale: [0.95, 1.05, 0.95],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Decorative orbit */}
                    {!icon && (
                        <motion.div
                            className="absolute top-0 right-0 -translate-y-2 translate-x-2"
                            animate={{
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <SparklesIcon
                                className="w-6 h-6 sm:w-8 sm:h-8"
                                style={{ color: color }}
                            />
                        </motion.div>
                    )}
                </div>

                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            background: color,
                            opacity: 0.5,
                            left: `${25 + Math.random() * 50}%`,
                            top: `${25 + Math.random() * 50}%`,
                        }}
                        animate={{
                            y: [-15, 15, -15],
                            x: [-8, 8, -8],
                            opacity: [0, 0.6, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>

            <motion.h2
                className="text-lg sm:text-xl font-bold text-white mb-2 font-heading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {title}
            </motion.h2>

            <motion.p
                className="text-theme-secondary max-w-[280px] sm:max-w-sm mb-5 sm:mb-8 leading-relaxed text-xs sm:text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {description}
            </motion.p>

            {suggestions.length > 0 && (
                <motion.div
                    className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-8 px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {suggestions.map((suggestion, index) => (
                        <motion.span
                            key={suggestion}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs"
                            style={{
                                background: `${color}10`,
                                color: color,
                                border: `1px solid ${color}20`,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {suggestion}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {onAction && actionLabel && (
                <motion.button
                    className="relative px-6 py-3 rounded-2xl font-semibold text-white overflow-hidden group touch-manipulation text-sm sm:text-base"
                    style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                        boxShadow: `0 8px 30px -10px ${color}`,
                    }}
                    onClick={onAction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {actionLabel}
                    </span>

                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        }}
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                        }}
                    />
                </motion.button>
            )}

            <motion.div
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                    background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 60%)`,
                }}
            />
        </motion.div>
    );
};
