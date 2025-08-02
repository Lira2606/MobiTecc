'use server';

/**
 * @fileOverview Suggests school names based on previous entries.
 *
 * - suggestSchool - A function that suggests school names.
 * - SuggestSchoolInput - The input type for the suggestSchool function.
 * - SuggestSchoolOutput - The return type for the suggestSchool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSchoolInputSchema = z.object({
  partialSchoolName: z
    .string()
    .describe('The partial name of the school to suggest.'),
  previousSchoolNames: z
    .array(z.string())
    .describe('A list of previously entered school names.'),
});
export type SuggestSchoolInput = z.infer<typeof SuggestSchoolInputSchema>;

const SuggestSchoolOutputSchema = z.object({
  suggestedSchoolNames: z
    .array(z.string())
    .describe('A list of suggested school names.'),
});
export type SuggestSchoolOutput = z.infer<typeof SuggestSchoolOutputSchema>;

export async function suggestSchool(input: SuggestSchoolInput): Promise<SuggestSchoolOutput> {
  return suggestSchoolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSchoolPrompt',
  input: {schema: SuggestSchoolInputSchema},
  output: {schema: SuggestSchoolOutputSchema},
  prompt: `You are a helpful assistant that suggests school names based on previous entries.

  Given the following partial school name: {{{partialSchoolName}}}
  And the following list of previously entered school names: {{#each previousSchoolNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Suggest up to 5 school names that start with the partial school name and are in the list of previously entered school names.
  Return only the names of the suggested schools.
  If no names match, return an empty list.
  `,
});

const suggestSchoolFlow = ai.defineFlow(
  {
    name: 'suggestSchoolFlow',
    inputSchema: SuggestSchoolInputSchema,
    outputSchema: SuggestSchoolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
