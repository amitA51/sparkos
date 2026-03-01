import React, { useState, useEffect } from 'react';
import { CloseIcon, SparklesIcon } from './icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ContentModalProps {
    /** Modal title */
    title: string;
    /** Icon to display next to title */
    icon?: React.ReactNode;
    /** Content to render (markdown) */
    content: string | null;
    /** Close handler */
    onClose: () => void;
    /** Loading state */
    isLoading: boolean;
    /** Optional loading messages to cycle through */
    loadingMessages?: string[];
}

/**
 * Unified Content Modal
 * 
 * Replaces DailyBriefingModal and SynthesisModal with a single, 
 * configurable component.
 */
const ContentModal: React.FC<ContentModalProps> = ({
    title,
    icon = <SparklesIcon className="w-6 h-6 text-[var(--accent-highlight)]" />,
    content,
    onClose,
    isLoading,
    loadingMessages = ['טוען...'],
}) => {
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let interval: number | undefined;
        if (isLoading && loadingMessages.length > 1) {
            let i = 0;
            setCurrentLoadingMessage(loadingMessages[0]);
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setCurrentLoadingMessage(loadingMessages[i]);
            }, 2500);
        }
        return () => {
            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, [isLoading, loadingMessages]);

    if (!content && !isLoading) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            style={{ pointerEvents: 'auto' }}
        >
            <div
                className="bg-[var(--bg-secondary)] w-full max-w-2xl max-h-[80vh] responsive-modal rounded-t-3xl shadow-lg flex flex-col border-t border-[var(--border-primary)] animate-modal-enter"
                onClick={e => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}
            >
                <header className="p-4 border-b border-[var(--border-primary)] flex justify-between items-center sticky top-0 bg-[var(--bg-secondary)]/80 backdrop-blur-sm z-10 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        {icon}
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-white transition-colors p-1 rounded-full active:scale-95"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-full text-center text-[var(--text-secondary)]">
                            <div className="w-2 h-2 bg-[var(--dynamic-accent-start)] rounded-full animate-pulse mb-4"></div>
                            <p className="transition-opacity duration-500">{currentLoadingMessage}</p>
                        </div>
                    ) : (
                        <MarkdownRenderer content={content || ''} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentModal;
