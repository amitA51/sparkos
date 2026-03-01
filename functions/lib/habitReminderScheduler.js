"use strict";
/**
 * Habit Reminder Scheduler
 *
 * Runs every minute and checks for habits with reminders enabled.
 * Sends push notifications via FCM when it's time for a habit reminder.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupHabitNotificationFlags = exports.checkHabitReminders = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const messaging = admin.messaging();
/**
 * Get current time in Israel timezone formatted as HH:mm
 */
function getCurrentIsraelTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jerusalem',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
/**
 * Check if current time is within quiet hours
 */
function isQuietHours(settings) {
    if (!settings.quietHoursEnabled)
        return false;
    const now = getCurrentIsraelTime();
    const start = settings.quietHoursStart || '22:00';
    const end = settings.quietHoursEnd || '08:00';
    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (start > end) {
        return now >= start || now < end;
    }
    return now >= start && now < end;
}
/**
 * Scheduled function that runs every minute to check for habit reminders.
 */
exports.checkHabitReminders = functions.pubsub
    .schedule('every 1 minutes')
    .onRun(async () => {
    var _a;
    const currentTime = getCurrentIsraelTime();
    console.log(`Checking habit reminders at ${currentTime}`);
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        try {
            // Get user settings
            const settingsDoc = await db.collection('users').doc(userId).collection('data').doc('settings').get();
            const settings = settingsDoc.data() || {};
            // Check if habit reminders are enabled globally (supports new and legacy structure)
            const notificationsSettings = settings.notificationsSettings || {};
            const isEnabled = (_a = notificationsSettings.habitRemindersEnabled) !== null && _a !== void 0 ? _a : settings.enableHabitReminders;
            if (isEnabled === false)
                continue; // Explicitly checked for false/undefined
            // Helper to check quiet hours with new structure support
            const checkQuietHours = (s) => {
                var _a, _b, _c, _d, _e;
                const ns = s.notificationsSettings || {};
                const enabled = (_a = ns.quietHoursEnabled) !== null && _a !== void 0 ? _a : s.quietHoursEnabled;
                if (!enabled)
                    return false;
                const start = (_c = (_b = ns.quietHoursStart) !== null && _b !== void 0 ? _b : s.quietHoursStart) !== null && _c !== void 0 ? _c : '22:00';
                const end = (_e = (_d = ns.quietHoursEnd) !== null && _d !== void 0 ? _d : s.quietHoursEnd) !== null && _e !== void 0 ? _e : '08:00';
                return isQuietHours({
                    quietHoursEnabled: true,
                    quietHoursStart: start,
                    quietHoursEnd: end
                });
            };
            // Check quiet hours
            if (checkQuietHours(settings))
                continue;
            // Get user's FCM tokens
            const tokensSnapshot = await db
                .collection('users')
                .doc(userId)
                .collection('fcm_tokens')
                .get();
            if (tokensSnapshot.empty)
                continue;
            const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
            // Get user's habits with reminders enabled
            const habitsSnapshot = await db
                .collection('users')
                .doc(userId)
                .collection('personalItems')
                .where('type', '==', 'habit')
                .where('reminderEnabled', '==', true)
                .get();
            for (const habitDoc of habitsSnapshot.docs) {
                const habit = habitDoc.data();
                // Check if reminder time matches current time (exact match)
                if (habit.reminderTime !== currentTime)
                    continue;
                // Check if already notified today
                const today = new Date().toISOString().split('T')[0];
                const notifiedKey = `notified_habit_${today}`;
                if (habit[notifiedKey])
                    continue;
                // Send notification
                const message = {
                    tokens,
                    notification: {
                        title: habit.habitType === 'bad'
                            ? `🛡️ הישאר חזק: ${habit.title}`
                            : `💪 זמן להרגל: ${habit.title}`,
                        body: habit.habitType === 'bad'
                            ? 'זכור את המטרה שלך להימנע מהרגל זה!'
                            : 'הגיע הזמן לבצע את ההרגל היומי שלך!',
                    },
                    data: {
                        action: 'go_today',
                        habitId: habitDoc.id,
                        type: 'habit_reminder',
                    },
                    android: {
                        priority: 'high',
                        notification: {
                            sound: 'default',
                            channelId: 'habits',
                        },
                    },
                    webpush: {
                        headers: {
                            Urgency: 'high',
                        },
                        notification: {
                            icon: '/images/spark192.png',
                            badge: '/images/spark192.png',
                        },
                    },
                };
                try {
                    const response = await messaging.sendEachForMulticast(message);
                    console.log(`Sent habit reminder "${habit.title}" for user ${userId}: ${response.successCount} success`);
                    // Mark as notified today
                    await habitDoc.ref.update({ [notifiedKey]: true });
                    // Clean up invalid tokens
                    if (response.failureCount > 0) {
                        const invalidTokens = [];
                        response.responses.forEach((resp, idx) => {
                            var _a;
                            if (!resp.success && ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === 'messaging/registration-token-not-registered') {
                                invalidTokens.push(tokens[idx]);
                            }
                        });
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
                catch (error) {
                    console.error(`Error sending habit reminder for ${habit.title}:`, error);
                }
            }
        }
        catch (error) {
            console.error(`Error processing habits for user ${userId}:`, error);
        }
    }
    return null;
});
/**
 * Cleanup old habit notification flags (runs daily)
 */
exports.cleanupHabitNotificationFlags = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
        try {
            const habitsSnapshot = await db
                .collection('users')
                .doc(userDoc.id)
                .collection('personalItems')
                .where('type', '==', 'habit')
                .get();
            for (const habitDoc of habitsSnapshot.docs) {
                const habit = habitDoc.data();
                const updates = {};
                // Find and delete old notification flags
                Object.keys(habit).forEach(key => {
                    if (key.startsWith('notified_habit_')) {
                        const dateStr = key.replace('notified_habit_', '');
                        const flagDate = new Date(dateStr);
                        if (flagDate < sevenDaysAgo) {
                            updates[key] = admin.firestore.FieldValue.delete();
                        }
                    }
                });
                if (Object.keys(updates).length > 0) {
                    await habitDoc.ref.update(updates);
                }
            }
        }
        catch (error) {
            console.error(`Error cleaning up habit flags for user ${userDoc.id}:`, error);
        }
    }
    return null;
});
//# sourceMappingURL=habitReminderScheduler.js.map