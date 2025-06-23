import { useEffect } from 'react';
import { usePersonaLoader } from './usePersonaLoader';
import { usePersonaMessages } from './usePersonaMessages';
import { usePersonaKnowledge } from './usePersonaKnowledge';
import { usePersonaDeletion } from './usePersonaDeletion';
import { getStoredPersonaId } from './storage';

export function usePersona() {
  const [
    { currentPersona, currentPersonaId, isLoading, error },
    { loadInitialPersona, handlePersonaChange }
  ] = usePersonaLoader();

  const [currentMessages, setCurrentMessages] = usePersonaMessages(
    currentPersona,
    currentPersonaId
  );

  const currentKnowledge = usePersonaKnowledge(currentPersona);

  usePersonaDeletion({
    currentPersonaId,
    setCurrentPersona: (persona) => handlePersonaChange(persona?.id || ''),
    setCurrentPersonaId: (id) => id && handlePersonaChange(id),
    setMessages: setCurrentMessages
  });

  // Load initial persona
  useEffect(() => {
    const storedId = getStoredPersonaId();
    if (storedId) {
      void handlePersonaChange(storedId);
    } else {
      void loadInitialPersona();
    }
  }, [loadInitialPersona, handlePersonaChange]);

  return {
    currentPersona,
    currentMessages,
    setCurrentMessages,
    currentKnowledge,
    changePersona: handlePersonaChange,
    isLoading,
    error,
    currentPersonaId
  };
}