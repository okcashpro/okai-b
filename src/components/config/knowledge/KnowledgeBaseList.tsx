import React from 'react';
import { useKnowledgeList } from './hooks/useKnowledgeList';
import { CreateKnowledgeBase } from './CreateKnowledgeBase';
import { CreateButton } from './components/CreateButton';
import { KnowledgeCard } from './components/KnowledgeCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ConfirmDialog } from '../../common/ConfirmDialog';

interface KnowledgeBaseListProps {
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

export function KnowledgeBaseList({ onSelect, onFeedback }: KnowledgeBaseListProps) {
  const {
    knowledgeBases,
    isLoading,
    isCreating,
    deleteKnowledge,
    setIsCreating,
    setDeleteKnowledge,
    handleCreated,
    handleDelete
  } = useKnowledgeList({ onSelect, onFeedback });

  if (isCreating) {
    return (
      <CreateKnowledgeBase
        onCreated={handleCreated}
        onCancel={() => setIsCreating(false)}
        onFeedback={onFeedback}
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <CreateButton onClick={() => setIsCreating(true)} />

      {knowledgeBases.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {knowledgeBases.map(kb => (
            <KnowledgeCard
              key={kb.id}
              knowledge={kb}
              onSelect={() => onSelect(kb.id)}
              onDelete={() => setDeleteKnowledge(kb)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteKnowledge}
        title="Delete Knowledge Base"
        message={`Are you sure you want to delete ${deleteKnowledge?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteKnowledge(null)}
      />
    </div>
  );
}