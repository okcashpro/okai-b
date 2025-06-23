import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ModalHeader } from './ModalHeader';
import { KnowledgeOption } from './KnowledgeOption';
import type { KnowledgeMetadata } from '../../../../utils/knowledge';

interface KnowledgeModalProps {
  knowledgeBases: KnowledgeMetadata[];
  onSelect: (knowledgeId: string) => void;
  onClose: () => void;
}

export function KnowledgeModal({
  knowledgeBases,
  onSelect,
  onClose
}: KnowledgeModalProps) {
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-96 max-w-[90vw] bg-black border border-emerald-950/30 
                   rounded-lg shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader onClose={onClose} />
        <div className="p-4 space-y-2">
          {knowledgeBases.map(kb => (
            <KnowledgeOption
              key={kb.id}
              knowledge={kb}
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(kb.id);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}