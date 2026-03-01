import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PersonalItem, Space } from '../../types';
import {
    BookOpenIcon,
    PlusIcon,
    SparklesIcon,
    ChevronRightIcon,
    LightbulbIcon,
    FlameIcon,
    SearchIcon,
} from '../icons';
import { PremiumEmptyState } from '../common/PremiumEmptyState';

// Spaced Repetition Algorithm (SM-2 Simplified)
// Returns days until next review based on confidence
const getNextReviewDays = (confidence: number, reviewCount: number): number => {
    const base = Math.pow(2, reviewCount);
    const confidenceFactor = confidence / 100;
    return Math.round(base * confidenceFactor);
};

interface NotebookCardProps {
    item: PersonalItem;
    onFlip: (id: string) => void;
    isFlipped: boolean;
    onReview: (id: string, confidence: number) => void;
    onSelect: (item: PersonalItem) => void;
    index: number;
}

const NotebookCard: React.FC<NotebookCardProps> = ({
    item,
    onFlip,
    isFlipped,
    onReview,
    onSelect,
    index,
}) => {
    const isDueForReview = useMemo(() => {
        const meta = item.metadata as { nextReviewDate?: string } | undefined;
        if (!meta?.nextReviewDate) return true;
        return new Date(meta.nextReviewDate) <= new Date();
    }, [item.metadata]);

    return (
        <motion.div
            className="relative w-full aspect-[3/2]"
            style={{ perspective: '1000px' }}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
        >
            <motion.div
                className="relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                onClick={() => onFlip(item.id)}
            >
                {/* Front Side - Question */}
                <div
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col backface-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {isDueForReview && (
                        <motion.div
                            className="absolute top-3 left-3 w-3 h-3 rounded-full bg-amber-400"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            title="לחזרה היום"
                        />
                    )}

                    <div className="flex items-start justify-between mb-3">
                        <span className="text-xs text-theme-secondary uppercase tracking-wide">
                            {item.spaceId ? '📚' : '📝'} {item.tags?.[0] || 'ללא נושא'}
                        </span>
                        <LightbulbIcon className="w-5 h-5 text-indigo-400" />
                    </div>

                    <h3 className="text-lg font-bold text-white flex-1 line-clamp-3 font-heading">
                        {item.title || 'ללא כותרת'}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                        <span className="text-xs text-theme-muted">לחץ להפיכה</span>
                        <ChevronRightIcon className="w-4 h-4 text-theme-muted" />
                    </div>
                </div>

                {/* Back Side - Answer */}
                <div
                    className="absolute inset-0 rounded-2xl p-5 flex flex-col backface-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-xs text-emerald-400 uppercase tracking-wide">תשובה</span>
                        <SparklesIcon className="w-5 h-5 text-emerald-400" />
                    </div>

                    <p className="text-sm text-theme-primary flex-1 line-clamp-4 leading-relaxed">
                        {item.content || 'אין תשובה'}
                    </p>

                    {/* Confidence Rating */}
                    <div className="mt-auto pt-3 border-t border-white/10">
                        <p className="text-xs text-theme-secondary mb-2 text-center">כמה טוב זכרת?</p>
                        <div className="flex gap-2 justify-center">
                            {[
                                { value: 20, label: '😓', color: 'bg-red-500/20 border-red-500/40' },
                                { value: 50, label: '🤔', color: 'bg-amber-500/20 border-amber-500/40' },
                                { value: 80, label: '😊', color: 'bg-emerald-500/20 border-emerald-500/40' },
                                { value: 100, label: '🔥', color: 'bg-cyan-500/20 border-cyan-500/40' },
                            ].map(({ value, label, color }) => (
                                <motion.button
                                    key={value}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReview(item.id, value);
                                    }}
                                    className={`px-3 py-2 rounded-xl text-lg border ${color}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* View Full Button */}
            <motion.button
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 text-xs font-medium rounded-lg z-10"
                style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }}
                whileTap={{ scale: 0.95 }}
            >
                צפייה מלאה
            </motion.button>
        </motion.div>
    );
};

interface SubjectCardProps {
    subject: string;
    items: PersonalItem[];
    dueCount: number;
    onOpen: () => void;
    index: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, items, dueCount, onOpen, index }) => {
    return (
        <motion.button
            onClick={onOpen}
            className="relative p-4 rounded-2xl text-right w-full group"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(var(--dynamic-accent-rgb), 0.3)' }}
            whileTap={{ scale: 0.98 }}
        >
            {dueCount > 0 && (
                <motion.div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {dueCount} לחזרה
                </motion.div>
            )}

            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(var(--dynamic-accent-rgb), 0.15)' }}
                >
                    <BookOpenIcon className="w-5 h-5" style={{ color: 'var(--dynamic-accent-start)' }} />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white font-heading">{subject}</h3>
                    <p className="text-xs text-theme-secondary">{items.length} רעיונות</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-theme-muted group-hover:text-white transition-colors" />
            </div>
        </motion.button>
    );
};

interface NotebookViewProps {
    items: PersonalItem[];
    spaces: Space[];
    onUpdate: (id: string, updates: Partial<PersonalItem>) => Promise<void>;
    onSelectItem: (item: PersonalItem, event?: React.MouseEvent) => void;
    onQuickAdd: (type: string, defaults?: Partial<PersonalItem>) => void;
}

const NotebookView: React.FC<NotebookViewProps> = ({
    items,
    spaces,
    onUpdate,
    onSelectItem,
    onQuickAdd,
}) => {
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isReviewMode, setIsReviewMode] = useState(false);

    // Filter learning items
    const learningItems = useMemo(() => {
        return items.filter((item) => item.type === 'learning' || item.tags?.includes('לימוד'));
    }, [items]);

    // Group by subject (spaceId or first tag)
    const { subjects, dueItems } = useMemo(() => {
        const grouped: Record<string, PersonalItem[]> = {};
        const due: PersonalItem[] = [];

        learningItems.forEach((item) => {
            const subject = item.spaceId
                ? spaces.find((s) => s.id === item.spaceId)?.name || 'כללי'
                : item.tags?.[0] || 'כללי';

            if (!grouped[subject]) grouped[subject] = [];
            grouped[subject].push(item);

            // Check if due for review
            const meta = item.metadata as { nextReviewDate?: string } | undefined;
            if (!meta?.nextReviewDate || new Date(meta.nextReviewDate) <= new Date()) {
                due.push(item);
            }
        });

        return { subjects: grouped, dueItems: due };
    }, [learningItems, spaces]);

    // Filter displayed items
    const displayedItems = useMemo(() => {
        let result = learningItems;

        if (isReviewMode) {
            result = dueItems;
        } else if (activeSubject) {
            result = subjects[activeSubject] || [];
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (item) =>
                    item.title?.toLowerCase().includes(q) ||
                    item.content?.toLowerCase().includes(q)
            );
        }

        return result;
    }, [learningItems, dueItems, subjects, activeSubject, isReviewMode, searchQuery]);

    const handleFlip = useCallback((id: string) => {
        setFlippedCards((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const handleReview = useCallback(
        async (id: string, confidence: number) => {
            const item = learningItems.find((i) => i.id === id);
            if (!item) return;

            const meta = (item.metadata as { reviewCount?: number } | undefined) || {};
            const reviewCount = (meta.reviewCount || 0) + 1;
            const nextDays = getNextReviewDays(confidence, reviewCount);
            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + nextDays);

            await onUpdate(id, {
                metadata: {
                    ...item.metadata,
                    // Force cast as we know this is a learning item and we are adding learning metadata
                    reviewCount,
                    lastReviewConfidence: confidence,
                    nextReviewDate: nextReviewDate.toISOString(),
                    lastReviewedAt: new Date().toISOString(),
                } as any, // TS cannot infer union overlap correctly here
            });

            // Flip back after review
            setFlippedCards((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        },
        [learningItems, onUpdate]
    );

    if (learningItems.length === 0) {
        return (
            <PremiumEmptyState
                icon={<BookOpenIcon className="w-12 h-12" style={{ color: 'var(--dynamic-accent-start)' }} />}
                title="המחברת ריקה"
                description="התחל לאסוף ידע! הוסף רעיונות, תובנות ומידע שאתה רוצה לזכור."
                actionLabel="הוסף רעיון חדש"
                onAction={() => onQuickAdd('learning')}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Review Button */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2
                        className="text-sm font-bold uppercase tracking-widest mb-1 px-1"
                        style={{ color: 'var(--dynamic-accent-start)' }}
                    >
                        המחברת שלי
                    </h2>
                    <p className="text-xs text-theme-secondary px-1">
                        {learningItems.length} רעיונות • {dueItems.length} לחזרה היום
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="חיפוש..."
                            className="pl-3 pr-9 py-2 text-sm rounded-xl bg-white/5 border border-white/10 focus:border-[var(--dynamic-accent-start)] focus:outline-none transition-colors w-40"
                        />
                    </div>

                    {/* Review Mode Toggle */}
                    {dueItems.length > 0 && (
                        <motion.button
                            onClick={() => {
                                setIsReviewMode(!isReviewMode);
                                setActiveSubject(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${isReviewMode
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-white/5 text-theme-primary border border-white/10'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FlameIcon className="w-4 h-4" />
                            <span>מצב חזרה</span>
                            {dueItems.length > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 text-xs">
                                    {dueItems.length}
                                </span>
                            )}
                        </motion.button>
                    )}

                    {/* Add New */}
                    <motion.button
                        onClick={() => onQuickAdd('learning')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm"
                        style={{
                            background: 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                            boxShadow: '0 4px 16px var(--dynamic-accent-glow)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>רעיון חדש</span>
                    </motion.button>
                </div>
            </header>

            {/* Subjects Bar (when not in review mode) */}
            {!isReviewMode && Object.keys(subjects).length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    <motion.button
                        onClick={() => setActiveSubject(null)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${!activeSubject
                            ? 'bg-[var(--dynamic-accent-start)]/20 text-[var(--dynamic-accent-start)] border border-[var(--dynamic-accent-start)]/40'
                            : 'bg-white/5 text-theme-secondary border border-white/10'
                            }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        הכל ({learningItems.length})
                    </motion.button>
                    {Object.entries(subjects).map(([subject, items]) => (
                        <motion.button
                            key={subject}
                            onClick={() => setActiveSubject(subject)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSubject === subject
                                ? 'bg-[var(--dynamic-accent-start)]/20 text-[var(--dynamic-accent-start)] border border-[var(--dynamic-accent-start)]/40'
                                : 'bg-white/5 text-theme-secondary border border-white/10'
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            {subject} ({items.length})
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <AnimatePresence mode="wait">
                {isReviewMode ? (
                    <motion.div
                        key="review"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {displayedItems.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4"
                                >
                                    <span className="text-3xl">🎉</span>
                                </motion.div>
                                <h3 className="text-lg font-bold text-white mb-2">כל הכבוד!</h3>
                                <p className="text-theme-secondary text-sm">סיימת את כל החזרות להיום</p>
                            </div>
                        ) : (
                            displayedItems.map((item, index) => (
                                <NotebookCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    isFlipped={flippedCards.has(item.id)}
                                    onFlip={handleFlip}
                                    onReview={handleReview}
                                    onSelect={onSelectItem}
                                />
                            ))
                        )}
                    </motion.div>
                ) : !activeSubject ? (
                    <motion.div
                        key="subjects"
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {Object.entries(subjects).map(([subject, items], index) => {
                            const dueCount = items.filter((item) => {
                                const meta = item.metadata as { nextReviewDate?: string } | undefined;
                                return !meta?.nextReviewDate || new Date(meta.nextReviewDate) <= new Date();
                            }).length;

                            return (
                                <SubjectCard
                                    key={subject}
                                    subject={subject}
                                    items={items}
                                    dueCount={dueCount}
                                    onOpen={() => setActiveSubject(subject)}
                                    index={index}
                                />
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="cards"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Back Button */}
                        <motion.button
                            onClick={() => setActiveSubject(null)}
                            className="col-span-full flex items-center gap-2 text-sm text-theme-secondary hover:text-white transition-colors mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <ChevronRightIcon className="w-4 h-4 rotate-180" />
                            חזרה לנושאים
                        </motion.button>

                        {displayedItems.map((item, index) => (
                            <NotebookCard
                                key={item.id}
                                item={item}
                                index={index}
                                isFlipped={flippedCards.has(item.id)}
                                onFlip={handleFlip}
                                onReview={handleReview}
                                onSelect={onSelectItem}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(NotebookView);
