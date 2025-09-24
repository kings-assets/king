/**
 * @fileOverview A Genkit tool for performing web searches using the Tavily API.
 * - tavilySearch - The tool function to be used by an AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TavilySearchInputSchema = z.object({
  query: z.string().describe("The search query for the Tavily API."),
});

// Define a schema for a single search result
const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.string(),
  score: z.number(),
  raw_content: z.string().optional().nullable(),
});

const TavilySearchOutputSchema = z.object({
  answer: z.string().optional().nullable(),
  results: z.array(SearchResultSchema).optional().nullable(),
}).describe("The search results from Tavily, including a potential answer and a list of sources.");


export const tavilySearch = ai.defineTool(
  {
    name: 'tavilySearch',
    description: "Performs a web search using the Tavily API to find information on a given topic. Use this tool for any questions about topics outside of the RUDRA R8 system, its programs, or its philosophy, such as general knowledge, medical information, or current events. The tool provides a concise answer and a list of sources.",
    inputSchema: TavilySearchInputSchema,
    outputSchema: z.string().describe("A summary of the search results, formatted as a string."),
  },
  async (input) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return "Error: Tavily API key is not configured in the .env file.";
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: input.query,
          search_depth: "advanced",
          include_answer: true,
          max_results: 5,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return `Error: Tavily API request failed with status ${response.status}: ${errorText}`;
      }
      
      const data: z.infer<typeof TavilySearchOutputSchema> = await response.json();
      
      // Synthesize the results into a single string for the LLM to process.
      let resultString = "";
      if (data.answer) {
        resultString += `Answer: ${data.answer}\n\n`;
      }
      if (data.results && data.results.length > 0) {
        resultString += "Sources:\n";
        data.results.forEach(result => {
          resultString += `- Title: ${result.title}\n  URL: ${result.url}\n  Content: ${result.content.substring(0, 250)}...\n`;
        });
      }

      if (!resultString) {
        return "No results found for that query.";
      }
      
      return resultString;

    } catch (error: any) {
      console.error("[tavilySearch Tool] Error:", error);
      return `An error occurred during the search: ${error.message}`;
    }
  }
);
