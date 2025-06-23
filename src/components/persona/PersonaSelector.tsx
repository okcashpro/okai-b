import React from 'react';
import { PersonaSelectorModal } from './PersonaSelectorModal';
import { usePersonaSelector } from '../../hooks/usePersonaSelector';

interface PersonaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: string;
  onPersonaChange: (personaKey: string) => void;
}

export function PersonaSelector({ 
  isOpen, 
  onClose, 
  currentPersona, 
  onPersonaChange 
}: PersonaSelectorProps) {
  const {
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
  } = usePersonaSelector({
    isOpen,
    currentPersona,
    onPersonaChange,
    onClose
  });

  if (!isOpen) return null;

  return (
    <PersonaSelectorModal
      personas={personas}
      knowledgeBases={knowledgeBases}
      selectedPersonaKey={selectedPersonaKey}
      showKnowledgeSelector={showKnowledgeSelector}
      isLoading={isLoading}
      error={error}
      currentPersona={currentPersona}
      onClose={onClose}
      onPersonaSelect={handlePersonaSelect}
      onAddKnowledge={handleAddKnowledge}
      onRemoveKnowledge={handleKnowledgeRemove}
      onOpenKnowledgeSelector={handleOpenKnowledgeSelector}
    />
  );
}