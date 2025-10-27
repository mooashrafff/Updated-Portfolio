import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getCrazy } from './tools/getCrazy';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import { getSports } from './tools/getSport';

export const maxDuration = 30;

// ❌ Pas besoin de l'export ici, Next.js n'aime pas ça
function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    // No streaming body; client handles demo responses locally
    return new Response(null, { status: 204 });
  }
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    // Trim history to reduce tokens (keep last 8 user/assistant turns)
    const history = Array.isArray(messages) ? messages.slice(-16) : [];
    history.unshift(SYSTEM_PROMPT);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getSports,
      getCrazy,
      getInternship,
    };

    // Provider selection: prefer Groq if GROQ_API_KEY is set; otherwise OpenAI
    const provider = process.env.GROQ_API_KEY
      ? createOpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: 'https://api.groq.com/openai/v1',
        })
      : createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Default models (lighter Groq model to avoid TPD caps). Allow override via env.
    const groqModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const primaryModel = process.env.GROQ_API_KEY
      ? provider(groqModel)
      : provider(openaiModel);

    // Try primary; on rate-limit, try a smaller Groq model as fallback
    try {
      const result = streamText({
        model: primaryModel,
        messages: history,
        toolCallStreaming: true,
        tools,
        maxSteps: 2,
      });
      return result.toDataStreamResponse({ getErrorMessage: errorHandler });
    } catch (primaryErr: any) {
      const msg = String(primaryErr?.message || primaryErr || '');
      const isGroq = Boolean(process.env.GROQ_API_KEY);
      if (
        isGroq &&
        (msg.includes('Rate limit') || msg.includes('TPD') || msg.includes('429'))
      ) {
        const fallbackModelId = 'llama-3.2-1b-preview';
        const fallbackModel = provider(fallbackModelId);
        const result = streamText({
          model: fallbackModel,
          messages: history,
          toolCallStreaming: true,
          tools,
          maxSteps: 2,
        });
        return result.toDataStreamResponse({ getErrorMessage: errorHandler });
      }
      throw primaryErr;
    }
  } catch (err) {
    console.error('Global error:', err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}
