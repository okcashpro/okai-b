import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface RestoreButtonProps {
  onRestore: () => Promise<void>;
  type: 'personas' | 'knowledge';
}

export function RestoreButton({ onRestore, type }: RestoreButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await onRestore();
    } finally {
      setIsRestoring(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isRestoring}
        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 
                 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${isRestoring ? 'animate-spin' : ''}`} />
        <span>
          {isRestoring ? 'Restoring...' : `Restore Original ${type === 'personas' ? 'AI Agents' : 'Knowledge Bases'}`}
        </span>
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        title={`Restore Original ${type === 'personas' ? 'AI Agents' : 'Knowledge Bases'}`}
        message={`This will restore all original ${type === 'personas' ? 'AI agents' : 'knowledge bases'} to their initial state. Any modifications to the original ${type} will be overwritten. Custom ${type} will not be affected. Are you sure you want to continue?`}
        confirmLabel="Restore"
        onConfirm={handleRestore}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}