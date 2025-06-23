import type { KnowledgeBase } from '../../../config/knowledge/types';
import type { KnowledgeMetadata } from '../types';

export interface StorageProvider {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface KnowledgeValidator {
  validateKnowledgeBase(data: unknown): data is KnowledgeBase;
  validateMetadata(data: unknown): data is KnowledgeMetadata;
}

export interface MetadataManager {
  get(): KnowledgeMetadata[];
  update(id: string, data: KnowledgeBase): Promise<void>;
  remove(id: string): void;
}

export interface DeletedItemsManager {
  markAsDeleted(id: string): Promise<void>;
  removeFromDeleted(id: string): Promise<void>;
  getDeletedItems(): Promise<Set<string>>;
  clearDeletedItems(): Promise<void>;
}

export interface StorageEventEmitter {
  emit(): void;
}