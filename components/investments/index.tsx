/**
 * Investment Components
 * 
 * Re-exports all investment-related components for easy importing.
 */

// Legacy components (kept for backwards compatibility)
export {
    AnimatedCounter,
    TickerTapeItem,
    TickerTape,
    MiniChart,
    MarketStatusBadge,
    AssetCard,
    NewsCard,
    MacroItem,
    QuickAddChip,
    SkeletonCard,
    SectionHeader,
} from './InvestmentComponents';

// Premium components (new Apple-style design)
export { PremiumAssetCard } from './PremiumAssetCard';
export {
    PremiumSegmentControl,
    PremiumSortDropdown,
    type FilterOption,
    type SortOption
} from './PremiumSegmentControl';
export { PremiumPortfolioSummary } from './PremiumPortfolioSummary';
export { PremiumTickerTape } from './PremiumTickerTape';
export {
    PremiumHeroSection,
    PremiumMarketStatus,
    PremiumSearchInput,
    PremiumQuickAddChip
} from './PremiumHeroSection';
