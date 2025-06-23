import type { AIPersona } from '../../../config/personas/types';
import type { PersonaValidator } from './types';

export class PersonaDataValidator implements PersonaValidator {
  isValidPersona(data: unknown): data is AIPersona {
    if (!data || typeof data !== 'object') return false;

    const persona = data as Partial<AIPersona>;
    
    // Required fields must exist and be strings
    if (
      typeof persona.name !== 'string' ||
      typeof persona.description !== 'string' ||
      typeof persona.systemPrompt !== 'string' ||
      !persona.name.trim() ||
      !persona.description.trim() ||
      !persona.systemPrompt.trim()
    ) {
      return false;
    }

    // Optional arrays must be arrays if present
    if (persona.knowledgeBases !== undefined && !Array.isArray(persona.knowledgeBases)) {
      return false;
    }

    if (persona.customKnowledge !== undefined && !Array.isArray(persona.customKnowledge)) {
      return false;
    }

    // Optional number must be number if present
    if (persona.displayOrder !== undefined && typeof persona.displayOrder !== 'number') {
      return false;
    }

    // Optional string must be string if present
    if (persona.model !== undefined && typeof persona.model !== 'string') {
      return false;
    }

    // Optional chatLength must be valid enum value if present
    if (
      persona.chatLength !== undefined && 
      !['short', 'normal', 'long'].includes(persona.chatLength)
    ) {
      return false;
    }

    return true;
  }

  isBuiltIn(): boolean {
    return false; // No more built-in checks
  }
}