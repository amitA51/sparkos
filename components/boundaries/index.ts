// Boundaries - Error boundary components
// Export all error boundaries for easy imports

// Generic error boundary factory
export {
    default as GenericErrorBoundary,
    createErrorBoundary,
    HomeErrorBoundary as HomeErrorBoundaryNew,
    LibraryErrorBoundary as LibraryErrorBoundaryNew,
    FeedErrorBoundary as FeedErrorBoundaryNew,
    CalendarErrorBoundary as CalendarErrorBoundaryNew,
    AddScreenErrorBoundary as AddScreenErrorBoundaryNew,
    SettingsErrorBoundary as SettingsErrorBoundaryNew,
    WorkoutErrorBoundary,
} from './GenericErrorBoundary';

// Legacy boundaries (for gradual migration)
export { default as HomeErrorBoundary } from './HomeErrorBoundary';
export { default as LibraryErrorBoundary } from './LibraryErrorBoundary';
export { default as FeedErrorBoundary } from './FeedErrorBoundary';
export { default as CalendarErrorBoundary } from './CalendarErrorBoundary';
export { default as AddScreenErrorBoundary } from './AddScreenErrorBoundary';
export { default as SettingsErrorBoundary } from './SettingsErrorBoundary';
export { default as AssistantErrorBoundary } from './AssistantErrorBoundary';
export { default as PasswordErrorBoundary } from './PasswordErrorBoundary';
export { default as ErrorFallback } from './ErrorFallback';
