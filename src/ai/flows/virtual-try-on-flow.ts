
'use server';
/**
 * @fileOverview An AI agent that generates a virtual try-on image.
 *
 * - generateVirtualTryOnImage - A function that handles the image generation.
 * - GenerateVirtualTryOnImageInput - The input type for the function.
 * - GenerateVirtualTryOnImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { toWav } from './utils';
import { Buffer } from 'buffer';

const ClothingItemSchema = z.object({
  imageUri: z.string().describe("A data URI of the clothing item. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  category: z.enum(['clothing', 'shoes', 'accessories', 'tech']).describe('The category of the item.'),
});

const GenerateVirtualTryOnImageInputSchema = z.object({
  modelImageUri: z.string().describe("A data URI of the model's photo. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  clothingItems: z.array(ClothingItemSchema).describe('An array of clothing items to be worn by the model.'),
});
export type GenerateVirtualTryOnImageInput = z.infer<typeof GenerateVirtualTryOnImageInputSchema>;

const GenerateVirtualTryOnImageOutputSchema = z.object({
  generatedImageUri: z.string().describe("A data URI of the generated image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateVirtualTryOnImageOutput = z.infer<typeof GenerateVirtualTryOnImageOutputSchema>;

export async function generateVirtualTryOnImage(
  input: GenerateVirtualTryOnImageInput
): Promise<GenerateVirtualTryOnImageOutput> {
  return generateVirtualTryOnImageFlow(input);
}

const prompt = ai.definePrompt({
    name: 'virtualTryOnPrompt',
    input: { schema: GenerateVirtualTryOnImageInputSchema },
    output: { schema: GenerateVirtualTryOnImageOutputSchema },
    prompt: `
You are a virtual stylist. Your task is to generate a realistic image of a person wearing the provided clothing items.
- The base image is the model.
- The other images are clothing items.
- Place the clothing items onto the model realistically. The generated image should show the full body of the model wearing the clothes.

Model:
{{media url=modelImageUri}}

Clothing Items:
{{#each clothingItems}}
- Category: {{this.category}}
  Image: {{media url=this.imageUri}}
{{/each}}
`,
    config: {
        model: 'googleai/gemini-2.5-flash-image-preview',
        responseModalities: ['IMAGE'],
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
        ]
    }
});


const generateVirtualTryOnImageFlow = ai.defineFlow(
  {
    name: 'generateVirtualTryOnImageFlow',
    inputSchema: GenerateVirtualTryOnImageInputSchema,
    outputSchema: GenerateVirtualTryOnImageOutputSchema,
  },
  async (input) => {
    const { media } = await prompt(input);

    if (!media?.url) {
      throw new Error('Image generation failed to return an image.');
    }
    
    return {
      generatedImageUri: media.url,
    };
  }
);
