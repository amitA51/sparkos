/**
 * PageListView
 * Displays pages within a section with card layout
 * Features preview snippets and quick actions
 */

import { useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import {
    PlusIcon,
    FileTextIcon,
    StarIcon,
    ClockIcon,
    TrashIcon,
} from '../icons';
import type { NotebookPage } from '../../types';

interface PageListViewProps {
    onPageOpen?: (pageId: string) => void;
}

// Helper to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString('he-IL');
};

// Helper to get preview text from TipTap content (fallback for old pages)
const extractPreviewFromContent = (page: NotebookPage, maxLength = 80): string => {
    try {
        const content = page.content?.content || [];
        for (const node of content) {
            if (node.type === 'paragraph' && node.content) {
                const text = node.content
                    .filter((n: { type: string }) => n.type === 'text')
                    .map((n: { text?: string }) => n.text || '')
                    .join('');
                if (text.trim()) {
                    return text.length > maxLength
                        ? text.substring(0, maxLength) + '...'
                        : text;
                }
            }
        }
    } catch {
        // Ignore errors
    }
    return '';
};

// Get preview with backwards compatibility: use cached field first, fallback to slow calc
const getPreview = (page: NotebookPage): string => {
    // Fast path: use cached plainTextPreview if available
    if (page.plainTextPreview) {
        return page.plainTextPreview.length > 80
            ? page.plainTextPreview.substring(0, 80) + '...'
            : page.plainTextPreview;
    }
    // Slow path: calculate from content for old pages without cached preview
    return extractPreviewFromContent(page, 80);
};

const PageListView: React.FC<PageListViewProps> = ({ onPageOpen }) => {
    const {
        activeNotebook,
        activeSection,
        pages,
        createPage,
        updatePage,
        navigateToPage,
        deletePage,
    } = useNotebook();

    // Filter pages for current section (root pages only)
    const sectionPages = useMemo(() => {
        return pages
            .filter((p) => p.sectionId === activeSection?.id && !p.parentPageId)
            .sort((a, b) => {
                // Favorites first, then by order
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return a.order - b.order;
            });
    }, [pages, activeSection?.id]);

    const handleCreatePage = async (templateId?: string) => {
        if (!activeNotebook || !activeSection) return;

        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(10);

        try {
            const page = await createPage(activeSection.id, {}, templateId);
            navigateToPage(activeNotebook.id, activeSection.id, page.id);
            onPageOpen?.(page.id);
        } catch (error) {
            console.error('Failed to create page:', error);
        }
    };

    const handlePageClick = (pageId: string) => {
        if (!activeNotebook || !activeSection) return;
        navigateToPage(activeNotebook.id, activeSection.id, pageId);
        onPageOpen?.(pageId);
    };

    if (!activeSection) {
        return (
            <div className="flex items-center justify-center h-64 text-theme-secondary">
                בחר סעיף כדי לראות את הדפים
            </div>
        );
    }

    return (
        <div className="relative min-h-full pb-28">
            {/* Section header */}
            <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur-xl px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                    {activeSection.icon ? (
                        <span className="text-xl">{activeSection.icon}</span>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <FileTextIcon className="w-4 h-4 text-theme-secondary" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">
                            {activeSection.title}
                        </h2>
                        <p className="text-xs text-theme-secondary">
                            {sectionPages.length} {sectionPages.length === 1 ? 'דף' : 'דפים'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3 space-y-3">
                {/* Empty state */}
                {sectionPages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <motion.div
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="text-5xl mb-4"
                        >
                            📝
                        </motion.div>
                        <h3 className="text-lg font-medium text-white mb-2">
                            אין עדיין דפים
                        </h3>
                        <p className="text-theme-secondary text-sm mb-4">
                            צור את הדף הראשון שלך בסעיף
                        </p>
                        <motion.button
                            onClick={() => handleCreatePage()}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl
                bg-accent-cyan text-white font-medium"
                        >
                            <PlusIcon className="w-4 h-4" />
                            דף חדש
                        </motion.button>
                    </motion.div>
                )}

                {/* Pages list */}
                <AnimatePresence mode="popLayout">
                    {sectionPages.map((page) => (
                        <SwipeablePageItem
                            key={page.id}
                            page={page}
                            onClick={() => handlePageClick(page.id)}
                            onFavorite={() => updatePage(page.id, { isFavorite: !page.isFavorite })}
                            onDelete={() => {
                                if (window.confirm('למחוק את הדף?')) {
                                    deletePage(page.id);
                                }
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Action Button */}
            {sectionPages.length > 0 && (
                <motion.button
                    onClick={() => handleCreatePage()}
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
        </div>
    );
};

// Swipeable Item Component
const SwipeablePageItem = ({
    page,
    onClick,
    onFavorite,
    onDelete
}: {
    page: NotebookPage;
    onClick: () => void;
    onFavorite: () => void;
    onDelete: () => void;
}) => {
    const x = useMotionValue(0);
    const preview = getPreview(page);

    // Transform background colors/icons based on swipe direction
    const rightOpacity = useTransform(x, [50, 100], [0, 1]);
    const leftOpacity = useTransform(x, [-50, -100], [0, 1]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            // Swiped Right -> Favorite
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
            onFavorite();
        } else if (info.offset.x < -100) {
            // Swiped Left -> Delete
            if (navigator.vibrate) navigator.vibrate(50);
            onDelete();
        }
    };

    // Monitor drag for vibration feedback during drag (optional but cool)
    // We'll skip complex real-time vibration for now to keep it simple

    return (
        <div className="relative mb-3 group">
            {/* Background Actions */}
            <div className="absolute inset-0 rounded-xl overflow-hidden flex justify-between items-center px-4">
                {/* Right Background (Favorite) */}
                <motion.div
                    style={{ opacity: rightOpacity }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-yellow-400/20 rounded-l-xl flex items-center justify-start pl-4"
                >
                    <StarIcon className="w-6 h-6 text-yellow-400" />
                </motion.div>

                {/* Left Background (Delete) */}
                <motion.div
                    style={{ opacity: leftOpacity }}
                    className="absolute inset-y-0 right-0 w-1/2 bg-red-500/20 rounded-r-xl flex items-center justify-end pr-4"
                >
                    <TrashIcon className="w-6 h-6 text-red-500" />
                </motion.div>
            </div>

            {/* Foreground Card */}
            <motion.div
                style={{ x, touchAction: 'pan-y' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2} // Elastic feedback
                onDragEnd={handleDragEnd}
                onClick={onClick}
                className="relative rounded-xl p-4 cursor-pointer
                  bg-[var(--bg-secondary)] border border-white/5
                  shadow-sm z-10"
                whileTap={{ scale: 0.98 }}
            >
                {/* Cover image (if present) */}
                {page.coverImageUrl && (
                    <div
                        className="absolute inset-0 rounded-xl opacity-10"
                        style={{
                            backgroundImage: `url(${page.coverImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                )}

                <div className="relative z-10 flex items-start gap-3">
                    {/* Page icon */}
                    <div className="shrink-0 mt-0.5">
                        {page.icon ? (
                            <span className="text-xl">{page.icon}</span>
                        ) : (
                            <FileTextIcon className="w-5 h-5 text-theme-muted" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white truncate">
                                {page.title}
                            </h3>
                            {page.isFavorite && (
                                <StarIcon className="w-4 h-4 text-yellow-400 shrink-0" />
                            )}
                        </div>

                        {/* Preview text */}
                        {preview && (
                            <p className="text-sm text-theme-secondary truncate mb-2">
                                {preview}
                            </p>
                        )}

                        {/* Meta info */}
                        <div className="flex items-center gap-3 text-xs text-theme-muted">
                            <span className="flex items-center gap-1">
                                <ClockIcon className="w-3.5 h-3.5" />
                                {formatRelativeTime(page.lastEditedAt)}
                            </span>
                            {page.wordCount && (
                                <span>{page.wordCount} מילים</span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PageListView;
