import React from 'react';
import {
    SettingsIcon,
} from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import {
    SettingsSection,
    SettingsGroupCard,
    SettingsRow,
} from './SettingsComponents';

const CalendarSection: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const handleCalendarSettingChange = <K extends keyof typeof settings.calendarSettings>(
        key: K,
        value: (typeof settings.calendarSettings)[K]
    ) => {
        updateSettings({
            calendarSettings: {
                ...settings.calendarSettings,
                [key]: value,
            },
        });
    };

    return (
        <SettingsSection title="לוח שנה וזמן" id="calendar">


            {/* Working Hours */}
            <SettingsGroupCard title="שעות עבודה" icon={<SettingsIcon className="w-5 h-5" />}>
                <SettingsRow
                    title="הצג שעות עבודה"
                    description="הדגש את שעות העבודה שלך בלוח השנה."
                >
                    <ToggleSwitch
                        checked={settings.calendarSettings.workingHoursEnabled}
                        onChange={v => handleCalendarSettingChange('workingHoursEnabled', v)}
                    />
                </SettingsRow>
                {settings.calendarSettings.workingHoursEnabled && (
                    <>
                        <SettingsRow title="שעת התחלה" description="מתי מתחיל יום העבודה.">
                            <input
                                type="time"
                                value={settings.calendarSettings.workingHoursStart}
                                onChange={e => handleCalendarSettingChange('workingHoursStart', e.target.value)}
                                className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:border-[var(--dynamic-accent-start)] outline-none"
                            />
                        </SettingsRow>
                        <SettingsRow title="שעת סיום" description="מתי מסתיים יום העבודה.">
                            <input
                                type="time"
                                value={settings.calendarSettings.workingHoursEnd}
                                onChange={e => handleCalendarSettingChange('workingHoursEnd', e.target.value)}
                                className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:border-[var(--dynamic-accent-start)] outline-none"
                            />
                        </SettingsRow>
                    </>
                )}
            </SettingsGroupCard>
        </SettingsSection>
    );
};

export default CalendarSection;


