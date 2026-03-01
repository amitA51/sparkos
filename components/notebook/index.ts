/**
 * NotebookHub - Entry point for the Knowledge & Notes module
 * Displays grid of notebooks with creation and navigation
 */

// Core components
export { default as NotebookHubView } from './NotebookHubView';
export { default as NotebookCard } from './NotebookCard';
export { default as SectionListView } from './SectionListView';
export { default as PageListView } from './PageListView';
export { default as BreadcrumbNav } from './BreadcrumbNav';

// Editor components
export { default as NotebookEditor } from './NotebookEditor';
export { default as PageEditorView } from './PageEditorView';

// Container/Router components
export { default as NotebookContainer } from './NotebookContainer';
export { default as NotebookDetailView } from './NotebookDetailView';

// Module version
export const NOTEBOOK_MODULE_VERSION = '1.0.0';
