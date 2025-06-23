import React from 'react';
import { Book, Sparkles, Trash2 } from 'lucide-react';
import type { KnowledgeMetadata } from '../../../../utils/knowledge';

interface KnowledgeCardProps {
  knowledge: KnowledgeMetadata;
  onSelect: () => void;
  onDelete: () => void;
}

export function KnowledgeCard({ knowledge, onSelect, onDelete }: KnowledgeCardProps) {
  return (
    <div
      className="group relative w-full text-left bg-black rounded-xl border border-emerald-950/30 
                hover:border-emerald-500/20 transition-all duration-200 hover:scale-[1.02] 
                relative overflow-hidden cursor-pointer"
    >
      {/* Make the entire card clickable */}
      <div 
        className="p-4 relative z-10"
        onClick={onSelect}
      >
        {/* Icon and Name */}
        <div className="flex items-center gap-2 mb-2">
          <Book className="h-5 w-5 text-emerald-400" />
          <h4 className="font-medium text-white group-hover:text-emerald-400 
                      transition-colors line-clamp-1 flex-1 flex items-center gap-2">
            {knowledge.name}
            <Sparkles className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 
                              transition-opacity" />
          </h4>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-400 text-left">
          <div className="flex items-center justify-between mb-1">
            <span>Prompts:</span>
            <span className="text-emerald-400">{knowledge.promptCount}</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span>Categories:</span>
            <span className="text-emerald-400">{knowledge.categories.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Q&As:</span>
            <span className="text-emerald-400">{knowledge.qaCount}</span>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-300 
                 hover:bg-red-950/20 rounded-lg transition-all duration-200 
                 hover:scale-110 border border-transparent hover:border-red-500/20
                 opacity-0 group-hover:opacity-100 z-20"
        title={`Delete ${knowledge.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 
                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}