/**
 * NotebookEditor
 * TipTap-based rich text editor for notebook pages
 * Features RTL support, dark mode, and mobile-first design
 */

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
// TODO: BubbleMenu needs refactoring for TipTap v3 - use extension-based approach
// import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import { useUser } from '../../src/contexts/UserContext';
import useImageUpload from '../../hooks/useImageUpload';
import type { TipTapDocument } from '../../types';
import MobileFloatingToolbar from './MobileFloatingToolbar';
import EditorSlashMenu from './EditorSlashMenu';

interface NotebookEditorProps {
    pageId: string;
    initialContent?: TipTapDocument;
    onContentChange?: (content: TipTapDocument) => void;
    placeholder?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
}

// Debounce helper
function debounce<T extends (content: TipTapDocument) => void>(
    fn: T,
    delay: number
): (content: TipTapDocument) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (content: TipTapDocument) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(content), delay);
    };
}

const NotebookEditor: React.FC<NotebookEditorProps> = ({
    pageId,
    initialContent,
    onContentChange,
    placeholder = 'התחל לכתוב...',
    autoFocus = true,
    readOnly = false,
}) => {
    const { updatePageContent, isSyncing, activeNotebook } = useNotebook();
    const { user } = useUser();
    const lastSavedContent = useRef<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image Upload Hook
    const { uploadImage, isUploading, isSafeToSave } = useImageUpload(
        user?.uid || '',
        activeNotebook?.id || ''
    );

    // PERFORMANCE: Use ref to persist debounced function across renders
    const debouncedSaveRef = useRef<((content: TipTapDocument) => void) | null>(null);

    // Initialize debounced save function once
    useEffect(() => {
        debouncedSaveRef.current = debounce((content: TipTapDocument) => {
            const contentStr = JSON.stringify(content);
            // Only save if content actually changed
            if (contentStr !== lastSavedContent.current) {
                lastSavedContent.current = contentStr;
                updatePageContent(pageId, content);
                onContentChange?.(content);
            }
        }, 1000);
    }, [pageId, updatePageContent, onContentChange]);

    // Initialize TipTap editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Image,
            Link.configure({
                autolink: true,           // Automatically detect URLs and emails
                openOnClick: false,       // Don't open links on click (avoid accidental navigation)
                HTMLAttributes: {
                    target: '_blank',     // Open links in new tab
                    rel: 'noopener noreferrer',
                },
            }),
        ],
        content: initialContent || { type: 'doc', content: [{ type: 'paragraph' }] },
        editable: !readOnly,
        autofocus: autoFocus ? 'end' : false,
        editorProps: {
            attributes: {
                class: 'notebook-editor prose prose-invert prose-lg max-w-none focus:outline-none pb-32 px-4', // Added padding bottom for floating toolbar
                dir: 'auto',
            },
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON() as TipTapDocument;
            // CRITICAL SAFETY: Do NOT save if image is uploading (blob: URLs)
            if (isSafeToSave(editor) && debouncedSaveRef.current) {
                debouncedSaveRef.current(json);
            }
        },
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editor) {
            await uploadImage(file, editor);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Update content when page changes
    useEffect(() => {
        if (editor && initialContent) {
            const currentContent = JSON.stringify(editor.getJSON());
            const newContent = JSON.stringify(initialContent);
            if (currentContent !== newContent) {
                editor.commands.setContent(initialContent);
                lastSavedContent.current = newContent;
            }
        }
    }, [editor, initialContent]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            editor?.destroy();
        };
    }, [editor]);

    if (!editor) {
        return (
            <div className="animate-pulse space-y-3 p-4">
                <div className="h-6 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
            </div>
        );
    }

    return (
        <div className="relative min-h-[300px] h-full">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            {/* Saving / Uploading indicator */}
            <AnimatePresence>
                {(isSyncing || isUploading) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-20 left-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-white/80 shadow-lg"
                    >
                        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                        <span>{isUploading ? 'מעלה תמונה...' : 'שומר...'}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TODO: Bubble Menu (iOS/Notion Style) - needs TipTap v3 refactoring */}
            {/* BubbleMenu component not available in @tiptap/react v3, needs custom implementation */}

            {/* Context Slash Menu */}
            <EditorSlashMenu
                editor={editor}
                onUploadImage={() => fileInputRef.current?.click()}
            />

            {/* Editor Content */}
            <EditorContent
                editor={editor}
                className="h-full"
            />

            {/* Mobile Floating Toolbar */}
            {!readOnly && <MobileFloatingToolbar editor={editor} />}

            {/* Editor Styles */}
            <style>{`
        .notebook-editor {
          min-height: 300px;
          color: white;
          font-family: inherit;
          line-height: 1.7;
        }

        /* Image Uploading State */
        .notebook-editor img[data-uploading="true"] {
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }

        .notebook-editor img[data-upload-failed="true"] {
            border: 2px solid red;
        }

        .notebook-editor.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }

        .notebook-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }

        .notebook-editor h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: white;
          line-height: 1.2;
        }

        .notebook-editor h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: white;
          line-height: 1.3;
        }

        .notebook-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: white;
        }

        .notebook-editor p {
          margin-bottom: 0.75rem;
        }

        .notebook-editor ul,
        .notebook-editor ol {
          padding-right: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .notebook-editor li {
          margin-bottom: 0.25rem;
        }

        .notebook-editor blockquote {
          border-right: 3px solid var(--dynamic-accent-color, #06b6d4);
          background: rgba(255,255,255,0.03);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          margin-right: 0;
          color: #e5e7eb;
          font-style: italic;
        }

        .notebook-editor code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: ui-monospace, monospace;
          font-size: 0.9em;
          color: #fca5a5;
        }

        .notebook-editor pre {
          background: #1e1e1e;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .notebook-editor pre code {
          background: none;
          padding: 0;
          color: #e5e7eb;
        }

        .notebook-editor a {
          color: var(--dynamic-accent-color, #06b6d4);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .notebook-editor strong {
          font-weight: 700;
          color: white;
        }

        .notebook-editor em {
          font-style: italic;
        }

        .notebook-editor s {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .notebook-editor img {
            border-radius: 0.75rem;
            max-width: 100%;
            height: auto;
            margin: 1rem 0;
            border: 1px solid rgba(255,255,255,0.1);
        }

        /* Task list styling */
        .notebook-editor ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }

        .notebook-editor ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .notebook-editor ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-top: 0.1rem;
          user-select: none;
        }

        .notebook-editor ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        
        /* Custom checkbox style */
        .notebook-editor input[type="checkbox"] {
            appearance: none;
            width: 1.2em;
            height: 1.2em;
            border: 2px solid #525252;
            border-radius: 0.25rem;
            cursor: pointer;
            position: relative;
            background-color: transparent;
            transition: all 0.2s ease;
        }
        
        .notebook-editor input[type="checkbox"]:checked {
            background-color: #06b6d4;
            border-color: #06b6d4;
        }
        
        .notebook-editor input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 1px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        /* Focus styles */
        .notebook-editor:focus-visible {
          outline: none;
        }
      `}</style>
        </div>
    );
};

// Bubble Menu Button
export const BubbleButton: React.FC<{ onClick: () => void; isActive: boolean; icon: React.ReactNode }> = ({
    onClick,
    isActive,
    icon,
}) => (
    <button
        onClick={onClick}
        className={`
      p-2 hover:bg-white/20 rounded-full transition-colors
      ${isActive ? 'text-accent-cyan bg-white/10' : 'text-white'}
    `}
    >
        {icon}
    </button>
);

export default NotebookEditor;
