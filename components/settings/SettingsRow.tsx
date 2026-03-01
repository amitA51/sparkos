import React from 'react';

// Premium Settings Row with better spacing and touch targets
export const SettingsRow: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    isSubItem?: boolean;
}> = ({
    title,
    description,
    children,
    icon,
    isSubItem = false,
}) => (
        <div className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-5 border-t border-white/[0.05] first:border-t-0 first:pt-0 last:pb-0 ${isSubItem ? 'pr-4 mr-4 border-r-2 border-[var(--accent-primary)]/30 bg-white/[0.02] rounded-l-lg' : ''}`}>
            <div className="flex items-start gap-4 flex-1">
                {icon && (
                    <div className="p-2.5 rounded-xl bg-white/[0.03] text-white/50 group-hover:text-[var(--dynamic-accent-start)] group-hover:bg-[var(--dynamic-accent-start)]/10 transition-all duration-300">
                        {icon}
                    </div>
                )}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`font-semibold text-white leading-tight tracking-tight ${isSubItem ? 'text-[14px]' : 'text-[15px]'}`}>{title}</p>
                    <p className="text-sm text-white/50 mt-1.5 leading-relaxed">{description}</p>
                </div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-end sm:ml-4">{children}</div>
        </div>
    );
