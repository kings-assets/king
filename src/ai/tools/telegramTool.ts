/**
 * @fileOverview Tool for sending notifications via Telegram.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { sendTelegramMessage } from '@/lib/telegram';

const TelegramInputSchema = z.object({
  message: z.string().describe("The message to send."),
});

export const sendTelegramNotification = ai.defineTool(
  {
    name: 'sendTelegramNotification',
    description: 'Sends a notification or message to a user via their Telegram account.',
    inputSchema: TelegramInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      await sendTelegramMessage(input.message);
      return `Successfully sent Telegram notification.`;
    } catch (error: any) {
      return `Error sending Telegram notification: ${error.message}`;
    }
  }
);
