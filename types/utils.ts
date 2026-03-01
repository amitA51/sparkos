/**
 * Advanced TypeScript Utility Types
 * 
 * This file contains reusable type utilities following TypeScript best practices.
 * Use these for type-safe operations across the codebase.
 */

// ============================================================================
// Branded Types - Prevent primitive obsession
// ============================================================================

/**
 * Creates a nominal/branded type to prevent mixing primitives of same base type
 * Example: UserId and OrderId are both strings but cannot be mixed
 */
export type Brand<K, T> = K & { readonly __brand: T };

/** Branded string types for domain entities */
export type UserId = Brand<string, 'UserId'>;
export type ItemId = Brand<string, 'ItemId'>;
export type SpaceId = Brand<string, 'SpaceId'>;
export type HabitId = Brand<string, 'HabitId'>;
export type FeedId = Brand<string, 'FeedId'>;

/** Type guards for branded types */
export const isUserId = (value: string): value is UserId => 
  typeof value === 'string' && value.length > 0;

export const isItemId = (value: string): value is ItemId => 
  typeof value === 'string' && value.length > 0;

// ============================================================================
// DeepReadonly - Immutable nested objects
// ============================================================================

/**
 * Makes all properties readonly recursively
 * Use for ensuring immutability in state
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

// ============================================================================
// DeepPartial - Partial nested objects
// ============================================================================

/**
 * Makes all properties optional recursively
 * Use for update/patch operations
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// ============================================================================
// Required Keys - Extract required property keys
// ============================================================================

/**
 * Makes specific properties required while keeping others as-is
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Makes specific properties optional while keeping others as-is
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ============================================================================
// NonNullable Deep - Remove null/undefined recursively
// ============================================================================

export type DeepNonNullable<T> = T extends object
  ? { [K in keyof T]: DeepNonNullable<NonNullable<T[K]>> }
  : NonNullable<T>;

// ============================================================================
// Strict Omit - Type-safe Omit that only accepts valid keys
// ============================================================================

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// ============================================================================
// Result Type - For error handling without exceptions
// ============================================================================

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/** Helper functions for Result type */
export const ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });

/** Unwrap Result or throw */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.success) return result.data;
  throw result.error;
};

/** Unwrap Result or return default */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.success ? result.data : defaultValue;
};

// ============================================================================
// AsyncResult - For async operations with error handling
// ============================================================================

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

// ============================================================================
// Nullable - Explicit nullability
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// ============================================================================
// NonEmptyArray - Arrays that must have at least one element
// ============================================================================

export type NonEmptyArray<T> = [T, ...T[]];

/** Type guard for NonEmptyArray */
export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> => arr.length > 0;

// ============================================================================
// Primitive Types
// ============================================================================

export type Primitive = string | number | boolean | null | undefined | symbol | bigint;

export const isPrimitive = (value: unknown): value is Primitive => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint'
  );
};

// ============================================================================
// JSON Types - Type-safe JSON handling
// ============================================================================

export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

// ============================================================================
// Function Types
// ============================================================================

export type AnyFunction = (...args: unknown[]) => unknown;
export type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;

// ============================================================================
// Object Manipulation Types
// ============================================================================

/**
 * Get all keys of T that have values of type V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Pick only properties with values of type V
 */
export type PickByType<T, V> = Pick<T, KeysOfType<T, V>>;

/**
 * Omit properties with values of type V
 */
export type OmitByType<T, V> = Omit<T, KeysOfType<T, V>>;

// ============================================================================
// Union & Intersection Helpers
// ============================================================================

/**
 * Get the values of a union type as an array
 * Useful for runtime validation against union types
 */
export type UnionToArray<T> = T extends T ? T[] : never;

/**
 * Extract common properties from a union
 */
export type CommonProps<T> = T extends object
  ? { [K in keyof T]: T[K] }
  : never;

// ============================================================================
// Component Prop Types
// ============================================================================

/** Props that accept children */
export type WithChildren<T = object> = T & { children?: React.ReactNode };

/** Props that require children */
export type WithRequiredChildren<T = object> = T & { children: React.ReactNode };

/** Props with className */
export type WithClassName<T = object> = T & { className?: string };

/** Common component props */
export type BaseComponentProps = WithClassName & {
  id?: string;
  'data-testid'?: string;
};

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Compile-time assertion that a value is never reached
 * Useful for exhaustive switch statements
 */
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

/**
 * Runtime assertion with type narrowing
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
