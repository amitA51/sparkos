"use strict";
/**
 * Telegram Bot Webhook Handler
 *
 * Handles incoming Telegram messages (voice and text):
 * - Voice messages: Transcribes using Gemini, parses reminder, schedules it
 * - /start command: Returns a linking code
 * - /link [code]: Links Telegram to Spark account
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramWebhook = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const genai_1 = require("@google/genai");
const telegram_1 = require("./utils/telegram");
const db = admin.firestore();
// Bot token from environment variable
const TELEGRAM_BOT_TOKEN = ((_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.bot_token) || process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = ((_b = functions.config().gemini) === null || _b === void 0 ? void 0 : _b.api_key) || process.env.GEMINI_API_KEY;
// Initialize Gemini
let ai = null;
if (GEMINI_API_KEY) {
    ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
}
/**
 * Get file path from Telegram
 */
async function getTelegramFilePath(fileId) {
    var _a;
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.ok && ((_a = data.result) === null || _a === void 0 ? void 0 : _a.file_path)) {
        return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
    }
    return null;
}
/**
 * Download file and convert to base64
 */
async function downloadFileAsBase64(url, forceMimeType) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    // Use forced mime type if provided, otherwise fallback
    // Telegram often returns application/octet-stream, but we know it's audio/ogg
    const mimeType = forceMimeType || 'audio/ogg';
    return { data: base64, mimeType };
}
/**
 * Transcribe audio using Gemini
 */
async function transcribeAudio(base64Data, mimeType) {
    if (!ai)
        throw new Error('Gemini API not configured');
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType,
                    },
                },
                {
                    text: 'תמלל את ההודעה הקולית הזו לעברית. החזר רק את הטקסט המתומלל, ללא הסברים נוספים.',
                },
            ],
        },
    });
    return response.text || '';
}
// Israel timezone
const ISRAEL_TIMEZONE = 'Asia/Jerusalem';
/**
 * Format time for display in Israel timezone
 */
function formatIsraelTime(date) {
    return date.toLocaleTimeString('he-IL', {
        timeZone: ISRAEL_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit'
    });
}
/**
 * Parse request (voice or text)
 */
async function parseVoiceRequest(text) {
    if (!ai)
        throw new Error('Gemini API not configured');
    const now = new Date();
    const israelTimeStr = now.toLocaleString('he-IL', { timeZone: ISRAEL_TIMEZONE });
    const todayDate = now.toLocaleDateString('en-CA', { timeZone: ISRAEL_TIMEZONE });
    // Calculate tomorrow's date relative to Israel time
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toLocaleDateString('en-CA', { timeZone: ISRAEL_TIMEZONE });
    const prompt = `אתה העוזר האישי החכם של אפליקציית Spark. תפקידך לנתח בקשות (קוליות או בטקסט) ולקטלג אותן כתזכורות או משימות.

**זמן נוכחי (ישראל):** ${israelTimeStr}
**תאריך היום:** ${todayDate}

נתח את הטקסט וחלץ JSON:

1. **type**: 
   - \`reminder\`: אם יש זמן ספציפי ("תזכיר לי ב-9", "לקחת תרופה מחר בבוקר").
   - \`task\`: אם זו משימה כללית ללא זמן ("ללכת לסופר", "צריך לתקן את הדלת").

2. **action**: מה לעשות (ללא מילות קישור מיותרות).
3. **triggerTime**: (חובה עבור reminder) זמן בפורמט ISO 8601 (שעון ישראל UTC+2/3).
   - "בעוד 10 דקות" -> חשב זמן.
   - "מחר בבוקר" -> 08:00.
   - "בערב" -> 19:00.

4. **priority**: \`high\` (דחוף), \`medium\` (רגיל), \`low\`.
5. **tags**: תגיות מיוחדות (למשל: shopping, work, health).

דוגמאות:
"תזכיר לי לשתות מים עוד 20 דקות" -> { "type": "reminder", "action": "לשתות מים", "triggerTime": "${todayDate}T${formatIsraelTime(new Date(Date.now() + 20 * 60 * 1000)).replace(':', '')}:00+02:00", "priority": "medium", "tags": ["health"], "confidence": 0.98 }
"צריך לקנות חלב ולחם" -> { "type": "task", "action": "לקנות חלב ולחם", "priority": "medium", "tags": ["shopping"], "confidence": 0.95 }
"תזכיר לי לקחת תרופה מחר בבוקר דחוף" -> { "type": "reminder", "action": "לקחת תרופה", "triggerTime": "${tomorrowDate}T08:00:00+02:00", "priority": "high", "tags": ["health"], "confidence": 0.98 }

טקסט: "${text}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        type: { type: genai_1.Type.STRING, enum: ['reminder', 'task'] },
                        action: { type: genai_1.Type.STRING },
                        triggerTime: { type: genai_1.Type.STRING },
                        priority: { type: genai_1.Type.STRING, enum: ['low', 'medium', 'high'] },
                        tags: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                        confidence: { type: genai_1.Type.NUMBER },
                    },
                    required: ['type', 'action', 'confidence'],
                },
            },
        });
        const result = JSON.parse(response.text || '{}');
        return result;
    }
    catch (error) {
        console.error('Error parsing request:', error);
        return null;
    }
}
/**
 * Get Spark user ID from Telegram user ID
 */
async function getSparkUserId(telegramUserId) {
    var _a;
    const linkDoc = await db.collection('telegramLinks').doc(String(telegramUserId)).get();
    if (linkDoc.exists) {
        return ((_a = linkDoc.data()) === null || _a === void 0 ? void 0 : _a.sparkUserId) || null;
    }
    return null;
}
/**
 * Generate a random 6-digit linking code
 */
function generateLinkingCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Handle /start command - generate linking code
 */
async function handleStartCommand(message) {
    var _a, _b, _c;
    const chatId = message.chat.id;
    const telegramUserId = (_a = message.from) === null || _a === void 0 ? void 0 : _a.id;
    if (!telegramUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי לזהות את המשתמש.');
        return;
    }
    // Check if already linked
    const existingLink = await getSparkUserId(telegramUserId);
    if (existingLink) {
        await (0, telegram_1.sendTelegramMessage)(chatId, `✅ החשבון שלך כבר מקושר!
        
שלח הודעה קולית עם תזכורת, לדוגמה:
🎤 "תזכיר לי להתקשר לאבא בעוד 10 דקות"`);
        return;
    }
    // Generate and store linking code
    const code = generateLinkingCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await db.collection('telegramLinkCodes').doc(code).set({
        telegramUserId,
        telegramUsername: ((_b = message.from) === null || _b === void 0 ? void 0 : _b.username) || null,
        telegramFirstName: ((_c = message.from) === null || _c === void 0 ? void 0 : _c.first_name) || null,
        chatId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt,
    });
    await (0, telegram_1.sendTelegramMessage)(chatId, `🔗 <b>קישור חשבון Spark</b>

הקוד שלך: <code>${code}</code>

לחץ על הקוד להעתקה, ואז:
1. פתח את אפליקציית Spark
2. לך להגדרות → טלגרם
3. הדבק את הקוד

⏰ הקוד בתוקף ל-10 דקות.`);
}
/**
 * Process a request (text or transcribed voice) and execute the action
 */
async function processRequest(chatId, text, sparkUserId) {
    const parsed = await parseVoiceRequest(text);
    if (!parsed || parsed.confidence < 0.5) {
        await (0, telegram_1.sendTelegramMessage)(chatId, `📝 הבנתי: "${text}"

❌ לא זיהיתי בקשה לתזכורת או משימה. נסה משהו כמו:
🎤 "תזכיר לי להתקשר לאמא בעוד 15 דקות"
🎤 "תזכיר לי לקחת תרופה מחר בבוקר"`);
        return;
    }
    // Initialize optional triggerAt date
    let triggerAt;
    let dateStr = '';
    let timeStr = '';
    if (parsed.triggerTime) {
        triggerAt = new Date(parsed.triggerTime);
        // Validate date if present
        if (isNaN(triggerAt.getTime())) {
            triggerAt = undefined;
        }
        else {
            dateStr = triggerAt.toLocaleDateString('he-IL', {
                timeZone: ISRAEL_TIMEZONE,
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
            timeStr = formatIsraelTime(triggerAt);
        }
    }
    // Check if time is in the past
    if (triggerAt && triggerAt.getTime() < Date.now() - 60000) { // Allow 1 minute tolerance
        await (0, telegram_1.sendTelegramMessage)(chatId, `📝 הבנתי: "${text}"

❌ הזמן שציינת (${timeStr}) כבר עבר. נסה זמן עתידי.`);
        return;
    }
    // Default to reminder if type is unclear but time is present
    const type = parsed.type === 'task' && !triggerAt ? 'task' : 'reminder';
    if (type === 'reminder') {
        if (!triggerAt) {
            await (0, telegram_1.sendTelegramMessage)(chatId, '❌ עבור תזכורת חובה לציין זמן (למשל: "בעוד 10 דקות" או "מחר ב-9").');
            return;
        }
        const reminderRef = await db.collection('users').doc(sparkUserId).collection('reminders').add({
            text: parsed.action,
            originalMessage: text,
            triggerAt: admin.firestore.Timestamp.fromDate(triggerAt),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            source: 'telegram',
            telegramChatId: chatId,
            status: 'pending',
        });
        console.log(`Reminder scheduled: ${reminderRef.id}`);
        // Calculate time until reminder
        const diffMs = triggerAt.getTime() - Date.now();
        const diffMins = Math.round(diffMs / 60000);
        let timeUntil = '';
        if (diffMins < 60) {
            timeUntil = `בעוד ${diffMins} דקות`;
        }
        else if (diffMins < 1440) {
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            timeUntil = mins > 0 ? `בעוד ${hours} שעות ו-${mins} דקות` : `בעוד ${hours} שעות`;
        }
        else {
            timeUntil = `ב-${dateStr}`;
        }
        await (0, telegram_1.sendTelegramMessage)(chatId, `✅ <b>תזכורת נקבעה!</b>

📝 ${parsed.action}
📅 ${dateStr}
⏰ ${timeStr}
⏱️ ${timeUntil}

אשלח לך התראה בזמן! 🔔`);
    }
    else {
        // Task without specific time
        await db.collection('users').doc(sparkUserId).collection('personalItems').add({
            type: 'task',
            title: parsed.action,
            content: `נוצר מטלגרם: "${text}"`,
            priority: parsed.priority || 'medium',
            isCompleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            source: 'telegram',
            tags: parsed.tags || []
        });
        await (0, telegram_1.sendTelegramMessage)(chatId, `✅ <b>משימה נוצרה!</b>

📋 ${parsed.action}

המשימה נוספה ל-Spark! ✨`);
    }
}
/**
 * Handle voice message - transcribe, parse, and schedule reminder
 */
async function handleVoiceMessage(message) {
    var _a;
    const chatId = message.chat.id;
    const telegramUserId = (_a = message.from) === null || _a === void 0 ? void 0 : _a.id;
    const voice = message.voice;
    if (!telegramUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי לזהות את המשתמש.');
        return;
    }
    // Check if user is linked
    const sparkUserId = await getSparkUserId(telegramUserId);
    if (!sparkUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, `❌ החשבון שלך לא מקושר לאפליקציית Spark.

שלח /start כדי לקבל קוד קישור.`);
        return;
    }
    // Check voice duration (max 60 seconds)
    if (voice.duration > 60) {
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ ההודעה ארוכה מדי. אנא שלח הודעה של עד דקה.');
        return;
    }
    await (0, telegram_1.sendTelegramMessage)(chatId, '🎧 מעבד את ההודעה...');
    try {
        // 1. Download voice file
        const filePath = await getTelegramFilePath(voice.file_id);
        if (!filePath) {
            await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי להוריד את הקובץ.');
            return;
        }
        // Use the mime_type from Telegram message, or default to audio/ogg for voice messages
        const voiceMimeType = voice.mime_type || 'audio/ogg';
        const { data: base64Data } = await downloadFileAsBase64(filePath, voiceMimeType);
        // 2. Transcribe with Gemini
        const transcription = await transcribeAudio(base64Data, voiceMimeType);
        if (!transcription.trim()) {
            await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי לתמלל את ההודעה. נסה שוב.');
            return;
        }
        // 3. Process
        await processRequest(chatId, transcription, sparkUserId);
    }
    catch (error) {
        console.error('Error handling voice message:', error);
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ אירעה שגיאה בעיבוד ההודעה. נסה שוב.');
    }
}
/**
 * Handle text message
 */
async function handleTextMessage(message) {
    var _a;
    const chatId = message.chat.id;
    const telegramUserId = (_a = message.from) === null || _a === void 0 ? void 0 : _a.id;
    const text = message.text;
    if (!telegramUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי לזהות את המשתמש.');
        return;
    }
    // Check if user is linked
    const sparkUserId = await getSparkUserId(telegramUserId);
    if (!sparkUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, `❌ החשבון שלך לא מקושר לאפליקציית Spark.

שלח /start כדי לקבל קוד קישור.`);
        return;
    }
    await (0, telegram_1.sendTelegramMessage)(chatId, '✍️ מעבד את הבקשה...');
    try {
        await processRequest(chatId, text, sparkUserId);
    }
    catch (error) {
        console.error('Error handling text message:', error);
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ אירעה שגיאה בעיבוד ההודעה. נסה שוב.');
    }
}
/**
 * Handle /test command - send immediate test push notification
 */
async function handleTestCommand(message) {
    var _a;
    const chatId = message.chat.id;
    const telegramUserId = (_a = message.from) === null || _a === void 0 ? void 0 : _a.id;
    if (!telegramUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ לא הצלחתי לזהות את המשתמש.');
        return;
    }
    // Check if user is linked
    const sparkUserId = await getSparkUserId(telegramUserId);
    if (!sparkUserId) {
        await (0, telegram_1.sendTelegramMessage)(chatId, `❌ החשבון שלך לא מקושר לאפליקציית Spark.

שלח /start כדי לקבל קוד קישור.`);
        return;
    }
    await (0, telegram_1.sendTelegramMessage)(chatId, '📤 שולח הודעת בדיקה...');
    try {
        // Get user's FCM tokens
        const tokensSnapshot = await db.collection('users').doc(sparkUserId).collection('fcm_tokens').get();
        if (tokensSnapshot.empty) {
            await (0, telegram_1.sendTelegramMessage)(chatId, `❌ לא נמצאו מכשירים רשומים.

ודא שהתראות מופעלות באפליקציה והאפליקציה נפתחה לפחות פעם אחת.`);
            return;
        }
        const tokens = tokensSnapshot.docs.map(doc => doc.id);
        // Send test notification
        const testMessage = {
            tokens,
            notification: {
                title: '🧪 הודעת בדיקה',
                body: 'אם אתה רואה את זה, ההתראות עובדות! 🎉',
            },
            data: {
                action: 'test',
                timestamp: Date.now().toString(),
            },
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'reminders',
                },
            },
            webpush: {
                notification: {
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    requireInteraction: true,
                },
                fcmOptions: {
                    link: '/',
                },
            },
        };
        const result = await admin.messaging().sendEachForMulticast(testMessage);
        const successCount = result.successCount;
        const failureCount = result.failureCount;
        if (successCount > 0) {
            await (0, telegram_1.sendTelegramMessage)(chatId, `✅ הודעת בדיקה נשלחה!

📱 נשלח ל-${successCount} מכשירים בהצלחה
${failureCount > 0 ? `⚠️ ${failureCount} נכשלו` : ''}

בדוק את ההתראות בטלפון! 🔔`);
        }
        else {
            await (0, telegram_1.sendTelegramMessage)(chatId, `❌ כל ההודעות נכשלו.

נסה לפתוח את האפליקציה, לאפשר התראות, ולנסות שוב.`);
        }
        console.log(`Test notification sent to ${sparkUserId}: ${successCount} success, ${failureCount} failed`);
    }
    catch (error) {
        console.error('Error sending test notification:', error);
        await (0, telegram_1.sendTelegramMessage)(chatId, '❌ שגיאה בשליחת הודעת הבדיקה.');
    }
}
/**
 * Main Telegram webhook handler
 */
exports.telegramWebhook = functions.https.onRequest(async (req, res) => {
    var _a, _b, _c;
    // Verify this is a POST request
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    if (!TELEGRAM_BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN not configured');
        res.status(500).send('Bot token not configured');
        return;
    }
    if (!GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY not configured');
        res.status(500).send('Gemini API key not configured');
        return;
    }
    try {
        const update = req.body;
        const message = update.message;
        if (!message) {
            res.status(200).send('OK - No message');
            return;
        }
        // Handle /start command
        if ((_a = message.text) === null || _a === void 0 ? void 0 : _a.startsWith('/start')) {
            await handleStartCommand(message);
        }
        // Handle /test or בדיקה command
        else if (((_b = message.text) === null || _b === void 0 ? void 0 : _b.startsWith('/test')) || ((_c = message.text) === null || _c === void 0 ? void 0 : _c.includes('בדיקה'))) {
            await handleTestCommand(message);
        }
        // Handle voice message
        else if (message.voice) {
            await handleVoiceMessage(message);
        }
        // Handle text message that is NOT a command
        else if (message.text && !message.text.startsWith('/')) {
            await handleTextMessage(message);
        }
        // Fallback for unknown commands
        else {
            await (0, telegram_1.sendTelegramMessage)(message.chat.id, `👋 שלום! אני בוט התזכורות של Spark.

שלח לי הודעה (טקסט או קולית) עם תזכורת:
📝 "תזכיר לי לקחת תרופה מחר בבוקר"
🎤 "תזכיר לי להתקשר לאבא עוד 10 דקות"
                `);
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Error processing Telegram update:', error);
        res.status(500).send('Internal Server Error');
    }
});
//# sourceMappingURL=telegramBot.js.map