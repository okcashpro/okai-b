import { originalPersonas } from '../../../../config/backup/personas';
import type { AIPersona } from '../../../../config/personas/types';

export class BuiltInOperations {
  mergeWithOriginal(id: string, data: AIPersona): AIPersona {
    const original = originalPersonas[id as keyof typeof originalPersonas];
    const overrides: Partial<AIPersona> = {
      knowledgeBases: data.knowledgeBases,
      customKnowledge: data.customKnowledge,
      displayOrder: data.displayOrder,
      chatLength: data.chatLength,
      model: data.model,
      style: data.style
    };

    return {
      ...original,
      ...overrides,
      // Preserve core fields
      name: original.name,
      description: original.description,
      systemPrompt: original.systemPrompt,
      isBuiltIn: true
    };
  }

  getOriginalPersona(id: string): AIPersona | null {
    const persona = originalPersonas[id as keyof typeof originalPersonas];
    return persona ? { ...persona, isBuiltIn: true } : null;
  }

  listOriginalPersonas(): [string, AIPersona][] {
    return Object.entries(originalPersonas).map(([id, persona]) => [
      id,
      { ...persona, isBuiltIn: true }
    ]);
  }
}