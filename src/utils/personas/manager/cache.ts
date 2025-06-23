import type { AIPersona } from '../../../config/personas/types';
import type { PersonaCache } from './types';

export class InMemoryPersonaCache implements PersonaCache {
  private cache = new Map<string, AIPersona>();

  get(id: string): AIPersona | null {
    return this.cache.get(id) || null;
  }

  set(id: string, persona: AIPersona): void {
    this.cache.set(id, persona);
  }

  delete(id: string): void {
    this.cache.delete(id);
  }

  clear(): void {
    this.cache.clear();
  }
}