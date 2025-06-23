import { createContext, useContext, useRef, useCallback, useEffect } from 'react';

interface ChatFocusContextType {
  inputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void;
}

export const ChatFocusContext = createContext<ChatFocusContextType | null>(null);

export function useChatFocusProvider() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    // Use double requestAnimationFrame to ensure the input is ready
    // and any UI updates have completed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    });
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return {
    inputRef,
    focusInput,
  };
}

export function useChatFocus() {
  const context = useContext(ChatFocusContext);
  if (!context) {
    throw new Error('useChatFocus must be used within a ChatFocusProvider');
  }
  return context;
}