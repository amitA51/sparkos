import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, PinIcon } from '../icons';

interface SpaceDisplayData {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount?: number;
  description?: string;
  isPinned?: boolean;
  tags?: string[];
  items?: unknown[];
}

interface PremiumSpaceCardProps {
  space: SpaceDisplayData;
  onOpen: () => void;
  index?: number;
  viewMode?: 'grid' | 'list';
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
  onTogglePin?: (e: React.MouseEvent) => void;
}

const PremiumSpaceCard: React.FC<PremiumSpaceCardProps> = ({
  space,
  onOpen,
  index = 0,
  viewMode = 'grid',
  isDragging = false,
  onDragStart,
  onDragOver,
  onDrop,
  onTogglePin,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemCount = space.itemCount ?? space.items?.length ?? 0;
  const tags = space.tags?.slice(0, 2) || [];

  if (viewMode === 'list') {
    return (
      <motion.div
        onClick={onOpen}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        draggable={!!onDragStart}
        onDragStart={onDragStart}
        onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
        onDrop={onDrop}
        className="spark-card-subtle spark-card-interactive flex items-center gap-4 p-4 cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isDragging ? 0.3 : 1,
          y: 0,
          scale: isDragging ? 0.95 : 1,
        }}
        transition={{ delay: index * 0.03 }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            background: `${space.color}15`,
            border: `1px solid ${space.color}25`,
          }}
        >
          {space.icon}
        </div>

        <div className="flex-1 min-w-0 text-right">
          <h3 className="font-semibold text-white truncate text-[15px]">{space.name}</h3>
          {space.description && (
            <p className="text-xs text-theme-muted truncate mt-0.5">{space.description}</p>
          )}
        </div>

        <span className="text-xs font-mono text-theme-muted shrink-0">{itemCount}</span>

        {onTogglePin && (
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(e); }}
            className={`p-1.5 rounded-lg transition-all ${space.isPinned ? 'text-amber-400' : 'text-theme-disabled hover:text-theme-muted'}`}
          >
            <PinIcon className="w-3.5 h-3.5" />
          </button>
        )}

        <ChevronRightIcon className="w-4 h-4 text-theme-disabled rotate-180 shrink-0" />
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onOpen}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
      onDrop={onDrop}
      className="spark-card spark-card-interactive cursor-pointer group"
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: isDragging ? 0.3 : 1,
        y: 0,
        scale: isDragging ? 0.95 : 1,
      }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        className="h-1.5 rounded-full mx-4 mt-4 transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${space.color}, ${space.color}80)`,
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      <div className="p-4 pt-3 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{
              background: `${space.color}12`,
              border: `1px solid ${space.color}20`,
            }}
          >
            {space.icon}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <h3 className="font-bold text-white text-[15px] truncate">{space.name}</h3>
            {space.description && (
              <p className="text-xs text-theme-muted truncate mt-0.5">{space.description}</p>
            )}
          </div>

          {onTogglePin && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(e); }}
              className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${space.isPinned ? '!opacity-100 text-amber-400' : 'text-theme-disabled hover:text-theme-muted'}`}
            >
              <PinIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium truncate max-w-[80px]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium shrink-0"
            style={{
              background: `${space.color}10`,
              color: `${space.color}90`,
            }}
          >
            {itemCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumSpaceCard;