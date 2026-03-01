/**
 * LoadingSpinner Component Tests
 * Following testing-patterns skill: AAA pattern, component tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} style={style} {...props}>{children}</div>
        ),
        span: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
            <span className={className} style={style} {...props}>{children}</span>
        ),
        svg: ({ children, className, ...props }: React.SVGAttributes<SVGSVGElement>) => (
            <svg className={className} {...props}>{children}</svg>
        ),
    },
}));

describe('LoadingSpinner', () => {
    describe('rendering', () => {
        it('should render with default props', () => {
            // Arrange & Act
            render(<LoadingSpinner />);

            // Assert - has role="status" for accessibility
            const spinner = screen.getByRole('status');
            expect(spinner).toBeInTheDocument();
            expect(spinner).toHaveAttribute('aria-busy', 'true');
            expect(spinner).toHaveAttribute('aria-live', 'polite');
        });

        it('should show screen reader text', () => {
            // Arrange & Act
            render(<LoadingSpinner />);

            // Assert - has sr-only text for screen readers
            const srText = screen.getByText('טוען...');
            expect(srText).toHaveClass('sr-only');
        });

        it('should render with custom text when showText is true', () => {
            // Arrange & Act
            render(<LoadingSpinner showText text="מחפש..." />);

            // Assert - visible text is shown
            const visibleText = screen.getAllByText('מחפש...');
            expect(visibleText.length).toBeGreaterThanOrEqual(1);
        });

        it('should not show visible text when showText is false', () => {
            // Arrange & Act
            render(<LoadingSpinner showText={false} text="Hidden text" />);

            // Assert - only sr-only version exists
            const srText = screen.getByText('Hidden text');
            expect(srText).toHaveClass('sr-only');
        });
    });

    describe('sizes', () => {
        it('should apply xs size class', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner size="xs" />);

            // Assert
            expect(container.querySelector('.w-4')).toBeTruthy();
        });

        it('should apply sm size class', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner size="sm" />);

            // Assert
            expect(container.querySelector('.w-5')).toBeTruthy();
        });

        it('should apply md size class (default)', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner size="md" />);

            // Assert
            expect(container.querySelector('.w-8')).toBeTruthy();
        });

        it('should apply lg size class', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner size="lg" />);

            // Assert
            expect(container.querySelector('.w-12')).toBeTruthy();
        });

        it('should apply xl size class', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner size="xl" />);

            // Assert
            expect(container.querySelector('.w-16')).toBeTruthy();
        });
    });

    describe('variants', () => {
        it('should render default variant', () => {
            // Arrange & Act
            render(<LoadingSpinner variant="default" />);

            // Assert
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should render dots variant', () => {
            // Arrange & Act
            const { container } = render(<LoadingSpinner variant="dots" />);

            // Assert - dots variant has multiple dot elements
            expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThanOrEqual(1);
        });

        it('should render pulse variant', () => {
            // Arrange & Act
            render(<LoadingSpinner variant="pulse" />);

            // Assert
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should render orbit variant', () => {
            // Arrange & Act
            render(<LoadingSpinner variant="orbit" />);

            // Assert
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should render gradient variant', () => {
            // Arrange & Act
            render(<LoadingSpinner variant="gradient" />);

            // Assert
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should render wave variant', () => {
            // Arrange & Act
            render(<LoadingSpinner variant="wave" />);

            // Assert
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have proper ARIA attributes', () => {
            // Arrange & Act
            render(<LoadingSpinner />);

            // Assert
            const spinner = screen.getByRole('status');
            expect(spinner).toHaveAttribute('aria-live', 'polite');
            expect(spinner).toHaveAttribute('aria-busy', 'true');
        });

        it('should provide loading context for screen readers', () => {
            // Arrange & Act
            render(<LoadingSpinner text="מעלה קובץ..." />);

            // Assert
            expect(screen.getByText('מעלה קובץ...')).toHaveClass('sr-only');
        });
    });

    describe('custom className', () => {
        it('should apply custom className', () => {
            // Arrange & Act
            render(<LoadingSpinner className="custom-class" />);

            // Assert
            const spinner = screen.getByRole('status');
            expect(spinner).toHaveClass('custom-class');
        });
    });
});
