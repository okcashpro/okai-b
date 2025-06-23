import React from 'react';

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export function ModalFooter({ onCancel, onSave }: ModalFooterProps) {
  return (
    <div className="flex justify-end gap-2 p-4 border-t border-emerald-950/30">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors border border-emerald-500/20 hover:border-emerald-500/30"
      >
        Save Changes
      </button>
    </div>
  );
}