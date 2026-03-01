/**
 * useImageUpload Hook
 * Optimistic image upload pipeline for TipTap editor
 * 
 * Features:
 * - Instant preview using local blob URLs
 * - Loading indicator on uploading images
 * - Background Firebase Storage upload
 * - Silent URL swap from blob to https
 * - Blob Save Protection: prevents Firestore sync with temporary URLs
 */

import { useState, useCallback, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { uploadNotebookImage } from '../services/notebookFirestoreService';

interface UploadingImage {
    blobUrl: string;
    realUrl?: string;
    status: 'uploading' | 'completed' | 'failed';
}

interface UseImageUploadReturn {
    /** Upload an image file and insert it into the editor with optimistic preview */
    uploadImage: (file: File, editor: Editor) => Promise<void>;
    /** Whether any images are currently uploading */
    isUploading: boolean;
    /** Map of blob URLs to their upload status */
    uploadingImages: Map<string, UploadingImage>;
    /** Check if content is safe to save (no blob: URLs) */
    isSafeToSave: (editor: Editor) => boolean;
    /** Error message if last upload failed */
    error: string | null;
}

/**
 * Hook for optimistic image uploads in the notebook editor
 * 
 * @param userId - Current user ID
 * @param notebookId - Current notebook ID
 */
export function useImageUpload(userId: string, notebookId: string): UseImageUploadReturn {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const uploadingImagesRef = useRef<Map<string, UploadingImage>>(new Map());
    const [uploadingImages, setUploadingImages] = useState<Map<string, UploadingImage>>(new Map());

    /**
     * SAFETY: Blob Save Protection
     * Check if editor content contains any blob: URLs that shouldn't be saved to Firestore
     */
    const isSafeToSave = useCallback((editor: Editor): boolean => {
        const html = editor.getHTML();
        // Check for blob URLs that would corrupt the database
        return !html.includes('src="blob:');
    }, []);

    /**
     * Check if all pending uploads are complete
     */
    const areAllUploadsComplete = useCallback((): boolean => {
        for (const img of uploadingImagesRef.current.values()) {
            if (img.status === 'uploading') {
                return false;
            }
        }
        return true;
    }, []);

    /**
     * Upload an image with optimistic preview
     * 
     * Step A: Immediately insert with blob URL
     * Step B: Mark with loading state (data attribute)
     * Step C: Upload to Firebase in background
     * Step D: Swap blob URL with real Firebase URL
     */
    const uploadImage = useCallback(async (file: File, editor: Editor): Promise<void> => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('קובץ זה אינו תמונה');
            return;
        }

        // Limit file size (10MB)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setError('התמונה גדולה מדי (מקסימום 10MB)');
            return;
        }

        setError(null);
        setIsUploading(true);

        // Step A: Create local blob URL for instant preview
        const blobUrl = URL.createObjectURL(file);

        // Track this upload
        const uploadInfo: UploadingImage = {
            blobUrl,
            status: 'uploading',
        };
        uploadingImagesRef.current.set(blobUrl, uploadInfo);
        setUploadingImages(new Map(uploadingImagesRef.current));

        // Step B: Insert image into editor with loading indicator (data attribute)
        editor
            .chain()
            .focus()
            .setImage({
                src: blobUrl,
                alt: file.name,
                title: file.name,
            })
            .run();

        // Add uploading attribute to the image node
        // We'll look for the image with this blob URL and mark it
        setTimeout(() => {
            const { state } = editor;
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === blobUrl) {
                    editor
                        .chain()
                        .setNodeSelection(pos)
                        .updateAttributes('image', { 'data-uploading': 'true' })
                        .run();
                    return false; // Stop iteration
                }
                return true;
            });
        }, 100);

        try {
            // Step C: Upload to Firebase Storage in background
            const realUrl = await uploadNotebookImage(userId, notebookId, file);

            // Update tracking
            uploadInfo.realUrl = realUrl;
            uploadInfo.status = 'completed';
            uploadingImagesRef.current.set(blobUrl, uploadInfo);
            setUploadingImages(new Map(uploadingImagesRef.current));

            // Step D: Swap blob URL with real Firebase URL
            const { state } = editor;
            let imagePos: number | null = null;

            state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === blobUrl) {
                    imagePos = pos;
                    return false;
                }
                return true;
            });

            if (imagePos !== null) {
                editor
                    .chain()
                    .setNodeSelection(imagePos)
                    .updateAttributes('image', {
                        src: realUrl,
                        'data-uploading': null, // Remove loading indicator
                    })
                    .run();
            }

            // Clean up blob URL
            URL.revokeObjectURL(blobUrl);
            uploadingImagesRef.current.delete(blobUrl);
            setUploadingImages(new Map(uploadingImagesRef.current));

        } catch (uploadError) {
            console.error('[useImageUpload] Upload failed:', uploadError);

            // Mark as failed
            uploadInfo.status = 'failed';
            uploadingImagesRef.current.set(blobUrl, uploadInfo);
            setUploadingImages(new Map(uploadingImagesRef.current));

            setError('העלאת התמונה נכשלה');

            // Mark the image in the editor as failed
            const { state } = editor;
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === blobUrl) {
                    editor
                        .chain()
                        .setNodeSelection(pos)
                        .updateAttributes('image', {
                            'data-uploading': null,
                            'data-upload-failed': 'true',
                        })
                        .run();
                    return false;
                }
                return true;
            });

            // Clean up blob URL on failure too (to prevent database corruption)
            // Option: Remove the failed image from editor
            // For now, we leave it with failed state so user can see and retry
        } finally {
            // Update uploading state based on remaining uploads
            if (areAllUploadsComplete()) {
                setIsUploading(false);
            }
        }
    }, [userId, notebookId, areAllUploadsComplete]);

    return {
        uploadImage,
        isUploading,
        uploadingImages,
        isSafeToSave,
        error,
    };
}

export default useImageUpload;
