/**
 * Advanced Error Boundaries
 * 
 * Feature-specific error boundaries with:
 * - Automatic retry logic
 * - Fallback UI components
 * - Error reporting
 * - Recovery strategies
 */

import { Component, Suspense, useCallback, useState, useEffect } from 'react';
import type { ErrorInfo, ReactNode, ReactElement } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  feature?: string;
  retryable?: boolean;
  maxRetries?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

// ============================================================================
// Base Error Boundary
// ============================================================================

/**
 * Enhanced base error boundary with retry logic
 */
export class AdvancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    const context = {
      feature: this.props.feature || 'unknown',
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      retryCount: this.state.retryCount,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    console.error('[ErrorBoundary]', { error, errorInfo, context });
    
    this.props.onError?.(error, errorInfo);
    
    // Auto-retry for retryable errors
    if (this.props.retryable && this.state.retryCount < (this.props.maxRetries ?? 3)) {
      setTimeout(() => this.handleRetry(), 1000 * (this.state.retryCount + 1));
    }
  }

  private handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isFeatureError = !!this.props.feature;
      const error = this.state.error;
      const errorId = this.state.errorId;

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

            {errorId && (
              <div className="text-xs text-[var(--text-tertiary)] font-mono">
                קוד שגיאה: {errorId}
              </div>
            )}

            {import.meta.env.DEV && (
              <details className="bg-black/30 rounded-lg p-4 text-left border border-red-500/20">
                <summary className="text-xs font-semibold text-red-300 cursor-pointer select-none">
                  פרטים טכניים (מצב פיתוח בלבד)
                </summary>
                <div className="mt-2 overflow-auto max-h-32 text-xs font-mono text-red-300" dir="ltr">
                  <p className="font-bold">{error.name}: {error.message}</p>
                  {error.stack && (
                    <pre className="mt-2 text-red-400/70 whitespace-pre-wrap">{error.stack}</pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-3">
              {isFeatureError && (
                <button
                  onClick={this.handleReset}
                  className="w-full py-3 bg-[var(--cosmos-accent-primary)] hover:brightness-110 text-black rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--dynamic-accent-glow)]"
                >
                  🔄 נסה שוב
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
                🔄 רענן עמוד
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Feature-Specific Error Boundaries
// ============================================================================

interface FeatureBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

function FeatureLoadingFallback({ feature }: { feature: string }): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="animate-spin h-8 w-8 border-2 border-[var(--cosmos-accent-primary)] border-t-transparent rounded-full" />
      <p className="text-[var(--text-secondary)] text-sm">טוען {feature}...</p>
    </div>
  );
}

/**
 * Tasks feature error boundary
 */
export function TasksErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="משימות" retryable maxRetries={2} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="משימות" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * Habits feature error boundary
 */
export function HabitsErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="הרגלים" retryable maxRetries={2} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="הרגלים" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * Calendar feature error boundary
 */
export function CalendarErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="יומן" retryable maxRetries={2} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="יומן" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * RSS Reader feature error boundary
 */
export function RSSErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="קורא RSS" retryable maxRetries={3} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="קורא RSS" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * Passwords feature error boundary (sensitive - no retry)
 */
export function PasswordsErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="מנהל סיסמאות" retryable={false} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="מנהל סיסמאות" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * Workouts feature error boundary
 */
export function WorkoutsErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="אימונים" retryable maxRetries={2} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="אימונים" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

/**
 * Investments feature error boundary
 */
export function InvestmentsErrorBoundary({ children, loadingFallback, onError }: FeatureBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary feature="השקעות" retryable maxRetries={3} onError={onError}>
      <Suspense fallback={loadingFallback || <FeatureLoadingFallback feature="השקעות" />}>
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

// ============================================================================
// Error Recovery Hook
// ============================================================================

interface UseErrorRecoveryResult {
  error: Error | null;
  hasError: boolean;
  captureError: (error: Error) => void;
  clearError: () => void;
  retryCount: number;
  retry: () => void;
}

/**
 * Hook for manual error handling with recovery
 */
export function useErrorRecovery(maxRetries = 3): UseErrorRecoveryResult {
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const captureError = useCallback((err: Error) => {
    setError(err);
    console.error('[useErrorRecovery]', err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setError(null);
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, maxRetries]);

  return {
    error,
    hasError: error !== null,
    captureError,
    clearError,
    retryCount,
    retry,
  };
}

// ============================================================================
// Query Error Boundary (for React Query)
// ============================================================================

interface QueryErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

/**
 * Error boundary specifically for React Query errors
 */
export function QueryErrorBoundary({
  children,
  onReset,
  fallback,
}: QueryErrorBoundaryProps): ReactElement {
  const handleError = useCallback(
    (error: Error, reset: () => void) => {
      if (fallback) {
        return fallback({ error, reset: () => { reset(); onReset?.(); } });
      }
      
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">שגיאה בטעינת הנתונים</p>
          <button
            onClick={() => { reset(); onReset?.(); }}
            className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm"
          >
            נסה שוב
          </button>
        </div>
      );
    },
    [fallback, onReset]
  );

  return (
    <AdvancedErrorBoundary fallback={handleError} retryable maxRetries={3}>
      {children}
    </AdvancedErrorBoundary>
  );
}

// ============================================================================
// Network Error Boundary
// ============================================================================

interface NetworkErrorBoundaryProps {
  children: ReactNode;
  offlineFallback?: ReactNode;
}

function OfflineFallback(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center" dir="rtl">
      <span className="text-4xl">📡</span>
      <h3 className="text-lg font-bold text-white">אין חיבור לאינטרנט</h3>
      <p className="text-[var(--text-secondary)] text-sm">אנא בדוק את החיבור שלך ונסה שוב</p>
    </div>
  );
}

/**
 * Error boundary for network-related errors
 */
export function NetworkErrorBoundary({
  children,
  offlineFallback,
}: NetworkErrorBoundaryProps): ReactElement {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (offlineFallback || <OfflineFallback />) as ReactElement;
  }

  return (
    <AdvancedErrorBoundary feature="רשת" retryable maxRetries={5}>
      {children}
    </AdvancedErrorBoundary>
  );
}

// ============================================================================
// Async Error Boundary (for async component loading)
// ============================================================================

interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: ReactNode;
  error?: ReactNode | ((error: Error, retry: () => void) => ReactNode);
}

/**
 * Combined Suspense + Error boundary for async components
 */
export function AsyncBoundary({
  children,
  loading,
  error,
}: AsyncBoundaryProps): ReactElement {
  return (
    <AdvancedErrorBoundary fallback={error} retryable>
      <Suspense
        fallback={
          loading || (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin h-8 w-8 border-2 border-[var(--cosmos-accent-primary)] border-t-transparent rounded-full" />
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </AdvancedErrorBoundary>
  );
}

// ============================================================================
// Error Logging Utility
// ============================================================================

interface ErrorLogEntry {
  timestamp: number;
  error: string;
  stack?: string;
  feature?: string;
  url: string;
  userAgent: string;
}

const errorLog: ErrorLogEntry[] = [];
const MAX_ERROR_LOG_SIZE = 100;

/**
 * Log error for monitoring
 */
export function logError(error: Error, feature?: string): void {
  const entry: ErrorLogEntry = {
    timestamp: Date.now(),
    error: `${error.name}: ${error.message}`,
    stack: error.stack,
    feature,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  errorLog.push(entry);

  if (errorLog.length > MAX_ERROR_LOG_SIZE) {
    errorLog.shift();
  }

  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    console.log('[ErrorLog]', entry);
  }
}

/**
 * Get recent errors
 */
export function getErrorLog(limit = 50): ErrorLogEntry[] {
  return errorLog.slice(-limit);
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
  errorLog.length = 0;
}
