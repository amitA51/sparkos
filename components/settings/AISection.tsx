import React, { useState, useEffect } from 'react';
import { BrainCircuitIcon, SparklesIcon, UserIcon, PlusIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import { AiPersonality, Mentor } from '../../types';
import { getMentors } from '../../services/dataService';
import AddMentorModal from '../AddMentorModal';
import {
  SettingsSection,
  SettingsGroupCard,
  SettingsRow,
  SegmentedControl,
  SettingsInfoBanner,
} from './SettingsComponents';

const inputStyles =
  'w-full bg-white/[0.05] border border-white/[0.1] rounded-xl p-3.5 focus:outline-none focus:border-[var(--dynamic-accent-start)] focus:ring-2 focus:ring-[var(--dynamic-accent-start)]/20 text-white placeholder-[var(--text-secondary)] text-sm transition-all';

const AISection: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [_isLoading, setIsLoading] = useState(true);

  // Load all mentors (default + custom) on mount
  useEffect(() => {
    const loadMentors = async () => {
      try {
        const mentors = await getMentors();
        setAllMentors(mentors);
      } catch (err) {
        console.warn('Failed to load mentors:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMentors();
  }, []);

  const handleSettingChange = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    updateSettings({ [key]: value } as Pick<typeof settings, K>);
  };

  const handleMentorAdded = async () => {
    // Reload all mentors to include the new one
    try {
      const mentors = await getMentors();
      setAllMentors(mentors);
    } catch (err) {
      console.warn('Failed to reload mentors:', err);
    }
  };


  return (
    <SettingsSection title="בינה מלאכותית" id="ai">
      {/* Model Selection */}
      <SettingsGroupCard title="מודל ואישיות" icon={<BrainCircuitIcon className="w-5 h-5" />}>
        <SettingsRow
          title="מודל AI"
          description="בחר מודל מוכן או הזן שם מודל מותאם אישית."
        >
          <div className="space-y-3">
            {/* Preset Models */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'gemini-2.0-flash', label: 'Flash 2.0' },
                { value: 'gemini-2.5-flash', label: 'Flash 2.5' },
                { value: 'gemini-2.5-pro', label: 'Pro 2.5' },
              ].map(model => (
                <button
                  key={model.value}
                  onClick={() => handleSettingChange('aiModel', model.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${settings.aiModel === model.value
                      ? 'bg-gradient-to-br from-[var(--dynamic-accent-start)]/30 to-[var(--dynamic-accent-end)]/20 border border-[var(--dynamic-accent-start)]/50 text-white'
                      : 'bg-white/[0.03] border border-white/[0.08] text-[var(--text-secondary)] hover:bg-white/[0.06]'
                    }
                  `}
                >
                  {model.label}
                </button>
              ))}
            </div>

            {/* Custom Model Input */}
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">או הזן שם מודל:</label>
              <input
                type="text"
                value={settings.aiModel}
                onChange={e => handleSettingChange('aiModel', e.target.value)}
                placeholder="gemini-2.0-flash"
                className={inputStyles}
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                לדוגמה: gemini-2.0-flash, gemini-2.5-pro, gemini-2.0-flash-exp
              </p>
            </div>
          </div>
        </SettingsRow>

        <SettingsRow title="אישיות העוזר" description="כיצד תרצה שה-AI ידבר אליך?">
          <SegmentedControl
            value={settings.aiPersonality}
            onChange={v => handleSettingChange('aiPersonality', v as AiPersonality)}
            options={[
              { label: 'מעודד', value: 'encouraging' },
              { label: 'תמציתי', value: 'concise' },
              { label: 'רשמי', value: 'formal' },
            ]}
          />
        </SettingsRow>

        {/* Personality Preview */}
        <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--dynamic-accent-start)] to-[var(--dynamic-accent-end)] flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[var(--dynamic-accent-highlight)] font-medium mb-1">דוגמה לתגובה:</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {settings.aiPersonality === 'encouraging' && '🎯 מעולה! אתה בדרך הנכונה. בוא נמשיך יחד לעבר היעד!'}
                {settings.aiPersonality === 'concise' && 'הושלם. 3 משימות נותרו להיום.'}
                {settings.aiPersonality === 'formal' && 'המשימה הושלמה בהצלחה. אנא המשך לפריט הבא ברשימה.'}
              </p>
            </div>
          </div>
        </div>
      </SettingsGroupCard>

      {/* Smart Feed Settings */}
      <SettingsGroupCard title="הגדרות פיד חכם" icon={<SparklesIcon className="w-5 h-5" />}>
        <SettingsRow
          title="ייצור תוכן אוטומטי"
          description="האם לאפשר ל-AI לייצר 'ספארקים' יומיים?"
        >
          <ToggleSwitch
            checked={settings.aiFeedSettings.isEnabled}
            onChange={v =>
              handleSettingChange('aiFeedSettings', {
                ...settings.aiFeedSettings,
                isEnabled: v,
              })
            }
          />
        </SettingsRow>

        {settings.aiFeedSettings.isEnabled && (
          <div className="space-y-4 mt-4 pt-4 border-t border-white/[0.06]">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                נושאי עניין
              </label>
              <input
                type="text"
                value={settings.aiFeedSettings.topics.join(', ')}
                onChange={e =>
                  handleSettingChange('aiFeedSettings', {
                    ...settings.aiFeedSettings,
                    topics: e.target.value.split(',').map(t => t.trim()),
                  })
                }
                placeholder="פרודוקטיביות, טכנולוגיה, בריאות..."
                className={inputStyles}
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1.5">הפרד נושאים בפסיקים</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                הנחיה מותאמת אישית
              </label>
              <textarea
                value={settings.aiFeedSettings.customPrompt}
                onChange={e =>
                  handleSettingChange('aiFeedSettings', {
                    ...settings.aiFeedSettings,
                    customPrompt: e.target.value,
                  })
                }
                className={`${inputStyles} resize-none`}
                rows={3}
                placeholder="הנחיה מיוחדת ל-AI..."
              />
            </div>
          </div>
        )}
      </SettingsGroupCard>

      {/* Active Mentors */}
      <SettingsGroupCard title="מנטורים פעילים" icon={<UserIcon className="w-5 h-5" />}>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          בחר מאילו מנטורים לקבל ציטוטים בפיד היומי.
        </p>
        <div className="space-y-3">
          {/* Add Mentor Card */}
          <button
            onClick={() => setIsAddMentorOpen(true)}
            className="w-full group relative overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-center transition-all hover:bg-white/[0.04] hover:border-[var(--dynamic-accent-start)]/50"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dynamic-accent-start)]/10 text-[var(--dynamic-accent-start)] transition-transform group-hover:scale-110 group-hover:bg-[var(--dynamic-accent-start)]/20">
                <PlusIcon className="h-5 w-5" />
              </div>
              <div className="text-right">
                <span className="block font-medium text-white group-hover:text-[var(--dynamic-accent-highlight)] transition-colors">
                  הוסף מנטור חדש
                </span>
                <span className="block text-xs text-[var(--text-secondary)]">
                  צור אישיות מותאמת אישית עם AI
                </span>
              </div>
            </div>
          </button>
          {allMentors.map(mentor => {
            const isEnabled = settings.enabledMentorIds.includes(mentor.id);
            const isCustom = mentor.isCustom;
            return (
              <button
                key={mentor.id}
                onClick={() => {
                  let newIds = [...settings.enabledMentorIds];
                  if (isEnabled) {
                    newIds = newIds.filter(id => id !== mentor.id);
                  } else {
                    newIds.push(mentor.id);
                  }
                  handleSettingChange('enabledMentorIds', newIds);
                }}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl transition-all
                  ${isEnabled
                    ? 'bg-[var(--dynamic-accent-start)]/10 border border-[var(--dynamic-accent-start)]/30'
                    : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.05]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-lg
                    ${isEnabled
                      ? 'bg-gradient-to-br from-[var(--dynamic-accent-start)]/30 to-[var(--dynamic-accent-end)]/20'
                      : 'bg-white/[0.05]'
                    }
                  `}>
                    {mentor.name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{mentor.name}</span>
                      {isCustom && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-violet/10 text-accent-violet border border-accent-violet/20">
                          מותאם אישית
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{mentor.description}</span>
                  </div>
                </div>
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all
                  ${isEnabled
                    ? 'bg-[var(--dynamic-accent-start)] text-white'
                    : 'bg-white/10 text-transparent'
                  }
                `}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsGroupCard>

      {/* Add Mentor Modal */}
      {isAddMentorOpen && (
        <AddMentorModal
          onClose={() => setIsAddMentorOpen(false)}
          onSave={handleMentorAdded}
        />
      )}

      <SettingsInfoBanner variant="info">
        ה-AI משתמש במידע שלך כדי לספק תוכן מותאם אישית. המידע נשמר בצורה מאובטחת ולא משותף עם צד שלישי.
      </SettingsInfoBanner>
    </SettingsSection>
  );
};

export default AISection;

