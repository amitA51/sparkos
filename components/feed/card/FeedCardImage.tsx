import React, { useState } from 'react';

interface FeedCardImageProps {
    src: string;
    sourceText: string;
    priority?: boolean;
    onError: () => void;
}

export const FeedCardImage: React.FC<FeedCardImageProps> = ({
    src,
    sourceText,
    priority = false,
    onError,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative h-56 w-full overflow-hidden rounded-t-[28px]">
            {/* Shimmer skeleton loading */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-[rgba(18,18,24,0.9)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"
                        style={{ backgroundSize: '200% 100%' }} />
                </div>
            )}
            <img
                src={src}
                alt=""
                className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                onLoad={() => setIsLoaded(true)}
                onError={onError}
                loading={priority ? 'eager' : 'lazy'}
            />
            {/* Premium gradient overlay - deeper for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,18,24,0.98)] via-[rgba(18,18,24,0.2)] to-transparent" />

            {/* Source badge on image */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl surface-elevated text-[11px] font-semibold text-theme-primary border border-white/[0.1] tracking-wide uppercase shadow-lg">
                    {sourceText}
                </span>
            </div>

            {/* Shimmer keyframes */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};
