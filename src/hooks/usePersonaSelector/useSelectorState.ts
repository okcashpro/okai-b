import { useState, useCallback } from 'react';

export function useSelectorState() {
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string | null>(null);
  const [showKnowledgeSelector, setShowKnowledgeSelector] = useState(false);

  const handleOpenKnowledgeSelector = useCallback((personaKey: string) => {
    if (showKnowledgeSelector && selectedPersonaKey === personaKey) {
      setShowKnowledgeSelector(false);
      setSelectedPersonaKey(null);
    } else {
      setSelectedPersonaKey(personaKey);
      setShowKnowledgeSelector(true);
    }
  }, [showKnowledgeSelector, selectedPersonaKey]);

  const resetState = useCallback(() => {
    setShowKnowledgeSelector(false);
    setSelectedPersonaKey(null);
  }, []);

  return {
    selectedPersonaKey,
    showKnowledgeSelector,
    handleOpenKnowledgeSelector,
    resetState
  };
}