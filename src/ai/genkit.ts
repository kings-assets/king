import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// IMPORTANT: The AI is now configured to use a dedicated API key from your .env file.
// This decouples it from the project's default credentials and billing status.
// Please add your new Gemini API key to the .env file.

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GOOGLE_API_KEY }),
  ],
});

/**
 * Gemini 1.5 Pro Latest: The powerhouse for complex reasoning and analysis.
 * Used for the Reviver Agent and other deep analysis tasks.
 */
export const geminiPro = googleAI.model('gemini-1.5-pro-latest');

/**
 * Gemini 1.5 Flash: The speed-optimized model for conversational tasks.
 * Used for the AI Assistant and Smart Booking journey to ensure
 * quick, responsive interactions.
 */
export const geminiFlash = googleAI.model('gemini-1.5-flash-latest');

// Set the new defaults for the entire application.
export const defaultChatModel = geminiFlash; // Use Flash for chat.
export const defaultEvaluationModel = geminiFlash; // Use Flash for evaluation.
