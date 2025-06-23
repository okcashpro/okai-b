import { logger } from '../../../logger';
import { personaStorage } from '../../storage';
import { normalizeId } from '../../types';
import type { AIPersona } from '../../../../config/personas/types';
import type { PersonaMetadata, PersonaStore } from '../../types';
import type { PersonaCache, PersonaValidator, PersonaOperations } from '../types';
import type { PersonaOperationsBase } from './base';
import { MetadataOperations } from './metadata';

export class PersonaOperationsManager implements PersonaOperationsBase {
  private metadata: MetadataOperations;

  constructor(
    private cache: PersonaCache,
    private validator: PersonaValidator
  ) {
    this.metadata = new MetadataOperations();
  }

  async getPersona(id: string): Promise<AIPersona | null> {
    try {
      const normalizedId = normalizeId(id);

      // Check cache first
      const cached = this.cache.get(normalizedId);
      if (cached) return cached;

      // Check if persona is deleted
      const deletedPersonas = await personaStorage.getDeletedPersonas();
      if (deletedPersonas.has(normalizedId)) {
        return null;
      }

      // Get persona from storage
      const persona = await personaStorage.getPersona(normalizedId);
      if (persona) {
        this.cache.set(normalizedId, persona);
      }
      return persona;

    } catch (error) {
      logger.error('Error getting persona:', { error, id });
      return null;
    }
  }

  async savePersona(id: string, data: AIPersona): Promise<void> {
    try {
      const normalizedId = normalizeId(id);

      // Validate persona data
      if (!this.validator.isValidPersona(data)) {
        throw new Error('Invalid persona data');
      }

      // Clear cache entry
      this.cache.delete(normalizedId);

      // Save persona data
      await personaStorage.savePersona(normalizedId, data);
    } catch (error) {
      logger.error('Error saving persona:', { error, id });
      throw error;
    }
  }

  async listPersonas(): Promise<PersonaMetadata[]> {
    try {
      // Get deleted personas
      const deletedPersonas = await personaStorage.getDeletedPersonas();

      // Get stored personas
      const storedPersonas = await personaStorage.listPersonas();

      // Filter out deleted personas and sort by display order
      return this.metadata.sortByDisplayOrder(
        storedPersonas.filter(p => !deletedPersonas.has(p.id))
      );
    } catch (error) {
      logger.error('Error listing personas:', error);
      return [];
    }
  }

  async deletePersona(id: string): Promise<void> {
    try {
      const normalizedId = normalizeId(id);

      // Check if persona exists before attempting deletion
      const persona = await this.getPersona(normalizedId);
      if (!persona) {
        logger.warn('Attempted to delete non-existent persona:', normalizedId);
        return;
      }

      try {
        // Clear cache first
        this.cache.delete(normalizedId);

        // Delete from storage
        await personaStorage.deletePersona(normalizedId);
        
        // Mark as deleted to prevent recreation
        await personaStorage.markAsDeleted(normalizedId);
        
        logger.info('Persona deleted successfully:', normalizedId);
      } catch (error) {
        // If deletion fails, ensure it's at least marked as deleted
        await personaStorage.markAsDeleted(normalizedId);
        logger.warn('Partial deletion - persona marked as deleted:', normalizedId);
        throw error;
      }
    } catch (error) {
      logger.error('Error deleting persona:', { error, id });
      throw new Error(`Failed to delete persona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPersonaStore(id: string): Promise<PersonaStore | null> {
    try {
      const normalizedId = normalizeId(id);
      const persona = await this.getPersona(normalizedId);
      if (!persona) return null;

      return {
        metadata: {
          id: normalizedId,
          name: persona.name,
          description: persona.description,
          version: '1.0.0',
          lastModified: Date.now(),
          displayOrder: persona.displayOrder || 999,
          model: persona.model,
          chatLength: persona.chatLength,
          knowledgeBases: persona.knowledgeBases
        },
        systemPrompt: persona.systemPrompt,
        knowledgeBases: persona.knowledgeBases || [],
        customKnowledge: persona.customKnowledge || [],
        style: persona.style
      };
    } catch (error) {
      logger.error('Error getting persona store:', { error, id });
      return null;
    }
  }
}