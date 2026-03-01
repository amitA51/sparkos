import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tiptap/react';
import {
    Heading1Icon,
    Heading2Icon,
    ListIcon,
    CheckSquareIcon,
    QuoteIcon,
    CodeIcon,
    ImageIcon,
} from '../icons';

interface EditorSlashMenuProps {
    editor: Editor;
    onUploadImage?: () => void;
}

interface CommandItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
}

const EditorSlashMenu: React.FC<EditorSlashMenuProps> = ({ editor, onUploadImage }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, flip: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [query, setQuery] = useState('');

    const items: CommandItem[] = [
        {
            id: 'h1',
            label: 'כותרת גדולה',
            icon: <Heading1Icon className="w-5 h-5 text-purple-400" />,
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            id: 'h2',
            label: 'כותרת בינונית',
            icon: <Heading2Icon className="w-5 h-5 text-pink-400" />,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            id: 'todo',
            label: 'רשימת מטלות',
            icon: <CheckSquareIcon className="w-5 h-5 text-accent-cyan" />,
            action: () => editor.chain().focus().toggleTaskList().run(),
        },
        {
            id: 'bullet',
            label: 'רשימה',
            icon: <ListIcon className="w-5 h-5 text-blue-400" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            id: 'quote',
            label: 'ציטוט',
            icon: <QuoteIcon className="w-5 h-5 text-yellow-400" />,
            action: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
            id: 'code',
            label: 'קוד',
            icon: <CodeIcon className="w-5 h-5 text-green-400" />,
            action: () => editor.chain().focus().toggleCodeBlock().run(),
        },
        {
            id: 'image',
            label: 'תמונה',
            icon: <ImageIcon className="w-5 h-5 text-orange-400" />,
            action: () => {
                // SAFETY: No fallback to window.prompt (forbidden API)
                // onUploadImage is always provided by NotebookEditor
                if (onUploadImage) {
                    onUploadImage();
                } else {
                    console.warn('[EditorSlashMenu] onUploadImage not provided');
                }
            },
        },
    ];

    // Filter items based on query
    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (!editor) return;

        const updateHandler = () => {
            const { selection } = editor.state;
            const textBefore = editor.state.doc.textBetween(
                Math.max(0, selection.from - 10),
                selection.from,
                '\n'
            );

            // Regex to match slash command: / followed by non-whitespace
            const match = textBefore.match(/\/(.*)$/);

            if (match) {
                const cmdQuery = match[1] ?? '';
                // Only show if no spaces in query (simple implementation)
                if (!cmdQuery.includes(' ')) {
                    const coords = editor.view.coordsAtPos(selection.from);

                    // Trigger haptic only if specifically transitioning from hidden to visible
                    if (!isVisible && navigator.vibrate) {
                        navigator.vibrate(10);
                    }

                    setIsVisible(true);
                    setQuery(cmdQuery);

                    // Calculate position and flip logic
                    const viewportHeight = window.innerHeight;
                    const spaceBelow = viewportHeight - coords.bottom;
                    const MENU_HEIGHT = 280; // Approximate height of menu
                    const shouldFlip = spaceBelow < MENU_HEIGHT;

                    setPosition({
                        // If flipping, we position above cursor (top - height). 
                        // Otherwise below (bottom + margin)
                        top: shouldFlip ? coords.top - MENU_HEIGHT - 10 : coords.bottom + 10,
                        left: coords.left,
                        flip: shouldFlip
                    });
                    return;
                }
            }

            setIsVisible(false);
            setQuery('');
            setSelectedIndex(0);
        };

        editor.on('transaction', updateHandler);
        editor.on('selectionUpdate', updateHandler);

        return () => {
            editor.off('transaction', updateHandler);
            editor.off('selectionUpdate', updateHandler);
        };
    }, [editor, isVisible]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isVisible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    selectItem(filteredItems[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                setIsVisible(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [isVisible, filteredItems, selectedIndex, editor]);

    const selectItem = (item: CommandItem) => {
        const { selection } = editor.state;
        const range = selection.from;

        // Delete the slash command text
        editor.chain().focus()
            .deleteRange({ from: range - (query.length + 1), to: range })
            .run();

        item.action();
        setIsVisible(false);
    };

    if (!isVisible || filteredItems.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: position.flip ? 10 : -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 60
                    }}
                    className={`w-64 overflow-hidden bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex flex-col 
                        ${position.flip ? 'origin-bottom' : 'origin-top'}
                    `}
                >
                    <div className="p-2 text-xs font-medium text-theme-muted border-b border-white/5 mx-2 mb-1">
                        פקודות בסיסיות
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                        {filteredItems.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => selectItem(item)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full flex items-center gap-3 px-3 py-3 min-h-[48px] text-right transition-colors
                                    ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}
                                `}
                            >
                                <div className="p-1 rounded bg-white/5 border border-white/5">
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white">
                                        {item.label}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditorSlashMenu;
