import React from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, SparklesIcon } from './icons';

interface PremiumEmptySearchProps {
    onSuggestionClick?: (suggestion: string) => void;
}

const PremiumEmptySearch: React.FC<PremiumEmptySearchProps> = ({ onSuggestionClick }) => {
    const suggestions = [
        'משימות פתוחות להיום',
        'סיכום שבועי',
        'רעיונות לפרויקטים',
        'אימונים אחרונים'
    ];

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)] rounded-full blur-[40px] opacity-20 animate-pulse" />
                <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                    <SearchIcon className="w-10 h-10 text-white/80" />
                    <motion.div
                        animate={{
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 5,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-2 -right-2"
                    >
                        <SparklesIcon className="w-6 h-6 text-[var(--color-accent-gold)] drop-shadow-[0_0_8px_var(--color-accent-gold)]" />
                    </motion.div>
                </div>
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3"
            >
                לחיפוש מהיר וחכם
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[var(--text-secondary)] max-w-xs mx-auto mb-8 text-sm leading-relaxed"
            >
                חפש בכל הפריטים שלך, או שאל את ה-AI שאלה כדי לקבל תשובה מרוכזת ומדויקת.
            </motion.p>

            {onSuggestionClick && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-2 max-w-md"
                >
                    {suggestions.map((s, _i) => (
                        <motion.button
                            key={s}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onSuggestionClick(s)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                        >
                            {s}
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default PremiumEmptySearch;
