/**
 * BottomNavBar Component Tests
 * Following testing-patterns skill: AAA pattern, component tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock dependencies before importing component
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} style={style as React.CSSProperties} {...props}>{children}</div>
        ),
        button: ({ children, className, onClick, ...props }: React.HTMLAttributes<HTMLButtonElement> & { onClick?: () => void }) => (
            <button className={className} onClick={onClick} {...props}>{children}</button>
        ),
        span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
            <span className={className} {...props}>{children}</span>
        ),
    },
    useSpring: () => ({ set: vi.fn() }),
}));

vi.mock('../../src/contexts/SettingsContext', () => ({
    useSettings: () => ({
        settings: {
            screenLabels: {
                feed: 'פיד',
                today: 'היום',
                library: 'ספרייה',
                search: 'חיפוש',
            },
        },
    }),
}));

vi.mock('../../hooks/useHaptics', () => ({
    useHaptics: () => ({
        triggerHaptic: vi.fn(),
    }),
}));

vi.mock('../../hooks/useSound', () => ({
    useSound: () => ({
        playClick: vi.fn(),
        playPop: vi.fn(),
    }),
}));

vi.mock('../../state/ModalContext', () => ({
    useModal: () => ({
        openModal: vi.fn(),
    }),
}));

// Mock icons
vi.mock('../../components/icons', () => ({
    FeedIcon: () => <span data-testid="feed-icon">Feed</span>,
    TargetIcon: () => <span data-testid="target-icon">Target</span>,
    LayoutDashboardIcon: () => <span data-testid="dashboard-icon">Dashboard</span>,
    ChartBarIcon: () => <span data-testid="chart-icon">Chart</span>,
    SearchIcon: () => <span data-testid="search-icon">Search</span>,
    SettingsIcon: () => <span data-testid="settings-icon">Settings</span>,
    BrainCircuitIcon: () => <span data-testid="brain-icon">Brain</span>,
    DumbbellIcon: () => <span data-testid="dumbbell-icon">Dumbbell</span>,
    AddIcon: ({ className }: { className?: string }) => <span data-testid="add-icon" className={className}>Add</span>,
}));

// Import after mocks
import BottomNavBar from '../../components/BottomNavBar';
// Screen type used for prop type documentation for reference in navigation tests
// import type { Screen } from '../../types';

describe('BottomNavBar', () => {
    const mockSetActiveScreen = vi.fn();

    beforeEach(() => {
        mockSetActiveScreen.mockClear();
    });

    describe('rendering', () => {
        it('should render navigation items', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - main nav items should be rendered
            expect(screen.getByText('פיד')).toBeInTheDocument();
            expect(screen.getByText('היום')).toBeInTheDocument();
            expect(screen.getByText('ספרייה')).toBeInTheDocument();
            expect(screen.getByText('כושר')).toBeInTheDocument();
        });

        it('should render add button in center', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - add icon should exist
            expect(screen.getByTestId('add-icon')).toBeInTheDocument();
        });

        it('should render as nav element', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - semantic nav element
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });
    });

    describe('navigation', () => {
        it('should call setActiveScreen when nav item is clicked', () => {
            // Arrange
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Act - click on feed nav item
            const feedButton = screen.getByLabelText('פיד');
            fireEvent.click(feedButton);

            // Assert
            expect(mockSetActiveScreen).toHaveBeenCalledWith('feed');
        });

        it('should not call setActiveScreen when clicking already active screen', () => {
            // Arrange
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Act - click on already active nav item
            const todayButton = screen.getByLabelText('היום');
            fireEvent.click(todayButton);

            // Assert - should not be called
            expect(mockSetActiveScreen).not.toHaveBeenCalled();
        });

        it('should navigate to add screen when add button is pressed', () => {
            // Arrange
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Act - find and trigger mouseDown/mouseUp on add button (component uses this pattern for long-press)
            const addButton = screen.getByLabelText('הוספה - לחיצה ארוכה לפתק מהיר');
            fireEvent.mouseDown(addButton);
            fireEvent.mouseUp(addButton);

            // Assert
            expect(mockSetActiveScreen).toHaveBeenCalledWith('add');
        });
    });

    describe('accessibility', () => {
        it('should have aria-label on all nav buttons', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - buttons should have labels
            expect(screen.getByLabelText('פיד')).toBeInTheDocument();
            expect(screen.getByLabelText('היום')).toBeInTheDocument();
            expect(screen.getByLabelText('ספרייה')).toBeInTheDocument();
            expect(screen.getByLabelText('כושר')).toBeInTheDocument();
        });

        it('should mark active item with aria-current', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - active item should have aria-current="page"
            const todayButton = screen.getByLabelText('היום');
            expect(todayButton).toHaveAttribute('aria-current', 'page');
        });

        it('should have unique IDs for nav items', () => {
            // Arrange & Act
            render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - check for unique IDs
            expect(document.getElementById('nav-feed')).toBeInTheDocument();
            expect(document.getElementById('nav-today')).toBeInTheDocument();
            expect(document.getElementById('nav-library')).toBeInTheDocument();
            expect(document.getElementById('nav-fitness')).toBeInTheDocument();
            expect(document.getElementById('nav-add')).toBeInTheDocument();
        });
    });

    describe('active state', () => {
        it('should highlight active screen', () => {
            // Arrange & Act
            const { container: _container } = render(
                <BottomNavBar
                    activeScreen="feed"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert - feed button should be active
            const feedButton = screen.getByLabelText('פיד');
            expect(feedButton).toHaveAttribute('aria-current', 'page');
        });

        it('should update active state when activeScreen prop changes', () => {
            // Arrange
            const { rerender } = render(
                <BottomNavBar
                    activeScreen="today"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Verify initial state
            expect(screen.getByLabelText('היום')).toHaveAttribute('aria-current', 'page');

            // Act - change active screen
            rerender(
                <BottomNavBar
                    activeScreen="feed"
                    setActiveScreen={mockSetActiveScreen}
                />
            );

            // Assert
            expect(screen.getByLabelText('פיד')).toHaveAttribute('aria-current', 'page');
            expect(screen.getByLabelText('היום')).not.toHaveAttribute('aria-current');
        });
    });
});
