import { knowledgeManager } from './manager';
import { knowledgeStorage } from './storage';

export { knowledgeManager, knowledgeStorage };
export type {
  KnowledgeStore,
  KnowledgeMetadata,
  KnowledgeCategory,
  KnowledgePrompt,
  QandA
} from './types';