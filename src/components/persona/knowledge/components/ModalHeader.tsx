import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-emerald-950/30">
      <h3 className="text-lg font-medium text-white">Add Knowledge Base</h3>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="p-2 text-gray-400 hover:text-white transition-colors 
                   rounded-lg hover:bg-emerald-950/20"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}