
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize the Twilio client. If credentials are not set, it will be null.
const client = (accountSid && authToken && fromNumber) ? twilio(accountSid, authToken) : null;

if (!client) {
  console.warn('Twilio credentials are not fully set in the .env file. SMS functionality will be disabled.');
}

/**
 * Sends an SMS message using Twilio.
 * @param to The recipient's phone number. Can be a 10-digit Indian number or a full E.164 format number.
 * @param body The text of the message.
 * @returns An object indicating success status and a message.
 */
export async function sendSms(to: string, body: string): Promise<{ success: boolean; message: string }> {
  if (!client || !fromNumber) {
    const warning = 'Twilio client is not initialized or FROM number is missing. Cannot send SMS.';
    console.warn(warning);
    // Don't throw an error, just return failure so the main flow can continue.
    return { success: false, message: warning };
  }
  
  let formattedTo = to.trim();

  // If the number is 10 digits and does not start with a '+', assume it's an Indian number.
  if (/^\d{10}$/.test(formattedTo)) {
    formattedTo = `+91${formattedTo}`;
    console.log(`[Twilio] Auto-formatted number from ${to} to ${formattedTo}`);
  }

  // Now, validate the potentially formatted number for the E.164 format.
  if (!formattedTo || !/^\+[1-9]\d{1,14}$/.test(formattedTo)) {
      const errorMsg = `Invalid 'to' phone number format provided: "${to}". Must be in E.164 format (e.g., +919876543210).`;
      console.error(errorMsg);
      return { success: false, message: errorMsg };
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to: formattedTo, // Use the formatted number
    });
    const successMsg = `SMS sent successfully to ${formattedTo}. SID: ${message.sid}`;
    console.log(successMsg);
    return { success: true, message: successMsg };
  } catch (error: any) {
    const errorMsg = `Failed to send SMS to ${formattedTo}. Twilio Error: ${error.message}`;
    console.error(errorMsg);
    // Return failure without crashing the application
    return { success: false, message: errorMsg };
  }
}
