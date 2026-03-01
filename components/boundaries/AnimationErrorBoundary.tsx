// Animation Error Boundary - Graceful fallback for animation failures
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary specifically for animation-related errors.
 * Provides a static fallback when animations fail.
 */
class AnimationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    // Check if it's an animation-related error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log animation errors for debugging
    console.warn('Animation error caught:', error.message);
    console.warn('Component stack:', errorInfo.componentStack);
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && (window as any).reportError) {
      (window as any).reportError({
        type: 'animation_error',
        message: error.message,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Return fallback or null (component will render without animation)
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default AnimationErrorBoundary;

/**
 * HOC to wrap animated components with error boundary
 */
export function withAnimationErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithAnimationErrorBoundary = (props: P) => (
    <AnimationErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </AnimationErrorBoundary>
  );
  
  WithAnimationErrorBoundary.displayName = `withAnimationErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithAnimationErrorBoundary;
}
