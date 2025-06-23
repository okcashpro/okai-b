import { logger } from '../logger';
import { knowledgeStorage } from './storage';
import { originalKnowledgeBases } from '../../config/backup/knowledge';
import type { KnowledgeBase } from '../../config/knowledge/types';
import type { KnowledgeMetadata, KnowledgeStore } from './types';

class KnowledgeManager {
  private static instance: KnowledgeManager;

  private constructor() {}

  static getInstance(): KnowledgeManager {
    if (!this.instance) {
      this.instance = new KnowledgeManager();
    }
    return this.instance;
  }

  async getKnowledgeBase(id: string): Promise<KnowledgeBase | null> {
    try {
      // First check original knowledge bases
      if (originalKnowledgeBases[id]) {
        return originalKnowledgeBases[id];
      }

      // Then check storage
      const stored = await knowledgeStorage.getKnowledgeBase(id);
      if (!stored) {
        logger.debug('Knowledge base not found:', id);
        return null;
      }

      return stored;
    } catch (error) {
      logger.error('Error getting knowledge base:', error);
      return null;
    }
  }

  async saveKnowledgeBase(id: string, data: KnowledgeBase): Promise<void> {
    try {
      // Get existing knowledge base to preserve any custom data
      const existing = await this.getKnowledgeBase(id);
      
      // Ensure knowledgeData is preserved
      const knowledgeToSave = {
        ...data,
        knowledgeData: data.knowledgeData || existing?.knowledgeData || ''
      };

      await knowledgeStorage.saveKnowledgeBase(id, knowledgeToSave);
      logger.info('Knowledge base saved successfully:', { id });
    } catch (error) {
      logger.error('Error saving knowledge base:', error);
      throw error;
    }
  }

  async listKnowledgeBases(): Promise<KnowledgeMetadata[]> {
    try {
      return await knowledgeStorage.listKnowledgeBases();
    } catch (error) {
      logger.error('Error listing knowledge bases:', error);
      return [];
    }
  }

  async deleteKnowledgeBase(id: string): Promise<void> {
    try {
      await knowledgeStorage.deleteKnowledgeBase(id);
    } catch (error) {
      logger.error('Error deleting knowledge base:', error);
      throw error;
    }
  }

  async getKnowledgeStore(id: string): Promise<KnowledgeStore | null> {
    try {
      const kb = await this.getKnowledgeBase(id);
      if (!kb) {
        logger.debug('Knowledge base not found:', id);
        return null;
      }

      const store: KnowledgeStore = {
        metadata: {
          id,
          name: kb.name,
          description: `Knowledge base for ${kb.name}`,
          version: '1.0.0',
          lastModified: Date.now(),
          categories: Object.keys(kb.topics),
          promptCount: Object.keys(kb.prompts).length,
          qaCount: Object.values(kb.sampleQA || {}).reduce((sum, qa) => sum + qa.length, 0)
        },
        categories: Object.entries(kb.topics).map(([name, topics]) => ({
          id: name.toLowerCase(),
          name,
          description: `Topics related to ${name}`,
          topics
        })),
        prompts: Object.entries(kb.prompts).map(([name, content]) => ({
          id: name.toLowerCase(),
          name,
          content,
          category: 'general'
        })),
        qa: Object.entries(kb.sampleQA || {}).flatMap(([category, items]) =>
          items.map((item, index) => ({
            id: `${category}-${index}`,
            question: item.question,
            answer: item.answer,
            category,
            tags: [],
            lastModified: Date.now()
          }))
        ),
        knowledgeData: kb.knowledgeData // Store knowledge data at root level
      };

      return store;
    } catch (error) {
      logger.error('Error getting knowledge store:', { error, id });
      return null;
    }
  }
}

export const knowledgeManager = KnowledgeManager.getInstance();