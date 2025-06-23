import { InMemoryPersonaCache } from './cache';
import { PersonaDataValidator } from './validator';
import { PersonaSystemInitializer } from './initializer';
import { PersonaOperationsManager } from './operations';
import type { AIPersona } from '../../../config/personas/types';
import type { PersonaOperations } from './types';

class PersonaManager implements PersonaOperations {
  private static instance: PersonaManager;
  private operations: PersonaOperations;
  private initializer: PersonaSystemInitializer;

  private constructor() {
    const cache = new InMemoryPersonaCache();
    const validator = new PersonaDataValidator();
    this.operations = new PersonaOperationsManager(cache, validator);
    this.initializer = new PersonaSystemInitializer(this.operations);
  }

  static getInstance(): PersonaManager {
    if (!this.instance) {
      this.instance = new PersonaManager();
    }
    return this.instance;
  }

  // Initialize the system
  async initialize(): Promise<void> {
    await this.initializer.initialize();
  }

  // Delegate all operations to the operations manager
  getPersona(id: string) {
    return this.operations.getPersona(id);
  }

  savePersona(id: string, data: AIPersona) {
    return this.operations.savePersona(id, data);
  }

  listPersonas() {
    return this.operations.listPersonas();
  }

  deletePersona(id: string) {
    return this.operations.deletePersona(id);
  }

  getPersonaStore(id: string) {
    return this.operations.getPersonaStore(id);
  }
}

export const personaManager = PersonaManager.getInstance();