/**
 * NotebookDetailView
 * Middle layer view showing notebook content
 * Displays sections and pages within the selected notebook
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import BreadcrumbNav from './BreadcrumbNav';
import AddSectionModal from './AddSectionModal';
import {
    ChevronLeftIcon,
    PlusIcon,
    FolderIcon,
    FileTextIcon,
    MoreVerticalIcon,
    TrashIcon,
} from '../icons';
import type { NotebookPage } from '../../types';

interface NotebookDetailViewProps {
    onBack?: () => void;
}

const NotebookDetailView: React.FC<NotebookDetailViewProps> = ({ onBack }) => {
    const {
        activeNotebook,
        sections,
        pages,
        activeSectionId,
        createSection,
        createPage,
        deleteNotebook,
        navigateBack,
        navigateToSection,
        navigateToPage,
    } = useNotebook();

    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    // Get pages for active section
    const sectionPages = useMemo(() => {
        if (!activeSectionId) return [];
        return pages
            .filter((p) => p.sectionId === activeSectionId && !p.parentPageId)
            .sort((a, b) => a.order - b.order);
    }, [pages, activeSectionId]);

    const handleBack = () => {
        if (activeSectionId) {
            // Go back to notebook (deselect section)
            navigateBack();
        } else {
            // Go back to hub
            onBack?.();
        }
    };


    const handleAddSection = useCallback(
        async (title: string) => {
            if (!activeNotebook) return;
            const section = await createSection(activeNotebook.id, { title });
            navigateToSection(activeNotebook.id, section.id);
        },
        [activeNotebook, createSection, navigateToSection]
    );

    const handleCreatePage = async () => {
        if (!activeNotebook || !activeSectionId) return;
        try {
            const page = await createPage(activeSectionId, { title: 'דף חדש' });
            navigateToPage(activeNotebook.id, activeSectionId, page.id);
        } catch (error) {
            console.error('Failed to create page:', error);
        }
    };

    const handlePageClick = (page: NotebookPage) => {
        if (!activeNotebook) return;
        navigateToPage(activeNotebook.id, page.sectionId, page.id);
    };

    const handleDeleteNotebook = async () => {
        if (!activeNotebook) return;
        if (window.confirm(`האם למחוק את המחברת "${activeNotebook.title}"? כל הסעיפים והדפים יימחקו לצמיתות.`)) {
            await deleteNotebook(activeNotebook.id);
            onBack?.();
        }
        setShowMenu(false);
    };

    if (!activeNotebook) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <FolderIcon className="w-8 h-8 text-theme-muted" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">לא נבחרה מחברת</h3>
                <p className="text-theme-secondary mb-6 max-w-xs">
                    המחברת שחיפשת לא נמצאה או שנמחקה.
                </p>
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                    חזרה לרשימה
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-white/5">
                {/* Top bar */}
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

                    {/* Menu */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setShowMenu(!showMenu)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-xl text-theme-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <MoreVerticalIcon className="w-5 h-5" />
                        </motion.button>

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
                      bg-[var(--bg-secondary)] border border-white/10 shadow-xl z-20"
                                    >
                                        <button
                                            onClick={handleDeleteNotebook}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        text-right text-sm text-red-400
                        hover:bg-red-500/10 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            מחק מחברת
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Notebook title */}
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{activeNotebook.icon || '📚'}</span>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                {activeNotebook.title}
                            </h1>
                            <p className="text-xs text-theme-secondary">
                                {sections.length} {sections.length === 1 ? 'סעיף' : 'סעיפים'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Sections tabs */}
                <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/90 backdrop-blur-sm border-b border-white/5">
                    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto hide-scrollbar">
                        {sections.map((section) => (
                            <motion.button
                                key={section.id}
                                onClick={() => navigateToSection(activeNotebook.id, section.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSectionId === section.id
                                    ? 'bg-accent-cyan/20 text-accent-cyan'
                                    : 'bg-white/5 text-theme-primary hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <FolderIcon className="w-4 h-4" />
                                {section.title}
                            </motion.button>
                        ))}

                        {/* Add section button */}
                        <motion.button
                            onClick={() => setShowAddSectionModal(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl
                  text-theme-muted hover:text-accent-cyan
                  border border-dashed border-white/10 hover:border-accent-cyan/30
                  transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Pages list */}
                <div className="px-4 py-3 space-y-2">
                    {/* No section selected state */}
                    {!activeSectionId && sections.length > 0 && (
                        <div className="text-center py-8 text-theme-secondary">
                            <FolderIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>בחר סעיף כדי לראות את הדפים</p>
                        </div>
                    )}

                    {/* No sections state */}
                    {sections.length === 0 && (
                        <div className="text-center py-12 text-theme-secondary">
                            <FolderIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-white mb-2">אין עדיין סעיפים</h3>
                            <p className="text-sm mb-4">צור סעיף ראשון כדי להתחיל</p>
                            <motion.button
                                onClick={() => setShowAddSectionModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-accent-cyan text-white font-medium"
                            >
                                <PlusIcon className="w-4 h-4" />
                                סעיף חדש
                            </motion.button>
                        </div>
                    )}

                    {/* Pages */}
                    {activeSectionId && (
                        <AnimatePresence mode="popLayout">
                            {sectionPages.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <FileTextIcon className="w-10 h-10 mx-auto mb-3 text-theme-muted" />
                                    <p className="text-theme-secondary mb-4">אין עדיין דפים בסעיף זה</p>
                                    <motion.button
                                        onClick={handleCreatePage}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                      bg-accent-cyan text-white font-medium"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        דף חדש
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <>
                                    {sectionPages.map((page, index) => (
                                        <motion.div
                                            key={page.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => handlePageClick(page)}
                                            className="flex items-center gap-3 p-4 rounded-xl cursor-pointer
                        bg-white/[0.02] border border-white/5
                        hover:bg-white/5 hover:border-white/10
                        transition-all duration-200"
                                        >
                                            {page.icon ? (
                                                <span className="text-xl">{page.icon}</span>
                                            ) : (
                                                <FileTextIcon className="w-5 h-5 text-theme-muted" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">
                                                    {page.title}
                                                </h3>
                                                <p className="text-xs text-theme-muted">
                                                    {new Date(page.lastEditedAt).toLocaleDateString('he-IL')}
                                                </p>
                                            </div>
                                            <ChevronLeftIcon className="w-4 h-4 text-theme-muted" />
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* FAB for adding page */}
            {activeSectionId && sectionPages.length > 0 && (
                <motion.button
                    onClick={handleCreatePage}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-24 right-6 z-30
            w-14 h-14 rounded-full
            bg-gradient-to-br from-accent-cyan to-accent-purple
            flex items-center justify-center
            shadow-lg shadow-accent-cyan/30"
                >
                    <PlusIcon className="w-6 h-6 text-white" />
                </motion.button>
            )}

            {/* Add Section Modal */}
            <AddSectionModal
                isOpen={showAddSectionModal}
                onClose={() => setShowAddSectionModal(false)}
                onAdd={handleAddSection}
            />
        </div>
    );
};

export default NotebookDetailView;
