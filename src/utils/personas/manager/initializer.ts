import { logger } from '../../logger';
import { originalPersonas } from '../../../config/backup/personas';
import type { PersonaOperations, PersonaInitializer } from './types';

export class PersonaSystemInitializer implements PersonaInitializer {
  constructor(private operations: PersonaOperations) {}

  async initialize(): Promise<void> {
    try {
      const current = await this.operations.listPersonas();
      
      if (current.length === 0) {
        await Promise.all(
          Object.entries(originalPersonas).map(([id, persona]) => 
            this.operations.savePersona(id, persona)
          )
        );
        logger.info('Initialized with original personas');
      }
    } catch (error) {
      logger.error('Error initializing personas:', error);
    }
  }
}