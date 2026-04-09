import React from 'react';
import { ClockIcon } from '../../icons';
import { getTagColor } from '../../icons';
import SmartText from '../../SmartText';
import { FeedItem } from '../../../types';
import { FeedCardActions } from './FeedCardActions';

interface FeedCardContentProps {
    item: FeedItem;
    sourceText: string;
    timeAgo: string;
    readingTime: number;
    showImage: boolean;
    TypeIcon: React.ElementType;
    faviconUrl: string | null;
    contentSnippet: string;
}

export const FeedCardContent: React.FC<FeedCardContentProps> = ({
    item,
    sourceText,
    timeAgo,
    readingTime,
    showImage,
    TypeIcon,
    faviconUrl,
    contentSnippet,
}) => {
    return (
        <div className="p-6">
            {/* Header Meta - only when no image */}
            {!showImage && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        {faviconUrl ? (
                            <img src={faviconUrl} alt="" className="w-5 h-5 rounded-full favicon-ring" loading="lazy" />
                        ) : (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center feed-meta-icon-bg">
                                <TypeIcon className="w-3 h-3 text-muted" />
                            </div>
                        )}
                        <span className="text-xs font-medium tracking-wide feed-meta">{sourceText}</span>
                        <span className="w-1 h-1 rounded-full bg-border-subtle" />
                        <span className="text-xs feed-meta">{timeAgo}</span>
                    </div>
                    {item.type === 'rss' && (
                        <div className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-xl feed-reading-badge">
                            <ClockIcon className="w-3 h-3" />
                            <span>{readingTime} דק'</span>
                        </div>
                    )}
                </div>
            )}

            {/* Title with unread indicator */}
            <div className="flex items-start gap-2.5 mb-4">
                {!item.is_read && (
                    <span className="mt-2.5 shrink-0 w-2 h-2 rounded-full bg-[var(--dynamic-accent-start)] shadow-[0_0_10px_var(--dynamic-accent-glow)] animate-pulse" />
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {(() => {
                            const age = Date.now() - new Date(item.createdAt).getTime();
                            const isNew = age < 60 * 60 * 1000;
                            if (isNew && !item.is_read) {
                                return (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest bg-gradient-to-r from-[var(--dynamic-accent-start)]/20 to-[var(--dynamic-accent-end)]/15 text-[var(--dynamic-accent-start)] border border-[var(--dynamic-accent-start)]/30">
                                        חדש
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>
                    <h3 className="text-[20px] font-bold leading-tight tracking-[-0.02em]" style={{ color: item.is_read ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {item.title}
                    </h3>
                </div>
            </div>

            {/* Content Snippet - With SmartText for auto-link detection */}
            {contentSnippet && (
                <div className="text-[15px] line-clamp-3 leading-[1.65] mb-6" style={{ color: 'var(--text-secondary)' }}>
                    <SmartText
                        text={contentSnippet.substring(0, 260) + (contentSnippet.length > 260 ? '...' : '')}
                        className="text-[15px]"
                    />
                </div>
            )}

            {/* Premium URL Button */}
            {item.link && (
                <FeedCardActions link={item.link} />
            )}

            {/* Footer: Tags */}
            {item.tags?.length > 0 && (
                <div className="pt-4 flex items-center gap-2 flex-wrap feed-divider">
                    {item.tags.slice(0, 3).map(tag => {
                        const colors = getTagColor(tag.name);
                        return (
                            <span
                                key={tag.id}
                                className="text-[10px] px-2.5 py-1 rounded-lg font-semibold tracking-wider uppercase"
                                style={{
                                    backgroundColor: `${colors.backgroundColor}60`,
                                    color: colors.textColor,
                                    border: `1px solid ${colors.backgroundColor}40`,
                                    boxShadow: `0 0 8px ${colors.backgroundColor}15`
                                }}
                            >
                                #{tag.name}
                            </span>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
