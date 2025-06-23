import type { KnowledgeBase } from '../../config/knowledge/types';

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  topics: string[];
}

export interface KnowledgePrompt {
  id: string;
  name: string;
  content: string;
  category: string;
}

export interface QandA {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastModified: number;
}

export interface KnowledgeMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  lastModified: number;
  categories: string[];
  promptCount: number;
  qaCount: number;
}

export interface KnowledgeStore {
  metadata: KnowledgeMetadata;
  categories: KnowledgeCategory[];
  prompts: KnowledgePrompt[];
  qa: QandA[];
  knowledgeData: string; // Single source of truth for knowledge content
}

export interface KnowledgeStorageProvider {
  getKnowledgeBase(id: string): Promise<KnowledgeBase | null>;
  saveKnowledgeBase(id: string, data: KnowledgeBase): Promise<void>;
  listKnowledgeBases(): Promise<KnowledgeMetadata[]>;
  deleteKnowledgeBase(id: string): Promise<void>;
}

export interface KnowledgeValidator {
  validateKnowledgeBase(data: unknown): data is KnowledgeBase;
  validateMetadata(data: unknown): data is KnowledgeMetadata;
}

export interface KnowledgeExporter {
  exportToJSON(knowledgeBase: KnowledgeBase): string;
  importFromJSON(json: string): KnowledgeBase;
}