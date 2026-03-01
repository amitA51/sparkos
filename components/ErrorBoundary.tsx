import { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { RefreshIcon } from './icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional: Error reporting callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Feature name for scoped error handling */
  feature?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Enhanced Error Boundary with:
 * - Unique error IDs for tracking
 * - Feature-scoped error handling
 * - Recovery capabilities
 * - Error reporting callback
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log with context
    const context = {
      feature: this.props.feature || 'unknown',
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error('[ErrorBoundary] Uncaught error:', { error, errorInfo, context });

    // In production, you would send to error reporting service here
    // Example: Sentry.captureException(error, { extra: context });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback takes precedence
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isFeatureError = !!this.props.feature;

      return (
        <div
          className={`${isFeatureError ? 'p-4' : 'min-h-screen'} flex items-center justify-center bg-[var(--bg-primary)]`}
          dir="rtl"
        >
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl" role="img" aria-label="warning">⚠️</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {isFeatureError ? `שגיאה ב${this.props.feature}` : 'משהו השתבש'}
              </h2>
              <p className="text-[var(--text-secondary)]">
                {isFeatureError
                  ? 'חלק זה של האפליקציה נתקל בבעיה. שאר האפליקציה עדיין פועלת.'
                  : 'האפליקציה נתקלה בשגיאה לא צפויה.'}
              </p>
            </div>

            {/* Error ID for support */}
            {this.state.errorId && (
              <div className="text-xs text-[var(--text-tertiary)] font-mono">
                קוד שגיאה: {this.state.errorId}
              </div>
            )}

            {/* SECURITY: Only show detailed errors in development mode */}
            {import.meta.env.DEV && this.state.error && (
              <details className="bg-black/30 rounded-lg p-4 text-left border border-red-500/20">
                <summary className="text-xs font-semibold text-red-300 cursor-pointer select-none">
                  פרטים טכניים (מצב פיתוח בלבד)
                </summary>
                <div
                  className="mt-2 overflow-auto max-h-32 text-xs font-mono text-red-300"
                  dir="ltr"
                >
                  <p className="font-bold">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-2 text-red-400/70 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-3">
              {/* For feature errors, try to recover first */}
              {isFeatureError && (
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 bg-[var(--cosmos-accent-primary)] hover:brightness-110 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--dynamic-accent-glow)]"
                >
                  <RefreshIcon className="w-5 h-5" />
                  נסה שוב
                </button>
              )}

              <button
                onClick={this.handleReload}
                className={`w-full py-3 ${
                  isFeatureError
                    ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    : 'bg-[var(--cosmos-accent-primary)] hover:brightness-110 text-black shadow-[0_0_15px_var(--dynamic-accent-glow)]'
                } rounded-xl font-bold transition-all flex items-center justify-center gap-2`}
              >
                <RefreshIcon className="w-5 h-5" />
                רענן עמוד
              </button>

              {!isFeatureError && (
                <button
                  onClick={this.handleGoHome}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
                >
                  חזור לדף הבית
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper for creating feature-specific error boundaries
 * with automatic Suspense fallback
 */
export const FeatureErrorBoundary: React.FC<{
  children: ReactNode;
  feature: string;
  loadingFallback?: ReactNode;
}> = ({ children, feature, loadingFallback }) => (
  <ErrorBoundary feature={feature}>
    <Suspense
      fallback={
        loadingFallback || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-2 border-[var(--cosmos-accent-primary)] border-t-transparent rounded-full" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default ErrorBoundary;
