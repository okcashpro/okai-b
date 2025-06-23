import { logger } from './logger';
import type { AIPersona } from '../config/personas/types';

function adjustResponseLength(content: string, chatLength: 'short' | 'normal' | 'long' = 'normal'): string {
  try {
    // Split content into sentences
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return content;
    
    switch (chatLength) {
      case 'short':
        // Keep only first 1-2 sentences
        return sentences.slice(0, Math.min(2, Math.max(1, Math.ceil(sentences.length * 0.2)))).join(' ');
        
      case 'long':
        // For long responses, keep all sentences and add more detail
        return sentences
          .map((sentence, index) => {
            // Add elaboration for some sentences
            if (index % 3 === 0 && !sentence.includes('For example')) {
              return sentence.trim() + ' For example, ';
            }
            return sentence;
          })
          .join(' ');
        
      default: // 'normal'
        // Keep about 40-60% of sentences
        const normalLength = Math.max(2, Math.ceil(sentences.length * 0.5));
        return sentences.slice(0, normalLength).join(' ');
    }
  } catch (error) {
    logger.debug('Error adjusting response length:', error);
    return content; // Return original content on error
  }
}

function applyRemovals(content: string, removals: RegExp[]): string {
  try {
    let result = content;
    for (const pattern of removals) {
      if (pattern instanceof RegExp) {
        result = result.replace(pattern, '');
      }
    }
    return result;
  } catch (error) {
    logger.debug('Error applying removals:', error);
    return content;
  }
}

function applyFormatters(content: string, formatters: ((content: string) => string)[]): string {
  try {
    return formatters.reduce((text, formatter) => {
      try {
        return formatter(text) || text;
      } catch (error) {
        logger.debug('Error in custom formatter:', error);
        return text;
      }
    }, content);
  } catch (error) {
    logger.debug('Error applying formatters:', error);
    return content;
  }
}

function addEmoticon(content: string, emoticons: string[]): string {
  try {
    if (!emoticons.length) return content;
    if (emoticons.some(emote => content.includes(emote))) return content;

    const randomEmote = emoticons[Math.floor(Math.random() * emoticons.length)];
    return `${content} ${randomEmote}`;
  } catch (error) {
    logger.debug('Error adding emoticon:', error);
    return content;
  }
}

function addExpression(content: string, expressions: string[]): string {
  try {
    if (!expressions.length) return content;
    if (expressions.some(expr => content.toLowerCase().includes(expr))) return content;
    if (Math.random() >= 0.3) return content;

    const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
    return `${randomExpr}, ${content}`;
  } catch (error) {
    logger.debug('Error adding expression:', error);
    return content;
  }
}

function addEndPhrase(content: string, endPhrases: string[]): string {
  try {
    if (!endPhrases.length) return content;
    const trimmedContent = content.trim();
    if (endPhrases.some(phrase => trimmedContent.endsWith(phrase))) return content;

    const randomEndPhrase = endPhrases[Math.floor(Math.random() * endPhrases.length)];
    return `${trimmedContent}${randomEndPhrase}`;
  } catch (error) {
    logger.debug('Error adding end phrase:', error);
    return content;
  }
}

export function formatPersonaResponse(content: string, persona: AIPersona): string {
  if (!content || typeof content !== 'string') {
    logger.warn('Invalid content provided to formatPersonaResponse');
    return content || '';
  }

  try {
    // First adjust the length based on persona's chatLength setting
    let formattedContent = adjustResponseLength(content, persona.chatLength);

    // If no style defined, return length-adjusted content
    if (!persona.style) return formattedContent;

    // Apply style transformations with error handling for each step
    if (persona.style.removals?.length) {
      formattedContent = applyRemovals(formattedContent, persona.style.removals);
    }

    if (persona.style.formatters?.length) {
      formattedContent = applyFormatters(formattedContent, persona.style.formatters);
    }

    if (persona.style.emoticons?.length) {
      formattedContent = addEmoticon(formattedContent, persona.style.emoticons);
    }

    if (persona.style.expressions?.length) {
      formattedContent = addExpression(formattedContent, persona.style.expressions);
    }

    if (persona.style.endPhrases?.length) {
      formattedContent = addEndPhrase(formattedContent, persona.style.endPhrases);
    }

    return formattedContent || content; // Fallback to original content if formatting fails
  } catch (error) {
    logger.debug('Error in formatPersonaResponse:', error);
    return content; // Return original content on error
  }
}