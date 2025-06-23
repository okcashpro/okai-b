import React from 'react';
import { ChevronLeft, Save } from 'lucide-react';

interface EditorHeaderProps {
  onBack: () => void;
  onSave: () => void;
}

export function EditorHeader({ onBack, onSave }: EditorHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to list
      </button>
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 
                 rounded-lg hover:bg-emerald-600/30 transition-colors border 
                 border-emerald-500/20 hover:border-emerald-500/30"
      >
        <Save className="h-4 w-4" />
        Save Changes
      </button>
    </div>
  );
}