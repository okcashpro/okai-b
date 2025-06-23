import React, { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useChatFocus } from '../hooks/useChatFocus';

interface ChatInputProps {
  onSend: (message: string) => void;
  onClear: () => void;
  disabled: boolean;
}

export function ChatInput({ onSend, onClear, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { inputRef, focusInput } = useChatFocus();

  useEffect(() => {
    if (!disabled) {
      focusInput();
    }
  }, [disabled, focusInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-black border-t border-emerald-950/30">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={disabled ? 'Loading...' : 'Type your message...'}
          disabled={disabled}
          className="flex-1 p-3 rounded-lg bg-black text-white placeholder-gray-500 
                   border border-emerald-950/30 focus:outline-none focus:ring-2 
                   focus:ring-emerald-500/20 focus:border-emerald-500/30 
                   transition-all duration-200 hover:border-emerald-500/20
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="p-3 rounded-lg bg-emerald-600/20 text-emerald-400 
                   hover:bg-emerald-600/30 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all duration-200 
                   hover:scale-105 border border-emerald-500/20 
                   hover:border-emerald-500/30 disabled:hover:scale-100
                   group relative overflow-hidden"
        >
          <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 
                        to-emerald-500/0 group-hover:animate-pulse" />
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="p-3 rounded-lg bg-red-600/20 text-red-400 
                   hover:bg-red-600/30 transition-all duration-200 
                   hover:scale-105 border border-red-500/20 
                   hover:border-red-500/30 group relative overflow-hidden
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100"
          title="Clear current conversation"
        >
          <Trash2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 
                        to-red-500/0 group-hover:animate-pulse" />
        </button>
      </div>
    </form>
  );
}