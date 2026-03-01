import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BellIcon,
    SunIcon,
    MoonIcon,
    CheckCircleIcon,
    CalendarIcon,
    SparklesIcon,
    EditIcon,
} from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import {
    SettingsSection,
    SettingsGroupCard,
    SettingsRow,
    SegmentedControl,
} from './SettingsComponents';

import { usePushToken } from '@/hooks/usePushToken';
import type { NotificationsSettings } from '../../types';

const DAYS_OF_WEEK = [
    { label: 'ראשון', value: 0 },
    { label: 'שני', value: 1 },
    { label: 'שלישי', value: 2 },
    { label: 'רביעי', value: 3 },
    { label: 'חמישי', value: 4 },
    { label: 'שישי', value: 5 },
    { label: 'שבת', value: 6 },
];

const NotificationsSection: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const { requestToken, isSupported, token } = usePushToken();

    // Fallback to structure if migration didn't run (safe guard)
    const notifSettings = settings.notificationsSettings || {
        enabled: true,
        taskRemindersEnabled: true,
        taskReminderMinutes: 15,
        habitRemindersEnabled: true,
        habitReminderTime: '09:00',
        calendarRemindersEnabled: true,
        calendarReminderMinutes: 15,
        noteRemindersEnabled: true,
        dailyDigestEnabled: false,
        dailyDigestTime: '21:00',
        weeklyReviewEnabled: true,
        weeklyReviewDay: 0,
        quietHoursEnabled: false,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        celebrateCompletions: true,
    };

    const handleUpdate = (updates: Partial<NotificationsSettings>) => {
        updateSettings({
            notificationsSettings: {
                ...notifSettings,
                ...updates,
            }
        });
    };

    const handlePushToggle = async (checked: boolean) => {
        if (checked) {
            await requestToken();
        }
        handleUpdate({ enabled: checked });
    };

    const copyTokenToClipboard = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            alert("הטוקן הועתק! עכשיו הדבק אותו ב-Firebase Console.");
        }
    };

    // Animation variants for smooth collapse/expand
    const sectionVariants = {
        hidden: { opacity: 0, height: 0, overflow: 'hidden' as const },
        visible: { opacity: 1, height: 'auto' as const, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } }
    };

    return (
        <SettingsSection title="התראות וסיכומים" id="notifications">

            {/* 💎 Master Switch - Premium Design */}
            <div className="mb-6 p-1 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl">
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${notifSettings.enabled ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-white/5 text-white/40'}`}>
                            <BellIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">התראות מערכת</h3>
                            <p className="text-sm text-white/50 mt-1">
                                {!isSupported
                                    ? "הדפדפן שלך לא תומך בהתראות פוש"
                                    : notifSettings.enabled
                                        ? "ההתראות פעילות"
                                        : "ההתראות מושתקות לחלוטין"}
                            </p>
                        </div>
                    </div>
                    <ToggleSwitch
                        checked={notifSettings.enabled}
                        onChange={handlePushToggle}
                        disabled={!isSupported}
                        size="lg"
                    />
                </div>
            </div>

            <AnimatePresence>
                {notifSettings.enabled && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={sectionVariants}
                        className="space-y-6"
                    >
                        {/* 📅 Routine & Tasks */}
                        <SettingsGroupCard title="שגרה ומשימות" icon={<CheckCircleIcon className="w-5 h-5" />}>
                            {/* Tasks */}
                            <SettingsRow
                                title="תזכורות משימות"
                                description="קבל התראה לפני מועד המשימה."
                                icon={<CheckCircleIcon className="w-4 h-4" />}
                            >
                                <ToggleSwitch
                                    checked={notifSettings.taskRemindersEnabled}
                                    onChange={v => handleUpdate({ taskRemindersEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.taskRemindersEnabled && (
                                <SettingsRow
                                    title="זמן לפני היעד"
                                    description="מתי לקבל את ההתראה."
                                    isSubItem
                                >
                                    <SegmentedControl
                                        value={notifSettings.taskReminderMinutes.toString()}
                                        onChange={v => handleUpdate({ taskReminderMinutes: parseInt(v) as any })}
                                        options={[
                                            { label: '5 דק׳', value: '5' },
                                            { label: 'רבע שעה', value: '15' },
                                            { label: 'חצי שעה', value: '30' },
                                            { label: 'שעה', value: '60' },
                                        ]}
                                    />
                                </SettingsRow>
                            )}

                            {/* Habits */}
                            <SettingsRow
                                title="תזכורות הרגלים"
                                description="תזכורת יומית לביצוע הרגלים."
                                icon={<SparklesIcon className="w-4 h-4" />}
                            >
                                <ToggleSwitch
                                    checked={notifSettings.habitRemindersEnabled}
                                    onChange={v => handleUpdate({ habitRemindersEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.habitRemindersEnabled && (
                                <SettingsRow
                                    title="שעת תזכורת"
                                    description="מתי להזכיר לך על ההרגלים."
                                    isSubItem
                                >
                                    <input
                                        type="time"
                                        value={notifSettings.habitReminderTime}
                                        onChange={e => handleUpdate({ habitReminderTime: e.target.value })}
                                        className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:border-[var(--dynamic-accent-start)] outline-none transition-all focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                                    />
                                </SettingsRow>
                            )}

                            {/* Notes */}
                            <SettingsRow
                                title="תזכורות הערות"
                                description="קבל התראה בשעה שנקבעה לפתק."
                                icon={<EditIcon className="w-4 h-4" />}
                            >
                                <ToggleSwitch
                                    checked={notifSettings.noteRemindersEnabled}
                                    onChange={v => handleUpdate({ noteRemindersEnabled: v })}
                                />
                            </SettingsRow>

                            {/* Calendar */}
                            <SettingsRow
                                title="אירועי יומן"
                                description="תזכורות לפני אירועים ביומן."
                                icon={<CalendarIcon className="w-4 h-4" />}
                            >
                                <ToggleSwitch
                                    checked={notifSettings.calendarRemindersEnabled}
                                    onChange={v => handleUpdate({ calendarRemindersEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.calendarRemindersEnabled && (
                                <SettingsRow
                                    title="זמן לפני אירוע"
                                    description="התראה ברירת מחדל לאירועים."
                                    isSubItem
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="120"
                                            value={notifSettings.calendarReminderMinutes}
                                            onChange={e => handleUpdate({ calendarReminderMinutes: parseInt(e.target.value) })}
                                            className="w-16 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-center text-white focus:border-[var(--dynamic-accent-start)] outline-none"
                                        />
                                        <span className="text-white/60 text-sm">דקות</span>
                                    </div>
                                </SettingsRow>
                            )}
                        </SettingsGroupCard>

                        {/* 🌅 Digests & Reviews */}
                        <SettingsGroupCard title="סיכומים וסקירות" icon={<SunIcon className="w-5 h-5" />}>
                            <SettingsRow
                                title="סיכום יומי"
                                description="סקירה מהירה של היום שלך."
                            >
                                <ToggleSwitch
                                    checked={notifSettings.dailyDigestEnabled}
                                    onChange={v => handleUpdate({ dailyDigestEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.dailyDigestEnabled && (
                                <SettingsRow
                                    title="קביעת שעה"
                                    description="מתי לשלוח את הסיכום."
                                    isSubItem
                                >
                                    <input
                                        type="time"
                                        value={notifSettings.dailyDigestTime}
                                        onChange={e => handleUpdate({ dailyDigestTime: e.target.value })}
                                        className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:border-[var(--dynamic-accent-start)] outline-none"
                                    />
                                </SettingsRow>
                            )}

                            <SettingsRow
                                title="סקירה שבועית"
                                description="ניתוח מעמיק של הביצועים השבועיים."
                            >
                                <ToggleSwitch
                                    checked={notifSettings.weeklyReviewEnabled}
                                    onChange={v => handleUpdate({ weeklyReviewEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.weeklyReviewEnabled && (
                                <SettingsRow
                                    title="יום הסקירה"
                                    description="באיזה יום לקבל את הדוח."
                                    isSubItem
                                >
                                    <div className="relative">
                                        <select
                                            value={notifSettings.weeklyReviewDay}
                                            onChange={e => handleUpdate({ weeklyReviewDay: parseInt(e.target.value) })}
                                            className="appearance-none bg-white/[0.05] border border-white/[0.1] text-white text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:border-[var(--dynamic-accent-start)] transition-all cursor-pointer hover:bg-white/10"
                                        >
                                            {DAYS_OF_WEEK.map(day => (
                                                <option key={day.value} value={day.value} className="bg-[#1E1E1E]">
                                                    {day.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </SettingsRow>
                            )}
                        </SettingsGroupCard>

                        {/* 🌙 Quiet Logic */}
                        <SettingsGroupCard title="שקט ומיקוד" icon={<MoonIcon className="w-5 h-5" />}>
                            <SettingsRow
                                title="שעות שקט"
                                description="השתק התראות בשעות הלילה או בזמן עבודה."
                            >
                                <ToggleSwitch
                                    checked={notifSettings.quietHoursEnabled}
                                    onChange={v => handleUpdate({ quietHoursEnabled: v })}
                                />
                            </SettingsRow>

                            {notifSettings.quietHoursEnabled && (
                                <div className="grid grid-cols-2 gap-4 mt-4 px-4 pb-4">
                                    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
                                        <label className="text-xs text-white/50 block mb-2">התחלה</label>
                                        <input
                                            type="time"
                                            value={notifSettings.quietHoursStart}
                                            onChange={e => handleUpdate({ quietHoursStart: e.target.value })}
                                            className="w-full bg-transparent text-white text-lg font-medium outline-none"
                                        />
                                    </div>
                                    <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
                                        <label className="text-xs text-white/50 block mb-2">סיום</label>
                                        <input
                                            type="time"
                                            value={notifSettings.quietHoursEnd}
                                            onChange={e => handleUpdate({ quietHoursEnd: e.target.value })}
                                            className="w-full bg-transparent text-white text-lg font-medium outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <SettingsRow
                                title="חגיגות הצלחה"
                                description="קונפטי ואנימציות כשמשלימים משימות."
                                icon={<SparklesIcon className="w-4 h-4 text-[var(--accent-primary)]" />}
                            >
                                <ToggleSwitch
                                    checked={notifSettings.celebrateCompletions}
                                    onChange={v => handleUpdate({ celebrateCompletions: v })}
                                />
                            </SettingsRow>
                        </SettingsGroupCard>

                        {/* Debug Toggle - Only visible if token exists */}
                        {token && (
                            <div className="flex justify-center pt-4 opacity-50 hover:opacity-100 transition-opacity">
                                <button
                                    onClick={copyTokenToClipboard}
                                    className="text-xs flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <span>🔑 העתק מזהה מכשיר (Debug Token)</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </SettingsSection>
    );
};

export default NotificationsSection;
