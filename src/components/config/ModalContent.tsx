import React from 'react';
import { ConversationList } from './ConversationList';
import { APISettings } from './APISettings';
import { SuperOkaiConfig } from './SuperOkaiConfig';
import { AIAgentsSpecs } from './AIAgentsSpecs/index';

interface ModalContentProps {
  activeTab: string;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  showBalance: boolean;
  onShowBalanceChange: (show: boolean) => void;
  personas: { key: string; name: string }[];
  onDownloadPersona: (key: string) => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
  onFeedback: (message: string) => void;
}

export function ModalContent({
  activeTab,
  apiKey,
  onApiKeyChange,
  showBalance,
  onShowBalanceChange,
  personas,
  onDownloadPersona,
  onDownloadAll,
  onClearAll,
  onFeedback
}: ModalContentProps) {
  switch (activeTab) {
    case 'options':
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Available Conversations</h3>
          <ConversationList
            personas={personas}
            onDownloadPersona={onDownloadPersona}
            onDownloadAll={onDownloadAll}
            onClearAll={onClearAll}
          />
        </div>
      );
    case 'config':
      return (
        <APISettings
          apiKey={apiKey}
          onApiKeyChange={onApiKeyChange}
        />
      );
    case 'super-okai':
      return (
        <SuperOkaiConfig
          showBalance={showBalance}
          onShowBalanceChange={onShowBalanceChange}
        />
      );
    case 'ai-agents':
      return (
        <AIAgentsSpecs
          onFeedback={onFeedback}
        />
      );
    default:
      return null;
  }
}