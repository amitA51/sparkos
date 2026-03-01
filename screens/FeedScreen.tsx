import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { FeedItem, RssFeed } from '../types';
import type { Screen } from '../types';
import FeedCard from '../components/FeedCard';
import FeedItemDetailSheet from '../components/feed/FeedItemDetailSheet';
import SynthesisModal from '../components/SynthesisModal';
import FeedSkeleton from '../components/FeedSkeleton';
import EmptyState from '../components/EmptyState';
import ContextMenu from '../components/ContextMenu';
import StatusMessage, { StatusMessageType } from '../components/StatusMessage';
import { summarizeItemContent } from '../services/ai';
import * as dataService from '../services/dataService';
import { refreshAllFeeds } from '../services/feedService';
import {
  SettingsIcon,
  RefreshIcon,
  RssIcon,
  CheckCheckIcon,
} from '../components/icons';
import { SparklesIcon } from '../components/icons';
import { LayoutDashboardIcon } from '../components/icons';
import type { RssFeedCategory } from '../types';
import { PremiumButton } from '../components/premium/PremiumComponents';
import { useData } from '../src/contexts/DataContext';
import { useSettings } from '../src/contexts/SettingsContext';
import { useContextMenu } from '../hooks/useContextMenu';
import { useHaptics } from '../hooks/useHaptics';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { SkeletonBox, SkeletonCircle } from '../components/SkeletonLoader';
import { Virtuoso } from 'react-virtuoso';
import { rafThrottle } from '../utils/performance';
import PremiumHeader from '../components/PremiumHeader';
import TodayHighlightsWidget from '../components/feed/TodayHighlightsWidget';
import { PullToRefresh } from '../components/ui/PullToRefresh';
import { ModalOverlay } from '../components/ui/ModalOverlay';
import { AddRssFeedSheet } from '../components/feed/AddRssFeedSheet';


interface FeedScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const FilterPill: React.FC<{
  label: string;
  onClick: () => void;
  isActive: boolean;
  icon?: React.ReactNode;
  count?: number;
}> = ({ label, onClick, isActive, icon, count }) => (
  <button
    onClick={onClick}
    className="relative flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-2xl text-[13px] font-semibold tracking-wide
      transition-all duration-300 ease-out cursor-pointer select-none"
    style={{
      background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
      border: `0.5px solid ${isActive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.10)'}`,
      color: isActive ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}
  >
    {icon && <span className={`${isActive ? 'opacity-90' : 'opacity-35'} transition-opacity duration-300`}>{icon}</span>}
    <span>{label}</span>
    {count !== undefined && count > 0 && (
      <span
        className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold leading-none"
        style={{
          background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
          color: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)',
        }}
      >
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);
const LAST_REFRESH_KEY = 'spark_last_refresh_time';

const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (date >= today) return 'היום';
  if (date >= yesterday) return 'אתמול';
  if (date >= weekAgo) return 'השבוע';
  return 'מוקדם יותר';
};

const FeedScreen: React.FC<FeedScreenProps> = ({ setActiveScreen }) => {
  const { feedItems, spaces, isLoading, updateFeedItem, refreshAll, removeFeedItem, loadDataType, isDataTypeLoaded } = useData();
  const { settings } = useSettings();
  const headerRef = useRef<HTMLElement>(null);
  const { triggerHaptic } = useHaptics();
  const { confirm } = useConfirmDialog();

  // ✅ FIX: Load feed data immediately on mount for instant content
  useEffect(() => {
    if (!isDataTypeLoaded('feedItems')) {
      loadDataType('feedItems');
    }
    if (!isDataTypeLoaded('spaces')) {
      loadDataType('spaces');
    }
  }, [loadDataType, isDataTypeLoaded]);

  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all'); // Can be 'all', 'sparks', or a spaceId
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: StatusMessageType;
    text: string;
    id: number;
    onUndo?: () => Promise<void> | void;
  } | null>(null);


  // --- State for Add RSS Feed Modal ---
  const [isAddRssOpen, setIsAddRssOpen] = useState(false);
  const [newRssUrl, setNewRssUrl] = useState('');
  const [newRssCategory, setNewRssCategory] = useState<RssFeedCategory>('general');
  const [isAddingRss, setIsAddingRss] = useState(false);

  const { contextMenu, handleContextMenu, closeContextMenu } = useContextMenu<FeedItem>();

  const feedSpaces = useMemo(() => spaces.filter(s => s.type === 'feed'), [spaces]);

  // PERFORMANCE: Split feedStats computation - only recalculate when feedItems changes
  const feedStats = useMemo(() => {
    let unread = 0;
    let sparks = 0;
    for (const item of feedItems) {
      if (!item.is_read) unread++;
      if (item.type === 'spark') sparks++;
    }
    return {
      total: feedItems.length,
      unread,
      sparks,
    };
  }, [feedItems]);

  // PERFORMANCE: Sources count calculated separately since it depends on spaces
  const sourcesCount = feedSpaces.length;

  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>([]);
  useEffect(() => {
    let isMounted = true;

    const fetchFeeds = async () => {
      try {
        const feeds = await dataService.getFeeds();
        if (isMounted) {
          setRssFeeds(feeds);
        }
      } catch (error) {
        console.error('Failed to fetch RSS feeds:', error);
      }
    };

    fetchFeeds();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fi Principle: Parallax Header for Immersive Depth - Optimized with rafThrottle
  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      if (headerRef.current) {
        const scrollY = window.scrollY;
        const translateY = Math.min(scrollY * 0.5, 150);
        headerRef.current.style.transform = `translateY(-${translateY}px)`;
        headerRef.current.style.opacity = `${Math.max(1 - scrollY / 200, 0)}`;
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PERFORMANCE: Memoized status handler
  const showStatus = useCallback(
    (type: StatusMessageType, text: string, onUndo?: () => Promise<void> | void) => {
      setStatusMessage({ type, text, id: Date.now(), onUndo });
    },
    []
  );

  const handleSelectItem = useCallback(
    (item: FeedItem, event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.stopPropagation();
      if (!document.startViewTransition) {
        setSelectedItem(item);
        return;
      }
      document.startViewTransition(() => {
        setSelectedItem(item);
      });
    },
    []
  );

  const handleUpdateItem = useCallback(
    async (id: string, updates: Partial<FeedItem>) => {
      const originalItem = feedItems.find(item => item.id === id);
      if (!originalItem) return;

      // Optimistic local update of selected item (DataContext will update global list)
      if (selectedItem?.id === id) {
        setSelectedItem(prev => (prev ? { ...prev, ...updates } : null));
      }

      try {
        await updateFeedItem(id, updates);
      } catch (error) {
        console.error('Failed to update item:', error);
        // Rollback on failure only for selected item UI
        if (selectedItem?.id === id) {
          setSelectedItem(originalItem);
        }
        showStatus('error', 'שגיאה בעדכון הפריט.');
      }
    },
    [selectedItem, feedItems, updateFeedItem, showStatus]
  );

  const handleRefresh = useCallback(
    async (isAutoRefresh = false) => {
      if (isRefreshing) return;
      if (!isAutoRefresh) window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsRefreshing(true);
      try {
        const newItems = await refreshAllFeeds();

        await refreshAll();

        if (!isAutoRefresh) {
          localStorage.setItem(LAST_REFRESH_KEY, new Date().getTime().toString());
          if (newItems.length > 0) {
            showStatus('success', `נוספו ${newItems.length} פריטים חדשים.`);
          } else {
            showStatus('success', 'הפיד שלך עדכני.');
          }
        }
      } catch (error) {
        console.error('Error refreshing feed:', error);
        if (!isAutoRefresh) {
          showStatus('error', 'שגיאה בעת רענון הפידים.');
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing, refreshAll, showStatus]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastRefreshTime = localStorage.getItem(LAST_REFRESH_KEY);
        const now = new Date().getTime();
        // Use feedRefreshInterval setting (default 15 minutes)
        const refreshIntervalMs = (settings.feedSettings?.feedRefreshInterval || 15) * 60 * 1000;

        if (!lastRefreshTime || now - parseInt(lastRefreshTime, 10) > refreshIntervalMs) {
          handleRefresh(true);
          localStorage.setItem(LAST_REFRESH_KEY, now.toString());
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Initial check on mount
    handleVisibilityChange();
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleRefresh, settings.feedSettings?.feedRefreshInterval]);

  const handleToggleRead = useCallback(
    (id: string, forceStatus?: boolean) => {
      const currentItem = feedItems.find(item => item.id === id);
      if (!currentItem) return;
      const newReadStatus = forceStatus !== undefined ? forceStatus : !currentItem.is_read;
      handleUpdateItem(id, { is_read: newReadStatus });
    },
    [feedItems, handleUpdateItem]
  );

  const handleSummarize = useCallback(
    async (itemToSummarize: FeedItem) => {
      if (!itemToSummarize || isSummarizing) return;
      setIsSummarizing(itemToSummarize.id);
      try {
        const summary = await summarizeItemContent(itemToSummarize.content);
        await handleUpdateItem(itemToSummarize.id, { summary_ai: summary });
      } catch (error) {
        console.error('Failed to summarize:', error);
        showStatus('error', 'שגיאה בעת ניסיון הסיכום.');
      } finally {
        setIsSummarizing(null);
      }
    },
    [isSummarizing, handleUpdateItem, showStatus]
  );

  const handleDeleteItem = useCallback(
    async (id: string) => {
      const itemToDelete = feedItems.find(item => item.id === id);
      if (!itemToDelete) return;

      triggerHaptic('medium');

      await removeFeedItem(id);

      showStatus('success', 'הפריט נמחק.', async () => {
        // UNDO: Re-add the item and refresh from storage
        await dataService.reAddFeedItem(itemToDelete);
        await refreshAll();
      });
    },
    [feedItems, removeFeedItem, triggerHaptic, showStatus, refreshAll]
  );

  // Reserved for future use - confirmation dialog before deletion
  // @ts-expect-error Preserved for future confirmation flow implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleDeleteWithConfirmation = useCallback(
    (id: string) => {
      const itemToDelete = feedItems.find(item => item.id === id);
      if (itemToDelete && confirm(`האם למחוק את "${itemToDelete.title}"?`)) {
        handleDeleteItem(id);
        setSelectedItem(null); // Close modal
      }
    },
    [feedItems, handleDeleteItem, confirm]
  );

  const handleAddToLibrary = useCallback(
    async (item: FeedItem) => {
      try {
        await dataService.convertFeedItemToPersonalItem(item);
        await refreshAll();
        handleToggleRead(item.id, true);
        showStatus('success', 'הפריט הוסף לספרייה');
      } catch (error) {
        console.error('Failed to add to library:', error);
        showStatus('error', 'שגיאה בהוספה לספרייה');
      }
    },
    [handleToggleRead, refreshAll, showStatus]
  );


  // PERF: Memoize feedIds lookup map separately - avoids recreating Set on every filter change
  const feedIdsBySpace = useMemo(() => {
    const map = new Map<string, Set<string>>();
    rssFeeds.forEach(f => {
      if (f.spaceId) {
        if (!map.has(f.spaceId)) map.set(f.spaceId, new Set());
        map.get(f.spaceId)!.add(f.id);
      }
    });
    return map;
  }, [rssFeeds]);

  const filteredItems = useMemo(() => {
    let items = feedItems;
    if (filter === 'sparks') {
      items = items.filter(item => item.type === 'spark');
    } else if (filter !== 'all') {
      const feedIdsInSpace = feedIdsBySpace.get(filter) || new Set();
      items = items.filter(
        item => item.type === 'rss' && item.source && feedIdsInSpace.has(item.source)
      );
    }

    // Sort based on user preference (defaultFeedSort setting)
    const sortOrder = settings.feedSettings?.defaultFeedSort || 'newest';
    return [...items].sort((a, b) => {
      if (sortOrder === 'important') {
        // Important items first, then by date
        if (a.isImportant && !b.isImportant) return -1;
        if (!a.isImportant && b.isImportant) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [feedItems, filter, feedIdsBySpace, settings.feedSettings?.defaultFeedSort]);

  const handleMarkAllRead = useCallback(async () => {
    const unreadInFilter = filteredItems.filter(item => !item.is_read);
    if (unreadInFilter.length === 0) {
      showStatus('success', 'אין פריטים חדשים לסמון.');
      return;
    }

    // 🎯 OPTIMISTIC: Show success immediately - DataContext handles optimistic updates
    const count = unreadInFilter.length;
    showStatus('success', `${count} פריטים סומנו כנקראו.`);

    try {
      await Promise.all(unreadInFilter.map(item => updateFeedItem(item.id, { is_read: true })));
    } catch (error) {
      console.error('Batch mark read failed:', error);
      showStatus('error', 'שגיאה בעדכון הפריטים.');
    }
  }, [filteredItems, updateFeedItem, showStatus]);

  // --- Handle Add RSS Feed ---
  const handleAddRssFeed = useCallback(async () => {
    if (!newRssUrl || isAddingRss) return;
    if (!newRssUrl.startsWith('http')) {
      showStatus('error', 'נא להזין כתובת URL תקינה');
      return;
    }
    setIsAddingRss(true);
    try {
      const newFeed = await dataService.addFeed(newRssUrl);
      // Update category if set
      if (newRssCategory !== 'general') {
        await dataService.updateFeed(newFeed.id, { category: newRssCategory });
      }
      // Refresh feeds list
      const feeds = await dataService.getFeeds();
      setRssFeeds(feeds);
      setIsAddRssOpen(false);
      setNewRssUrl('');
      setNewRssCategory('general');
      showStatus('success', `פיד "${newFeed.name}" נוסף בהצלחה!`);
      // Trigger feed refresh to get new items
      handleRefresh(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      showStatus('error', `שגיאה בהוספת פיד: ${message}`);
    } finally {
      setIsAddingRss(false);
    }
  }, [newRssUrl, newRssCategory, isAddingRss, showStatus, handleRefresh]);

  return (
    <div className="screen-shell">
      <PremiumHeader
        title={settings.screenLabels?.feed || 'פיד'}
        subtitle={
          feedStats.unread > 0
            ? `${feedStats.unread} פריטים חדשים · ${feedStats.sparks} ספארקים · ${sourcesCount} מקורות`
            : `${feedStats.total} פריטים בפיד · ${feedStats.sparks} ספארקים · ${sourcesCount} מקורות`
        }
        actions={
          <>
            <PremiumButton
              onClick={() => setIsAddRssOpen(true)}
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              icon={<RssIcon className="w-6 h-6" />}
            >
              {null}
            </PremiumButton>

            <PremiumButton
              onClick={() => handleRefresh(false)}
              disabled={isRefreshing || isLoading}
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              icon={
                <RefreshIcon
                  className={`h-6 w-6 ${isRefreshing ? 'animate-spin text-accent-cyan' : ''}`}
                />
              }
            >
              {null}
            </PremiumButton>
            <PremiumButton
              onClick={handleMarkAllRead}
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              icon={<CheckCheckIcon className="h-6 w-6" />}
            >
              {null}
            </PremiumButton>
            <PremiumButton
              onClick={() => setActiveScreen('settings')}
              variant="ghost"
              size="sm"
              className="rounded-full w-10 h-10 p-0"
              icon={<SettingsIcon className="w-6 h-6" />}
            >
              {null}
            </PremiumButton>
          </>
        }
      >
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          <span className="badge-glow badge-glow-cyan">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: feedStats.unread > 0 ? 'var(--color-accent-cyan)' : 'rgba(255,255,255,0.25)' }}
            />
            {feedStats.unread > 0 ? `${feedStats.unread} לא נקראו` : 'הכול נקרא'}
          </span>
          <span className="badge-glow">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(167,139,250,0.7)' }} />
            {feedStats.sparks} ספארקים
          </span>
          <span className="badge-glow">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(56,189,248,0.6)' }} />
            {sourcesCount} מקורות
          </span>
        </div>
      </PremiumHeader>

      <div
        className={`transition-all duration-500 ${selectedItem && settings.themeSettings.name === 'Obsidian Air' ? 'scale-dim-behind' : ''}`}
      >
        <PullToRefresh onRefresh={() => handleRefresh(false)}>
          {/* Premium Widgets Section */}
          {filter === 'all' && !isLoading && feedItems.length > 0 && (
            <div className="mb-6">
              {/* Today's Highlights */}
              <TodayHighlightsWidget
                items={feedItems}
                onSelectItem={item => setSelectedItem(item)}
              />
            </div>
          )}

          {/* Premium Filter Pills */}
          <div className="flex gap-2.5 mb-6 overflow-x-auto pb-3 -mx-3 sm:-mx-4 px-3 sm:px-4 scrollbar-hide">
            <FilterPill
              label="הכל"
              onClick={() => setFilter('all')}
              isActive={filter === 'all'}
              icon={<LayoutDashboardIcon className="w-4 h-4" />}
              count={feedStats.total}
            />
            <FilterPill
              label="ספארקים"
              onClick={() => setFilter('sparks')}
              isActive={filter === 'sparks'}
              icon={<SparklesIcon className="w-4 h-4" />}
              count={feedStats.sparks}
            />
            {feedSpaces.map(space => (
              <FilterPill
                key={space.id}
                label={space.name}
                onClick={() => setFilter(space.id)}
                isActive={filter === space.id}
              />
            ))}
          </div>

          {isLoading && feedItems.length === 0 ? (
            <FeedSkeleton count={5} />
          ) : (
            <div className="px-1">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="bg-cosmos-depth/50 rounded-2xl p-4 space-y-3 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <SkeletonCircle size={40} />
                        <div className="space-y-2">
                          <SkeletonBox width="120px" height="16px" />
                          <SkeletonBox width="80px" height="12px" />
                        </div>
                      </div>
                      <SkeletonBox width="100%" height="100px" className="rounded-xl" />
                      <div className="flex justify-between">
                        <SkeletonBox width="60px" height="20px" />
                        <SkeletonBox width="60px" height="20px" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <EmptyState
                  illustration="feed"
                  title={feedItems.length > 0 ? 'אין פריטים כאן' : 'הפיד שלך ריק'}
                  description={
                    feedItems.length > 0
                      ? 'נסה לבחור סינון אחר או לרענן את הפידים שלך.'
                      : 'לחץ על כפתור הרענון כדי למשוך תוכן חדש מהמקורות שהגדרת.'
                  }
                  action={{
                    label: 'רענן פידים',
                    onClick: () => handleRefresh(false),
                    icon: (
                      <RefreshIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    ),
                  }}
                />
              ) : (
                <Virtuoso
                  useWindowScroll
                  data={filteredItems}
                  overscan={400}
                  computeItemKey={(index, item) => item.id}
                  increaseViewportBy={{ top: 200, bottom: 400 }}
                  itemContent={(index, item) => {
                    const prevItem = index > 0 ? filteredItems[index - 1] : null;
                    const currentLabel = getDateLabel(item.createdAt);
                    const prevLabel = prevItem ? getDateLabel(prevItem.createdAt) : null;
                    const showDateHeader = currentLabel !== prevLabel;

                    return (
                      <div className="pb-4">
                        {showDateHeader && (
                          <div className="flex items-center gap-3 mb-5 mt-2 px-1">
                            <div className="h-[0.5px] flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)' }} />
                            <span
                              className="badge-glow text-[10px] font-semibold tracking-[0.1em] uppercase"
                            >
                              {currentLabel}
                            </span>
                            <div className="h-[0.5px] flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)' }} />
                          </div>
                        )}
                        <FeedCard
                          item={item}
                          index={index}
                          onSelect={handleSelectItem}
                          onContextMenu={handleContextMenu}
                          priority={index < 4}
                        />
                      </div>
                    );
                  }}
                />
              )}
            </div>
          )}
        </PullToRefresh>

        <FeedItemDetailSheet
          item={selectedItem}
          onClose={() => {
            if (!document.startViewTransition) {
              setSelectedItem(null);
              return;
            }
            document.startViewTransition(() => {
              setSelectedItem(null);
            });
          }}
          onSummarize={handleSummarize}
          onUpdate={handleUpdateItem}
          isSummarizing={!!isSummarizing}
        />
        <SynthesisModal
          isLoading={isSynthesizing}
          synthesisResult={synthesisResult}
          onClose={() => {
            setIsSynthesizing(false);
            setSynthesisResult(null);
          }}
        />
        {contextMenu.isOpen && contextMenu.item && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            item={contextMenu.item}
            onClose={closeContextMenu}
            onToggleRead={() => handleToggleRead(contextMenu.item!.id)}
            onSummarize={() => handleSummarize(contextMenu.item!)}
            onDelete={handleDeleteItem}
            onAddToLibrary={handleAddToLibrary}
          />
        )}

        {statusMessage && (
          <StatusMessage
            key={statusMessage.id}
            type={statusMessage.type}
            message={statusMessage.text}
            onDismiss={() => setStatusMessage(null)}
            onUndo={statusMessage.onUndo}
          />
        )}

        {/* Add RSS Feed Modal - Portal rendered above navigation */}
        <ModalOverlay
          isOpen={isAddRssOpen}
          onClose={() => setIsAddRssOpen(false)}
          variant="bottomSheet"
          blur="md"
          backdropOpacity={60}
        >
          <AddRssFeedSheet
            onClose={() => setIsAddRssOpen(false)}
            onAdd={async (url, category) => {
              setNewRssUrl(url);
              setNewRssCategory(category);
              await handleAddRssFeed();
            }}
            isLoading={isAddingRss}
          />
        </ModalOverlay>
      </div>
    </div>
  );
};

export default React.memo(FeedScreen);
