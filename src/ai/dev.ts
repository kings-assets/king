
import { config } from 'dotenv';
config();

// Import all top-level flows for the Genkit developer UI.
// This simplified dependency graph resolves server startup issues.
// NOTE: Next.js Server Actions that use Genkit are NOT imported here.
// This file is the entry point for the Genkit server, not the Next.js server.
import '@/ai/flows/personalized-booking-insights.ts';
import '@/ai/flows/smartBookingJourneyFlow.ts';
import '@/ai/flows/marketingAssistantFlow.ts';
import '@/ai/flows/blogAssistantFlow.ts';
import '@/ai/flows/followUpAssistantFlow.ts';


// The agent's tools are implicitly loaded via the flows that use them.
// The main agent logic is within analyzeAndSaveReportAction and its associated tools,
// which are standard Next.js Server Actions and not registered as Genkit flows.
