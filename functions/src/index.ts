import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();


export { checkReminders, cleanupOldReminders } from './reminderScheduler';
export { checkHabitReminders, cleanupHabitNotificationFlags } from './habitReminderScheduler';

/**
 * Get current time in Israel timezone formatted as HH:mm
 */
function getCurrentIsraelTime(): string {
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
function isQuietHours(settings: {
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
}): boolean {
    if (!settings.quietHoursEnabled) return false;

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
 * Runs every 1 minute and checks for tasks due soon.
 * Sends push notifications to users with upcoming tasks.
 * Respects user settings: taskRemindersEnabled, taskReminderTime, quiet hours.
 */
export const checkTaskReminders = functions.pubsub
    .schedule('every 1 minutes')
    .onRun(async () => {
        const now = new Date();

        // Get all users
        const usersSnapshot = await db.collection('users').get();

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;

            try {
                // Get user settings
                const settingsDoc = await db.collection('users').doc(userId).collection('data').doc('settings').get();
                const settings = settingsDoc.data() || {};

                // Check if task reminders are enabled
                if (settings.taskRemindersEnabled === false) continue;

                // Check quiet hours
                if (isQuietHours(settings)) continue;

                // Get reminder time from settings (default 15 minutes)
                const reminderMinutes = settings.taskReminderTime || 15;
                const reminderWindow = new Date(now.getTime() + reminderMinutes * 60 * 1000);

                // Get user's FCM tokens
                const tokensSnapshot = await db
                    .collection('users')
                    .doc(userId)
                    .collection('fcm_tokens')
                    .get();

                if (tokensSnapshot.empty) continue;

                const tokens = tokensSnapshot.docs.map(doc => doc.data().token as string);

                // Get user's personal items (tasks)
                const itemsSnapshot = await db
                    .collection('users')
                    .doc(userId)
                    .collection('personalItems')
                    .where('type', '==', 'task')
                    .where('isCompleted', '==', false)
                    .get();

                for (const itemDoc of itemsSnapshot.docs) {
                    const task = itemDoc.data();

                    if (!task.dueDate) continue;

                    // Parse due date and time
                    const [year, month, day] = task.dueDate.split('-').map(Number);
                    const dueDate = new Date(year, month - 1, day);

                    if (task.dueTime) {
                        const [hours, minutes] = task.dueTime.split(':').map(Number);
                        dueDate.setHours(hours, minutes, 0, 0);
                    } else {
                        dueDate.setHours(9, 0, 0, 0); // Default to 9 AM
                    }

                    // Check if task is due within the reminder window
                    if (dueDate > now && dueDate <= reminderWindow) {
                        // Check if we already sent a notification for this task
                        const notifiedKey = `notified_${itemDoc.id}`;
                        const wasNotified = task[notifiedKey];

                        if (!wasNotified) {
                            // Send notification
                            const message: admin.messaging.MulticastMessage = {
                                tokens,
                                notification: {
                                    title: `⏰ תזכורת: ${task.title}`,
                                    body: task.dueTime
                                        ? `המשימה מתוכננת לשעה ${task.dueTime}`
                                        : 'המשימה אמורה להתבצע בקרוב',
                                },
                                data: {
                                    action: 'go_today',
                                    taskId: itemDoc.id,
                                    type: 'task_reminder',
                                },
                                android: {
                                    priority: 'high',
                                    notification: {
                                        sound: 'default',
                                        channelId: 'tasks',
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

                                // Mark as notified
                                await itemDoc.ref.update({ [notifiedKey]: true });

                                console.log(`Sent reminder for task: ${task.title} (${response.successCount} success)`);

                                // Clean up invalid tokens
                                if (response.failureCount > 0) {
                                    const invalidTokens: string[] = [];
                                    response.responses.forEach((resp, idx) => {
                                        if (!resp.success && resp.error?.code === 'messaging/registration-token-not-registered') {
                                            invalidTokens.push(tokens[idx]!);
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
                            } catch (error) {
                                console.error('Error sending notification:', error);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing tasks for user ${userId}:`, error);
            }
        }

        return null;
    });
