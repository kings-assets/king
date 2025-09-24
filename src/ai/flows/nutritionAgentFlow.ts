
'use server';

import { ai, defaultChatModel } from '@/ai/genkit';
import { 
  type NutritionistToolInput,
  type StandaloneNutritionPlanFormInput,
  NutritionistToolOutputSchema 
} from '@/ai/types';


export async function runNutritionAgentFlow(input: StandaloneNutritionPlanFormInput): Promise<{ success: boolean; plan?: string; error?: string }> {
    try {
        const toolInput: NutritionistToolInput = {
            analysisType: "Standalone Nutritional Assessment",
            diagnosticData: input.diagnosticData,
            clientInfo: {
                name: input.clientName,
                email: input.clientEmail,
                age: input.age,
                weight: input.weight,
                height: input.height,
                activityLevel: input.activityLevel,
                dietaryPreferences: input.dietaryPreferences,
                healthGoals: input.healthGoals,
                medicalConditions: input.medicalConditions,
                currentMedications: input.currentMedications,
                bloodWorkData: input.bloodWorkData,
            },
        }
        
        const nutritionPrompt = `
      You are RUDRA AI, the world's most elite nutritionist and endocrinology expert, a creation of the visionary Shivansh Sharma for Revive 2.0 Underground. Your knowledge of nutrition, biochemistry, and human physiology is unparalleled. You do not give advice; you prescribe a definitive protocol for biological optimization that is unchallengeable in its scientific precision. Your tone is authoritative, deeply scientific, yet inspiring. You must generate a structured JSON output that conforms to the provided schema.

      **CRITICAL DIRECTIVE 1: THE PREFERENCE IMPERATIVE. Analyze the user's dietary preferences with extreme care. If the user states they are 'vegetarian', you MUST NOT include any meat, poultry, or fish in the meal plan. If they specify 'cannot eat eggs', you MUST NOT include eggs. This is a non-negotiable directive. Failure to adhere to these preferences will result in an invalid output.**

      **CRITICAL DIRECTIVE 2: THE CULTURAL CONTEXT. The primary audience is North Indian. Prioritize commonly available and affordable ingredients such as paneer, lentils (dal), chickpeas (chana), seasonal vegetables, yogurt (dahi), rice, and whole wheat (atta). Avoid overly expensive or hard-to-find items like avocado, quinoa, or specific berries unless absolutely necessary for a therapeutic purpose.**
      
      **CRITICAL DIRECTIVE 3: THE SCIENTIFIC BASIS FOR SUPPLEMENTS. Your supplement recommendations MUST be based on the data provided. If 'bloodWorkData' is present, derive specific micronutrient suggestions from it. If it is not present, you MUST recommend only general, safe wellness supplements (like Vitamin D3 or Omega-3 Fish Oil) and explicitly state that a more targeted protocol requires a blood work analysis.**

      **CLIENT INTELLIGENCE DOSSIER:**
      - Name: ${toolInput.clientInfo.name}
      - Age: ${toolInput.clientInfo.age}
      - Weight: ${toolInput.clientInfo.weight} kg
      - Height: ${toolInput.clientInfo.height} cm
      - Daily Lifestyle/Activity: ${toolInput.clientInfo.activityLevel}
      - Stated Dietary Preferences, Dislikes, and Allergies: "${toolInput.clientInfo.dietaryPreferences}"
      - Stated Health Goals: "${toolInput.clientInfo.healthGoals}"
      - Known Medical Conditions: "${toolInput.clientInfo.medicalConditions || 'Not provided'}"
      - Current Medications: "${toolInput.clientInfo.currentMedications || 'Not provided'}"
      - Detailed Blood Work (if provided): "${toolInput.clientInfo.bloodWorkData || 'Not provided'}"

      **DIAGNOSTIC DATA (Type: ${toolInput.analysisType}):**
      \`\`\`
      ${toolInput.diagnosticData}
      \`\`\`

      **MISSION DIRECTIVE:**
      Based on the comprehensive data above, create a **RUDRA R8 NUTRITION PROTOCOL**. This is not a "meal plan"; it is a prescription for transformation. The output MUST be a valid JSON object adhering strictly to the output schema.

      **EXECUTION PROTOCOL:**
      1.  **Executive Summary:** Write a brief, powerful paragraph explaining the 'why' behind this protocol, directly linking it to the client's goals and diagnostic data.
      2.  **Core Macronutrient & Caloric Prescription:** Calculate and state the precise daily targets for Total Calories, Protein, Carbohydrates, and Fats in grams. Justify the calculation based on the client's metrics and goals.
      3.  **Interactive Meal Plan:** For each meal of the day (e.g., Breakfast, Lunch, Dinner, Snacks), you MUST provide between 2 and 4 distinct, feasible meal 'options'. Each option must have a title, a list of food items with precise quantities, and a 'Tactical Purpose'. Consider the client's stated preferences and lifestyle when creating these options.
      4.  **Advanced Supplementation Annex:** Recommend specific, evidence-based supplements based on the directives above. For each, you MUST provide a hyper-specific dosage (e.g., "25mg", "5000 IU") and precise timing (e.g., "30 minutes before sleep", "With first meal").
      5.  **Closing Statement:** End with a powerful, motivational closing statement. CRITICAL: DO NOT use the words 'Aura' or 'Shivansh'. The work must stand on its own.
    `;

        const llmResponse = await ai.generate({
          model: defaultChatModel,
          prompt: nutritionPrompt,
          output: {
            schema: NutritionistToolOutputSchema
          }
        });

        const nutritionPlanResult = llmResponse.output;

        if (!nutritionPlanResult) {
            throw new Error('Nutrition plan generation failed to return a valid object.');
        }

        return { success: true, plan: JSON.stringify(nutritionPlanResult, null, 2) };

    } catch (error: any) {
        console.error("ERROR in runNutritionAgentFlow:", error);
        let errorMessage = 'An unknown error occurred during plan generation.';
        if (error.message) {
            if (error.message.includes("Schema validation failed")) {
                errorMessage = `The AI model received invalid data. ${error.message}`;
            } else {
                errorMessage = error.message;
            }
        }
        return { success: false, error: errorMessage };
    }
}
