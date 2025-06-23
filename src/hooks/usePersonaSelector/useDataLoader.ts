import { useState, useCallback } from 'react';
import { personaManager } from '../../utils/personas';
import { knowledgeManager } from '../../utils/knowledge';
import { restoreManager } from '../../utils/restore';
import type { PersonaMetadata } from '../../utils/personas';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface DataLoaderState {
  knowledgeBases: KnowledgeMetadata[];
  personas: PersonaMetadata[];
  isLoading: boolean;
  error: string | null;
}

export function useDataLoader(): [DataLoaderState, () => Promise<void>] {
  const [state, setState] = useState<DataLoaderState>({
    knowledgeBases: [],
    personas: [],
    isLoading: true,
    error: null
  });

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Load knowledge bases
      const bases = await knowledgeManager.listKnowledgeBases();

      // Load personas and sort by stored order
      const personaList = await personaManager.listPersonas();
      const sortedList = personaList.sort((a, b) => {
        const orderA = restoreManager.getPersonaOrder(a.id);
        const orderB = restoreManager.getPersonaOrder(b.id);
        return orderA - orderB;
      });

      setState({
        knowledgeBases: bases,
        personas: sortedList,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load AI agents'
      }));
    }
  }, []);

  return [state, loadData];
}