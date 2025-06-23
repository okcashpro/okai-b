import React from 'react';
import { KnowledgeBaseEditor } from '../../knowledge/KnowledgeBaseEditor';
import { KnowledgeBaseList } from '../../knowledge/KnowledgeBaseList';
import { RestoreButton } from '../../../common/RestoreButton';
import type { KnowledgeStore } from '../../../../utils/knowledge';

interface KnowledgeSectionProps {
  selectedKnowledge: string | null;
  knowledgeStore: KnowledgeStore | null;
  isLoading: boolean;
  onSave: (store: KnowledgeStore) => void;
  onRestore: () => Promise<void>;
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

export function KnowledgeSection({
  selectedKnowledge,
  knowledgeStore,
  isLoading,
  onSave,
  onRestore,
  onSelect,
  onFeedback
}: KnowledgeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Knowledge Bases</h3>
        <RestoreButton
          onRestore={onRestore}
          type="knowledge"
        />
      </div>
      
      {selectedKnowledge && knowledgeStore ? (
        <KnowledgeBaseEditor
          store={knowledgeStore}
          isLoading={isLoading}
          onSave={onSave}
          onBack={() => onSelect('')}
        />
      ) : (
        <KnowledgeBaseList
          onSelect={onSelect}
          onFeedback={onFeedback}
        />
      )}
    </div>
  );
}