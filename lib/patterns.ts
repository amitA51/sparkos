/**
 * Code Organization Utilities
 * 
 * Patterns and helpers for clean code organization.
 * Provides utilities for component composition, state management, and modularity.
 */

import React from 'react';

// ============================================================================
// Component Composition Helpers
// ============================================================================

/**
 * Create a compound component pattern
 * 
 * @example
 * const Card = createCompound({
 *   Root: CardRoot,
 *   Header: CardHeader,
 *   Body: CardBody,
 *   Footer: CardFooter,
 * });
 * 
 * <Card.Root>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 * </Card.Root>
 */
export function createCompound<T extends Record<string, React.ComponentType<unknown>>>(
  components: T
): T {
  return components;
}

// ============================================================================
// Feature Flags
// ============================================================================

interface FeatureFlags {
  [key: string]: boolean | undefined;
}

const featureFlags: FeatureFlags = {};

/**
 * Set feature flag
 */
export function setFeatureFlag(flag: string, enabled: boolean): void {
  featureFlags[flag] = enabled;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(flag: string): boolean {
  return featureFlags[flag] === true;
}

/**
 * HOC to wrap component with feature flag check
 */
export function withFeatureFlag<P extends object>(
  flag: string,
  FallbackComponent?: React.ComponentType<P>
) {
  return function featureFlagHOC(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> {
    return function FeatureFlagComponent(props: P) {
      if (!isFeatureEnabled(flag)) {
        return FallbackComponent ? React.createElement(FallbackComponent, props) : null;
      }
      return React.createElement(WrappedComponent, props);
    };
  };
}

// ============================================================================
// State Machine Helper
// ============================================================================

type StateMachineConfig<TState extends string, TEvent extends string> = {
  initial: TState;
  states: {
    [S in TState]: {
      on?: {
        [E in TEvent]?: TState;
      };
    };
  };
};

/**
 * Create a simple state machine
 */
export function createStateMachine<TState extends string, TEvent extends string>(
  config: StateMachineConfig<TState, TEvent>
) {
  let currentState = config.initial;

  return {
    getState: () => currentState,
    send: (event: TEvent): TState => {
      const stateConfig = config.states[currentState];
      const nextState = stateConfig.on?.[event];
      
      if (nextState) {
        currentState = nextState;
      }
      
      return currentState;
    },
    canTransition: (event: TEvent): boolean => {
      const stateConfig = config.states[currentState];
      return stateConfig.on?.[event] !== undefined;
    },
  };
}

// ============================================================================
// Reducer Factory
// ============================================================================

type ActionMap<M extends Record<string, unknown>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
};

/**
 * Create type-safe action creators
 */
export function createActions<M extends Record<string, unknown>>() {
  return <K extends keyof M>(
    type: K,
    ...args: M[K] extends undefined ? [] : [M[K]]
  ): ActionMap<M>[K] => {
    if (args.length === 0) {
      return { type } as ActionMap<M>[K];
    }
    return { type, payload: args[0] } as ActionMap<M>[K];
  };
}

/**
 * Create a reducer with immer-like syntax (simplified)
 */
export function createReducer<TState, TAction extends { type: string }>(
  initialState: TState,
  handlers: {
    [K in TAction['type']]?: (
      state: TState,
      action: Extract<TAction, { type: K }>
    ) => TState;
  }
) {
  return function reducer(
    state: TState = initialState,
    action: TAction
  ): TState {
    const handler = handlers[action.type as TAction['type']];
    if (handler) {
      return handler(state, action as Extract<TAction, { type: typeof action.type }>);
    }
    return state;
  };
}

// ============================================================================
// Service Layer Patterns
// ============================================================================

/**
 * Repository pattern interface
 */
export interface Repository<T, ID = string> {
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Create a cached repository wrapper
 */
export function createCachedRepository<T extends { id: string }>(
  repository: Repository<T>,
  cacheDuration = 5 * 60 * 1000 // 5 minutes
): Repository<T> {
  let cache: T[] | null = null;
  let cacheTimestamp = 0;

  const isCacheValid = () => {
    return cache !== null && Date.now() - cacheTimestamp < cacheDuration;
  };

  const invalidateCache = () => {
    cache = null;
  };

  return {
    async getAll() {
      if (isCacheValid()) {
        return cache!;
      }
      cache = await repository.getAll();
      cacheTimestamp = Date.now();
      return cache;
    },

    async getById(id) {
      if (isCacheValid()) {
        return cache!.find(item => item.id === id) || null;
      }
      return repository.getById(id);
    },

    async create(data) {
      const result = await repository.create(data);
      invalidateCache();
      return result;
    },

    async update(id, data) {
      const result = await repository.update(id, data);
      invalidateCache();
      return result;
    },

    async delete(id) {
      await repository.delete(id);
      invalidateCache();
    },
  };
}

// ============================================================================
// Event Emitter Pattern
// ============================================================================

type EventHandler<T = unknown> = (data: T) => void;

/**
 * Create a simple event emitter
 */
export function createEventEmitter<TEvents extends Record<string, unknown>>() {
  const listeners = new Map<keyof TEvents, Set<EventHandler>>();

  return {
    on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(handler as EventHandler);

      // Return unsubscribe function
      return () => {
        listeners.get(event)?.delete(handler as EventHandler);
      };
    },

    emit<K extends keyof TEvents>(event: K, data: TEvents[K]) {
      listeners.get(event)?.forEach(handler => handler(data));
    },

    off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>) {
      listeners.get(event)?.delete(handler as EventHandler);
    },

    clear() {
      listeners.clear();
    },
  };
}

// ============================================================================
// Command Pattern
// ============================================================================

interface Command<T = void> {
  execute(): T | Promise<T>;
  undo?(): void | Promise<void>;
}

/**
 * Create a command with undo support
 */
export function createCommand<T>(
  execute: () => T | Promise<T>,
  undo?: () => void | Promise<void>
): Command<T> {
  return { execute, undo };
}

/**
 * Command history for undo/redo
 */
export function createCommandHistory() {
  const history: Command<unknown>[] = [];
  const redoStack: Command<unknown>[] = [];
  let pointer = -1;

  return {
    async execute<T>(command: Command<T>): Promise<T> {
      const result = await command.execute();
      
      // Clear redo stack when new command is executed
      redoStack.length = 0;
      
      // Add to history
      history.push(command as Command<unknown>);
      pointer = history.length - 1;
      
      return result;
    },

    async undo(): Promise<boolean> {
      if (pointer < 0) return false;
      
      const command = history[pointer];
      if (command?.undo) {
        await command.undo();
        redoStack.push(command);
        pointer--;
        return true;
      }
      return false;
    },

    async redo(): Promise<boolean> {
      const command = redoStack.pop();
      if (command) {
        await command.execute();
        pointer++;
        return true;
      }
      return false;
    },

    canUndo: () => pointer >= 0,
    canRedo: () => redoStack.length > 0,
    clear: () => {
      history.length = 0;
      redoStack.length = 0;
      pointer = -1;
    },
  };
}

// ============================================================================
// Dependency Injection (Simple)
// ============================================================================

type Factory<T> = () => T;

const container = new Map<string, Factory<unknown>>();
const singletons = new Map<string, unknown>();

/**
 * Register a factory
 */
export function register<T>(token: string, factory: Factory<T>, singleton = false): void {
  container.set(token, factory);
  if (singleton) {
    singletons.delete(token); // Reset singleton on re-register
  }
}

/**
 * Resolve a dependency
 */
export function resolve<T>(token: string): T {
  // Check singleton cache
  if (singletons.has(token)) {
    return singletons.get(token) as T;
  }

  const factory = container.get(token);
  if (!factory) {
    throw new Error(`No factory registered for token: ${token}`);
  }

  const instance = factory() as T;
  return instance;
}

// ============================================================================
// Guard Clauses
// ============================================================================

/**
 * Assert condition or throw
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Assert value is not null/undefined
 */
export function assertDefined<T>(
  value: T | null | undefined,
  name: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} must be defined`);
  }
}

/**
 * Assert array is not empty
 */
export function assertNonEmpty<T>(
  array: T[],
  name: string
): asserts array is [T, ...T[]] {
  if (array.length === 0) {
    throw new Error(`${name} must not be empty`);
  }
}

// ============================================================================
// Pipe / Compose
// ============================================================================

type Fn<T, R> = (arg: T) => R;

/**
 * Pipe functions left to right
 */
export function pipe<A, B>(f1: Fn<A, B>): Fn<A, B>;
export function pipe<A, B, C>(f1: Fn<A, B>, f2: Fn<B, C>): Fn<A, C>;
export function pipe<A, B, C, D>(f1: Fn<A, B>, f2: Fn<B, C>, f3: Fn<C, D>): Fn<A, D>;
export function pipe<A, B, C, D, E>(
  f1: Fn<A, B>,
  f2: Fn<B, C>,
  f3: Fn<C, D>,
  f4: Fn<D, E>
): Fn<A, E>;
export function pipe(...fns: Fn<unknown, unknown>[]): Fn<unknown, unknown> {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}

/**
 * Compose functions right to left
 */
export function compose<A, B>(f1: Fn<A, B>): Fn<A, B>;
export function compose<A, B, C>(f2: Fn<B, C>, f1: Fn<A, B>): Fn<A, C>;
export function compose<A, B, C, D>(
  f3: Fn<C, D>,
  f2: Fn<B, C>,
  f1: Fn<A, B>
): Fn<A, D>;
export function compose(...fns: Fn<unknown, unknown>[]): Fn<unknown, unknown> {
  return (x: unknown) => fns.reduceRight((acc, fn) => fn(acc), x);
}


