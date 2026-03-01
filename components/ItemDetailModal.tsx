import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import type { FeedItem } from '../types';
import { SummarizeIcon, CloseIcon, LinkIcon, StarIcon, getFileIcon, TrashIcon, ClockIcon } from './icons';
import { findRelatedItems } from '../services/ai';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useData } from '../src/contexts/DataContext';
import { useSettings } from '../src/contexts/SettingsContext';
import { useHaptics } from '../hooks/useHaptics';

// SECURITY: DOMPurify configuration for safe HTML rendering
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'span', 'h1', 'h2', 'h3', 'blockquote'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
};

// Font size presets for mobile reading
const FONT_SIZES = [14, 16, 18, 20, 22] as const;
const DEFAULT_FONT_SIZE_INDEX = 1; // 16px default

interface ItemDetailModalProps {
  item: FeedItem | null;
  onSelectItem: (item: FeedItem) => void;
  onClose: () => void;
  onSummarize: (item: FeedItem) => void;
  onUpdate: (id: string, updates: Partial<FeedItem>) => void;
  onDelete: (id: string) => void;
  isSummarizing: boolean;
}

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  if (!content) return 1;
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Extract domain from URL
const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'מקור';
  }
};

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onSelectItem,
  onClose,
  onSummarize,
  onUpdate,
  onDelete,
  isSummarizing,
}) => {
  const { feedItems } = useData();
  const { settings } = useSettings();
  const { triggerHaptic } = useHaptics();
  const [relatedItems, setRelatedItems] = useState<FeedItem[]>([]);
  const [fontSizeIndex, setFontSizeIndex] = useState(DEFAULT_FONT_SIZE_INDEX);

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Store scroll position when modal opens to restore it when closing
  const scrollPositionRef = useRef<number>(0);

  // Reading time calculation
  const readingTime = useMemo(() =>
    item ? calculateReadingTime(item.summary_ai || item.content) : 0
    , [item]);

  // Source domain
  const sourceDomain = useMemo(() =>
    item?.link ? extractDomain(item.link) : null
    , [item?.link]);

  useEffect(() => {
    if (item) {
      // Save current scroll position when modal opens
      scrollPositionRef.current = window.scrollY;
      // Reset content scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [item]);

  // Handle closing with scroll position restoration
  const handleClose = useCallback(() => {
    triggerHaptic('light');
    const savedPosition = scrollPositionRef.current;
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedPosition, behavior: 'instant' });
    });
    onClose();
  }, [onClose, triggerHaptic]);

  // Font size controls
  const increaseFontSize = useCallback(() => {
    triggerHaptic('light');
    setFontSizeIndex(prev => Math.min(prev + 1, FONT_SIZES.length - 1));
  }, [triggerHaptic]);

  const decreaseFontSize = useCallback(() => {
    triggerHaptic('light');
    setFontSizeIndex(prev => Math.max(prev - 1, 0));
  }, [triggerHaptic]);

  useFocusTrap(modalRef as React.RefObject<HTMLElement>, {
    isOpen: !!item,
    onClose: handleClose,
    closeOnEscape: true,
    closeOnClickOutside: true,
    restoreFocus: false,
  });

  useEffect(() => {
    if (item) {
      const fetchRelated = async () => {
        setRelatedItems([]);
        try {
          const recentItems = feedItems
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 100);
          const related = await findRelatedItems(item, recentItems);
          setRelatedItems(related);
        } catch (error) {
          console.error('Failed to find related items:', error);
        }
      };
      fetchRelated();
    }
  }, [item, feedItems]);

  const handleToggleImportant = useCallback(() => {
    if (item) {
      triggerHaptic('medium');
      onUpdate(item.id, { isImportant: !item.isImportant });
    }
  }, [item, onUpdate, triggerHaptic]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`האם למחוק את "${item?.title}"?`)) {
      triggerHaptic('heavy');
      onDelete(item!.id);
    }
  }, [item, onDelete, triggerHaptic]);

  if (!item) return null;

  const modalBgClass =
    settings.themeSettings.cardStyle === 'glass' ? 'glass-modal-bg' : 'bg-[var(--bg-secondary)]';

  const currentFontSize = FONT_SIZES[fontSizeIndex];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 transition-all duration-300"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`${modalBgClass} w-full sm:max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[85vh] rounded-none sm:rounded-[2rem] shadow-2xl flex flex-col border-0 sm:border border-white/10`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-detail-title"
        style={{ viewTransitionName: `feed-item-${item.id}` }}
      >
        {/* Header - Mobile Optimized */}
        <header className="px-4 py-3 sm:p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-10 safe-area-inset-top">
          {/* Close Button - Large Touch Target */}
          <button
            onClick={handleClose}
            className="w-12 h-12 -mr-2 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full active:bg-white/10"
            aria-label="סגור"
          >
            <CloseIcon className="h-7 w-7" />
          </button>

          {/* Reading Info */}
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <ClockIcon className="w-4 h-4" />
            <span>{readingTime} דק׳ קריאה</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleImportant}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors active:scale-95 ${item.isImportant ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/40 hover:text-yellow-400'}`}
              aria-label={item.isImportant ? 'הסר חשיבות' : 'סמן כחשוב'}
            >
              <StarIcon filled={!!item.isImportant} className="h-6 w-6" />
            </button>
            <button
              onClick={handleDelete}
              className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors rounded-full active:bg-red-400/10"
              aria-label="מחק פריט"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Title Section */}
        <div className="px-5 pt-5 pb-3 border-b border-white/5">
          <h2
            id="item-detail-title"
            className="text-xl sm:text-2xl font-bold text-white leading-tight"
          >
            {item.title}
          </h2>
          {sourceDomain && (
            <p className="text-sm text-white/40 mt-2">{sourceDomain}</p>
          )}
        </div>

        {/* Font Size Controls - Floating */}
        <div className="absolute left-4 top-[140px] sm:top-[160px] z-20 flex flex-col gap-1 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10">
          <button
            onClick={increaseFontSize}
            disabled={fontSizeIndex >= FONT_SIZES.length - 1}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-full active:bg-white/10 text-lg font-bold"
            aria-label="הגדל טקסט"
          >
            א+
          </button>
          <div className="h-px bg-white/10 mx-2" />
          <button
            onClick={decreaseFontSize}
            disabled={fontSizeIndex <= 0}
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-full active:bg-white/10 text-sm font-bold"
            aria-label="הקטן טקסט"
          >
            א-
          </button>
        </div>

        {/* Content - Enhanced Reading Experience */}
        <div
          ref={contentRef}
          className="px-5 sm:px-8 py-6 overflow-y-auto flex-grow overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div
            className="prose-reader max-w-none text-white/90 leading-[1.8] whitespace-pre-wrap"
            style={{ fontSize: `${currentFontSize}px` }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                (item.summary_ai || item.content).replace(/\n/g, '<br />'),
                DOMPURIFY_CONFIG
              )
            }}
          />

          {/* Attachments */}
          {item.attachments && item.attachments.length > 0 && (
            <div className="border-t border-white/10 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-[var(--accent-highlight)] mb-4 uppercase tracking-wider">
                קבצים מצורפים
              </h3>
              <div className="space-y-3">
                {item.attachments.map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    download={file.name}
                    className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5 hover:border-white/20 active:scale-[0.98]"
                  >
                    {getFileIcon(file.mimeType)}
                    <span className="text-white font-medium truncate">
                      {file.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="border-t border-white/10 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-[var(--accent-highlight)] mb-4 uppercase tracking-wider">
                פריטים קשורים
              </h3>
              <div className="space-y-3">
                {relatedItems.map(related => (
                  <button
                    key={related.id}
                    onClick={() => {
                      triggerHaptic('light');
                      onSelectItem(related);
                    }}
                    className="w-full text-right bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-colors border border-white/5 hover:border-white/20 active:scale-[0.98]"
                  >
                    <p className="font-semibold text-white truncate">
                      {related.title}
                    </p>
                    <p className="text-sm text-white/50 line-clamp-1 mt-1">
                      {related.summary_ai || related.content}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Large Touch Targets with Safe Area */}
        <footer className="p-4 border-t border-white/10 sticky bottom-0 bg-black/80 backdrop-blur-xl flex gap-3 safe-area-inset-bottom">
          {!item.summary_ai && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onSummarize(item);
              }}
              disabled={isSummarizing}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--dynamic-accent-start)] to-[var(--dynamic-accent-end)] hover:brightness-110 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 min-h-[56px]"
            >
              <SummarizeIcon className="h-5 w-5" />
              {isSummarizing ? 'מסכם...' : 'סכם עם AI'}
            </button>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-colors active:scale-[0.98] min-h-[56px]"
            >
              <LinkIcon className="h-5 w-5" />
              <span className="truncate">פתח ב-{sourceDomain || 'מקור'}</span>
            </a>
          )}
        </footer>
      </div>
    </div>
  );
};

export default ItemDetailModal;

