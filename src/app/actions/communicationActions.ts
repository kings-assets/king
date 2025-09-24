
'use server';

import { z } from 'zod';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendSms } from '@/lib/twilio';
import { ContactFormSchema, type ContactFormInput, type ContactFormState } from '@/ai/types';

export async function submitContactForm(
  data: ContactFormInput
): Promise<ContactFormState> {
  const validatedFields = ContactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      success: false,
      errors: validatedFields.error.issues,
    };
  }

  const { name, email, phone, subject, message } = validatedFields.data;

  // Send Telegram notification
  try {
    const telegramMessage = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}
*Subject:* ${subject}

*Message:*
${message}
    `;
    await sendTelegramMessage(telegramMessage);
  } catch (error) {
    console.error("Failed to send Telegram notification for contact form:", error);
  }

  const businessOwnerNumber = process.env.BUSINESS_OWNER_PHONE_NUMBER;
  // Send SMS notifications if phone number is provided
  if (phone) {
    // 1. To Client
    const clientSmsBody = `Hi ${name}, thank you for contacting Revive 2.0 Underground. We've received your message and will get back to you shortly.`;
    await sendSms(phone, clientSmsBody);

    // 2. To Business Owner
    if (businessOwnerNumber) {
      const ownerSmsBody = `New Contact Form: ${name} (${phone}). Subject: ${subject}.`;
      await sendSms(businessOwnerNumber, ownerSmsBody);
    }
  } else if(businessOwnerNumber) {
    // Notify owner even if client number is not provided
    const ownerSmsBody = `New Contact Form (no phone provided): ${name}. Subject: ${subject}.`;
    await sendSms(businessOwnerNumber, ownerSmsBody);
  }

  return {
    message: "Thank you for your message! We will get back to you soon.",
    success: true,
  };
}


// Action to send SMS via Twilio
const SendSmsSchema = z.object({
  to: z.string(),
  body: z.string(),
});
export async function sendSmsAction(input: z.infer<typeof SendSmsSchema>): Promise<{ success: boolean; message: string }> {
  try {
    const validation = SendSmsSchema.safeParse(input);
    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(', ');
      return { success: false, message: `Invalid input for sending SMS: ${issues}` };
    }
    return await sendSms(validation.data.to, validation.data.body);
  } catch (error: any) {
    console.error("[sendSmsAction] A critical server error occurred:", error);
    return { success: false, message: `Server Error: ${error.message || 'An unknown error occurred while sending SMS.'}` };
  }
}

// NOTE: This action is now deprecated in favor of a client-side mailto: link approach
// in the admin dashboard to avoid complex backend setup for the user.
// The code is left here for reference but is no longer called by the UI.
const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
});
export async function sendEmailAction(input: z.infer<typeof SendEmailSchema>): Promise<{ success: boolean; message: string }> {
  try {
    const validation = SendEmailSchema.safeParse(input);
    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(', ');
      return { success: false, message: `Invalid input for sending email: ${issues}` };
    }

    const { to, subject, body } = validation.data;
    
    // This is a placeholder for a real email sending service integration
    console.log(`[Action] Mock Email to ${to} queued.`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    return { success: true, message: `Email to ${to} has been successfully queued.` };

  } catch (error: any) {
    console.error("[sendEmailAction] A critical server error occurred while queuing email:", error);
    return { success: false, message: `Server Error: ${error.message || 'An unknown error occurred while sending email.'}` };
  }
}
