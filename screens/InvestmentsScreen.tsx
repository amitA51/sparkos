/**
 * ═══════════════════════════════════════════════════════════════
 * INVESTMENTS SCREEN - PREMIUM EDITION
 * Apple-Style $100M Investment Dashboard
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FinancialAsset } from '../types';
import type { Screen } from '../types';
import * as dataService from '../services/dataService';
import * as financialsService from '../services/financialsService';
import {
  ChartBarIcon,
  FlameIcon,
  FeedIcon,
  SparklesIcon,
} from '../components/icons';
import StatusMessage, { StatusMessageType } from '../components/StatusMessage';
import AssetDetailModal from '../components/AssetDetailModal';

// Premium Components
import {
  PremiumAssetCard,
  PremiumSegmentControl,
  PremiumSortDropdown,
  PremiumPortfolioSummary,
  PremiumTickerTape,
  PremiumHeroSection,
  PremiumQuickAddChip,
  NewsCard,
  MacroItem,
  type FilterOption,
  type SortOption,
} from '../components/investments';


// ============================================================================
// CONSTANTS
// ============================================================================

const REFRESH_INTERVAL_MS = 30000;
const CACHE_KEY = 'investments_cached_data';
const SORT_KEY = 'investments_sort_preference';
const FILTER_KEY = 'investments_filter_preference';

const CRYPTO_TICKERS = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI', 'LTC', 'ATOM', 'SHIB', 'APT', 'ARB', 'OP', 'NEAR'];

const FAMOUS_STOCKS = [
  { ticker: 'AAPL', name: 'Apple', emoji: '🍎', type: 'stock' },
  { ticker: 'MSFT', name: 'Microsoft', emoji: '💻', type: 'stock' },
  { ticker: 'TSLA', name: 'Tesla', emoji: '⚡', type: 'stock' },
  { ticker: 'NVDA', name: 'NVIDIA', emoji: '🎮', type: 'stock' },
  { ticker: 'BTC', name: 'Bitcoin', emoji: '₿', type: 'crypto' },
  { ticker: 'ETH', name: 'Ethereum', emoji: '💎', type: 'crypto' },
  { ticker: 'GOOGL', name: 'Google', emoji: '🔍', type: 'stock' },
  { ticker: 'AMZN', name: 'Amazon', emoji: '📦', type: 'stock' },
  { ticker: 'SOL', name: 'Solana', emoji: '☀️', type: 'crypto' },
  { ticker: 'META', name: 'Meta', emoji: '👓', type: 'stock' },
];

// ============================================================================
// HELPERS
// ============================================================================

const isUSMarketOpen = (): boolean => {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = nyTime.getDay();
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  if (day === 0 || day === 6) return false;
  if (timeInMinutes < 9 * 60 + 30) return false;
  if (timeInMinutes >= 16 * 60) return false;
  return true;
};

const getCachedData = (): { watchlist: FinancialAsset[]; timestamp: number } | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
};

const setCachedData = (watchlist: FinancialAsset[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ watchlist, timestamp: Date.now() }));
  } catch { /* ignore */ }
};

const getSavedSort = (): SortOption => {
  try { return (localStorage.getItem(SORT_KEY) as SortOption) || 'default'; } catch { return 'default'; }
};

const getSavedFilter = (): FilterOption => {
  try { return (localStorage.getItem(FILTER_KEY) as FilterOption) || 'all'; } catch { return 'all'; }
};

// ============================================================================
// SECTION HEADER
// ============================================================================

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-3 mt-6 px-1">
    <div className="flex items-center gap-3">
      <div
        className="p-2.5 rounded-xl backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-[10px] text-white/40 font-medium">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

// ============================================================================
// SHIMMER LOADING CARD
// ============================================================================

const ShimmerCard: React.FC = () => (
  <div
    className="rounded-[20px] p-4 backdrop-blur-xl inv-shimmer"
    style={{
      background: 'var(--inv-card-gradient)',
      border: '1px solid var(--inv-border-subtle)',
      height: '120px'
    }}
  >
    <div className="flex justify-between mb-3">
      <div>
        <div className="h-5 w-14 bg-white/10 rounded mb-2" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
      <div className="text-left">
        <div className="h-5 w-16 bg-white/10 rounded mb-2" />
        <div className="h-3 w-10 bg-white/5 rounded" />
      </div>
    </div>
    <div className="h-10 w-full bg-white/5 rounded-lg mt-4" />
  </div>
);

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  filter: FilterOption;
  hasAnyAssets: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter, hasAnyAssets }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12 rounded-3xl backdrop-blur-xl"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      border: '1px dashed rgba(255,255,255,0.1)'
    }}
  >
    <ChartBarIcon className="w-10 h-10 text-white/15 mx-auto mb-3" />
    <p className="text-white/40 text-sm font-medium">
      {hasAnyAssets
        ? `אין ${filter === 'crypto' ? 'קריפטו' : 'מניות'} ברשימה`
        : 'הרשימה ריקה'
      }
    </p>
    <p className="text-white/25 text-xs mt-1">הוסף נכסים מהכפתורים למעלה</p>
  </motion.div>
);

// ============================================================================
// MAIN SCREEN
// ============================================================================

interface InvestmentsScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const InvestmentsScreen: React.FC<InvestmentsScreenProps> = ({ setActiveScreen }) => {
  // State
  const [watchlist, setWatchlist] = useState<FinancialAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [newTicker, setNewTicker] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<FinancialAsset | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: StatusMessageType; text: string; id: number } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [marketOpen, setMarketOpen] = useState(isUSMarketOpen());

  // Filter & Sort
  const [filter, setFilter] = useState<FilterOption>(getSavedFilter());
  const [sort, setSort] = useState<SortOption>(getSavedSort());

  // Market data
  const [topMovers, setTopMovers] = useState<financialsService.TopMoversData | null>(null);
  const [news, setNews] = useState<financialsService.NewsItem[]>([]);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Persist filter & sort
  useEffect(() => { localStorage.setItem(FILTER_KEY, filter); }, [filter]);
  useEffect(() => { localStorage.setItem(SORT_KEY, sort); }, [sort]);

  const showStatus = useCallback((type: StatusMessageType, text: string) => {
    if (type === 'error' && window.navigator.vibrate) window.navigator.vibrate(100);
    if (type === 'success' && window.navigator.vibrate) window.navigator.vibrate([50]);
    setStatusMessage({ type, text, id: Date.now() });
  }, []);

  // Filtered & sorted watchlist
  const displayedWatchlist = useMemo(() => {
    let result = [...watchlist];

    // Filter
    if (filter === 'crypto') {
      result = result.filter(a => CRYPTO_TICKERS.includes(a.ticker));
    } else if (filter === 'stocks') {
      result = result.filter(a => !CRYPTO_TICKERS.includes(a.ticker));
    }

    // Sort
    switch (sort) {
      case 'change_desc':
        result.sort((a, b) => (b.change24h || 0) - (a.change24h || 0));
        break;
      case 'change_asc':
        result.sort((a, b) => (a.change24h || 0) - (b.change24h || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [watchlist, filter, sort]);

  // Load data
  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);

    try {
      const cached = getCachedData();
      if (cached && cached.watchlist.length > 0) {
        setWatchlist(cached.watchlist);
        setLastUpdated(cached.timestamp);
        setIsLoading(false);
      }

      const currentWatchlist = await dataService.getWatchlist();
      if (currentWatchlist.length === 0) {
        setWatchlist([]);
        setIsLoading(false);
        return;
      }

      const data = await financialsService.fetchWatchlistData(currentWatchlist);
      setWatchlist(data);
      setLastUpdated(Date.now());
      setCachedData(data);

    } catch (error) {
      console.error('Failed to load watchlist:', error);
      if (isInitialMount.current) {
        showStatus('error', 'שגיאה בטעינת נתונים');
      }
    } finally {
      setIsLoading(false);
      isInitialMount.current = false;
    }
  }, [showStatus]);

  const loadMarketData = useCallback(async () => {
    try {
      const [movers, fetchedNews] = await Promise.all([
        financialsService.fetchTopMovers(),
        financialsService.fetchNewsForTicker('MARKET', 'stock').catch(() => []),
      ]);
      setTopMovers(movers);
      setNews(fetchedNews.slice(0, 3));
    } catch { /* silent */ }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (window.navigator.vibrate) window.navigator.vibrate(20);
    await Promise.all([loadData(false), loadMarketData()]);
    setIsRefreshing(false);
    showStatus('success', 'הנתונים עודכנו!');
  }, [loadData, loadMarketData, showStatus]);

  useEffect(() => {
    loadData();
    loadMarketData();

    const marketInterval = setInterval(() => {
      setMarketOpen(isUSMarketOpen());
    }, 60000);

    refreshIntervalRef.current = setInterval(() => {
      loadData(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(marketInterval);
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [loadData, loadMarketData]);

  const handleAdd = useCallback(async (ticker: string) => {
    if (!ticker || isAdding) return;

    const tickerUpper = ticker.toUpperCase();

    if (watchlist.some(a => a.ticker === tickerUpper)) {
      showStatus('info', `${tickerUpper} כבר ברשימה`);
      return;
    }

    setIsAdding(tickerUpper);
    if (window.navigator.vibrate) window.navigator.vibrate(15);

    try {
      const newWatchlistItem = await dataService.addToWatchlist(tickerUpper);
      const newData = await financialsService.fetchWatchlistData([newWatchlistItem]);

      if (newData?.length > 0) {
        setWatchlist(prev => {
          const updated = [newData[0] as FinancialAsset, ...prev];
          setCachedData(updated);
          return updated;
        });
        setNewTicker('');
        showStatus('success', `${tickerUpper} נוסף!`);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'שגיאה';
      showStatus('error', message);
    } finally {
      setIsAdding(null);
    }
  }, [isAdding, watchlist, showStatus]);

  const handleRemove = useCallback(async (ticker: string) => {
    if (window.navigator.vibrate) window.navigator.vibrate([20, 50, 20]);

    setWatchlist(prev => {
      const updated = prev.filter(a => a.ticker !== ticker);
      setCachedData(updated);
      return updated;
    });

    await dataService.removeFromWatchlist(ticker);
    showStatus('info', `${ticker} הוסר`);
  }, [showStatus]);

  const handleAssetClick = useCallback((asset: FinancialAsset) => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    setSelectedAsset(asset);
  }, []);

  // Top movers for ticker tape
  const marqueeItems = useMemo(() => {
    if (!topMovers) return [];
    const allMovers = [...topMovers.gainers, ...topMovers.losers, ...topMovers.mostActive];
    return Array.from(new Map(allMovers.map(item => [item.ticker, item])).values());
  }, [topMovers]);

  return (
    <div
      className="min-h-screen pb-32 -mx-4"
      style={{ background: 'var(--inv-surface-base)' }}
    >
      {/* Premium Ticker Tape */}
      {marqueeItems.length > 0 && (
        <div className="sticky top-0 z-30">
          <PremiumTickerTape items={marqueeItems} />
        </div>
      )}

      <div className="px-4 pt-4">
        {/* Premium Hero Section */}
        <PremiumHeroSection
          searchValue={newTicker}
          onSearchChange={setNewTicker}
          onSearchSubmit={handleAdd}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          marketOpen={marketOpen}
          lastUpdated={lastUpdated}
          isSearchLoading={isAdding !== null}
        />

        {/* Quick Add Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {FAMOUS_STOCKS.map(s => (
            <PremiumQuickAddChip
              key={s.ticker}
              ticker={s.ticker}
              emoji={s.emoji}
              isAdded={watchlist.some(a => a.ticker === s.ticker)}
              isLoading={isAdding === s.ticker}
              onAdd={() => handleAdd(s.ticker)}
            />
          ))}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <PremiumSegmentControl
            value={filter}
            onChange={setFilter}
          />
          <PremiumSortDropdown
            value={sort}
            onChange={setSort}
          />
        </div>

        {/* Portfolio Summary */}
        <PremiumPortfolioSummary
          watchlist={watchlist}
          filter={filter}
        />

        {/* Asset List Section */}
        <SectionHeader
          icon={<ChartBarIcon className="w-4 h-4 text-[var(--inv-accent-primary)]" />}
          title={filter === 'all' ? 'התיק שלי' : filter === 'crypto' ? 'קריפטו' : 'מניות'}
          subtitle={displayedWatchlist.length > 0 ? `${displayedWatchlist.length} נכסים` : undefined}
        />

        {/* Asset Cards */}
        <div className="space-y-3">
          {isLoading && watchlist.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => <ShimmerCard key={i} />)
          ) : displayedWatchlist.length === 0 ? (
            <EmptyState filter={filter} hasAnyAssets={watchlist.length > 0} />
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedWatchlist.map((asset, index) => (
                <PremiumAssetCard
                  key={asset.ticker}
                  asset={asset}
                  onRemove={handleRemove}
                  onClick={handleAssetClick}
                  index={index}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Top Movers Section */}
        {topMovers && topMovers.gainers.length > 0 && (
          <>
            <SectionHeader
              icon={<FlameIcon className="w-4 h-4 text-orange-400" />}
              title="תנועות בולטות"
              subtitle="Top Gainers"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {topMovers.gainers.slice(0, 5).map(m => (
                <MacroItem
                  key={m.ticker}
                  label={m.ticker}
                  value={m.price}
                  change={m.changePercent}
                  icon="📈"
                />
              ))}
            </div>
          </>
        )}

        {/* News Section */}
        {news.length > 0 && (
          <>
            <SectionHeader
              icon={<FeedIcon className="w-4 h-4 text-blue-400" />}
              title="חדשות שוק"
              subtitle="עדכונים אחרונים"
            />
            <div className="space-y-2 pb-6">
              {news.map(item => <NewsCard key={item.id} news={item} />)}
            </div>
          </>
        )}

        {/* Tips for New Users */}
        {watchlist.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.08) 100%)',
              border: '1px solid rgba(0,122,255,0.15)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-blue-300">התחל כאן!</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              לחץ על אחד מהכפתורים למעלה כדי להוסיף מניה או מטבע דיגיטלי לרשימה שלך.
              המחירים מתעדכנים אוטומטית כל 30 שניות! 🚀
            </p>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {statusMessage && (
        <StatusMessage
          key={statusMessage.id}
          type={statusMessage.type}
          message={statusMessage.text}
          onDismiss={() => setStatusMessage(null)}
        />
      )}
    </div>
  );
};

export default InvestmentsScreen;
