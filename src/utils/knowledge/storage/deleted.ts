import { logger } from '../../logger';
import type { StorageProvider, DeletedItemsManager } from './types';

export class DeletedItemsStorage implements DeletedItemsManager {
  constructor(
    private storage: StorageProvider,
    private readonly deletedKey = 'super_okai_deleted_knowledge'
  ) {}

  async markAsDeleted(id: string): Promise<void> {
    try {
      const deleted = await this.getDeletedItems();
      deleted.add(id);
      this.storage.set(this.deletedKey, JSON.stringify(Array.from(deleted)));
      logger.debug('Marked knowledge base as deleted:', id);
    } catch (error) {
      logger.error('Error marking knowledge base as deleted:', error);
      throw new Error('Failed to mark knowledge base as deleted');
    }
  }

  async removeFromDeleted(id: string): Promise<void> {
    try {
      const deleted = await this.getDeletedItems();
      deleted.delete(id);
      this.storage.set(this.deletedKey, JSON.stringify(Array.from(deleted)));
      logger.debug('Removed knowledge base from deleted list:', id);
    } catch (error) {
      logger.error('Error removing knowledge base from deleted list:', error);
      throw new Error('Failed to remove knowledge base from deleted list');
    }
  }

  async getDeletedItems(): Promise<Set<string>> {
    try {
      const stored = this.storage.get(this.deletedKey);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch (error) {
      logger.error('Error getting deleted knowledge bases:', error);
      return new Set();
    }
  }

  async clearDeletedItems(): Promise<void> {
    try {
      this.storage.remove(this.deletedKey);
      logger.debug('Cleared deleted knowledge bases list');
    } catch (error) {
      logger.error('Error clearing deleted knowledge bases:', error);
      throw new Error('Failed to clear deleted knowledge bases');
    }
  }
}