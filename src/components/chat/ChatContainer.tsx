import React, { useState, useEffect } from 'react';
import { Cpu, Brain } from 'lucide-react';
import { ChatMessage } from '../ChatMessage';
import { getModelById, getSelectedModel } from '../../config/models';
import type { Message } from '../../types';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  lastMessageIndex: number;
  currentPersonaName: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onContentUpdate: () => void;
}

export function ChatContainer({
  messages,
  isLoading,
  lastMessageIndex,
  currentPersonaName,
  scrollContainerRef,
  messagesEndRef,
  onContentUpdate
}: ChatContainerProps) {
  // Track selected model with state to force re-render on changes
  const [selectedModelId, setSelectedModelId] = useState(getSelectedModel());
  const currentModel = getModelById(selectedModelId);

  // Update model when it changes
  useEffect(() => {
    const checkModel = () => {
      const newModelId = getSelectedModel();
      if (newModelId !== selectedModelId) {
        setSelectedModelId(newModelId);
      }
    };

    // Check immediately and set up interval
    checkModel();
    const interval = setInterval(checkModel, 1000);

    return () => clearInterval(interval);
  }, [selectedModelId]);

  const scrollToMessage = (index: number) => {
    const messageElements = document.querySelectorAll('.message-user, .message-assistant');
    if (messageElements[index]) {
      messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main 
      className="flex-1 overflow-y-auto custom-scrollbar bg-black" 
      ref={scrollContainerRef}
    >
      <div className="max-w-4xl mx-auto">
        {/* Info Banner */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-sm border-b border-emerald-950/30 p-2 z-10">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {/* Persona Info */}
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-emerald-400" />
              <span className="font-medium text-gray-300">
                {currentPersonaName || 'No AI Agent Selected'}
              </span>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-emerald-950/30" />

            {/* Model Info */}
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span className="font-medium text-gray-300">{currentModel?.name}</span>
              {currentModel?.isFree && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 rounded-full">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center min-h-[200px] p-8">
            <div className="text-center space-y-4 relative">
              {/* Matrix-style rain effect */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="matrix-rain" />
              </div>
              
              {/* Welcome message */}
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text animate-pulse">
                  Welcome to Super Okai
                </h2>
                <p className="text-emerald-400/90 font-mono">
                  {currentPersonaName ? (
                    <>
                      Initializing conversation with{' '}
                      <span className="text-emerald-300 font-semibold">{currentPersonaName}</span>
                    </>
                  ) : (
                    <span className="text-yellow-400">Please select an AI agent to begin</span>
                  )}
                </p>
                {currentPersonaName && (
                  <p className="text-gray-500 font-mono text-sm">
                    {'> Type your message below to begin <'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id}
                message={message}
                isTyping={isLoading && index === messages.length - 1}
                shouldAnimate={false}
                isLoadedMessage={true}
                onContentUpdate={onContentUpdate}
                messageIndex={index}
                scrollToMessage={scrollToMessage}
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>
    </main>
  );
}