import React, { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbulbIcon, PlusIcon, CloseIcon } from '../icons';
import { useData } from '../../src/contexts/DataContext';
import type { PersonalItem } from '../../types';

// ============================================================================
// Types
// ============================================================================

interface NotePreview {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: string;
  color: string;
}

// ============================================================================
// Constants
// ============================================================================

const STICKY_COLORS = [
  'from-amber-500/15 to-yellow-400/10',
  'from-rose-500/15 to-pink-400/10',
  'from-sky-500/15 to-cyan-400/10',
  'from-emerald-500/15 to-teal-400/10',
  'from-violet-500/15 to-purple-400/10',
];

const BORDER_COLORS = [
  'border-amber-500/20',
  'border-rose-500/20',
  'border-sky-500/20',
  'border-emerald-500/20',
  'border-violet-500/20',
];

// ============================================================================
// Helpers
// ============================================================================

function getRecentNotes(personalItems: PersonalItem[]): NotePreview[] {
  // Get notes, sparks, and ideas -- sorted by most recent
  const noteTypes = ['note', 'spark', 'idea', 'link'];

  return personalItems
    .filter(item => noteTypes.includes(item.type) && !item.isArchived)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    )
    .slice(0, 3)
    .map((item, index) => ({
      id: item.id,
      title: item.title || getDefaultTitle(item.type),
      content: item.content || '',
      createdAt: item.createdAt,
      type: item.type,
      color: STICKY_COLORS[index % STICKY_COLORS.length] as string,
    }));
}

function getDefaultTitle(type: string): string {
  switch (type) {
    case 'note':
      return 'פתק';
    case 'spark':
      return 'ניצוץ';
    case 'idea':
      return 'רעיון';
    case 'link':
      return 'קישור';
    default:
      return 'פתק';
  }
}

function getTypeEmoji(type: string): string {
  switch (type) {
    case 'note':
      return '📝';
    case 'spark':
      return '✨';
    case 'idea':
      return '💡';
    case 'link':
      return '🔗';
    default:
      return '📝';
  }
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'עכשיו';
  if (diffMins < 60) return `לפני ${diffMins} דק'`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `לפני ${diffHours} שע'`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'אתמול';
  if (diffDays < 7) return `לפני ${diffDays} ימים`;

  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// ============================================================================
// Sub-Components
// ============================================================================

interface NoteDetailModalProps {
  note: NotePreview;
  onClose: () => void;
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({ note, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md bg-[var(--bg-card)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeEmoji(note.type)}</span>
            <h3 className="font-bold text-white text-base">{note.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
            {note.content || 'אין תוכן'}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-theme-muted">
            {formatRelativeTime(note.createdAt)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

interface QuickNotesWidgetProps {
  onAddSpark?: () => void;
}

const QuickNotesWidget: React.FC<QuickNotesWidgetProps> = ({ onAddSpark }) => {
  const { personalItems } = useData();
  const [expandedNote, setExpandedNote] = useState<NotePreview | null>(null);

  const notes = useMemo(() => getRecentNotes(personalItems), [personalItems]);

  const handleNoteClick = useCallback((note: NotePreview) => {
    setExpandedNote(note);
  }, []);

  const handleCloseModal = useCallback(() => {
    setExpandedNote(null);
  }, []);

  const hasNotes = notes.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="spark-card relative overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/12 via-yellow-400/8 to-transparent pointer-events-none" />

        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center">
                <LightbulbIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm tracking-tight">
                  פתקים אחרונים
                </h3>
                <p className="text-xs text-theme-secondary">
                  {hasNotes ? `${notes.length} אחרונים` : 'אין פתקים'}
                </p>
              </div>
            </div>

            {onAddSpark && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddSpark}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: 'var(--dynamic-accent-color, rgba(245, 158, 11, 0.15))',
                  color: 'var(--dynamic-accent-start, #f59e0b)',
                  border: '1px solid var(--dynamic-accent-start, rgba(245, 158, 11, 0.3))',
                }}
              >
                <PlusIcon className="w-3.5 h-3.5" />
                ניצוץ חדש
              </motion.button>
            )}
          </div>

          {/* Notes list */}
          {hasNotes ? (
            <div className="space-y-2.5">
              {notes.map((note, index) => (
                <motion.button
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleNoteClick(note)}
                  className={`w-full text-right rounded-xl bg-gradient-to-br ${note.color} border ${BORDER_COLORS[index % BORDER_COLORS.length]} p-3.5 hover:scale-[1.01] transition-transform cursor-pointer group`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {getTypeEmoji(note.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white mb-1 truncate">
                        {note.title}
                      </p>
                      {note.content && (
                        <div className="relative">
                          <p className="text-xs text-theme-secondary leading-relaxed line-clamp-2">
                            {truncateText(note.content, 100)}
                          </p>
                          {/* Fade-out effect */}
                          {note.content.length > 80 && (
                            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[var(--bg-card)] to-transparent pointer-events-none opacity-50" />
                          )}
                        </div>
                      )}
                      <p className="text-[10px] text-theme-muted mt-1.5">
                        {formatRelativeTime(note.createdAt)}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <span className="text-3xl block mb-3">✨</span>
              <p className="text-sm text-theme-secondary">
                אין פתקים עדיין
              </p>
              <p className="text-xs text-theme-muted mt-1.5">
                הניצוצות והפתקים האחרונים שלך יופיעו כאן
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {expandedNote && (
          <NoteDetailModal note={expandedNote} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(QuickNotesWidget);
