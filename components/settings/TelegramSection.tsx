/**
 * TelegramSection - Settings component for linking Telegram account
 * 
 * Allows users to link their Telegram account to receive voice reminders.
 */

import React, { useState, useEffect } from 'react';
import { MessageCircleIcon, LinkIcon, CheckCircleIcon, CopyIcon, RefreshIcon, TrashIcon, BellIcon } from '../icons';
import { SettingsGroupCard, SettingsInfoBanner } from './SettingsComponents';
import { useUser } from '../../src/contexts/UserContext';
import { StatusMessageType } from '../StatusMessage';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { requestFcmToken } from '../../services/notificationsService';

interface TelegramSectionProps {
    setStatusMessage: (msg: { type: StatusMessageType; text: string; id: number } | null) => void;
}

interface TelegramLinkData {
    telegramUserId: number;
    telegramUsername?: string;
    telegramFirstName?: string;
    linkedAt: Date;
}

const TelegramSection: React.FC<TelegramSectionProps> = ({ setStatusMessage }) => {
    const { user } = useUser();
    const [linkCode, setLinkCode] = useState('');
    const [isLinking, setIsLinking] = useState(false);
    const [linkedAccount, setLinkedAccount] = useState<TelegramLinkData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pushEnabled, setPushEnabled] = useState<boolean | null>(null);
    const [isEnablingPush, setIsEnablingPush] = useState(false);

    // Load existing link on mount
    useEffect(() => {
        if (!user?.uid || !db) {
            setIsLoading(false);
            return;
        }

        const loadLink = async () => {
            try {
                // Check if user has a linked Telegram account
                const linksQuery = query(
                    collection(db!, 'telegramLinks'),
                    where('sparkUserId', '==', user.uid)
                );
                const snapshot = await getDocs(linksQuery);

                if (!snapshot.empty && snapshot.docs[0]) {
                    const linkDoc = snapshot.docs[0];
                    const data = linkDoc.data();
                    setLinkedAccount({
                        telegramUserId: parseInt(linkDoc.id, 10),
                        telegramUsername: data.telegramUsername,
                        telegramFirstName: data.telegramFirstName,
                        linkedAt: data.linkedAt?.toDate() || new Date(),
                    });
                }

                // Check push notification status
                if ('Notification' in window) {
                    setPushEnabled(Notification.permission === 'granted');
                }
            } catch (error) {
                console.error('Error loading Telegram link:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLink();
    }, [user?.uid]);

    // Enable push notifications and save FCM token
    const handleEnablePush = async () => {
        if (!user?.uid) return;

        setIsEnablingPush(true);
        try {
            const token = await requestFcmToken(user.uid);
            if (token) {
                setPushEnabled(true);
                setStatusMessage({ type: 'success', text: 'התראות הופעלו בהצלחה! 🔔', id: Date.now() });
            } else {
                setStatusMessage({ type: 'error', text: 'לא הצלחנו להפעיל התראות. ודא שאישרת הודעות בדפדפן.', id: Date.now() });
            }
        } catch (error) {
            console.error('Error enabling push:', error);
            setStatusMessage({ type: 'error', text: 'שגיאה בהפעלת התראות.', id: Date.now() });
        } finally {
            setIsEnablingPush(false);
        }
    };

    const handleLinkCode = async () => {
        if (!user?.uid || !db || !linkCode.trim()) return;

        if (linkCode.length !== 6 || !/^\d+$/.test(linkCode)) {
            setStatusMessage({ type: 'error', text: 'קוד לא תקין. יש להזין 6 ספרות.', id: Date.now() });
            return;
        }

        setIsLinking(true);
        try {
            // Verify the code exists and is not expired
            const codeDoc = await getDoc(doc(db, 'telegramLinkCodes', linkCode));

            if (!codeDoc.exists()) {
                setStatusMessage({ type: 'error', text: 'קוד לא נמצא. אנא בקש קוד חדש מהבוט.', id: Date.now() });
                setIsLinking(false);
                return;
            }

            const codeData = codeDoc.data();
            const expiresAt = codeData.expiresAt?.toDate?.() || new Date(codeData.expiresAt);

            if (expiresAt < new Date()) {
                setStatusMessage({ type: 'error', text: 'הקוד פג תוקף. אנא בקש קוד חדש מהבוט.', id: Date.now() });
                await deleteDoc(doc(db, 'telegramLinkCodes', linkCode));
                setIsLinking(false);
                return;
            }

            // Create the link
            const telegramUserId = String(codeData.telegramUserId);
            await setDoc(doc(db, 'telegramLinks', telegramUserId), {
                sparkUserId: user.uid,
                telegramUsername: codeData.telegramUsername,
                telegramFirstName: codeData.telegramFirstName,
                chatId: codeData.chatId,
                linkedAt: serverTimestamp(),
            });

            // Delete the used code
            await deleteDoc(doc(db, 'telegramLinkCodes', linkCode));

            // Update local state
            setLinkedAccount({
                telegramUserId: codeData.telegramUserId,
                telegramUsername: codeData.telegramUsername,
                telegramFirstName: codeData.telegramFirstName,
                linkedAt: new Date(),
            });
            setLinkCode('');

            setStatusMessage({ type: 'success', text: 'החשבון קושר בהצלחה! 🎉', id: Date.now() });
        } catch (error) {
            console.error('Error linking Telegram:', error);
            setStatusMessage({ type: 'error', text: 'שגיאה בקישור החשבון.', id: Date.now() });
        } finally {
            setIsLinking(false);
        }
    };

    const handleUnlink = async () => {
        if (!linkedAccount || !db) return;

        try {
            await deleteDoc(doc(db, 'telegramLinks', String(linkedAccount.telegramUserId)));
            setLinkedAccount(null);
            setStatusMessage({ type: 'success', text: 'החשבון נותק בהצלחה.', id: Date.now() });
        } catch (error) {
            console.error('Error unlinking Telegram:', error);
            setStatusMessage({ type: 'error', text: 'שגיאה בניתוק החשבון.', id: Date.now() });
        }
    };

    const copyBotLink = () => {
        navigator.clipboard.writeText('https://t.me/SparkReminderBot');
        setStatusMessage({ type: 'success', text: 'הקישור הועתק!', id: Date.now() });
    };

    if (!user?.uid) {
        return (
            <SettingsGroupCard title="טלגרם" icon={<MessageCircleIcon className="w-5 h-5" />}>
                <div className="text-center py-6 text-[var(--text-secondary)]">
                    יש להתחבר כדי לקשר חשבון טלגרם
                </div>
            </SettingsGroupCard>
        );
    }

    return (
        <SettingsGroupCard title="תזכורות קוליות בטלגרם" icon={<MessageCircleIcon className="w-5 h-5" />}>
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <RefreshIcon className="w-6 h-6 animate-spin text-[var(--text-secondary)]" />
                </div>
            ) : linkedAccount ? (
                // Linked state
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">
                                    {linkedAccount.telegramFirstName || 'חשבון מקושר'}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    {linkedAccount.telegramUsername ? `@${linkedAccount.telegramUsername}` : 'טלגרם מקושר'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleUnlink}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                            title="נתק חשבון"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Push Notification Status */}
                    {pushEnabled === false && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <BellIcon className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">התראות כבויות</p>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            אפשר התראות כדי לקבל תזכורות
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleEnablePush}
                                    disabled={isEnablingPush}
                                    className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {isEnablingPush ? (
                                        <RefreshIcon className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <BellIcon className="w-4 h-4" />
                                    )}
                                    הפעל
                                </button>
                            </div>
                        </div>
                    )}

                    {pushEnabled === true && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm text-emerald-400">התראות מופעלות ✓</span>
                            </div>
                        </div>
                    )}

                    <SettingsInfoBanner variant="tip">
                        🎤 שלח הודעה קולית לבוט: "תזכיר לי להתקשר לאמא בעוד 10 דקות"
                    </SettingsInfoBanner>
                </div>
            ) : (
                // Not linked state
                <div className="space-y-4">
                    <p className="text-sm text-[var(--text-secondary)]">
                        קשר את חשבון הטלגרם שלך כדי לשלוח תזכורות קוליות שיגיעו אפילו כשהאפליקציה סגורה.
                    </p>

                    {/* Step 1: Open bot */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--dynamic-accent-start)] text-white text-sm font-bold flex items-center justify-center">1</span>
                            <span className="text-white font-medium">פתח את הבוט בטלגרם</span>
                        </div>
                        <button
                            onClick={copyBotLink}
                            className="w-full py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#0088cc] font-medium hover:bg-[#0088cc]/30 transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircleIcon className="w-5 h-5" />
                            @SparkReminderBot
                            <CopyIcon className="w-4 h-4 opacity-50" />
                        </button>
                    </div>

                    {/* Step 2: Get code */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--dynamic-accent-start)] text-white text-sm font-bold flex items-center justify-center">2</span>
                            <span className="text-white font-medium">שלח /start וקבל קוד</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            הבוט ישלח לך קוד בן 6 ספרות
                        </p>
                    </div>

                    {/* Step 3: Enter code */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[var(--dynamic-accent-start)] text-white text-sm font-bold flex items-center justify-center">3</span>
                            <span className="text-white font-medium">הזן את הקוד כאן</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={linkCode}
                                onChange={(e) => setLinkCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-center text-lg tracking-[0.3em] font-mono placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--dynamic-accent-start)]"
                                maxLength={6}
                            />
                            <button
                                onClick={handleLinkCode}
                                disabled={linkCode.length !== 6 || isLinking}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--dynamic-accent-start)] to-[var(--dynamic-accent-end)] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center gap-2"
                            >
                                {isLinking ? (
                                    <RefreshIcon className="w-5 h-5 animate-spin" />
                                ) : (
                                    <LinkIcon className="w-5 h-5" />
                                )}
                                קשר
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsGroupCard>
    );
};

export default TelegramSection;
