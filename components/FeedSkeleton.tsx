import React from 'react';
import { SkeletonBox, SkeletonCircle } from './SkeletonLoader';

interface FeedSkeletonProps {
  count?: number;
}

const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="glass-panel p-6"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Header with avatar and metadata */}
          <div className="flex items-center gap-4 mb-4">
            <SkeletonCircle size={48} />
            <div className="flex-1 space-y-2">
              <SkeletonBox width="60%" height="20px" />
              <SkeletonBox width="40%" height="14px" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 mb-4">
            <SkeletonBox width="90%" height="24px" />
            <SkeletonBox width="75%" height="24px" />
          </div>

          {/* Content lines */}
          <div className="space-y-2 mb-6">
            <SkeletonBox width="100%" height="16px" />
            <SkeletonBox width="100%" height="16px" />
            <SkeletonBox width="80%" height="16px" />
          </div>

          {/* Image placeholder */}
          <SkeletonBox width="100%" height="200px" className="mb-6" />

          {/* Actions bar */}
          <div className="flex gap-3">
            <SkeletonBox width="80px" height="32px" borderRadius="full" />
            <SkeletonBox width="80px" height="32px" borderRadius="full" />
            <SkeletonBox width="80px" height="32px" borderRadius="full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedSkeleton;

