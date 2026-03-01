import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons';
import { UltraCard } from '../ui/UltraCard';

// Premium Group Card using UltraCard
export const SettingsGroupCard: React.FC<{
    title: string;
    children: React.ReactNode;
    danger?: boolean;
    icon?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}> = ({
    title,
    children,
    danger,
    icon,
    collapsible = false,
    defaultOpen = true,
}) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);

        return (
            <UltraCard
                variant="glass"
                glowColor={danger ? 'magenta' : 'neutral'}
                className={`transition-all duration-300 ${danger ? 'border-red-500/30 bg-red-950/10' : ''}`}
                noPadding
            >
                <button
                    onClick={() => collapsible && setIsOpen(!isOpen)}
                    className={`
                      relative z-10 w-full px-3 py-2.5 flex items-center justify-between
                      ${collapsible ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={!collapsible}
                >
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <div className={`
                              p-1.5 rounded-lg transition-all duration-300
                              ${danger
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-[var(--dynamic-accent-start)]/10 text-[var(--dynamic-accent-start)]'
                                }
                            `}>
                                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-4 h-4' })}
                            </div>
                        )}
                        <h3
                            className={`
                              text-xs font-bold uppercase tracking-wider transition-colors
                              ${danger ? 'text-red-400' : 'text-[var(--dynamic-accent-highlight)]'}
                            `}
                        >
                            {title}
                        </h3>
                    </div>
                    {collapsible && (
                        <ChevronDownIcon
                            className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>

                <div className={`
                    relative z-10 transition-all duration-300 ease-out overflow-hidden
                    ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                    <div className="px-3 pb-3 space-y-2">
                        {children}
                    </div>
                </div>
            </UltraCard>
        );
    };
