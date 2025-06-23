import React from 'react';
import { Plus } from 'lucide-react';
import { AddButton } from './components/AddButton';
import { KnowledgeModal } from './components/KnowledgeModal';
import type { KnowledgeMetadata } from '../../../utils/knowledge';

interface KnowledgeSelectorProps {
  availableKnowledgeBases: KnowledgeMetadata[];
  onSelect: (knowledgeId: string) => void;
  onOpenSelector: () => void;
  isOpen: boolean;
}

export function KnowledgeSelector({ 
  availableKnowledgeBases, 
  onSelect, 
  onOpenSelector,
  isOpen 
}: KnowledgeSelectorProps) {
  if (availableKnowledgeBases.length === 0) return null;

  return (
    <div className="relative z-30" onClick={e => e.stopPropagation()}>
      <AddButton onClick={onOpenSelector} />
      {isOpen && (
        <KnowledgeModal
          knowledgeBases={availableKnowledgeBases}
          onSelect={onSelect}
          onClose={onOpenSelector}
        />
      )}
    </div>
  );
}