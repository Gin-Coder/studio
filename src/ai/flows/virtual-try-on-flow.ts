'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VirtualTryOnInputSchema = z.object({
  modelImageUri: z.string().describe("The data URI of the model's image."),
  itemImageUris: z.array(z.string()).describe("An array of data URIs for the clothing items."),
});

const VirtualTryOnOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image with the model wearing the items.'),
});

export type VirtualTryOnInput = z.infer<typeof VirtualTryOnInputSchema>;
export type VirtualTryOnOutput = z.infer<typeof VirtualTryOnOutputSchema>;

export async function virtualTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnOutput> {
  return virtualTryOnFlow(input);
}

const virtualTryOnFlow = ai.defineFlow(
  {
    name: 'virtualTryOnFlow',
    inputSchema: VirtualTryOnInputSchema,
    outputSchema: VirtualTryOnOutputSchema,
  },
  async (input) => {
    const prompt = [
        { text: 'You are a fashion expert and a virtual stylist. Your task is to take the image of the person (model) and realistically dress them with the provided clothing items. The final image should be a photorealistic depiction of the person wearing the selected outfit. The background should remain neutral or be a simple studio background. Do not show the original clothing items, only the person wearing them. The output must be a single image.' },
        { media: { url: input.modelImageUri } },
        ...input.itemImageUris.map(url => ({ media: { url } })),
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: prompt,
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed. No media URL returned.');
    }

    return { imageUrl: media.url };
  }
);
