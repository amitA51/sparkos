/**
 * Notebook Firestore Service
 * Handles all CRUD operations for Notebooks, Sections, and Pages
 * Uses subcollections for scalability: notebooks/{id}/sections/{id}/pages/{id}
 */

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    writeBatch,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getDbInstance, getStorageInstance } from '../config/firebase';
import type {
    Notebook,
    NotebookSection,
    NotebookPage,
    TipTapDocument,
    TipTapNode,
    PageTemplate,
} from '../types';

// --- Helper to get Firestore instance ---
const getDb = () => getDbInstance();
const getStorage = () => getStorageInstance();

// --- Helper to extract plain text from TipTap JSON ---
/**
 * Recursively extracts plain text from a TipTap document.
 * Used to generate plainTextPreview for fast list rendering.
 */
function extractPlainText(content: TipTapDocument, maxLength = 100): string {
    const textParts: string[] = [];
    let totalLength = 0;

    function traverse(nodes: TipTapNode[] | undefined): void {
        if (!nodes) return;
        for (const node of nodes) {
            // Extract text from text nodes
            if (node.text) {
                const remaining = maxLength - totalLength;
                if (remaining <= 0) return;
                const slice = node.text.length > remaining ? node.text.slice(0, remaining) : node.text;
                textParts.push(slice);
                totalLength += slice.length;
            }
            // Recursively traverse child nodes
            if (node.content) {
                traverse(node.content);
            }
            // Early exit if we have enough text
            if (totalLength >= maxLength) return;
        }
    }

    traverse(content.content);
    const fullText = textParts.join(' ').replace(/\s+/g, ' ').trim();
    return fullText.length > maxLength
        ? fullText.substring(0, maxLength).trim() + '...'
        : fullText;
}

// --- Collection References ---

const getNotebooksRef = (userId: string) =>
    collection(getDb(), 'users', userId, 'notebooks');

const getNotebookRef = (userId: string, notebookId: string) =>
    doc(getDb(), 'users', userId, 'notebooks', notebookId);

const getSectionsRef = (userId: string, notebookId: string) =>
    collection(getDb(), 'users', userId, 'notebooks', notebookId, 'sections');

const getSectionRef = (userId: string, notebookId: string, sectionId: string) =>
    doc(getDb(), 'users', userId, 'notebooks', notebookId, 'sections', sectionId);

const getPagesRef = (userId: string, notebookId: string, sectionId: string) =>
    collection(getDb(), 'users', userId, 'notebooks', notebookId, 'sections', sectionId, 'pages');

const getPageRef = (userId: string, notebookId: string, sectionId: string, pageId: string) =>
    doc(getDb(), 'users', userId, 'notebooks', notebookId, 'sections', sectionId, 'pages', pageId);

// --- Notebook CRUD ---

export async function createNotebook(
    userId: string,
    data: Omit<Notebook, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Notebook> {
    const notebooksRef = getNotebooksRef(userId);
    const newDocRef = doc(notebooksRef);
    const now = new Date().toISOString();

    const notebook: Notebook = {
        id: newDocRef.id,
        userId,
        ...data,
        sectionIds: data.sectionIds || [],
        createdAt: now,
        updatedAt: now,
    };

    await setDoc(newDocRef, {
        ...notebook,
        createdAt: Timestamp.fromDate(new Date(now)),
        updatedAt: Timestamp.fromDate(new Date(now)),
    });

    return notebook;
}

export async function getNotebook(userId: string, notebookId: string): Promise<Notebook | null> {
    const docRef = getNotebookRef(userId, notebookId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
    } as Notebook;
}

export async function getAllNotebooks(userId: string): Promise<Notebook[]> {
    const notebooksRef = getNotebooksRef(userId);
    const q = query(notebooksRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as Notebook;
    });
}

export async function updateNotebook(
    userId: string,
    notebookId: string,
    updates: Partial<Notebook>
): Promise<void> {
    const docRef = getNotebookRef(userId, notebookId);
    await setDoc(
        docRef,
        {
            ...updates,
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );
}

export async function deleteNotebook(userId: string, notebookId: string): Promise<void> {
    // Note: This does NOT delete subcollections (sections/pages) automatically
    // In production, use a Cloud Function or batch delete
    const docRef = getNotebookRef(userId, notebookId);
    await deleteDoc(docRef);
}

// --- Section CRUD ---

export async function createSection(
    userId: string,
    notebookId: string,
    data: Omit<NotebookSection, 'id' | 'notebookId' | 'createdAt' | 'updatedAt'>
): Promise<NotebookSection> {
    const sectionsRef = getSectionsRef(userId, notebookId);
    const newDocRef = doc(sectionsRef);
    const now = new Date().toISOString();

    const section: NotebookSection = {
        id: newDocRef.id,
        notebookId,
        ...data,
        pageIds: data.pageIds || [],
        createdAt: now,
        updatedAt: now,
    };

    await setDoc(newDocRef, {
        ...section,
        createdAt: Timestamp.fromDate(new Date(now)),
        updatedAt: Timestamp.fromDate(new Date(now)),
    });

    // Update parent notebook's sectionIds (atomic)
    await setDoc(
        getNotebookRef(userId, notebookId),
        {
            sectionIds: arrayUnion(section.id),
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );

    return section;
}

export async function getSectionsForNotebook(
    userId: string,
    notebookId: string
): Promise<NotebookSection[]> {
    const sectionsRef = getSectionsRef(userId, notebookId);
    const q = query(sectionsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as NotebookSection;
    });
}

export async function updateSection(
    userId: string,
    notebookId: string,
    sectionId: string,
    updates: Partial<NotebookSection>
): Promise<void> {
    const docRef = getSectionRef(userId, notebookId, sectionId);
    await setDoc(
        docRef,
        {
            ...updates,
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );
}

export async function deleteSection(
    userId: string,
    notebookId: string,
    sectionId: string
): Promise<void> {
    const docRef = getSectionRef(userId, notebookId, sectionId);
    await deleteDoc(docRef);

    // Update parent notebook's sectionIds (atomic)
    await setDoc(
        getNotebookRef(userId, notebookId),
        {
            sectionIds: arrayRemove(sectionId),
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );
}

// --- Page CRUD ---

export async function createPage(
    userId: string,
    notebookId: string,
    sectionId: string,
    data: Omit<NotebookPage, 'id' | 'sectionId' | 'notebookId' | 'createdAt' | 'updatedAt' | 'lastEditedAt'>
): Promise<NotebookPage> {
    const pagesRef = getPagesRef(userId, notebookId, sectionId);
    const newDocRef = doc(pagesRef);
    const now = new Date().toISOString();

    const page: NotebookPage = {
        id: newDocRef.id,
        sectionId,
        notebookId,
        ...data,
        childPageIds: data.childPageIds || [],
        createdAt: now,
        updatedAt: now,
        lastEditedAt: now,
    };

    await setDoc(newDocRef, {
        ...page,
        createdAt: Timestamp.fromDate(new Date(now)),
        updatedAt: Timestamp.fromDate(new Date(now)),
        lastEditedAt: Timestamp.fromDate(new Date(now)),
    });

    // Update parent section's pageIds (atomic)
    await setDoc(
        getSectionRef(userId, notebookId, sectionId),
        {
            pageIds: arrayUnion(page.id),
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );

    return page;
}

export async function getPage(
    userId: string,
    notebookId: string,
    sectionId: string,
    pageId: string
): Promise<NotebookPage | null> {
    const docRef = getPageRef(userId, notebookId, sectionId, pageId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        lastEditedAt: data.lastEditedAt?.toDate?.()?.toISOString() || data.lastEditedAt,
    } as NotebookPage;
}

export async function getPagesForSection(
    userId: string,
    notebookId: string,
    sectionId: string
): Promise<NotebookPage[]> {
    const pagesRef = getPagesRef(userId, notebookId, sectionId);
    const q = query(pagesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
            ...data,
            id: docSnap.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            lastEditedAt: data.lastEditedAt?.toDate?.()?.toISOString() || data.lastEditedAt,
        } as NotebookPage;
    });
}

export async function updatePage(
    userId: string,
    notebookId: string,
    sectionId: string,
    pageId: string,
    updates: Partial<NotebookPage>
): Promise<void> {
    const docRef = getPageRef(userId, notebookId, sectionId, pageId);
    await setDoc(
        docRef,
        {
            ...updates,
            updatedAt: Timestamp.now(),
            lastEditedAt: Timestamp.now(),
        },
        { merge: true }
    );
}

export async function updatePageContent(
    userId: string,
    notebookId: string,
    sectionId: string,
    pageId: string,
    content: TipTapDocument
): Promise<void> {
    // Extract plain text preview for fast list rendering
    const plainTextPreview = extractPlainText(content, 100);
    await updatePage(userId, notebookId, sectionId, pageId, { content, plainTextPreview });
}

export async function deletePage(
    userId: string,
    notebookId: string,
    sectionId: string,
    pageId: string
): Promise<void> {
    const docRef = getPageRef(userId, notebookId, sectionId, pageId);
    await deleteDoc(docRef);

    // Update parent section's pageIds (atomic)
    await setDoc(
        getSectionRef(userId, notebookId, sectionId),
        {
            pageIds: arrayRemove(pageId),
            updatedAt: Timestamp.now(),
        },
        { merge: true }
    );
}

export async function deleteNotebookDeep(userId: string, notebookId: string): Promise<void> {
    const sectionsRef = getSectionsRef(userId, notebookId);
    const sectionsSnap = await getDocs(sectionsRef);

    // Delete pages in every section
    for (const sectionDoc of sectionsSnap.docs) {
        const sectionId = sectionDoc.id;
        const pagesRef = getPagesRef(userId, notebookId, sectionId);
        const pagesSnap = await getDocs(pagesRef);

        let batch = writeBatch(getDb());
        let ops = 0;
        for (const pageDoc of pagesSnap.docs) {
            batch.delete(pageDoc.ref);
            ops += 1;
            if (ops >= 450) {
                await batch.commit();
                batch = writeBatch(getDb());
                ops = 0;
            }
        }
        if (ops > 0) {
            await batch.commit();
        }

        // Delete the section document itself
        await deleteDoc(getSectionRef(userId, notebookId, sectionId));
    }

    // Finally delete the notebook document
    await deleteDoc(getNotebookRef(userId, notebookId));
}

// --- Real-time Subscriptions ---

export function subscribeToNotebooks(
    userId: string,
    callback: (notebooks: Notebook[]) => void,
    onError?: (error: Error) => void
): () => void {
    const notebooksRef = getNotebooksRef(userId);
    const q = query(notebooksRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const notebooks = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    ...data,
                    id: docSnap.id,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                } as Notebook;
            });
            callback(notebooks);
        },
        (error) => {
            console.error('[NotebookService] subscribeToNotebooks error:', error);
            // Still call callback with empty array to prevent loading stuck
            callback([]);
            onError?.(error);
        }
    );

    return unsubscribe;
}

export function subscribeToSections(
    userId: string,
    notebookId: string,
    callback: (sections: NotebookSection[]) => void
): () => void {
    const sectionsRef = getSectionsRef(userId, notebookId);
    const q = query(sectionsRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const sections = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
            } as NotebookSection;
        });
        callback(sections);
    });

    return unsubscribe;
}

export function subscribeToPages(
    userId: string,
    notebookId: string,
    sectionId: string,
    callback: (pages: NotebookPage[]) => void
): () => void {
    const pagesRef = getPagesRef(userId, notebookId, sectionId);
    const q = query(pagesRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const pages = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                lastEditedAt: data.lastEditedAt?.toDate?.()?.toISOString() || data.lastEditedAt,
            } as NotebookPage;
        });
        callback(pages);
    });

    return unsubscribe;
}

// --- Image Upload to Firebase Storage ---

export async function uploadNotebookImage(
    userId: string,
    notebookId: string,
    file: File
): Promise<string> {
    const imageId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const extension = file.type.split('/')[1] || 'webp';
    const storagePath = `users/${userId}/notebooks/${notebookId}/images/${imageId}.${extension}`;

    const storageRef = ref(getStorage(), storagePath);
    await uploadBytes(storageRef, file);

    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}

export async function deleteNotebookImage(storagePath: string): Promise<void> {
    const storageRef = ref(getStorage(), storagePath);
    await deleteObject(storageRef);
}

// --- Built-in Page Templates ---

export const BUILTIN_TEMPLATES: PageTemplate[] = [
    {
        id: 'blank',
        name: 'Blank',
        nameHe: 'ריק',
        icon: '📄',
        isBuiltin: true,
        category: 'productivity',
        content: {
            type: 'doc',
            content: [{ type: 'paragraph' }],
        },
    },
    {
        id: 'daily-log',
        name: 'Daily Log',
        nameHe: 'יומן יומי',
        icon: '📅',
        isBuiltin: true,
        category: 'journaling',
        content: {
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📅 יומן יומי' }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '🙏 תודות' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '✅ משימות להיום' }] },
                { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '💭 הערות' }] },
                { type: 'paragraph' },
            ],
        },
    },
    {
        id: 'meeting-notes',
        name: 'Meeting Notes',
        nameHe: 'סיכום פגישה',
        icon: '🤝',
        isBuiltin: true,
        category: 'productivity',
        content: {
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🤝 סיכום פגישה' }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '👥 משתתפים' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '📋 סדר יום' }] },
                { type: 'orderedList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '🎯 פעולות נדרשות' }] },
                { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }] },
            ],
        },
    },
    {
        id: 'project-plan',
        name: 'Project Plan',
        nameHe: 'תכנית פרויקט',
        icon: '🎯',
        isBuiltin: true,
        category: 'planning',
        content: {
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '🎯 תכנית פרויקט' }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '📖 סקירה כללית' }] },
                { type: 'paragraph' },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '🏁 אבני דרך' }] },
                { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '📝 הערות' }] },
                { type: 'paragraph' },
            ],
        },
    },
    {
        id: 'weekly-review',
        name: 'Weekly Review',
        nameHe: 'סיכום שבועי',
        icon: '📊',
        isBuiltin: true,
        category: 'journaling',
        content: {
            type: 'doc',
            content: [
                { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '📊 סיכום שבועי' }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '🏆 הצלחות השבוע' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '💪 אתגרים' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '📚 לקחים' }] },
                { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }] },
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: '🎯 מטרות לשבוע הבא' }] },
                { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }] },
            ],
        },
    },
];
