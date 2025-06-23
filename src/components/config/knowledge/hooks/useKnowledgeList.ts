import { useState, useEffect, useCallback } from 'react';
import { knowledgeManager } from '../../../../utils/knowledge';
import { logger } from '../../../../utils/logger';
import type { KnowledgeMetadata } from '../../../../utils/knowledge';

interface UseKnowledgeListProps {
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

export function useKnowledgeList({ onSelect, onFeedback }: UseKnowledgeListProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteKnowledge, setDeleteKnowledge] = useState<KnowledgeMetadata | null>(null);

  const loadKnowledgeBases = useCallback(async () => {
    try {
      const bases = await knowledgeManager.listKnowledgeBases();
      setKnowledgeBases(bases);
    } catch (error) {
      logger.error('Error loading knowledge bases:', error);
      onFeedback('Failed to load knowledge bases');
    } finally {
      setIsLoading(false);
    }
  }, [onFeedback]);

  useEffect(() => {
    void loadKnowledgeBases();
  }, [loadKnowledgeBases]);

  // Listen for storage changes to reload knowledge bases
  useEffect(() => {
    const handleStorageChange = () => {
      void loadKnowledgeBases();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadKnowledgeBases]);

  const handleCreated = useCallback(async (id: string) => {
    setIsCreating(false);
    await loadKnowledgeBases();
    onSelect(id);
  }, [loadKnowledgeBases, onSelect]);

  const handleDelete = useCallback(async () => {
    if (!deleteKnowledge) return;

    try {
      await knowledgeManager.deleteKnowledgeBase(deleteKnowledge.id);
      onFeedback('Knowledge base deleted successfully');
      await loadKnowledgeBases();
    } catch (error) {
      logger.error('Error deleting knowledge base:', error);
      onFeedback('Failed to delete knowledge base');
    } finally {
      setDeleteKnowledge(null);
    }
  }, [deleteKnowledge, loadKnowledgeBases, onFeedback]);

  return {
    knowledgeBases,
    isLoading,
    isCreating,
    deleteKnowledge,
    setIsCreating,
    setDeleteKnowledge,
    handleCreated,
    handleDelete
  };
}