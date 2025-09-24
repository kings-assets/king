
'use server';

/**
 * @fileOverview Provides personalized insights during the smart booking process.
 *
 * - getPersonalizedBookingInsights - A function that generates personalized insights for booking.
 */

import {ai} from '@/ai/genkit';
import {
  PersonalizedBookingInputSchema,
  PersonalizedBookingOutputSchema,
  type PersonalizedBookingInput,
  type PersonalizedBookingOutput,
} from '@/ai/types';


export async function getPersonalizedBookingInsights(
  input: PersonalizedBookingInput
): Promise<PersonalizedBookingOutput> {
  return personalizedBookingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedBookingInsightsPrompt',
  input: {schema: PersonalizedBookingInputSchema},
  output: {schema: PersonalizedBookingOutputSchema},
  prompt: `You are an AI assistant that provides personalized insights for clients booking an R8 therapy session.
Based on the client's input, recommend the most relevant R8 stages.

Health Goals: {{{healthGoals}}}
Specific Pain Points: {{{specificPainPoints}}}
Desired Improvements: {{{desiredImprovements}}}

Provide a concise explanation of why these stages are beneficial for the client.`,
});

const personalizedBookingInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedBookingInsightsFlow',
    inputSchema: PersonalizedBookingInputSchema,
    outputSchema: PersonalizedBookingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
