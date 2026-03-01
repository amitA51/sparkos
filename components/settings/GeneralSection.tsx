import React from 'react';
import {
  CheckCircleIcon,
  LayoutIcon,
  SwipeIcon,
  HomeIcon,
  PlusIcon,
  TimerIcon,
  SmartphoneIcon,
  EyeIcon,
  SparklesIcon,
} from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import { AddableType, SwipeAction } from '../../types';
import { StatusMessageType } from '../../components/StatusMessage';
import ProfileCard from './ProfileCard';
import {
  SettingsSection,
  SettingsGroupCard,
  SettingsRow,
  SegmentedControl,
} from './SettingsComponents';

const SECTION_LABELS: Record<string, string> = {
  gratitude: 'הכרת תודה',
  habits: 'הרגלים להיום',
  tasks: 'משימות פתוחות',
  google_calendar: 'סדר יום',
  comfort_zone: 'יציאה מאזור הנוחות',
  quote: 'ציטוט יומי',
  quote_comfort_row: 'ציטוט ואתגר',
  focus_timer: 'טיימר למידה',
  meditation: 'מדיטציה',
};

const ADD_ITEMS: { id: AddableType; label: string; emoji: string }[] = [
  { id: 'task', label: 'משימה', emoji: '✅' },
  { id: 'note', label: 'פתק', emoji: '📝' },
  { id: 'idea', label: 'רעיון', emoji: '💡' },
  { id: 'habit', label: 'הרגל', emoji: '🔄' },
  { id: 'spark', label: 'ספארק', emoji: '⚡' },
  { id: 'link', label: 'קישור', emoji: '🔗' },
  { id: 'book', label: 'ספר', emoji: '📚' },
  { id: 'workout', label: 'אימון', emoji: '💪' },
  { id: 'goal', label: 'פרויקט', emoji: '🎯' },
  { id: 'roadmap', label: 'מפת דרכים', emoji: '🗺️' },
  { id: 'journal', label: 'יומן', emoji: '📔' },
  { id: 'learning', label: 'למידה', emoji: '🎓' },
  { id: 'ticker', label: 'מניה/מטבע', emoji: '📈' },
];

const SWIPE_ACTIONS: { label: string; value: SwipeAction; icon: string }[] = [
  { label: 'השלמה', value: 'complete', icon: '✓' },
  { label: 'דחייה', value: 'postpone', icon: '→' },
  { label: 'מחיקה', value: 'delete', icon: '×' },
  { label: 'כלום', value: 'none', icon: '—' },
];

interface GeneralSectionProps {
  setStatusMessage: (msg: { type: StatusMessageType; text: string; id: number } | null) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({ setStatusMessage }) => {
  const { settings, updateSettings } = useSettings();

  const handleSettingChange = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    updateSettings({ [key]: value } as Pick<typeof settings, K>);
  };


  return (
    <SettingsSection title="כללי וטיימר" id="general">
      <ProfileCard setStatusMessage={setStatusMessage} />



      {/* User Experience */}
      <SettingsGroupCard title="חווית משתמש" icon={<SparklesIcon className="w-5 h-5" />}>

        <SettingsRow
          title="משוב רטט (Haptics)"
          description="רטט עדין בפעולות ממשק."
          icon={<SmartphoneIcon className="w-4 h-4" />}
        >
          <ToggleSwitch
            checked={settings.hapticFeedback}
            onChange={v => handleSettingChange('hapticFeedback', v)}
          />
        </SettingsRow>
        <SettingsRow
          title="צפיפות תצוגה"
          description="בחר כמה צפוף או מרווח להיות בכל המסכים."
          icon={<EyeIcon className="w-4 h-4" />}
        >
          <SegmentedControl
            value={settings.uiDensity}
            onChange={v => handleSettingChange('uiDensity', v as 'compact' | 'comfortable' | 'spacious')}
            options={[
              { label: 'דחוס', value: 'compact' },
              { label: 'רגיל', value: 'comfortable' },
              { label: 'מרווח', value: 'spacious' },
            ]}
          />
        </SettingsRow>
        <SettingsRow
          title="עוצמת אנימציות"
          description="שנה כמה חזקות וחיות יהיו האנימציות בממשק."
        >
          <SegmentedControl
            value={settings.animationIntensity}
            onChange={v => handleSettingChange('animationIntensity', v as 'off' | 'subtle' | 'default' | 'full')}
            options={[
              { label: 'כבוי', value: 'off' },
              { label: 'עדין', value: 'subtle' },
              { label: 'רגיל', value: 'default' },
              { label: 'מלא', value: 'full' },
            ]}
          />
        </SettingsRow>

      </SettingsGroupCard>

      {/* Visual Settings for Enhanced Components */}
      <SettingsGroupCard title="הגדרות ויזואליות" icon={<EyeIcon className="w-5 h-5" />}>
        <SettingsRow
          title="הצג רצפים"
          description="הצג מונה ימים רצופים בהרגלים והכרת תודה."
        >
          <ToggleSwitch
            checked={settings.visualSettings?.showStreaks ?? true}
            onChange={v => handleSettingChange('visualSettings', {
              ...settings.visualSettings,
              showStreaks: v
            })}
          />
        </SettingsRow>
      </SettingsGroupCard>

      {/* Navigation & Display */}


      {/* Swipe Actions */}
      <SettingsGroupCard title="פעולות החלקה" icon={<SwipeIcon className="w-5 h-5" />} collapsible defaultOpen={false}>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          הגדר מה קורה כאשר אתה מחליק משימה ימינה או שמאלה.
        </p>
        <SettingsRow title="החלקה ימינה →" description="פעולה לביצוע בהחלקה ימינה.">
          <div className="flex gap-2">
            {SWIPE_ACTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSettingChange('swipeRightAction', opt.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${settings.swipeRightAction === opt.value
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/[0.05] text-[var(--text-secondary)] hover:bg-white/[0.1]'
                  }
                `}
              >
                <span className="text-xs">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </SettingsRow>
        <SettingsRow title="← החלקה שמאלה" description="פעולה לביצוע בהחלקה שמאלה.">
          <div className="flex gap-2">
            {SWIPE_ACTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSettingChange('swipeLeftAction', opt.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${settings.swipeLeftAction === opt.value
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-white/[0.05] text-[var(--text-secondary)] hover:bg-white/[0.1]'
                  }
                `}
              >
                <span className="text-xs">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </SettingsRow>
      </SettingsGroupCard>

      {/* Home Screen Layout */}
      <SettingsGroupCard title="מסך הבית (היום)" icon={<HomeIcon className="w-5 h-5" />} collapsible defaultOpen={false}>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          בחר אילו אזורים יוצגו במסך הבית.
        </p>
        <div className="space-y-2">
          {settings.homeScreenLayout.map(component => (
            <div
              key={component.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all"
            >
              <div>
                <span className="text-white font-medium">{SECTION_LABELS[component.id] || component.id}</span>
                <span className={`text-xs mr-2 ${component.isVisible ? 'text-emerald-400' : 'text-[var(--text-secondary)]'}`}>
                  {component.isVisible ? 'מוצג' : 'מוסתר'}
                </span>
              </div>
              <ToggleSwitch
                checked={component.isVisible}
                onChange={checked => {
                  const newLayout = settings.homeScreenLayout.map(c =>
                    c.id === component.id ? { ...c, isVisible: checked } : c
                  );
                  handleSettingChange('homeScreenLayout', newLayout);
                }}
              />
            </div>
          ))}
        </div>
      </SettingsGroupCard>

      {/* Add Menu */}
      <SettingsGroupCard title="תפריט הוספה" icon={<PlusIcon className="w-5 h-5" />} collapsible defaultOpen={false}>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          בחר אילו פריטים יופיעו במסך ההוספה.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ADD_ITEMS.map(item => {
            const isActive = settings.addScreenLayout.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => {
                  let newLayout = [...settings.addScreenLayout];
                  if (isActive) {
                    newLayout = newLayout.filter(t => t !== item.id);
                  } else {
                    newLayout.push(item.id);
                  }
                  handleSettingChange('addScreenLayout', newLayout);
                }}
                className={`
                  flex items-center justify-between p-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-[var(--dynamic-accent-start)]/15 border border-[var(--dynamic-accent-start)]/40 text-white'
                    : 'bg-white/[0.03] border border-transparent text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-white'
                  }
                `}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span>{item.emoji}</span>
                  {item.label}
                </span>
                {isActive && (
                  <CheckCircleIcon className="w-4 h-4 text-[var(--dynamic-accent-start)]" />
                )}
              </button>
            );
          })}
        </div>
      </SettingsGroupCard>



      {/* Focus Timer */}
      <SettingsGroupCard title="טיימר פוקוס" icon={<TimerIcon className="w-5 h-5" />}>
        <SettingsRow title="זמן עבודה (דקות)" description="משך סשן עבודה רגיל.">
          <input
            type="number"
            value={settings.pomodoroSettings.workDuration}
            onChange={e =>
              handleSettingChange('pomodoroSettings', {
                ...settings.pomodoroSettings,
                workDuration: parseInt(e.target.value),
              })
            }
            className="w-20 bg-white/[0.05] border border-white/[0.1] rounded-xl p-2.5 text-center text-white focus:border-[var(--dynamic-accent-start)] focus:ring-2 focus:ring-[var(--dynamic-accent-start)]/20 outline-none transition-all"
          />
        </SettingsRow>
        <SettingsRow title="הפסקה קצרה (דקות)" description="משך המנוחה בין סשנים.">
          <input
            type="number"
            value={settings.pomodoroSettings.shortBreak}
            onChange={e =>
              handleSettingChange('pomodoroSettings', {
                ...settings.pomodoroSettings,
                shortBreak: parseInt(e.target.value),
              })
            }
            className="w-20 bg-white/[0.05] border border-white/[0.1] rounded-xl p-2.5 text-center text-white focus:border-[var(--dynamic-accent-start)] focus:ring-2 focus:ring-[var(--dynamic-accent-start)]/20 outline-none transition-all"
          />
        </SettingsRow>
        <SettingsRow title="הפעלה אוטומטית" description="התחל את הסשן הבא באופן אוטומטי.">
          <ToggleSwitch
            checked={settings.pomodoroSettings.autoStartNext}
            onChange={v =>
              handleSettingChange('pomodoroSettings', {
                ...settings.pomodoroSettings,
                autoStartNext: v,
              })
            }
          />
        </SettingsRow>
      </SettingsGroupCard>

      {/* Feed Settings */}
      <SettingsGroupCard title="פיד ותוכן" icon={<LayoutIcon className="w-5 h-5" />}>
        <SettingsRow title="סמן כנקרא בפתיחה" description="סמן פריט כנקרא כשאתה פותח אותו.">
          <ToggleSwitch
            checked={settings.feedSettings.markAsReadOnOpen}
            onChange={v =>
              handleSettingChange('feedSettings', {
                ...settings.feedSettings,
                markAsReadOnOpen: v,
              })
            }
          />
        </SettingsRow>

      </SettingsGroupCard>

      {/* Habits Settings */}
      <SettingsGroupCard title="הרגלים" icon={<CheckCircleIcon className="w-5 h-5" />}>
        <SettingsRow title="הצג הרגלים שהוחמצו" description="סמן הרגלים שלא הושלמו.">
          <ToggleSwitch
            checked={settings.habitsSettings.showMissedHabits}
            onChange={v =>
              handleSettingChange('habitsSettings', {
                ...settings.habitsSettings,
                showMissedHabits: v,
              })
            }
          />
        </SettingsRow>
        <SettingsRow title="יעד שבועי" description="כמה ימים בשבוע לשאוף.">
          <SegmentedControl
            value={settings.habitsSettings.weeklyGoalDays.toString()}
            onChange={v =>
              handleSettingChange('habitsSettings', {
                ...settings.habitsSettings,
                weeklyGoalDays: parseInt(v),
              })
            }
            options={[
              { label: '3', value: '3' },
              { label: '5', value: '5' },
              { label: '7', value: '7' },
            ]}
          />
        </SettingsRow>
      </SettingsGroupCard>

      {/* Home Screen Settings */}
      <SettingsGroupCard title="מסך בית" icon={<HomeIcon className="w-5 h-5" />}>
        <SettingsRow title="ברכה אישית" description="הצג ברכה עם השם שלך.">
          <ToggleSwitch
            checked={settings.homeSettings.showGreeting}
            onChange={v =>
              handleSettingChange('homeSettings', {
                ...settings.homeSettings,
                showGreeting: v,
              })
            }
          />
        </SettingsRow>


        <SettingsRow title="תצוגת לוח שנה" description="הצג אירועים קרובים.">
          <ToggleSwitch
            checked={settings.homeSettings.showCalendarPreview}
            onChange={v =>
              handleSettingChange('homeSettings', {
                ...settings.homeSettings,
                showCalendarPreview: v,
              })
            }
          />
        </SettingsRow>
        <SettingsRow title="גודל ווידג'טים" description="גודל ברירת מחדל.">
          <SegmentedControl
            value={settings.homeSettings.widgetSize}
            onChange={v =>
              handleSettingChange('homeSettings', {
                ...settings.homeSettings,
                widgetSize: v as 'small' | 'medium' | 'large',
              })
            }
            options={[
              { label: 'קטן', value: 'small' },
              { label: 'בינוני', value: 'medium' },
              { label: 'גדול', value: 'large' },
            ]}
          />
        </SettingsRow>
      </SettingsGroupCard>
    </SettingsSection>
  );
};

export default GeneralSection;

