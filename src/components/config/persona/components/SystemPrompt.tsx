import React from 'react';
import type { PersonaStore } from '../../../../utils/personas/types';

interface SystemPromptProps {
  store: PersonaStore;
  onChange: (store: PersonaStore) => void;
}

export function SystemPrompt({ store, onChange }: SystemPromptProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        System Prompt <span className="text-red-500">*</span>
      </label>
      <textarea
        value={store.systemPrompt}
        onChange={e => onChange({
          ...store,
          systemPrompt: e.target.value
        })}
        className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                 focus:border-emerald-500/30 font-mono"
        rows={8}
        placeholder={`You are a [role/expertise]. Communicate in a [style/tone] manner.

Example:
You are a senior software architect with expertise in system design and best practices. Communicate in a clear, professional manner, using technical terms appropriately while making complex concepts understandable. Share practical examples and focus on maintainable, scalable solutions.`}
      />
    </div>
  );
}