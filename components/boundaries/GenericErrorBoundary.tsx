// GenericErrorBoundary - Configurable error boundary factory
// Reduces code duplication across all error boundary components

import { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// TYPES
// ============================================================

export interface ErrorBoundaryConfig {
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
    accentColor?: string;
    showDetails?: boolean;
    onReset?: () => void;
    onGoBack?: () => void;
}

interface Props extends ErrorBoundaryConfig {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

// ============================================================
// DEFAULT CONFIG
// ============================================================

const defaultConfig: Required<Omit<ErrorBoundaryConfig, 'onReset' | 'onGoBack'>> = {
    title: 'משהו השתבש',
    subtitle: 'נתקלנו בבעיה בלתי צפויה. אנא נסה שוב.',
    icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    accentColor: '#FF453A',
    showDetails: true,
};

// ============================================================
// ERROR BOUNDARY COMPONENT
// ============================================================

class GenericErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
        this.setState({ errorInfo });
    }

    handleRetry = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleReset = (): void => {
        this.handleRetry();
        this.props.onReset?.();
    };

    handleGoBack = (): void => {
        if (this.props.onGoBack) {
            this.props.onGoBack();
        } else {
            window.history.back();
        }
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const config = {
                ...defaultConfig,
                ...this.props,
            };

            return (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center p-6 z-50"
                    >
                        {/* Error Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                            style={{ 
                                backgroundColor: `${config.accentColor}20`,
                                color: config.accentColor,
                            }}
                        >
                            {config.icon}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-bold text-white mb-2 text-center"
                        >
                            {config.title}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/60 text-center mb-8 max-w-sm"
                        >
                            {config.subtitle}
                        </motion.p>

                        {/* Error Details */}
                        {config.showDetails && this.state.error && (
                            <motion.details
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="w-full max-w-md mb-6"
                            >
                                <summary className="text-white/40 text-sm cursor-pointer hover:text-white/60 transition-colors">
                                    פרטי השגיאה (למפתחים)
                                </summary>
                                <div className="mt-2 p-3 bg-[#1C1C1E] rounded-xl border border-white/10 overflow-auto max-h-32">
                                    <code className="text-xs font-mono whitespace-pre-wrap" style={{ color: config.accentColor }}>
                                        {this.state.error.message}
                                    </code>
                                </div>
                            </motion.details>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col gap-3 w-full max-w-xs"
                        >
                            {/* Try Again */}
                            <button
                                onClick={this.handleRetry}
                                className="w-full py-4 rounded-2xl font-bold text-base active:scale-[0.98] transition-transform"
                                style={{
                                    backgroundColor: config.accentColor,
                                    color: '#000',
                                    boxShadow: `0 4px 20px ${config.accentColor}30`,
                                }}
                            >
                                נסה שוב
                            </button>

                            {/* Reset if handler provided */}
                            {this.props.onReset && (
                                <button
                                    onClick={this.handleReset}
                                    className="w-full py-4 rounded-2xl bg-[#2C2C2E] text-white/80 font-semibold text-base border border-white/10 hover:bg-[#3A3A3C] active:scale-[0.98] transition-all"
                                >
                                    אפס ונסה מחדש
                                </button>
                            )}

                            {/* Go Back */}
                            <button
                                onClick={this.handleGoBack}
                                className="w-full py-3 rounded-xl text-white/50 font-medium text-sm hover:text-white/70 active:scale-[0.98] transition-all"
                            >
                                חזור למסך הקודם
                            </button>
                        </motion.div>

                        {/* Recovery Info */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/30 text-xs text-center mt-8 max-w-sm"
                        >
                            אם הבעיה חוזרת, נסה לרענן את הדף או לפנות לתמיכה.
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            );
        }

        return this.props.children;
    }
}

// ============================================================
// FACTORY FUNCTION
// ============================================================

/**
 * Creates a pre-configured error boundary component
 * 
 * @example
 * const HomeErrorBoundary = createErrorBoundary({
 *   title: 'שגיאה במסך הבית',
 *   accentColor: '#0A84FF',
 * });
 */
export function createErrorBoundary(config: ErrorBoundaryConfig) {
    return function ConfiguredErrorBoundary({ children }: { children: ReactNode }) {
        return (
            <GenericErrorBoundary {...config}>
                {children}
            </GenericErrorBoundary>
        );
    };
}

// ============================================================
// PRE-CONFIGURED BOUNDARIES
// ============================================================

export const HomeErrorBoundary = createErrorBoundary({
    title: 'שגיאה במסך הבית',
    subtitle: 'המסך הראשי נתקל בבעיה. הנתונים שלך בטוחים.',
    accentColor: '#0A84FF',
});

export const LibraryErrorBoundary = createErrorBoundary({
    title: 'שגיאה בספרייה',
    subtitle: 'הספרייה נתקלה בבעיה. הפריטים שלך שמורים.',
    accentColor: '#34D399',
});

export const FeedErrorBoundary = createErrorBoundary({
    title: 'שגיאה בפיד',
    subtitle: 'הפיד נתקל בבעיה. נסה לרענן.',
    accentColor: '#FBBF24',
});

export const CalendarErrorBoundary = createErrorBoundary({
    title: 'שגיאה ביומן',
    subtitle: 'היומן נתקל בבעיה. האירועים שלך שמורים.',
    accentColor: '#F472B6',
});

export const AddScreenErrorBoundary = createErrorBoundary({
    title: 'שגיאה ביצירת פריט',
    subtitle: 'לא הצלחנו ליצור את הפריט. נסה שוב.',
    accentColor: '#A78BFA',
});

export const SettingsErrorBoundary = createErrorBoundary({
    title: 'שגיאה בהגדרות',
    subtitle: 'ההגדרות נתקלו בבעיה.',
    accentColor: '#64748B',
});

export const WorkoutErrorBoundary = createErrorBoundary({
    title: 'שגיאה באימון',
    subtitle: 'האימון נתקל בבעיה. הנתונים נשמרו בגיבוי.',
    accentColor: '#a3e635',
});

export default GenericErrorBoundary;
