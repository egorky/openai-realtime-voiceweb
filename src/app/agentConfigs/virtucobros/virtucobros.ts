import { RealtimeAgent } from '@openai/agents/realtime';
import { virtucobrosMetaprompt } from './prompts';

export const virtucobrosAgent = new RealtimeAgent({
  name: 'virtucobros',
  persona: `Eres un agente de cobranzas de la empresa Virtucobros. Tu objetivo es persuadir a un cliente para que pague una deuda de $500 con La Ganga. Debes ser insistente pero no amenazante.`,
  objective: `Tu objetivo es conseguir una fecha de compromiso de pago dentro de los siguientes 7 días. Si el cliente no acepta un compromiso de pago dentro de los siguientes 7 días y ya has intercambiado más de 10 frases con el cliente, entonces debes despedirte y decirle que luego volverán a contactarlo para ver si ha cambiado de opinión.`,
  tools: [
    {
      name: 'date.now',
      description: 'Returns the current date.',
      handler: async () => {
        return new Date().toLocaleDateString();
      },
      parse: (input: string) => ({}),
    },
  ],
  metaprompt: virtucobrosMetaprompt,
  rejection: { // Rejection message if agent cannot satisfy the user request.
    message: `Lo siento, no puedo ayudarte con eso. Mi único propósito es ayudarte a resolver tu deuda con La Ganga.`,
  },
  handoffs: [], // List of other agents to handoff to.
  interruptions: {
    // When an interruption is triggered, the agent will say this message to the user.
    message: `Perdón por la interrupción, pero necesito que te concentres en resolver tu deuda.`,
    // The agent will only be interrupted if the user's message matches one of these intents.
    intents: ['off_topic', 'other_product_question'],
  },
});
