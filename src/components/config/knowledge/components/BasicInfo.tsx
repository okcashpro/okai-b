import React from 'react';
import type { KnowledgeStore } from '../../../../utils/knowledge';

interface BasicInfoProps {
  store: KnowledgeStore;
  onChange: (store: KnowledgeStore) => void;
}

export function BasicInfo({ store, onChange }: BasicInfoProps) {
  return (
    <div className="p-4 bg-black rounded-xl border border-emerald-950/30">
      <h4 className="font-medium text-white mb-4">Basic Information</h4>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={store.metadata.name}
            onChange={e => onChange({
              ...store,
              metadata: { ...store.metadata, name: e.target.value }
            })}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30"
            placeholder="e.g., Web Development, Machine Learning, Project Management"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Knowledge Details <span className="text-red-500">*</span>
          </label>
          <textarea
            value={store.knowledgeData || ''}
            onChange={e => onChange({
              ...store,
              knowledgeData: e.target.value
            })}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={10}
            placeholder="Enter detailed knowledge that the AI agent should know about this domain..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Comprehensive knowledge that will be used by AI agents to understand this domain.
          </p>
        </div>
      </div>
    </div>
  );
}