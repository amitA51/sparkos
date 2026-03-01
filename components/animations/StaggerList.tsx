/**
 * StaggerList - Premium Stagger Animation Components
 * 
 * Use these to wrap lists for premium stagger-load animations.
 * Based on STAGGER_CONTAINER/STAGGER_ITEM from animation presets.
 */

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { SPRING_PREMIUM } from './presets';

// Stagger item variants with spring physics
const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 16,
        scale: 0.97,
        filter: 'blur(4px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: SPRING_PREMIUM,
    },
};

interface StaggerListProps {
    children: React.ReactNode;
    className?: string;
    /** Delay before starting stagger (ms) */
    delay?: number;
    /** Stagger delay between children (seconds) */
    staggerDelay?: number;
}

/**
 * Container that staggers its children's animations.
 * Wrap your list items with StaggerItem components.
 */
export const StaggerList: React.FC<StaggerListProps> = ({
    children,
    className = '',
    delay = 0.1,
    staggerDelay = 0.05,
}) => {
    const customContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.div
            variants={customContainerVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Animated item that works inside a StaggerList.
 * Fades in with slight upward motion and blur clear.
 */
export const StaggerItem: React.FC<StaggerItemProps> = ({
    children,
    className = '',
}) => {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
};

/**
 * Higher-order component to wrap any list with stagger animations.
 * Automatically wraps each item in a StaggerItem.
 */
export function withStaggerAnimation<T>(
    items: T[],
    renderItem: (item: T, index: number) => React.ReactNode,
    options?: {
        className?: string;
        itemClassName?: string;
        delay?: number;
        staggerDelay?: number;
        keyExtractor?: (item: T, index: number) => string;
    }
): React.ReactNode {
    const {
        className = '',
        itemClassName = '',
        delay = 0.1,
        staggerDelay = 0.05,
        keyExtractor = (_: T, index: number) => String(index),
    } = options || {};

    return (
        <StaggerList className={className} delay={delay} staggerDelay={staggerDelay}>
            {items.map((item, index) => (
                <StaggerItem key={keyExtractor(item, index)} className={itemClassName}>
                    {renderItem(item, index)}
                </StaggerItem>
            ))}
        </StaggerList>
    );
}

export default StaggerList;
