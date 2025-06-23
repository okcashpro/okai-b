import type { AIPersona } from '../../../../config/personas/types';
import type { PersonaMetadata } from '../../types';
import { normalizeId } from '../../types';

export class MetadataOperations {
  createMetadata(id: string, persona: AIPersona, isBuiltIn: boolean): PersonaMetadata {
    return {
      id: normalizeId(id),
      name: persona.name,
      description: persona.description,
      version: '1.0.0',
      lastModified: Date.now(),
      displayOrder: persona.displayOrder || 999,
      model: persona.model,
      chatLength: persona.chatLength,
      knowledgeBases: persona.knowledgeBases,
      isBuiltIn
    };
  }

  mergeMetadata(original: PersonaMetadata, stored: PersonaMetadata): PersonaMetadata {
    if (original.isBuiltIn) {
      return {
        ...original,
        displayOrder: stored.displayOrder,
        model: stored.model,
        chatLength: stored.chatLength,
        knowledgeBases: stored.knowledgeBases
      };
    }
    return stored;
  }

  sortByDisplayOrder(personas: PersonaMetadata[]): PersonaMetadata[] {
    return personas.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }
}