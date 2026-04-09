/**
 * Utilities Index
 *
 * Barrel export for all utility modules.
 */

// Array utilities
export * from './array';

// Validation utilities (simple validators)
export * from './validation';

// Performance utilities (simple throttle/debounce)
export * from './performance';

// Logging utilities
export { logger, dbLogger, syncLogger, aiLogger, authLogger } from './logger';
export type { default as Logger } from './logger';

// Style utilities (cn, layout, typography, etc.) - merged from lib/styles
export { cn } from './styles';

// Query client - merged from lib/queryClient
export { queryClient, queryKeys, invalidateQueries, prefetchQueries } from './queryClient';
