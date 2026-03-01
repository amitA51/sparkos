import React from 'react';
import { motion } from 'framer-motion';
import { useHaptics } from '../hooks/useHaptics';
import { ClockIcon, CloseIcon } from './icons';

interface SearchRecentItemProps {
    query: string;
    onSelect: (query: string) => void;
    onRemove: (query: string) => void;
}

const SearchRecentItem: React.FC<SearchRecentItemProps> = ({
    query,
    onSelect,
    onRemove,
}) => {
    const { triggerHaptic } = useHaptics();

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent potentially conflicting event bubbling
        triggerHaptic('light');
        onSelect(query);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        triggerHaptic('medium');
        onRemove(query);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.02 }}
            className="group relative flex items-center bg-[var(--search-pill-bg)] border border-[var(--search-pill-border)] rounded-full pl-3 pr-1 py-1.5 cursor-pointer max-w-[200px] hover:border-[var(--color-accent-cyan)]/30 hover:bg-[var(--search-result-hover-bg)] transition-colors"
            onClick={handleSelect}
        >
            <ClockIcon className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--color-accent-cyan)] transition-colors ml-2 flex-shrink-0" />

            <span className="text-sm text-[var(--text-secondary)] group-hover:text-white truncate flex-1 leading-none pb-0.5">
                {query}
            </span>

            <motion.button
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="p-1 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mr-1"
            >
                <CloseIcon className="w-3 h-3" />
            </motion.button>
        </motion.div>
    );
};

export default SearchRecentItem;

