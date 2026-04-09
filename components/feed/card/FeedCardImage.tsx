import React, { useState } from 'react';

interface FeedCardImageProps {
    src: string;
    sourceText: string;
    priority?: boolean;
    onError: () => void;
}

// PERF: Hoist shimmer keyframes to module level so they are injected once,
// not re-created as a new <style> DOM node on every FeedCardImage render.
let shimmerInjected = false;
if (typeof document !== 'undefined' && !shimmerInjected) {
    const style = document.createElement('style');
    style.textContent = `@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
    document.head.appendChild(style);
    shimmerInjected = true;
}

export const FeedCardImage: React.FC<FeedCardImageProps> = React.memo(({
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
                <div className="absolute inset-0" style={{ background: 'var(--gray-100)' }}>
                    <div className="absolute inset-0 animate-[shimmer_1.5s_ease-in-out_infinite]"
                        style={{ backgroundSize: '200% 100%', background: 'linear-gradient(90deg, transparent, var(--gray-200), transparent)' }} />
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
                decoding="async"
            />
            {/* Premium gradient overlay - deeper for text readability */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-card) 0%, color-mix(in srgb, var(--bg-card) 20%, transparent) 50%, transparent 100%)' }} />

            {/* Source badge on image */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase shadow-lg" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '0.5px solid var(--border-subtle)' }}>
                    {sourceText}
                </span>
            </div>
        </div>
    );
});
