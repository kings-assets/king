
'use server';

import { z } from 'zod';
import { runReviverAgentFlow } from '@/ai/flows/reviverAgentFlow';
import { AgentActionInputSchema, type AgentActionInput } from '@/ai/types';

// The server action is now a thin wrapper. Its only job is to validate the input
// and then call the dedicated Genkit flow, which contains all the complex logic.
// This prevents the complex Genkit/Firebase dependencies from leaking into the client bundle.
export async function analyzeAndSaveReportAction(input: AgentActionInput): Promise<{ success: boolean; analysis?: string; error?: string }> {
  // We can still perform Zod validation at the boundary for security.
  try {
    const validatedInput = AgentActionInputSchema.parse(input);
    // Delegate the entire complex operation to the flow.
    return await runReviverAgentFlow(validatedInput);
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred during analysis.';
     if (error instanceof z.ZodError) {
        errorMessage = error.errors.map(e => e.message).join(' ');
        return { success: false, error: errorMessage };
    }
    // The flow handles its own detailed error logging/reporting,
    // so we just return a generic failure message here if the call itself fails.
    console.error("CRITICAL ERROR in analyzeAndSaveReportAction:", error);
    return { success: false, error: "A critical error occurred while invoking the AI agent." };
  }
}
