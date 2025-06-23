import { logger } from '../logger';
import { knowledgeValidator } from './validator';
import type { KnowledgeBase } from '../../config/knowledge/types';
import type { KnowledgeExporter } from './types';

class JSONExporter implements KnowledgeExporter {
  exportToJSON(knowledgeBase: KnowledgeBase): string {
    try {
      return JSON.stringify(knowledgeBase, null, 2);
    } catch (error) {
      logger.error('Error exporting knowledge base:', error);
      throw new Error('Failed to export knowledge base');
    }
  }

  importFromJSON(json: string): KnowledgeBase {
    try {
      const data = JSON.parse(json);
      return knowledgeValidator.validateKnowledgeBase(data);
    } catch (error) {
      logger.error('Error importing knowledge base:', error);
      throw new Error('Failed to import knowledge base');
    }
  }
}

export const knowledgeExporter = new JSONExporter();