import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import React, { useState } from 'react';

// Loading component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
}

// Error boundary for lazy loaded components
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Failed to load component
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy wrapper with intersection observer
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export function LazyWrapper({
  children,
  fallback = <LoadingSpinner />,
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}: LazyWrapperProps) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div ref={ref} className={className}>
      {inView ? (
        <LazyErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            {children}
          </Suspense>
        </LazyErrorBoundary>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center">
          {fallback}
        </div>
      )}
    </div>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    rootMargin?: string;
    threshold?: number;
  } = {}
) {
  const LazyComponent = (props: P) => {
    const {
      fallback = <LoadingSpinner />,
      errorFallback,
      rootMargin = '50px',
      threshold = 0.1
    } = options;

    return (
      <LazyWrapper
        fallback={fallback}
        rootMargin={rootMargin}
        threshold={threshold}
      >
        <LazyErrorBoundary fallback={errorFallback}>
          <Component {...props} />
        </LazyErrorBoundary>
      </LazyWrapper>
    );
  };

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return LazyComponent;
}

// Utility to create lazy loaded components
export function createLazyComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    preload?: boolean;
  } = {}
) {
  const LazyComponent = lazy(importFn);

  // Preload the component if requested
  if (options.preload) {
    importFn().catch(console.error);
  }

  return function LazyLoadedComponent(props: P) {
    return (
      <LazyErrorBoundary fallback={options.errorFallback}>
        <Suspense fallback={options.fallback || <LoadingSpinner />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };
}

// Image lazy loading component
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjY2NjIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmc8L3RleHQ+PC9zdmc+',
  blurDataURL,
  priority = false,
  onLoad,
  onError
}: LazyImageProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm"
          aria-hidden="true"
        />
      )}
      
      {(inView || priority) && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📷</div>
            <p className="text-xs text-gray-500">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Section lazy loading for large content blocks
interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: number;
  id?: string;
}

export function LazySection({
  children,
  fallback,
  className = '',
  minHeight = 200,
  id
}: LazySectionProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={className}
      id={id}
      style={{ minHeight: inView ? 'auto' : `${minHeight}px` }}
    >
      {inView ? (
        <Suspense fallback={fallback || <LoadingSpinner text="Loading section..." />}>
          {children}
        </Suspense>
      ) : (
        <div 
          className="flex items-center justify-center"
          style={{ height: `${minHeight}px` }}
        >
          {fallback || <LoadingSpinner text="Loading section..." />}
        </div>
      )}
    </section>
  );
}

// Export commonly used lazy loaded components
export const LazyComponents = {
  // Example lazy loaded components
  HeavyChart: createLazyComponent(
    () => import('../charts/heavy-chart'),
    { 
      fallback: <LoadingSpinner text="Loading chart..." />,
      preload: false 
    }
  ),
  
  DataTable: createLazyComponent(
    () => import('../data/data-table'),
    { 
      fallback: <LoadingSpinner text="Loading table..." />,
      preload: false 
    }
  ),
  
  CodeEditor: createLazyComponent(
    () => import('../editor/code-editor'),
    { 
      fallback: <LoadingSpinner text="Loading editor..." />,
      preload: false 
    }
  ),
};

export default LazyWrapper;