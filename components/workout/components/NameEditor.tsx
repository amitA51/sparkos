import { memo, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../workout-premium.css';

// ============================================================
// COMPONENT
// ============================================================

export interface NameEditorProps {
    value: string;
    suggestions: string[];
    onSave: (name: string) => void;
    onCancel: () => void;
}

export const NameEditor = memo<NameEditorProps>(({ value, suggestions, onSave, onCancel }) => {
    const [tempName, setTempName] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const filteredSuggestions = useMemo(() => {
        if (!tempName.trim()) return suggestions.slice(0, 8);
        const lower = tempName.toLowerCase();
        return suggestions
            .filter(s => s.toLowerCase().includes(lower) && s.toLowerCase() !== lower)
            .slice(0, 6);
    }, [tempName, suggestions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="space-y-4 mb-4"
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') onSave(tempName.trim());
                        if (e.key === 'Escape') onCancel();
                    }}
                    placeholder="שם התרגיל"
                    className="
                        w-full px-5 py-4 rounded-2xl 
                        bg-[#1C1C1E] border border-white/10
                        text-white text-center text-xl font-bold 
                        outline-none transition-all
                        focus:border-[#0A84FF] focus:shadow-[0_0_20px_rgba(10,132,255,0.2)]
                    "
                />
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[1px]"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(10,132,255,0.5), transparent)',
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </div>

            {/* Suggestions */}
            <AnimatePresence>
                {filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap justify-center gap-2"
                    >
                        {filteredSuggestions.map((name, idx) => (
                            <motion.button
                                key={name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                type="button"
                                onClick={() => onSave(name)}
                                className="
                                    px-4 py-2 rounded-xl 
                                    bg-[#2C2C2E] border border-white/5
                                    text-sm text-white/80 font-medium
                                    hover:bg-[#3A3A3C] hover:border-white/10
                                    transition-all active:scale-95
                                "
                            >
                                {name}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl bg-[#2C2C2E] text-white/70 font-semibold text-sm"
                >
                    ביטול
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSave(tempName.trim())}
                    className="px-6 py-3 rounded-xl bg-[#0A84FF] text-white font-semibold text-sm shadow-lg shadow-[#0A84FF]/20"
                >
                    שמור
                </motion.button>
            </div>
        </motion.div>
    );
});

NameEditor.displayName = 'NameEditor';
