import React, { useState } from 'react';
import { ModalHeader } from './config/ModalHeader';
import { TabNav } from './config/TabNav';
import { ModalContent } from './config/ModalContent';
import { ConfirmDialog } from './common/ConfirmDialog';
import { useConfigModal } from './config/useConfigModal';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (message: string) => void;
}

const TABS = [
  { id: 'options', label: 'Conversation Logs' },
  { id: 'config', label: 'API Settings' },
  { id: 'ai-agents', label: 'AI Agents Specs' },
  { id: 'super-okai', label: 'Super Okai Config' }
];

export function ConfigModal({ isOpen, onClose, onFeedback }: ConfigModalProps) {
  const {
    activeTab,
    setActiveTab,
    apiKey,
    setApiKey,
    showBalance,
    handleShowBalanceChange,
    availablePersonas,
    handleClearLogs,
    showClearConfirm,
    setShowClearConfirm,
    confirmClearLogs,
    handleDownloadPersonaLogs,
    handleDownloadAllLogs,
    handleSaveConfig
  } = useConfigModal({ isOpen, onClose, onFeedback });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black rounded-2xl shadow-xl w-full max-w-4xl border border-emerald-950/30 max-h-[90vh] flex flex-col">
          <ModalHeader title="Super Okai Settings" onClose={onClose} />
          
          <TabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={TABS}
          />

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ModalContent
              activeTab={activeTab}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              showBalance={showBalance}
              onShowBalanceChange={handleShowBalanceChange}
              personas={availablePersonas}
              onDownloadPersona={handleDownloadPersonaLogs}
              onDownloadAll={handleDownloadAllLogs}
              onClearAll={handleClearLogs}
              onFeedback={onFeedback}
            />
          </div>

          {/* Only show footer buttons for API Settings tab */}
          {activeTab === 'config' && (
            <div className="flex justify-end gap-2 p-4 border-t border-emerald-950/30">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors border border-emerald-500/20 hover:border-emerald-500/30"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear All Logs"
        message="Are you sure you want to delete all conversation logs? This action cannot be undone and will clear the current chat window."
        confirmLabel="Delete All"
        onConfirm={confirmClearLogs}
        onCancel={() => setShowClearConfirm(false)}
      />
    </>
  );
}