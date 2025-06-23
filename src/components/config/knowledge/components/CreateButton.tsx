import React from 'react';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  onClick: () => void;
}

export function CreateButton({ onClick }: CreateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 p-4 bg-black rounded-xl 
               border border-emerald-950/30 hover:border-emerald-500/20 
               transition-all duration-200 hover:scale-[1.02] group"
    >
      <Plus className="h-5 w-5 text-emerald-400" />
      <span className="text-gray-400 group-hover:text-white transition-colors">
        Create New Knowledge Base
      </span>
    </button>
  );
}