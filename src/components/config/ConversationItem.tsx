import React from 'react';
import { Download } from 'lucide-react';

interface ConversationItemProps {
  name: string;
  onDownload: () => void;
}

export function ConversationItem({ name, onDownload }: ConversationItemProps) {
  return (
    <div className="group flex items-center justify-between p-2.5 bg-black 
                    rounded-lg hover:bg-emerald-950/20 transition-all duration-200 
                    border border-emerald-950/30 hover:border-emerald-500/20 
                    hover:scale-[1.02] relative overflow-hidden">
      <span className="text-gray-300 group-hover:text-white transition-colors">{name}</span>
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 px-2.5 py-1 text-sm bg-emerald-600/20 
                 text-emerald-400 rounded hover:bg-emerald-600/30 transition-all 
                 duration-200 hover:scale-105 border border-emerald-500/20 
                 hover:border-emerald-500/30"
      >
        <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
        Download
      </button>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 
                    to-transparent opacity-0 group-hover:opacity-100 
                    transition-opacity pointer-events-none" />
    </div>
  );
}