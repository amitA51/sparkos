import React from 'react';
import { motion } from 'framer-motion';

interface ExerciseChartProps {
    data: { date: Date; value: number }[];
    trend?: 'up' | 'down' | 'stable' | 'no_data';
}

export const ExerciseChart: React.FC<ExerciseChartProps> = ({ data, trend }) => {
    if (!data || data.length < 2) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 animate-pulse">
                    <span className="text-2xl opacity-50">📉</span>
                </div>
                <p className="text-white/40 text-sm">אין מספיק נתונים לגרף</p>
            </div>
        );
    }

    // Normalize data for chart
    const values = data.map(d => d.value);
    const min = Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.1;
    const range = max - min;

    // SVG points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    // Smooth curve - simplified bezier logic for visual flair (catmull-rom or simpler)
    // For now, using polyline but with aggressive styling
    // To make it curved, we'd need a path generator function, keeping it linear but styled for now to be safe
    // Actually, let's try a simple L path
    const pathD = `M ${points.replace(/ /g, ' L ')}`;

    // Area path
    const areaPath = `${pathD} L 100,100 L 0,100 Z`;

    const trendUp = trend === 'up';
    const lineColor = trendUp ? '#10B981' : (trend === 'down' ? '#EF4444' : '#3B82F6'); // Green, Red, or Blue
    const gradientId = `chartGradient-${trendUp ? 'up' : 'neutral'}`;

    return (
        <div className="w-full h-full relative group">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid Lines (Horizontal) */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* Area Fill */}
                <motion.path
                    d={areaPath}
                    fill={`url(#${gradientId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Line Path */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Data Points (Only show start and end for cleaner look) */}
                {data[0] && (
                    <motion.circle
                        cx="0"
                        cy={100 - ((data[0].value - min) / range) * 100}
                        r="4"
                        fill="#0F0F1A"
                        stroke={lineColor}
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    />
                )}
                {data[data.length - 1] && (
                    <motion.circle
                        cx="100"
                        cy={100 - ((data[data.length - 1]!.value - min) / range) * 100}
                        r="4"
                        fill="#fff"
                        stroke={lineColor}
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 }}
                    />
                )}
            </svg>

            {/* Hover Indicator Line (CSS only implementation) */}
            <div className="absolute inset-x-0 inset-y-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-0 left-0">
                <span className="text-[10px] text-white/30 font-mono">
                    {Math.round(max)}kg
                </span>
            </div>
            <div className="absolute bottom-0 left-0">
                <span className="text-[10px] text-white/30 font-mono">
                    {Math.round(min)}kg
                </span>
            </div>
        </div>
    );
};
