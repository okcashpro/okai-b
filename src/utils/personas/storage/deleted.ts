import { logger } from '../../logger';
import type { StorageProvider, DeletedPersonasManager } from './types';

export class DeletedPersonasStorage implements DeletedPersonasManager {
  constructor(
    private storage: StorageProvider,
    private readonly deletedKey = 'super_okai_deleted_personas'
  ) {}

  async markAsDeleted(id: string): Promise<void> {
    try {
      const deleted = await this.getDeletedPersonas();
      deleted.add(id);
      this.storage.set(this.deletedKey, JSON.stringify(Array.from(deleted)));
      logger.debug('Marked persona as deleted:', id);
    } catch (error) {
      logger.error('Error marking persona as deleted:', error);
      throw new Error('Failed to mark persona as deleted');
    }
  }

  async removeFromDeleted(id: string): Promise<void> {
    try {
      const deleted = await this.getDeletedPersonas();
      deleted.delete(id);
      this.storage.set(this.deletedKey, JSON.stringify(Array.from(deleted)));
      logger.debug('Removed persona from deleted list:', id);
    } catch (error) {
      logger.error('Error removing persona from deleted list:', error);
      throw new Error('Failed to remove persona from deleted list');
    }
  }

  async getDeletedPersonas(): Promise<Set<string>> {
    try {
      const stored = this.storage.get(this.deletedKey);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch (error) {
      logger.error('Error getting deleted personas:', error);
      return new Set();
    }
  }

  async clearDeletedPersonas(): Promise<void> {
    try {
      this.storage.remove(this.deletedKey);
      logger.debug('Cleared deleted personas list');
    } catch (error) {
      logger.error('Error clearing deleted personas:', error);
      throw new Error('Failed to clear deleted personas');
    }
  }
}