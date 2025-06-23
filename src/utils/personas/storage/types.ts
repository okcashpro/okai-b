import type { AIPersona } from '../../../config/personas/types';
import type { PersonaMetadata } from '../types';

export interface StorageProvider {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface PersonaValidator {
  validatePersona(data: unknown): data is AIPersona;
  validateMetadata(data: unknown): data is PersonaMetadata;
}

export interface MetadataManager {
  get(): PersonaMetadata[];
  update(id: string, data: AIPersona): Promise<void>;
  remove(id: string): void;
}

export interface DeletedPersonasManager {
  markAsDeleted(id: string): Promise<void>;
  removeFromDeleted(id: string): Promise<void>;
  getDeletedPersonas(): Promise<Set<string>>;
  clearDeletedPersonas(): Promise<void>;
}

export interface StorageEventEmitter {
  emit(): void;
}