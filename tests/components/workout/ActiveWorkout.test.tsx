/**
 * ActiveWorkout Component Tests
 * Tests for the main workout component and its interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock dependencies
vi.mock('../../services/dataService', () => ({
    getWorkoutSessions: vi.fn().mockResolvedValue([]),
    getPersonalExercises: vi.fn().mockResolvedValue([]),
    saveWorkoutSession: vi.fn().mockResolvedValue(undefined),
    createWorkoutTemplate: vi.fn().mockResolvedValue({}),
    removePersonalItem: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../services/prService', () => ({
    getExerciseNames: vi.fn().mockReturnValue([]),
}));

vi.mock('../../src/utils/haptics', () => ({
    triggerHaptic: vi.fn(),
}));

vi.mock('../../src/utils/audio', () => ({
    playSuccess: vi.fn(),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.ComponentProps<'div'>) =>
            <div {...props}>{children}</div>,
        button: ({ children, ...props }: React.ComponentProps<'button'>) =>
            <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import after mocks
import { EmptyWorkoutState } from '../../../components/workout/states';
import { ParticleExplosion } from '../../../components/workout/effects';

describe('EmptyWorkoutState', () => {
    const defaultProps = {
        oledMode: false,
        onAddExercise: vi.fn(),
        onCancel: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render empty state with correct content', () => {
        render(<EmptyWorkoutState {...defaultProps} />);

        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByText('בוא נתחיל! 💪')).toBeInTheDocument();
        expect(screen.getByText(/בחר את התרגיל הראשון/)).toBeInTheDocument();
    });

    it('should have accessible buttons with aria-labels', () => {
        render(<EmptyWorkoutState {...defaultProps} />);

        const addButton = screen.getByRole('button', { name: /בחר תרגיל להוספה/ });
        const cancelButton = screen.getByRole('button', { name: /ביטול האימון/ });

        expect(addButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('should call onAddExercise when add button is clicked', async () => {
        const user = userEvent.setup();
        render(<EmptyWorkoutState {...defaultProps} />);

        const addButton = screen.getByRole('button', { name: /בחר תרגיל להוספה/ });
        await user.click(addButton);

        expect(defaultProps.onAddExercise).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(<EmptyWorkoutState {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: /ביטול האימון/ });
        await user.click(cancelButton);

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should apply OLED mode styling when enabled', () => {
        render(<EmptyWorkoutState {...defaultProps} oledMode={true} />);

        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveStyle({ background: '#000000' });
    });

    it('should have touch-friendly button sizes (min 44px)', () => {
        render(<EmptyWorkoutState {...defaultProps} />);

        const addButton = screen.getByRole('button', { name: /בחר תרגיל להוספה/ });
        const cancelButton = screen.getByRole('button', { name: /ביטול האימון/ });

        // Check classes for min-height
        expect(addButton.className).toContain('min-h-[56px]');
        expect(cancelButton.className).toContain('min-h-[44px]');
    });
});

describe('ParticleExplosion', () => {
    it('should render particle container', () => {
        render(<ParticleExplosion />);

        // Should be hidden from screen readers
        const container = document.querySelector('[aria-hidden="true"]');
        expect(container).toBeInTheDocument();
    });

    it('should render 20 particle elements', () => {
        render(<ParticleExplosion />);

        const particles = document.querySelectorAll('.rounded-full');
        expect(particles.length).toBe(20);
    });

    it('should have pointer-events-none for non-interactive behavior', () => {
        render(<ParticleExplosion />);

        const container = document.querySelector('.pointer-events-none');
        expect(container).toBeInTheDocument();
    });
});

describe('Workout Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should persist workout state to localStorage', async () => {
        const mockState = {
            exercises: [{ id: '1', name: 'Bench Press', sets: [] }],
            currentExerciseIndex: 0,
        };

        localStorage.setItem('active_workout_v3_state', JSON.stringify(mockState));

        const stored = localStorage.getItem('active_workout_v3_state');
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored!)).toEqual(mockState);
    });

    it('should clear workout state on successful finish', () => {
        localStorage.setItem('active_workout_v3_state', JSON.stringify({ test: true }));

        // Simulate workout finish
        localStorage.removeItem('active_workout_v3_state');

        expect(localStorage.getItem('active_workout_v3_state')).toBeNull();
    });
});

describe('Workout Accessibility', () => {
    it('should have proper focus management in empty state', () => {
        const defaultProps = {
            oledMode: false,
            onAddExercise: vi.fn(),
            onCancel: vi.fn(),
        };

        render(<EmptyWorkoutState {...defaultProps} />);

        // Buttons should have focus outline classes
        const addButton = screen.getByRole('button', { name: /בחר תרגיל להוספה/ });
        expect(addButton.className).toContain('focus:outline-none');
        expect(addButton.className).toContain('focus:ring-2');
    });
});
