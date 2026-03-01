import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, CheckCircleIcon } from './icons';
import { useHaptics } from '../hooks/useHaptics';
import { useData } from '../src/contexts/DataContext';
import { useModal } from '../state/ModalContext';
import { todayKey } from '../utils/dateUtils';

const SimpleQuickNote: React.FC = () => {
    const { modals, closeModal } = useModal();
    const { triggerHaptic } = useHaptics();
    const { addPersonalItem } = useData();

    const modal = modals['quickNote'];
    const isOpen = modal?.isOpen ?? false;

    const [text, setText] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setText('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleClose = () => {
        closeModal('quickNote');
    };

    const handleSubmit = async () => {
        if (!text.trim()) return;

        triggerHaptic('medium');

        // 🎯 OPTIMISTIC: Capture text, close immediately, save in background
        const savedContent = text.trim();
        const savedTitle = 'פתק מהיר';
        handleClose(); // Close immediately for instant feedback

        try {
            if (addPersonalItem) {
                await addPersonalItem({
                    type: 'note',
                    title: savedTitle,
                    content: savedContent,
                    dueDate: todayKey(),
                });
            }
            triggerHaptic('heavy'); // Success confirmation
        } catch {
            // DataContext handles rollback - item will disappear if save fails
            triggerHaptic('light');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: 40, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 40, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(12, 12, 18, 0.95)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-white/[0.04]">
                            <span className="text-white/50 text-sm font-medium">📝 פתק מהיר</span>
                            <button
                                onClick={handleClose}
                                className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors duration-300"
                            >
                                <CloseIcon className="w-5 h-5 text-white/40" />
                            </button>
                        </div>

                        {/* Input */}
                        <div className="p-4">
                            <textarea
                                ref={inputRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="כתוב משהו מהיר..."
                                rows={5}
                                className="w-full bg-white/[0.02] rounded-xl p-3 text-white placeholder:text-white/30 text-base resize-none focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
                                style={{ direction: 'rtl' }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-3 pt-0">
                            <span className="text-[10px] text-white/25">Ctrl+Enter לשמירה</span>
                            <motion.button
                                onClick={handleSubmit}
                                disabled={!text.trim()}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm disabled:opacity-40 transition-all duration-300"
                                style={{
                                    background: text.trim() ? 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))' : 'rgba(255,255,255,0.04)',
                                    color: 'white',
                                    boxShadow: text.trim() ? '0 4px 12px rgba(var(--dynamic-accent-glow), 0.2)' : 'none',
                                }}
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                שמור
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SimpleQuickNote;
