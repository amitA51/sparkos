/**
 * InsightCard
 *
 * Shared wrapper for all insight dashboard cards.
 * Glassmorphism card with consistent padding, border, and animation.
 */
import React from 'react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  icon,
  children,
  className = '',
  headerRight,
}) => {
  return (
    <motion.div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border-subtle)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{
                background: 'var(--gray-100)',
                border: '0.5px solid var(--border-subtle)',
              }}
            >
              {icon}
            </div>
          )}
          <h3
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
        </div>
        {headerRight && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {headerRight}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="px-5 pb-5">
        {children}
      </div>
    </motion.div>
  );
};

export default React.memo(InsightCard);
