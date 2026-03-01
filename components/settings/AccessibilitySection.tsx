import React from 'react';
import { EyeIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';
import {
    SettingsSection,
    SettingsGroupCard,
    SettingsRow,
} from './SettingsComponents';

const AccessibilitySection: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const handleAccessibilityChange = <K extends keyof typeof settings.accessibilitySettings>(
        key: K,
        value: (typeof settings.accessibilitySettings)[K]
    ) => {
        updateSettings({
            accessibilitySettings: {
                ...settings.accessibilitySettings,
                [key]: value,
            },
        });
    };

    return (
        <SettingsSection title="נגישות" id="accessibility">
            <SettingsGroupCard title="תנועה ותצוגה" icon={<EyeIcon className="w-5 h-5" />}>
                <SettingsRow
                    title="הפחת תנועה"
                    description="צמצם אנימציות ומעברים למינימום."
                >
                    <ToggleSwitch
                        checked={settings.accessibilitySettings.reduceMotion}
                        onChange={v => handleAccessibilityChange('reduceMotion', v)}
                    />
                </SettingsRow>
            </SettingsGroupCard>
        </SettingsSection>
    );
};

export default AccessibilitySection;


