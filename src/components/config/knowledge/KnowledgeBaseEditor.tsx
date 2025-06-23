import React, { useState } from 'react';
import { EditorHeader } from './components/EditorHeader';
import { BasicInfo } from './components/BasicInfo';
import { CategoryEditor } from './components/CategoryEditor';
import { PromptEditor } from './components/PromptEditor';
import { QAEditor } from './components/QAEditor';
import { AlertModal } from '../../common/AlertModal';
import type { KnowledgeStore } from '../../../utils/knowledge';

interface KnowledgeBaseEditorProps {
  store: KnowledgeStore | null;
  isLoading: boolean;
  onSave: (store: KnowledgeStore) => void;
  onBack: () => void;
}

export function KnowledgeBaseEditor({ 
  store, 
  isLoading,
  onSave,
  onBack 
}: KnowledgeBaseEditorProps) {
  const [editedStore, setEditedStore] = useState<KnowledgeStore | null>(store);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  if (isLoading || !editedStore) {
    return (
      <div className="text-center py-8 text-gray-400">
        Loading knowledge base...
      </div>
    );
  }

  const handleSave = () => {
    if (!editedStore) return;

    // Validate required fields
    if (!editedStore.metadata.name.trim()) {
      setAlertMessage('Name is required');
      return;
    }

    // Validate knowledge data
    if (!editedStore.knowledgeData?.trim()) {
      setAlertMessage('Knowledge Details are required');
      return;
    }

    // Validate categories have topics
    if (!editedStore.categories.some(cat => cat.topics.length > 0)) {
      setAlertMessage('At least one category must have topics');
      return;
    }

    // Validate prompts have content
    if (!editedStore.prompts.some(prompt => prompt.content.trim())) {
      setAlertMessage('At least one prompt must have content');
      return;
    }

    // Create final store with all updates
    const updatedStore: KnowledgeStore = {
      ...editedStore,
      metadata: {
        ...editedStore.metadata,
        lastModified: Date.now(),
        categories: editedStore.categories.map(c => c.id),
        promptCount: editedStore.prompts.length,
        qaCount: editedStore.qa.length,
        knowledgeData: editedStore.knowledgeData // Preserve in metadata
      }
    };

    onSave(updatedStore);
  };

  const handleAddCategory = () => {
    setEditedStore(prev => {
      if (!prev) return prev;
      const newId = `category-${Date.now()}`;
      return {
        ...prev,
        categories: [...prev.categories, {
          id: newId,
          name: 'New Category',
          description: 'Category description',
          topics: []
        }]
      };
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setEditedStore(prev => {
      if (!prev) return prev;

      // Remove the category
      const updatedCategories = prev.categories.filter(c => c.id !== categoryId);

      // Update prompts and QAs to use the first available category
      const defaultCategory = updatedCategories[0]?.id || 'general';
      const updatedPrompts = prev.prompts.map(p => 
        p.category === categoryId ? { ...p, category: defaultCategory } : p
      );
      const updatedQA = prev.qa.map(q => 
        q.category === categoryId ? { ...q, category: defaultCategory } : q
      );

      return {
        ...prev,
        categories: updatedCategories,
        prompts: updatedPrompts,
        qa: updatedQA
      };
    });
  };

  const handleAddPrompt = () => {
    setEditedStore(prev => {
      if (!prev) return prev;
      const newId = `prompt-${Date.now()}`;
      return {
        ...prev,
        prompts: [...prev.prompts, {
          id: newId,
          name: 'New Prompt',
          content: '',
          category: prev.categories[0]?.id || 'general'
        }]
      };
    });
  };

  const handleRemovePrompt = (promptId: string) => {
    setEditedStore(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        prompts: prev.prompts.filter(p => p.id !== promptId)
      };
    });
  };

  const handleAddQA = () => {
    setEditedStore(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        qa: [...prev.qa, {
          id: `qa-${Date.now()}`,
          question: '',
          answer: '',
          category: prev.categories[0]?.id || 'general',
          tags: [],
          lastModified: Date.now()
        }]
      };
    });
  };

  const handleRemoveQA = (qaId: string) => {
    setEditedStore(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        qa: prev.qa.filter(q => q.id !== qaId)
      };
    });
  };

  return (
    <div className="space-y-6">
      <EditorHeader onBack={onBack} onSave={handleSave} />
      
      <BasicInfo
        store={editedStore}
        onChange={setEditedStore}
      />
      
      <CategoryEditor
        categories={editedStore.categories}
        onAdd={handleAddCategory}
        onRemove={handleRemoveCategory}
        onChange={categories => setEditedStore(prev => prev ? {
          ...prev,
          categories
        } : prev)}
      />
      
      <PromptEditor
        prompts={editedStore.prompts}
        categories={editedStore.categories}
        onAdd={handleAddPrompt}
        onRemove={handleRemovePrompt}
        onChange={prompts => setEditedStore(prev => prev ? {
          ...prev,
          prompts
        } : prev)}
      />
      
      <QAEditor
        qa={editedStore.qa}
        categories={editedStore.categories}
        onAdd={handleAddQA}
        onRemove={handleRemoveQA}
        onChange={qa => setEditedStore(prev => prev ? {
          ...prev,
          qa
        } : prev)}
      />

      <AlertModal
        isOpen={!!alertMessage}
        message={alertMessage || ''}
        onClose={() => setAlertMessage(null)}
      />
    </div>
  );
}