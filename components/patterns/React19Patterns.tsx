/**
 * React 19 Enhanced Patterns
 * 
 * Modern React components and patterns leveraging React 19 features.
 */

import React, {
  useCallback,
  useTransition,
  startTransition,
  useDeferredValue,
  memo,
  forwardRef,
  type ReactNode,
  type ComponentType,
  Suspense,
} from 'react';

// ============================================================================
// Optimistic UI Component
// ============================================================================

interface OptimisticProps<T> {
  /** Current confirmed value */
  value: T;
  /** Optimistic (pending) value */
  optimisticValue?: T;
  /** Render function */
  children: (value: T, isPending: boolean) => ReactNode;
}

/**
 * Component for displaying optimistic UI updates
 * Shows pending state while async operation completes
 */
export function Optimistic<T>({ value, optimisticValue, children }: OptimisticProps<T>) {
  const displayValue = optimisticValue ?? value;
  const isPending = optimisticValue !== undefined;
  return <>{children(displayValue, isPending)}</>;
}

// ============================================================================
// Deferred Value Wrapper
// ============================================================================

interface DeferredProps<T> {
  /** Value to defer */
  value: T;
  /** Render function receiving deferred value */
  children: (deferredValue: T, isStale: boolean) => ReactNode;
}

/**
 * Component wrapper for useDeferredValue
 * Useful for expensive rendering that can lag behind user input
 */
export function Deferred<T>({ value, children }: DeferredProps<T>) {
  const deferredValue = useDeferredValue(value);
  const isStale = value !== deferredValue;
  return <>{children(deferredValue, isStale)}</>;
}

// ============================================================================
// Transition Button
// ============================================================================

interface TransitionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Async click handler */
  onClick: () => Promise<void> | void;
  /** Content to show while pending */
  pendingContent?: ReactNode;
  /** Children */
  children: ReactNode;
}

/**
 * Button that uses startTransition for non-urgent updates
 * Provides built-in pending state
 */
export const TransitionButton = forwardRef<HTMLButtonElement, TransitionButtonProps>(
  ({ onClick, pendingContent, children, disabled, className = '', ...props }, ref) => {
    const [isPending, startTransitionFn] = useTransition();

    const handleClick = useCallback(() => {
      startTransitionFn(async () => {
        await onClick();
      });
    }, [onClick]);

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || isPending}
        className={`${className} ${isPending ? 'opacity-70' : ''}`}
        {...props}
      >
        {isPending && pendingContent ? pendingContent : children}
      </button>
    );
  }
);

TransitionButton.displayName = 'TransitionButton';

// ============================================================================
// List with Deferred Updates
// ============================================================================

interface DeferredListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  emptyMessage?: ReactNode;
}

/**
 * Optimized list that defers re-renders during rapid updates
 * Good for search results or filtered lists
 */
export function DeferredList<T>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  emptyMessage = 'אין פריטים להצגה',
}: DeferredListProps<T>) {
  const deferredItems = useDeferredValue(items);
  const isStale = items !== deferredItems;

  if (deferredItems.length === 0) {
    return <div className="text-[var(--text-secondary)] text-center py-8">{emptyMessage}</div>;
  }

  return (
    <div className={`${className} ${isStale ? 'opacity-70 transition-opacity' : ''}`}>
      {deferredItems.map((item, index) => (
        <React.Fragment key={keyExtractor(item)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============================================================================
// Async Boundary (Enhanced Suspense)
// ============================================================================

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface AsyncBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Combined Suspense + Error Boundary for async operations
 */
class AsyncBoundaryClass extends React.Component<AsyncBoundaryProps, AsyncBoundaryState> {
  state: AsyncBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): AsyncBoundaryState {
    return { hasError: true, error };
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { errorFallback } = this.props;
      
      if (typeof errorFallback === 'function') {
        return errorFallback(this.state.error, this.resetError);
      }
      
      return errorFallback || (
        <div className="text-red-400 p-4 text-center">
          שגיאה בטעינה
        </div>
      );
    }

    return (
      <Suspense fallback={this.props.fallback || <DefaultLoadingFallback />}>
        {this.props.children}
      </Suspense>
    );
  }
}

export const AsyncBoundary = AsyncBoundaryClass;

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-2 border-[var(--cosmos-accent-primary)] border-t-transparent rounded-full" />
    </div>
  );
}

// ============================================================================
// With Transition HOC
// ============================================================================

interface WithTransitionOptions {
  /** Show loading overlay when pending */
  showOverlay?: boolean;
}

/**
 * HOC that wraps component updates in startTransition
 */
export function withTransition<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>,
  options: WithTransitionOptions = {}
): ComponentType<P> {
  const { showOverlay = false } = options;

  function TransitionWrapped(props: P) {
    const [isPending, startTransitionFn] = useTransition();

    // Wrap any prop that looks like a handler
    const wrappedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => {
        if (typeof value === 'function' && key.startsWith('on')) {
          return [
            key,
            (...args: unknown[]) => {
              startTransitionFn(() => {
                (value as (...args: unknown[]) => void)(...args);
              });
            },
          ];
        }
        return [key, value];
      })
    ) as P;

    return (
      <div className="relative">
        <WrappedComponent {...wrappedProps} />
        {showOverlay && isPending && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    );
  }

  TransitionWrapped.displayName = `withTransition(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return TransitionWrapped;
}

// ============================================================================
// Optimized Form Input
// ============================================================================

interface OptimizedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

/**
 * Input that defers onChange updates for better performance
 * with rapid typing
 */
export const OptimizedInput = memo(
  forwardRef<HTMLInputElement, OptimizedInputProps>(
    ({ value, onChange, debounceMs = 0, ...props }, ref) => {
      const [localValue, setLocalValue] = React.useState(value);

      // Sync local value when prop changes
      React.useEffect(() => {
        setLocalValue(value);
      }, [value]);

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setLocalValue(newValue);

          // Use transition for non-urgent update
          startTransition(() => {
            onChange(newValue);
          });
        },
        [onChange]
      );

      return (
        <input
          ref={ref}
          {...props}
          value={localValue}
          onChange={handleChange}
        />
      );
    }
  )
);

OptimizedInput.displayName = 'OptimizedInput';

// ============================================================================
// Virtualized List with Transition
// ============================================================================

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  keyExtractor: (item: T) => string;
  overscan?: number;
}

/**
 * Simple virtualized list that only renders visible items
 * Uses transitions for smooth scrolling
 */
export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  keyExtractor,
  overscan = 3,
}: VirtualizedListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const deferredScrollTop = useDeferredValue(scrollTop);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(deferredScrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((deferredScrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          const style: React.CSSProperties = {
            position: 'absolute',
            top: actualIndex * itemHeight,
            height: itemHeight,
            width: '100%',
          };
          return (
            <React.Fragment key={keyExtractor(item)}>
              {renderItem(item, actualIndex, style)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Action State Hook (React 19 useActionState alternative)
// ============================================================================

type ActionState<T> = 
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/**
 * Hook for managing form action state
 * Similar to React 19's useActionState
 */
export function useActionState<T, TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<T>
): [ActionState<T>, (...args: TArgs) => Promise<void>, () => void] {
  const [state, setState] = React.useState<ActionState<T>>({ status: 'idle' });

  const execute = useCallback(
    async (...args: TArgs) => {
      setState({ status: 'pending' });
      try {
        const result = await action(...args);
        setState({ status: 'success', data: result });
      } catch (error) {
        setState({ status: 'error', error: error as Error });
      }
    },
    [action]
  );

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return [state, execute, reset];
}
