'use server';

/**
 * @fileOverview Generates a message based on registration details.
 *
 * - generateMessage - A function that generates a message.
 * - GenerateMessageInput - The input type for the generateMessage function.
 * - GenerateMessageOutput - The return type for the generateMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMessageInputSchema = z.object({
  type: z.enum(['delivery', 'collection', 'shipment']).describe('The type of registration: delivery, collection, or shipment.'),
  responsibleParty: z.string().describe('The name of the responsible person or sender.'),
  item: z.string().describe('The item that was delivered, collected, or shipped.'),
  schoolName: z.string().describe('The name of the school.'),
});
export type GenerateMessageInput = z.infer<typeof GenerateMessageInputSchema>;

const GenerateMessageOutputSchema = z.object({
  message: z.string().describe('A friendly message for the responsible person, suitable for WhatsApp.'),
  telegramLink: z.string().optional().describe('A pre-filled Telegram share link.'),
});
export type GenerateMessageOutput = z.infer<typeof GenerateMessageOutputSchema>;

export async function generateMessage(input: GenerateMessageInput): Promise<GenerateMessageOutput> {
  return generateMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMessagePrompt',
  input: {schema: GenerateMessageInputSchema},
  output: {schema: GenerateMessageOutputSchema},
  prompt: `You are a helpful assistant. Create a friendly and professional message in Brazilian Portuguese.
The message is for {{responsibleParty}} to confirm a registration.

The registration type is '{{type}}'.
The item is '{{item}}'.
The location is the school '{{schoolName}}'.

- If the type is 'delivery', the message should confirm the successful delivery of the item.
- If the type is 'collection', the message should confirm the successful collection of the item.
- If the type is 'shipment', the message should confirm the item has been dispatched to the school.

The message should be polite and clear. Start with a greeting.
Example for delivery: "Olá, {{responsibleParty}}! Confirmando que o item '{{item}}' foi entregue com sucesso na escola {{schoolName}}. Agradecemos a colaboração!"
Example for collection: "Olá, {{responsibleParty}}! Passando para confirmar que o item '{{item}}' foi recolhido com sucesso na escola {{schoolName}}. Obrigado!"
Example for shipment: "Olá! Informamos que o item '{{item}}' foi despachado para a escola {{schoolName}} e em breve estará a caminho. Atenciosamente."


Based on the generated message, also create a Telegram share URL. The URL should be in the format 'https://t.me/share/url?url=&text=<ENCODED_MESSAGE>'.
URL-encode the message text for the telegramLink field.
`,
});

const generateMessageFlow = ai.defineFlow(
  {
    name: 'generateMessageFlow',
    inputSchema: GenerateMessageInputSchema,
    outputSchema: GenerateMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);