import { tool } from 'ai';
import { z } from 'zod';
import { personal } from '@/config/personal';

export const getPresentation = tool({
  description:
    'This tool returns a concise personal introduction. It is used to answer the question "Who are you?" or "Tell me about yourself"',
  parameters: z.any(),
  execute: async () => {
    return {
      presentation:
        personal.presentation,
    };
  },
});
