/**
 * Workout Service Tests
 * Tests for workout template, session, and body weight operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../services/db/indexedDBCore', () => ({
    dbGetAll: vi.fn(),
    dbGet: vi.fn(),
    dbPut: vi.fn(),
    dbDelete: vi.fn(),
    dbClear: vi.fn(),
    withRetry: vi.fn((fn) => fn()),
}));

vi.mock('../../config/firebase', () => ({
    auth: {
        currentUser: null,
    },
}));

vi.mock('../../services/firestoreService', () => ({
    syncBodyWeight: vi.fn(),
    syncWorkoutSession: vi.fn(),
    syncWorkoutTemplate: vi.fn(),
    deleteWorkoutTemplate: vi.fn(),
}));

vi.mock('../../services/settingsService', () => ({
    loadSettings: vi.fn(() => ({
        workoutSettings: {
            selectedTheme: 'deepCosmos',
        },
    })),
    saveSettings: vi.fn(),
}));

describe('Workout Templates', () => {
    let workoutService: typeof import('../../services/db/workoutDb');
    let dbCore: typeof import('../../services/db/indexedDBCore');

    beforeEach(async () => {
        vi.clearAllMocks();
        workoutService = await import('../../services/db/workoutDb');
        dbCore = await import('../../services/db/indexedDBCore');
    });

    describe('getWorkoutTemplates', () => {
        it('should return all workout templates', async () => {
            const mockTemplates = [
                { id: 'template-1', name: 'Push Day', exercises: [] },
                { id: 'template-2', name: 'Pull Day', exercises: [] },
            ];

            vi.mocked(dbCore.dbGetAll).mockResolvedValue(mockTemplates);

            const result = await workoutService.getWorkoutTemplates();

            expect(result).toEqual(mockTemplates);
            expect(dbCore.dbGetAll).toHaveBeenCalled();
        });

        it('should return empty array when no templates exist', async () => {
            vi.mocked(dbCore.dbGetAll).mockResolvedValue([]);

            const result = await workoutService.getWorkoutTemplates();

            expect(result).toEqual([]);
        });
    });

    describe('createWorkoutTemplate', () => {
        it('should create a template with generated id and timestamp', async () => {
            vi.mocked(dbCore.dbPut).mockResolvedValue(undefined);

            const templateData = {
                name: 'Leg Day',
                exercises: [],
                muscleGroups: ['Legs'],
            };

            const result = await workoutService.createWorkoutTemplate(templateData);

            expect(result.id).toMatch(/^template-\d+$/);
            expect(result.name).toBe('Leg Day');
            expect(result.createdAt).toBeDefined();
            expect(dbCore.dbPut).toHaveBeenCalled();
        });

        it('should throw validation error for empty name', async () => {
            const templateData = {
                name: '',
                exercises: [],
            };

            await expect(workoutService.createWorkoutTemplate(templateData)).rejects.toThrow();
        });

        it('should throw validation error for whitespace-only name', async () => {
            const templateData = {
                name: '   ',
                exercises: [],
            };

            await expect(workoutService.createWorkoutTemplate(templateData)).rejects.toThrow();
        });
    });

    describe('deleteWorkoutTemplate', () => {
        it('should delete template by id', async () => {
            vi.mocked(dbCore.dbDelete).mockResolvedValue(undefined);

            await workoutService.deleteWorkoutTemplate('template-123');

            expect(dbCore.dbDelete).toHaveBeenCalled();
        });

        it('should throw for empty id', async () => {
            await expect(workoutService.deleteWorkoutTemplate('')).rejects.toThrow();
        });
    });
});

describe('Body Weight', () => {
    let workoutService: typeof import('../../services/db/workoutDb');
    let dbCore: typeof import('../../services/db/indexedDBCore');

    beforeEach(async () => {
        vi.clearAllMocks();
        workoutService = await import('../../services/db/workoutDb');
        dbCore = await import('../../services/db/indexedDBCore');
    });

    describe('getBodyWeightHistory', () => {
        it('should return entries sorted by date (newest first)', async () => {
            const mockEntries = [
                { id: '1', date: '2024-01-01', weight: 70 },
                { id: '2', date: '2024-03-01', weight: 68 },
                { id: '3', date: '2024-02-01', weight: 69 },
            ];

            vi.mocked(dbCore.dbGetAll).mockResolvedValue(mockEntries);

            const result = await workoutService.getBodyWeightHistory();

            expect(result[0]!.date).toBe('2024-03-01');
            expect(result[1]!.date).toBe('2024-02-01');
            expect(result[2]!.date).toBe('2024-01-01');
        });
    });

    describe('getLatestBodyWeight', () => {
        it('should return the most recent weight', async () => {
            const mockEntries = [
                { id: '1', date: '2024-01-01', weight: 70 },
                { id: '2', date: '2024-03-01', weight: 68 },
            ];

            vi.mocked(dbCore.dbGetAll).mockResolvedValue(mockEntries);

            const result = await workoutService.getLatestBodyWeight();

            expect(result).toBe(68);
        });

        it('should return null when no entries exist', async () => {
            vi.mocked(dbCore.dbGetAll).mockResolvedValue([]);

            const result = await workoutService.getLatestBodyWeight();

            expect(result).toBeNull();
        });
    });
});

// Theme Preferences tests removed - getThemePreference was removed from workoutDb
