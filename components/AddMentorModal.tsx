import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CloseIcon, SparklesIcon, PlusIcon, RefreshIcon } from './icons';
import { PremiumButton, PremiumInput } from './premium/PremiumComponents';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { addCustomMentor } from '../services/feedService';
import { useSettings } from '../src/contexts/SettingsContext';

interface AddMentorModalProps {
    onClose: () => void;
    onSave: (mentorId: string) => void;
}

const AddMentorModal: React.FC<AddMentorModalProps> = ({ onClose, onSave }) => {
    const [mentorName, setMentorName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuotes, setGeneratedQuotes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const { settings, updateSettings } = useSettings();

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setIsVisible(false);
        setTimeout(onClose, 400);
    }, [onClose]);

    const modalRef = useRef<HTMLDivElement>(null);
    useFocusTrap(modalRef, {
        isOpen: isVisible,
        onClose: handleClose,
        closeOnEscape: true,
        closeOnClickOutside: true,
        restoreFocus: true,
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerate = async () => {
        if (!mentorName.trim()) return;

        setIsGenerating(true);
        setError(null);
        setGeneratedQuotes([]);

        try {
            const newMentor = await addCustomMentor(mentorName.trim());
            setGeneratedQuotes(newMentor.quotes);

            // Auto-enable the new mentor
            const newEnabledIds = [...settings.enabledMentorIds, newMentor.id];
            updateSettings({ enabledMentorIds: newEnabledIds });

            onSave(newMentor.id);
            handleClose();
        } catch (err) {
            console.error('Failed to generate mentor:', err);
            setError('לא הצלחתי ליצור תוכן למנטור. נסה שוב.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300
        ${isVisible ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent backdrop-blur-none pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <div
                ref={modalRef}
                className={`relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-[#09090b] border border-white/10 shadow-2xl transition-all duration-300
          ${isVisible && !isClosing
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'}`}
            >
                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--dynamic-accent-start)]/30 to-[var(--dynamic-accent-end)]/20 flex items-center justify-center border border-white/10">
                                <PlusIcon className="w-6 h-6 text-[var(--dynamic-accent-start)]" />
                            </div>
                            <div>
                                <h2 id="add-mentor-title" className="text-2xl font-heading font-bold text-white tracking-tight">
                                    הוסף מנטור
                                </h2>
                                <p className="text-sm text-theme-secondary mt-0.5">ה-AI ייצור ציטוטים בסגנון האישיות</p>
                            </div>
                        </div>
                        <PremiumButton
                            onClick={handleClose}
                            variant="ghost"
                            className="p-2 rounded-full hover:bg-white/10 text-theme-secondary hover:text-white group"
                            aria-label="סגור"
                        >
                            <CloseIcon className="w-6 h-6 transition-transform duration-base ease-spring-soft group-hover:rotate-90" />
                        </PremiumButton>
                    </div>

                    <div className="space-y-6">
                        {/* Mentor Name Input */}
                        <div className="space-y-2">
                            <PremiumInput
                                label="שם המנטור"
                                type="text"
                                value={mentorName}
                                onChange={e => setMentorName(e.target.value)}
                                placeholder="לדוגמה: גאנדי, סטיב ג'ובס, אלון מאסק..."
                                disabled={isGenerating}
                                autoFocus
                            />
                            <p className="text-xs text-theme-muted">
                                הזן שם של אדם אמיתי או דמות מפורסמת
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Generated Quotes Preview */}
                        {generatedQuotes.length > 0 && (
                            <div className="space-y-3 animate-fade-in">
                                <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider">
                                    ציטוטים שנוצרו
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {generatedQuotes.slice(0, 5).map((quote, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-theme-primary"
                                        >
                                            "{quote}"
                                        </div>
                                    ))}
                                    {generatedQuotes.length > 5 && (
                                        <p className="text-xs text-theme-muted text-center">
                                            +{generatedQuotes.length - 5} ציטוטים נוספים
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-4">
                            <PremiumButton
                                onClick={handleGenerate}
                                disabled={!mentorName.trim() || isGenerating}
                                variant="primary"
                                className="w-full shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center justify-center gap-3"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshIcon className="w-5 h-5 animate-spin" />
                                        <span>יוצר ציטוטים...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        <span>צור מנטור עם AI</span>
                                    </>
                                )}
                            </PremiumButton>
                        </div>

                        {/* Example Mentors */}
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-theme-muted mb-3">רעיונות למנטורים:</p>
                            <div className="flex flex-wrap gap-2">
                                {['גאנדי', 'סטיב ג׳ובס', 'נלסון מנדלה', 'אופרה ווינפרי', 'אריסטו'].map(name => (
                                    <button
                                        key={name}
                                        onClick={() => setMentorName(name)}
                                        disabled={isGenerating}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.03] border border-white/[0.08] text-theme-secondary hover:bg-white/[0.06] hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMentorModal;
