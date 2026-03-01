/**
 * LibraryDashboardView - Extracted from LibraryScreen.tsx
 * 
 * Displays the main dashboard with:
 * - Inbox section (items waiting to be organized)
 * - Spaces section with drag & drop reordering
 * - Roadmaps/Projects section with progress bars
 * - All items by category accordion
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { PersonalItem, Space, AddableType } from '../../types';
import { InboxIcon, PlusIcon } from '../icons';
import PersonalItemCard from '../PersonalItemCard';
import CategoryAccordion from '../CategoryAccordion';
import {
    PremiumSpaceCard,
    PremiumLibraryEmptyState,
    SpaceFilterBar,
} from './index';

interface SpaceData {
    id: string;
    name: string;
    icon: string;
    color: string;
    itemCount: number;
    description?: string;
}

interface LibraryDashboardViewProps {
    // Data
    inboxItems: PersonalItem[];
    projectItems: PersonalItem[];
    personalItems: PersonalItem[];
    filteredSpaces: Space[];
    availableTags: string[];
    isLoading: boolean;

    // Space filtering
    spaceSearchQuery: string;
    onSpaceSearchChange: (query: string) => void;
    spaceSortBy: 'order' | 'name' | 'itemCount' | 'updated';
    onSpaceSortChange: (sort: 'order' | 'name' | 'itemCount' | 'updated') => void;
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
    spaceViewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;

    // Space drag & drop
    draggingSpaceId: string | null;
    onSpaceDragStart: (space: Space) => void;
    onSpaceDragOver: (space: Space) => void;
    onSpaceDrop: () => void;

    // Handlers
    onOpenInbox: () => void;
    onOpenSpace: (space: Space) => void;
    onOpenAddSpaceModal: () => void;
    onQuickAdd: (type: AddableType, defaults?: Partial<PersonalItem>) => void;
    onSelectItem: (item: PersonalItem, event?: React.MouseEvent | React.KeyboardEvent) => void;
    onUpdateItem: (id: string, updates: Partial<PersonalItem>) => void;
    onDeleteItem: (id: string) => void;
    onContextMenu: (event: React.MouseEvent, item: PersonalItem) => void;
    onTogglePinSpace: (space: Space, e: React.MouseEvent) => void;

    // Helpers
    getSpaceData: (space: Space) => SpaceData;
    getProjectProgress: (project: PersonalItem) => {
        completedTasks: number;
        totalTasks: number;
        progress: number;
    };
}

const LibraryDashboardView: React.FC<LibraryDashboardViewProps> = ({
    inboxItems,
    projectItems,
    personalItems,
    filteredSpaces,
    availableTags,
    isLoading,
    spaceSearchQuery,
    onSpaceSearchChange,
    spaceSortBy,
    onSpaceSortChange,
    selectedTag,
    onTagSelect,
    spaceViewMode,
    onViewModeChange,
    draggingSpaceId,
    onSpaceDragStart,
    onSpaceDragOver,
    onSpaceDrop,
    onOpenInbox,
    onOpenSpace,
    onOpenAddSpaceModal,
    onQuickAdd,
    onSelectItem,
    onUpdateItem,
    onDeleteItem,
    onContextMenu,
    onTogglePinSpace,
    getSpaceData,
    getProjectProgress,
}) => {
    const shouldShowProjectsEmpty = !isLoading && projectItems.length === 0;

    return (
        <motion.div
            key="dashboard"
            className="space-y-8 sm:space-y-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Inbox Section */}
            {inboxItems.length > 0 ? (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.button
                        onClick={onOpenInbox}
                        className="w-full relative rounded-radius-card overflow-hidden p-padding-card flex justify-between items-center group"
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                        }}
                        whileHover={{ scale: 1.02, y: -3 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-3 sm:gap-4">
                            <motion.div
                                className="p-2.5 sm:p-3 rounded-radius-button"
                                style={{
                                    background: 'rgba(16, 185, 129, 0.3)',
                                    boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)',
                                }}
                                animate={{
                                    boxShadow: [
                                        '0 0 0px rgba(16, 185, 129, 0)',
                                        '0 0 20px rgba(16, 185, 129, 0.3)',
                                        '0 0 0px rgba(16, 185, 129, 0)',
                                    ],
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                            >
                                <InboxIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-300" />
                            </motion.div>
                            <div className="text-right">
                                <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                                    תיבת דואר נכנס
                                </h2>
                                <p className="text-xs sm:text-sm text-theme-secondary">
                                    פריטים שממתינים לארגון
                                </p>
                            </div>
                        </div>
                        <motion.span
                            className="text-xl sm:text-2xl font-bold font-mono px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
                            style={{
                                background: 'rgba(16, 185, 129, 0.25)',
                                color: '#10B981',
                            }}
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {inboxItems.length}
                        </motion.span>

                        <motion.div
                            className="absolute inset-0 rounded-radius-card pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
                            }}
                            animate={{
                                opacity: [0, 0.6, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.button>
                </motion.section>
            ) : (
                <PremiumLibraryEmptyState
                    type="inbox"
                    onAction={() => onQuickAdd('task')}
                    actionLabel="הוסף פריט חדש"
                />
            )}

            {/* Spaces Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <h2
                    className="text-[13px] font-semibold tracking-wide mb-4 px-1"
                    style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                >
                    מרחבים
                </h2>

                <SpaceFilterBar
                    searchQuery={spaceSearchQuery}
                    onSearchChange={onSpaceSearchChange}
                    sortBy={spaceSortBy}
                    onSortChange={onSpaceSortChange}
                    selectedTag={selectedTag}
                    onTagSelect={onTagSelect}
                    availableTags={availableTags}
                    viewMode={spaceViewMode}
                    onViewChange={onViewModeChange}
                />

                <div className={`grid gap-4 sm:gap-6 ${spaceViewMode === 'grid' ? 'grid-cols-1 xs:grid-cols-2' : 'grid-cols-1'}`}>
                    {filteredSpaces.map((space, index) => (
                        <PremiumSpaceCard
                            key={space.id}
                            space={getSpaceData(space)}
                            onOpen={() => onOpenSpace(space)}
                            index={index}
                            isDragging={draggingSpaceId === space.id}
                            onDragStart={() => onSpaceDragStart(space)}
                            onDragOver={() => onSpaceDragOver(space)}
                            onDrop={onSpaceDrop}
                            viewMode={spaceViewMode}
                            onTogglePin={(e) => onTogglePinSpace(space, e)}
                        />
                    ))}

                    {/* Add Space Card */}
                    <motion.button
                        onClick={onOpenAddSpaceModal}
                        className="group relative rounded-radius-card p-padding-card flex flex-col items-center justify-center gap-gap-base min-h-[100px] transition-all"
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                        whileHover={{
                            scale: 1.02,
                            borderColor: 'rgba(var(--dynamic-accent-rgb), 0.3)',
                            background: 'rgba(255,255,255,0.04)',
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            className="w-10 h-10 rounded-radius-button flex items-center justify-center"
                            style={{
                                background: 'rgba(var(--dynamic-accent-rgb), 0.15)',
                            }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <PlusIcon className="w-5 h-5" style={{ color: 'var(--dynamic-accent-start)' }} />
                        </motion.div>
                        <span className="text-sm font-medium text-theme-secondary group-hover:text-white transition-colors">
                            הוסף מרחב
                        </span>
                    </motion.button>
                </div>
            </motion.section>

            {/* Roadmaps/Projects Section */}
            {projectItems.length > 0 ? (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2
                        className="text-[13px] font-semibold tracking-wide mb-4 px-1"
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                        מפות דרכים
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {projectItems.map((roadmap, index) => {
                            const progress = getProjectProgress(roadmap);
                            return (
                                <motion.div
                                    key={roadmap.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    className="relative"
                                >
                                    <PersonalItemCard
                                        item={roadmap}
                                        index={index}
                                        onSelect={onSelectItem}
                                        onUpdate={onUpdateItem}
                                        onDelete={onDeleteItem}
                                        onContextMenu={onContextMenu}
                                        onLongPress={() => { }}
                                        isInSelectionMode={false}
                                        isSelected={false}
                                    />
                                    {/* Project Progress Bar */}
                                    {progress.totalTasks > 0 && (
                                        <div className="mt-2 px-3">
                                            <div className="flex items-center justify-between text-xs text-theme-secondary mb-1">
                                                <span>{progress.completedTasks} / {progress.totalTasks} משימות</span>
                                                <span className="font-mono font-bold" style={{ color: 'var(--dynamic-accent-start)' }}>
                                                    {progress.progress}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: 'linear-gradient(90deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                                                        boxShadow: '0 0 10px var(--dynamic-accent-glow)'
                                                    }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress.progress}%` }}
                                                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + index * 0.05 }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>
            ) : (
                shouldShowProjectsEmpty && (
                    <PremiumLibraryEmptyState
                        type="projects"
                        onAction={() => onQuickAdd('roadmap')}
                        actionLabel="צור מפת דרכים חדשה"
                    />
                )
            )}

            {/* All Items by Category */}
            {personalItems.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2
                        className="text-[13px] font-semibold tracking-wide mb-4 px-1"
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                        כל הפריטים לפי קטגוריה
                    </h2>
                    <CategoryAccordion
                        items={personalItems}
                        onSelectItem={onSelectItem}
                        onUpdateItem={onUpdateItem}
                        onDeleteItem={onDeleteItem}
                        onContextMenu={onContextMenu}
                        groupBy="type"
                    />
                </motion.section>
            )}
        </motion.div>
    );
};

export default React.memo(LibraryDashboardView);
