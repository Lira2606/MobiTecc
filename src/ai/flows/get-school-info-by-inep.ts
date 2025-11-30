
/**
 * @fileOverview MOCK: Fetches school information based on an INEP code.
 * Replaces server-side implementation for static mobile build.
 */

export type GetSchoolInfoByINEPInput = {
  inep: string;
};

export type GetSchoolInfoByINEPOutput = {
  schoolName: string;
  schoolAddress: string;
};

export async function getSchoolInfoByINEP(input: GetSchoolInfoByINEPInput): Promise<GetSchoolInfoByINEPOutput> {
  console.log('Mocking getSchoolInfoByINEP for', input);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (input.inep === '12345678') {
    return {
      schoolName: 'Escola Exemplo de Sucesso (MOCK)',
      schoolAddress: 'Rua da Amostra, 123 (MOCK)',
    };
  }

  // Return a generic mock for any other 8-digit code to be helpful
  if (input.inep && input.inep.length === 8) {
    return {
      schoolName: `Escola Mock ${input.inep}`,
      schoolAddress: `Endereço Mock para ${input.inep}`
    }
  }

  return {
    schoolName: 'Escola não encontrada',
    schoolAddress: 'Endereço não encontrado',
  };
}
