import React from 'react';
import { CheckCircleIcon, BookmarkIcon } from '../../icons';

interface FeedCardOverlaysProps {
    swipeOffset: number;
}

export const FeedCardOverlays: React.FC<FeedCardOverlaysProps> = ({
    swipeOffset,
}) => {
    return (
        <>
            {/* Swipe Indicators - Premium styling */}
            <div className={`absolute inset-0 flex items-center justify-start pl-6 transition-all duration-300 bg-emerald-500/10 text-emerald-400 rounded-[28px] ${swipeOffset > 30 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center backdrop-blur-sm">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide">נקרא</span>
                </div>
            </div>
            <div className={`absolute inset-0 flex items-center justify-end pr-6 transition-all duration-300 bg-amber-500/10 text-amber-400 rounded-[28px] ${swipeOffset < -30 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tracking-wide">שמירה</span>
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center backdrop-blur-sm">
                        <BookmarkIcon className="w-6 h-6" />
                    </div>
                </div>
            </div>

        </>
    );
};
