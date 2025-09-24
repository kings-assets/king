
"use server";

import { generateBlogImage, generateBlogAudio, generateBlogPost } from '@/ai/flows/blogAssistantFlow';
import type { 
  BlogImageInput, 
  BlogImageOutput, 
  BlogAudioInput, 
  BlogAudioOutput, 
  BlogPostInput, 
  BlogPostOutput 
} from '@/ai/types';


export async function generateBlogImageAction(
  input: BlogImageInput
): Promise<BlogImageOutput> {
    try {
        const response = await generateBlogImage(input);
        return response;
    } catch (error: any) {
        console.error("Error in generate blog image action:", error.message || error);
        throw new Error("Failed to generate image. Please try again.");
    }
}

export async function generateBlogAudioAction(
  input: BlogAudioInput
): Promise<BlogAudioOutput> {
    try {
        const response = await generateBlogAudio(input);
        return response;
    } catch (error: any) {
        console.error("Error in generate blog audio action:", error.message || error);
        throw new Error("Failed to generate audio. Please try again.");
    }
}

export async function generateBlogPostAction(
  input: BlogPostInput
): Promise<BlogPostOutput> {
  try {
    const response = await generateBlogPost(input);
    return response;
  } catch (error: any) {
    console.error("Error in generate blog post action:", error.message || error);
    throw new Error("Failed to generate blog post. Please try again.");
  }
}
