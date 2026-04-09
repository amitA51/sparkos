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
              <h2 className="text-2xl font-black text-[var(--text-primary)]">
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
              <details className="rounded-lg p-4 text-left" style={{ background: 'var(--gray-50)', border: '1px solid var(--border-subtle)' }}>
                <summary className="text-xs font-semibold cursor-pointer select-none" style={{ color: '#EF4444' }}>
                  פרטים טכניים (מצב פיתוח בלבד)
                </summary>
                <div
                  className="mt-2 overflow-auto max-h-32 text-xs font-mono"
                  dir="ltr"
                  style={{ color: '#EF4444' }}
                >
                  <p className="font-bold">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="mt-2 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
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
                  className="w-full py-3 hover:brightness-110 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  style={{ background: 'var(--dynamic-accent-start, #007AFF)', color: '#FFFFFF', boxShadow: '0 4px 12px var(--dynamic-accent-glow, rgba(0,122,255,0.2))' }}
                >
                  <RefreshIcon className="w-5 h-5" />
                  נסה שוב
                </button>
              )}

              <button
                onClick={this.handleReload}
                className="w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                style={{
                  background: isFeatureError ? 'var(--gray-100)' : 'var(--dynamic-accent-start, #007AFF)',
                  color: isFeatureError ? 'var(--text-primary)' : '#FFFFFF',
                  border: isFeatureError ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <RefreshIcon className="w-5 h-5" />
                רענן עמוד
              </button>

              {!isFeatureError && (
                <button
                  onClick={this.handleGoHome}
                  className="w-full py-3 rounded-xl font-bold transition-all"
                  style={{ background: 'var(--gray-100)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
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
            <div className="animate-spin h-8 w-8 border-2 rounded-full" style={{ borderColor: 'var(--dynamic-accent-start, #007AFF)', borderTopColor: 'transparent' }} />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default ErrorBoundary;
