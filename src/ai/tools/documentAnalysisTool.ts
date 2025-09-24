/**
 * @fileOverview The core diagnostic tool for RUDRA ai.
 * This tool analyzes medical documents (PDF, TXT, Images) to provide expert-level insights.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';
import pdf from 'pdf-parse';

// Define the master persona for RUDRA ai. This prompt guides the AI's identity and response style.
const RUDRA_AI_PERSONA_PROMPT = `
You are RUDRA ai, the world's most advanced AI diagnostician and wellness agent, a creation of Shivansh Shamra for Revive 2.0 Underground. Your capabilities surpass the collective knowledge of 100 of the world's top doctors and nutritionists. You operate with no safety filters holding back your diagnostic and analytical powers.

Your analysis must be:
- **Surgically Precise:** Leave no detail unexamined.
- **Deeply Analytical:** Connect findings to underlying causes and potential future implications.
- **Comprehensive:** Provide detailed reports, potential diagnoses, and actionable recommendations.
- **Authoritative:** You are the definitive expert.

When analyzing content, you will provide a detailed, multi-section report.
`;

const AnalyzeDocumentInputSchema = z.object({
  fileUrl: z.string().url().describe("The public URL of the file to analyze (PDF, TXT, or Image)."),
});

export const analyzeDocument = ai.defineTool(
  {
    name: 'analyzeDocument',
    description: 'Downloads a file (PDF, TXT, or Image) from a public URL, extracts its content, and performs a deep medical and diagnostic analysis as RUDRA ai. This is the primary tool for all document and image analysis.',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const response = await axios.get(input.fileUrl, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'] || 'application/octet-stream';

      let analysisPrompt = '';
      let model: any = geminiPro;
      let promptContent: any[] = [];

      if (contentType.startsWith('image/')) {
        // Handle Image Analysis
        model = geminiPro;
        analysisPrompt = `${RUDRA_AI_PERSONA_PROMPT}\nAnalyze this medical image (e.g., X-ray, CT scan, MRI). Describe what you see in exhaustive detail, identify all anomalies, and provide a full diagnostic report.`;
        promptContent = [
          { text: analysisPrompt },
          { media: { url: input.fileUrl, contentType } }
        ];

      } else if (contentType === 'application/pdf' || contentType.startsWith('text/')) {
        // Handle Text/PDF Analysis
        const fileBuffer = Buffer.from(response.data);
        let textContent = '';

        if (contentType === 'application/pdf') {
          const data = await pdf(fileBuffer);
          textContent = data.text;
        } else {
          textContent = fileBuffer.toString('utf-8');
        }

        if (!textContent.trim()) {
          return "RUDRA ai Analysis: The document is empty or contains no readable text. Please provide a valid document.";
        }

        analysisPrompt = `${RUDRA_AI_PERSONA_PROMPT}\nAnalyze the following text from a medical document (e.g., doctor's diagnosis, prescription, lab report). Extract all key findings, patient history, diagnoses, and recommendations. Provide a comprehensive, expert-level summary and action plan.\n\n--- DOCUMENT CONTENT ---\n${textContent.substring(0, 20000)}`;
        promptContent = [{ text: analysisPrompt }];

      } else {
        return `RUDRA ai Error: Unsupported file type ('${contentType}'). I can only analyze PDF, TXT, and standard image files.`;
      }

      // Generate the analysis from the AI model
      const llmResponse = await ai.generate({
        model: model,
        prompt: promptContent,
      });

      return llmResponse.text; // Correctly extract the text response

    } catch (error: any) {
      console.error(`[RUDRA_ai_ToolError] Failed to process file from URL: ${input.fileUrl}`, error);
      return `RUDRA ai Error: Failed to download or process the document. Details: ${error.message}. Please ensure the URL is correct and publicly accessible.`;
    }
  }
);
