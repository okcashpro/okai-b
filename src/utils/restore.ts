import { originalKnowledgeBases } from '../config/backup/knowledge';
import { originalPersonas } from '../config/backup/personas';
import { knowledgeManager } from './knowledge';
import { personaManager } from './personas';
import { personaStorage } from './personas/storage';
import { knowledgeStorage } from './knowledge/storage';
import { logger } from './logger';

class RestoreManager {
  private static instance: RestoreManager;
  private readonly orderStorageKey = 'super_okai_persona_order';

  private constructor() {}

  static getInstance(): RestoreManager {
    if (!this.instance) {
      this.instance = new RestoreManager();
    }
    return this.instance;
  }

  // Get stored display orders
  private getStoredOrders(): Map<string, number> {
    try {
      const stored = localStorage.getItem(this.orderStorageKey);
      return stored ? new Map(JSON.parse(stored)) : new Map();
    } catch (error) {
      logger.error('Error reading stored orders:', error);
      return new Map();
    }
  }

  // Save display orders
  private saveOrders(orders: Map<string, number>): void {
    try {
      localStorage.setItem(
        this.orderStorageKey, 
        JSON.stringify(Array.from(orders.entries()))
      );
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      logger.error('Error saving orders:', error);
    }
  }

  async forceRestoreOriginalPersonas(): Promise<void> {
    try {
      // Get current personas to preserve custom ones and display orders
      const current = await personaManager.listPersonas();
      const displayOrders = new Map(
        current.map(p => [p.id, p.displayOrder || 999])
      );

      // Identify custom personas (not in original backup)
      const customPersonas = current.filter(
        p => !originalPersonas[p.id as keyof typeof originalPersonas]
      );

      // Clear deleted personas list to ensure all originals are restored
      await personaStorage.clearDeletedPersonas();

      // Force restore each original persona in parallel
      await Promise.all(
        Object.entries(originalPersonas).map(async ([id, persona]) => {
          try {
            // Preserve display order if exists, otherwise use original
            const displayOrder = displayOrders.get(id) || persona.displayOrder || 999;
            
            await personaManager.savePersona(id, {
              ...persona,
              displayOrder
            });

            logger.info(`Restored persona: ${persona.name}`);
          } catch (error) {
            logger.error(`Error restoring persona ${id}:`, error);
            throw error;
          }
        })
      );

      // Restore custom personas
      await Promise.all(
        customPersonas.map(async (persona) => {
          try {
            const customPersona = await personaManager.getPersona(persona.id);
            if (customPersona) {
              await personaManager.savePersona(persona.id, customPersona);
              logger.info(`Preserved custom persona: ${persona.name}`);
            }
          } catch (error) {
            logger.error(`Error preserving custom persona ${persona.id}:`, error);
          }
        })
      );

      // Trigger storage event to update UI
      window.dispatchEvent(new Event('storage'));

      logger.info('All personas restored successfully');
    } catch (error) {
      logger.error('Error force restoring personas:', error);
      throw error;
    }
  }

  async forceRestoreOriginalKnowledgeBases(): Promise<void> {
    try {
      // Get current knowledge bases to preserve custom ones
      const current = await knowledgeManager.listKnowledgeBases();
      
      // Identify custom knowledge bases (not in original backup)
      const customKnowledge = current.filter(
        kb => !originalKnowledgeBases[kb.id]
      );

      // Clear deleted knowledge bases list
      await knowledgeStorage.clearDeletedItems();

      // Force restore each original knowledge base in parallel
      await Promise.all(
        Object.entries(originalKnowledgeBases).map(async ([id, kb]) => {
          try {
            // Get existing knowledge base to preserve any custom data
            const existing = await knowledgeManager.getKnowledgeBase(id);
            
            await knowledgeManager.saveKnowledgeBase(id, {
              ...kb,
              // Preserve existing knowledgeData if available
              knowledgeData: existing?.knowledgeData || kb.knowledgeData || ''
            });
            
            logger.info(`Restored knowledge base: ${kb.name}`);
          } catch (error) {
            logger.error(`Error restoring knowledge base ${id}:`, error);
            throw error;
          }
        })
      );

      // Restore custom knowledge bases
      await Promise.all(
        customKnowledge.map(async (kb) => {
          try {
            const customKb = await knowledgeManager.getKnowledgeBase(kb.id);
            if (customKb) {
              await knowledgeManager.saveKnowledgeBase(kb.id, customKb);
              logger.info(`Preserved custom knowledge base: ${kb.name}`);
            }
          } catch (error) {
            logger.error(`Error preserving custom knowledge base ${kb.id}:`, error);
          }
        })
      );

      logger.info('All knowledge bases restored successfully');
    } catch (error) {
      logger.error('Error force restoring knowledge bases:', error);
      throw error;
    }
  }

  // Update persona display orders
  async updatePersonaOrders(orders: Map<string, number>): Promise<void> {
    try {
      // Save orders immediately
      this.saveOrders(orders);

      // Update each persona with its new order
      await Promise.all(
        Array.from(orders.entries()).map(async ([id, order]) => {
          try {
            const persona = await personaManager.getPersona(id);
            if (persona) {
              await personaManager.savePersona(id, {
                ...persona,
                displayOrder: order
              });
            }
          } catch (error) {
            logger.error(`Error updating persona ${id} order:`, error);
          }
        })
      );

      logger.info('Persona orders updated successfully');
    } catch (error) {
      logger.error('Error updating persona orders:', error);
      throw error;
    }
  }

  // Get current persona order
  getPersonaOrder(personaId: string): number {
    const orders = this.getStoredOrders();
    return orders.get(personaId) ?? 999;
  }
}

export const restoreManager = RestoreManager.getInstance();