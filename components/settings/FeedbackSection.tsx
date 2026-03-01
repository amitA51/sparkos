import React from 'react';
import { BellIcon, SmartphoneIcon } from '../../components/icons';
import ToggleSwitch from '../../components/ToggleSwitch';
import { useSettings } from '../../src/contexts/SettingsContext';

/**
 * FeedbackSection - Only sounds and haptics settings
 * This section handles feedback settings that affect how the app responds to user actions
 */

interface FeedbackSectionProps {
    setStatusMessage: (msg: { type: 'success' | 'error' | 'info'; text: string; id: number } | null) => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ setStatusMessage }) => {
    const { settings, updateSettings } = useSettings();

    const handleSettingChange = <K extends keyof typeof settings>(
        key: K,
        value: (typeof settings)[K]
    ) => {
        updateSettings({ [key]: value });
        setStatusMessage({
            type: 'success',
            text: 'ההגדרה עודכנה',
            id: Date.now(),
        });
    };

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 
                    flex items-center justify-center backdrop-blur-sm border border-white/5">
                    <BellIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">צלילים ורטט</h2>
                    <p className="text-sm text-white/50">משוב למשתמש בפעולות</p>
                </div>
            </div>

            {/* Sound Settings */}
            <div className="bg-white/[0.03] rounded-2xl p-5 space-y-4 border border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🔊</span>
                        <div>
                            <p className="font-semibold text-white">צלילים</p>
                            <p className="text-sm text-white/50">אפקטי סאונד בפעולות</p>
                        </div>
                    </div>
                    <ToggleSwitch
                        checked={settings.soundEnabled}
                        onChange={(val) => handleSettingChange('soundEnabled', val)}
                    />
                </div>

                <div className="h-px bg-white/[0.05]" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📳</span>
                        <div>
                            <p className="font-semibold text-white">רטט</p>
                            <p className="text-sm text-white/50">משוב הפטי בלחיצות</p>
                        </div>
                    </div>
                    <ToggleSwitch
                        checked={settings.hapticFeedback}
                        onChange={(val) => handleSettingChange('hapticFeedback', val)}
                    />
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 
                border border-indigo-500/20">
                <div className="flex items-start gap-3">
                    <SmartphoneIcon className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                        <p className="text-sm text-white/70">
                            צלילים ורטט יספקו משוב מיידי על פעולות שלך באפליקציה
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSection;
