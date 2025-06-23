import React from 'react';
import { ChatInput } from '../ChatInput';

interface AppFooterProps {
  onSendMessage: (content: string) => void;
  onClearConversation: () => void;
  isDisabled: boolean;
}

export function AppFooter({ onSendMessage, onClearConversation, isDisabled }: AppFooterProps) {
  return (
    <footer className="flex-none border-t border-gray-800">
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput 
          onSend={onSendMessage} 
          onClear={onClearConversation}
          disabled={isDisabled} 
        />
        <div className="px-4 pb-2 flex justify-between items-center text-xs text-gray-500">
          <span>
            <a href="https://super-okai.github.io" className="hover:text-blue-400 transition-colors">Super Okai</a>
            {' '}by{' '}
            <a href="https://okcash.org" className="hover:text-blue-400 transition-colors">OK</a>
            {' '}© 2025
          </span>
        </div>
      </div>
    </footer>
  );
}