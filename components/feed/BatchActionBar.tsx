import React from 'react';
import {
    CloseIcon,
    CheckCheckIcon,
    BookOpenIcon,
    TrashIcon,
} from '../icons';
import { PremiumButton } from '../premium/PremiumComponents';

interface BatchActionBarProps {
    count: number;
    onCancel: () => void;
    onDelete: () => void;
    onMarkRead: () => void;
    onAddToLibrary: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = React.memo(({
    count,
    onCancel,
    onDelete,
    onMarkRead,
    onAddToLibrary
}) => {
    if (count === 0) return null;

    return (
        <div className="fixed bottom-24 right-0 left-0 z-40 px-4 animate-slide-up-in pointer-events-none flex justify-center">
            <div className="w-full max-w-md bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl border border-white/[0.04] rounded-2xl shadow-2xl p-2 flex justify-between items-center pointer-events-auto">
                <div className="flex items-center gap-3 pl-2">
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-full hover:bg-white/[0.06] transition-colors duration-300 group"
                    >
                        <CloseIcon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    </button>
                    <span className="font-bold text-white/90 text-sm tracking-wide">
                        <span className="text-accent-cyan">{count}</span> נבחרו
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <PremiumButton
                        onClick={onMarkRead}
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-accent-cyan"
                        icon={<CheckCheckIcon className="w-5 h-5" />}
                    >
                        {null}
                    </PremiumButton>
                    <PremiumButton
                        onClick={onAddToLibrary}
                        variant="ghost"
                        size="sm"
                        className="text-white/50 hover:text-accent-violet"
                        icon={<BookOpenIcon className="w-5 h-5" />}
                    >
                        {null}
                    </PremiumButton>
                    <div className="w-[1px] h-6 bg-white/[0.06] mx-1" />
                    <PremiumButton
                        onClick={onDelete}
                        variant="ghost"
                        size="sm"
                        className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                        icon={<TrashIcon className="w-5 h-5" />}
                    >
                        {null}
                    </PremiumButton>
                </div>
            </div>
        </div>
    );
});

BatchActionBar.displayName = 'BatchActionBar';
