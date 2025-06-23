import { useState, useEffect, useCallback, useMemo } from 'react';
import { personaManager } from '../utils/personas';
import { knowledgeBases } from '../config/knowledge';
import { fileLogger } from '../utils/fileLogger';
import { logger } from '../utils/logger';
import type { AIPersona } from '../config/personas/types';
import type { Message } from '../types';

// Storage key for selected persona
const SELECTED_PERSONA_KEY = 'super_okai_selected_persona';

function getStoredPersonaId(): string | null {
  try {
    const stored = localStorage.getItem(SELECTED_PERSONA_KEY);
    return stored ? JSON.parse(stored).toLowerCase() : null;
  } catch {
    return null;
  }
}

export function usePersona() {
  const [currentPersona, setCurrentPersona] = useState<AIPersona | null>(null);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(getStoredPersonaId());
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial persona
  useEffect(() => {
    const loadInitialPersona = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get list of available personas
        const availablePersonas = await personaManager.listPersonas();
        if (availablePersonas.length === 0) {
          // No personas available
          setCurrentPersona(null);
          setCurrentPersonaId(null);
          localStorage.removeItem(SELECTED_PERSONA_KEY);
          setIsLoading(false);
          return;
        }

        // Try to load stored persona
        const storedId = getStoredPersonaId();
        if (storedId) {
          const storedPersona = await personaManager.getPersona(storedId);
          if (storedPersona) {
            setCurrentPersona(storedPersona);
            setCurrentPersonaId(storedId);
            setIsLoading(false);
            return;
          }
        }

        // If stored persona not found or no stored ID, get first available persona
        const firstPersona = await personaManager.getPersona(availablePersonas[0].id);
        if (firstPersona) {
          setCurrentPersona(firstPersona);
          setCurrentPersonaId(availablePersonas[0].id);
          localStorage.setItem(SELECTED_PERSONA_KEY, JSON.stringify(availablePersonas[0].id));
        } else {
          // No valid personas found
          setCurrentPersona(null);
          setCurrentPersonaId(null);
          localStorage.removeItem(SELECTED_PERSONA_KEY);
        }

      } catch (error) {
        logger.error('Error loading initial persona:', error);
        setError('Failed to load AI agent');
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialPersona();
  }, []);

  // Watch for persona deletion and auto-select next available
  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      // Check if the change is related to deleted personas
      if (event.key === 'super_okai_deleted_personas') {
        try {
          // Get current deleted personas
          const deletedPersonas = await personaManager.getPersona(currentPersonaId || '');
          
          // If current persona was deleted
          if (!deletedPersonas && currentPersonaId) {
            // Get available personas
            const availablePersonas = await personaManager.listPersonas();
            
            if (availablePersonas.length > 0) {
              // Find next available persona
              const nextPersona = await personaManager.getPersona(availablePersonas[0].id);
              if (nextPersona) {
                // Update current persona
                setCurrentPersona(nextPersona);
                setCurrentPersonaId(availablePersonas[0].id);
                setCurrentMessages([]); // Clear messages
                localStorage.setItem(SELECTED_PERSONA_KEY, JSON.stringify(availablePersonas[0].id));
                return;
              }
            }
            
            // No personas available
            setCurrentPersona(null);
            setCurrentPersonaId(null);
            setCurrentMessages([]);
            localStorage.removeItem(SELECTED_PERSONA_KEY);
          }
        } catch (error) {
          logger.error('Error handling persona deletion:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentPersonaId]);

  // Load persona's conversation
  useEffect(() => {
    if (!currentPersona || !currentPersonaId) {
      setCurrentMessages([]);
      return;
    }

    const logs = fileLogger.getPersonaLogs(currentPersonaId);
    setCurrentMessages(logs?.messages || []);
  }, [currentPersona, currentPersonaId]);

  // Combine all knowledge for the current persona
  const currentKnowledge = useMemo(() => {
    if (!currentPersona) return [];

    const allTopics: string[] = [];
    
    // Add topics from each referenced knowledge base
    currentPersona.knowledgeBases?.forEach(baseName => {
      const base = knowledgeBases[baseName];
      if (base) {
        Object.values(base.topics).forEach(topics => {
          allTopics.push(...topics);
        });
      }
    });
    
    // Add custom knowledge if any
    if (currentPersona.customKnowledge) {
      allTopics.push(...currentPersona.customKnowledge);
    }
    
    return Array.from(new Set(allTopics));
  }, [currentPersona]);

  const changePersona = useCallback(async (personaKey: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Save current conversation before changing
      if (currentPersona && currentPersonaId && currentMessages.length > 0) {
        await fileLogger.logConversation(currentMessages, currentPersonaId);
      }

      // Get new persona
      const newPersona = await personaManager.getPersona(personaKey.toLowerCase());
      if (!newPersona) {
        // If requested persona not found, try to get another available persona
        const availablePersonas = await personaManager.listPersonas();
        if (availablePersonas.length > 0) {
          const fallbackPersona = await personaManager.getPersona(availablePersonas[0].id);
          if (fallbackPersona) {
            localStorage.setItem(SELECTED_PERSONA_KEY, JSON.stringify(availablePersonas[0].id));
            setCurrentPersona(fallbackPersona);
            setCurrentPersonaId(availablePersonas[0].id);
            setCurrentMessages([]);
            return;
          }
        }
        
        // No personas available
        localStorage.removeItem(SELECTED_PERSONA_KEY);
        setCurrentPersona(null);
        setCurrentPersonaId(null);
        setCurrentMessages([]);
        return;
      }

      // Save selected persona to localStorage
      localStorage.setItem(SELECTED_PERSONA_KEY, JSON.stringify(personaKey.toLowerCase()));
      setCurrentPersona(newPersona);
      setCurrentPersonaId(personaKey.toLowerCase());
      setCurrentMessages([]);
    } catch (error) {
      logger.error('Error changing persona:', error);
      setError('Failed to change AI agent');
    } finally {
      setIsLoading(false);
    }
  }, [currentPersona, currentMessages, currentPersonaId]);

  const sortedPersonaKeys = useMemo(async () => {
    try {
      const personas = await personaManager.listPersonas();
      return personas
        .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
        .map(p => p.id);
    } catch (error) {
      logger.error('Error getting persona keys:', error);
      return [];
    }
  }, []);

  return {
    currentPersona,
    currentMessages,
    setCurrentMessages,
    currentKnowledge,
    changePersona,
    availablePersonas: sortedPersonaKeys,
    isLoading,
    error,
    currentPersonaId
  };
}