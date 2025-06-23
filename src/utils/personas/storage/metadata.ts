import { logger } from '../../logger';
import type { AIPersona } from '../../../config/personas/types';
import type { PersonaMetadata } from '../types';
import type { StorageProvider, MetadataManager } from './types';

export class MetadataStorage implements MetadataManager {
  constructor(
    private storage: StorageProvider,
    private readonly metadataKey = 'super_okai_persona_metadata'
  ) {}

  get(): PersonaMetadata[] {
    try {
      const stored = this.storage.get(this.metadataKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error('Error reading metadata:', error);
      return [];
    }
  }

  async update(id: string, data: AIPersona): Promise<void> {
    try {
      const metadata = this.get();
      const existingIndex = metadata.findIndex(m => m.id === id);
      
      const newMetadata: PersonaMetadata = {
        id,
        name: data.name,
        description: data.description,
        version: '1.0.0',
        lastModified: Date.now(),
        displayOrder: data.displayOrder || 999,
        model: data.model,
        chatLength: data.chatLength,
        knowledgeBases: data.knowledgeBases,
        isBuiltIn: data.isBuiltIn
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