'use server';

/**
 * @fileOverview Creates a summary based on registration details.
 *
 * - createSummary - A function that creates a summary.
 * - CreateSummaryInput - The input type for the createSummary function.
 * - CreateSummaryOutput - The return type for the createSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateSummaryInputSchema = z.object({
    type: z.enum(['delivery', 'collection']).describe('The type of registration.'),
    responsibleParty: z.string().describe('The name of the responsible person.'),
    item: z.string().describe('The item that was delivered or collected.'),
    schoolName: z.string().describe('The name of the school.'),
    department: z.string().optional().describe('The department at the school.'),
    createdAt: z.string().describe('The date and time of the registration in ISO format.'),
});
export type CreateSummaryInput = z.infer<typeof CreateSummaryInputSchema>;

const CreateSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the registration.'),
});
export type CreateSummaryOutput = z.infer<typeof CreateSummaryOutputSchema>;

export async function createSummary(input: CreateSummaryInput): Promise<CreateSummaryOutput> {
  return createSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createSummaryPrompt',
  input: {schema: CreateSummaryInputSchema},
  output: {schema: CreateSummaryOutputSchema},
  prompt: `You are a helpful assistant that creates a concise summary for a registration event.
The registration type is: {{type}}
The item is: {{item}}
It occurred at school: {{schoolName}}{{#if department}}, in the department: {{department}}{{/if}}.
The responsible person is: {{responsibleParty}}.
The event happened on: {{createdAt}}.

Based on these details, create a clear, one-paragraph summary. Format it nicely for a report.
Translate delivery to "Entrega" and collection to "Recolhimento".
Format the date to be human-readable in Brazilian Portuguese (e.g., dd/mm/aaaa HH:MM).
`,
});

const createSummaryFlow = ai.defineFlow(
  {
    name: 'createSummaryFlow',
    inputSchema: CreateSummaryInputSchema,
    outputSchema: CreateSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
