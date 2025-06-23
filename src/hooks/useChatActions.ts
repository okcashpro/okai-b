import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../api';
import { fileLogger } from '../utils/fileLogger/index';
import { apiKeyManager } from '../utils/apiKeyManager';
import { APIError } from '../utils/errors';
import type { Message } from '../types';
import type { AIPersona } from '../config/personas/types';

interface UseChatActionsProps {
  currentPersona: AIPersona | null;
  currentMessages: Message[];
  setCurrentMessages: (messages: Message[]) => void;
  setLastMessageIndex: (index: number) => void;
  setIsLoading: (loading: boolean) => void;
  setConfigError: (error: string | null) => void;
  onOpenSettings: () => void;
}

export function useChatActions({
  currentPersona,
  currentMessages,
  setCurrentMessages,
  setLastMessageIndex,
  setIsLoading,
  setConfigError,
  onOpenSettings
}: UseChatActionsProps) {
  const handleClearConversation = useCallback(() => {
    if (!currentPersona) return;
    
    setCurrentMessages([]);
    setLastMessageIndex(-1);
    fileLogger.clearPersonaLogs(currentPersona.name);
  }, [currentPersona, setCurrentMessages, setLastMessageIndex]);

  const handleSendMessage = useCallback(async (content: string) => {
    // Don't allow sending messages if persona is not loaded
    if (!currentPersona) {
      setConfigError('Please select an AI agent before sending messages');
      return;
    }

    // Check for API key before sending
    const activeKey = apiKeyManager.getActiveApiKey();
    if (!activeKey) {
      setConfigError('OpenRouter API key is missing. Please add your API key in the settings.');
      onOpenSettings();
      return;
    }

    const userMessage: Message = { id: uuidv4(), role: 'user', content };
    setLastMessageIndex(currentMessages.length - 1);
    setCurrentMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setConfigError(null);

    try {
      const apiMessages = currentMessages.concat(userMessage);
      const response = await sendMessage(apiMessages, currentPersona);
      
      if (response) {
        const assistantMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: response.content || 'Sorry, I could not generate a response.'
        };
        
        const newMessages = [...currentMessages, userMessage, assistantMessage];
        setCurrentMessages(newMessages);
        // Save conversation
        fileLogger.logConversation(newMessages, currentPersona.name);
      }
    } catch (error) {
      let errorMessage = 'Sorry, there was an error processing your request.';
      
      if (error instanceof APIError) {
        errorMessage = error.message;
        if (error.statusCode === 401) {
          setConfigError(errorMessage);
          onOpenSettings();
        }
      }
      
      setCurrentMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessages, currentPersona, onOpenSettings, setConfigError, setCurrentMessages, setIsLoading, setLastMessageIndex]);

  return {
    handleClearConversation,
    handleSendMessage
  };
}