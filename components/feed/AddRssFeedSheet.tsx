import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RssFeedCategory } from '../../types';
import { RSS_CATEGORIES } from '../../constants';
import { PremiumButton } from '../premium/PremiumComponents';
import { CloseIcon, AddIcon, RefreshIcon } from '../icons';

interface AddRssFeedSheetProps {
    onClose: () => void;
    onAdd: (url: string, category: RssFeedCategory) => Promise<void>;
    isLoading?: boolean;
}

/**
 * Bottom sheet component for adding new RSS feeds.
 * Features:
 * - Safe area padding for devices with gesture bars
 * - Premium styling with glass morphism
 * - Form validation
 */
export const AddRssFeedSheet: React.FC<AddRssFeedSheetProps> = ({
    onClose,
    onAdd,
    isLoading = false,
}) => {
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState<RssFeedCategory>('general');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!url) {
            setError('נא להזין כתובת URL');
            return;
        }
        if (!url.startsWith('http')) {
            setError('נא להזין כתובת URL תקינה');
            return;
        }
        setError(null);

        try {
            await onAdd(url, category);
        } catch (err) {
            // Error handling is done in parent component
        }
    };

    return (
        <div
            className="w-full bg-[var(--bg-secondary)] rounded-t-3xl border-t border-white/[0.08] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-white/[0.06]">
                <h2 className="text-lg font-bold text-white">הוסף פיד RSS</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors"
                    aria-label="סגור"
                >
                    <CloseIcon className="w-5 h-5 text-white/60" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
                {/* URL Input */}
                <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                        כתובת URL של הפיד
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="https://example.com/feed.xml"
                        className={`w-full bg-white/[0.04] border rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none transition-colors ${error
                            ? 'border-red-500/50 focus:border-red-500'
                            : 'border-white/[0.08] focus:border-[var(--dynamic-accent-start)]'
                            }`}
                        dir="ltr"
                        autoFocus
                        autoComplete="url"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading) {
                                handleSubmit();
                            }
                        }}
                    />
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                {/* Category Select */}
                <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                        קטגוריה
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as RssFeedCategory)}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--dynamic-accent-start)] transition-colors appearance-none cursor-pointer"
                    >
                        {Object.entries(RSS_CATEGORIES).map(([key, label]) => (
                            <option key={key} value={key} className="bg-[var(--bg-secondary)] text-white">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <div style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}>
                    <PremiumButton
                        onClick={handleSubmit}
                        disabled={!url || isLoading}
                        className="w-full"
                        size="lg"
                        icon={
                            isLoading
                                ? <RefreshIcon className="w-5 h-5 animate-spin" />
                                : <AddIcon className="w-5 h-5" />
                        }
                    >
                        {isLoading ? 'מוסיף...' : 'הוסף פיד'}
                    </PremiumButton>
                </div>
            </div>
        </div>
    );
};

export default AddRssFeedSheet;
