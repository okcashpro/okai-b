import React from 'react';
import { Minus } from 'lucide-react';
import type { KnowledgeMetadata } from '../../utils/knowledge';

interface KnowledgeTagProps {
  knowledge: KnowledgeMetadata;
  onRemove: () => void;
}

export function KnowledgeTag({ knowledge, onRemove }: KnowledgeTagProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <div
      className="flex items-center gap-1 px-2 py-1 bg-emerald-950/20 
                 text-emerald-400 rounded-lg text-sm border border-emerald-500/20
                 hover:bg-emerald-950/30 hover:border-emerald-500/30 
                 transition-all duration-200 group"
      onClick={e => e.stopPropagation()}
    >
      <span>{knowledge.name}</span>
      <button
        type="button"
        onClick={handleRemove}
        className="p-0.5 hover:bg-red-950/40 rounded transition-colors
                   group-hover:text-red-400"
        title={`Remove ${knowledge.name} knowledge base`}
      >
        <Minus className="h-3 w-3 transition-colors" />
      </button>
    </div>
  );
}