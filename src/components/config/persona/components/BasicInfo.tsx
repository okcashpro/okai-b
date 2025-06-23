import React from 'react';
import type { PersonaStore } from '../../../../utils/personas/types';

interface BasicInfoProps {
  store: PersonaStore;
  onChange: (store: PersonaStore) => void;
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
            placeholder="e.g., Tech Expert, Creative Writer, Support Agent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={store.metadata.description}
            onChange={e => onChange({
              ...store,
              metadata: { ...store.metadata, description: e.target.value }
            })}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30"
            rows={3}
            placeholder="e.g., A knowledgeable technical expert specializing in software development and system architecture."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Chat Length
          </label>
          <select
            value={store.metadata.chatLength || 'normal'}
            onChange={e => onChange({
              ...store,
              metadata: { 
                ...store.metadata, 
                chatLength: e.target.value as 'short' | 'normal' | 'long'
              }
            })}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30"
          >
            <option value="short">Short (1-2 sentences)</option>
            <option value="normal">Normal (2-3 paragraphs)</option>
            <option value="long">Long (Detailed explanations)</option>
          </select>
        </div>
      </div>
    </div>
  );
}