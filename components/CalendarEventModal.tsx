import React, { useState, useEffect } from 'react';
import { GoogleCalendarEvent } from '../types';
import { CloseIcon, CalendarIcon, ClockIcon } from './icons';
import { toDateKey } from '../utils/dateUtils';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
  }) => Promise<void>;
  initialEvent?: GoogleCalendarEvent;
  linkedTaskTitle?: string;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  linkedTaskTitle,
}) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setSummary(initialEvent.summary);
        setDescription(initialEvent.description || '');

        const startStr = initialEvent.start.dateTime || initialEvent.start.date;
        if (startStr) {
          const start = new Date(startStr);
          const iso = start.toISOString();
          setStartDate(iso.split('T')[0] ?? '');
          setStartTime(start.toTimeString().slice(0, 5));
        }

        const endStr = initialEvent.end.dateTime || initialEvent.end.date;
        if (endStr) {
          const end = new Date(endStr);
          const isoEnd = end.toISOString();
          setEndDate(isoEnd.split('T')[0] ?? '');
          setEndTime(end.toTimeString().slice(0, 5));
        }
      } else {
        // Default to now + 1 hour
        const now = new Date();
        const later = new Date(now.getTime() + 60 * 60 * 1000);
        setStartDate(toDateKey(now));
        setStartTime(now.toTimeString().slice(0, 5));
        setEndDate(toDateKey(later));
        setEndTime(later.toTimeString().slice(0, 5));
        setSummary(linkedTaskTitle || '');
        setDescription('');
      }
    }
  }, [isOpen, initialEvent, linkedTaskTitle]);

  const handleSave = async () => {
    if (!summary.trim() || !startDate || !startTime || !endDate || !endTime) {
      alert('נא למלא את כל השדות הנדרשים');
      return;
    }

    setIsSaving(true);
    try {
      const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${endDate}T${endTime}`).toISOString();

      await onSave({
        summary: summary.trim(),
        description: description.trim(),
        start: { dateTime: startDateTime },
        end: { dateTime: endDateTime },
      });

      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('שגיאה בשמירת האירוע');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {initialEvent ? 'ערוך אירוע' : 'אירוע חדש'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              כותרת *
            </label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="שם האירוע"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)]"
            />
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                תאריך התחלה *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                שעה *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)]"
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                תאריך סיום *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                שעה *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              תיאור
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="פרטים נוספים על האירוע..."
              rows={4}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--dynamic-accent-start)] resize-none"
            />
          </div>

          {linkedTaskTitle && (
            <div className="bg-[var(--dynamic-accent-start)]/10 border border-[var(--dynamic-accent-start)]/30 rounded-lg p-3">
              <p className="text-xs text-[var(--text-secondary)]">
                🔗 מקושר למשימה: <span className="font-semibold">{linkedTaskTitle}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-[var(--dynamic-accent-start)] text-white rounded-lg font-medium hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {isSaving ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarEventModal;
