import React, { useState, useEffect, useRef, lazy, Suspense, useCallback, memo } from 'react';
import type { Screen } from '../types';
import {
  CheckCircleIcon,
  LinkIcon,
  ClipboardListIcon,
  BookOpenIcon,
  DumbbellIcon,
  ChartBarIcon,
  SparklesIcon,
  SummarizeIcon,
  UserIcon,
  LightbulbIcon,
  RoadmapIcon,
  EditIcon,
  CloseIcon,
  FlameIcon,
  TargetIcon,
} from '../components/icons';
import { ItemCreationForm } from '../components/ItemCreationForm';
import { AddableType } from '../types';
import { useSettings } from '../src/contexts/SettingsContext';
import { useHaptics } from '../hooks/useHaptics';
import SmartSearchBar from '../components/add/SmartSearchBar';
import TemplateCarousel, { TemplatePreset } from '../components/add/TemplateCarousel';
import { AddScreenSkeleton } from '../components/add';
import { useAISuggestions } from '../hooks/add/useAISuggestions';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceInputModal = lazy(() => import('../components/VoiceInputModal'));

interface AddScreenProps {
  setActiveScreen: (screen: Screen) => void;
}

// Apple-refined item type definitions — clean monochrome icons with subtle tint
const allItemTypes: { type: AddableType; label: string; icon: React.ReactNode; color: string; bgTint: string }[] = [
  { type: 'spark', label: 'ספארק', icon: <SparklesIcon />, color: '#00D4FF', bgTint: 'rgba(0, 212, 255, 0.08)' },
  { type: 'idea', label: 'רעיון', icon: <LightbulbIcon />, color: '#FBBF24', bgTint: 'rgba(251, 191, 36, 0.08)' },
  { type: 'habit', label: 'הרגל', icon: <FlameIcon />, color: '#FF6B6B', bgTint: 'rgba(255, 107, 107, 0.08)' },
  { type: 'note', label: 'פתק', icon: <ClipboardListIcon />, color: '#FCD34D', bgTint: 'rgba(252, 211, 77, 0.08)' },
  { type: 'task', label: 'משימה', icon: <CheckCircleIcon />, color: '#34D399', bgTint: 'rgba(52, 211, 153, 0.08)' },
  { type: 'link', label: 'קישור', icon: <LinkIcon />, color: '#60A5FA', bgTint: 'rgba(96, 165, 250, 0.08)' },
  { type: 'learning', label: 'למידה', icon: <SummarizeIcon />, color: '#38BDF8', bgTint: 'rgba(56, 189, 248, 0.08)' },
  { type: 'journal', label: 'יומן', icon: <UserIcon />, color: '#F0ABFC', bgTint: 'rgba(240, 171, 252, 0.08)' },
  { type: 'book', label: 'ספר', icon: <BookOpenIcon />, color: '#A78BFA', bgTint: 'rgba(167, 139, 250, 0.08)' },
  { type: 'workout', label: 'אימון', icon: <DumbbellIcon />, color: '#FB7185', bgTint: 'rgba(251, 113, 133, 0.08)' },
  { type: 'roadmap', label: 'מפת דרכים', icon: <RoadmapIcon />, color: '#3B82F6', bgTint: 'rgba(59, 130, 246, 0.08)' },
  { type: 'ticker', label: 'מניה', icon: <ChartBarIcon />, color: '#94A3B8', bgTint: 'rgba(148, 163, 184, 0.08)' },
  { type: 'goal', label: 'מטרה', icon: <TargetIcon />, color: '#2DD4BF', bgTint: 'rgba(45, 212, 191, 0.08)' },
];

/**
 * Apple-Style Premium Item Card
 * Glass morphism card with subtle icon glow, refined typography, and smooth spring interactions
 */
interface AppleItemCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  color: string;
  bgTint: string;
  index: number;
  isEditing?: boolean;
}

const AppleItemCard = memo<AppleItemCardProps>(({ icon, label, onClick, color, bgTint, index, isEditing }) => (
  <motion.button
    onClick={onClick}
    disabled={isEditing}
    initial={{ opacity: 0, y: 12, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      type: 'spring',
      stiffness: 500,
      damping: 35,
      delay: index * 0.025,
    }}
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.94 }}
    className={`
      group relative w-full aspect-square
      rounded-[20px]
      flex flex-col items-center justify-center gap-2.5
      ${isEditing ? 'cursor-grab opacity-60' : 'cursor-pointer'}
    `}
    style={{
      backgroundColor: bgTint,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '0.5px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 0.5px rgba(255, 255, 255, 0.03) inset',
    }}
  >
    {/* Subtle top highlight — glass depth */}
    <div
      className="absolute top-0 left-[20%] right-[20%] h-[0.5px] pointer-events-none"
      style={{
        background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent)',
      }}
    />

    {/* Icon */}
    <div
      className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
      style={{ color }}
    >
      {React.isValidElement<{ className?: string; style?: React.CSSProperties }>(icon)
        ? React.cloneElement(icon, {
          ...icon.props,
          className: 'w-full h-full',
          style: { ...icon.props.style, filter: `drop-shadow(0 1px 3px ${color}30)` }
        })
        : icon}
    </div>

    {/* Label */}
    <span
      className="font-semibold text-[13px] sm:text-sm transition-colors duration-300"
      style={{ color: 'rgba(255, 255, 255, 0.75)' }}
    >
      {label}
    </span>
  </motion.button>
));

AppleItemCard.displayName = 'AppleItemCard';

const AddScreen: React.FC<AddScreenProps> = ({ setActiveScreen }) => {
  const { settings, updateSettings } = useSettings();
  const { triggerHaptic } = useHaptics();
  const { timeGreeting, motivationalMessage } = useAISuggestions();

  const [addScreenLayout, setAddScreenLayout] = useState(settings.addScreenLayout);
  const [selectedType, setSelectedType] = useState<AddableType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHiddenOptions, setShowHiddenOptions] = useState(false);

  const dragItem = useRef<AddableType | null>(null);
  const dragOverItem = useRef<AddableType | null>(null);
  const [, setForceRender] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedType) {
      e.preventDefault();
      handleCloseForm();
    }
  }, [selectedType]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setAddScreenLayout(settings.addScreenLayout);
  }, [settings.addScreenLayout]);

  const handleLayoutChange = (newLayout: AddableType[]) => {
    setAddScreenLayout(newLayout);
    updateSettings({ addScreenLayout: newLayout });
  };

  const handleDrop = () => {
    if (dragItem.current && dragOverItem.current && dragItem.current !== dragOverItem.current) {
      const currentLayout = [...addScreenLayout];
      const dragItemIndex = currentLayout.indexOf(dragItem.current);
      const dragOverItemIndex = currentLayout.indexOf(dragOverItem.current);
      const [removed] = currentLayout.splice(dragItemIndex, 1);
      if (removed) currentLayout.splice(dragOverItemIndex, 0, removed);
      handleLayoutChange(currentLayout);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setForceRender(c => c + 1);
  };

  const handleHideItem = (typeToHide: AddableType) => {
    triggerHaptic('medium');
    handleLayoutChange(addScreenLayout.filter(type => type !== typeToHide));
  };

  const handleRestoreItem = (typeToRestore: AddableType) => {
    triggerHaptic('light');
    if (!addScreenLayout.includes(typeToRestore)) {
      handleLayoutChange([...addScreenLayout, typeToRestore]);
    }
  };

  const hiddenItems = allItemTypes.filter(item => !addScreenLayout.includes(item.type));

  const handleItemClick = (type: AddableType, data?: Record<string, unknown>) => {
    triggerHaptic('light');
    if (data && Object.keys(data).length > 0) {
      sessionStorage.setItem('preselect_add_defaults', JSON.stringify(data));
    }
    setSelectedType(type);
  };

  const handleCloseForm = () => {
    setSelectedType(null);
    sessionStorage.removeItem('preselect_add_defaults');
  };

  if (isLoading) return <AddScreenSkeleton />;

  return (
    <div className="screen-shell pb-24 relative overflow-hidden min-h-screen">
      {/* Background — Apple-clean with subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 surface-primary" />
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70%] h-[45%] rounded-full blur-[160px] opacity-[0.12]"
          style={{ background: 'var(--dynamic-accent-start)' }}
        />
        <div
          className="absolute bottom-[-5%] right-[-10%] w-[40%] h-[30%] rounded-full blur-[120px] opacity-[0.06]"
          style={{ background: 'var(--dynamic-accent-end, var(--dynamic-accent-start))' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-5 sm:px-8 max-w-4xl mx-auto">

        {/* Header — Apple-clean typography */}
        <motion.header
          className="pt-6 pb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-between mb-5">
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              whileTap={{ scale: 0.88 }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: isEditing
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '0.5px solid rgba(255, 255, 255, 0.08)',
                color: isEditing ? '#000' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {isEditing ? <CloseIcon className="w-4.5 h-4.5" /> : <EditIcon className="w-4.5 h-4.5" />}
            </motion.button>

            <span
              className="text-sm font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.01em' }}
            >
              {timeGreeting}
            </span>

            <div className="w-10" />
          </div>

          <AnimatePresence>
            {!isSearchExpanded && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className="text-[34px] sm:text-[40px] font-bold text-white mb-1.5"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
                >
                  יצירה חדשה
                </h1>
                <p
                  className="text-[15px] max-w-[280px] mx-auto leading-relaxed"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                  {motivationalMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Search Bar */}
        {!isEditing && (
          <div className="mb-7 relative z-20">
            <SmartSearchBar
              onCreateItem={handleItemClick}
              onVoiceInput={() => setIsVoiceModalOpen(true)}
              isExpanded={isSearchExpanded}
              onToggleExpand={setIsSearchExpanded}
            />
          </div>
        )}

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          {!selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {isEditing && (
                <p
                  className="text-center text-[13px] mb-4"
                  style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                >
                  גרור כדי לסדר מחדש
                </p>
              )}

              <div
                className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {addScreenLayout.map((type, index) => {
                  const item = allItemTypes.find(it => it.type === type);
                  if (!item) return null;

                  return (
                    <div
                      key={item.type}
                      draggable={isEditing}
                      onDragStart={() => (dragItem.current = item.type)}
                      onDragEnter={() => (dragOverItem.current = item.type)}
                      onDragEnd={handleDrop}
                      className="relative"
                    >
                      {isEditing && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                          onClick={() => handleHideItem(item.type)}
                          className="absolute -top-1.5 -right-1.5 z-10 w-6 h-6
                            rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(255, 59, 48, 0.9)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)',
                          }}
                        >
                          <CloseIcon className="w-3.5 h-3.5 text-white" />
                        </motion.button>
                      )}

                      <AppleItemCard
                        label={item.label}
                        icon={item.icon}
                        color={item.color}
                        bgTint={item.bgTint}
                        onClick={() => handleItemClick(item.type, undefined)}
                        index={index}
                        isEditing={isEditing}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Edit mode: hidden items management */}
              {isEditing && (
                <motion.div
                  className="mt-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    onClick={() => setShowHiddenOptions(!showHiddenOptions)}
                    className="w-full px-5 py-3 rounded-2xl font-medium text-[14px] transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '0.5px solid rgba(255, 255, 255, 0.06)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {showHiddenOptions ? '✕ סגור' : `⚙️ נהל אפשרויות ${hiddenItems.length > 0 ? `(${hiddenItems.length} מוסתרים)` : ''}`}
                  </button>

                  <AnimatePresence>
                    {showHiddenOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="mt-3 overflow-hidden"
                      >
                        {hiddenItems.length > 0 ? (
                          <div
                            className="p-4 rounded-2xl"
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '0.5px solid rgba(255, 255, 255, 0.06)',
                              backdropFilter: 'blur(16px)',
                            }}
                          >
                            <p
                              className="text-[13px] mb-4 text-center"
                              style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                            >
                              לחץ על פריט כדי להוסיף אותו בחזרה
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {hiddenItems.map((item) => (
                                <motion.button
                                  key={item.type}
                                  onClick={() => handleRestoreItem(item.type)}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex flex-col items-center gap-2 p-3 rounded-[14px] transition-all duration-300"
                                  style={{
                                    color: item.color,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '0.5px solid rgba(255, 255, 255, 0.06)',
                                  }}
                                >
                                  <div className="w-8 h-8 flex items-center justify-center">
                                    {React.isValidElement<{ className?: string }>(item.icon)
                                      ? React.cloneElement(item.icon, { className: 'w-6 h-6' })
                                      : item.icon}
                                  </div>
                                  <span className="text-[11px] font-medium" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                    {item.label}
                                  </span>
                                  <span className="text-[10px]" style={{ color: '#34D399' }}>+ הוסף</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="p-4 rounded-2xl text-center"
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '0.5px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <p className="text-[13px]" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                              ✨ כל האפשרויות מוצגות
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates Section */}
        <AnimatePresence>
          {!selectedType && !isEditing && !isSearchExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-10"
            >
              {/* Separator line */}
              <div
                className="mx-auto w-[60%] h-[0.5px] mb-5"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.06), transparent)',
                }}
              />

              <button
                onClick={() => {
                  triggerHaptic('light');
                  updateSettings({ hideQuickTemplates: !settings.hideQuickTemplates });
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 transition-colors duration-300"
                style={{ color: 'rgba(255, 255, 255, 0.25)' }}
              >
                <span className="text-[11px] uppercase tracking-[0.08em] font-semibold">
                  תבניות מהירות
                </span>
                <span className="text-[10px]">{settings.hideQuickTemplates ? '▼' : '▲'}</span>
              </button>

              <AnimatePresence>
                {!settings.hideQuickTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden mt-3"
                  >
                    <TemplateCarousel
                      onSelectTemplate={(template: TemplatePreset) => {
                        handleItemClick(template.type, template.prefillData);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Item Creation Form Modal */}
        {selectedType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
              onClick={handleCloseForm}
            />
            <ItemCreationForm
              key={selectedType}
              itemType={selectedType}
              onClose={handleCloseForm}
              setActiveScreen={setActiveScreen}
            />
          </div>
        )}
      </div>

      {/* Voice Modal */}
      <Suspense fallback={null}>
        {isVoiceModalOpen && (
          <VoiceInputModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default memo(AddScreen);
