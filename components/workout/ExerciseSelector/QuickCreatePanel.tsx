
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddIcon, CloseIcon } from '../../icons';

interface QuickCreatePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, muscleGroup: string) => void;
    isCreating: boolean;
    muscleGroups: string[];
}

export const QuickCreatePanel = ({ isOpen, onClose, onCreate, isCreating, muscleGroups }: QuickCreatePanelProps) => {
    const [name, setName] = useState('');
    const [muscle, setMuscle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setName('');
            setMuscle('');
        }
    }, [isOpen]);

    const handleSubmit = useCallback(() => {
        if (name.trim()) {
            onCreate(name.trim(), muscle);
        }
    }, [name, muscle, onCreate]);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    }, [handleSubmit]);

    const handleMuscleClick = useCallback((group: string) => {
        setMuscle(prev => prev === group ? '' : group);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="rounded-3xl overflow-hidden mb-4 bg-[#2C2C2E] shadow-xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#a3e635] flex items-center justify-center">
                                <AddIcon className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-[15px]">תרגיל חדש</h3>
                                <p className="text-[11px] text-[#8E8E93]">צור והוסף לאימון במכה אחת</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#8E8E93] hover:text-white transition-colors"
                        >
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="p-5 space-y-4">
                        <div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="שם התרגיל"
                                className="w-full h-12 px-4 rounded-xl bg-[#1C1C1E] text-white placeholder:text-[#8E8E93] outline-none focus:ring-1 focus:ring-[#a3e635] transition-all text-[15px] font-medium"
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                            {muscleGroups.filter(g => g !== 'all').map(group => (
                                <button
                                    key={group}
                                    type="button"
                                    onClick={() => handleMuscleClick(group)}
                                    className={`
                    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${muscle === group
                                            ? 'bg-[#a3e635] text-black'
                                            : 'bg-[#1C1C1E] text-[#8E8E93]'
                                        }
                  `}
                                >
                                    {group}
                                </button>
                            ))}
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!name.trim() || isCreating}
                            whileTap={{ scale: 0.97 }}
                            className="w-full h-12 rounded-full font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#a3e635] text-black hover:bg-[#b2f050]"
                        >
                            {isCreating ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                                    />
                                    <span className="text-black">יוצר...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-black">צור והוסף לאימון</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
