import React from 'react';
import {
    LayoutIcon,
    PlusIcon,
    CheckCircleIcon,
    SwipeIcon,
    EyeIcon,
} from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import {
    SettingsSection,
    SettingsGroupCard,
    SettingsRow,
    SegmentedControl,
} from './SettingsComponents';
import type { UiSettings } from '../../types';

// Swipe action options
const SWIPE_ACTIONS = [
    { label: 'השלמה', value: 'complete', icon: '✓' },
    { label: 'דחייה', value: 'postpone', icon: '→' },
    { label: 'מחיקה', value: 'delete', icon: '×' },
    { label: 'כלום', value: 'none', icon: '—' },
];

const UiSection: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    // Safe fallback in case migration hasn't run yet
    const uiSettings = settings.uiSettings || {
        quickAddEnabled: true,
        defaultQuickAddType: 'task',
        showConfirmDialogs: true,
        hideQuickTemplates: false,
    };

    const handleUpdate = (updates: Partial<UiSettings>) => {
        updateSettings({
            uiSettings: {
                ...uiSettings,
                ...updates,
            }
        });
    };

    const handleSettingChange = <K extends keyof typeof settings>(
        key: K,
        value: (typeof settings)[K]
    ) => {
        updateSettings({ [key]: value });
    };

    return (
        <SettingsSection title="ממשק והתנהגות" id="interface">
            {/* Display Settings */}
            <SettingsGroupCard title="תצוגה" icon={<EyeIcon className="w-5 h-5" />}>
                <SettingsRow
                    title="צפיפות תצוגה"
                    description="בחר כמה צפוף או מרווח להיות בכל המסכים."
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
                    description="שנה כמה חזקות וחיות יהיו האנימציות."
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

                <SettingsRow
                    title="הפחת תנועה"
                    description="צמצם אנימציות ומעברים (נגישות)."
                >
                    <ToggleSwitch
                        checked={settings.accessibilitySettings?.reduceMotion ?? false}
                        onChange={v => handleSettingChange('accessibilitySettings', {
                            ...settings.accessibilitySettings,
                            reduceMotion: v,
                        } as typeof settings.accessibilitySettings)}
                    />
                </SettingsRow>
            </SettingsGroupCard>

            {/* Swipe Actions */}
            <SettingsGroupCard
                title="פעולות החלקה"
                icon={<SwipeIcon className="w-5 h-5" />}
                collapsible
                defaultOpen={false}
            >
                <p className="text-sm text-white/50 mb-4">
                    הגדר מה קורה כאשר אתה מחליק משימה ימינה או שמאלה.
                </p>
                <SettingsRow title="החלקה ימינה →" description="פעולה לביצוע בהחלקה ימינה.">
                    <div className="flex gap-2">
                        {SWIPE_ACTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleSettingChange('swipeRightAction', opt.value as typeof settings.swipeRightAction)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                    ${settings.swipeRightAction === opt.value
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'
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
                                onClick={() => handleSettingChange('swipeLeftAction', opt.value as typeof settings.swipeLeftAction)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                                    ${settings.swipeLeftAction === opt.value
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'
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

            {/* Quick Actions */}
            <SettingsGroupCard title="פעולות מהירות" icon={<PlusIcon className="w-5 h-5" />}>
                <SettingsRow
                    title="כפתור הוספה מהירה"
                    description="הצג כפתור צף להוספת פריטים בכל מסך."
                >
                    <ToggleSwitch
                        checked={uiSettings.quickAddEnabled}
                        onChange={v => handleUpdate({ quickAddEnabled: v })}
                    />
                </SettingsRow>

                {uiSettings.quickAddEnabled && (
                    <SettingsRow
                        title="ברירת מחדל להוספה"
                        description="איזה סוג פריט ייפתח בלחיצה קצרה."
                        isSubItem
                    >
                        <SegmentedControl
                            value={uiSettings.defaultQuickAddType}
                            onChange={v => handleUpdate({ defaultQuickAddType: v as any })}
                            options={[
                                { label: 'משימה', value: 'task' },
                                { label: 'פתק', value: 'note' },
                                { label: 'רעיון', value: 'idea' },
                            ]}
                        />
                    </SettingsRow>
                )}

                <SettingsRow
                    title="תבניות מהירות"
                    description="הצג תבניות מוכנות במסך ההוספה."
                >
                    <ToggleSwitch
                        checked={!uiSettings.hideQuickTemplates}
                        onChange={v => handleUpdate({ hideQuickTemplates: !v })}
                    />
                </SettingsRow>
            </SettingsGroupCard>

            {/* Interaction & Dialogs */}
            <SettingsGroupCard title="אינטראקציה" icon={<LayoutIcon className="w-5 h-5" />}>
                <SettingsRow
                    title="ווידוא פעולות"
                    description="הצג דיאלוג אישור לפני מחיקה או פעולות קריטיות."
                    icon={<CheckCircleIcon className="w-4 h-4" />}
                >
                    <ToggleSwitch
                        checked={uiSettings.showConfirmDialogs}
                        onChange={v => handleUpdate({ showConfirmDialogs: v })}
                    />
                </SettingsRow>
            </SettingsGroupCard>

            {/* Add Menu Items */}
            <SettingsGroupCard title="תפריט הוספה" icon={<PlusIcon className="w-5 h-5" />} collapsible defaultOpen={false}>
                <p className="text-sm text-white/50 mb-4">
                    בחר אילו פריטים יופיעו במסך ההוספה.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                        { id: 'task', label: 'משימה', emoji: '✅' },
                        { id: 'note', label: 'פתק', emoji: '📝' },
                        { id: 'idea', label: 'רעיון', emoji: '💡' },
                        { id: 'habit', label: 'הרגל', emoji: '🔄' },
                        { id: 'spark', label: 'ספארק', emoji: '⚡' },
                        { id: 'link', label: 'קישור', emoji: '🔗' },
                        { id: 'book', label: 'ספר', emoji: '📚' },
                        { id: 'workout', label: 'אימון', emoji: '💪' },
                        { id: 'goal', label: 'פרויקט', emoji: '🎯' },
                    ].map(item => {
                        const isActive = (settings.addScreenLayout || []).includes(item.id as any);
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    let newLayout = [...(settings.addScreenLayout || [])];
                                    if (isActive) {
                                        newLayout = newLayout.filter(t => t !== item.id);
                                    } else {
                                        newLayout.push(item.id as any);
                                    }
                                    handleSettingChange('addScreenLayout', newLayout);
                                }}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl transition-all
                                    ${isActive
                                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                                        : 'bg-white/[0.03] border border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <span>{item.emoji}</span>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </SettingsGroupCard>
        </SettingsSection>
    );
};

export default UiSection;
