/**
 * ═══════════════════════════════════════════════════════════════
 * MOCK SPARK DATA - Edge Case Test Data for UI Stress Testing
 * ═══════════════════════════════════════════════════════════════
 * 
 * Contains 7 SparkItem objects covering extreme edge cases:
 * 1. Learning item with very long AI summary + URL + sentiment + author
 * 2. Task item with 5 subtasks (mixed completion states) + High priority
 * 3. Idea item with NO meta fields (empty state testing)
 * 4. Fitness item with scheduled time and duration
 * 5. Item with 10+ tags (tag wrapping stress test)
 * 6. Event item with recurring schedule
 * 7. Project item with complex metadata
 */

import {
    SparkItem,
    SparkItemType,
    SparkItemStatus,
    SparkItemPriority,
} from '../types/SparkItemTypes';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA ARRAY
// ═══════════════════════════════════════════════════════════════

export const mockSparkItems: SparkItem[] = [
    // ─────────────────────────────────────────────────────────────
    // 1. LEARNING ITEM - Very long AI summary, URL, sentiment, author
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-learning-001',
        title: 'Understanding Quantum Computing: A Comprehensive Deep Dive',
        content: `This is an extremely long AI-generated summary designed to stress-test the UI's text handling capabilities. The article explores the fascinating world of quantum computing, starting with the fundamental principles of quantum mechanics including superposition, entanglement, and quantum interference. The author masterfully explains how qubits differ from classical bits, demonstrating that while classical computers use binary states (0 or 1), quantum computers leverage the probability amplitudes of quantum states to perform calculations exponentially faster for certain problem types. 

The piece continues with an in-depth analysis of current quantum computing architectures including superconducting qubits (used by IBM and Google), trapped ion systems (employed by IonQ and Honeywell), photonic quantum computers, and topological qubits being developed by Microsoft. Each approach has its advantages and challenges related to coherence times, gate fidelities, and scalability.

Furthermore, the article discusses practical applications ranging from cryptography (both breaking current encryption and creating quantum-safe alternatives), drug discovery through molecular simulation, optimization problems in logistics and finance, and machine learning acceleration. The author concludes with a thoughtful assessment of the current state of quantum advantage and realistic timelines for when quantum computers might solve commercially relevant problems that classical computers cannot.`,
        type: 'learning',
        status: 'inbox',
        priority: 'high',
        tags: ['#quantum', '#technology', '#science'],
        meta: {
            url: 'https://www.nature.com/articles/quantum-computing-revolution-2024-comprehensive-guide',
            estimatedDuration: '45m',
            readingTime: '18 min read',
            sentiment: 'Optimistic and Educational',
            aiReasoning: 'Classified as learning due to educational nature, long-form content structure, and presence of technical explanations. The URL domain suggests academic/scientific credibility.',
            author: 'Dr. Elena Vasquez, Senior Quantum Researcher at MIT',
        },
        createdAt: '2024-12-28T08:15:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 2. TASK ITEM - 5 subtasks (mixed states) + High priority
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-task-002',
        title: 'Complete Q4 Financial Report',
        content: 'Prepare and submit the quarterly financial report with all supporting documentation.',
        type: 'task',
        status: 'todo',
        priority: 'high',
        subtasks: [
            '✅ Gather all transaction records from accounting',
            '✅ Reconcile bank statements with ledger',
            '☐ Create expense breakdown charts',
            '☐ Write executive summary',
            '☐ Submit to CFO for review',
        ],
        tags: ['#work', '#finance', '#urgent'],
        scheduling: {
            dueDate: '2024-12-31',
            time: '17:00',
            isRecurring: false,
        },
        meta: {
            estimatedDuration: '4h',
            aiReasoning: 'Detected as task with multiple subtasks based on action verbs and deadline urgency.',
        },
        createdAt: '2024-12-20T14:30:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 3. IDEA ITEM - NO meta fields (empty state testing)
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-idea-003',
        title: 'Build an AI-powered plant care app',
        content: 'App that uses camera to identify plants and provides personalized watering schedules based on local weather data.',
        type: 'idea',
        status: 'inbox',
        priority: 'low',
        // NO subtasks - testing empty subtasks state
        // NO tags - testing empty tags state  
        // NO scheduling - testing empty scheduling state
        // NO meta - testing empty meta state
        createdAt: '2024-12-27T22:45:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 4. FITNESS ITEM - Scheduled time and duration
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-fitness-004',
        title: 'Morning HIIT Workout Session',
        content: 'High-intensity interval training focusing on cardio and core strength. Include warm-up and cool-down stretches.',
        type: 'fitness',
        status: 'scheduled',
        priority: 'medium',
        subtasks: [
            '☐ 5 min dynamic warm-up',
            '☐ 20 min HIIT circuit',
            '☐ 5 min cool-down stretches',
        ],
        tags: ['#fitness', '#morning-routine', '#health'],
        scheduling: {
            dueDate: '2024-12-29',
            time: '06:30',
            isRecurring: true,
        },
        meta: {
            estimatedDuration: '30m',
            aiReasoning: 'Classified as fitness based on exercise-related keywords and structured workout format.',
        },
        createdAt: '2024-12-15T19:00:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 5. HABIT ITEM - 10+ tags (tag wrapping stress test)
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-habit-005',
        title: 'Daily Meditation Practice',
        content: 'Practice mindfulness meditation for at least 10 minutes every morning before checking any devices.',
        type: 'habit',
        status: 'todo',
        priority: 'medium',
        tags: [
            '#meditation',
            '#mindfulness',
            '#morning-routine',
            '#mental-health',
            '#wellness',
            '#self-care',
            '#productivity',
            '#stress-relief',
            '#focus',
            '#daily-habit',
            '#atomic-habits',
            '#personal-growth',
        ],
        scheduling: {
            time: '07:00',
            isRecurring: true,
        },
        meta: {
            estimatedDuration: '10m',
            sentiment: 'Calm and Focused',
            aiReasoning: 'Identified as habit due to recurring nature, time-based trigger, and self-improvement context.',
        },
        createdAt: '2024-12-01T10:00:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 6. EVENT ITEM - Recurring schedule with full details
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-event-006',
        title: 'Team Standup Meeting',
        content: 'Daily sync with the development team to discuss progress, blockers, and priorities for the day.',
        type: 'event',
        status: 'scheduled',
        priority: 'medium',
        tags: ['#work', '#meetings', '#team'],
        scheduling: {
            dueDate: '2024-12-29',
            time: '09:00',
            isRecurring: true,
        },
        meta: {
            estimatedDuration: '15m',
            aiReasoning: 'Detected as event based on meeting-related terminology and specific scheduled time.',
        },
        createdAt: '2024-11-01T08:00:00.000Z',
    },

    // ─────────────────────────────────────────────────────────────
    // 7. PROJECT ITEM - Complex metadata and multiple subtasks
    // ─────────────────────────────────────────────────────────────
    {
        id: 'mock-project-007',
        title: 'Launch Personal Portfolio Website',
        content: 'Design and develop a modern portfolio website showcasing projects, skills, and contact information. Must be responsive and optimized for performance.',
        type: 'project',
        status: 'todo',
        priority: 'high',
        subtasks: [
            '✅ Define site structure and pages',
            '✅ Create wireframes in Figma',
            '☐ Set up Next.js project',
            '☐ Implement responsive design system',
            '☐ Build project showcase section',
            '☐ Add contact form with validation',
            '☐ Optimize images and performance',
            '☐ Deploy to Vercel',
        ],
        tags: ['#portfolio', '#webdev', '#career', '#design', '#nextjs'],
        scheduling: {
            dueDate: '2025-01-15',
            isRecurring: false,
        },
        meta: {
            estimatedDuration: '20h',
            aiReasoning: 'Classified as project due to multi-phase nature, technical scope, and extended timeline.',
            url: 'https://www.figma.com/file/abc123/portfolio-wireframes',
        },
        createdAt: '2024-12-10T16:20:00.000Z',
    },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/** Get mock items filtered by type */
export function getMockItemsByType(type: SparkItemType): SparkItem[] {
    return mockSparkItems.filter(item => item.type === type);
}

/** Get mock items filtered by status */
export function getMockItemsByStatus(status: SparkItemStatus): SparkItem[] {
    return mockSparkItems.filter(item => item.status === status);
}

/** Get mock items filtered by priority */
export function getMockItemsByPriority(priority: SparkItemPriority): SparkItem[] {
    return mockSparkItems.filter(item => item.priority === priority);
}

/** Get a single mock item by ID */
export function getMockItemById(id: string): SparkItem | undefined {
    return mockSparkItems.find(item => item.id === id);
}

/** Get mock items that have subtasks */
export function getMockItemsWithSubtasks(): SparkItem[] {
    return mockSparkItems.filter(item =>
        Array.isArray(item.subtasks) && item.subtasks.length > 0
    );
}

/** Get mock items that have scheduling */
export function getMockItemsWithScheduling(): SparkItem[] {
    return mockSparkItems.filter(item =>
        item.scheduling && (item.scheduling.dueDate || item.scheduling.time)
    );
}

export default mockSparkItems;
