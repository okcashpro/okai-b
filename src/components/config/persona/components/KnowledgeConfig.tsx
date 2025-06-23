import React from 'react';
import type { PersonaStore } from '../../../../utils/personas/types';

interface KnowledgeConfigProps {
  store: PersonaStore;
  availableKnowledgeBases: string[];
  onChange: (store: PersonaStore) => void;
}

export function KnowledgeConfig({ store, availableKnowledgeBases, onChange }: KnowledgeConfigProps) {
  return (
    <div className="p-4 bg-black rounded-xl border border-emerald-950/30">
      <h4 className="font-medium text-white mb-4">Knowledge Configuration</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Knowledge Bases
          </label>
          <select
            multiple
            value={store.knowledgeBases}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              onChange({
                ...store,
                knowledgeBases: selected.includes('none') ? [] : selected
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 bg-black"
            size={5}
          >
            <option value="none" className="text-gray-400">No Knowledge Bases</option>
            {availableKnowledgeBases.map(kb => (
              <option key={kb} value={kb} className="text-white">{kb}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Select the knowledge bases this AI agent should have access to.
            Hold Ctrl/Cmd to select multiple. Select "No Knowledge Bases" to clear all selections.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Custom Knowledge (one per line)
          </label>
          <textarea
            value={store.customKnowledge.join('\n')}
            onChange={e => onChange({
              ...store,
              customKnowledge: e.target.value.split('\n').filter(k => k.trim())
            })}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={6}
            placeholder={`Example topics:
Software architecture patterns
Cloud infrastructure
DevOps practices
API design principles
Performance optimization
Security best practices`}
          />
        </div>
      </div>
    </div>
  );
}