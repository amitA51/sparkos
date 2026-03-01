"use strict";
/**
 * Reminder Scheduler
 *
 * Runs every minute and checks for due reminders.
 * Sends push notifications via FCM when reminders are due.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldReminders = exports.checkReminders = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const telegram_1 = require("./utils/telegram");
const db = admin.firestore();
const messaging = admin.messaging();
/**
 * Scheduled function that runs every minute to check for due reminders.
 * Changed from 5 minutes to 1 minute for quicker reminder response.
 */
exports.checkReminders = functions.pubsub
    .schedule('every 1 minutes')
    .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        // Get due reminders
        const remindersSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('reminders')
            .where('status', '==', 'pending')
            .where('triggerAt', '<=', now)
            .get();
        if (remindersSnapshot.empty)
            continue;
        // Get user's FCM tokens
        const tokensSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('fcm_tokens')
            .get();
        const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
        for (const reminderDoc of remindersSnapshot.docs) {
            const reminder = reminderDoc.data();
            try {
                // Send push notification if user has tokens
                if (tokens.length > 0) {
                    const message = {
                        tokens,
                        notification: {
                            title: '⏰ תזכורת',
                            body: reminder.text,
                        },
                        data: {
                            action: 'reminder',
                            reminderId: reminderDoc.id,
                        },
                        android: {
                            priority: 'high',
                            notification: {
                                sound: 'default',
                                channelId: 'reminders',
                            },
                        },
                        webpush: {
                            headers: {
                                Urgency: 'high',
                            },
                            notification: {
                                icon: '/images/spark192.png',
                                badge: '/images/spark192.png',
                                requireInteraction: true,
                            },
                        },
                    };
                    const response = await messaging.sendEachForMulticast(message);
                    console.log(`Sent reminder notification: ${response.successCount} success, ${response.failureCount} failures`);
                    // Clean up invalid tokens
                    if (response.failureCount > 0) {
                        const invalidTokens = [];
                        response.responses.forEach((resp, idx) => {
                            var _a;
                            if (!resp.success && ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === 'messaging/registration-token-not-registered') {
                                invalidTokens.push(tokens[idx]);
                            }
                        });
                        // Delete invalid tokens
                        for (const token of invalidTokens) {
                            const tokenDocs = await db
                                .collection('users')
                                .doc(userId)
                                .collection('fcm_tokens')
                                .where('token', '==', token)
                                .get();
                            for (const tokenDoc of tokenDocs.docs) {
                                await tokenDoc.ref.delete();
                            }
                        }
                    }
                }
                // Also send to Telegram if this reminder came from there
                if (reminder.source === 'telegram' && reminder.telegramChatId) {
                    await (0, telegram_1.sendTelegramMessage)(reminder.telegramChatId, `🔔 <b>תזכורת!</b>\n\n${reminder.text}`);
                }
                // Mark reminder as sent
                await reminderDoc.ref.update({
                    status: 'sent',
                    sentAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                console.log(`Reminder ${reminderDoc.id} processed for user ${userId}`);
            }
            catch (error) {
                console.error(`Error processing reminder ${reminderDoc.id}:`, error);
                // Mark as failed after 3 attempts
                const attempts = (reminder.attempts || 0) + 1;
                if (attempts >= 3) {
                    await reminderDoc.ref.update({
                        status: 'failed',
                        error: String(error),
                    });
                }
                else {
                    await reminderDoc.ref.update({ attempts });
                }
            }
        }
    }
    return null;
});
/**
 * Cleanup old reminders (runs daily)
 */
exports.cleanupOldReminders = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const cutoff = admin.firestore.Timestamp.fromDate(sevenDaysAgo);
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
        const oldReminders = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('reminders')
            .where('status', 'in', ['sent', 'failed', 'cancelled'])
            .where('triggerAt', '<', cutoff)
            .get();
        const batch = db.batch();
        oldReminders.docs.forEach(doc => batch.delete(doc.ref));
        if (!oldReminders.empty) {
            await batch.commit();
            console.log(`Deleted ${oldReminders.size} old reminders for user ${userDoc.id}`);
        }
    }
    // Also cleanup expired linking codes
    const expiredCodes = await db
        .collection('telegramLinkCodes')
        .where('expiresAt', '<', new Date())
        .get();
    const codesBatch = db.batch();
    expiredCodes.docs.forEach(doc => codesBatch.delete(doc.ref));
    if (!expiredCodes.empty) {
        await codesBatch.commit();
        console.log(`Deleted ${expiredCodes.size} expired linking codes`);
    }
    return null;
});
//# sourceMappingURL=reminderScheduler.js.map