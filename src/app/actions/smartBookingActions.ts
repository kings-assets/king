
'use server';

import { getSmartBookingJourneyResponse, logAppointment } from '@/ai/flows/smartBookingJourneyFlow';
import type { 
  SmartBookingJourneyInput, 
  SmartBookingJourneyOutput, 
  LogAppointmentInput, 
  LogAppointmentOutput 
} from '@/ai/types';

export async function smartBookingJourneyAction(
  input: SmartBookingJourneyInput
): Promise<SmartBookingJourneyOutput> {
  try {
    const response = await getSmartBookingJourneyResponse(input);
    return response;
  } catch (error: any) {
    console.error("Error in smart booking journey action:", error.message || error);
    throw new Error("Failed to process your request in the smart booking journey. Please try again.");
  }
}

export async function logAppointmentAction(
  input: LogAppointmentInput
): Promise<LogAppointmentOutput> {
  try {
    const response = await logAppointment(input);
    // Notifications (Telegram, SMS) are now handled inside the logAppointment flow itself
    // to ensure they only send after a successful database write.
    return response;
  } catch (error: any)
   {
    console.error("Error logging appointment:", error.message || error);
    throw new Error("Failed to log your appointment. Please contact support if this persists.");
  }
}
