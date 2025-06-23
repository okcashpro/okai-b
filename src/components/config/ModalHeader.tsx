import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-emerald-950/30">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-emerald-950/20 p-2"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}