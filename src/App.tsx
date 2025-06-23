import React, { useState, useCallback } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { ChatContainer } from './components/chat/ChatContainer';
import { ConfigModal } from './components/ConfigModal';
import { Toast } from './components/common/Toast';
import { usePersona } from './hooks/usePersona';
import { useAppState } from './hooks/useAppState';
import { useChatActions } from './hooks/useChatActions';
import { useChatFocusProvider, ChatFocusContext } from './hooks/useChatFocus';
import { useKnowledgeReload } from './hooks/useKnowledgeReload';
import { useChatScroll } from './hooks/useChatScroll';
import { fileLogger } from './utils/fileLogger';

export default function App() {
  useKnowledgeReload();
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const chatFocus = useChatFocusProvider();
  
  const { 
    currentPersona, 
    changePersona, 
    currentMessages,
    setCurrentMessages,
    isLoading: isPersonaLoading,
    currentPersonaId
  } = usePersona();

  const {
    isLoading: isAppLoading,
    setIsLoading,
    configError,
    setConfigError,
    lastMessageIndex,
    setLastMessageIndex
  } = useAppState({
    onOpenSettings: () => setIsConfigOpen(true)
  });

  const { scrollContainerRef, messagesEndRef, handleContentUpdate } = 
    useChatScroll({ messages: currentMessages, isTyping: isAppLoading });

  const { handleClearConversation, handleSendMessage } = useChatActions({
    currentPersona,
    currentMessages,
    setCurrentMessages,
    setLastMessageIndex,
    setIsLoading,
    setConfigError,
    onOpenSettings: () => setIsConfigOpen(true)
  });

  const handlePersonaChange = useCallback((personaKey: string) => {
    if (currentPersona && currentMessages.length > 0) {
      fileLogger.logConversation(currentMessages, currentPersona.name);
    }
    void changePersona(personaKey);
    chatFocus.focusInput();
  }, [changePersona, chatFocus, currentPersona, currentMessages]);

  const handleModelChange = useCallback((modelId: string) => {
    if (currentPersona && currentMessages.length > 0) {
      fileLogger.logConversation(currentMessages, currentPersona.name);
    }
  }, [currentMessages, currentPersona]);

  const handleFeedback = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  // Show loading state while persona is loading
  if (isPersonaLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-emerald-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <ChatFocusContext.Provider value={chatFocus}>
      <div className="flex flex-col h-full bg-black">
        <AppHeader
          onOpenSettings={() => setIsConfigOpen(true)}
          configError={configError}
          onModelChange={handleModelChange}
          currentPersona={currentPersonaId}
          onPersonaChange={handlePersonaChange}
        />
        
        <ChatContainer
          messages={currentMessages}
          isLoading={isAppLoading}
          lastMessageIndex={lastMessageIndex}
          currentPersonaName={currentPersona?.name || null}
          scrollContainerRef={scrollContainerRef}
          messagesEndRef={messagesEndRef}
          onContentUpdate={handleContentUpdate}
        />

        <AppFooter
          onSendMessage={handleSendMessage}
          onClearConversation={handleClearConversation}
          isDisabled={isAppLoading || !!configError || !currentPersona}
        />

        <ConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onFeedback={handleFeedback}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ChatFocusContext.Provider>
  );
}