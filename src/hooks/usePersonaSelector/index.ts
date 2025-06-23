import { useEffect, useCallback } from 'react';
import { personaManager } from '../../utils/personas';
import { useChatFocus } from '../useChatFocus';
import { useDataLoader } from './useDataLoader';
import { useKnowledgeManager } from './useKnowledgeManager';
import { useSelectorState } from './useSelectorState';
import { logger } from '../../utils/logger';

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
  const [{ knowledgeBases, personas, isLoading, error }, loadData] = useDataLoader();
  const { 
    selectedPersonaKey,
    showKnowledgeSelector,
    handleOpenKnowledgeSelector,
    resetState
  } = useSelectorState();

  const { handleAddKnowledge, handleRemoveKnowledge } = useKnowledgeManager({
    selectedPersonaKey,
    onDataChange: loadData
  });

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      void loadData();
    } else {
      resetState();
    }
  }, [isOpen, loadData, resetState]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => void loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData]);

  const handlePersonaSelect = useCallback(async (personaKey: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.knowledge-controls') ||
      target.closest('.knowledge-selector')
    ) {
      return;
    }
    
    try {
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
      logger.error('Error selecting persona:', error);
    }
  }, [onPersonaChange, onClose, focusInput]);

  const handleKnowledgeRemove = useCallback((personaId: string, knowledgeId: string) => {
    void handleRemoveKnowledge(personaId, knowledgeId);
  }, [handleRemoveKnowledge]);

  return {
    knowledgeBases,
    personas,
    selectedPersonaKey,
    showKnowledgeSelector,
    isLoading,
    error,
    handlePersonaSelect,
    handleAddKnowledge,
    handleKnowledgeRemove,
    handleOpenKnowledgeSelector
  };
}