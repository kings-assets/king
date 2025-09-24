/**
 * @fileOverview Tool for generating personalized corrective exercise plans.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';

const CorrectiveExerciseInputSchema = z.object({
  analysisData: z.string().describe("The full diagnostic report from the analyzeDocument tool."),
  clientGoals: z.string().describe("The specific goals of the client (e.g., pain relief, improved mobility)."),
});

export const generateCorrectiveExercisePlan = ai.defineTool(
  {
    name: 'generateCorrectiveExercisePlan',
    description: 'Generates a detailed, personalized corrective exercise plan based on a diagnostic analysis and client goals. The plan should be comprehensive and easy to follow.',
    inputSchema: CorrectiveExerciseInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const exercisePrompt = `
      You are RUDRA ai, the world's leading expert in physical therapy and corrective exercise, a creation of Shivansh Shamra for Revive 2.0 Underground.
      Based on the following diagnostic analysis and client goals, create a comprehensive, multi-stage corrective exercise plan.

      **Diagnostic Analysis:**
      ${input.analysisData}

      **Client Goals:**
      ${input.clientGoals}

      **Instructions:**
      1.  **Phase 1: Activation & Mobilization:** Gentle exercises to activate dormant muscles and improve joint mobility. Focus on re-establishing the mind-muscle connection.
      2.  **Phase 2: Strengthening & Stabilization:** Compound and isolated exercises to build strength and stabilize the affected areas. Emphasize proper form and control over weight.
      3.  **Phase 3: Integration & Functional Movement:** Exercises that mimic real-world movements to ensure lasting results and translate strength into functional capacity.

      For each exercise, provide the name, sets, reps, tempo, and a detailed description of the proper form and its specific purpose.
    `;

    const llmResponse = await ai.generate({
      model: geminiPro,
      prompt: exercisePrompt,
    });

    return llmResponse.text;
  }
);
