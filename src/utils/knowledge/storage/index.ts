import { logger } from '../../logger';
import type { KnowledgeBase } from '../../../config/knowledge/types';
import type { KnowledgeMetadata } from '../types';
import type { StorageProvider } from './types';
import { KnowledgeBaseValidator } from './validator';
import { MetadataStorage } from './metadata';
import { DeletedItemsStorage } from './deleted';
import { StorageEvents } from './events';

class LocalStorageProvider implements StorageProvider {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error('Error reading from storage:', error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error('Error writing to storage:', error);
      throw error;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Error removing from storage:', error);
    }
  }
}

class KnowledgeStorage {
  private readonly storagePrefix = 'super_okai_knowledge_';
  private readonly storage: StorageProvider;
  private readonly validator: KnowledgeBaseValidator;
  private readonly metadata: MetadataStorage;
  private readonly deleted: DeletedItemsStorage;
  private readonly events: StorageEvents;

  constructor() {
    this.storage = new LocalStorageProvider();
    this.validator = new KnowledgeBaseValidator();
    this.metadata = new MetadataStorage(this.storage);
    this.deleted = new DeletedItemsStorage(this.storage);
    this.events = new StorageEvents();
  }

  async getKnowledgeBase(id: string): Promise<KnowledgeBase | null> {
    try {
      // Check if knowledge base is deleted
      const deletedItems = await this.deleted.getDeletedItems();
      if (deletedItems.has(id)) {
        return null;
      }

      const stored = this.storage.get(`${this.storagePrefix}${id}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (!this.validator.validateKnowledgeBase(data)) {
        logger.warn('Invalid knowledge base data found:', { id });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error reading knowledge base:', error);
      return null;
    }
  }

  async saveKnowledgeBase(id: string, data: KnowledgeBase): Promise<void> {
    try {
      if (!this.validator.validateKnowledgeBase(data)) {
        throw new Error('Invalid knowledge base data');
      }

      // Remove from deleted list if it was previously deleted
      const deletedItems = await this.deleted.getDeletedItems();
      if (deletedItems.has(id)) {
        await this.deleted.removeFromDeleted(id);
      }

      // Get existing knowledge base to preserve knowledgeData if not provided
      const existing = await this.getKnowledgeBase(id);
      
      // Ensure all fields are properly structured
      const knowledgeBase: KnowledgeBase = {
        name: data.name,
        topics: data.topics,
        prompts: data.prompts,
        sampleQA: data.sampleQA,
        // Preserve existing knowledgeData if not provided in new data
        knowledgeData: data.knowledgeData || existing?.knowledgeData || ''
      };

      // Save knowledge base data
      this.storage.set(
        `${this.storagePrefix}${id}`, 
        JSON.stringify(knowledgeBase)
      );

      // Update metadata
      await this.metadata.update(id, knowledgeBase);

      // Trigger storage event
      this.events.emit();

      logger.info('Knowledge base saved successfully:', { id });
    } catch (error) {
      logger.error('Error saving knowledge base:', error);
      throw error;
    }
  }

  async listKnowledgeBases(): Promise<KnowledgeMetadata[]> {
    try {
      // Get deleted items first
      const deletedItems = await this.deleted.getDeletedItems();
      
      // Get all knowledge bases from metadata
      const allKnowledgeBases = this.metadata.get();
      
      // Filter out deleted items
      return allKnowledgeBases.filter(kb => !deletedItems.has(kb.id));
    } catch (error) {
      logger.error('Error listing knowledge bases:', error);
      return [];
    }
  }

  async deleteKnowledgeBase(id: string): Promise<void> {
    try {
      // Remove knowledge base data
      this.storage.remove(`${this.storagePrefix}${id}`);
      
      // Remove from metadata
      this.metadata.remove(id);
      
      // Mark as deleted
      await this.deleted.markAsDeleted(id);
      
      // Trigger storage event
      this.events.emit();
      
      logger.info('Knowledge base deleted successfully:', id);
    } catch (error) {
      logger.error('Error deleting knowledge base:', error);
      throw error;
    }
  }

  async markAsDeleted(id: string): Promise<void> {
    try {
      await this.deleted.markAsDeleted(id);
      this.events.emit();
      logger.info('Knowledge base marked as deleted:', id);
    } catch (error) {
      logger.error('Error marking knowledge base as deleted:', error);
      throw error;
    }
  }

  async getDeletedItems(): Promise<Set<string>> {
    return this.deleted.getDeletedItems();
  }

  async clearDeletedItems(): Promise<void> {
    try {
      await this.deleted.clearDeletedItems();
      this.events.emit();
      logger.info('Cleared deleted knowledge bases list');
    } catch (error) {
      logger.error('Error clearing deleted knowledge bases:', error);
      throw error;
    }
  }
}

export const knowledgeStorage = new KnowledgeStorage();