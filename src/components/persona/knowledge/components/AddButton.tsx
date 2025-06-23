import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      className="w-7 h-7 flex items-center justify-center 
                 bg-emerald-950/20 text-emerald-400 rounded-full border 
                 border-emerald-500/20 hover:bg-emerald-950/40 
                 hover:border-emerald-500/30 transition-all duration-200 
                 hover:scale-110"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      title="Add knowledge base"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}