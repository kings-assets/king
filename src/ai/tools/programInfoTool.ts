/**
 * @fileOverview A Genkit tool for retrieving information about R8 programs.
 * - getProgramInfo - The tool function to be used by an AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { r8Programs } from '@/lib/r8ProgramsData';

// Define the input schema for the tool
const GetProgramInfoInputSchema = z.object({
  programName: z.string().describe("The name of the R8 program to look for. Should be one of the main program titles like 'R8 Ascent', 'R8 Genesis', etc. It can be a partial match."),
});

// Define the output schema for the tool
const GetProgramInfoOutputSchema = z.object({
  name: z.string(),
  whoIsItFor: z.string(),
  description: z.string(),
  keyBenefits: z.array(z.string()),
}).nullable().describe("The details of the found program, or null if no program matches the name.");


export const getProgramInfo = ai.defineTool(
  {
    name: 'getProgramInfo',
    description: "Retrieves detailed information about a specific RUDRA R8 program by its name. Use this tool whenever a user asks for details about a program, like 'Tell me about R8 Ascent', 'What is R8 Genesis for?', or 'Can you explain the reclaim program?'.",
    inputSchema: GetProgramInfoInputSchema,
    outputSchema: GetProgramInfoOutputSchema,
  },
  async (input) => {
    console.log(`[getProgramInfo Tool] Called with query: ${input.programName}`);
    
    // Find the program by name, case-insensitively and allowing partial matches
    const program = r8Programs.find(p => 
        p.name.toLowerCase().includes(input.programName.toLowerCase())
    );

    if (program) {
        console.log(`[getProgramInfo Tool] Found program: ${program.name}`);
        // Return a subset of the program's data as defined in the output schema
        return {
            name: program.name,
            whoIsItFor: program.whoIsItFor,
            description: program.description,
            keyBenefits: program.keyBenefits,
        };
    }

    console.log(`[getProgramInfo Tool] No program found for: ${input.programName}`);
    return null; // Return null if no program is found
  }
);
