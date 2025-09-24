/**
 * @fileOverview Tool for sending SMS notifications.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { sendSms } from '@/lib/twilio';

const SmsInputSchema = z.object({
  phoneNumber: z.string().describe("The recipient's phone number."),
  message: z.string().describe("The message to send."),
});

export const sendSmsNotification = ai.defineTool(
  {
    name: 'sendSmsNotification',
    description: 'Sends a notification or message to a user via SMS.',
    inputSchema: SmsInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      await sendSms(input.phoneNumber, input.message);
      return `Successfully sent SMS notification to ${input.phoneNumber}.`;
    } catch (error: any) {
      return `Error sending SMS notification: ${error.message}`;
    }
  }
);
