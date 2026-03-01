import type { SmartFolder } from '../types';

/**
 * Builtin Smart Folders - Pre-defined smart folders that come with the app
 * These provide useful default views for users
 */
export const BUILTIN_SMART_FOLDERS: SmartFolder[] = [
    {
        id: 'sf_today',
        name: 'Due Today',
        nameHe: 'להיום',
        icon: 'calendar',
        color: '#3B82F6', // Blue
        filters: [
            { field: 'type', operator: 'equals', value: 'task' },
            { field: 'isCompleted', operator: 'equals', value: false },
            { field: 'dueDate', operator: 'within', value: 0 }, // Today
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 1,
        isBuiltin: true,
    },
    {
        id: 'sf_upcoming',
        name: 'Upcoming',
        nameHe: 'בקרוב',
        icon: 'clock',
        color: '#8B5CF6', // Purple
        filters: [
            { field: 'type', operator: 'equals', value: 'task' },
            { field: 'isCompleted', operator: 'equals', value: false },
            { field: 'dueDate', operator: 'within', value: 7 }, // Next 7 days
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 2,
        isBuiltin: true,
    },
    {
        id: 'sf_overdue',
        name: 'Overdue',
        nameHe: 'באיחור',
        icon: 'alert-triangle',
        color: '#EF4444', // Red
        filters: [
            { field: 'type', operator: 'equals', value: 'task' },
            { field: 'isCompleted', operator: 'equals', value: false },
            { field: 'dueDate', operator: 'before', value: new Date().toISOString().split('T')[0]! },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 3,
        isBuiltin: true,
    },
    {
        id: 'sf_important',
        name: 'Important',
        nameHe: 'חשוב',
        icon: 'star',
        color: '#F59E0B', // Amber
        filters: [
            { field: 'isImportant', operator: 'equals', value: true },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 4,
        isBuiltin: true,
    },
    {
        id: 'sf_pinned',
        name: 'Pinned',
        nameHe: 'מוצמדים',
        icon: 'pin',
        color: '#EC4899', // Pink
        filters: [
            { field: 'isPinned', operator: 'equals', value: true },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 5,
        isBuiltin: true,
    },
    {
        id: 'sf_high_priority',
        name: 'High Priority',
        nameHe: 'עדיפות גבוהה',
        icon: 'flame',
        color: '#DC2626', // Red-600
        filters: [
            { field: 'type', operator: 'equals', value: 'task' },
            { field: 'priority', operator: 'equals', value: 'high' },
            { field: 'isCompleted', operator: 'equals', value: false },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 6,
        isBuiltin: true,
    },
    {
        id: 'sf_no_due_date',
        name: 'No Due Date',
        nameHe: 'ללא תאריך יעד',
        icon: 'question-circle',
        color: '#6B7280', // Gray
        filters: [
            { field: 'type', operator: 'equals', value: 'task' },
            { field: 'isCompleted', operator: 'equals', value: false },
            { field: 'dueDate', operator: 'isEmpty', value: true },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 7,
        isBuiltin: true,
    },
    {
        id: 'sf_notes',
        name: 'All Notes',
        nameHe: 'כל הפתקים',
        icon: 'file-text',
        color: '#10B981', // Emerald
        filters: [
            { field: 'type', operator: 'equals', value: 'note' },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 8,
        isBuiltin: true,
    },
    {
        id: 'sf_ideas',
        name: 'Ideas',
        nameHe: 'רעיונות',
        icon: 'lightbulb',
        color: '#FBBF24', // Yellow
        filters: [
            { field: 'type', operator: 'equals', value: 'idea' },
        ],
        matchMode: 'all',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 9,
        isBuiltin: true,
    },
];

export function getBuiltinSmartFolders(): SmartFolder[] {
    return BUILTIN_SMART_FOLDERS;
}

export function getSmartFolderById(id: string): SmartFolder | undefined {
    return BUILTIN_SMART_FOLDERS.find(f => f.id === id);
}
