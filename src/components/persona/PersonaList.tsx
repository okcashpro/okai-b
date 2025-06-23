import React from 'react';
import { PersonaCard } from './PersonaCard';
import type { PersonaMetadata } from '../../utils/personas';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface PersonaListProps {
  personas: PersonaMetadata[];
  knowledgeBases: KnowledgeMetadata[];
  currentPersona: string;
  selectedPersonaKey: string | null;
  showKnowledgeSelector: boolean;
  onPersonaSelect: (personaKey: string, e: React.MouseEvent) => void;
  onAddKnowledge: (knowledgeId: string) => void;
  onRemoveKnowledge: (personaId: string, knowledgeId: string) => void;
  onOpenKnowledgeSelector: (personaKey: string) => void;
}

export function PersonaList({
  personas,
  knowledgeBases,
  currentPersona,
  selectedPersonaKey,
  showKnowledgeSelector,
  onPersonaSelect,
  onAddKnowledge,
  onRemoveKnowledge,
  onOpenKnowledgeSelector
}: PersonaListProps) {
  if (personas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No AI agents available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {personas.map(persona => (
        <PersonaCard
          key={persona.id}
          personaKey={persona.id}
          name={persona.name}
          description={persona.description}
          isSelected={currentPersona.toLowerCase() === persona.id.toLowerCase()}
          knowledgeBases={persona.knowledgeBases || []}
          allKnowledgeBases={knowledgeBases}
          showKnowledgeSelector={showKnowledgeSelector}
          selectedPersonaKey={selectedPersonaKey}
          onSelect={(e) => onPersonaSelect(persona.id, e)}
          onAddKnowledge={onAddKnowledge}
          onRemoveKnowledge={onRemoveKnowledge}
          onOpenKnowledgeSelector={() => onOpenKnowledgeSelector(persona.id)}
        />
      ))}
    </div>
  );
}