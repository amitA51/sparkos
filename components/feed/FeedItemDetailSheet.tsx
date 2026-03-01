import { useSettings } from '../../src/contexts/SettingsContext';

import React, { useMemo, useCallback } from 'react';
import type { FeedItem } from '../../types';
import { ModalOverlay } from '../ui/ModalOverlay';
import { stripHtmlAndDecodeEntities } from '../../utils/textUtils';
import { useHaptics } from '../../hooks/useHaptics';
import { ExternalLinkIcon, ClockIcon, StarIcon, SummarizeIcon } from '../icons';
import { calculateReadingTime, extractDomain } from '../../utils/feedUtils';

interface FeedItemDetailSheetProps {
    item: FeedItem | null;
    onClose: () => void;
    onSummarize?: (item: FeedItem) => void;
    onUpdate?: (id: string, updates: Partial<FeedItem>) => void;
    isSummarizing?: boolean;
}

/**
 * Determines if the item is a "news" type that should show a link button
 */
const isNewsItem = (item: FeedItem): boolean => {
    return (item.type === 'rss' || item.type === 'news') && !!item.link;
};

// Using shared utility functions from feedUtils.ts

const FeedItemDetailSheet: React.FC<FeedItemDetailSheetProps> = ({
    item,
    onClose,
    onSummarize,
    onUpdate,
    isSummarizing = false,
}) => {
    const { triggerHaptic } = useHaptics();
    const { settings } = useSettings();
    const isObsidian = settings.themeSettings.name === 'Obsidian Air';

    // Clean content - strip HTML and decode entities
    const cleanContent = useMemo(() => {
        if (!item) return '';
        const rawContent = item.summary_ai || item.content || '';
        return stripHtmlAndDecodeEntities(rawContent);
    }, [item]);

    // Reading time calculation
    const readingTime = useMemo(() => {
        return item ? calculateReadingTime(cleanContent) : 0;
    }, [item, cleanContent]);

    // Source domain
    const sourceDomain = useMemo(() => {
        return item?.link ? extractDomain(item.link) : null;
    }, [item?.link]);

    // Handle opening external link (PWA-friendly)
    const handleOpenLink = useCallback(() => {
        if (!item?.link) return;
        triggerHaptic('light');
        window.open(item.link, '_blank', 'noopener,noreferrer');
    }, [item?.link, triggerHaptic]);

    // Handle toggle important
    const handleToggleImportant = useCallback(() => {
        if (!item || !onUpdate) return;
        triggerHaptic('medium');
        onUpdate(item.id, { isImportant: !item.isImportant });
    }, [item, onUpdate, triggerHaptic]);

    // Handle summarize
    const handleSummarize = useCallback(() => {
        if (!item || !onSummarize) return;
        triggerHaptic('medium');
        onSummarize(item);
    }, [item, onSummarize, triggerHaptic]);

    // Check if this is a news item (should show link button)
    const showLinkButton = item ? isNewsItem(item) : false;

    if (!item) return null;

    return (
        <ModalOverlay
            isOpen={!!item}
            onClose={onClose}
            variant="bottomSheet"
            blur={isObsidian ? "none" : "md"} // Obsidian has its own glass blur
            backdropOpacity={isObsidian ? 50 : 60}
            zLevel="default"
        >
            {/* Nebula/Obsidian Holographic Glass Container */}
            <div className={`${isObsidian ? 'glass-obsidian' : 'glass-nebula-heavy'} rounded-t-3xl max-h-[85vh] flex flex-col border-t border-white/[0.08]`}>
                {/* Drag Handle */}
                {/* Drag Handle - Visual indicator for draggable behavior */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header */}
                <header className="px-5 pb-4 border-b border-white/[0.06]">
                    {/* Meta info row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>{readingTime} דק׳ קריאה</span>
                            {sourceDomain && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span>{sourceDomain}</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleToggleImportant}
                            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 ${item.isImportant
                                ? 'text-amber-400 bg-amber-400/10'
                                : 'text-white/30 hover:text-amber-400 hover:bg-amber-400/5'
                                }`}
                            aria-label={item.isImportant ? 'הסר חשיבות' : 'סמן כחשוב'}
                        >
                            <StarIcon filled={!!item.isImportant} className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white leading-tight">
                        {item.title}
                    </h2>
                </header>

                {/* Content - Scrollable with contained overscroll */}
                <div
                    className="flex-1 px-5 py-5 overflow-y-auto overscroll-contain"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        maxHeight: 'calc(85vh - 200px)'
                    }}
                >
                    <p
                        className="text-white/80 whitespace-pre-wrap"
                        style={{
                            lineHeight: 1.6,
                            fontSize: '16px',
                        }}
                    >
                        {cleanContent}
                    </p>

                    {/* AI Summary button if not summarized yet */}
                    {!item.summary_ai && onSummarize && (
                        <button
                            onClick={handleSummarize}
                            disabled={isSummarizing}
                            className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-sm text-white/70 hover:text-white/90 transition-all disabled:opacity-50"
                        >
                            <SummarizeIcon className="w-4 h-4" />
                            {isSummarizing ? 'מסכם...' : 'סכם עם AI'}
                        </button>
                    )}
                </div>

                {/* Footer - Aurora/Titanium Button */}
                {showLinkButton && (
                    <footer className={`p-4 border-t border-white/[0.06] safe-area-inset-bottom ${isObsidian ? 'glass-obsidian' : 'glass-nebula'}`}>
                        <button
                            onClick={handleOpenLink}
                            className={`
                                w-full flex items-center justify-center gap-3 
                                py-4 px-6 rounded-2xl
                                ${isObsidian ? 'btn-titanium' : 'btn-aurora'}
                                text-[15px]
                                active:scale-[0.98]
                            `}
                        >
                            <ExternalLinkIcon className={`w-5 h-5 ${isObsidian ? 'text-black' : ''}`} />
                            <span>קרא את הכתבה המלאה</span>
                            <span className={isObsidian ? "opacity-40 text-black" : "opacity-60"}>↗</span>
                        </button>
                    </footer>
                )}
            </div>
        </ModalOverlay >
    );
};

export default React.memo(FeedItemDetailSheet);
