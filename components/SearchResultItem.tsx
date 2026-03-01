import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { UniversalSearchResult, GoogleCalendarEvent, PersonalItem } from '../types';
import {
  CheckCircleIcon,
  ClipboardListIcon,
  LinkIcon,
  BookOpenIcon,
  DumbbellIcon,
  TargetIcon,
  SparklesIcon,
  FeedIcon,
  BrainCircuitIcon,
  UserIcon,
  LightbulbIcon,
  RoadmapIcon,
  SummarizeIcon,
  GoogleCalendarIcon,
  ChevronLeftIcon,
} from './icons';

interface SearchResultItemProps {
  result: UniversalSearchResult;
  query: string;
  onSelectItem?: (item: UniversalSearchResult) => void;
  index?: number;
}

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !text) return <>{text}</>;
  const escapedQuery = escapeRegExp(query);
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="bg-[var(--color-accent-cyan)]/30 text-[var(--color-accent-cyan)] rounded-sm px-0.5 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const getTypeConfig = (type: UniversalSearchResult['type']) => {
  switch (type) {
    case 'task':
      return { icon: CheckCircleIcon, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-500/5' };
    case 'note':
      return { icon: ClipboardListIcon, color: 'text-amber-400', gradient: 'from-amber-500/20 to-amber-500/5' };
    case 'link':
      return { icon: LinkIcon, color: 'text-blue-400', gradient: 'from-blue-500/20 to-blue-500/5' };
    case 'book':
      return { icon: BookOpenIcon, color: 'text-purple-400', gradient: 'from-purple-500/20 to-purple-500/5' };
    case 'workout':
      return { icon: DumbbellIcon, color: 'text-pink-400', gradient: 'from-pink-500/20 to-pink-500/5' };
    case 'goal':
      return { icon: TargetIcon, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-cyan-500/5' };
    case 'spark':
      return { icon: SparklesIcon, color: 'text-violet-400', gradient: 'from-violet-500/20 to-violet-500/5' };
    case 'rss':
      return { icon: FeedIcon, color: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-500/5' };
    case 'mentor':
      return { icon: BrainCircuitIcon, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-indigo-500/5' };
    case 'journal':
      return { icon: UserIcon, color: 'text-rose-400', gradient: 'from-rose-500/20 to-rose-500/5' };
    case 'idea':
      return { icon: LightbulbIcon, color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-yellow-500/5' };
    case 'roadmap':
      return { icon: RoadmapIcon, color: 'text-teal-400', gradient: 'from-teal-500/20 to-teal-500/5' };
    case 'learning':
      return { icon: SummarizeIcon, color: 'text-sky-400', gradient: 'from-sky-500/20 to-sky-500/5' };
    case 'calendar':
      return { icon: GoogleCalendarIcon, color: 'text-red-400', gradient: 'from-red-500/20 to-red-500/5' };
    default:
      return { icon: SparklesIcon, color: 'text-theme-secondary', gradient: 'from-gray-500/20 to-gray-500/5' };
  }
};

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, query, onSelectItem, index = 0 }) => {
  const formattedDate = useMemo(() => {
    const d = new Date(result.date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'היום';
    if (d.toDateString() === yesterday.toDateString()) return 'אתמול';
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
  }, [result.date]);

  const handleClick = () => {
    if (result.type === 'calendar') {
      window.open((result.item as GoogleCalendarEvent).htmlLink, '_blank');
    } else if (onSelectItem) {
      onSelectItem(result);
    }
  };

  const { icon: TypeIcon, color, gradient } = getTypeConfig(result.type);
  const status = (result.item as PersonalItem)?.isCompleted ? 'completed' : 'open';
  const isCompleted = status === 'completed';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, type: "spring", bounce: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="group w-full text-right relative overflow-hidden rounded-[24px] bg-[#111] border border-white/5 p-1 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-center gap-4 p-3 pr-4">
        {/* Icon Container */}
        <div className={`shrink-0 p-3 rounded-2xl bg-white/5 ${color} ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-black/20 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
          <TypeIcon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-2">
            <h4 className={`text-[17px] font-semibold tracking-tight truncate transition-colors duration-200 ${isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-white'}`}>
              <Highlight text={result.title} query={query} />
            </h4>
            <span className="shrink-0 text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase bg-white/5 px-2 py-1 rounded-md">
              {formattedDate}
            </span>
          </div>

          <p className="text-[14px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
            <Highlight text={result.content} query={query} />
          </p>
        </div>

        {/* Chevron Arrow */}
        <div className="shrink-0 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300">
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.button>
  );
};

export default SearchResultItem;
