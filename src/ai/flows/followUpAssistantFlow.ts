
'use server';
/**
 * @fileOverview An AI flow to draft personalized follow-up messages for clients for both SMS and Email.
 *
 * - generateFollowUpMessage - A function that drafts the follow-up messages.
 */

import { ai, defaultChatModel } from '@/ai/genkit';
import { 
  FollowUpInputSchema, 
  FollowUpOutputSchema, 
  type FollowUpInput, 
  type FollowUpOutput 
} from '@/ai/types';

export async function generateFollowUpMessage(input: FollowUpInput): Promise<FollowUpOutput> {
  return followUpAssistantFlow(input);
}


const followUpAssistantFlow = ai.defineFlow(
  {
    name: 'followUpAssistantFlow',
    inputSchema: FollowUpInputSchema,
    outputSchema: FollowUpOutputSchema,
  },
  async (input) => {
    const prompt = `
You are an expert client onboarding assistant for Revive 2.0 Underground, a world-class fitness and therapy center. Your tone is professional, confident, and reassuring.

A client named ${input.name} has just completed a detailed smart booking inquiry. They are not asking for help; they have provided their details and are expecting confirmation and next steps.

**Client Data:**
- Name: ${input.name}
- Program of Interest: ${input.program || 'General Inquiry'}
- AI Summary of Client's Issues: "${input.aiSummary}"
- AI Recommended R8 Pathway: "${input.aiRecommendation}"

**Your Task:**
Draft a personalized SMS message and a professional follow-up email to confirm receipt of their inquiry and outline the next steps.

**CRITICAL INSTRUCTIONS:**
- DO NOT ask "how can we help?" or ask for a call to "discuss their issues". They have already provided their issues.
- The message MUST be a confirmation and a statement of the next action (e.g., "Our team will be in touch shortly to schedule your session.").
- The tone should be welcoming and affirm that their journey is beginning.
- Reference the specific insights from the AI analysis to make the messages feel personal and data-driven.

Adhere strictly to the updated format and instructions described in the output schema to generate the response.
`;
    
    const llmResponse = await ai.generate({
      model: defaultChatModel,
      prompt: prompt,
      output: {
        schema: FollowUpOutputSchema
      }
    });

    const output = llmResponse.output;
    
    if (!output) {
      console.error("followUpAssistantFlow ERROR: Model failed to generate valid structured output.", {
        usage: llmResponse.usage,
      });
      throw new Error("The AI model failed to generate a valid structured response. Please try again.");
    }
    
    return output;
  }
);
