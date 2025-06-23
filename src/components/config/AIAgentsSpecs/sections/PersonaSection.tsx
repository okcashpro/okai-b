import React from 'react';
import { PersonaEditor } from '../../persona/PersonaEditor';
import { PersonaList } from '../../persona/PersonaList';
import { RestoreButton } from '../../../common/RestoreButton';
import type { PersonaStore } from '../../../../utils/personas';

interface PersonaSectionProps {
  selectedPersona: string | null;
  personaStore: PersonaStore | null;
  isLoading: boolean;
  error: string | null;
  onSave: (store: PersonaStore) => void;
  onRestore: () => Promise<void>;
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

export function PersonaSection({
  selectedPersona,
  personaStore,
  isLoading,
  error,
  onSave,
  onRestore,
  onSelect,
  onFeedback
}: PersonaSectionProps) {
  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">AI Agents</h3>
        <div className="text-center py-8 text-red-400">
          {error}
          <button
            onClick={() => onSelect('')}
            className="block mx-auto mt-4 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Return to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">AI Agents</h3>
        <RestoreButton
          onRestore={onRestore}
          type="personas"
        />
      </div>
      
      {selectedPersona && personaStore ? (
        <PersonaEditor
          store={personaStore}
          isLoading={isLoading}
          onSave={onSave}
          onBack={() => onSelect('')}
        />
      ) : (
        <PersonaList
          onSelect={onSelect}
          onFeedback={onFeedback}
        />
      )}
    </div>
  );
}