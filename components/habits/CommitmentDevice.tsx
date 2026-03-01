import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkIcon, ChevronDownIcon, UserIcon, StarIcon } from '../icons';

interface CommitmentDeviceProps {
    device?: string;          // e.g., "אם אכשל, אשלם 50 שקל"
    supportPerson?: string;   // e.g., "יוסי"
    onChange: (device?: string, supportPerson?: string) => void;
}

const STAKES_PRESETS = [
    'אשלם 50₪ לצדקה',
    'אעשה כביסה לכל הבית',
    'לא אראה טלוויזיה לשבוע',
    'אזמין את כולם לפיצה',
];

/**
 * Commitment Device - "Make it Unsatisfying" (Add immediate cost)
 * Creates accountability and stakes for bad habits
 */
const CommitmentDevice: React.FC<CommitmentDeviceProps> = ({
    device,
    supportPerson,
    onChange
}) => {
    const [isExpanded, setIsExpanded] = useState(!!device || !!supportPerson);

    const updateDevice = (val: string) => onChange(val, supportPerson);
    const updateSupport = (val: string) => onChange(device, val);

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <LinkIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-right">
                        <h4 className="font-bold text-white tracking-tight">נעלת מחויבות</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-blue-400/80 tracking-wider border border-blue-500/20 px-1.5 py-0.5 rounded">Accountability</span>
                        </div>
                    </div>
                </div>

                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className="w-5 h-5 text-white/40" />
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 space-y-6">

                            {/* Stakes Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <StarIcon className="w-4 h-4 text-white/40" />
                                    <label className="text-sm font-bold text-white">מחיר הכישלון (Stakes)</label>
                                </div>

                                <textarea
                                    dir="rtl"
                                    rows={2}
                                    value={device || ''}
                                    onChange={(e) => updateDevice(e.target.value)}
                                    placeholder="אם אבצע את ההרגל הרע, אני אאלץ..."
                                    className="w-full bg-black/40 text-white p-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/30 text-sm shadow-inner transition-colors resize-none"
                                />

                                <div className="flex flex-wrap gap-2">
                                    {STAKES_PRESETS.map((stake) => (
                                        <button
                                            key={stake}
                                            type="button"
                                            onClick={() => updateDevice(stake)}
                                            className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white/50 transition-colors"
                                        >
                                            {stake}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-white/5 w-full"></div>

                            {/* Accountability Partner */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserIcon className="w-4 h-4 text-white/40" />
                                    <label className="text-sm font-bold text-white">שותף מחויבות</label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        dir="rtl"
                                        value={supportPerson || ''}
                                        onChange={(e) => updateSupport(e.target.value)}
                                        placeholder="שם החבר/ה..."
                                        className="w-full bg-black/40 text-white p-3.5 pl-10 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/30 text-sm shadow-inner transition-colors"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1 bg-white/10 rounded-md">
                                        <UserIcon className="w-3 h-3 text-white/50" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-white/30 text-center">
                                    השותף יקבל עדכון על הצלחות וכישלונות (בעתיד)
                                </p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommitmentDevice;
