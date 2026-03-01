/**
 * NotebookContainer
 * Internal router/orchestrator for the Notebook module
 * Handles navigation between Hub → Detail → Editor views
 */

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import NotebookHubView from './NotebookHubView';
import NotebookDetailView from './NotebookDetailView';
import PageEditorView from './PageEditorView';

interface NotebookContainerProps {
    /** Called when the back button is pressed at the Hub level */
    onExitModule?: () => void;
}

/**
 * NotebookContainer acts as an internal router for the notebook module.
 * It renders different views based on the current navigation state:
 * - Hub: Shows all notebooks
 * - Detail: Shows sections and pages within a notebook
 * - Editor: Shows the page editor
 */
const NotebookContainer: React.FC<NotebookContainerProps> = ({ onExitModule }) => {
    const {
        activeNotebookId,
        activePageId,
        navigateBack,
    } = useNotebook();

    // Determine current view based on navigation state
    const currentView = activePageId
        ? 'editor'
        : activeNotebookId
            ? 'detail'
            : 'hub';

    // Handle back navigation with module exit
    const handleBack = useCallback(() => {
        if (currentView === 'hub') {
            // We're at the hub level, let parent handle navigation
            onExitModule?.();
        } else {
            // Navigate back within the module
            navigateBack();
        }
    }, [currentView, navigateBack, onExitModule]);

    // Animation variants for view transitions
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
        }),
    };

    // Direction for animation (1 = forward, -1 = back)
    const getDirection = (view: string) => {
        const order = { hub: 0, detail: 1, editor: 2 };
        return order[view as keyof typeof order] || 0;
    };

    return (
        <div className="relative min-h-[60vh] w-full">
            <AnimatePresence mode="wait" custom={getDirection(currentView)}>
                {currentView === 'editor' && (
                    <motion.div
                        key="editor"
                        custom={1}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 1 }}
                        className="absolute inset-0"
                    >
                        <PageEditorView onBack={handleBack} />
                    </motion.div>
                )}

                {currentView === 'detail' && (
                    <motion.div
                        key="detail"
                        custom={getDirection('detail')}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 1 }}
                        className="absolute inset-0"
                    >
                        <NotebookDetailView onBack={handleBack} />
                    </motion.div>
                )}

                {currentView === 'hub' && (
                    <motion.div
                        key="hub"
                        custom={-1}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 1 }}
                        className="absolute inset-0"
                    >
                        <NotebookHubView />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotebookContainer;
