import { useState, useEffect } from 'react';
import { apiKeyManager } from '../utils/apiKeyManager';
import { config } from '../config/env';

interface UseAppStateProps {
  onOpenSettings: () => void;
}

export function useAppState({ onOpenSettings }: UseAppStateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [lastMessageIndex, setLastMessageIndex] = useState<number>(-1);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Check API key on mount
  useEffect(() => {
    const activeKey = apiKeyManager.getActiveApiKey();
    if (!activeKey) {
      setConfigError('OpenRouter API key is missing. Please add your API key in the settings.');
      onOpenSettings();
    } else {
      config.openRouterApiKey = activeKey;
      setConfigError(null);
    }
  }, [onOpenSettings]);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return {
    isLoading,
    setIsLoading,
    configError,
    setConfigError,
    lastMessageIndex,
    setLastMessageIndex,
    feedback,
    setFeedback
  };
}