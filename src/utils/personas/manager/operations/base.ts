import type { AIPersona } from '../../../../config/personas/types';
import type { PersonaMetadata, PersonaStore } from '../../types';

export interface PersonaOperationsBase {
  getPersona(id: string): Promise<AIPersona | null>;
  savePersona(id: string, data: AIPersona): Promise<void>;
  listPersonas(): Promise<PersonaMetadata[]>;
  deletePersona(id: string): Promise<void>;
  getPersonaStore(id: string): Promise<PersonaStore | null>;
}