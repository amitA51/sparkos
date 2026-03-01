import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, CheckCircleIcon, EyeIcon, EyeOffIcon } from '../icons';
import { deriveKey, encryptString, decryptToString, generateSalt, ab2b64, b642ab } from '../../services/cryptoService';
import { useHaptics } from '../../hooks/useHaptics';

interface SecureNoteEditorProps {
    isEncrypted: boolean;
    encryptedContent?: {
        iv: string;
        data: string;
        salt: string;
    };
    plainContent?: string;
    onContentDecrypted: (content: string, password: string) => void;
    onContentEncrypted: (encryptedData: { iv: string; data: string; salt: string }, password: string) => void;
    onToggleEncryption: (shouldEncrypt: boolean) => void;
}

const PBKDF2_ITERATIONS = 100000;

/**
 * SecureNoteEditor - Component for handling encrypted notes
 * Allows users to lock/unlock notes with a password
 */
export const SecureNoteEditor: React.FC<SecureNoteEditorProps> = ({
    isEncrypted,
    encryptedContent,
    plainContent,
    onContentDecrypted,
    onContentEncrypted,
    onToggleEncryption,
}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'locked' | 'unlocking' | 'encrypting' | 'unlocked'>(
        isEncrypted && encryptedContent ? 'locked' : 'unlocked'
    );
    const { triggerHaptic, hapticSuccess } = useHaptics();

    const handleUnlock = useCallback(async () => {
        if (!password || !encryptedContent) return;

        setIsLoading(true);
        setError(null);

        try {
            // Derive key from password using stored salt
            const salt = b642ab(encryptedContent.salt);
            const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);

            // Decrypt content
            const decryptedContent = await decryptToString(
                encryptedContent.data,
                encryptedContent.iv,
                key
            );

            hapticSuccess();
            onContentDecrypted(decryptedContent, password);
            setMode('unlocked');
            setPassword('');
        } catch (err) {
            triggerHaptic('heavy');
            setError('סיסמה שגויה');
            console.error('Decryption failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, [password, encryptedContent, onContentDecrypted, hapticSuccess, triggerHaptic]);

    const handleEncrypt = useCallback(async () => {
        if (!password || password !== confirmPassword) {
            setError('הסיסמאות לא תואמות');
            return;
        }

        if (password.length < 4) {
            setError('הסיסמה חייבת להיות לפחות 4 תווים');
            return;
        }

        if (!plainContent) {
            setError('אין תוכן להצפנה');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Generate new salt for this encryption
            const salt = generateSalt(16);
            const key = await deriveKey(password, salt, PBKDF2_ITERATIONS);

            // Encrypt content
            const encrypted = await encryptString(plainContent, key);

            hapticSuccess();
            onContentEncrypted(
                {
                    iv: encrypted.iv,
                    data: encrypted.data,
                    salt: ab2b64(salt),
                },
                password
            );
            setMode('locked');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            triggerHaptic('heavy');
            setError('שגיאה בהצפנה');
            console.error('Encryption failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, [password, confirmPassword, plainContent, onContentEncrypted, hapticSuccess, triggerHaptic]);

    // Locked state - show unlock form
    if (mode === 'locked' || mode === 'unlocking') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cosmos-void/80 to-cosmos-depth/80 backdrop-blur-xl rounded-2xl border border-white/10"
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                    <LockIcon className="w-8 h-8 text-amber-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">פתק מוצפן</h3>
                <p className="text-sm text-theme-secondary mb-6 text-center">
                    הזן את הסיסמה כדי לצפות בתוכן
                </p>

                <div className="w-full max-w-xs space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                            placeholder="סיסמה"
                            className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                            autoFocus
                            dir="ltr"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleUnlock}
                        disabled={isLoading || !password}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                פתח
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        );
    }

    // Encrypting mode - show encryption form
    if (mode === 'encrypting') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cosmos-void/80 to-cosmos-depth/80 backdrop-blur-xl rounded-2xl border border-white/10"
            >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 border border-green-500/30">
                    <LockIcon className="w-8 h-8 text-green-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">הצפן את הפתק</h3>
                <p className="text-sm text-theme-secondary mb-6 text-center">
                    הזן סיסמה להגנה על התוכן
                </p>

                <div className="w-full max-w-xs space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setError(null);
                            }}
                            placeholder="סיסמה חדשה"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            autoFocus
                            dir="ltr"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                setError(null);
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleEncrypt()}
                            placeholder="אשר סיסמה"
                            className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                            dir="ltr"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('unlocked')}
                            className="flex-1 py-3 bg-white/5 text-theme-primary font-medium rounded-xl hover:bg-white/10 transition-all"
                        >
                            ביטול
                        </button>
                        <button
                            onClick={handleEncrypt}
                            disabled={isLoading || !password || !confirmPassword}
                            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LockIcon className="w-5 h-5" />
                                    הצפן
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Unlocked state - show lock button
    return (
        <div className="flex items-center gap-2 mb-4">
            <button
                onClick={() => {
                    if (isEncrypted) {
                        setMode('locked');
                        onToggleEncryption(true);
                    } else {
                        setMode('encrypting');
                    }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-theme-primary hover:text-white rounded-xl border border-white/10 transition-all"
            >
                <LockIcon className="w-4 h-4" />
                <span className="text-sm">{isEncrypted ? 'נעל מחדש' : 'הצפן פתק'}</span>
            </button>

            {isEncrypted && (
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    פתוח
                </span>
            )}
        </div>
    );
};

export default SecureNoteEditor;
