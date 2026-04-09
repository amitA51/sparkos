
// CLEANED - CSS vars fixed

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Screen, PersonalItem, UniversalSearchResult, SearchFilters, FeedItem } from '../types';
import { universalAiSearch, isAiAvailable } from '../services/ai';
import { useDebounce } from '../hooks/useDebounce';
import { SearchIcon, SparklesIcon, SettingsIcon, FilterIcon, ClockIcon, TrashIcon } from '../components/icons';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SearchResultItem from '../components/SearchResultItem';
import SearchFilterPanel from '../components/SearchFilterPanel';
import SearchCategoryPill from '../components/SearchCategoryPill';
import SearchRecentItem from '../components/SearchRecentItem';
import PremiumEmptySearch from '../components/PremiumEmptySearch';
import PersonalItemDetailModal from '../components/PersonalItemDetailModal';
import FeedItemDetailSheet from '../components/feed/FeedItemDetailSheet';
import { useData } from '../src/contexts/DataContext';
import { useCalendar } from '../src/contexts/CalendarContext';
import { useSettings } from '../src/contexts/SettingsContext';
import { saveSearchQuery, getSearchHistory, removeFromHistory, clearSearchHistory } from '../services/searchHistoryService';
import { useHaptics } from '../hooks/useHaptics';

interface SearchScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

export default function SearchScreen({ setActiveScreen }: SearchScreenProps) {
  const { personalItems, feedItems, updatePersonalItem, removePersonalItem, updateFeedItem } = useData();
  const { calendarEvents } = useCalendar();
  const { settings } = useSettings();
  const { triggerHaptic } = useHaptics();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);

  const [isAiSearch, setIsAiSearch] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiSourceIds, setAiSourceIds] = useState<Set<string>>(new Set());

  const [localResults, setLocalResults] = useState<UniversalSearchResult[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'all',
    status: 'all',
  });

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Selected item state for detail modals
  const [selectedPersonalItem, setSelectedPersonalItem] = useState<PersonalItem | null>(null);
  const [selectedFeedItem, setSelectedFeedItem] = useState<FeedItem | null>(null);

  const handleSelectSearchResult = useCallback((result: UniversalSearchResult) => {
    triggerHaptic('light');
    const item = result.item;
    // Calendar events open in a new tab
    if (result.type === 'calendar') {
      const calEvent = item as { htmlLink?: string };
      if (calEvent.htmlLink) window.open(calEvent.htmlLink, '_blank');
      return;
    }
    // Feed items (rss, spark, news, mentor)
    if (result.type === 'rss' || result.type === 'spark' || result.type === 'news' || result.type === 'mentor') {
      setSelectedFeedItem(item as FeedItem);
      return;
    }
    // Personal items
    setSelectedPersonalItem(item as PersonalItem);
  }, [triggerHaptic]);

  const handleUpdatePersonalItem = useCallback(async (id: string, updates: Partial<PersonalItem>) => {
    try {
      await updatePersonalItem(id, updates);
      setSelectedPersonalItem(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
    } catch (error) {
      console.error('Failed to update item from search:', error);
    }
  }, [updatePersonalItem]);

  const handleDeletePersonalItem = useCallback(async (id: string) => {
    try {
      await removePersonalItem(id);
      setSelectedPersonalItem(null);
    } catch (error) {
      console.error('Failed to delete item from search:', error);
    }
  }, [removePersonalItem]);

  const handleUpdateFeedItem = useCallback(async (id: string, updates: Partial<FeedItem>) => {
    try {
      await updateFeedItem(id, updates);
      setSelectedFeedItem(prev => prev && prev.id === id ? { ...prev, ...updates } : prev);
    } catch (error) {
      console.error('Failed to update feed item from search:', error);
    }
  }, [updateFeedItem]);

  // Scroll animation for header
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  const headerBg = useTransform(scrollY, [0, 50], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']);
  const headerBackdrop = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(20px)']);
  const titleScale = useTransform(scrollY, [0, 50], [1, 0.9]);
  const titleY = useTransform(scrollY, [0, 50], [0, -5]);

  // Load history on mount and auto-focus search input
  useEffect(() => {
    setRecentSearches(getSearchHistory());
    // Auto-focus the search input so the user can start typing immediately
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
      setIsFocused(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const allSearchableData = useMemo((): UniversalSearchResult[] => {
    const personal: UniversalSearchResult[] = personalItems.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title || '',
      content: item.content || '',
      date: item.createdAt,
      item,
    }));
    const feed: UniversalSearchResult[] = feedItems.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      content: item.summary_ai || item.content,
      date: item.createdAt,
      item,
    }));
    const calendar: UniversalSearchResult[] = calendarEvents.map(event => ({
      id: event.htmlLink || event.id || '',
      type: 'calendar',
      title: event.summary,
      content: '',
      date: event.start?.dateTime || event.start?.date || new Date().toISOString(),
      item: event,
    }));
    return [...personal, ...feed, ...calendar].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [personalItems, feedItems, calendarEvents]);

  // Local Search Effect
  useEffect(() => {
    if (debouncedQuery.length > 1 && !isAiSearch) {
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      const results = allSearchableData.filter(
        item =>
          item.title.toLowerCase().includes(lowerCaseQuery) ||
          item.content.toLowerCase().includes(lowerCaseQuery)
      );
      setLocalResults(results);

      // Save to search history when local search produces results with 3+ chars
      if (debouncedQuery.length >= 3 && results.length > 0) {
        saveSearchQuery(debouncedQuery);
        setRecentSearches(getSearchHistory());
      }
    } else if (debouncedQuery.length <= 1) {
      setLocalResults([]);
    }
  }, [debouncedQuery, allSearchableData, isAiSearch]);

  const handleAiSearch = async () => {
    if (!query || isAiLoading) return;

    triggerHaptic('heavy');
    saveSearchQuery(query);
    setRecentSearches(getSearchHistory());

    if (!isAiAvailable()) {
      setIsAiSearch(true);
      setAiAnswer('שירות AI לא זמין. הגדר את מפתח ה-API בהגדרות.');

      const lowerCaseQuery = query.toLowerCase();
      const fallbackResults = allSearchableData.filter(
        item =>
          item.title.toLowerCase().includes(lowerCaseQuery) ||
          item.content.toLowerCase().includes(lowerCaseQuery)
      );
      setLocalResults(fallbackResults);
      return;
    }

    setIsAiLoading(true);
    setIsAiSearch(true);
    setAiAnswer(null);
    setAiSourceIds(new Set());
    setLocalResults([]);

    try {
      const searchCorpus = allSearchableData.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content.substring(0, 400),
        date: item.date,
      }));
      const result = await universalAiSearch(query, searchCorpus);
      setAiAnswer(result.answer);
      setAiSourceIds(new Set(result.sourceIds));
    } catch (e: unknown) {
      console.error('AI Search failed', e);
      const errorMessage = e instanceof Error ? e.message : '';
      let userMessage = 'חיפוש ה-AI נכשל.';

      if (errorMessage.includes('API Key')) userMessage = 'מפתח AI לא מוגדר.';
      else if (errorMessage.includes('429')) userMessage = 'יותר מדי בקשות, נסה שוב מאוחר יותר.';

      setAiAnswer(userMessage);

      // Fallback
      const lowerCaseQuery = query.toLowerCase();
      const fallbackResults = allSearchableData.filter(
        item =>
          item.title.toLowerCase().includes(lowerCaseQuery) ||
          item.content.toLowerCase().includes(lowerCaseQuery)
      );
      setLocalResults(fallbackResults);
      setIsAiSearch(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQueryChange = useCallback((q: string) => {
    setQuery(q);
    if (isAiSearch && q.length < debouncedQuery.length) {
      setIsAiSearch(false);
      setAiAnswer(null);
      setAiSourceIds(new Set());
    }
  }, [isAiSearch, debouncedQuery.length]);

  const handleCancelSearch = useCallback(() => {
    setQuery('');
    setIsFocused(false);
    triggerHaptic('light');
    searchInputRef.current?.blur();
  }, [triggerHaptic]);

  const handleRecentSearchSelect = useCallback((selectedQuery: string) => {
    setQuery(selectedQuery);
  }, []);

  const handleClearHistory = useCallback(() => {
    triggerHaptic('medium');
    clearSearchHistory();
    setRecentSearches([]);
  }, [triggerHaptic]);

  const handleRemoveRecent = useCallback((q: string) => {
    removeFromHistory(q);
    setRecentSearches(prev => prev.filter(item => item !== q));
  }, []);

  // Filter Logic
  const displayedResults = useMemo(() => {
    const source = isAiSearch
      ? allSearchableData.filter(item => aiSourceIds.has(item.id))
      : localResults;

    return source.filter(item => {
      // Type filter
      if (filters.type !== 'all' && item.type !== filters.type) return false;

      // Status filter
      if (filters.status !== 'all') {
        const pItem = item.item as PersonalItem;
        if (filters.status === 'completed' && !pItem.isCompleted) return false;
        if (filters.status === 'open' && pItem.isCompleted) return false;
        if (filters.status === 'important' && !pItem.isImportant) return false;
      }

      // Date Range filter
      if (filters.dateRange !== 'all') {
        const itemDate = new Date(item.date);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (filters.dateRange === 'today' && itemDate < today) return false;
        if (filters.dateRange === 'week') {
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          if (itemDate < oneWeekAgo) return false;
        }
        if (filters.dateRange === 'month') {
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          if (itemDate < oneMonthAgo) return false;
        }
      }
      return true;
    });
  }, [localResults, aiSourceIds, isAiSearch, filters, allSearchableData]);

  // PERF: Memoize static category list to prevent re-creation on every render
  const categories = useMemo(() => [
    { id: 'all', label: 'הכל', icon: undefined },
    { id: 'task', label: 'משימות', icon: '✓' },
    { id: 'note', label: 'פתקים', icon: '📝' },
    { id: 'spark', label: 'ספארקים', icon: '✨' },
    { id: 'workout', label: 'אימונים', icon: '💪' },
    { id: 'calendar', label: 'לוח שנה', icon: '📅' },
  ], []);

  // PERF: Stable callbacks for filter panel / settings navigation
  const handleCloseFilterPanel = useCallback(() => setIsFilterPanelOpen(false), []);
  const handleOpenFilterPanel = useCallback(() => setIsFilterPanelOpen(true), []);
  const handleGoToSettings = useCallback(() => setActiveScreen('settings'), [setActiveScreen]);
  // PERF: Stable per-category callbacks using Map (avoids inline arrow in .map())
  const categoryClickHandlers = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const cat of categories) {
      map.set(cat.id, () => {
        setFilters(prev => ({ ...prev, type: cat.id as SearchFilters['type'] }));
        triggerHaptic('light');
      });
    }
    return map;
  }, [categories, triggerHaptic]);
  const handleSuggestionClick = useCallback((s: string) => {
    setQuery(s);
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="screen-shell flex flex-col h-screen overflow-hidden font-sans">
      <SearchFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilterPanel}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Dynamic Header */}
      <motion.div
        style={{
          backgroundColor: headerBg,
          backdropFilter: headerBackdrop,
        }}
        className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] px-4 pb-2 transition-colors"
      >
        <div className="flex items-center justify-between h-14 relative">
          <motion.h1
            style={{ scale: titleScale, y: titleY, transformOrigin: 'right center', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            className="text-2xl font-bold"
          >
            {settings.screenLabels?.search || 'חיפוש'}
          </motion.h1>
          <button
            onClick={handleGoToSettings}
            className="glass-action-btn p-2.5 rounded-full"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Main Scrollable Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 60px)' }}
      >
        <div className="max-w-3xl mx-auto w-full px-4 pb-32 min-h-full">

          {/* Search Input Section */}
          <div className={`sticky top-2 z-40 transition-all duration-300 ${isFocused ? '-mt-2 pt-2' : 'mt-2'}`}>
            <div className="relative group">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <SearchIcon
                      className={`h-5 w-5 text-theme-secondary transition-colors duration-300 ${
                        isFocused ? 'opacity-80' : 'opacity-50'
                      }`}
                    />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    onChange={e => handleQueryChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => !query && setIsFocused(false), 200)}
                    onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
                    placeholder="חפש, או שאל את ה-AI..."
                    className="w-full text-theme-primary rounded-2xl py-3.5 pr-12 pl-4 
                                focus:outline-none
                                transition-all duration-300 text-[17px]"
                    style={{
                      background: 'var(--gray-50)',
                      border: `0.5px solid ${isFocused ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                    }}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 text-theme-secondary opacity-60 hover:opacity-100 transition-colors"
                    >
                      <div className="bg-[var(--gray-100)] rounded-full p-1">
                        <TrashIcon className="w-3 h-3" />
                      </div>
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isFocused && (
                    <motion.button
                      initial={{ width: 0, opacity: 0, scale: 0.9 }}
                      animate={{ width: 'auto', opacity: 1, scale: 1 }}
                      exit={{ width: 0, opacity: 0, scale: 0.9 }}
                      onClick={handleCancelSearch}
                      className="whitespace-nowrap text-[17px] font-medium text-[var(--color-accent-cyan)] overflow-hidden pl-1"
                    >
                      ביטול
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* AI Button - Always visible but enhanced */}
                <button
                  onClick={handleAiSearch}
                  disabled={isAiLoading || query.length < 2}
                  className={`
                            p-3.5 rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                            ${isAiLoading
                      ? 'text-theme-secondary'
                      : 'text-theme-primary active:scale-95'
                    }
                        `}
                  style={{
                    background: isAiLoading
                      ? 'rgba(255, 255, 255, 0.06)'
                      : 'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                    boxShadow: isAiLoading ? 'none' : '0 2px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <SparklesIcon className={`h-5 w-5 ${isAiLoading ? 'animate-spin-gentle' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters - Horizontal Scroll */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 pt-4 -mx-4 px-4 scrollbar-none mask-fade-sides no-scrollbar" style={{ maskImage: 'linear-gradient(to right, transparent, black 16px, black 90%, transparent)' }}>
            <button
              onClick={handleOpenFilterPanel}
              className={`p-2.5 rounded-full border transition-all duration-300 shrink-0 ${
                filters.type !== 'all' || filters.status !== 'all'
                  ? 'bg-[var(--color-accent-cyan)]/20 border-[var(--color-accent-cyan)]/50 text-[var(--color-accent-cyan)]'
                  : 'bg-[var(--surface-hover)] border-white/10 text-theme-secondary hover:text-theme-primary'
              }`}
            >
              <FilterIcon className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-8 bg-[var(--gray-100)] shrink-0 my-auto mx-1" />
            {categories.map(cat => (
              <SearchCategoryPill
                key={cat.id}
                label={cat.label}
                isActive={filters.type === cat.id}
                onClick={categoryClickHandlers.get(cat.id)!}
                icon={cat.icon ? <span>{cat.icon}</span> : undefined}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Loading State - Premium AI Processing */}
            {isAiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-20 h-20">
                  {/* Orbiting dots */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: `var(--dynamic-accent-start)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: -6,
                        marginTop: -6,
                      }}
                      animate={{
                        x: [
                          Math.cos((i * 120) * Math.PI / 180) * 28,
                          Math.cos((i * 120 + 120) * Math.PI / 180) * 28,
                          Math.cos((i * 120 + 240) * Math.PI / 180) * 28,
                          Math.cos((i * 120 + 360) * Math.PI / 180) * 28,
                        ],
                        y: [
                          Math.sin((i * 120) * Math.PI / 180) * 28,
                          Math.sin((i * 120 + 120) * Math.PI / 180) * 28,
                          Math.sin((i * 120 + 240) * Math.PI / 180) * 28,
                          Math.sin((i * 120 + 360) * Math.PI / 180) * 28,
                        ],
                        scale: [1, 0.7, 1, 0.7, 1],
                        opacity: [1, 0.5, 1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ))}
                  {/* Center glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, var(--dynamic-accent-glow) 0%, transparent 70%)`,
                    }}
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 font-semibold text-lg tracking-wide"
                  style={{ color: 'var(--dynamic-accent-start)' }}
                >
                  AI מעבד את התוצאות...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  מנתח את הנתונים שלך
                </motion.p>
              </motion.div>
            )}

            {/* AI Answer Section */}
            {!isAiLoading && aiAnswer && (
              <motion.section
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mb-8 relative"
              >
                <div
                  className="relative overflow-hidden rounded-[22px] p-6"
                  style={{
                    background: 'var(--gray-50, rgba(255, 255, 255, 0.06))',
                    border: '0.5px solid var(--border-subtle, rgba(255, 255, 255, 0.12))',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Subtle accent gradient top border */}
                  <div
                    className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent, var(--dynamic-accent-start), transparent)',
                      opacity: 0.3,
                    }}
                  />
                  <h2
                    className="text-[10px] font-bold uppercase tracking-[0.12em] mb-4 flex items-center gap-2 relative z-10"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <SparklesIcon className="w-3.5 h-3.5" style={{ color: 'var(--dynamic-accent-start)' }} /> AI Summary
                  </h2>
                  <div className="prose max-w-none prose-p:leading-relaxed prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-a:text-[var(--dynamic-accent-start)] relative z-10" style={{ color: 'var(--text-secondary)' }}>
                    <MarkdownRenderer content={aiAnswer} />
                  </div>
                </div>
              </motion.section>
            )}

            {/* Search Results */}
            {!isAiLoading && debouncedQuery.length > 1 && displayedResults.length > 0 && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between px-2 mb-3"
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold"
                      style={{ background: 'var(--dynamic-accent-color)', color: 'var(--dynamic-accent-start)' }}
                    >
                      {displayedResults.length}
                    </span>
                    תוצאות נמצאו
                  </h3>
                </motion.div>
                {displayedResults.map((result, index) => (
                  <motion.div
                    key={`${result.id}-${index}`}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                      delay: Math.min(index * 0.04, 0.3),
                    }}
                  >
                    <SearchResultItem
                      result={result}
                      query={debouncedQuery}
                      index={index}
                      onSelectItem={handleSelectSearchResult}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State / No Results */}
            {!isAiLoading && debouncedQuery.length > 1 && displayedResults.length === 0 && !aiAnswer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-[var(--gray-50)] flex items-center justify-center mb-6 ring-1 ring-[var(--border-subtle)] shadow-2xl backdrop-blur-sm">
                  <SearchIcon className="w-10 h-10 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl font-bold text-theme-primary mb-2">לא נמצאו תוצאות</h3>
                <p className="text-[var(--text-muted)] max-w-xs mx-auto">נסה לחפש משהו אחר או שנה את מונחי החיפוש.</p>
              </motion.div>
            )}

            {/* Initial State / Recent Searches */}
            {!isAiLoading && !debouncedQuery && !aiAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10 pt-4"
              >
                {/* Recent Searches Header */}
                {recentSearches.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between px-2 mb-5">
                      <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] flex items-center gap-2">
                        <ClockIcon className="w-3.5 h-3.5" /> אחרונים
                      </h3>
                      <button
                        onClick={handleClearHistory}
                        className="text-xs font-medium text-[var(--color-accent-cyan)] hover:text-[var(--text-primary)] transition-colors bg-[var(--color-accent-cyan)]/10 px-3 py-1 rounded-full hover:bg-[var(--color-accent-cyan)]/20"
                      >
                        נקה הכל
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {recentSearches.map(term => (
                        <SearchRecentItem
                          key={term}
                          query={term}
                          onSelect={handleRecentSearchSelect}
                          onRemove={handleRemoveRecent}
                        />
                      ))}
                    </div>
                  </section>
                )}

                <PremiumEmptySearch
                  onSuggestionClick={handleSuggestionClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Personal Item Detail Modal */}
      {selectedPersonalItem && (
        <PersonalItemDetailModal
          item={selectedPersonalItem}
          onClose={() => setSelectedPersonalItem(null)}
          onUpdate={handleUpdatePersonalItem}
          onDelete={handleDeletePersonalItem}
        />
      )}

      {/* Feed Item Detail Sheet */}
      <FeedItemDetailSheet
        item={selectedFeedItem}
        onClose={() => setSelectedFeedItem(null)}
        onUpdate={handleUpdateFeedItem}
        isSummarizing={false}
      />
    </div>
  );
}
