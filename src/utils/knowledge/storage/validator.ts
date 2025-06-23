import { logger } from '../../logger';
import type { KnowledgeBase } from '../../../config/knowledge/types';
import type { KnowledgeMetadata } from '../types';
import type { KnowledgeValidator } from './types';

export class KnowledgeBaseValidator implements KnowledgeValidator {
  validateKnowledgeBase(data: unknown): data is KnowledgeBase {
    try {
      if (!data || typeof data !== 'object') {
        logger.debug('Invalid knowledge base data structure');
        return false;
      }

      const kb = data as Partial<KnowledgeBase>;
      
      // Required fields must exist and be valid
      if (
        typeof kb.name !== 'string' ||
        !kb.name.trim() ||
        !kb.topics ||
        typeof kb.topics !== 'object' ||
        !kb.prompts ||
        typeof kb.prompts !== 'object' ||
        typeof kb.knowledgeData !== 'string' || // Required field
        !kb.knowledgeData.trim() // Must not be empty
      ) {
        logger.debug('Missing or invalid required fields in knowledge base');
        return false;
      }

      // Topics must be a record of string arrays
      for (const topics of Object.values(kb.topics)) {
        if (!Array.isArray(topics) || !topics.every(t => typeof t === 'string' && t.trim())) {
          logger.debug('Invalid topics format');
          return false;
        }
      }

      // Prompts must be a record of strings
      for (const prompt of Object.values(kb.prompts)) {
        if (typeof prompt !== 'string' || !prompt.trim()) {
          logger.debug('Invalid prompts format');
          return false;
        }
      }

      // Optional sampleQA must be valid if present
      if (kb.sampleQA) {
        if (typeof kb.sampleQA !== 'object') {
          logger.debug('Invalid sampleQA format');
          return false;
        }

        for (const qaList of Object.values(kb.sampleQA)) {
          if (!Array.isArray(qaList)) {
            logger.debug('Invalid QA list format');
            return false;
          }

          for (const qa of qaList) {
            if (
              !qa ||
              typeof qa !== 'object' ||
              typeof qa.question !== 'string' ||
              !qa.question.trim() ||
              typeof qa.answer !== 'string' ||
              !qa.answer.trim()
            ) {
              logger.debug('Invalid QA item format');
              return false;
            }
          }
        }
      }

      return true;
    } catch (error) {
      logger.error('Error validating knowledge base:', error);
      return false;
    }
  }

  validateMetadata(data: unknown): data is KnowledgeMetadata {
    try {
      if (!data || typeof data !== 'object') {
        logger.debug('Invalid metadata object');
        return false;
      }

      const metadata = data as Partial<KnowledgeMetadata>;

      const isValid = !!(
        typeof metadata.id === 'string' &&
        typeof metadata.name === 'string' &&
        typeof metadata.description === 'string' &&
        typeof metadata.version === 'string' &&
        typeof metadata.lastModified === 'number' &&
        Array.isArray(metadata.categories) &&
        typeof metadata.promptCount === 'number' &&
        typeof metadata.qaCount === 'number'
      );

      if (!isValid) {
        logger.debug('Missing required metadata fields');
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error validating metadata:', error);
      return false;
    }
  }
}