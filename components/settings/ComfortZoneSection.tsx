import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  SettingsSection,
  SettingsGroupCard,
  SettingsToggleRow,
  SettingsInfoBanner,
} from './SettingsComponents';
import { useSettings } from '../../src/contexts/SettingsContext';
import { StatusMessageType } from '../../components/StatusMessage';
import {
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ShieldExclamationIcon,
  LightbulbIcon,
  GripVerticalIcon,
  CheckCircleIcon,
} from '../../components/icons';

interface ComfortZoneSectionProps {
  setStatusMessage: (msg: { type: StatusMessageType; text: string; id: number } | null) => void;
}

// Suggested challenges for inspiration
const SUGGESTED_CHALLENGES = [
  'דבר עם אדם זר ברחוב',
  'בקש הנחה בחנות',
  'שתף רעיון בפגישה',
  'התקשר למישהו במקום לשלוח הודעה',
  'נסה מאכל חדש שמעולם לא טעמת',
  'לך לאירוע לבד',
  'אמור "לא" לבקשה שלא נוחה לך',
  'שאל שאלה "טיפשית" בפומבי',
  'עשה משהו שאתה דוחה כבר שבוע',
  'התחל שיחה עם שכן שלא מכיר',
];

const ComfortZoneSection: React.FC<ComfortZoneSectionProps> = ({ setStatusMessage }) => {
  const { settings, updateSettings } = useSettings();
  const [newChallenge, setNewChallenge] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const comfortZoneSettings = useMemo(
    () => settings.comfortZoneSettings || { useAiChallenges: true, customChallenges: [] },
    [settings.comfortZoneSettings]
  );

  const handleAddChallenge = useCallback(
    (text?: string) => {
      const trimmed = (text || newChallenge).trim();
      if (!trimmed) return;

      if (comfortZoneSettings.customChallenges.includes(trimmed)) {
        setStatusMessage({ type: 'warning', text: 'האתגר כבר קיים ברשימה', id: Date.now() });
        return;
      }

      updateSettings({
        comfortZoneSettings: {
          ...comfortZoneSettings,
          customChallenges: [...comfortZoneSettings.customChallenges, trimmed],
        },
      });
      setNewChallenge('');
      setStatusMessage({ type: 'success', text: '⚡ אתגר נוסף בהצלחה!', id: Date.now() });
      navigator.vibrate?.(15);
    },
    [newChallenge, comfortZoneSettings, updateSettings, setStatusMessage]
  );

  const handleRemoveChallenge = useCallback(
    (index: number) => {
      const updated = comfortZoneSettings.customChallenges.filter((_, i) => i !== index);
      updateSettings({
        comfortZoneSettings: {
          ...comfortZoneSettings,
          customChallenges: updated,
        },
      });
      setStatusMessage({ type: 'info', text: 'האתגר הוסר', id: Date.now() });
      navigator.vibrate?.(10);
    },
    [comfortZoneSettings, updateSettings, setStatusMessage]
  );

  const handleToggleAi = useCallback(
    (value: boolean) => {
      updateSettings({
        comfortZoneSettings: {
          ...comfortZoneSettings,
          useAiChallenges: value,
        },
      });
      navigator.vibrate?.(10);
    },
    [comfortZoneSettings, updateSettings]
  );

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      updateSettings({
        comfortZoneSettings: {
          ...comfortZoneSettings,
          customChallenges: newOrder,
        },
      });
    },
    [comfortZoneSettings, updateSettings]
  );

  // Filter out already added suggestions
  const availableSuggestions = SUGGESTED_CHALLENGES.filter(
    s => !comfortZoneSettings.customChallenges.includes(s)
  );

  return (
    <SettingsSection title="יציאה מאזור נוחות" id="comfort-zone">
      {/* Premium Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{
          background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #DC2626 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <ShieldExclamationIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1" dir="rtl">
            <h3 className="text-lg font-bold text-white mb-1">שבור את הגבולות</h3>
            <p className="text-sm text-white/80">צמיחה אמיתית מתחילה מחוץ לאזור הנוחות שלך</p>
          </div>
        </div>
      </motion.div>

      {/* AI Toggle */}
      <SettingsGroupCard title="מקור האתגרים" icon={<SparklesIcon className="w-5 h-5" />}>
        <SettingsToggleRow
          title="השתמש ב-AI"
          description="צור אתגרים יומיים מותאמים אישית עם בינה מלאכותית"
          checked={comfortZoneSettings.useAiChallenges}
          onChange={handleToggleAi}
        />

        {/* Status indicator */}
        <div className="px-4 pb-4">
          <motion.div
            layout
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              comfortZoneSettings.useAiChallenges
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : comfortZoneSettings.customChallenges.length > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-amber-500/10 border-amber-500/25'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                comfortZoneSettings.useAiChallenges
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : comfortZoneSettings.customChallenges.length > 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {comfortZoneSettings.useAiChallenges ? (
                <SparklesIcon className="w-4 h-4" />
              ) : comfortZoneSettings.customChallenges.length > 0 ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <LightbulbIcon className="w-4 h-4" />
              )}
            </div>
            <p className="text-xs text-white/70 flex-1" dir="rtl">
              {comfortZoneSettings.useAiChallenges
                ? '🤖 AI יוצר אתגרים מותאמים לך כל יום'
                : comfortZoneSettings.customChallenges.length > 0
                  ? `✨ יוצג אתגר רנדומלי מ-${comfortZoneSettings.customChallenges.length} אתגרים`
                  : '⚠️ הוסף אתגרים או הפעל AI'}
            </p>
          </motion.div>
        </div>
      </SettingsGroupCard>

      {/* Custom Challenges */}
      <SettingsGroupCard title="האתגרים שלך" icon={<ShieldExclamationIcon className="w-5 h-5" />}>
        {/* Add new challenge */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newChallenge}
              onChange={e => setNewChallenge(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddChallenge()}
              placeholder="הוסף אתגר חדש..."
              className="flex-1 px-4 py-3 text-sm text-white bg-white/[0.08] 
                                     border border-white/[0.15] rounded-xl
                                     focus:border-[var(--dynamic-accent-start)] 
                                     focus:ring-2 focus:ring-[var(--dynamic-accent-start)]/20 
                                     outline-none transition-all placeholder:text-[var(--text-tertiary)]"
              dir="rtl"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddChallenge()}
              disabled={!newChallenge.trim()}
              className="px-4 py-3 rounded-xl text-white
                                     disabled:opacity-40 disabled:cursor-not-allowed
                                     transition-all shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, var(--dynamic-accent-start), var(--dynamic-accent-end))',
                boxShadow: '0 4px 15px var(--dynamic-accent-start)/30',
              }}
            >
              <PlusIcon className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Suggestions toggle */}
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <LightbulbIcon className="w-4 h-4" />
            {showSuggestions ? 'הסתר הצעות' : 'הצג הצעות לאתגרים'}
          </button>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && availableSuggestions.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 mb-3 font-medium" dir="rtl">
                    💡 לחץ על אתגר להוסיף אותו
                  </p>
                  <div className="flex flex-wrap gap-2" dir="rtl">
                    {availableSuggestions.slice(0, 6).map((suggestion, i) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddChallenge(suggestion)}
                        className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 
                                                         rounded-full text-white/80 hover:text-white 
                                                         border border-white/10 hover:border-white/20
                                                         transition-all"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenges list with drag-reorder */}
        <div className="px-4 pb-4">
          {comfortZoneSettings.customChallenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <ShieldExclamationIcon className="w-8 h-8 text-orange-400/60" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                אין אתגרים אישיים עדיין
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-[200px] mx-auto">
                הוסף אתגרים שאתה רוצה לעשות כדי לצאת מאזור הנוחות
              </p>
            </motion.div>
          ) : (
            <Reorder.Group
              axis="y"
              values={comfortZoneSettings.customChallenges}
              onReorder={handleReorder}
              className="space-y-2"
            >
              {comfortZoneSettings.customChallenges.map((challenge, index) => (
                <Reorder.Item key={challenge} value={challenge} className="list-none">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-3 p-3.5 
                                                 bg-gradient-to-r from-white/[0.06] to-white/[0.03]
                                                 rounded-xl border border-white/[0.08]
                                                 hover:border-white/[0.15] transition-all group cursor-grab active:cursor-grabbing"
                  >
                    {/* Drag handle */}
                    <div className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-60 transition-opacity">
                      <GripVerticalIcon className="w-4 h-4" />
                    </div>

                    {/* Number badge */}
                    <div
                      className="w-6 h-6 rounded-full bg-[var(--dynamic-accent-start)]/20 
                                                      flex items-center justify-center text-xs font-bold text-[var(--dynamic-accent-highlight)]"
                    >
                      {index + 1}
                    </div>

                    {/* Challenge text */}
                    <span className="flex-1 text-sm text-white font-medium" dir="rtl">
                      {challenge}
                    </span>

                    {/* Delete button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveChallenge(index)}
                      className="p-2 rounded-lg text-[var(--text-tertiary)] 
                                                     hover:text-red-400 hover:bg-red-500/15 
                                                     opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Footer stats */}
        {comfortZoneSettings.customChallenges.length > 0 && (
          <motion.div layout className="px-4 pb-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-[var(--text-tertiary)]">
                  {comfortZoneSettings.customChallenges.length} אתגרים פעילים
                </span>
              </div>
              <span className="text-xs text-[var(--text-tertiary)]">גרור לשינוי סדר</span>
            </div>
          </motion.div>
        )}
      </SettingsGroupCard>

      {/* Habits Display Settings */}
      <SettingsGroupCard title="הגדרות הרגלים" icon={<CheckCircleIcon className="w-5 h-5" />}>
        <SettingsToggleRow
          title="הצג הרגלים שהוחמצו"
          description="סמן הרגלים שלא הושלמו אתמול"
          checked={settings.habitsSettings?.showMissedHabits ?? true}
          onChange={v =>
            updateSettings({
              habitsSettings: {
                ...settings.habitsSettings,
                showMissedHabits: v,
              },
            })
          }
        />
        <SettingsToggleRow
          title="הצג רצפים"
          description="הצג מונה ימים רצופים בהרגלים"
          checked={settings.visualSettings?.showStreaks ?? true}
          onChange={v =>
            updateSettings({
              visualSettings: {
                ...settings.visualSettings,
                showStreaks: v,
              },
            })
          }
        />
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">יעד שבועי</p>
              <p className="text-xs text-white/50">כמה ימים בשבוע לשאוף</p>
            </div>
            <div className="flex gap-2">
              {[3, 5, 7].map(days => (
                <button
                  key={days}
                  onClick={() =>
                    updateSettings({
                      habitsSettings: {
                        ...settings.habitsSettings,
                        weeklyGoalDays: days,
                      },
                    })
                  }
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    (settings.habitsSettings?.weeklyGoalDays || 7) === days
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsGroupCard>

      {/* Tips */}
      <SettingsInfoBanner variant="tip">
        אתגרים קטנים יומיים בונים ביטחון עצמי לאורך זמן. התחל בקטן!
      </SettingsInfoBanner>
    </SettingsSection>
  );
};

export default ComfortZoneSection;
