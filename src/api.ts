import OpenAI from 'openai';
import { config } from './config/env';
import { apiKeyManager } from './utils/apiKeyManager';
import { getSelectedModel } from './config/models';
import type { Message } from './types';
import type { AIPersona } from './config/personas/types';
import { formatResponse } from './utils/responseFormatter';
import { findBestMatch, integrateKnowledge } from './utils/knowledgeIntegration';
import { logger } from './utils/logger';
import { analytics } from './utils/analytics';
import { metrics } from './utils/metrics';
import { RateLimiter } from './utils/rateLimit';
import { APIError } from './utils/errors';

const rateLimiter = RateLimiter.getInstance();

export async function sendMessage(messages: Message[], persona: AIPersona): Promise<Message | undefined> {
  const requestId = crypto.randomUUID();
  
  try {
    metrics.recordMetric('message_request_start', 1);

    if (!rateLimiter.checkLimit(requestId)) {
      throw new Error('Rate limit exceeded');
    }

    // Validate persona
    if (!persona) {
      throw new APIError('No AI agent selected. Please select an AI agent before sending messages.', 400);
    }

    // Get active API key
    const activeKey = apiKeyManager.getActiveApiKey();
    if (!activeKey) {
      throw new APIError('OpenRouter API key is missing. Please add your API key in the settings.', 401);
    }

    // Create OpenAI client with active key
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: activeKey,
      defaultHeaders: {
        "HTTP-Referer": config.siteUrl || window.location.origin,
        "X-Title": config.appName || 'Super Okai',
      },
      dangerouslyAllowBrowser: true
    });

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      throw new APIError('No message content provided', 400);
    }

    // Get knowledge context
    const integrated = await integrateKnowledge(persona);
    const matchingQA = await findBestMatch(lastMessage.content, persona);

    // Create system message with integrated knowledge
    const systemMessage: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `${persona.systemPrompt}

KNOWLEDGE BASE INTEGRATION:
1. Topics of Expertise: ${integrated.topics.join(', ')}
2. Context-Specific Instructions: ${integrated.prompts.join(' ')}
${integrated.knowledgeData.length > 0 ? `3. Detailed Knowledge:
${integrated.knowledgeData.join('\n\n')}` : ''}

${matchingQA ? `VERIFIED KNOWLEDGE BASE ANSWER:
Source: ${matchingQA.source}
Category: ${matchingQA.category}
Answer: "${matchingQA.answer}"` : ''}

RESPONSE GUIDELINES:
1. Primary Source: Always prioritize knowledge base answers when available
2. Consistency: Maintain ${persona.name}'s personality and style
3. Accuracy: Only use verified information from the knowledge base
4. Fallback: Use general knowledge only when no knowledge base match exists`
    };

    try {
      const completion = await openai.chat.completions.create({
        model: persona.model || getSelectedModel(),
        messages: [systemMessage, ...messages].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const response = completion.choices[0].message;
      if (!response?.content) {
        throw new APIError('No response content received', 500);
      }

      const formattedResponse = formatResponse(
        { id: crypto.randomUUID(), role: 'assistant', content: response.content },
        persona
      );

      analytics.trackEvent('message_sent', {
        persona: persona.name,
        hasKnowledgeMatch: !!matchingQA,
        requestId
      });

      return formattedResponse;

    } catch (error: any) {
      // Handle specific API errors
      if (error.status === 401) {
        throw new APIError('Invalid OpenRouter API key. Please check your configuration.', 401);
      }
      if (error.status === 429) {
        throw new APIError('Rate limit exceeded. Please try again later.', 429);
      }
      throw new APIError(
        error.message || 'Failed to get response from OpenRouter API',
        error.status || 500
      );
    }

  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    logger.error('Error in sendMessage:', error);
    throw new APIError('An unexpected error occurred while processing your message', 500);
  }
}