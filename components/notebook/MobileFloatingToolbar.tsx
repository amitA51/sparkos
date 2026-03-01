import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, PlusIcon } from '../icons';

interface MobileFloatingToolbarProps {
  editor: Editor;
}

const MobileFloatingToolbar: React.FC<MobileFloatingToolbarProps> = ({ editor }) => {
  const [bottomOffset, setBottomOffset] = useState(0);

  // Monitor virtual keyboard height
  useEffect(() => {
    if (!editor) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const updatePosition = () => {
      // Calculate how much the viewport has shrunk (keyboard height)
      // We use the difference between window height and visual viewport height
      // plus the visual viewport offset top (scroll)
      const keyboardHeight = window.innerHeight - viewport.height;
      const offset = Math.max(0, keyboardHeight);

      // Only update if significant change (avoid jitter)
      setBottomOffset(prev => {
        if (Math.abs(offset - prev) > 5) {
          return offset;
        }
        return prev;
      });
    };

    viewport.addEventListener('resize', updatePosition);
    viewport.addEventListener('scroll', updatePosition);

    // Initial check
    updatePosition();

    return () => {
      viewport.removeEventListener('resize', updatePosition);
      viewport.removeEventListener('scroll', updatePosition);
    };
  }, [editor]);

  // Early return AFTER hooks
  if (!editor) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50 p-2 pb-safe-area-bottom pointer-events-none transition-all duration-100 ease-out"
      style={{ bottom: bottomOffset }}
    >
      {/* 
               We wrap the toolbar in a container with pointer-events-none so touches pass through 
               outside the bar, but the bar itself needs pointer-events-auto.
           */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto max-w-lg pointer-events-auto"
      >
        <div
          className="flex items-center justify-between px-4 py-2 
                      bg-gray-900/40 backdrop-blur-xl border border-white/10 
                      rounded-2xl shadow-2xl safe-paddings"
        >
          <div className="flex items-center gap-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={<BoldIcon className="w-5 h-5" />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={<ItalicIcon className="w-5 h-5" />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              icon={
                <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center text-[10px]">
                  ✓
                </div>
              } // Custom Checkbox Icon representation
            />
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button
            onClick={() => {
              // Generic Add Block - for now could just focus or open slash menu
              editor.chain().focus().insertContent('/').run();
            }}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, icon }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
      ${
        isActive
          ? 'bg-white text-black shadow-lg scale-105'
          : 'text-theme-secondary hover:text-white hover:bg-white/10'
      }
    `}
  >
    {icon}
  </button>
);

export default MobileFloatingToolbar;
