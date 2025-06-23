import React from 'react';
import { X, Bot } from 'lucide-react';
import { PersonaList } from './PersonaList';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import type { PersonaMetadata } from '../../utils/personas';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface PersonaSelectorModalProps {
  personas: PersonaMetadata[];
  knowledgeBases: KnowledgeMetadata[];
  selectedPersonaKey: string | null;
  showKnowledgeSelector: boolean;
  isLoading: boolean;
  error: string | null;
  currentPersona: string;
  onClose: () => void;
  onPersonaSelect: (personaKey: string, e: React.MouseEvent) => void;
  onAddKnowledge: (knowledgeId: string) => void;
  onRemoveKnowledge: (personaId: string, knowledgeId: string) => void;
  onOpenKnowledgeSelector: (personaKey: string) => void;
}

export function PersonaSelectorModal({
  personas,
  knowledgeBases,
  selectedPersonaKey,
  showKnowledgeSelector,
  isLoading,
  error,
  currentPersona,
  onClose,
  onPersonaSelect,
  onAddKnowledge,
  onRemoveKnowledge,
  onOpenKnowledgeSelector
}: PersonaSelectorModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl shadow-xl w-full max-w-lg border border-emerald-950/30 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-none flex items-center justify-between p-4 border-b border-emerald-950/30">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-400" />
            Select AI Agent
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-emerald-950/20 p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {error ? (
            <ErrorState error={error} />
          ) : isLoading ? (
            <LoadingState />
          ) : (
            <PersonaList
              personas={personas}
              knowledgeBases={knowledgeBases}
              currentPersona={currentPersona}
              selectedPersonaKey={selectedPersonaKey}
              showKnowledgeSelector={showKnowledgeSelector}
              onPersonaSelect={onPersonaSelect}
              onAddKnowledge={onAddKnowledge}
              onRemoveKnowledge={onRemoveKnowledge}
              onOpenKnowledgeSelector={onOpenKnowledgeSelector}
            />
          )}
        </div>
      </div>
    </div>
  );
}