/**
 * @fileOverview Tools for interacting with the Firestore database.
 * This serves as the permanent memory for RUDRA ai.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestoreAdmin, getFirebaseAdminApp } from '@/lib/firebaseAdmin';


const GetClientInputSchema = z.object({
  email: z.string().email().describe("The client's email address."),
});

export const getClientByEmail = ai.defineTool(
  {
    name: 'getClientByEmail',
    description: "Retrieves a client's full history and data from the database using their email address.",
    inputSchema: GetClientInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const db = await getFirestoreAdmin();
      const clientRef = db.collection('clients').doc(input.email);
      const doc = await clientRef.get();
      if (!doc.exists) {
        return `No record found for client with email: ${input.email}. A new record will be created.`;
      }
      return JSON.stringify(doc.data());
    } catch (error: any) {
      return `Error retrieving client data: ${error.message}`;
    }
  }
);

const SaveNoteInputSchema = z.object({
  email: z.string().email().describe("The client's email address."),
  name: z.string().describe("The client's full name."),
  analysisResult: z.string().describe("The full analysis result string to save to the client's record."),
});

export const saveNoteToClientRecord = ai.defineTool(
  {
    name: 'saveNoteToClientRecord',
    description: "Saves a structured analysis report to a client's permanent record in the database.",
    inputSchema: SaveNoteInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const db = await getFirestoreAdmin(); 
      const admin = await getFirebaseAdminApp(); 
      const clientRef = db.collection('clients').doc(input.email);
      
      const newNote = {
        timestamp: new Date().toISOString(),
        clientName: input.name,
        analysis: input.analysisResult,
      };

      await clientRef.set({
        notes: admin.firestore.FieldValue.arrayUnion(newNote),
      }, { merge: true });

      return `Analysis report successfully saved for client: ${input.email}.`;
    } catch (error: any) {
      return `Error saving analysis report for client: ${error.message}`;
    }
  }
);
