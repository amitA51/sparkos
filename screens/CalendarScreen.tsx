import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Screen, PersonalItem, AddableType } from '../types';
import CalendarView from '../components/CalendarView';
import PersonalItemDetailModal from '../components/PersonalItemDetailModal';
import StatusMessage, { StatusMessageType } from '../components/StatusMessage';
import { ChevronRightIcon } from '../components/icons';
import { useData } from '../src/contexts/DataContext';
import { reAddPersonalItem } from '../services/dataService';
import { useModal } from '../state/ModalContext';

interface CalendarScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ setActiveScreen }) => {
  const { personalItems, updatePersonalItem, removePersonalItem, refreshAll } = useData();
  const { openModal } = useModal();

  const [selectedItem, setSelectedItem] = useState<PersonalItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: StatusMessageType;
    text: string;
    id: number;
    onUndo?: () => void;
  } | null>(null);

  const showStatus = useCallback((type: StatusMessageType, text: string, onUndo?: () => void) => {
    setStatusMessage({ type, text, id: Date.now(), onUndo });
  }, []);

  const handleUpdateItem = useCallback((id: string, updates: Partial<PersonalItem>) => {
    // Optimistic update for selected item
    setSelectedItem(prev => (prev && prev.id === id ? { ...prev, ...updates } : prev));
    updatePersonalItem(id, updates);
  }, [updatePersonalItem]);

  const handleDeleteItem = useCallback(async (id: string) => {
    const itemToDelete = personalItems.find(item => item.id === id);
    if (!itemToDelete) return;

    setSelectedItem(null);
    await removePersonalItem(id);

    showStatus('success', 'הפריט נמחק.', async () => {
      await reAddPersonalItem(itemToDelete);
      await refreshAll();
    });
  }, [personalItems, removePersonalItem, showStatus, refreshAll]);

  const handleSelectItem = useCallback((item: PersonalItem, event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.type === 'roadmap') {
      openModal('roadmapScreen', {
        item,
        onUpdate: handleUpdateItem,
        onDelete: handleDeleteItem,
      });
      return;
    }
    setSelectedItem(item);
  }, [openModal, handleUpdateItem, handleDeleteItem]);

  const handleCloseModal = useCallback((nextItem?: PersonalItem) => {
    setSelectedItem(nextItem || null);
  }, []);

  const handleQuickAdd = useCallback((type: AddableType, date: string) => {
    sessionStorage.setItem('preselect_add', type);
    sessionStorage.setItem('preselect_add_date', date);
    setActiveScreen('add');
  }, [setActiveScreen]);

  // PERF: Stable callbacks for navigation and status
  const handleGoBack = useCallback(() => setActiveScreen('today'), [setActiveScreen]);
  const handleDismissStatus = useCallback(() => setStatusMessage(null), []);

  // PERF: Memoize formatted date string - recalculated only once per render
  const formattedDate = useMemo(
    () => new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    [] // Date display only changes on navigation, not within a session
  );

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Premium Glass Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="px-4 py-4 flex items-center gap-4 sticky top-0 z-20"
        style={{
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
          WebkitBackdropFilter: 'blur(var(--glass-blur, 40px)) saturate(var(--glass-saturate, 180%))',
          borderBottom: '0.33px solid var(--border-subtle)',
        }}
      >
        <motion.button
          onClick={handleGoBack}
          whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-2xl transition-all duration-200"
          style={{
            background: 'var(--gray-50)',
            border: '0.5px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
          >
            לוח שנה
          </h1>
          <p
            className="text-[12px] font-medium mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            {formattedDate}
          </p>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex-1 overflow-hidden relative"
      >
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-24">
          <CalendarView
            items={personalItems}
            onSelectItem={handleSelectItem}
            onUpdate={handleUpdateItem}
            onQuickAdd={handleQuickAdd}
          />
        </div>
      </motion.div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <PersonalItemDetailModal
          item={selectedItem}
          onClose={handleCloseModal}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      )}

      {statusMessage && (
        <StatusMessage
          key={statusMessage.id}
          type={statusMessage.type}
          message={statusMessage.text}
          onDismiss={handleDismissStatus}
          onUndo={statusMessage.onUndo}
        />
      )}
    </div>
  );
};

export default React.memo(CalendarScreen);
