import { logger } from '../../logger';
import type { KnowledgeBase } from '../../../config/knowledge/types';
import type { KnowledgeMetadata } from '../types';
import type { StorageProvider, MetadataManager } from './types';

export class MetadataStorage implements MetadataManager {
  constructor(
    private storage: StorageProvider,
    private readonly metadataKey = 'super_okai_knowledge_metadata'
  ) {}

  get(): KnowledgeMetadata[] {
    try {
      const stored = this.storage.get(this.metadataKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error('Error reading metadata:', error);
      return [];
    }
  }

  async update(id: string, data: KnowledgeBase): Promise<void> {
    try {
      const metadata = this.get();
      const existingIndex = metadata.findIndex(m => m.id === id);
      
      const newMetadata: KnowledgeMetadata = {
        id,
        name: data.name,
        description: `Knowledge base for ${data.name}`,
        version: '1.0.0',
        lastModified: Date.now(),
        categories: Object.keys(data.topics),
        promptCount: Object.keys(data.prompts).length,
        qaCount: Object.values(data.sampleQA || {}).reduce((sum, qa) => sum + qa.length, 0),
        knowledgeData: data.knowledgeData // Include knowledgeData in metadata
      };

      if (existingIndex >= 0) {
        metadata[existingIndex] = newMetadata;
      } else {
        metadata.push(newMetadata);
      }

      this.storage.set(this.metadataKey, JSON.stringify(metadata));
    } catch (error) {
      logger.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata');
    }
  }

  remove(id: string): void {
    try {
      const metadata = this.get();
      const updated = metadata.filter(m => m.id !== id);
      this.storage.set(this.metadataKey, JSON.stringify(updated));
    } catch (error) {
      logger.error('Error removing metadata:', error);
      throw new Error('Failed to remove metadata');
    }
  }
}