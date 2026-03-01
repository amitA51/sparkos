import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyWidgetProps<P = object> {
    loader: () => Promise<{ default: ComponentType<P> }>;
    fallback?: React.ReactNode;
    props?: P;
}

/**
 * LazyWidget - Progressive loading wrapper for non-critical widgets
 * 
 * Usage:
 * <LazyWidget 
 *   loader={() => import('../WeeklyTasksChart')} 
 *   props={{ items: habits }} 
 * />
 */
export function LazyWidget<P extends object>({
    loader,
    fallback = <div className="animate-pulse bg-white/5 rounded-xl h-48" />,
    props = {} as P,
}: LazyWidgetProps<P>) {
    const Widget = React.useMemo(() => lazy(loader), [loader]);

    return (
        <Suspense fallback={fallback}>
            <Widget {...props} />
        </Suspense>
    );
}

export default LazyWidget;
