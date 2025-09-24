
'use server';

import { getPersonalizedBookingInsights } from '@/ai/flows/personalized-booking-insights';
import { getMarketingAssistantResponse } from '@/ai/flows/marketingAssistantFlow';
import { generateFollowUpMessage } from '@/ai/flows/followUpAssistantFlow';
import { sendTelegramMessage } from '@/lib/telegram';
import type { 
  PersonalizedBookingInput, 
  PersonalizedBookingOutput, 
  MarketingAssistantInput,
  MarketingAssistantOutput,
  FollowUpInput,
  FollowUpOutput,
} from '@/ai/types';

export async function getPersonalizedBookingInsightsAction(
  data: PersonalizedBookingInput
): Promise<{ insights: PersonalizedBookingOutput | null; error?: string }> {
  try {
    const insights = await getPersonalizedBookingInsights(data);
    
    try {
      const telegramMessage = `
*New Personalized Quick Insight Request*

*Health Goals:*
${data.healthGoals}

*Specific Pain Points:*
${data.specificPainPoints}

*Desired Improvements:*
${data.desiredImprovements}

*AI Generated Insights:*
${insights.insights}
      `;
      await sendTelegramMessage(telegramMessage);
    } catch (error: any) {
      console.error("[Action] Failed to send Telegram notification for booking insights:", error.message || error);
    }
    
    return { insights };
  } catch (error: any) {
    console.error("[Action] Error in getPersonalizedBookingInsightsAction:", error.message);
    let userErrorMessage = "Failed to generate insights. Please try again later.";
    if (error.message && error.message.includes("API key not valid")) {
        userErrorMessage = "Failed to generate insights due to an API configuration issue. Please contact support.";
    } else if (error.message && error.message.includes("Deadline exceeded")) {
        userErrorMessage = "The request timed out while trying to get insights. Please try again.";
    } else if (error.message) {
      userErrorMessage = error.message;
    }
    
    return { insights: null, error: userErrorMessage };
  }
}

export async function marketingAssistantAction(
  input: MarketingAssistantInput
): Promise<MarketingAssistantOutput> {
  try {
    const response = await getMarketingAssistantResponse(input);

    try {
      const telegramMessage = `
*New Marketing Oracle Interaction*

*User Query:*
${input.query}

*AI Response:*
${response.answer}
      `;
      await sendTelegramMessage(telegramMessage);
    } catch (error: any)      {
      console.error("Failed to send Telegram notification for marketing assistant:", error.message || error);
    }
    
    return response;
  } catch (error: any) {
    console.error("Error in marketing assistant action:", error.message || error);
    throw new Error("Failed to get response from marketing assistant. Please try again.");
  }
}

export async function generateFollowUpMessageAction(
  input: FollowUpInput
): Promise<FollowUpOutput> {
  try {
    const response = await generateFollowUpMessage(input);
    return response;
  } catch (error: any) {
    console.error("Error in generate follow-up message action:", error.message || error);
    throw new Error("Failed to generate follow-up message. Please try again.");
  }
}
