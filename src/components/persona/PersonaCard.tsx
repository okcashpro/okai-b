import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { KnowledgeTag } from './KnowledgeTag';
import { KnowledgeSelector } from './knowledge/KnowledgeSelector';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface PersonaCardProps {
  personaKey: string;
  name: string;
  description: string;
  isSelected: boolean;
  knowledgeBases: string[];
  allKnowledgeBases: KnowledgeMetadata[];
  showKnowledgeSelector: boolean;
  selectedPersonaKey: string | null;
  onSelect: (e: React.MouseEvent) => void;
  onAddKnowledge: (knowledgeId: string) => void;
  onRemoveKnowledge: (personaId: string, knowledgeId: string) => void;
  onOpenKnowledgeSelector: () => void;
}

export function PersonaCard({
  personaKey,
  name,
  description,
  isSelected,
  knowledgeBases,
  allKnowledgeBases,
  showKnowledgeSelector,
  selectedPersonaKey,
  onSelect,
  onAddKnowledge,
  onRemoveKnowledge,
  onOpenKnowledgeSelector
}: PersonaCardProps) {
  const personaKnowledgeBases = knowledgeBases || [];
  const availableKnowledgeBases = allKnowledgeBases.filter(
    kb => !personaKnowledgeBases.includes(kb.id)
  );

  const handleRemoveKnowledge = (knowledgeId: string) => {
    onRemoveKnowledge(personaKey, knowledgeId);
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative w-full text-left bg-black rounded-xl transition-all duration-200 border cursor-pointer
        ${isSelected
          ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
          : 'border-emerald-950/30 hover:border-emerald-500/20'}`}
    >
      {/* Hover Effect Layer */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 
                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                    pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10 p-4">
        {/* Persona Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              {name}
              {isSelected && (
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              )}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {description}
            </p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
            ${isSelected
              ? 'border-emerald-500 bg-emerald-500/20' 
              : 'border-emerald-950/30 group-hover:border-emerald-500/20'}`}
          >
            {isSelected && (
              <Check className="h-3 w-3 text-emerald-400" />
            )}
          </div>
        </div>

        {/* Knowledge Base Tags */}
        <div className="knowledge-controls flex flex-wrap gap-2 items-center mt-3 relative z-20">
          {personaKnowledgeBases.map(kbId => {
            const kb = allKnowledgeBases.find(b => b.id === kbId);
            if (!kb) return null;

            return (
              <KnowledgeTag
                key={kb.id}
                knowledge={kb}
                onRemove={() => handleRemoveKnowledge(kb.id)}
              />
            );
          })}
          
          <KnowledgeSelector
            availableKnowledgeBases={availableKnowledgeBases}
            onSelect={onAddKnowledge}
            onOpenSelector={onOpenKnowledgeSelector}
            isOpen={showKnowledgeSelector && selectedPersonaKey === personaKey}
          />
        </div>
      </div>
    </div>
  );
}