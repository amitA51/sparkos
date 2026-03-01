import React from 'react';
import { PaletteIcon } from '../icons';
import { useSettings } from '../../src/contexts/SettingsContext';
import { ThemeSettings } from '../../types';
import { ThemePreviewCard, SettingsGroupCard, SettingsToggleRow } from './SettingsComponents';

// Premium Theme Collection - $100M Quality with Stunning Gradients
export const THEMES: Record<string, ThemeSettings> = {
    // 🌑 Obsidian Air - Apple Premium Aesthetics
    obsidianAir: {
        name: 'Obsidian Air',
        accentColor: '#FFFFFF',
        font: 'inter', // San Francisco style
        cardStyle: 'glass',
        backgroundEffect: 'ambient-mesh',
        borderRadius: '2xl', // Squircles
        gradientStart: '#FFFFFF',
        gradientEnd: '#E5E5E5',
        glowColor: '#FFFFFF',
        secondaryAccent: '#FFFFFF',
    },
    // ☀️ Minimal White - Clean Studio Light Mode
    minimalWhite: {
        name: 'Minimal White',
        accentColor: '#2563EB',
        font: 'inter',
        cardStyle: 'bordered',
        backgroundEffect: 'off',
        borderRadius: 'xl',
        gradientStart: '#EFF6FF',
        gradientEnd: '#DBEAFE',
        glowColor: '#60A5FA',
        secondaryAccent: '#0F172A',
    },
    // 🌌 Nebula - Holographic Void (Premium of the Premium)
    nebula: {
        name: 'Nebula',
        accentColor: '#7F00FF',
        font: 'satoshi',
        cardStyle: 'glass',
        backgroundEffect: 'aurora-flow',
        borderRadius: 'xl',
        gradientStart: '#7F00FF',  // Electric Violet
        gradientEnd: '#00D1FF',    // Cyber Cyan
        glowColor: '#00D1FF',
        secondaryAccent: '#7F00FF',
    },
    // 🌌 Aurora Borealis - Ethereal Northern Lights
    aurora: {
        name: 'Aurora Borealis',
        accentColor: '#4ADE80',
        font: 'satoshi',
        cardStyle: 'glass',
        backgroundEffect: 'aurora-flow',
        borderRadius: 'xl',
        gradientStart: '#22D3EE',
        gradientEnd: '#4ADE80',
        glowColor: '#22D3EE',
        secondaryAccent: '#A78BFA',
    },
    // 🌅 Sunset Glow - Warm California Vibes
    sunset: {
        name: 'Sunset Glow',
        accentColor: '#FB923C',
        font: 'clash-display',
        cardStyle: 'glass',
        backgroundEffect: 'ambient-mesh',
        borderRadius: 'lg',
        gradientStart: '#F472B6',
        gradientEnd: '#FB923C',
        glowColor: '#FB923C',
        secondaryAccent: '#FBBF24',
    },
    // 🌊 Deep Ocean - Mysterious Depths
    ocean: {
        name: 'Deep Ocean',
        accentColor: '#22D3EE',
        font: 'marcelo',
        cardStyle: 'glass',
        backgroundEffect: 'silk-waves',
        borderRadius: 'lg',
        gradientStart: '#0EA5E9',
        gradientEnd: '#22D3EE',
        glowColor: '#0EA5E9',
        secondaryAccent: '#38BDF8',
    },
    // 🌸 Cherry Blossom - Japanese Elegance
    sakura: {
        name: 'Cherry Blossom',
        accentColor: '#F472B6',
        font: 'poppins',
        cardStyle: 'glass',
        backgroundEffect: 'particle-dust',
        borderRadius: 'xl',
        gradientStart: '#FB7185',
        gradientEnd: '#F9A8D4',
        glowColor: '#F472B6',
        secondaryAccent: '#FBBF24',
    },
    // 💎 Diamond - Pure Luxury
    diamond: {
        name: 'Diamond',
        accentColor: '#E0E7FF',
        font: 'inter',
        cardStyle: 'bordered',
      backgroundEffect: 'dark',
        borderRadius: 'lg',
        gradientStart: '#C7D2FE',
        gradientEnd: '#F1F5F9',
        glowColor: '#818CF8',
        secondaryAccent: '#A5B4FC',
    },
    // 🔥 Ember - Fiery Passion
    ember: {
        name: 'Ember',
        accentColor: '#F87171',
        font: 'clash-display',
        cardStyle: 'flat',
        backgroundEffect: 'dark',
        borderRadius: 'md',
        gradientStart: '#EF4444',
        gradientEnd: '#FBBF24',
        glowColor: '#F87171',
        secondaryAccent: '#FB923C',
    },
    // 🌿 Forest - Natural Serenity
    forest: {
        name: 'Forest',
        accentColor: '#34D399',
        font: 'rubik',
        cardStyle: 'glass',
        backgroundEffect: 'particle-dust',
        borderRadius: 'lg',
        gradientStart: '#059669',
        gradientEnd: '#6EE7B7',
        glowColor: '#10B981',
        secondaryAccent: '#84CC16',
    },
    // 🌙 Moonlight - Gentle Night
    moonlight: {
        name: 'Moonlight',
        accentColor: '#A5B4FC',
        font: 'satoshi',
        cardStyle: 'glass',
        backgroundEffect: 'dark',
        borderRadius: 'xl',
        gradientStart: '#6366F1',
        gradientEnd: '#C7D2FE',
        glowColor: '#818CF8',
        secondaryAccent: '#DDD6FE',
    },
    // 🎭 Noir - Classic Elegance
    noir: {
        name: 'Noir',
        accentColor: '#FBBF24',
        font: 'inter',
        cardStyle: 'bordered',
        backgroundEffect: 'dark',
        borderRadius: 'md',
        gradientStart: '#F59E0B',
        gradientEnd: '#FDE047',
        glowColor: '#FBBF24',
        secondaryAccent: '#D4D4D8',
    },
    // 🦋 Morpho - Electric Blue
    morpho: {
        name: 'Morpho',
        accentColor: '#60A5FA',
        font: 'poppins',
        cardStyle: 'glass',
        backgroundEffect: 'aurora-flow',
        borderRadius: 'xl',
        gradientStart: '#3B82F6',
        gradientEnd: '#A78BFA',
        glowColor: '#60A5FA',
        secondaryAccent: '#C084FC',
    },
    // ✨ Stardust - Magical Sparkle
    stardust: {
        name: 'Stardust',
        accentColor: '#C084FC',
        font: 'satoshi',
        cardStyle: 'glass',
        backgroundEffect: 'particle-dust',
        borderRadius: 'xl',
        gradientStart: '#A855F7',
        gradientEnd: '#F472B6',
        glowColor: '#C084FC',
        secondaryAccent: '#FB7185',
    },
    // 💎 Spark - Default Blue (Default Theme)
    spark: {
        name: 'Spark',
        accentColor: '#0496c7',
        font: 'heebo',
        cardStyle: 'glass',
        backgroundEffect: 'dark',
        borderRadius: 'xl',
        gradientStart: '#0496c7',
        gradientEnd: '#06b6d4',
        glowColor: '#0496c7',
        secondaryAccent: '#38bdf8',
        fontWeight: 'medium',
    },
    // 🍇 Grape - Rich & Bold
    grape: {
        name: 'Grape',
        accentColor: '#A78BFA',
        font: 'marcelo',
        cardStyle: 'glass',
        backgroundEffect: 'dark',
        borderRadius: 'lg',
        gradientStart: '#7C3AED',
        gradientEnd: '#C4B5FD',
        glowColor: '#8B5CF6',
        secondaryAccent: '#DDD6FE',
    },
};

const ThemeSelector: React.FC = () => {
    const { settings, updateSettings } = useSettings();

    const handleSettingChange = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
        updateSettings({ [key]: value } as Pick<typeof settings, K>);
    };

    return (
        <SettingsGroupCard title="ערכות נושא" icon={<PaletteIcon className="w-5 h-5" />}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(THEMES).map(([key, theme]) => (
                    <ThemePreviewCard
                        key={key}
                        theme={theme}
                        isSelected={
                            settings.themeSettings.name === theme.name &&
                            settings.themeSettings.name !== 'Custom'
                        }
                        onClick={() => handleSettingChange('themeSettings', theme)}
                    />
                ))}
                {/* Custom Theme Card */}
                <button
                    onClick={() =>
                        handleSettingChange('themeSettings', {
                            ...settings.themeSettings,
                            name: 'Custom',
                        })
                    }
                    className="text-center group w-full"
                >
                    <div
                        className={`
                relative w-full aspect-[4/3] rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden
                ${settings.themeSettings.name === 'Custom'
                                ? 'ring-2 ring-[var(--dynamic-accent-start)] shadow-[0_0_30px_var(--dynamic-accent-glow)]'
                                : 'ring-1 ring-white/10 hover:ring-white/20'
                            }
                bg-gradient-to-br from-white/[0.03] to-white/[0.01]
                group-hover:scale-[1.02] group-active:scale-[0.98]
              `}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <PaletteIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--dynamic-accent-start)] transition-colors" />
                            <span className="text-xs text-[var(--text-secondary)] group-hover:text-white transition-colors">התאמה אישית</span>
                        </div>
                    </div>
                    <span
                        className={`
                text-sm mt-2 font-semibold block transition-colors
                ${settings.themeSettings.name === 'Custom' ? 'text-[var(--dynamic-accent-start)]' : 'text-[var(--text-secondary)] group-hover:text-white'}
              `}
                    >
                        מותאם אישית
                    </span>
                </button>
            </div>

            {/* Extended Theme Options */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                <SettingsToggleRow
                    title="Pitch Black (OLED)"
                    description="Force pure black background for battery saving"
                    checked={settings.themeSettings.backgroundEffect === 'oled'}
                    onChange={(checked) =>
                        handleSettingChange('themeSettings', {
                            ...settings.themeSettings,
                            backgroundEffect: checked ? 'oled' : 'dark'
                        })
                    }
                />
            </div>
        </SettingsGroupCard>
    );
};

export default ThemeSelector;
