import { logger } from '../../logger';
import type { AIPersona } from '../../../config/personas/types';
import type { PersonaStorageProvider } from '../types';
import type { StorageProvider } from './types';
import { PersonaDataValidator } from './validator';
import { MetadataStorage } from './metadata';
import { DeletedPersonasStorage } from './deleted';
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

class PersonaStorage implements PersonaStorageProvider {
  private readonly storagePrefix = 'super_okai_persona_';
  private readonly storage: StorageProvider;
  private readonly validator: PersonaDataValidator;
  private readonly metadata: MetadataStorage;
  private readonly deleted: DeletedPersonasStorage;
  private readonly events: StorageEvents;

  constructor() {
    this.storage = new LocalStorageProvider();
    this.validator = new PersonaDataValidator();
    this.metadata = new MetadataStorage(this.storage);
    this.deleted = new DeletedPersonasStorage(this.storage);
    this.events = new StorageEvents();
  }

  async getPersona(id: string): Promise<AIPersona | null> {
    try {
      // Check if persona is deleted first
      const deletedPersonas = await this.deleted.getDeletedPersonas();
      if (deletedPersonas.has(id)) {
        return null;
      }

      const stored = this.storage.get(`${this.storagePrefix}${id}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      if (!this.validator.validatePersona(data)) {
        logger.warn('Invalid persona data found:', { id });
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Error reading persona:', error);
      return null;
    }
  }

  async savePersona(id: string, data: AIPersona): Promise<void> {
    try {
      if (!this.validator.validatePersona(data)) {
        throw new Error('Invalid persona data');
      }

      // Remove from deleted list if it was previously deleted
      const deletedPersonas = await this.deleted.getDeletedPersonas();
      if (deletedPersonas.has(id)) {
        await this.deleted.removeFromDeleted(id);
      }

      // Ensure all fields are properly structured
      const personaData: AIPersona = {
        name: data.name,
        description: data.description,
        systemPrompt: data.systemPrompt,
        knowledgeBases: data.knowledgeBases || [],
        customKnowledge: data.customKnowledge || [],
        displayOrder: data.displayOrder,
        chatLength: data.chatLength,
        model: data.model,
        style: data.style ? {
          emoticons: data.style.emoticons || [],
          expressions: data.style.expressions || [],
          endPhrases: data.style.endPhrases || [],
          removals: data.style.removals || [],
          formatters: data.style.formatters || []
        } : undefined
      };

      // Save persona data
      this.storage.set(
        `${this.storagePrefix}${id}`, 
        JSON.stringify(personaData)
      );

      // Update metadata
      await this.metadata.update(id, personaData);

      // Trigger storage event
      this.events.emit();
    } catch (error) {
      logger.error('Error saving persona:', error);
      throw new Error('Failed to save persona');
    }
  }

  async listPersonas() {
    try {
      // Get deleted personas first
      const deletedPersonas = await this.deleted.getDeletedPersonas();
      
      // Get all personas from metadata
      const allPersonas = this.metadata.get();
      
      // Filter out deleted personas
      return allPersonas.filter(p => !deletedPersonas.has(p.id));
    } catch (error) {
      logger.error('Error listing personas:', error);
      return [];
    }
  }

  async deletePersona(id: string): Promise<void> {
    try {
      // Remove persona data
      this.storage.remove(`${this.storagePrefix}${id}`);
      
      // Remove from metadata
      this.metadata.remove(id);
      
      // Mark as deleted
      await this.deleted.markAsDeleted(id);
      
      // Trigger storage event
      this.events.emit();
      
      logger.info('Persona deleted successfully:', id);
    } catch (error) {
      logger.error('Error deleting persona:', error);
      throw new Error('Failed to delete persona');
    }
  }

  async markAsDeleted(id: string): Promise<void> {
    try {
      await this.deleted.markAsDeleted(id);
      this.events.emit();
      logger.info('Persona marked as deleted:', id);
    } catch (error) {
      logger.error('Error marking persona as deleted:', error);
      throw new Error('Failed to mark persona as deleted');
    }
  }

  async getDeletedPersonas(): Promise<Set<string>> {
    return this.deleted.getDeletedPersonas();
  }

  async clearDeletedPersonas(): Promise<void> {
    try {
      await this.deleted.clearDeletedPersonas();
      this.events.emit();
      logger.info('Cleared deleted personas list');
    } catch (error) {
      logger.error('Error clearing deleted personas:', error);
      throw new Error('Failed to clear deleted personas');
    }
  }
}

export const personaStorage = new PersonaStorage();