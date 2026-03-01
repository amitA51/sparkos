/**
 * Telegram Utility Functions
 * 
 * Shared utilities for sending Telegram messages across the functions.
 */

import * as functions from 'firebase-functions';

const TELEGRAM_BOT_TOKEN = functions.config().telegram?.bot_token || process.env.TELEGRAM_BOT_TOKEN;

/**
 * Send a message to a Telegram chat
 */
export async function sendTelegramMessage(chatId: number, text: string): Promise<void> {
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
    } catch (error) {
        console.error('Failed to send Telegram message:', error);
    }
}
