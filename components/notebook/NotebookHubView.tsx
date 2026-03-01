/**
 * NotebookHubView
 * Main hub for the Knowledge & Notes module
 * Displays grid of notebooks with creation modal and empty state
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import NotebookCard from './NotebookCard';
import {
    PlusIcon,
    SearchIcon,
    BookOpenIcon,
    SparklesIcon,
} from '../icons';

// Predefined colors for new notebooks
const NOTEBOOK_COLORS = [
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#22C55E', // Green
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
];

// Predefined icons for new notebooks
const NOTEBOOK_ICONS = ['📚', '📓', '📔', '📕', '📗', '📘', '📙', '✨', '💡', '🎯', '🚀', '💼', '🎨', '🔬', '📊'];

interface NotebookHubViewProps {
    onNotebookOpen?: (notebookId: string) => void;
}

const NotebookHubView: React.FC<NotebookHubViewProps> = ({ onNotebookOpen }) => {
    const {
        notebooks,
        isLoading,
        createNotebook,
        navigateToNotebook,
    } = useNotebook();

    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNotebookTitle, setNewNotebookTitle] = useState('');
    const [newNotebookIcon, setNewNotebookIcon] = useState('📚');
    const [newNotebookColor, setNewNotebookColor] = useState(NOTEBOOK_COLORS[0]);
    const [isCreating, setIsCreating] = useState(false);

    const trimmedQuery = searchQuery.trim();

    // Filter and sort notebooks
    const filteredNotebooks = useMemo(() => {
        let result = notebooks.filter((n) => !n.isArchived);

        // Apply search filter
        if (trimmedQuery) {
            const query = trimmedQuery.toLowerCase();
            result = result.filter((n) => n.title.toLowerCase().includes(query));
        }

        // Sort: pinned first, then by order
        return result.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return a.order - b.order;
        });
    }, [notebooks, trimmedQuery]);

    const handleCreateNotebook = async () => {
        if (!newNotebookTitle.trim()) {
            return;
        }

        setIsCreating(true);
        try {
            const notebook = await createNotebook({
                title: newNotebookTitle.trim(),
                icon: newNotebookIcon,
                color: newNotebookColor,
            });
            setShowCreateModal(false);
            setNewNotebookTitle('');
            setNewNotebookIcon('📚');
            setNewNotebookColor(NOTEBOOK_COLORS[0]);

            // Navigate to the new notebook
            navigateToNotebook(notebook.id);
            onNotebookOpen?.(notebook.id);
        } catch (error) {
            console.error('[NotebookHubView] Failed to create notebook:', error);
            // DEBUG: Show detailed error
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            const errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error));
            alert(`שגיאה ביצירת מחברת:\n${errorMsg}\n\nTechnical Details:\n${errorDetails}`);
        } finally {
            setIsCreating(false);
        }
    };

    const handleNotebookOpen = (notebookId: string) => {
        navigateToNotebook(notebookId);
        onNotebookOpen?.(notebookId);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 space-y-4">
                {/* Search skeleton */}
                <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
                {/* Grid skeleton */}
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-[140px] rounded-2xl bg-white/5 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-full pb-20">
            {/* Header with search */}
            <div className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl pb-3">
                <div className="px-4 pt-2">
                    {/* Search bar */}
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                        <input
                            type="text"
                            placeholder="חיפוש במחברות..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-11 pr-4 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan/50
                transition-all duration-200"
                            dir="rtl"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-2">
                {/* Empty state */}
                {filteredNotebooks.length === 0 && !trimmedQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="text-6xl mb-4"
                        >
                            📚
                        </motion.div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            אין עדיין מחברות
                        </h3>
                        <p className="text-theme-secondary text-sm mb-6 max-w-xs">
                            צור את המחברת הראשונה שלך ותתחיל לארגן את הידע שלך
                        </p>
                        <motion.button
                            onClick={() => {
                                setShowCreateModal(true);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl
                bg-gradient-to-r from-accent-cyan to-accent-purple
                text-white font-medium
                shadow-lg shadow-accent-cyan/20"
                        >
                            <PlusIcon className="w-5 h-5" />
                            יצירת מחברת
                        </motion.button>
                    </motion.div>
                )}

                {/* No results state */}
                {filteredNotebooks.length === 0 && trimmedQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <SearchIcon className="w-12 h-12 text-theme-muted mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">
                            לא נמצאו תוצאות
                        </h3>
                        <p className="text-theme-secondary text-sm">
                            נסה לחפש משהו אחר
                        </p>
                    </motion.div>
                )}

                {/* Notebooks grid */}
                {filteredNotebooks.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        <AnimatePresence mode="popLayout">
                            {filteredNotebooks.map((notebook, index) => (
                                <NotebookCard
                                    key={notebook.id}
                                    notebook={notebook}
                                    index={index}
                                    onOpen={() => handleNotebookOpen(notebook.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            {notebooks.length > 0 && (
                <motion.button
                    onClick={() => setShowCreateModal(true)}
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

            {/* Create Notebook Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[101]
                bg-[var(--bg-secondary)] rounded-t-3xl
                p-6 pb-10 max-h-[80vh] overflow-y-auto"
                            style={{
                                boxShadow: '0 -10px 60px rgba(0,0,0,0.5)',
                            }}
                        >
                            {/* Handle */}
                            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                                    <BookOpenIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">מחברת חדשה</h2>
                            </div>

                            {/* Form */}
                            <div className="space-y-5">
                                {/* Title input */}
                                <div>
                                    <label className="block text-sm text-theme-secondary mb-2">שם המחברת</label>
                                    <input
                                        type="text"
                                        value={newNotebookTitle}
                                        onChange={(e) => setNewNotebookTitle(e.target.value)}
                                        placeholder="לדוגמה: רעיונות לפרויקט"
                                        className="w-full h-12 px-4 rounded-xl
                      bg-white/5 border border-white/10
                      text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-accent-cyan/50
                      transition-all duration-200"
                                        dir="rtl"
                                        autoFocus
                                    />
                                </div>

                                {/* Icon picker */}
                                <div>
                                    <label className="block text-sm text-theme-secondary mb-2">אייקון</label>
                                    <div className="flex flex-wrap gap-2">
                                        {NOTEBOOK_ICONS.map((icon) => (
                                            <motion.button
                                                key={icon}
                                                onClick={() => setNewNotebookIcon(icon)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl
                          transition-all duration-200
                          ${newNotebookIcon === icon
                                                        ? 'bg-accent-cyan/20 ring-2 ring-accent-cyan'
                                                        : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                {icon}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color picker */}
                                <div>
                                    <label className="block text-sm text-theme-secondary mb-2">צבע</label>
                                    <div className="flex flex-wrap gap-2">
                                        {NOTEBOOK_COLORS.map((color) => (
                                            <motion.button
                                                key={color}
                                                onClick={() => setNewNotebookColor(color)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`w-8 h-8 rounded-full transition-all duration-200 ${newNotebookColor === color
                                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--bg-secondary)]'
                                                    : ''
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Create button */}
                                <motion.button
                                    onClick={handleCreateNotebook}
                                    disabled={!newNotebookTitle.trim() || isCreating}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-14 rounded-xl
                    bg-gradient-to-r from-accent-cyan to-accent-purple
                    text-white font-semibold text-lg
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg shadow-accent-cyan/20
                    transition-all duration-200"
                                >
                                    {isCreating ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <SparklesIcon className="w-5 h-5" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <PlusIcon className="w-5 h-5" />
                                            יצירת מחברת
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotebookHubView;
