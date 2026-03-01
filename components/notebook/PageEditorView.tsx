/**
 * PageEditorView
 * Full-screen page editor view with header and navigation
 * Wraps NotebookEditor with page metadata and actions
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import NotebookEditor from './NotebookEditor';
import BreadcrumbNav from './BreadcrumbNav';
import {
    ChevronLeftIcon,
    StarIcon,
    MoreVerticalIcon,
    TrashIcon,
    EditIcon,
} from '../icons';

interface PageEditorViewProps {
    onBack?: () => void;
}

const PageEditorView: React.FC<PageEditorViewProps> = ({ onBack }) => {
    const {
        activePage,
        activeNotebook,
        activeSection,
        updatePage,
        deletePage,
        navigateBack,
    } = useNotebook();

    const [showMenu, setShowMenu] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(activePage?.title || '');

    const handleBack = useCallback(() => {
        navigateBack();
        onBack?.();
    }, [navigateBack, onBack]);

    const handleToggleFavorite = useCallback(async () => {
        if (!activePage) return;
        await updatePage(activePage.id, { isFavorite: !activePage.isFavorite });
    }, [activePage, updatePage]);

    const handleTitleSave = useCallback(async () => {
        if (!activePage || !titleValue.trim()) return;
        await updatePage(activePage.id, { title: titleValue.trim() });
        setIsEditingTitle(false);
    }, [activePage, titleValue, updatePage]);

    const handleDelete = useCallback(async () => {
        if (!activePage) return;
        if (window.confirm('האם למחוק את הדף? לא ניתן לבטל פעולה זו.')) {
            await deletePage(activePage.id);
            handleBack();
        }
        setShowMenu(false);
    }, [activePage, deletePage, handleBack]);

    // Update title value when page changes
    if (activePage && titleValue !== activePage.title && !isEditingTitle) {
        setTitleValue(activePage.title);
    }

    if (!activePage || !activeNotebook || !activeSection) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <EditIcon className="w-8 h-8 text-theme-muted" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">דף לא נמצא</h3>
                <p className="text-theme-secondary mb-6 max-w-xs">
                    הדף שחיפשת לא נמצא או שנמחק.
                </p>
                <motion.button
                    onClick={handleBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    חזרה למחברת
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/5">
                {/* Top bar with actions */}
                <div className="flex items-center gap-2 px-3 py-2">
                    {/* Back button */}
                    <motion.button
                        onClick={handleBack}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl text-theme-secondary hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="חזור"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </motion.button>

                    {/* Breadcrumb */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <BreadcrumbNav className="text-xs" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {/* Favorite */}
                        <motion.button
                            onClick={handleToggleFavorite}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-2 rounded-xl transition-colors ${activePage.isFavorite
                                ? 'text-yellow-400 bg-yellow-400/10'
                                : 'text-theme-secondary hover:text-yellow-400 hover:bg-white/5'
                                }`}
                            aria-label={activePage.isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
                        >
                            <StarIcon className="w-5 h-5" />
                        </motion.button>

                        {/* Menu */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowMenu(!showMenu)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-xl text-theme-secondary hover:text-white hover:bg-white/5 transition-colors"
                                aria-label="אפשרויות"
                            >
                                <MoreVerticalIcon className="w-5 h-5" />
                            </motion.button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute left-0 top-full mt-1 w-48 p-1 rounded-xl
                        bg-[var(--bg-secondary)] border border-white/10
                        shadow-xl z-20"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsEditingTitle(true);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                          text-right text-sm text-theme-primary
                          hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                                שנה שם
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                          text-right text-sm text-red-400
                          hover:bg-red-500/10 transition-colors"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                מחק דף
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Page title */}
                <div className="px-4 pb-3">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleTitleSave();
                                if (e.key === 'Escape') {
                                    setTitleValue(activePage.title);
                                    setIsEditingTitle(false);
                                }
                            }}
                            className="w-full text-2xl font-bold text-white bg-transparent
                border-b-2 border-accent-cyan pb-1
                focus:outline-none"
                            dir="rtl"
                            autoFocus
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            {activePage.icon && (
                                <span className="text-2xl">{activePage.icon}</span>
                            )}
                            <h1
                                onClick={() => setIsEditingTitle(true)}
                                className="text-2xl font-bold text-white cursor-pointer
                  hover:text-accent-cyan transition-colors"
                            >
                                {activePage.title}
                            </h1>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto">
                <NotebookEditor
                    pageId={activePage.id}
                    initialContent={activePage.content}
                    autoFocus={!isEditingTitle}
                />
            </div>
        </div>
    );
};

export default PageEditorView;
