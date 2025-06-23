import React, { useState, useEffect } from 'react';
import { knowledgeManager } from '../../../utils/knowledge';
import { EditorHeader } from './components/EditorHeader';
import { BasicInfo } from './components/BasicInfo';
import { SystemPrompt } from './components/SystemPrompt';
import { KnowledgeConfig } from './components/KnowledgeConfig';
import { StyleConfig } from './components/StyleConfig';
import type { PersonaStore } from '../../../utils/personas/types';

interface PersonaEditorProps {
  store: PersonaStore | null;
  isLoading: boolean;
  onSave: (store: PersonaStore) => void;
  onBack: () => void;
}

export function PersonaEditor({ 
  store, 
  isLoading,
  onSave,
  onBack 
}: PersonaEditorProps) {
  const [editedStore, setEditedStore] = useState<PersonaStore | null>(store);
  const [availableKnowledgeBases, setAvailableKnowledgeBases] = useState<string[]>([]);

  // Load available knowledge bases
  useEffect(() => {
    const loadKnowledgeBases = async () => {
      try {
        const bases = await knowledgeManager.listKnowledgeBases();
        setAvailableKnowledgeBases(bases.map(kb => kb.id));
      } catch (error) {
        console.error('Error loading knowledge bases:', error);
      }
    };
    void loadKnowledgeBases();
  }, []);

  // Update editedStore when store prop changes
  useEffect(() => {
    setEditedStore(store);
  }, [store]);

  if (isLoading || !editedStore) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading AI agent...
      </div>
    );
  }

  const handleSave = () => {
    if (editedStore) {
      onSave(editedStore);
    }
  };

  return (
    <div className="space-y-6">
      <EditorHeader onBack={onBack} onSave={handleSave} />
      
      <BasicInfo 
        store={editedStore} 
        onChange={setEditedStore}
      />
      
      <SystemPrompt 
        store={editedStore} 
        onChange={setEditedStore}
      />
      
      <KnowledgeConfig 
        store={editedStore}
        availableKnowledgeBases={availableKnowledgeBases}
        onChange={setEditedStore}
      />
      
      <StyleConfig 
        store={editedStore} 
        onChange={setEditedStore} 
      />
    </div>
  );
}