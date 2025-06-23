import { logger } from '../../utils/logger';

const SELECTED_PERSONA_KEY = 'super_okai_selected_persona';

export function getStoredPersonaId(): string | null {
  try {
    const stored = localStorage.getItem(SELECTED_PERSONA_KEY);
    return stored ? JSON.parse(stored).toLowerCase() : null;
  } catch {
    return null;
  }
}

export function saveSelectedPersona(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(SELECTED_PERSONA_KEY, JSON.stringify(id.toLowerCase()));
    } else {
      localStorage.removeItem(SELECTED_PERSONA_KEY);
    }
  } catch (error) {
    logger.error('Error saving selected persona:', error);
  }
}