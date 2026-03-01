
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../../src/utils/haptics';

interface CategoryPillProps {
    label: string;
    emoji?: string;
    isActive: boolean;
    onClick: () => void;
}

export const CategoryPill = ({ label, emoji, isActive, onClick }: CategoryPillProps) => (
    <motion.button
        type="button"
        onClick={() => {
            triggerHaptic();
            onClick();
        }}
        whileTap={{ scale: 0.95 }}
        className={`
      relative flex-shrink-0 flex items-center gap-2 
      px-4 py-2 rounded-full
      font-medium text-sm
      transition-all duration-200
      ${isActive
                ? 'bg-white text-black font-bold'
                : 'bg-[#2C2C2E] text-[#8E8E93] active:bg-[#3A3A3C]'
            }
    `}
    >
        {emoji && <span className="text-base">{emoji}</span>}
        <span>{label}</span>
    </motion.button>
);
