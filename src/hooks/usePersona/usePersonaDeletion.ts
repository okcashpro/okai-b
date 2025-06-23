import { useEffect } from 'react';
import { personaManager } from '../../utils/personas';
import { logger } from '../../utils/logger';
import { saveSelectedPersona } from './storage';

interface PersonaDeletionHandlerProps {
  currentPersonaId: string | null;
  setCurrentPersona: (persona: any) => void;
  setCurrentPersonaId: (id: string | null) => void;
  setMessages: (messages: any[]) => void;
}

export function usePersonaDeletion({
  currentPersonaId,
  setCurrentPersona,
  setCurrentPersonaId,
  setMessages
}: PersonaDeletionHandlerProps) {
  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === 'super_okai_deleted_personas') {
        try {
          if (!currentPersonaId) return;

          const deletedPersonas = await personaManager.getPersona(currentPersonaId);
          
          if (!deletedPersonas) {
            const availablePersonas = await personaManager.listPersonas();
            
            if (availablePersonas.length > 0) {
              const nextPersona = await personaManager.getPersona(availablePersonas[0].id);
              if (nextPersona) {
                setCurrentPersona(nextPersona);
                setCurrentPersonaId(availablePersonas[0].id);
                setMessages([]);
                saveSelectedPersona(availablePersonas[0].id);
                return;
              }
            }
            
            setCurrentPersona(null);
            setCurrentPersonaId(null);
            setMessages([]);
            saveSelectedPersona(null);
          }
        } catch (error) {
          logger.error('Error handling persona deletion:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentPersonaId, setCurrentPersona, setCurrentPersonaId, setMessages]);
}