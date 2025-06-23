import type { AIPersona } from '../../../config/personas/types';
import type { PersonaMetadata, PersonaStore } from '../types';

export interface PersonaCache {
  get(id: string): AIPersona | null;
  set(id: string, persona: AIPersona): void;
  delete(id: string): void;
  clear(): void;
}

export interface PersonaValidator {
  isValidPersona(data: unknown): data is AIPersona;
  isBuiltIn(id: string): boolean;
}

export interface PersonaInitializer {
  initialize(): Promise<void>;
}

export interface PersonaOperations {
  getPersona(id: string): Promise<AIPersona | null>;
  savePersona(id: string, data: AIPersona): Promise<void>;
  listPersonas(): Promise<PersonaMetadata[]>;
  deletePersona(id: string): Promise<void>;
  getPersonaStore(id: string): Promise<PersonaStore | null>;
}