import { useCallback } from 'react';
import { personaManager } from '../../utils/personas';
import { logger } from '../../utils/logger';

interface KnowledgeManagerProps {
  selectedPersonaKey: string | null;
  onDataChange: () => void;
}

export function useKnowledgeManager({ selectedPersonaKey, onDataChange }: KnowledgeManagerProps) {
  const handleAddKnowledge = useCallback(async (knowledgeId: string) => {
    if (!selectedPersonaKey) return;

    try {
      const persona = await personaManager.getPersona(selectedPersonaKey);
      if (!persona) return;

      const existingKnowledgeBases = persona.knowledgeBases || [];
      if (!existingKnowledgeBases.includes(knowledgeId)) {
        await personaManager.savePersona(selectedPersonaKey, {
          ...persona,
          knowledgeBases: [...existingKnowledgeBases, knowledgeId]
        });
        onDataChange();
        logger.info('Added knowledge base:', { personaId: selectedPersonaKey, knowledgeId });
      }
    } catch (error) {
      logger.error('Error adding knowledge base:', error);
    }
  }, [selectedPersonaKey, onDataChange]);

  const handleRemoveKnowledge = useCallback(async (personaId: string, knowledgeId: string) => {
    try {
      const persona = await personaManager.getPersona(personaId);
      if (!persona) {
        logger.warn('Persona not found:', personaId);
        return;
      }

      const existingKnowledgeBases = persona.knowledgeBases || [];
      const updatedKnowledgeBases = existingKnowledgeBases.filter(id => id !== knowledgeId);

      // Only update if there's actually a change
      if (updatedKnowledgeBases.length !== existingKnowledgeBases.length) {
        await personaManager.savePersona(personaId, {
          ...persona,
          knowledgeBases: updatedKnowledgeBases
        });
        onDataChange();
        logger.info('Removed knowledge base:', { personaId, knowledgeId });
      }
    } catch (error) {
      logger.error('Error removing knowledge base:', error);
    }
  }, [onDataChange]);

  return { handleAddKnowledge, handleRemoveKnowledge };
}