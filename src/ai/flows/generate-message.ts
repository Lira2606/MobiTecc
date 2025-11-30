
/**
 * @fileOverview MOCK: Generates a message based on registration details.
 * Replaces server-side implementation for static mobile build.
 */

export type GenerateMessageInput = {
  type: 'delivery' | 'collection' | 'shipment';
  responsibleParty: string;
  item: string;
  schoolName: string;
};

export type GenerateMessageOutput = {
  message: string;
  telegramLink?: string;
};

export async function generateMessage(input: GenerateMessageInput): Promise<GenerateMessageOutput> {
  console.log('Mocking generateMessage for', input);
  await new Promise(resolve => setTimeout(resolve, 1000));

  let message = '';
  switch (input.type) {
    case 'delivery':
      message = `Olá, ${input.responsibleParty}! Confirmando que o item '${input.item}' foi entregue com sucesso na escola ${input.schoolName}. Agradecemos a colaboração! (MOCK)`;
      break;
    case 'collection':
      message = `Olá, ${input.responsibleParty}! Passando para confirmar que o item '${input.item}' foi recolhido com sucesso na escola ${input.schoolName}. Obrigado! (MOCK)`;
      break;
    case 'shipment':
      message = `Olá! Informamos que o item '${input.item}' foi despachado para a escola ${input.schoolName} e em breve estará a caminho. Atenciosamente. (MOCK)`;
      break;
  }

  return {
    message,
    telegramLink: `https://t.me/share/url?url=&text=${encodeURIComponent(message)}`,
  };
}