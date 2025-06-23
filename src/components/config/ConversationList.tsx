import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  personas: { key: string; name: string }[];
  onDownloadPersona: (key: string) => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
}

export function ConversationList({ 
  personas, 
  onDownloadPersona, 
  onDownloadAll, 
  onClearAll 
}: ConversationListProps) {
  if (personas.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No conversation logs available.</p>
        <p className="text-sm text-gray-500 mt-1">Start chatting with a persona to create logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {personas.map(persona => (
          <ConversationItem
            key={persona.key}
            name={persona.name}
            onDownload={() => onDownloadPersona(persona.key)}
          />
        ))}
      </div>
      <div className="flex gap-2 pt-3 mt-3 border-t border-emerald-950/30">
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 
                   rounded-lg hover:bg-emerald-600/30 transition-colors border 
                   border-emerald-500/20 hover:border-emerald-500/30 hover:scale-105
                   transition-all duration-200"
        >
          <Download className="h-4 w-4" />
          Download All
        </button>
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 
                   rounded-lg hover:bg-red-600/30 transition-colors border 
                   border-red-500/20 hover:border-red-500/30 hover:scale-105
                   transition-all duration-200"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}