/**
 * AddSectionModal
 * Premium modal for creating a new notebook section
 * Follows the same design language as AddSpaceModal
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, CheckIcon, FolderIcon } from '../icons';

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (title: string) => Promise<void>;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20, filter: 'blur(8px)' },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        filter: 'blur(8px)',
        transition: { duration: 0.2 },
    },
};

const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (!isOpen) return;
        // Small delay to ensure the modal is rendered
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = useCallback(async () => {
        if (!title.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAdd(title.trim());
            setTitle('');
            onClose();
        } catch (error) {
            console.error('Failed to create section:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [title, isSubmitting, onAdd, onClose]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && title.trim()) {
                e.preventDefault();
                handleSubmit();
            } else if (e.key === 'Escape') {
                onClose();
            }
        },
        [handleSubmit, onClose, title]
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(12,12,18,0.98) 0%, rgba(8,8,14,0.98) 100%)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(34, 211, 238, 0.15)' }}
                                >
                                    <FolderIcon className="w-5 h-5 text-accent-cyan" />
                                </div>
                                <h2 className="text-xl font-bold text-white/90 font-heading">
                                    סעיף חדש
                                </h2>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-xl transition-colors text-white/40 hover:text-white"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <XIcon className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-medium text-theme-primary mb-2">
                                    שם הסעיף
                                </label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="הזן שם לסעיף..."
                                    dir="rtl"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-theme-muted focus:outline-none focus:border-accent-cyan/50 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-white/[0.04] flex gap-3">
                            <motion.button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-medium text-theme-secondary transition-colors"
                                style={{ background: 'rgba(255,255,255,0.05)' }}
                                whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                ביטול
                            </motion.button>
                            <motion.button
                                onClick={handleSubmit}
                                disabled={!title.trim() || isSubmitting}
                                className="flex-1 py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #22D3EE, #8B5CF6)',
                                    boxShadow: '0 8px 24px rgba(34, 211, 238, 0.3)',
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                ) : (
                                    <>
                                        <CheckIcon className="w-5 h-5" />
                                        צור סעיף
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddSectionModal;
