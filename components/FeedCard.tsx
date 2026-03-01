import React, { useRef, useState, useMemo, useCallback } from 'react';
import type { FeedItem } from '../types';
import { SparklesIcon, FeedIcon, BrainCircuitIcon } from './icons';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../src/contexts/SettingsContext';
import { UltraCard } from './ui/UltraCard';
import {
  extractImageFromContent,
  calculateReadingTime,
  getFaviconUrl,
  formatTimeAgo,
  extractDomain,
} from '../utils/feedUtils';
import { FeedCardImage } from './feed/card/FeedCardImage';
import { FeedCardContent } from './feed/card/FeedCardContent';
import { FeedCardOverlays } from './feed/card/FeedCardOverlays';

interface FeedCardProps {
  item: FeedItem;
  index: number;
  onSelect: (item: FeedItem, event: React.MouseEvent | React.KeyboardEvent) => void;
  onContextMenu: (event: React.MouseEvent, item: FeedItem) => void;
  onMarkAsRead?: (item: FeedItem) => void;
  onToggleSave?: (item: FeedItem) => void;
  priority?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
  item,
  index: _index,
  onSelect,
  onContextMenu,
  onMarkAsRead,
  onToggleSave,
  priority = false,
}) => {
  const { triggerHaptic } = useHaptics();
  const { settings } = useSettings();
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeThreshold = 70;

  // Handle select with optional auto-mark as read
  const handleSelect = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (settings.feedSettings?.markAsReadOnOpen && onMarkAsRead && !item.is_read) {
      onMarkAsRead(item);
    }
    onSelect(item, e);
  }, [settings.feedSettings?.markAsReadOnOpen, onMarkAsRead, item, onSelect]);

  const thumbnailUrl = useMemo(() => extractImageFromContent(item.content || ''), [item.content]);
  const readingTime = useMemo(() => calculateReadingTime(item.content || ''), [item.content]);
  const showImage = !!(thumbnailUrl && !imageError && item.type === 'rss');

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || !e.touches[0]) return;
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = touchStartY.current !== null
      ? e.touches[0].clientY - touchStartY.current
      : 0;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) < 150) {
      setSwipeOffset(diffX);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null) return;

    if (swipeOffset > swipeThreshold) {
      if (onMarkAsRead && !item.is_read) {
        triggerHaptic('light');
        onMarkAsRead(item);
      }
    } else if (swipeOffset < -swipeThreshold) {
      if (onToggleSave) {
        triggerHaptic('light');
        onToggleSave(item);
      }
    }
    setSwipeOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  }, [swipeOffset, swipeThreshold, item, onMarkAsRead, onToggleSave, triggerHaptic]);

  const sourceText = useMemo(() => {
    if (item.type === 'rss' && item.link) return extractDomain(item.link) || 'RSS';
    if (item.type === 'spark') return item.source === 'AI_GENERATED' ? 'Spark AI' : 'ספארק אישי';
    if (item.type === 'mentor') return item.title.split(':')[0] || 'מנטור';
    return 'לא ידוע';
  }, [item]);

  const TypeIcon = useMemo(() => {
    if (item.type === 'rss') return FeedIcon;
    if (item.type === 'spark') return item.source === 'AI_GENERATED' ? BrainCircuitIcon : SparklesIcon;
    return BrainCircuitIcon;
  }, [item.type, item.source]);

  const faviconUrl = item.type === 'rss' && item.link ? getFaviconUrl(item.link) : null;
  const timeAgo = useMemo(() => formatTimeAgo(item.createdAt), [item.createdAt]);

  const contentSnippet = useMemo(() =>
    item.summary_ai || item.content?.split('\n')[0]?.replace(/<[^>]*>?/gm, '') || '',
    [item.summary_ai, item.content]);

  return (
    <div className="relative mb-5 touch-pan-y">
      <FeedCardOverlays
        swipeOffset={swipeOffset}
      />

      <div
        ref={cardRef}
        role="article"
        tabIndex={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => handleSelect(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(e);
          }
        }}
        onContextMenu={(e) => onContextMenu(e, item)}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        className="transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-[28px]"
      >
        <UltraCard
          variant="glass"
          glowColor={item.isImportant ? 'gold' : 'neutral'}
          className={`
             p-0 border-white/[0.06] rounded-[28px]
             ${item.is_read ? 'opacity-60' : ''}
             bg-[rgba(18,18,24,0.65)] backdrop-blur-2xl
             shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.03)]
             hover:shadow-[0_16px_56px_-12px_rgba(0,0,0,0.6)]
             hover:bg-[rgba(26,26,34,0.7)]
             transition-all duration-500 ease-out
          `}
          noPadding
        >
          {showImage && (
            <FeedCardImage
              src={thumbnailUrl || ''}
              sourceText={sourceText}
              priority={priority}
              onError={() => setImageError(true)}
            />
          )}

          <FeedCardContent
            item={item}
            sourceText={sourceText}
            timeAgo={timeAgo}
            readingTime={readingTime}
            showImage={showImage}
            TypeIcon={TypeIcon}
            faviconUrl={faviconUrl}
            contentSnippet={contentSnippet}
          />
        </UltraCard>
      </div>
    </div>
  );
};

export default React.memo(FeedCard);

