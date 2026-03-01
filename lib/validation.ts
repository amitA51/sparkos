/**
 * Form Validation Utilities with Zod
 * 
 * Type-safe form validation with:
 * - Zod schemas for all data types
 * - Custom error messages in Hebrew
 * - Reusable validation patterns
 */

import { z } from 'zod';

// ============================================================================
// Custom Error Messages (Hebrew)
// ============================================================================

const errorMessages = {
  required: 'שדה חובה',
  invalidEmail: 'כתובת אימייל לא תקינה',
  invalidUrl: 'כתובת URL לא תקינה',
  invalidPhone: 'מספר טלפון לא תקין',
  minLength: (min: number) => `מינימום ${min} תווים`,
  maxLength: (max: number) => `מקסימום ${max} תווים`,
  minValue: (min: number) => `ערך מינימלי: ${min}`,
  maxValue: (max: number) => `ערך מקסימלי: ${max}`,
  invalidDate: 'תאריך לא תקין',
  passwordMismatch: 'הסיסמאות אינן תואמות',
  weakPassword: 'הסיסמה חלשה מדי',
  invalidFormat: 'פורמט לא תקין',
  positiveNumber: 'חייב להיות מספר חיובי',
  integer: 'חייב להיות מספר שלם',
  invalidJson: 'JSON לא תקין',
  invalidTime: 'שעה לא תקינה',
  futureDateRequired: 'התאריך חייב להיות בעתיד',
  pastDateRequired: 'התאריך חייב להיות בעבר',
};

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Non-empty string with custom error
 */
export const requiredString = z.string().min(1, errorMessages.required);

/**
 * Optional string
 */
export const optionalString = z.string().optional();

/**
 * Email validation
 */
export const emailSchema = z.string()
  .min(1, errorMessages.required)
  .email(errorMessages.invalidEmail);

/**
 * Password validation with strength requirements
 */
export const passwordSchema = z.string()
  .min(8, errorMessages.minLength(8))
  .max(100, errorMessages.maxLength(100))
  .refine(
    (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password),
    'חייב לכלול אותיות קטנות וגדולות'
  )
  .refine(
    (password: string) => /\d/.test(password),
    'חייב לכלול לפחות ספרה אחת'
  );

/**
 * Simple password (less strict)
 */
export const simplePasswordSchema = z.string()
  .min(6, errorMessages.minLength(6))
  .max(100, errorMessages.maxLength(100));

/**
 * URL validation
 */
export const urlSchema = z.string()
  .url(errorMessages.invalidUrl)
  .refine(
    (url: string) => url.startsWith('http://') || url.startsWith('https://'),
    'חייב להתחיל ב-http:// או https://'
  );

/**
 * Optional URL
 */
export const optionalUrlSchema = z.string()
  .url(errorMessages.invalidUrl)
  .optional();

/**
 * Phone number (Israeli format)
 */
export const phoneSchema = z.string()
  .regex(/^(\+972|0)([2-9]\d{7,8})$/, errorMessages.invalidPhone);

/**
 * International phone
 */
export const internationalPhoneSchema = z.string()
  .regex(/^\+?[\d\s\-()]{10,}$/, errorMessages.invalidPhone);

/**
 * Positive number
 */
export const positiveNumberSchema = z.number()
  .positive(errorMessages.positiveNumber);

/**
 * Non-negative number
 */
export const nonNegativeNumberSchema = z.number()
  .min(0, 'חייב להיות 0 או יותר');

/**
 * Integer
 */
export const integerSchema = z.number()
  .int(errorMessages.integer);

/**
 * Positive integer
 */
export const positiveIntegerSchema = z.number()
  .int(errorMessages.integer)
  .positive(errorMessages.positiveNumber);

/**
 * Date validation
 */
export const dateSchema = z.date();

/**
 * Future date
 */
export const futureDateSchema = z.date()
  .refine((date: Date) => date > new Date(), errorMessages.futureDateRequired);

/**
 * Past date
 */
export const pastDateSchema = z.date()
  .refine((date: Date) => date < new Date(), errorMessages.pastDateRequired);

/**
 * Date string (ISO format)
 */
export const dateStringSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, errorMessages.invalidDate)
  .refine((str: string) => !isNaN(Date.parse(str)), errorMessages.invalidDate);

/**
 * Time string (HH:MM format)
 */
export const timeStringSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, errorMessages.invalidTime);

/**
 * Color hex code
 */
export const colorHexSchema = z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'קוד צבע לא תקין');

/**
 * JSON string
 */
export const jsonStringSchema = z.string()
  .refine((str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }, errorMessages.invalidJson);

// ============================================================================
// Domain Schemas
// ============================================================================

/**
 * Task schema
 */
export const taskSchema = z.object({
  title: requiredString.max(200, errorMessages.maxLength(200)),
  description: optionalString,
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  tags: z.array(z.string()).default([]),
  reminder: z.date().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

/**
 * Habit schema
 */
export const habitSchema = z.object({
  name: requiredString.max(100, errorMessages.maxLength(100)),
  description: optionalString,
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  targetDays: z.array(z.number().min(0).max(6)).optional(),
  reminderTime: timeStringSchema.optional(),
  color: colorHexSchema.optional(),
  icon: z.string().optional(),
});

export type HabitInput = z.infer<typeof habitSchema>;

/**
 * Event schema (calendar)
 */
export const eventSchema = z.object({
  title: requiredString.max(200, errorMessages.maxLength(200)),
  description: optionalString,
  startDate: dateSchema,
  endDate: dateSchema.optional(),
  allDay: z.boolean().default(false),
  location: optionalString,
  color: colorHexSchema.optional(),
  reminders: z.array(z.number()).default([]),
});

export type EventInput = z.infer<typeof eventSchema>;

/**
 * Idea schema
 */
export const ideaSchema = z.object({
  title: requiredString.max(200, errorMessages.maxLength(200)),
  content: z.string().max(10000, errorMessages.maxLength(10000)).optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  isPinned: z.boolean().default(false),
});

export type IdeaInput = z.infer<typeof ideaSchema>;

/**
 * Password entry schema (for password manager)
 */
export const passwordEntrySchema = z.object({
  siteName: requiredString.max(100, errorMessages.maxLength(100)),
  username: requiredString.max(200, errorMessages.maxLength(200)),
  password: requiredString.max(500, errorMessages.maxLength(500)),
  url: optionalUrlSchema,
  notes: z.string().max(1000, errorMessages.maxLength(1000)).optional(),
  category: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export type PasswordEntryInput = z.infer<typeof passwordEntrySchema>;

/**
 * Investment schema
 */
export const investmentSchema = z.object({
  symbol: requiredString.max(10, errorMessages.maxLength(10)),
  name: requiredString.max(100, errorMessages.maxLength(100)),
  type: z.enum(['stock', 'crypto', 'etf', 'bond', 'other']),
  quantity: positiveNumberSchema,
  purchasePrice: positiveNumberSchema,
  purchaseDate: dateSchema,
  notes: optionalString,
});

export type InvestmentInput = z.infer<typeof investmentSchema>;

/**
 * RSS Feed schema
 */
export const rssFeedSchema = z.object({
  url: urlSchema,
  name: requiredString.max(100, errorMessages.maxLength(100)),
  category: z.string().optional(),
  refreshInterval: positiveIntegerSchema.default(60),
});

export type RssFeedInput = z.infer<typeof rssFeedSchema>;

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  displayName: requiredString.max(50, errorMessages.maxLength(50)),
  email: emailSchema,
  phone: internationalPhoneSchema.optional(),
  timezone: z.string().optional(),
  language: z.enum(['he', 'en']).default('he'),
  theme: z.enum(['dark', 'light', 'system']).default('dark'),
  accentColor: colorHexSchema.optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: requiredString.max(50, errorMessages.maxLength(50)),
  acceptTerms: z.boolean().refine((val: boolean) => val === true, 'יש לאשר את תנאי השימוש'),
}).refine((data) => data.password === data.confirmPassword, {
  message: errorMessages.passwordMismatch,
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================================================
// Workout Schemas
// ============================================================================

/**
 * Exercise set schema
 */
export const exerciseSetSchema = z.object({
  reps: positiveIntegerSchema.optional(),
  weight: nonNegativeNumberSchema.optional(),
  duration: positiveIntegerSchema.optional(),
  distance: nonNegativeNumberSchema.optional(),
  completed: z.boolean().default(false),
});

export type ExerciseSetInput = z.infer<typeof exerciseSetSchema>;

/**
 * Exercise schema
 */
export const exerciseSchema = z.object({
  name: requiredString.max(100, errorMessages.maxLength(100)),
  sets: z.array(exerciseSetSchema).min(1, 'חייב להיות לפחות סט אחד'),
  notes: optionalString,
  restTime: positiveIntegerSchema.optional(),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;

/**
 * Workout schema
 */
export const workoutSchema = z.object({
  name: requiredString.max(100, errorMessages.maxLength(100)),
  exercises: z.array(exerciseSchema).min(1, 'חייב להיות לפחות תרגיל אחד'),
  duration: positiveIntegerSchema.optional(),
  notes: optionalString,
  date: dateSchema.default(() => new Date()),
});

export type WorkoutInput = z.infer<typeof workoutSchema>;

// ============================================================================
// Validation Helpers
// ============================================================================

interface ValidationSuccess<T> {
  success: true;
  data: T;
}

interface ValidationError {
  success: false;
  errors: z.ZodError;
}

/**
 * Validate data against a schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationSuccess<T> | ValidationError {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Get formatted error messages from Zod error
 */
export function getErrorMessages(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  
  return errors;
}

/**
 * Get first error message for a field
 */
export function getFieldError(error: z.ZodError, field: string): string | undefined {
  const issue = error.issues.find((i) => i.path.join('.') === field);
  return issue?.message;
}

/**
 * Flatten all error messages
 */
export function flattenErrors(error: z.ZodError): string[] {
  return error.issues.map((i) => {
    const path = i.path.length > 0 ? `${i.path.join('.')}: ` : '';
    return `${path}${i.message}`;
  });
}

// ============================================================================
// Async Validation
// ============================================================================

interface AsyncValidationSuccess<T> {
  success: true;
  data: T;
}

interface AsyncValidationError {
  success: false;
  error: string;
}

/**
 * Create an async validator
 */
export function createAsyncValidator<T>(
  schema: z.ZodSchema<T>,
  asyncCheck: (data: T) => Promise<string | null>
): (data: unknown) => Promise<AsyncValidationSuccess<T> | AsyncValidationError> {
  return async (data: unknown) => {
    const syncResult = schema.safeParse(data);
    
    if (!syncResult.success) {
      return { success: false, error: syncResult.error.issues[0]?.message || 'Validation failed' };
    }
    
    const asyncError = await asyncCheck(syncResult.data);
    if (asyncError) {
      return { success: false, error: asyncError };
    }
    
    return { success: true, data: syncResult.data };
  };
}

// ============================================================================
// Common Validators
// ============================================================================

/**
 * Validate email uniqueness (example)
 */
export const validateUniqueEmail = createAsyncValidator(
  emailSchema,
  async (email: string) => {
    // In real app, check against database/API
    const existingEmails = ['admin@example.com', 'test@example.com'];
    if (existingEmails.includes(email.toLowerCase())) {
      return 'כתובת אימייל זו כבר רשומה';
    }
    return null;
  }
);

/**
 * Transform form data to typed object
 */
export function parseFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): ValidationSuccess<T> | ValidationError {
  const data: Record<string, unknown> = {};
  
  formData.forEach((value, key) => {
    // Handle nested keys like "address.city"
    const keys = key.split('.');
    let current = data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (k === undefined) continue;
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey === undefined) return;
    
    // Handle arrays
    if (lastKey.endsWith('[]')) {
      const arrayKey = lastKey.slice(0, -2);
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }
      (current[arrayKey] as unknown[]).push(value);
    } else {
      current[lastKey] = value;
    }
  });
  
  return validate(schema, data);
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if validation result is successful
 */
export function isValidationSuccess<T>(
  result: ValidationSuccess<T> | ValidationError
): result is ValidationSuccess<T> {
  return result.success;
}

/**
 * Check if validation result is an error
 */
export function isValidationError<T>(
  result: ValidationSuccess<T> | ValidationError
): result is ValidationError {
  return !result.success;
}
