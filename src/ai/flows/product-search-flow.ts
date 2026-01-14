
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { products } from '@/lib/mock-data';
import type { Product as ProductType } from '@/lib/types';

const ProductSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query for a product.'),
  lang: z.string().optional().describe('The language of the query (e.g., "en", "fr", "ht").'),
});
export type ProductSearchInput = z.infer<typeof ProductSearchInputSchema>;

const ProductSearchResultSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
});
export type ProductSearchResult = z.infer<typeof ProductSearchResultSchema>;

const ProductSearchOutputSchema = z.array(ProductSearchResultSchema);

// Simplified product data for the prompt
const productCatalog = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    tags: p.tags.join(', '),
}));

export async function searchProducts(input: ProductSearchInput): Promise<ProductSearchResult[]> {
  return productSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productSearchPrompt',
  input: { schema: ProductSearchInputSchema },
  output: { schema: z.object({ productSlugs: z.array(z.string()).describe('An array of product slugs that best match the query.') }) },
  prompt: `You are an intelligent e-commerce search assistant for Danny Store.
Your task is to find the most relevant products from the catalog based on the user's search query.
Consider the product name, category, and tags.
Handle typos and understand the user's intent even if the keywords don't match exactly.
The user's query is in '{{lang}}'. The catalog data is in English, but you should be able to match across languages.

Return an array of the top 5 most relevant product slugs.

User Query: "{{query}}"

Product Catalog:
${JSON.stringify(productCatalog, null, 2)}
`,
});

const productSearchFlow = ai.defineFlow(
  {
    name: 'productSearchFlow',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    if (!input.query) {
      return [];
    }

    const { output } = await prompt(input);
    if (!output || !output.productSlugs) {
        return [];
    }

    // Map the returned slugs to full product data
    const matchedProducts = output.productSlugs
      .map(slug => {
        const product = products.find(p => p.slug === slug);
        if (!product) return null;
        return {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
        };
      })
      .filter((p): p is ProductSearchResult => p !== null);

    return matchedProducts;
  }
);
