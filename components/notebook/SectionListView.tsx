/**
 * SectionListView
 * Displays sections within a notebook with tabs/list navigation
 * Allows creating new sections and viewing pages
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import {
    PlusIcon,
    ChevronDownIcon,
    FolderIcon,
    FileTextIcon,
} from '../icons';
import type { NotebookPage } from '../../types';

interface SectionListViewProps {
    onPageOpen?: (pageId: string) => void;
}

const SectionListView: React.FC<SectionListViewProps> = ({ onPageOpen }) => {
    const {
        activeNotebook,
        sections,
        pages,
        activeSectionId,
        createSection,
        createPage,
        navigateToSection,
        navigateToPage,
    } = useNotebook();

    const [showCreateSection, setShowCreateSection] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    // Initialize expanded sections with all sections expanded
    useMemo(() => {
        if (sections.length > 0 && expandedSections.size === 0) {
            setExpandedSections(new Set(sections.map(s => s.id)));
        }
    }, [sections]);

    const handleCreateSection = async () => {
        if (!newSectionTitle.trim() || !activeNotebook) return;

        setIsCreatingSection(true);
        try {
            const section = await createSection(activeNotebook.id, {
                title: newSectionTitle.trim(),
            });
            setShowCreateSection(false);
            setNewSectionTitle('');
            setExpandedSections(prev => new Set([...prev, section.id]));
            navigateToSection(activeNotebook.id, section.id);
        } catch (error) {
            console.error('Failed to create section:', error);
        } finally {
            setIsCreatingSection(false);
        }
    };

    const handleCreatePage = async (sectionId: string) => {
        if (!activeNotebook) return;

        try {
            const page = await createPage(sectionId, {
                title: 'דף חדש',
            });
            navigateToSection(activeNotebook.id, sectionId);
            navigateToPage(activeNotebook.id, sectionId, page.id);
            onPageOpen?.(page.id);
        } catch (error) {
            console.error('Failed to create page:', error);
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    const handlePageClick = (sectionId: string, pageId: string) => {
        if (!activeNotebook) return;
        navigateToSection(activeNotebook.id, sectionId);
        navigateToPage(activeNotebook.id, sectionId, pageId);
        onPageOpen?.(pageId);
    };

    // Get pages for a specific section
    const getPagesForSection = (sectionId: string): NotebookPage[] => {
        return pages.filter(p => p.sectionId === sectionId && !p.parentPageId);
    };

    if (!activeNotebook) {
        return (
            <div className="flex items-center justify-center h-64 text-theme-secondary">
                בחר מחברת כדי לראות את הסעיפים
            </div>
        );
    }

    return (
        <div className="relative min-h-full pb-28">
            {/* Notebook header */}
            <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-xl px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeNotebook.icon}</span>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">
                            {activeNotebook.title}
                        </h2>
                        <p className="text-xs text-theme-secondary">
                            {sections.length} {sections.length === 1 ? 'סעיף' : 'סעיפים'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-2">
                {/* Empty state */}
                {sections.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-5xl mb-4"
                        >
                            📁
                        </motion.div>
                        <h3 className="text-lg font-medium text-white mb-2">אין סעיפים עדיין</h3>
                        <p className="text-theme-secondary text-sm">צור את הסעיף הראשון שלך כדי להתחיל</p>
                    </motion.div>
                )}

                {/* Sections list */}
                <AnimatePresence mode="popLayout">
                    {sections.map((section, index) => {
                        const sectionPages = getPagesForSection(section.id);
                        const isExpanded = expandedSections.has(section.id);
                        const isActive = activeSectionId === section.id;

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.03 }}
                                className="rounded-xl overflow-hidden"
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(var(--dynamic-accent-rgb), 0.1) 0%, rgba(var(--dynamic-accent-rgb), 0.05) 100%)'
                                        : 'rgba(255,255,255,0.02)',
                                    border: isActive
                                        ? '1px solid rgba(var(--dynamic-accent-rgb), 0.3)'
                                        : '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                {/* Section header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                                >
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 0 : -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDownIcon className="w-4 h-4 text-theme-secondary" />
                                    </motion.div>
                                    <FolderIcon className="w-4 h-4 text-theme-secondary" />
                                    <span className="flex-1 text-right font-medium text-white truncate">
                                        {section.title}
                                    </span>
                                    <span className="text-xs text-theme-muted">
                                        {sectionPages.length}
                                    </span>
                                </button>

                                {/* Pages list */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-3 pb-3 space-y-1">
                                                {sectionPages.map((page, pageIndex) => (
                                                    <motion.button
                                                        key={page.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: pageIndex * 0.02 }}
                                                        onClick={() => handlePageClick(section.id, page.id)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                              text-right text-sm text-theme-primary
                              hover:bg-white/5 hover:text-white
                              transition-colors"
                                                    >
                                                        {page.icon ? (
                                                            <span className="text-sm shrink-0">{page.icon}</span>
                                                        ) : (
                                                            <FileTextIcon className="w-4 h-4 shrink-0 text-theme-muted" />
                                                        )}
                                                        <span className="truncate flex-1">{page.title}</span>
                                                    </motion.button>
                                                ))}

                                                {/* Add page button */}
                                                <motion.button
                                                    onClick={() => handleCreatePage(section.id)}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                            text-sm text-theme-muted hover:text-accent-cyan
                            hover:bg-accent-cyan/5 border border-dashed border-white/10
                            transition-colors"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                    <span>דף חדש</span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Create section button/form */}
                {showCreateSection ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                        <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="שם הסעיף"
                            className="w-full h-10 px-3 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:ring-1 focus:ring-accent-cyan
                mb-3"
                            dir="rtl"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateSection();
                                if (e.key === 'Escape') setShowCreateSection(false);
                            }}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateSection}
                                disabled={!newSectionTitle.trim() || isCreatingSection}
                                className="flex-1 h-10 rounded-lg
                  bg-accent-cyan text-white font-medium
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
                            >
                                {isCreatingSection ? 'יוצר...' : 'צור סעיף'}
                            </button>
                            <button
                                onClick={() => setShowCreateSection(false)}
                                className="h-10 px-4 rounded-lg
                  bg-white/5 text-theme-secondary hover:text-white
                  transition-colors"
                            >
                                ביטול
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        onClick={() => setShowCreateSection(true)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
              text-theme-secondary hover:text-accent-cyan
              border border-dashed border-white/10 hover:border-accent-cyan/30
              transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>סעיף חדש</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default SectionListView;
