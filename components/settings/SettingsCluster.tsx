import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, GROUPS, SettingsCategory, SettingsGroup, CategoryInfo } from './settingsRegistry';
import { ChevronLeftIcon } from '../icons';
import { AuroraBackground } from '../ui/AuroraBackground';
import { Premium3DCard } from '../ui/Premium3DCard';

interface SettingsClusterProps {
    onSelectCategory: (category: SettingsCategory) => void;
}

// Use GROUPS from registry for consistency

const SettingsCluster: React.FC<SettingsClusterProps> = ({ onSelectCategory }) => {

    // Group categories by their cluster ID
    const groupedCategories = useMemo(() => {
        const groups: Record<SettingsGroup, CategoryInfo[]> = {} as any;
        CATEGORIES.forEach(cat => {
            if (!groups[cat.group]) groups[cat.group] = [];
            groups[cat.group].push(cat);
        });
        return groups;
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 30
            } as any
        }
    };

    return (
        <div className="relative isolate">
            {/* The "Pulse" of the OS */}
            <AuroraBackground />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-12 pb-24 relative z-10"
            >
                {GROUPS.map((group) => {
                    const categories = groupedCategories[group.id] || [];
                    if (categories.length === 0) return null;

                    return (
                        <motion.div key={group.id} variants={itemVariants} className="space-y-6">
                            {/* Premium Cluster Header with Emoji */}
                            <div className="px-1 flex items-center gap-3">
                                <span className="text-3xl">{group.emoji}</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {group.title}
                                    </h2>
                                    <span className="text-sm font-medium text-white/40">
                                        {group.subtitle}
                                    </span>
                                </div>
                            </div>

                            {/* Advanced Bento Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {categories.map((category, index) => {
                                    // Make first item of each group span 2 columns on desktop for distinct "Bento" look
                                    const isFeatured = index === 0;

                                    return (
                                        <div
                                            key={category.id}
                                            className={`${isFeatured ? 'md:col-span-2' : ''}`}
                                        >
                                            <Premium3DCard
                                                onClick={() => {
                                                    onSelectCategory(category.id);
                                                    navigator.vibrate?.(10);
                                                }}
                                                className={`h-full ${isFeatured ? 'bg-gradient-to-br from-white/[0.05] to-transparent' : 'bg-white/[0.02]'} rounded-3xl`}
                                                depth={isFeatured ? 20 : 15} // More depth for featured cards
                                                glareColor={category.gradient[0]}
                                            >
                                                <div className="relative z-10 flex flex-row items-center justify-between gap-6 px-6 py-6 h-full">
                                                    <div className="flex-1 flex flex-col items-start justify-center h-full">
                                                        {/* Icon with Glassmorphism */}
                                                        <div
                                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl mb-4
                                                                     backdrop-blur-md border border-white/10"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${category.gradient[0]}80, ${category.gradient[1]}40)`,
                                                                boxShadow: `0 8px 32px ${category.gradient[0]}30`,
                                                                transform: "translateZ(30px)" // Parallax the icon
                                                            }}
                                                        >
                                                            {category.icon}
                                                        </div>

                                                        <div style={{ transform: "translateZ(20px)" }}>
                                                            <h3 className="text-xl font-bold text-white transition-colors tracking-wide">
                                                                {category.title}
                                                            </h3>
                                                            <span className="text-sm text-white/40 mt-1 font-medium block">
                                                                {category.count} פריטים
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Arrow Interaction */}
                                                    <div
                                                        className="flex flex-col items-center justify-center"
                                                        style={{ transform: "translateZ(10px)" }}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-colors">
                                                            <ChevronLeftIcon className="w-5 h-5 text-white/30" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Premium3DCard>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default SettingsCluster;
