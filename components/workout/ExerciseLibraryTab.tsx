import React, { useState, useEffect, useMemo } from 'react';
import { PersonalExercise } from '../../types';
import * as dataService from '../../services/dataService';
import { TrashIcon, AddIcon, SearchIcon, SparklesIcon } from '../icons';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to determine if text has Hebrew chars
const hasHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);

interface ExerciseLibraryTabProps {
  onSelect?: (exercise: PersonalExercise) => void;
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
}

const ExerciseLibraryTab: React.FC<ExerciseLibraryTabProps> = ({
  onSelect,
  isSelectionMode = false,
  selectedIds
}) => {
  const [exercises, setExercises] = useState<PersonalExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');
  const [selectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<PersonalExercise | null>(null);

  // New Exercise Form State
  const [newExercise, setNewExercise] = useState<{
    name: string;
    muscleGroup: string;
    category: PersonalExercise['category'] | '';
    tempo: string;
    tutorialText: string;
    defaultRestTime: number;
    defaultSets: number;
    notes: string;
  }>({
    name: '',
    muscleGroup: '',
    category: '',
    tempo: '',
    tutorialText: '',
    defaultRestTime: 90,
    defaultSets: 4,
    notes: '',
  });

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    const data = await dataService.getPersonalExercises();
    setExercises(data);
  };

  const handleDelete = (exercise: PersonalExercise, e: React.MouseEvent) => {
    e.stopPropagation();
    setExerciseToDelete(exercise);
  };

  const confirmDelete = async () => {
    if (!exerciseToDelete) return;
    await dataService.deletePersonalExercise(exerciseToDelete.id);
    setExerciseToDelete(null);
    loadExercises();
  };

  const cancelDelete = () => {
    setExerciseToDelete(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.name.trim()) return;

    await dataService.createPersonalExercise({
      name: newExercise.name,
      muscleGroup: newExercise.muscleGroup || 'Other',
      category: (newExercise.category || 'strength') as any, // Cast to avoid union type issues
      tempo: newExercise.tempo || undefined,
      tutorialText: newExercise.tutorialText || undefined,
      defaultRestTime: newExercise.defaultRestTime,
      defaultSets: newExercise.defaultSets,
      notes: newExercise.notes || undefined,
    });

    setNewExercise({
      name: '',
      muscleGroup: '',
      category: '',
      tempo: '',
      tutorialText: '',
      defaultRestTime: 90,
      defaultSets: 4,
      notes: '',
    });
    setShowAddForm(false);
    loadExercises();
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscleGroup =
        selectedMuscleGroup === 'all' || ex.muscleGroup === selectedMuscleGroup;
      const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
      return matchesSearch && matchesMuscleGroup && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises, searchQuery, selectedMuscleGroup, selectedCategory]);

  const muscleGroups = [
    'all', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Abs', 'Other'
  ];

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'warmup', 'cooldown'];

  // Helper to nicely format names (Hebrew/English split)
  const renderExerciseName = (name: string) => {
    // If name contains " | " or " - " or just contains both scripts, try to split
    if (name.includes('|')) {
      const [first = '', second = ''] = name.split('|').map(s => s.trim());
      // Heuristic: Put Hebrew on top
      const firstIsHebrew = hasHebrew(first);
      return (
        <div className="flex flex-col">
          <span className="font-bold text-white text-base leading-tight">
            {firstIsHebrew ? first : second}
          </span>
          <span className="text-xs text-white/50 font-medium">
            {firstIsHebrew ? second : first}
          </span>
        </div>
      );
    }

    // Fallback: Check if there's a mix without separator? 
    // For now simple display
    return <span className="font-bold text-white text-base">{name}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Search & Filter Header */}
      <div className="space-y-3 mb-4 shrink-0 px-1">
        <div className="relative group">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[var(--cosmos-accent-primary)] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="חיפוש תרגיל..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-12 pl-4 text-white placeholder-white/30 focus:outline-none focus:border-[var(--cosmos-accent-primary)]/50 focus:bg-white/10 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mask-linear-fade">
          {muscleGroups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedMuscleGroup(group)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${selectedMuscleGroup === group
                ? 'bg-[var(--cosmos-accent-primary)] border-[var(--cosmos-accent-primary)] text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              {group === 'all' ? 'הכל' : group}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Button (Only show if not in selection mode or make it smaller) */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="shrink-0 w-full py-3 mb-4 border border-dashed border-white/20 hover:border-[var(--cosmos-accent-primary)] hover:bg-[var(--cosmos-accent-primary)]/5 rounded-xl text-white/60 hover:text-[var(--cosmos-accent-primary)] transition-all flex items-center justify-center gap-2 font-bold text-sm group"
        >
          <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[var(--cosmos-accent-primary)] group-hover:text-black flex items-center justify-center transition-colors">
            <AddIcon className="w-3.5 h-3.5" />
          </div>
          יצירת תרגיל מותאם אישית
        </button>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4 shrink-0"
          >
            <form
              onSubmit={handleCreate}
              className="bg-[#16161a] p-5 rounded-2xl border border-white/10 space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-[var(--cosmos-accent-primary)] to-transparent opacity-50" />

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[var(--cosmos-accent-primary)]" />
                  יצירת תרגיל חדש
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-white/40 hover:text-white px-2 py-1 bg-white/5 rounded-lg transition-colors"
                >
                  ביטול
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">שם התרגיל</label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                    placeholder="לדוגמה: לחיצת חזה | Bench Press"
                    className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-[var(--cosmos-accent-primary)] outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">שריר ראשי</label>
                    <select
                      value={newExercise.muscleGroup}
                      onChange={e => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-[var(--cosmos-accent-primary)] outline-none appearance-none"
                    >
                      <option value="">בחר...</option>
                      {muscleGroups.filter(g => g !== 'all').map(g => (
                        <option key={g} value={g} className="bg-gray-900 text-white">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">קטגוריה</label>
                    <select
                      value={newExercise.category}
                      onChange={e => setNewExercise({ ...newExercise, category: e.target.value as any })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:border-[var(--cosmos-accent-primary)] outline-none appearance-none"
                    >
                      <option value="">בחר...</option>
                      {categories.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c} className="bg-gray-900 text-white capitalize">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">סטים</label>
                    <input
                      type="number"
                      value={newExercise.defaultSets}
                      onChange={e => setNewExercise({ ...newExercise, defaultSets: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-center text-white focus:border-[var(--cosmos-accent-primary)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">מנוחה (שנ׳)</label>
                    <input
                      type="number"
                      value={newExercise.defaultRestTime}
                      onChange={e => setNewExercise({ ...newExercise, defaultRestTime: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-center text-white focus:border-[var(--cosmos-accent-primary)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-1 block">טמפו</label>
                    <input
                      type="text"
                      value={newExercise.tempo}
                      onChange={e => setNewExercise({ ...newExercise, tempo: e.target.value })}
                      placeholder="3-0-1"
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-center text-white focus:border-[var(--cosmos-accent-primary)] outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[var(--cosmos-accent-primary)] text-black font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all">
                  שמור והוסף
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 pb-10">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
            <DumbbellIcon className="w-16 h-16 mb-4" />
            <div className="text-lg font-bold">לא נמצאו תרגילים</div>
            <div className="text-sm">נסה לשנות את הסינון או הוסף תרגיל חדש</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredExercises.map(exercise => (
              <motion.div
                layoutId={`ex-${exercise.id}`}
                key={exercise.id}
                onClick={() => onSelect ? onSelect(exercise) : null}
                className={`
                  relative p-4 rounded-xl border transition-all cursor-pointer group overflow-hidden
                  ${isSelectionMode
                    ? 'hover:border-[var(--cosmos-accent-primary)] hover:bg-[var(--cosmos-accent-primary)]/5 bg-white/5 border-white/10'
                    : 'bg-[#16161a] border-white/5 hover:border-white/20 hover:bg-white/10'
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelectionMode && (
                  <div className={`absolute top-4 left-4 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds?.has(exercise.id)
                    ? 'border-[var(--cosmos-accent-primary)] bg-[var(--cosmos-accent-primary)]/20'
                    : 'border-white/20 group-hover:border-[var(--cosmos-accent-primary)]'
                    }`}>
                    <div className={`w-3 h-3 rounded-full bg-[var(--cosmos-accent-primary)] transition-opacity transform ${selectedIds?.has(exercise.id) ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100'
                      }`} />
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div className="flex-1 pl-8">
                    {renderExerciseName(exercise.name)}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {exercise.muscleGroup && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase tracking-widest border border-white/5">
                          {exercise.muscleGroup}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 flex items-center gap-1">
                        ⏱ {exercise.defaultRestTime || 90}s
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 flex items-center gap-1">
                        📊 {exercise.defaultSets || 4} sets
                      </span>
                    </div>

                    {exercise.notes && (
                      <p className="text-xs text-white/30 mt-2 line-clamp-1 italic">
                        "{exercise.notes}"
                      </p>
                    )}
                  </div>

                  {!isSelectionMode && (
                    <button
                      onClick={e => handleDelete(exercise, e)}
                      className="p-2 -mt-2 -ml-2 text-white/10 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {exerciseToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[13000] flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-[#16161a] border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">למחוק תרגיל?</h3>
            <p className="text-sm text-white/70 mb-1 font-medium">{exerciseToDelete.name}</p>
            <p className="text-xs text-white/40 mb-6">
              המחיקה תסיר את התרגיל מהספרייה לצמיתות.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
              >
                ביטול
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-12 rounded-xl bg-red-600/90 text-white font-bold hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Missing Dumbbell Icon Definition helper if needed locally */}
      <style>{`
        .mask-linear-fade {
            mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
      `}</style>
    </div>
  );
};
// Simple DumbbellIcon if not imported (though it IS imported)
const DumbbellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7.5 7.5 0 01-3.5 13M19 11h-5m5 0a7.5 7.5 0 00-7.5-7.5m7.5 7.5V5.5a2.5 2.5 0 00-5 0V11m-9.5 7h4.5m-4.5 0a7.5 7.5 0 017-5.5m0 0H9m2.5 0V5.5a2.5 2.5 0 00-5 0V11m2.5 0h-2.5m2.5 0a7.5 7.5 0 017 5.5" />
  </svg>
);

export default React.memo(ExerciseLibraryTab);
