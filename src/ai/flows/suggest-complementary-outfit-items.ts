'use server';
/**
 * @fileOverview An AI agent that suggests complementary outfit items.
 *
 * - suggestComplementaryOutfitItems - A function that handles the outfit suggestion process.
 * - SuggestComplementaryOutfitItemsInput - The input type for the suggestComplementaryOutfitItems function.
 * - SuggestComplementaryOutfitItemsOutput - The return type for the suggestComplementaryOutfitItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestComplementaryOutfitItemsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product to find complementary items for.'),
  productCategory: z.string().describe('The category of the product.'),
  userStylePreferences: z
    .string()
    .optional()
    .describe('The user style preferences, if available.'),
});
export type SuggestComplementaryOutfitItemsInput = z.infer<
  typeof SuggestComplementaryOutfitItemsInputSchema
>;

const SuggestComplementaryOutfitItemsOutputSchema = z.object({
  suggestedItems: z
    .array(z.string())
    .describe('An array of suggested item names that complement the product.'),
});
export type SuggestComplementaryOutfitItemsOutput = z.infer<
  typeof SuggestComplementaryOutfitItemsOutputSchema
>;

export async function suggestComplementaryOutfitItems(
  input: SuggestComplementaryOutfitItemsInput
): Promise<SuggestComplementaryOutfitItemsOutput> {
  return suggestComplementaryOutfitItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplementaryOutfitItemsPrompt',
  input: {schema: SuggestComplementaryOutfitItemsInputSchema},
  output: {schema: SuggestComplementaryOutfitItemsOutputSchema},
  prompt: `You are a personal stylist helping customers find items that go well with their existing products.

  The customer is currently viewing or has in their cart a product with the following description:
  {{productDescription}}
  Category: {{productCategory}}

  {% if userStylePreferences %}
  The customer has the following style preferences:
  {{userStylePreferences}}
  {% endif %}

  Suggest a few items (2-4) that would complement this product and fit the customer's style. Only list the item names. Do not include descriptions. Format each item as a bullet point. If the user has no style preferences, select items that are generally popular and versatile.

  Suggested items:
  `, // Ensure that the prompt ends with "Suggested items:" so that Genkit knows where to look for the output
});

const suggestComplementaryOutfitItemsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryOutfitItemsFlow',
    inputSchema: SuggestComplementaryOutfitItemsInputSchema,
    outputSchema: SuggestComplementaryOutfitItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
