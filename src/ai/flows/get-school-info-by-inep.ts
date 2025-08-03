'use server';

/**
 * @fileOverview Fetches school information based on an INEP code.
 *
 * - getSchoolInfoByINEP - A function that gets school info.
 * - GetSchoolInfoByINEPInput - The input type for the getSchoolInfoByINEP function.
 * - GetSchoolInfoByINEPOutput - The return type for the getSchoolInfoByINEP function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetSchoolInfoByINEPInputSchema = z.object({
  inep: z.string().describe('The INEP code of the school.'),
});
export type GetSchoolInfoByINEPInput = z.infer<typeof GetSchoolInfoByINEPInputSchema>;

const GetSchoolInfoByINEPOutputSchema = z.object({
  schoolName: z.string().describe('The full name of the school.'),
  schoolAddress: z.string().describe('The full address of the school.'),
});
export type GetSchoolInfoByINEPOutput = z.infer<typeof GetSchoolInfoByINEPOutputSchema>;

// This is a placeholder tool. In a real application, this would
// call an external API to get the school information.
const fetchSchoolDataTool = ai.defineTool(
  {
    name: 'fetchSchoolData',
    description: 'Get school name and address for a given INEP code.',
    inputSchema: z.object({inep: z.string()}),
    outputSchema: GetSchoolInfoByINEPOutputSchema,
  },
  async ({inep}) => {
    console.log(`Fetching data for INEP: ${inep}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real scenario, you would fetch this from a database or an API.
    // For now, we return mock data.
    if (inep === '12345678') {
      return {
        schoolName: 'Escola Exemplo de Sucesso',
        schoolAddress: 'Rua da Amostra, 123, Bairro do Exemplo, Cidade/Estado',
      };
    }
    return {
      schoolName: 'Escola não encontrada',
      schoolAddress: 'Endereço não encontrado',
    };
  }
);


export async function getSchoolInfoByINEP(input: GetSchoolInfoByINEPInput): Promise<GetSchoolInfoByINEPOutput> {
  return getSchoolInfoByINEPFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSchoolInfoPrompt',
  input: {schema: GetSchoolInfoByINEPInputSchema},
  output: {schema: GetSchoolInfoByINEPOutputSchema},
  tools: [fetchSchoolDataTool],
  prompt: `You are an assistant that finds school information.
  Use the fetchSchoolData tool to get the name and address for the school with INEP code: {{inep}}.
  Return the information in the specified format.
  `,
});

const getSchoolInfoByINEPFlow = ai.defineFlow(
  {
    name: 'getSchoolInfoByINEPFlow',
    inputSchema: GetSchoolInfoByINEPInputSchema,
    outputSchema: GetSchoolInfoByINEPOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
