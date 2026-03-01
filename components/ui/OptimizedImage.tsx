import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Source URL of the image */
    src: string;
    /** Alt text for accessibility */
    alt: string;
    /** Placeholder to show while loading (blur, skeleton, or color) */
    placeholder?: 'blur' | 'skeleton' | 'color' | 'none';
    /** Background color for color placeholder */
    placeholderColor?: string;
    /** Enable lazy loading with IntersectionObserver */
    lazy?: boolean;
    /** Root margin for lazy loading trigger */
    rootMargin?: string;
    /** Blur amount for blur placeholder (in px) */
    blurAmount?: number;
    /** Callback when image loads successfully */
    onLoad?: () => void;
    /** Callback when image fails to load */
    onError?: () => void;
    /** Custom className */
    className?: string;
    /** Wrapper className */
    wrapperClassName?: string;
}

/**
 * OptimizedImage - Performance-optimized image component
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Placeholder states (blur, skeleton, color)
 * - Fade-in animation on load
 * - Native loading="lazy" fallback
 * - Proper aspect ratio handling
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    placeholder = 'skeleton',
    placeholderColor = 'rgba(255,255,255,0.05)',
    lazy = true,
    rootMargin = '200px',
    blurAmount = 10,
    onLoad,
    onError,
    className = '',
    wrapperClassName = '',
    ...imgProps
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver for lazy loading
    useEffect(() => {
        if (!lazy || !containerRef.current) {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [lazy, rootMargin]);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
        onError?.();
    }, [onError]);

    // Placeholder styles
    const getPlaceholderStyles = (): React.CSSProperties => {
        switch (placeholder) {
            case 'blur':
                return {
                    filter: isLoaded ? 'blur(0)' : `blur(${blurAmount}px)`,
                    transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
                };
            case 'skeleton':
                return {};
            case 'color':
                return { backgroundColor: placeholderColor };
            default:
                return {};
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${wrapperClassName}`}
            style={{ minHeight: isLoaded ? undefined : '100px' }}
        >
            {/* Skeleton placeholder */}
            {placeholder === 'skeleton' && !isLoaded && !hasError && (
                <div
                    className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-white/[0.015] animate-pulse"
                    style={{ borderRadius: 'inherit' }}
                >
                    <div
                        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                        style={{ animationDuration: '2s' }}
                    />
                </div>
            )}

            {/* Color placeholder */}
            {placeholder === 'color' && !isLoaded && !hasError && (
                <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                        backgroundColor: placeholderColor,
                        opacity: isLoaded ? 0 : 1,
                        borderRadius: 'inherit',
                    }}
                />
            )}

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-white/30">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}

            {/* Actual image */}
            {isInView && !hasError && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={lazy ? 'lazy' : undefined}
                    decoding="async"
                    className={`
            transition-all duration-500 ease-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
                    style={{
                        ...getPlaceholderStyles(),
                        ...imgProps.style,
                    }}
                    {...imgProps}
                />
            )}
        </div>
    );
};

export default memo(OptimizedImage);

// ============================================
// Image Preloader Utility
// ============================================

/**
 * Preload an image in the background
 */
export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Preload multiple images with optional concurrency limit
 */
export async function preloadImages(
    srcs: string[],
    concurrency: number = 3
): Promise<PromiseSettledResult<void>[]> {
    const results: PromiseSettledResult<void>[] = [];

    for (let i = 0; i < srcs.length; i += concurrency) {
        const batch = srcs.slice(i, i + concurrency);
        const batchResults = await Promise.allSettled(batch.map(preloadImage));
        results.push(...batchResults);
    }

    return results;
}
