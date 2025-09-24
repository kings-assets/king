
'use server';

import { z } from 'zod';
import { runNutritionAgentFlow } from '@/ai/flows/nutritionAgentFlow';
import type { StandaloneNutritionPlanFormInput } from '@/ai/types';

// This server action is now a simple, clean wrapper. It calls the dedicated
// Genkit flow to perform the complex AI generation logic. This keeps the action file
// lightweight and prevents dependency issues.
export async function generateStandaloneNutritionPlanAction(input: StandaloneNutritionPlanFormInput): Promise<{ success: boolean; plan?: string; error?: string }> {
    try {
        // The flow will handle the logic and error reporting.
        return await runNutritionAgentFlow(input);
    } catch (error: any) {
        console.error("CRITICAL ERROR in generateStandaloneNutritionPlanAction:", error);
        return { success: false, error: "A critical error occurred while invoking the nutrition agent." };
    }
}
