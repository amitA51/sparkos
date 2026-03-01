/**
 * Tests for lib/validation.ts
 */

import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  urlSchema,
  taskSchema,
  habitSchema,
  eventSchema,
  passwordEntrySchema,
  investmentSchema,
  validate,
  getErrorMessages,
  getFieldError,
} from '../../lib/validation';

// ============================================================================
// Base Schema Tests
// ============================================================================

describe('emailSchema', () => {
  it('should validate correct email addresses', () => {
    expect(() => emailSchema.parse('test@example.com')).not.toThrow();
    expect(() => emailSchema.parse('user.name@domain.co.il')).not.toThrow();
  });

  it('should reject invalid email addresses', () => {
    expect(() => emailSchema.parse('invalid')).toThrow();
    expect(() => emailSchema.parse('test@')).toThrow();
    expect(() => emailSchema.parse('@example.com')).toThrow();
  });
});

describe('passwordSchema', () => {
  it('should validate strong passwords', () => {
    expect(() => passwordSchema.parse('StrongPass123!')).not.toThrow();
  });

  it('should reject weak passwords', () => {
    expect(() => passwordSchema.parse('weak')).toThrow();
    expect(() => passwordSchema.parse('12345678')).toThrow();
  });
});

describe('urlSchema', () => {
  it('should validate correct URLs', () => {
    expect(() => urlSchema.parse('https://example.com')).not.toThrow();
    expect(() => urlSchema.parse('http://localhost:3000')).not.toThrow();
  });

  it('should reject invalid URLs', () => {
    expect(() => urlSchema.parse('not-a-url')).toThrow();
  });
});

// ============================================================================
// Task Schema Tests
// ============================================================================

describe('taskSchema', () => {
  it('should validate a complete task', () => {
    const validTask = {
      title: 'Complete project',
      description: 'Finish the project by end of week',
      dueDate: new Date('2024-12-31'),
      priority: 'high',
      status: 'pending',
      tags: ['work', 'important'],
    };

    const result = validate(taskSchema, validTask);
    expect(result.success).toBe(true);
  });

  it('should validate minimal task with only required fields', () => {
    const minimalTask = {
      title: 'Simple task',
    };

    const result = validate(taskSchema, minimalTask);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidTask = {
      title: '',
    };

    const result = validate(taskSchema, invalidTask);
    expect(result.success).toBe(false);
  });

  it('should reject invalid priority', () => {
    const invalidTask = {
      title: 'Test task',
      priority: 'invalid',
    };

    const result = validate(taskSchema, invalidTask);
    expect(result.success).toBe(false);
  });

  it('should reject invalid status', () => {
    const invalidTask = {
      title: 'Test task',
      status: 'unknown',
    };

    const result = validate(taskSchema, invalidTask);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Habit Schema Tests
// ============================================================================

describe('habitSchema', () => {
  it('should validate a complete habit', () => {
    const validHabit = {
      name: 'Exercise',
      frequency: 'daily',
      targetDays: [1, 2, 3, 4, 5],
      reminderTime: '08:00',
      color: '#FF5733',
    };

    const result = validate(habitSchema, validHabit);
    expect(result.success).toBe(true);
  });

  it('should validate minimal habit', () => {
    const minimalHabit = {
      name: 'Read',
      frequency: 'weekly',
    };

    const result = validate(habitSchema, minimalHabit);
    expect(result.success).toBe(true);
  });

  it('should reject invalid frequency', () => {
    const invalidHabit = {
      name: 'Test',
      frequency: 'sometimes',
    };

    const result = validate(habitSchema, invalidHabit);
    expect(result.success).toBe(false);
  });

  it('should reject invalid target days', () => {
    const invalidHabit = {
      name: 'Test',
      frequency: 'weekly',
      targetDays: [8], // Invalid day
    };

    const result = validate(habitSchema, invalidHabit);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Event Schema Tests
// ============================================================================

describe('eventSchema', () => {
  it('should validate a complete event', () => {
    const validEvent = {
      title: 'Team meeting',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-15'),
      startTime: '10:00',
      endTime: '11:00',
      allDay: false,
      location: 'Conference Room A',
      description: 'Weekly team sync',
    };

    const result = validate(eventSchema, validEvent);
    expect(result.success).toBe(true);
  });

  it('should validate all-day event', () => {
    const allDayEvent = {
      title: 'Holiday',
      startDate: new Date('2024-12-25'),
      allDay: true,
    };

    const result = validate(eventSchema, allDayEvent);
    expect(result.success).toBe(true);
  });

  it('should reject empty title', () => {
    const invalidEvent = {
      title: '',
      startDate: new Date('2024-12-15'),
    };

    const result = validate(eventSchema, invalidEvent);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Password Entry Schema Tests
// ============================================================================

describe('passwordEntrySchema', () => {
  it('should validate a complete password entry', () => {
    const validEntry = {
      siteName: 'GitHub',
      username: 'johndoe',
      password: 'SuperSecure123!',
      url: 'https://github.com',
      notes: 'Work account',
    };

    const result = validate(passwordEntrySchema, validEntry);
    expect(result.success).toBe(true);
  });

  it('should validate minimal entry', () => {
    const minimalEntry = {
      siteName: 'Test Site',
      username: 'testuser',
      password: 'password123',
    };

    const result = validate(passwordEntrySchema, minimalEntry);
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// Investment Schema Tests
// ============================================================================

describe('investmentSchema', () => {
  it('should validate a stock investment', () => {
    const validInvestment = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      quantity: 100,
      purchasePrice: 150.50,
      purchaseDate: new Date('2024-01-15'),
    };

    const result = validate(investmentSchema, validInvestment);
    expect(result.success).toBe(true);
  });

  it('should validate a crypto investment', () => {
    const cryptoInvestment = {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      quantity: 0.5,
      purchasePrice: 40000,
      purchaseDate: new Date('2024-01-15'),
    };

    const result = validate(investmentSchema, cryptoInvestment);
    expect(result.success).toBe(true);
  });

  it('should reject negative quantity', () => {
    const invalidInvestment = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      quantity: -10,
      purchasePrice: 150,
      purchaseDate: new Date('2024-01-15'),
    };

    const result = validate(investmentSchema, invalidInvestment);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('validate', () => {
  it('should return success with data for valid input', () => {
    const result = validate(taskSchema, { title: 'Test' });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Test');
    }
  });

  it('should return failure with errors for invalid input', () => {
    const result = validate(taskSchema, { title: '' });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
    }
  });
});

describe('getErrorMessages', () => {
  it('should extract error messages from validation result', () => {
    const result = validate(taskSchema, { title: '', priority: 'invalid' });
    
    if (!result.success) {
      const messages = getErrorMessages(result.errors);
      expect(Object.keys(messages).length).toBeGreaterThan(0);
    }
  });
});

describe('getFieldError', () => {
  it('should get error for specific field', () => {
    const result = validate(taskSchema, { title: '' });
    
    if (!result.success) {
      const titleError = getFieldError(result.errors, 'title');
      expect(titleError).toBeDefined();
    }
  });

  it('should return undefined for field without error', () => {
    const result = validate(taskSchema, { title: '' });
    
    if (!result.success) {
      const descError = getFieldError(result.errors, 'description');
      expect(descError).toBeUndefined();
    }
  });
});
