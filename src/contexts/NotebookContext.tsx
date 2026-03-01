/**
 * NotebookContext
 * State management for the Knowledge & Notes module
 * Handles notebooks, sections, pages, and editor state
 */

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
} from 'react';
import type { ReactNode } from 'react';
import type {
    Notebook,
    NotebookSection,
    NotebookPage,
    TipTapDocument,
    PageTemplate,
} from '../../types';
import * as notebookService from '../../services/notebookFirestoreService';
import { useUser } from './UserContext';

// --- Types ---

interface NavigationState {
    activeNotebookId: string | null;
    activeSectionId: string | null;
    activePageId: string | null;
    navigationStack: Array<{
        notebookId: string | null;
        sectionId: string | null;
        pageId: string | null;
    }>;
}

interface NotebookContextValue {
    // Data
    notebooks: Notebook[];
    sections: NotebookSection[];
    pages: NotebookPage[];
    templates: PageTemplate[];

    // Navigation state
    activeNotebookId: string | null;
    activeSectionId: string | null;
    activePageId: string | null;

    // Active entities (computed)
    activeNotebook: Notebook | null;
    activeSection: NotebookSection | null;
    activePage: NotebookPage | null;

    // Loading states
    isLoading: boolean;
    isSyncing: boolean;
    error: string | null;

    // Notebook actions
    createNotebook: (data: Partial<Notebook>) => Promise<Notebook>;
    updateNotebook: (id: string, updates: Partial<Notebook>) => Promise<void>;
    deleteNotebook: (id: string) => Promise<void>;

    // Section actions
    createSection: (notebookId: string, data: Partial<NotebookSection>) => Promise<NotebookSection>;
    updateSection: (id: string, updates: Partial<NotebookSection>) => Promise<void>;
    deleteSection: (id: string) => Promise<void>;

    // Page actions
    createPage: (sectionId: string, data: Partial<NotebookPage>, templateId?: string) => Promise<NotebookPage>;
    updatePage: (id: string, updates: Partial<NotebookPage>) => Promise<void>;
    updatePageContent: (id: string, content: TipTapDocument) => Promise<void>;
    deletePage: (id: string) => Promise<void>;

    // Navigation
    navigateToNotebook: (id: string) => void;
    navigateToSection: (notebookId: string, sectionId: string) => void;
    navigateToPage: (notebookId: string, sectionId: string, pageId: string) => void;
    navigateBack: () => void;
    navigateToHub: () => void;

    // Utilities
    refreshNotebooks: () => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

const NotebookContext = createContext<NotebookContextValue | undefined>(undefined);

function getNextOrder(items: Array<{ order: number }>): number {
    if (items.length === 0) return 0;
    const maxOrder = items.reduce((max, item) => (item.order > max ? item.order : max), 0);
    return maxOrder + 1000;
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

// --- Provider ---

interface NotebookProviderProps {
    children: ReactNode;
}

export function NotebookProvider({ children }: NotebookProviderProps) {
    const { user } = useUser();
    // Use mock user ID for testing when not authenticated
    const userId = user?.uid || 'mock-user';
    const isMockMode = !user?.uid;

    // Data state
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [sections, setSections] = useState<NotebookSection[]>([]);
    const [pages, setPages] = useState<NotebookPage[]>([]);

    // Navigation state
    const [navigation, setNavigation] = useState<NavigationState>({
        activeNotebookId: null,
        activeSectionId: null,
        activePageId: null,
        navigationStack: [],
    });

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Load notebooks on mount ---
    useEffect(() => {
        if (isMockMode) {
            // In mock mode, load from localStorage
            try {
                const stored = localStorage.getItem('mock_notebooks');
                if (stored) {
                    setNotebooks(JSON.parse(stored));
                }
            } catch (err) {
                console.error('[NotebookContext] Failed to load mock notebooks:', err);
            }
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = notebookService.subscribeToNotebooks(userId, (fetchedNotebooks) => {
            setNotebooks(fetchedNotebooks);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId, isMockMode]);

    // --- Load sections when notebook changes ---
    useEffect(() => {
        if (!navigation.activeNotebookId) {
            setSections([]);
            return;
        }

        if (isMockMode) {
            // Mock mode - load from localStorage
            try {
                const stored = localStorage.getItem(`mock_sections_${navigation.activeNotebookId}`);
                if (stored) {
                    setSections(JSON.parse(stored));
                } else {
                    setSections([]);
                }
            } catch (err) {
                console.error('[NotebookContext] Failed to load mock sections:', err);
                setSections([]);
            }
            return;
        }

        // SAFETY: isMounted guard prevents stale callbacks during rapid navigation
        let isMounted = true;

        const unsubscribe = notebookService.subscribeToSections(
            userId,
            navigation.activeNotebookId,
            (fetchedSections) => {
                if (isMounted) {
                    setSections(fetchedSections);
                }
            }
        );

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [userId, navigation.activeNotebookId, isMockMode]);

    // --- Load pages when section changes ---
    useEffect(() => {
        if (!navigation.activeNotebookId || !navigation.activeSectionId) {
            setPages([]);
            return;
        }

        if (isMockMode) {
            // Mock mode - load from localStorage
            try {
                const stored = localStorage.getItem(`mock_pages_${navigation.activeNotebookId}_${navigation.activeSectionId}`);
                if (stored) {
                    setPages(JSON.parse(stored));
                } else {
                    setPages([]);
                }
            } catch (err) {
                console.error('[NotebookContext] Failed to load mock pages:', err);
                setPages([]);
            }
            return;
        }

        // SAFETY: isMounted guard prevents stale callbacks during rapid navigation
        let isMounted = true;

        const unsubscribe = notebookService.subscribeToPages(
            userId,
            navigation.activeNotebookId,
            navigation.activeSectionId,
            (fetchedPages) => {
                if (isMounted) {
                    setPages(fetchedPages);
                }
            }
        );

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [userId, navigation.activeNotebookId, navigation.activeSectionId, isMockMode]);

    // --- Computed active entities ---
    const activeNotebook = notebooks.find((n) => n.id === navigation.activeNotebookId) || null;
    const activeSection = sections.find((s) => s.id === navigation.activeSectionId) || null;
    const activePage = pages.find((p) => p.id === navigation.activePageId) || null;

    // --- Notebook actions ---
    const createNotebook = useCallback(
        async (data: Partial<Notebook>): Promise<Notebook> => {
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    // Mock mode - save to localStorage
                    const newNotebook: Notebook = {
                        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        userId: 'mock-user',
                        title: data.title || 'מחברת חדשה',
                        icon: data.icon || '📚',
                        color: data.color || '#6366F1',
                        sectionIds: [],
                        isArchived: false,
                        isPinned: false,
                        order: getNextOrder(notebooks),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        ...data,
                    };

                    const updatedNotebooks = [...notebooks, newNotebook];
                    setNotebooks(updatedNotebooks);
                    localStorage.setItem('mock_notebooks', JSON.stringify(updatedNotebooks));
                    return newNotebook;
                }

                // Real mode - save to Firebase
                const notebook = await notebookService.createNotebook(userId, {
                    title: data.title || 'מחברת חדשה',
                    icon: data.icon || '📚',
                    color: data.color || '#6366F1',
                    sectionIds: [],
                    isArchived: false,
                    isPinned: false,
                    order: getNextOrder(notebooks),
                    ...data,
                });
                return notebook;
            } catch (error) {
                console.error('[NotebookContext] Error creating notebook:', error);
                throw error;
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, notebooks]
    );

    const updateNotebook = useCallback(
        async (id: string, updates: Partial<Notebook>): Promise<void> => {
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const updatedNotebooks = notebooks.map(n =>
                        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
                    );
                    setNotebooks(updatedNotebooks);
                    localStorage.setItem('mock_notebooks', JSON.stringify(updatedNotebooks));
                    return;
                }
                await notebookService.updateNotebook(userId, id, updates);
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, notebooks]
    );

    const deleteNotebook = useCallback(
        async (id: string): Promise<void> => {
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const storedSections = safeJsonParse<NotebookSection[]>(
                        localStorage.getItem(`mock_sections_${id}`),
                        []
                    );
                    for (const section of storedSections) {
                        localStorage.removeItem(`mock_pages_${id}_${section.id}`);
                    }

                    localStorage.removeItem(`mock_sections_${id}`);

                    const updatedNotebooks = notebooks.filter((n) => n.id !== id);
                    setNotebooks(updatedNotebooks);
                    localStorage.setItem('mock_notebooks', JSON.stringify(updatedNotebooks));
                } else {
                    await notebookService.deleteNotebookDeep(userId, id);
                }
                if (navigation.activeNotebookId === id) {
                    setNavigation((prev) => ({
                        ...prev,
                        activeNotebookId: null,
                        activeSectionId: null,
                        activePageId: null,
                    }));
                }
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, notebooks, navigation.activeNotebookId]
    );

    // --- Section actions ---
    const createSection = useCallback(
        async (notebookId: string, data: Partial<NotebookSection>): Promise<NotebookSection> => {
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const newSection: NotebookSection = {
                        id: `mock-section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        notebookId,
                        title: data.title || 'סעיף חדש',
                        icon: data.icon,
                        pageIds: [],
                        isCollapsed: false,
                        order: getNextOrder(sections),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        ...data,
                    };
                    const updatedSections = [...sections, newSection];
                    setSections(updatedSections);
                    localStorage.setItem(`mock_sections_${notebookId}`, JSON.stringify(updatedSections));

                    const updatedNotebooks = notebooks.map((n) =>
                        n.id === notebookId
                            ? {
                                ...n,
                                sectionIds: [...(n.sectionIds || []), newSection.id],
                                updatedAt: new Date().toISOString(),
                            }
                            : n
                    );
                    setNotebooks(updatedNotebooks);
                    localStorage.setItem('mock_notebooks', JSON.stringify(updatedNotebooks));
                    return newSection;
                }
                const section = await notebookService.createSection(userId, notebookId, {
                    title: data.title || 'סעיף חדש',
                    icon: data.icon,
                    pageIds: [],
                    isCollapsed: false,
                    order: getNextOrder(sections),
                    ...data,
                });
                return section;
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, sections, notebooks]
    );

    const updateSection = useCallback(
        async (id: string, updates: Partial<NotebookSection>): Promise<void> => {
            if (!navigation.activeNotebookId) throw new Error('No active notebook');
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const updatedSections = sections.map(s =>
                        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
                    );
                    setSections(updatedSections);
                    localStorage.setItem(
                        `mock_sections_${navigation.activeNotebookId}`,
                        JSON.stringify(updatedSections)
                    );
                    return;
                }
                await notebookService.updateSection(userId, navigation.activeNotebookId, id, updates);
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, sections]
    );

    const deleteSection = useCallback(
        async (id: string): Promise<void> => {
            if (!navigation.activeNotebookId) throw new Error('No active notebook');
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    localStorage.removeItem(`mock_pages_${navigation.activeNotebookId}_${id}`);

                    const updatedSections = sections.filter((s) => s.id !== id);
                    setSections(updatedSections);
                    localStorage.setItem(`mock_sections_${navigation.activeNotebookId}`, JSON.stringify(updatedSections));

                    const updatedNotebooks = notebooks.map((n) =>
                        n.id === navigation.activeNotebookId
                            ? {
                                ...n,
                                sectionIds: (n.sectionIds || []).filter((sid) => sid !== id),
                                updatedAt: new Date().toISOString(),
                            }
                            : n
                    );
                    setNotebooks(updatedNotebooks);
                    localStorage.setItem('mock_notebooks', JSON.stringify(updatedNotebooks));
                } else {
                    await notebookService.deleteSection(userId, navigation.activeNotebookId, id);
                }
                if (navigation.activeSectionId === id) {
                    setNavigation((prev) => ({
                        ...prev,
                        activeSectionId: null,
                        activePageId: null,
                    }));
                }
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, navigation.activeSectionId, sections, notebooks]
    );

    // --- Page actions ---
    const createPage = useCallback(
        async (
            sectionId: string,
            data: Partial<NotebookPage>,
            templateId?: string
        ): Promise<NotebookPage> => {
            if (!navigation.activeNotebookId) throw new Error('No active notebook');
            setIsSyncing(true);
            try {
                // Get template content if specified
                let content: TipTapDocument = { type: 'doc', content: [{ type: 'paragraph' }] };
                if (templateId) {
                    const template = notebookService.BUILTIN_TEMPLATES.find((t) => t.id === templateId);
                    if (template) {
                        content = template.content;
                    }
                }

                if (isMockMode) {
                    // Mock mode - save to localStorage
                    const newPage: NotebookPage = {
                        id: `mock-page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        sectionId,
                        notebookId: navigation.activeNotebookId,
                        title: data.title || 'דף חדש',
                        icon: data.icon,
                        content: data.content || content,
                        childPageIds: [],
                        isFavorite: false,
                        templateId,
                        order: getNextOrder(pages),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        lastEditedAt: new Date().toISOString(),
                        ...data,
                    };
                    const updatedPages = [...pages, newPage];
                    setPages(updatedPages);
                    localStorage.setItem(
                        `mock_pages_${navigation.activeNotebookId}_${sectionId}`,
                        JSON.stringify(updatedPages)
                    );

                    const updatedSections = sections.map((s) =>
                        s.id === sectionId
                            ? {
                                ...s,
                                pageIds: [...(s.pageIds || []), newPage.id],
                                updatedAt: new Date().toISOString(),
                            }
                            : s
                    );
                    setSections(updatedSections);
                    localStorage.setItem(`mock_sections_${navigation.activeNotebookId}`, JSON.stringify(updatedSections));
                    return newPage;
                }

                const page = await notebookService.createPage(userId, navigation.activeNotebookId, sectionId, {
                    title: data.title || 'דף חדש',
                    icon: data.icon,
                    content: data.content || content,
                    childPageIds: [],
                    isFavorite: false,
                    templateId,
                    order: getNextOrder(pages),
                    ...data,
                });
                return page;
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, pages, sections]
    );

    const updatePage = useCallback(
        async (id: string, updates: Partial<NotebookPage>): Promise<void> => {
            if (!navigation.activeNotebookId || !navigation.activeSectionId) {
                throw new Error('No active context');
            }
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const updatedPages = pages.map(p =>
                        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString(), lastEditedAt: new Date().toISOString() } : p
                    );
                    setPages(updatedPages);
                    localStorage.setItem(
                        `mock_pages_${navigation.activeNotebookId}_${navigation.activeSectionId}`,
                        JSON.stringify(updatedPages)
                    );
                    return;
                }
                await notebookService.updatePage(
                    userId,
                    navigation.activeNotebookId,
                    navigation.activeSectionId,
                    id,
                    updates
                );
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, navigation.activeSectionId, pages]
    );

    const updatePageContent = useCallback(
        async (id: string, content: TipTapDocument): Promise<void> => {
            if (!navigation.activeNotebookId || !navigation.activeSectionId) {
                throw new Error('No active context');
            }
            // Don't set isSyncing for content updates to avoid UI flicker
            try {
                if (isMockMode) {
                    const updatedPages = pages.map(p =>
                        p.id === id ? { ...p, content, updatedAt: new Date().toISOString(), lastEditedAt: new Date().toISOString() } : p
                    );
                    setPages(updatedPages);
                    localStorage.setItem(
                        `mock_pages_${navigation.activeNotebookId}_${navigation.activeSectionId}`,
                        JSON.stringify(updatedPages)
                    );
                    return;
                }
                await notebookService.updatePageContent(
                    userId,
                    navigation.activeNotebookId,
                    navigation.activeSectionId,
                    id,
                    content
                );
            } catch (err) {
                console.error('Failed to update page content:', err);
                setError('שגיאה בשמירת התוכן');
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, navigation.activeSectionId, pages]
    );

    const deletePage = useCallback(
        async (id: string): Promise<void> => {
            if (!userId || !navigation.activeNotebookId || !navigation.activeSectionId) {
                throw new Error('Not authenticated or no active context');
            }
            setIsSyncing(true);
            try {
                if (isMockMode) {
                    const updatedPages = pages.filter((p) => p.id !== id);
                    setPages(updatedPages);
                    localStorage.setItem(
                        `mock_pages_${navigation.activeNotebookId}_${navigation.activeSectionId}`,
                        JSON.stringify(updatedPages)
                    );

                    const updatedSections = sections.map((s) =>
                        s.id === navigation.activeSectionId
                            ? {
                                ...s,
                                pageIds: (s.pageIds || []).filter((pid) => pid !== id),
                                updatedAt: new Date().toISOString(),
                            }
                            : s
                    );
                    setSections(updatedSections);
                    localStorage.setItem(`mock_sections_${navigation.activeNotebookId}`, JSON.stringify(updatedSections));
                } else {
                    await notebookService.deletePage(
                        userId,
                        navigation.activeNotebookId,
                        navigation.activeSectionId,
                        id
                    );
                }
                if (navigation.activePageId === id) {
                    setNavigation((prev) => ({
                        ...prev,
                        activePageId: null,
                    }));
                }
            } finally {
                setIsSyncing(false);
            }
        },
        [userId, isMockMode, navigation.activeNotebookId, navigation.activeSectionId, navigation.activePageId, pages, sections]
    );

    // --- Navigation ---
    const navigateToNotebook = useCallback((id: string) => {
        setNavigation((prev) => ({
            activeNotebookId: id,
            activeSectionId: null,
            activePageId: null,
            navigationStack: [
                ...prev.navigationStack,
                {
                    notebookId: prev.activeNotebookId,
                    sectionId: prev.activeSectionId,
                    pageId: prev.activePageId,
                },
            ],
        }));
    }, []);

    const navigateToSection = useCallback((notebookId: string, sectionId: string) => {
        setNavigation((prev) => ({
            activeNotebookId: notebookId,
            activeSectionId: sectionId,
            activePageId: null,
            navigationStack: [
                ...prev.navigationStack,
                {
                    notebookId: prev.activeNotebookId,
                    sectionId: prev.activeSectionId,
                    pageId: prev.activePageId,
                },
            ],
        }));
    }, []);

    const navigateToPage = useCallback((notebookId: string, sectionId: string, pageId: string) => {
        setNavigation((prev) => ({
            activeNotebookId: notebookId,
            activeSectionId: sectionId,
            activePageId: pageId,
            navigationStack: [
                ...prev.navigationStack,
                {
                    notebookId: prev.activeNotebookId,
                    sectionId: prev.activeSectionId,
                    pageId: prev.activePageId,
                },
            ],
        }));
    }, []);

    const navigateBack = useCallback(() => {
        setNavigation((prev) => {
            if (prev.navigationStack.length === 0) {
                return {
                    activeNotebookId: null,
                    activeSectionId: null,
                    activePageId: null,
                    navigationStack: [],
                };
            }

            const stack = [...prev.navigationStack];
            const last = stack.pop()!;

            return {
                activeNotebookId: last.notebookId,
                activeSectionId: last.sectionId,
                activePageId: last.pageId,
                navigationStack: stack,
            };
        });
    }, []);

    const navigateToHub = useCallback(() => {
        setNavigation({
            activeNotebookId: null,
            activeSectionId: null,
            activePageId: null,
            navigationStack: [],
        });
    }, []);

    // --- Utilities ---
    const refreshNotebooks = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const fetchedNotebooks = await notebookService.getAllNotebooks(userId);
            setNotebooks(fetchedNotebooks);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const uploadImage = useCallback(
        async (file: File): Promise<string> => {
            if (!userId || !navigation.activeNotebookId) {
                throw new Error('Not authenticated or no active notebook');
            }
            return notebookService.uploadNotebookImage(userId, navigation.activeNotebookId, file);
        },
        [userId, navigation.activeNotebookId]
    );

    // --- Context value (memoized to prevent re-renders) ---
    const value = useMemo<NotebookContextValue>(() => ({
        notebooks,
        sections,
        pages,
        templates: notebookService.BUILTIN_TEMPLATES,
        activeNotebookId: navigation.activeNotebookId,
        activeSectionId: navigation.activeSectionId,
        activePageId: navigation.activePageId,
        activeNotebook,
        activeSection,
        activePage,
        isLoading,
        isSyncing,
        error,
        createNotebook,
        updateNotebook,
        deleteNotebook,
        createSection,
        updateSection,
        deleteSection,
        createPage,
        updatePage,
        updatePageContent,
        deletePage,
        navigateToNotebook,
        navigateToSection,
        navigateToPage,
        navigateBack,
        navigateToHub,
        refreshNotebooks,
        uploadImage,
    }), [
        notebooks, sections, pages, navigation,
        activeNotebook, activeSection, activePage,
        isLoading, isSyncing, error,
        createNotebook, updateNotebook, deleteNotebook,
        createSection, updateSection, deleteSection,
        createPage, updatePage, updatePageContent, deletePage,
        navigateToNotebook, navigateToSection, navigateToPage,
        navigateBack, navigateToHub, refreshNotebooks, uploadImage,
    ]);

    return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>;
}

// --- Hook ---

export function useNotebook(): NotebookContextValue {
    const context = useContext(NotebookContext);
    if (!context) {
        throw new Error('useNotebook must be used within a NotebookProvider');
    }
    return context;
}

export default NotebookContext;
