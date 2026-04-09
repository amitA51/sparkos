import React from 'react';
import { ExternalLinkIcon } from '../../icons';

interface FeedCardActionsProps {
    link: string;
}

export const FeedCardActions: React.FC<FeedCardActionsProps> = ({ link }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-3 w-full px-6 py-4 mb-5
        rounded-2xl text-[15px] font-bold
        transition-all duration-300 ease-out
        active:scale-[0.98]
        group cursor-pointer feed-action-button"
        >
            <ExternalLinkIcon className="w-5 h-5 transition-all duration-300 text-accent" />
            <span>פתח את הדף המלא</span>
            <span className="text-xs feed-meta">↗</span>
        </a>
    );
};
