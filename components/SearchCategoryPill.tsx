import React from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '../hooks/useHaptics';

interface SearchCategoryPillProps {
    label: string;
    count?: number;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

const SearchCategoryPill: React.FC<SearchCategoryPillProps> = ({
    label,
    count,
    isActive,
    onClick,
    icon,
}) => {
    const { triggerHaptic } = useHaptics();

    const handleClick = () => {
        triggerHaptic(isActive ? 'light' : 'medium');
        onClick();
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`
        relative px-5 py-2.5 rounded-full flex items-center gap-2 text-base font-medium transition-all duration-300
        snap-center shrink-0 border
        ${isActive
                    ? 'text-white border-transparent bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] shadow-[var(--search-pill-active-shadow)]'
                    : 'bg-[var(--search-pill-bg)] border-[var(--search-pill-border)] text-[var(--text-secondary)] hover:bg-[var(--search-result-hover-bg)] hover:border-[var(--color-gray-200)] hover:text-white'
                }
      `}
        >
            {icon && (
                <span className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                    {icon}
                </span>
            )}
            <span>{label}</span>
            {count !== undefined && count > 0 && (
                <span className={`
          text-[10px] px-1.5 py-0.5 rounded-full font-bold
          ${isActive ? 'bg-white/20 text-white' : 'bg-black/20 text-[var(--text-muted)]'}
        `}>
                    {count}
                </span>
            )}
        </motion.button>
    );
};

export default SearchCategoryPill;
