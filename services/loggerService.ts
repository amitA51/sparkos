// Logger Service - Professional logging with production disable capability
// Provides consistent logging across the application with debug/info/warn/error levels

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    module: string;
    message: string;
    data?: unknown;
}

interface LoggerConfig {
    enabled: boolean;
    minLevel: LogLevel;
    persistLogs: boolean;
    maxPersistedLogs: number;
}

// Log level priority for filtering
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

// ============================================================
// LOGGER CLASS
// ============================================================

class Logger {
    private config: LoggerConfig;
    private persistedLogs: LogEntry[] = [];
    private module: string;

    constructor(module: string = 'App') {
        this.module = module;
        
        // Default config - disable debug in production
        this.config = {
            enabled: process.env.NODE_ENV !== 'production',
            minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
            persistLogs: false,
            maxPersistedLogs: 100,
        };
        
        // Load config from localStorage if available
        this.loadConfig();
    }

    private loadConfig(): void {
        try {
            const stored = localStorage.getItem('sparkos_logger_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.config = { ...this.config, ...parsed };
            }
        } catch {
            // Ignore - use defaults
        }
    }

    /**
     * Configure the logger
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
        try {
            localStorage.setItem('sparkos_logger_config', JSON.stringify(this.config));
        } catch {
            // Ignore storage errors
        }
    }

    /**
     * Create a child logger with a specific module name
     */
    child(module: string): Logger {
        const childLogger = new Logger(module);
        childLogger.config = this.config;
        return childLogger;
    }

    private shouldLog(level: LogLevel): boolean {
        if (!this.config.enabled) return false;
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.minLevel];
    }

    private formatTimestamp(): string {
        return new Date().toISOString();
    }

    private getConsoleMethod(level: LogLevel): typeof console.log {
        switch (level) {
            case 'debug':
                return console.debug;
            case 'info':
                return console.info;
            case 'warn':
                return console.warn;
            case 'error':
                return console.error;
            default:
                return console.log;
        }
    }

    private log(level: LogLevel, message: string, data?: unknown): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: this.formatTimestamp(),
            level,
            module: this.module,
            message,
            data,
        };

        // Console output with styling
        const styles = {
            debug: 'color: #8E8E93',
            info: 'color: #0A84FF',
            warn: 'color: #FF9F0A',
            error: 'color: #FF453A; font-weight: bold',
        };

        const prefix = `[${entry.timestamp.split('T')[1]?.slice(0, 8)}] [${this.module}]`;
        const method = this.getConsoleMethod(level);

        if (data !== undefined) {
            method(`%c${prefix} ${message}`, styles[level], data);
        } else {
            method(`%c${prefix} ${message}`, styles[level]);
        }

        // Persist if enabled
        if (this.config.persistLogs) {
            this.persistedLogs.push(entry);
            if (this.persistedLogs.length > this.config.maxPersistedLogs) {
                this.persistedLogs.shift();
            }
        }
    }

    /**
     * Log debug message - development only
     */
    debug(message: string, data?: unknown): void {
        this.log('debug', message, data);
    }

    /**
     * Log info message
     */
    info(message: string, data?: unknown): void {
        this.log('info', message, data);
    }

    /**
     * Log warning message
     */
    warn(message: string, data?: unknown): void {
        this.log('warn', message, data);
    }

    /**
     * Log error message
     */
    error(message: string, error?: unknown): void {
        if (error instanceof Error) {
            this.log('error', message, {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        } else {
            this.log('error', message, error);
        }
    }

    /**
     * Get all persisted logs
     */
    getLogs(): LogEntry[] {
        return [...this.persistedLogs];
    }

    /**
     * Clear persisted logs
     */
    clearLogs(): void {
        this.persistedLogs = [];
    }

    /**
     * Enable/disable logging at runtime
     */
    setEnabled(enabled: boolean): void {
        this.configure({ enabled });
    }

    /**
     * Set minimum log level
     */
    setMinLevel(level: LogLevel): void {
        this.configure({ minLevel: level });
    }

    /**
     * Time a function and log its duration
     */
    async time<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = performance.now() - start;
            this.debug(`${label} completed in ${duration.toFixed(2)}ms`);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.error(`${label} failed after ${duration.toFixed(2)}ms`, error);
            throw error;
        }
    }

    /**
     * Log a group of related messages
     */
    group(label: string, fn: () => void): void {
        if (!this.shouldLog('debug')) return;
        console.group(`[${this.module}] ${label}`);
        fn();
        console.groupEnd();
    }
}

// ============================================================
// SINGLETON INSTANCES
// ============================================================

// Main app logger
export const logger = new Logger('App');

// Pre-configured loggers for common modules
export const workoutLogger = new Logger('Workout');
export const dataLogger = new Logger('Data');
export const authLogger = new Logger('Auth');
export const uiLogger = new Logger('UI');
export const apiLogger = new Logger('API');

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Create a logger for a specific module
 */
export function createLogger(module: string): Logger {
    return new Logger(module);
}

/**
 * Disable all logging (useful for tests)
 */
export function disableAllLogs(): void {
    logger.setEnabled(false);
}

/**
 * Enable all logging
 */
export function enableAllLogs(): void {
    logger.setEnabled(true);
}

/**
 * Set global log level
 */
export function setGlobalLogLevel(level: LogLevel): void {
    logger.setMinLevel(level);
}

export default logger;
