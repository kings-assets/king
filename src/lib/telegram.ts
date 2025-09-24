
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Sends a message to a specified Telegram chat.
 * @param message The text message to send. Supports Markdown.
 */
export async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot token or chat ID is not configured. Skipping notification.');
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });
    console.log('[Telegram] Notification sent successfully.');
  } catch (error: any) {
    console.error('[Telegram] Failed to send notification:', error.response?.data || error.message);
    // Do not re-throw the error, as failing to send a notification should not break the main flow.
  }
}
