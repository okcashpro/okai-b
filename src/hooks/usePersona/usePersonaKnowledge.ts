import { useMemo } from 'react';
import { knowledgeBases } from '../../config/knowledge';
import type { AIPersona } from '../../config/personas/types';

export function usePersonaKnowledge(currentPersona: AIPersona | null) {
  return useMemo(() => {
    if (!currentPersona) return [];

    const allTopics: string[] = [];
    
    // Add topics from each referenced knowledge base
    currentPersona.knowledgeBases?.forEach(baseName => {
      const base = knowledgeBases[baseName];
      if (base) {
        Object.values(base.topics).forEach(topics => {
          allTopics.push(...topics);
        });
      }
    });
    
    // Add custom knowledge if any
    if (currentPersona.customKnowledge) {
      allTopics.push(...currentPersona.customKnowledge);
    }
    
    return Array.from(new Set(allTopics));
  }, [currentPersona]);
}