"use strict";
/**
 * Telegram Utility Functions
 *
 * Shared utilities for sending Telegram messages across the functions.
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegramMessage = sendTelegramMessage;
const functions = require("firebase-functions");
const TELEGRAM_BOT_TOKEN = ((_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.bot_token) || process.env.TELEGRAM_BOT_TOKEN;
/**
 * Send a message to a Telegram chat
 */
async function sendTelegramMessage(chatId, text) {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn('TELEGRAM_BOT_TOKEN not configured, skipping Telegram message');
        return;
    }
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
            }),
        });
    }
    catch (error) {
        console.error('Failed to send Telegram message:', error);
    }
}
//# sourceMappingURL=telegram.js.map