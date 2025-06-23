import React from 'react';
import { Plus } from 'lucide-react';
import type { KnowledgeMetadata } from '../../../../utils/knowledge';

interface KnowledgeOptionProps {
  knowledge: KnowledgeMetadata;
  onSelect: (e: React.MouseEvent) => void;
}

export function KnowledgeOption({ knowledge, onSelect }: KnowledgeOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-3 p-3 text-left text-gray-300 
                 bg-black border border-emerald-950/30 rounded-lg
                 hover:bg-emerald-950/20 hover:text-white hover:border-emerald-500/30 
                 transition-all duration-200 group"
    >
      <div className="flex-1">
        <div className="font-medium group-hover:text-emerald-400 transition-colors">
          {knowledge.name}
        </div>
        <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
          Knowledge base for {knowledge.name}
        </div>
      </div>
      <Plus className="h-4 w-4 text-emerald-400 transition-transform 
                      group-hover:scale-125 group-hover:rotate-90" />
    </button>
  );
}