
'use server';
/**
 * @fileOverview AI flows for assisting with blog content creation.
 * - generateBlogImage - Creates a cover image based on a title.
 * - generateBlogAudio - Converts blog text content to speech.
 * - generateBlogPost - Creates a full blog post (text and image) from a topic.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';
import { 
  BlogImageInputSchema, 
  BlogImageOutputSchema,
  BlogAudioInputSchema,
  BlogAudioOutputSchema,
  BlogPostInputSchema,
  BlogPostOutputSchema,
  BlogContentBlockSchema,
  type BlogImageInput,
  type BlogImageOutput,
  type BlogAudioInput,
  type BlogAudioOutput,
  type BlogPostInput,
  type BlogPostOutput,
} from '@/ai/types';


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Flow 1: Image Generation
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export async function generateBlogImage(input: BlogImageInput): Promise<BlogImageOutput> {
  return generateBlogImageFlow(input);
}

const generateBlogImageFlow = ai.defineFlow(
  {
    name: 'generateBlogImageFlow',
    inputSchema: BlogImageInputSchema,
    outputSchema: BlogImageOutputSchema,
  },
  async (input) => {
    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A breathtaking, ultra-high-resolution photorealistic masterpiece, with cinematic lighting, for a blog post titled "${input.title}". The visual theme must be a fusion of advanced bio-technology and serene, natural elements. Imagine glowing neural pathways integrated with the veins of a leaf, or a human silhouette made of shimmering energy meditating in a futuristic forest. Key colors: deep sapphire blue, vibrant cyan, a touch of magenta, and emerald green. The style should feel epic, hopeful, and profoundly intelligent.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (!response.media?.url) {
        throw new Error('Image generation failed to produce an image or a valid URL.');
      }

      const media = response.media;
      const revisedPrompt = response.text;

      return {
        imageUrl: media.url,
        revisedPrompt: revisedPrompt || "No revised prompt provided.",
      };
    } catch (error: any) {
      console.error("CRITICAL ERROR in generateBlogImageFlow:", error);
      let errorMessage = 'An unknown error occurred during image generation.';
      if (error.message) {
        errorMessage = `Image generation failed: ${error.message}`;
      }
      throw new Error(errorMessage);
    }
  }
);


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Flow 2: Text-to-Speech (TTS)
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export async function generateBlogAudio(input: BlogAudioInput): Promise<BlogAudioOutput> {
    return generateBlogAudioFlow(input);
}

// Helper to convert raw PCM audio data from Gemini into a standard WAV format.
async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      const bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const generateBlogAudioFlow = ai.defineFlow(
    {
      name: 'generateBlogAudioFlow',
      inputSchema: BlogAudioInputSchema,
      outputSchema: BlogAudioOutputSchema,
    },
    async (input) => {
      try {
        const { media } = await ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Alloy' }, // A pleasant, clear voice
              },
            },
          },
          prompt: input.text,
        });
  
        if (!media?.url) {
          throw new Error('Text-to-speech generation failed to return audio media.');
        }
        
        const audioBuffer = Buffer.from(
          media.url.substring(media.url.indexOf(',') + 1),
          'base64'
        );
        
        const wavBase64 = await toWav(audioBuffer);

        return {
          audioUrl: 'data:audio/wav;base64,' + wavBase64,
        };
      } catch (error: any) {
        console.error("CRITICAL ERROR in generateBlogAudioFlow:", error);
        throw new Error(`Failed to generate audio: ${error.message}`);
      }
    }
);


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Flow 3: Complete Blog Post Generation (The "Blog Factory")
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

export async function generateBlogPost(input: BlogPostInput): Promise<BlogPostOutput> {
  return generateBlogPostFlow(input);
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: BlogPostInputSchema,
    outputSchema: BlogPostOutputSchema,
  },
  async (input) => {
    try {
      // Step 1: Generate the text content using the Pro model for quality.
      const textContentPrompt = `
        You are an expert content creator and strategist for Revive 2.0 Underground.
        Your task is to generate a complete, engaging, and well-structured blog post based on the following topic: "${input.topic}".

        The output MUST be a JSON object that strictly adheres to the provided schema.

        Instructions:
        1.  **Title**: Create a compelling, SEO-friendly title.
        2.  **Category**: Assign a relevant category (e.g., Performance Enhancement, Scientific Breakthrough, Holistic Approach, Mind & Body).
        3.  **Excerpt**: Write a concise, enticing summary (1-2 sentences) of the blog post.
        4.  **Content**: Create the main body of the article. It must be an array of blocks. Use a mix of 'paragraph', 'heading', and 'list' blocks to structure the content logically and make it easy to read. The content should be informative and align with the Revive 2.0 Underground brand voice: expert, confident, and visionary.
        5.  **dataAiHint**: Provide two or three keywords that best describe the visual theme of the article for an AI image generator. Example: "abstract technology" or "healing light".
      `;

      const textGenerationResponse = await ai.generate({
        model: geminiPro, // Use the powerful model for content generation
        prompt: textContentPrompt,
        output: {
          schema: z.object({
            title: z.string(),
            category: z.string(),
            excerpt: z.string(),
            content: z.array(BlogContentBlockSchema),
            dataAiHint: z.string(),
          })
        }
      });

      const textOutput = textGenerationResponse.output;
      if (!textOutput) {
        throw new Error("Failed to generate blog post text content.");
      }

      // Step 2: Generate the image using the newly generated title.
      const imageResponse = await generateBlogImageFlow({ title: textOutput.title });

      // Step 3: Combine and return the full blog post object.
      return {
        title: textOutput.title,
        category: textOutput.category,
        excerpt: textOutput.excerpt,
        content: textOutput.content,
        dataAiHint: textOutput.dataAiHint,
        imageUrl: imageResponse.imageUrl,
        imageAlt: `AI-generated image for a blog post titled: ${textOutput.title}`,
      };
    } catch (error: any) {
      console.error("CRITICAL ERROR in generateBlogPostFlow:", error);
      throw new Error(`The blog post could not be generated: ${error.message}`);
    }
  }
);
