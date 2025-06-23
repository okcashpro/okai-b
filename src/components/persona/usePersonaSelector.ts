import { useState, useEffect, useCallback } from 'react';
import { personaManager } from '../../utils/personas';
import { knowledgeManager } from '../../utils/knowledge';
import { restoreManager } from '../../utils/restore';
import { useChatFocus } from '../../hooks/useChatFocus';
import type { PersonaMetadata } from '../../utils/personas';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface UsePersonaSelectorProps {
  isOpen: boolean;
  currentPersona: string;
  onPersonaChange: (personaKey: string) => void;
  onClose: () => void;
}

export function usePersonaSelector({
  isOpen,
  currentPersona,
  onPersonaChange,
  onClose
}: UsePersonaSelectorProps) {
  const { focusInput } = useChatFocus();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeMetadata[]>([]);
  const [personas, setPersonas] = useState<PersonaMetadata[]>([]);
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string | null>(null);
  const [showKnowledgeSelector, setShowKnowledgeSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load knowledge bases
      const bases = await knowledgeManager.listKnowledgeBases();
      setKnowledgeBases(bases);

      // Load personas and sort by stored order
      const personaList = await personaManager.listPersonas();
      const sortedList = personaList.sort((a, b) => {
        const orderA = restoreManager.getPersonaOrder(a.id);
        const orderB = restoreManager.getPersonaOrder(b.id);
        return orderA - orderB;
      });
      setPersonas(sortedList);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load AI agents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadData();
    }
  }, [isOpen, loadData]);

  // Listen for storage changes to reload personas
  useEffect(() => {
    const handleStorageChange = () => {
      void loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  const handlePersonaSelect = useCallback(async (personaKey: string, e: React.MouseEvent) => {
    // Check if click was on knowledge controls
    const target = e.target as HTMLElement;
    if (
      target.closest('.knowledge-controls') ||
      target.closest('.knowledge-selector')
    ) {
      return;
    }
    
    try {
      // Verify persona exists before changing
      const persona = await personaManager.getPersona(personaKey);
      if (!persona) {
        throw new Error('Invalid persona');
      }

      onPersonaChange(personaKey);
      onClose();
      requestAnimationFrame(() => {
        focusInput();
      });
    } catch (error) {
      console.error('Error selecting persona:', error);
      setError('Failed to select AI agent');
    }
  }, [onPersonaChange, onClose, focusInput]);

  const handleAddKnowledge = useCallback((knowledgeId: string) => {
    // Handle knowledge base addition
    console.log('Add knowledge:', knowledgeId);
  }, []);

  const handleRemoveKnowledge = useCallback((knowledgeId: string) => {
    // Handle knowledge base removal
    console.log('Remove knowledge:', knowledgeId);
  }, []);

  const handleOpenKnowledgeSelector = useCallback(() => {
    setSelectedPersonaKey(currentPersona);
    setShowKnowledgeSelector(true);
  }, [currentPersona]);

  return {
    knowledgeBases,
    personas,
    selectedPersonaKey,
    showKnowledgeSelector,
    isLoading,
    error,
    handlePersonaSelect,
    handleAddKnowledge,
    handleRemoveKnowledge,
    handleOpenKnowledgeSelector
  };
}