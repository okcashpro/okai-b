import { useState, useCallback } from 'react';
import { personaManager } from '../../utils/personas';
import { logger } from '../../utils/logger';
import { saveSelectedPersona } from './storage';
import type { AIPersona } from '../../config/personas/types';

interface PersonaLoaderState {
  currentPersona: AIPersona | null;
  currentPersonaId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface PersonaLoaderActions {
  loadInitialPersona: () => Promise<void>;
  handlePersonaChange: (personaKey: string) => Promise<void>;
}

export function usePersonaLoader(): [PersonaLoaderState, PersonaLoaderActions] {
  const [state, setState] = useState<PersonaLoaderState>({
    currentPersona: null,
    currentPersonaId: null,
    isLoading: true,
    error: null
  });

  const loadInitialPersona = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const availablePersonas = await personaManager.listPersonas();
      if (availablePersonas.length === 0) {
        setState(prev => ({
          ...prev,
          currentPersona: null,
          currentPersonaId: null,
          isLoading: false
        }));
        saveSelectedPersona(null);
        return;
      }

      const firstPersona = await personaManager.getPersona(availablePersonas[0].id);
      if (firstPersona) {
        setState(prev => ({
          ...prev,
          currentPersona: firstPersona,
          currentPersonaId: availablePersonas[0].id,
          isLoading: false
        }));
        saveSelectedPersona(availablePersonas[0].id);
      } else {
        setState(prev => ({
          ...prev,
          currentPersona: null,
          currentPersonaId: null,
          isLoading: false
        }));
        saveSelectedPersona(null);
      }
    } catch (error) {
      logger.error('Error loading initial persona:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load AI agent',
        isLoading: false
      }));
    }
  }, []);

  const handlePersonaChange = useCallback(async (personaKey: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const newPersona = await personaManager.getPersona(personaKey.toLowerCase());
      if (!newPersona) {
        const availablePersonas = await personaManager.listPersonas();
        if (availablePersonas.length > 0) {
          const fallbackPersona = await personaManager.getPersona(availablePersonas[0].id);
          if (fallbackPersona) {
            setState(prev => ({
              ...prev,
              currentPersona: fallbackPersona,
              currentPersonaId: availablePersonas[0].id,
              isLoading: false
            }));
            saveSelectedPersona(availablePersonas[0].id);
            return;
          }
        }
        
        setState(prev => ({
          ...prev,
          currentPersona: null,
          currentPersonaId: null,
          isLoading: false
        }));
        saveSelectedPersona(null);
        return;
      }

      setState(prev => ({
        ...prev,
        currentPersona: newPersona,
        currentPersonaId: personaKey.toLowerCase(),
        isLoading: false
      }));
      saveSelectedPersona(personaKey.toLowerCase());
    } catch (error) {
      logger.error('Error changing persona:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to change AI agent',
        isLoading: false
      }));
    }
  }, []);

  return [
    state,
    { loadInitialPersona, handlePersonaChange }
  ];
}