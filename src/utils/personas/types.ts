import type { ChatLength } from '../../config/personas/types';

/**
 * Normalize persona ID by converting to lowercase and replacing invalid characters
 */
export function normalizeId(name: string): string {
  if (!name) return '';
  
  return name.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '') // Remove all non-alphanumeric characters
    .replace(/^[0-9]+/, ''); // Remove leading numbers
}

export interface PersonaMetadata {
  id: string;           // Unique identifier (normalized)
  name: string;         // Display name
  description: string;
  version: string;
  lastModified: number;
  displayOrder: number;
  model?: string;
  chatLength?: ChatLength;
  knowledgeBases?: string[];
  isBuiltIn?: boolean;
}

export interface PersonaStore {
  metadata: PersonaMetadata;
  systemPrompt: string;
  knowledgeBases: string[];
  customKnowledge: string[];
  style?: PersonaStyle;
}

export interface PersonaStyle {
  emoticons?: string[];
  expressions: string[];
  endPhrases: string[];
  removals: RegExp[];
  formatters: ((content: string) => string)[];
}

export interface PersonaStorageProvider {
  getPersona(id: string): Promise<AIPersona | null>;
  savePersona(id: string, data: AIPersona): Promise<void>;
  listPersonas(): Promise<PersonaMetadata[]>;
  deletePersona(id: string): Promise<void>;
  markAsDeleted(id: string): Promise<void>;
  getDeletedPersonas(): Promise<Set<string>>;
  clearDeletedPersonas(): Promise<void>;
}