import { useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import type { Message } from '../types';

interface UseChatScrollProps {
  messages: Message[];
  isTyping: boolean;
}

export function useChatScroll({ messages, isTyping }: UseChatScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const lastMessageCountRef = useRef(messages.length);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior,
          block: 'end'
        });
      }
    });
  }, []);

  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const threshold = 100;
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = position < threshold;
  }, []);

  const handleScroll = useCallback(() => {
    checkIfNearBottom();
  }, [checkIfNearBottom]);

  const debouncedScroll = debounce(handleScroll, 100);

  // Handle new messages and typing state
  useEffect(() => {
    const hasNewMessages = messages.length > lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    // Always scroll on new messages or typing state change
    if (hasNewMessages || isTyping) {
      scrollToBottom('auto');
    }
  }, [messages, isTyping, scrollToBottom]);

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', debouncedScroll);
      return () => container.removeEventListener('scroll', debouncedScroll);
    }
  }, [debouncedScroll]);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  const handleContentUpdate = useCallback(() => {
    if (isNearBottomRef.current) {
      scrollToBottom('auto');
    }
  }, [scrollToBottom]);

  return {
    scrollContainerRef,
    messagesEndRef,
    handleContentUpdate,
    scrollToBottom
  };
}