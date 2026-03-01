/**
 * Todoist Import Service
 * Handles importing tasks from Todoist using their REST API v2
 * 
 * API Base: https://api.todoist.com/rest/v2
 * Auth: Bearer token (user provides their personal API token from Todoist settings)
 */

const TODOIST_API_BASE = 'https://api.todoist.com/rest/v2';

export interface TodoistTask {
    id: string;
    project_id: string;
    content: string;
    description: string;
    is_completed: boolean;
    labels: string[];
    priority: 1 | 2 | 3 | 4; // 1 = normal, 4 = urgent
    due?: {
        date: string;
        string: string;
        datetime?: string;
        timezone?: string;
    };
    created_at: string;
    parent_id?: string;
    section_id?: string;
}

export interface TodoistProject {
    id: string;
    name: string;
    color: string;
    is_inbox_project: boolean;
    is_favorite: boolean;
    order: number;
}

export interface ImportResult {
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
}

/**
 * Fetch all tasks from Todoist
 */
export async function fetchTodoistTasks(apiToken: string): Promise<TodoistTask[]> {
    const response = await fetch(`${TODOIST_API_BASE}/tasks`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('שגיאת אימות: בדוק את ה-API token שלך');
        }
        throw new Error(`שגיאת Todoist: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch all projects from Todoist
 */
export async function fetchTodoistProjects(apiToken: string): Promise<TodoistProject[]> {
    const response = await fetch(`${TODOIST_API_BASE}/projects`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    return response.json();
}

/**
 * Map Todoist priority to our priority system
 * Note: Todoist has 4 levels, but PersonalItem only has 3 (low/medium/high)
 * We map Todoist's priority 4 (urgent) and 3 (high) both to 'high'
 */
function mapPriority(todoistPriority: number): 'low' | 'medium' | 'high' {
    switch (todoistPriority) {
        case 4: return 'high'; // Todoist urgent -> high
        case 3: return 'high';
        case 2: return 'medium';
        default: return 'low';
    }
}

/**
 * Map Todoist task to our PersonalItem format
 */
export function mapTodoistToPersonalItem(
    task: TodoistTask,
    projectName?: string
): {
    type: 'task';
    title: string;
    content: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    isCompleted: boolean;
} {
    return {
        type: 'task',
        title: task.content,
        content: task.description || '',
        dueDate: task.due?.date || task.due?.datetime,
        priority: mapPriority(task.priority),
        tags: task.labels,
        isCompleted: task.is_completed,
    };
}

/**
 * Verify Todoist API token is valid
 */
export async function verifyTodoistToken(apiToken: string): Promise<boolean> {
    try {
        const response = await fetch(`${TODOIST_API_BASE}/projects`, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}
