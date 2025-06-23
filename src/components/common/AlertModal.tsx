import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-96 max-w-[90vw] bg-black border border-emerald-950/30 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-950/30">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-lg font-medium text-white">Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-emerald-950/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-300">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-emerald-950/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg 
                     hover:bg-emerald-600/30 transition-colors border 
                     border-emerald-500/20 hover:border-emerald-500/30"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}