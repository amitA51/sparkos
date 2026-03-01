/**
 * NotebookCard
 * Premium card component for displaying a single notebook
 * Features glassmorphism, gradient accents, and CSS transitions
 */

import { useNotebook } from '../../src/contexts/NotebookContext';
import { PinIcon, MoreHorizontalIcon, FolderOpenIcon } from '../icons';
import type { Notebook } from '../../types';

interface NotebookCardProps {
    notebook: Notebook;
    index: number;
    onOpen: () => void;
    onOptionsClick?: (e: React.MouseEvent) => void;
}

const NotebookCard: React.FC<NotebookCardProps> = ({
    notebook,
    index,
    onOpen,
    onOptionsClick,
}) => {
    const { updateNotebook } = useNotebook();

    const handlePin = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await updateNotebook(notebook.id, { isPinned: !notebook.isPinned });
    };

    // Calculate section count from sectionIds
    const sectionCount = notebook.sectionIds?.length || 0;

    return (
        <div
            onClick={onOpen}
            className="relative group cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            {/* Main card container */}
            <div
                className="relative overflow-hidden rounded-2xl p-4 h-[140px] flex flex-col justify-between"
                style={{
                    background: `linear-gradient(135deg, ${notebook.color}15 0%, ${notebook.color}08 100%)`,
                    border: `1px solid ${notebook.color}30`,
                    boxShadow: `0 8px 32px ${notebook.color}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
            >
                {/* Glass overlay */}
                <div
                    className="absolute inset-0 backdrop-blur-sm opacity-50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                    }}
                />

                {/* Cover image (if present) */}
                {notebook.coverImageUrl && (
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url(${notebook.coverImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                )}

                {/* Top row: Icon + Actions */}
                <div className="relative z-10 flex items-start justify-between">
                    {/* Notebook icon */}
                    <div className="text-3xl filter drop-shadow-lg transition-transform duration-200 hover:scale-115">
                        {notebook.icon || '📚'}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Pin button */}
                        <button
                            onClick={handlePin}
                            className={`p-1.5 rounded-lg transition-all duration-150 hover:scale-110 active:scale-90 ${notebook.isPinned
                                ? 'bg-accent-cyan/20 text-accent-cyan'
                                : 'bg-white/5 text-theme-secondary hover:text-white hover:bg-white/10'
                                }`}
                            aria-label={notebook.isPinned ? 'בטל נעיצה' : 'נעץ'}
                        >
                            <PinIcon className="w-4 h-4" />
                        </button>

                        {/* Options button */}
                        {onOptionsClick && (
                            <button
                                onClick={onOptionsClick}
                                className="p-1.5 rounded-lg bg-white/5 text-theme-secondary hover:text-white hover:bg-white/10 transition-all duration-150 hover:scale-110 active:scale-90"
                                aria-label="אפשרויות"
                            >
                                <MoreHorizontalIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom: Title + Meta */}
                <div className="relative z-10 space-y-1">
                    <h3 className="font-semibold text-white text-base leading-tight truncate">
                        {notebook.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-theme-secondary">
                        <span className="flex items-center gap-1">
                            <FolderOpenIcon className="w-3.5 h-3.5" />
                            {sectionCount} {sectionCount === 1 ? 'סעיף' : 'סעיפים'}
                        </span>
                        {notebook.isPinned && (
                            <span className="flex items-center gap-1 text-accent-cyan">
                                <PinIcon className="w-3 h-3" />
                                נעוץ
                            </span>
                        )}
                    </div>
                </div>

                {/* Accent gradient line at bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
                    style={{
                        background: `linear-gradient(90deg, ${notebook.color}, transparent)`,
                    }}
                />

                {/* Hover glow effect */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        boxShadow: `0 0 40px ${notebook.color}30, inset 0 0 20px ${notebook.color}10`,
                    }}
                />
            </div>
        </div>
    );
};

export default NotebookCard;
