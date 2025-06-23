import { useState, useEffect } from 'react';
import { personaManager } from '../../../../utils/personas';
import { knowledgeManager } from '../../../../utils/knowledge';
import { restoreManager } from '../../../../utils/restore';
import type { PersonaStore } from '../../../../utils/personas';
import type { KnowledgeStore } from '../../../../utils/knowledge';

interface UseAIAgentsSpecsProps {
  onFeedback: (message: string) => void;
}

export function useAIAgentsSpecs({ onFeedback }: UseAIAgentsSpecsProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string | null>(null);
  const [personaStore, setPersonaStore] = useState<PersonaStore | null>(null);
  const [knowledgeStore, setKnowledgeStore] = useState<KnowledgeStore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load persona store when selected
  useEffect(() => {
    const loadPersonaStore = async () => {
      if (!selectedPersona) {
        setPersonaStore(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const store = await personaManager.getPersonaStore(selectedPersona);
        if (!store) {
          throw new Error('Persona not found');
        }
        setPersonaStore(store);
      } catch (error) {
        console.error('Error loading persona store:', error);
        setError('Failed to load AI agent');
        onFeedback('Failed to load AI agent');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPersonaStore();
  }, [selectedPersona, onFeedback]);

  // Load knowledge store when selected
  useEffect(() => {
    const loadKnowledgeStore = async () => {
      if (!selectedKnowledge) {
        setKnowledgeStore(null);
        return;
      }

      setIsLoading(true);

      try {
        const store = await knowledgeManager.getKnowledgeStore(selectedKnowledge);
        if (!store) {
          throw new Error('Knowledge base not found');
        }
        setKnowledgeStore(store);
      } catch (error) {
        console.error('Error loading knowledge store:', error);
        onFeedback('Failed to load knowledge base');
      } finally {
        setIsLoading(false);
      }
    };

    void loadKnowledgeStore();
  }, [selectedKnowledge, onFeedback]);

  // Listen for storage events to trigger updates
  useEffect(() => {
    const handleStorageChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSavePersona = async (store: PersonaStore) => {
    try {
      const persona = {
        name: store.metadata.name,
        description: store.metadata.description,
        systemPrompt: store.systemPrompt,
        knowledgeBases: store.knowledgeBases,
        customKnowledge: store.customKnowledge,
        displayOrder: store.metadata.displayOrder,
        chatLength: store.metadata.chatLength
      };

      await personaManager.savePersona(store.metadata.id, persona);
      onFeedback('AI agent saved successfully');
      setSelectedPersona(null);
    } catch (error) {
      console.error('Error saving persona:', error);
      onFeedback('Failed to save AI agent');
    }
  };

  const handleSaveKnowledge = async (store: KnowledgeStore) => {
    try {
      const kb = {
        name: store.metadata.name,
        topics: store.categories.reduce((acc, cat) => {
          acc[cat.name] = cat.topics;
          return acc;
        }, {} as Record<string, string[]>),
        prompts: store.prompts.reduce((acc, prompt) => {
          acc[prompt.name] = prompt.content;
          return acc;
        }, {} as Record<string, string>),
        sampleQA: store.qa.reduce((acc, qa) => {
          if (!acc[qa.category]) {
            acc[qa.category] = [];
          }
          acc[qa.category].push({
            question: qa.question,
            answer: qa.answer
          });
          return acc;
        }, {} as Record<string, { question: string; answer: string }[]>)
      };

      await knowledgeManager.saveKnowledgeBase(store.metadata.id, kb);
      onFeedback('Knowledge base saved successfully');
      setSelectedKnowledge(null);
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      onFeedback('Failed to save knowledge base');
    }
  };

  const handleRestorePersonas = async () => {
    try {
      await restoreManager.forceRestoreOriginalPersonas();
      onFeedback('Original AI agents restored successfully');
      setSelectedPersona(null);
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error restoring personas:', error);
      onFeedback('Failed to restore original AI agents');
    }
  };

  const handleRestoreKnowledge = async () => {
    try {
      await restoreManager.forceRestoreOriginalKnowledgeBases();
      onFeedback('Original knowledge bases restored successfully');
      setSelectedKnowledge(null);
      setForceUpdate(prev => prev + 1);
    } catch (error) {
      console.error('Error restoring knowledge bases:', error);
      onFeedback('Failed to restore original knowledge bases');
    }
  };

  return {
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
  };
}