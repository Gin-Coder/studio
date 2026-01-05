'use server';

/**
 * @fileOverview Generates a formatted WhatsApp message for order checkout.
 *
 * - generateWhatsAppCheckoutMessage - A function that generates the WhatsApp message.
 * - GenerateWhatsAppCheckoutMessageInput - The input type for the generateWhatsAppCheckoutMessage function.
 * - GenerateWhatsAppCheckoutMessageOutput - The return type for the generateWhatsAppCheckoutMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsAppCheckoutMessageInputSchema = z.object({
  language: z.enum(['FR', 'EN', 'Kreyòl']).describe('The preferred language for the message.'),
  products: z.array(
    z.object({
      name: z.string().describe('The name of the product.'),
      color: z.string().describe('The color of the product.'),
      size: z.string().describe('The size of the product.'),
      quantity: z.number().describe('The quantity of the product.'),
      price: z.number().describe('The price of the product.'),
      imageUrl: z.string().describe('The URL of the product image.'),
    })
  ).describe('The list of products in the order.'),
  subtotal: z.number().describe('The subtotal of the order.'),
  total: z.number().describe('The total amount of the order.'),
  orderId: z.string().describe('The provisional order ID.'),
  customerName: z.string().describe('The name of the customer.'),
  customerWhatsApp: z.string().describe('The WhatsApp number of the customer.'),
});
export type GenerateWhatsAppCheckoutMessageInput = z.infer<typeof GenerateWhatsAppCheckoutMessageInputSchema>;

const GenerateWhatsAppCheckoutMessageOutputSchema = z.object({
  message: z.string().describe('The generated WhatsApp message.'),
});
export type GenerateWhatsAppCheckoutMessageOutput = z.infer<typeof GenerateWhatsAppCheckoutMessageOutputSchema>;

export async function generateWhatsAppCheckoutMessage(
  input: GenerateWhatsAppCheckoutMessageInput
): Promise<GenerateWhatsAppCheckoutMessageOutput> {
  return generateWhatsAppCheckoutMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhatsAppCheckoutMessagePrompt',
  input: {schema: GenerateWhatsAppCheckoutMessageInputSchema},
  output: {schema: GenerateWhatsAppCheckoutMessageOutputSchema},
  prompt: `You are an AI assistant specialized in generating WhatsApp messages for e-commerce checkouts.
  You generate a message in the user's specified language. The message should be premium, elegant, and include all necessary order details.

  Language: {{{language}}}

  Products:
  {{#each products}}
  - Name: {{{name}}}, Color: {{{color}}}, Size: {{{size}}}, Quantity: {{{quantity}}}, Price: {{{price}}}, Image: {{{imageUrl}}}
  {{/each}}

  Subtotal: {{{subtotal}}}
  Delivery: Confirmed via WhatsApp
  Total: {{{total}}}
  Order ID: {{{orderId}}}
  Customer Name: {{{customerName}}}
  Customer WhatsApp: {{{customerWhatsApp}}}

  CTA: Thank you for confirming the order and your delivery address.

  Please generate the complete WhatsApp message:
  `,
});

const generateWhatsAppCheckoutMessageFlow = ai.defineFlow(
  {
    name: 'generateWhatsAppCheckoutMessageFlow',
    inputSchema: GenerateWhatsAppCheckoutMessageInputSchema,
    outputSchema: GenerateWhatsAppCheckoutMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      message: output!.message,
    };
  }
);
