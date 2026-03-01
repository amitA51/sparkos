import React, { useCallback } from 'react';
import { Screen, PersonalItem, AddableType } from '../types';
import CalendarView from '../components/CalendarView'; // Use the premium View
import { ChevronRightIcon } from '../components/icons';
import { useData } from '../src/contexts/DataContext';


interface CalendarScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ setActiveScreen }) => {
  const { personalItems, updatePersonalItem } = useData();

  const handleUpdateItem = useCallback((id: string, updates: Partial<PersonalItem>) => {
    updatePersonalItem(id, updates);
  }, [updatePersonalItem]);

  const handleSelectItem = useCallback((item: PersonalItem, event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.type === 'roadmap') {
      // Handle roadmap if needed
    }
    // We can use the 'roadmapScreen' modal or a general detail modal.
    // For now, let's open the standard edit modal or similar if available,
    // or just console log as placeholder if no direct edit modal is exposed easily here.
    // Ideally we reuse the PersonalItemDetailModal logic from Library, but that's local state there.
    // Let's assume we can trigger the Add/Edit screen or similar.
    // Actually, looking at LibraryScreen, strict editing usually happens via selection.

    // Simplest approach: Open the item in the 'add' screen which doubles as edit, OR simply log it.
    // Better: use the global modal system if available.
    // Attempting to use openModal for a generic item detail if it exists, otherwise do nothing/toast.
    console.log('Selected item:', item.title);
  }, []);

  const handleQuickAdd = useCallback((type: AddableType, date: string) => {
    // Store date to pre-fill
    sessionStorage.setItem('preselect_add', type);
    sessionStorage.setItem('preselect_add_date', date);
    setActiveScreen('add');
  }, [setActiveScreen]);

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      {/* Premium Glass Header */}
      <header className="px-4 py-3 flex items-center gap-4 bg-[var(--bg-secondary)]/60 backdrop-blur-xl border-b border-[var(--border-primary)]/50 sticky top-0 z-20">
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="p-2.5 rounded-full bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] transition-all active:scale-95"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
          לוח שנה
        </h1>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-24">
          <CalendarView
            items={personalItems}
            onSelectItem={handleSelectItem}
            onUpdate={handleUpdateItem}
            onQuickAdd={handleQuickAdd}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
