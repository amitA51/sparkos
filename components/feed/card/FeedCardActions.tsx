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
        bg-gradient-to-r from-cyan-500/20 to-blue-500/20
        hover:from-cyan-500/30 hover:to-blue-500/30
        border border-cyan-400/30 hover:border-cyan-400/50
        rounded-2xl text-[15px] font-bold text-white/90 hover:text-white
        transition-all duration-300 ease-out
        shadow-[0_4px_20px_rgba(0,200,255,0.15)]
        hover:shadow-[0_8px_32px_rgba(0,200,255,0.25)]
        active:scale-[0.98]
        group cursor-pointer"
        >
            <ExternalLinkIcon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300" />
            <span>פתח את הדף המלא</span>
            <span className="text-xs text-white/40 group-hover:text-white/60">↗</span>
        </a>
    );
};
