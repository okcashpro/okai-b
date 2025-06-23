import { useState, useEffect } from 'react';
import { fileLogger } from '../../utils/fileLogger/index';
import { apiKeyManager } from '../../utils/apiKeyManager';
import { openRouterBalance } from '../../utils/openRouter';
import { config } from '../../config/env';
import { usePersona } from '../../hooks/usePersona';

interface UseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedback: (message: string) => void;
}

export function useConfigModal({ isOpen, onClose, onFeedback }: UseConfigModalProps) {
  const [activeTab, setActiveTab] = useState('options');
  const [apiKey, setApiKey] = useState('');
  const [showBalance, setShowBalance] = useState(openRouterBalance.shouldShowBalance());
  const [availablePersonas, setAvailablePersonas] = useState<{ key: string; name: string }[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { setCurrentMessages } = usePersona();

  useEffect(() => {
    if (isOpen) {
      setAvailablePersonas(fileLogger.getAvailablePersonas());
      const activeKey = apiKeyManager.getActiveApiKey();
      setApiKey(activeKey || '');
      setShowBalance(openRouterBalance.shouldShowBalance());
      if (!activeKey) {
        setActiveTab('config');
      }
    }
  }, [isOpen]);

  const handleShowBalanceChange = (show: boolean) => {
    openRouterBalance.setShowBalancePreference(show);
    setShowBalance(show);
  };

  const handleClearLogs = () => {
    setShowClearConfirm(true);
  };

  const confirmClearLogs = () => {
    fileLogger.clearAllLogs();
    setAvailablePersonas([]);
    // Clear the current chat window
    setCurrentMessages([]);
    setShowClearConfirm(false);
    onFeedback('All logs cleared successfully');
    onClose();
  };

  const handleDownloadPersonaLogs = (personaKey: string) => {
    fileLogger.downloadPersonaLogs(personaKey);
  };

  const handleDownloadAllLogs = () => {
    if (availablePersonas.length === 0) {
      onFeedback('No logs available to download');
      return;
    }
    fileLogger.downloadAllLogs();
  };

  const handleSaveConfig = () => {
    if (apiKey.trim()) {
      apiKeyManager.saveApiKey(apiKey.trim());
      config.openRouterApiKey = apiKey.trim();
      onFeedback('Settings saved successfully');
      onClose();
      
      // Trigger a balance update without page reload
      openRouterBalance.startBalanceUpdates(true);
    } else {
      onFeedback('Please enter a valid API key');
    }
  };

  return {
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
  };
}