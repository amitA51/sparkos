import React, { useRef, useState, useCallback } from 'react';
import { ViewProps, EditProps, MarkdownToolbar, inputStyles } from './common';
import MarkdownRenderer from '../MarkdownRenderer';
import { CalendarIcon } from '../icons';
import SecureNoteEditor from '../notes/SecureNoteEditor';

export const GenericView: React.FC<ViewProps> = ({ item, onUpdate }) => {
  const hasReminder = !!item.dueDate;
  const formattedDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString('he-IL') : '';

  // State for decrypted content when note is encrypted
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [, setUnlockPassword] = useState<string | null>(null);

  const handleContentDecrypted = useCallback((content: string, password: string) => {
    setDecryptedContent(content);
    setUnlockPassword(password);
  }, []);

  const handleContentEncrypted = useCallback((encryptedData: { iv: string; data: string; salt: string }, _password: string) => {
    if (onUpdate) {
      onUpdate(item.id, {
        isEncrypted: true,
        encryptedContent: encryptedData,
        content: '', // Clear plaintext content
      });
    }
    setDecryptedContent(null);
    setUnlockPassword(null);
  }, [item.id, onUpdate]);

  const handleToggleEncryption = useCallback((shouldEncrypt: boolean) => {
    if (!shouldEncrypt && onUpdate) {
      // Removing encryption - restore content
      onUpdate(item.id, {
        isEncrypted: false,
        encryptedContent: undefined,
        content: decryptedContent || item.content,
      });
    }
    setDecryptedContent(null);
    setUnlockPassword(null);
  }, [item.id, item.content, decryptedContent, onUpdate]);

  // Show encrypted note UI if item is encrypted
  if (item.isEncrypted && item.encryptedContent) {
    // If already decrypted in this session, show content
    if (decryptedContent !== null) {
      return (
        <div className="space-y-4">
          <SecureNoteEditor
            isEncrypted={true}
            plainContent={decryptedContent}
            onContentDecrypted={handleContentDecrypted}
            onContentEncrypted={handleContentEncrypted}
            onToggleEncryption={handleToggleEncryption}
          />
          <MarkdownRenderer content={decryptedContent} />

          {hasReminder && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-primary)]">
              <CalendarIcon className="w-5 h-5 text-[var(--dynamic-accent-highlight)]" />
              <span>
                תזכורת: <strong className="text-[var(--text-primary)]">{formattedDate}</strong>
                {item.dueTime ? ` בשעה ${item.dueTime}` : ''}
              </span>
            </div>
          )}
        </div>
      );
    }

    // Show lock screen
    return (
      <SecureNoteEditor
        isEncrypted={true}
        encryptedContent={item.encryptedContent}
        onContentDecrypted={handleContentDecrypted}
        onContentEncrypted={handleContentEncrypted}
        onToggleEncryption={handleToggleEncryption}
      />
    );
  }

  // Normal unencrypted view
  return (
    <div className="space-y-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--dynamic-accent-start)]/5 to-[var(--dynamic-accent-end)]/5 rounded-3xl -z-10" />
      {/* Show encrypt option for notes */}
      {item.type === 'note' && typeof onUpdate === 'function' && (
        <SecureNoteEditor
          isEncrypted={false}
          plainContent={item.content}
          onContentDecrypted={handleContentDecrypted}
          onContentEncrypted={handleContentEncrypted}
          onToggleEncryption={handleToggleEncryption}
        />
      )}

      {item.content && <MarkdownRenderer content={item.content} />}

      {hasReminder && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-card)]/50 backdrop-blur-sm p-3 rounded-xl border border-[var(--dynamic-accent-start)]/20 shadow-sm">
          <CalendarIcon className="w-5 h-5 text-[var(--dynamic-accent-start)]" />
          <span>
            תזכורת: <strong className="text-[var(--text-primary)]">{formattedDate}</strong>
            {item.dueTime ? ` בשעה ${item.dueTime}` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export const GenericEdit: React.FC<EditProps> = ({ editState, dispatch }) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertMarkdown = (startSyntax: string, endSyntax = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let newText;
    let selectionStart;
    let selectionEnd;

    if (selectedText) {
      newText = `${text.substring(0, start)}${startSyntax}${selectedText}${endSyntax}${text.substring(end)}`;
      selectionStart = start + startSyntax.length;
      selectionEnd = end + startSyntax.length;
    } else {
      newText = `${text.substring(0, start)}${startSyntax}${endSyntax}${text.substring(start)}`;
      selectionStart = start + startSyntax.length;
      selectionEnd = selectionStart;
    }

    dispatch({ type: 'SET_FIELD', payload: { field: 'content', value: newText } });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = selectionStart;
      textarea.selectionEnd = selectionEnd;
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="border border-[var(--border-primary)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--dynamic-accent-start)]/50 focus-within:border-[var(--dynamic-accent-start)]">
        <MarkdownToolbar onInsert={handleInsertMarkdown} />
        <textarea
          ref={contentRef}
          dir="auto"
          value={editState.content}
          onChange={e =>
            dispatch({ type: 'SET_FIELD', payload: { field: 'content', value: e.target.value } })
          }
          rows={10}
          className="w-full bg-[var(--bg-card)] text-[var(--text-primary)] p-3 focus:outline-none resize-none"
        />
      </div>

      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" /> תזכורת
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              תאריך
            </label>
            <input
              type="date"
              value={editState.dueDate || ''}
              onChange={e =>
                dispatch({
                  type: 'SET_FIELD',
                  payload: { field: 'dueDate', value: e.target.value },
                })
              }
              className={inputStyles}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              שעה
            </label>
            <input
              type="time"
              value={editState.dueTime || ''}
              onChange={e =>
                dispatch({
                  type: 'SET_FIELD',
                  payload: { field: 'dueTime', value: e.target.value },
                })
              }
              className={inputStyles}
              style={{ colorScheme: 'dark' }}
              disabled={!editState.dueDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
