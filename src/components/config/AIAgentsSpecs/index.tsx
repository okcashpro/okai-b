import React from 'react';
import { useAIAgentsSpecs } from './hooks/useAIAgentsSpecs';
import { PersonaSection } from './sections/PersonaSection';
import { KnowledgeSection } from './sections/KnowledgeSection';

interface AIAgentsSpecsProps {
  onFeedback: (message: string) => void;
}

export function AIAgentsSpecs({ onFeedback }: AIAgentsSpecsProps) {
  const {
    selectedPersona,
    selectedKnowledge,
    personaStore,
    knowledgeStore,
    isLoading,
    error,
    handleSavePersona,
    handleSaveKnowledge,
    handleRestorePersonas,
    handleRestoreKnowledge,
    setSelectedPersona,
    setSelectedKnowledge
  } = useAIAgentsSpecs({ onFeedback });

  return (
    <div className="space-y-12">
      {/* AI Agents Section */}
      <PersonaSection
        selectedPersona={selectedPersona}
        personaStore={personaStore}
        isLoading={isLoading}
        error={error}
        onSave={handleSavePersona}
        onRestore={handleRestorePersonas}
        onSelect={setSelectedPersona}
        onFeedback={onFeedback}
      />

      {/* Knowledge Bases Section */}
      <KnowledgeSection
        selectedKnowledge={selectedKnowledge}
        knowledgeStore={knowledgeStore}
        isLoading={isLoading}
        onSave={handleSaveKnowledge}
        onRestore={handleRestoreKnowledge}
        onSelect={setSelectedKnowledge}
        onFeedback={onFeedback}
      />
    </div>
  );
}