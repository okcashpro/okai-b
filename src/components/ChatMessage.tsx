import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Copy, Check, ArrowUp } from 'lucide-react';
import { marked } from 'marked';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  shouldAnimate?: boolean;
  isLoadedMessage?: boolean;
  onContentUpdate?: () => void;
  onAnimationComplete?: () => void;
  messageIndex?: number;
  scrollToMessage?: (index: number) => void;
}

export function ChatMessage({ 
  message, 
  isTyping = false, 
  shouldAnimate = false,
  isLoadedMessage = false,
  onContentUpdate,
  onAnimationComplete,
  messageIndex,
  scrollToMessage
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [displayedContent, setDisplayedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    // For loaded messages or user messages, display content immediately without animation
    if (isLoadedMessage || isUser) {
      setDisplayedContent(message.content);
      onAnimationComplete?.();
      return;
    }

    // For new AI responses, animate only if shouldAnimate is true
    if (!shouldAnimate) {
      setDisplayedContent(message.content);
      onAnimationComplete?.();
      return;
    }

    setIsAnimating(true);
    const words = message.content.split(/(\s+)/);
    let currentText = '';
    let currentIndex = 0;

    const typeNextWord = () => {
      if (currentIndex < words.length) {
        currentText += words[currentIndex];
        setDisplayedContent(currentText);
        onContentUpdate?.();
        currentIndex++;
        requestAnimationFrame(typeNextWord);
      } else {
        setIsAnimating(false);
        onAnimationComplete?.();
      }
    };

    requestAnimationFrame(typeNextWord);
  }, [isUser, message.content, shouldAnimate, isLoadedMessage, onContentUpdate, onAnimationComplete]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleScrollToQuestion = () => {
    if (messageIndex !== undefined && messageIndex > 0 && scrollToMessage) {
      scrollToMessage(messageIndex - 1);
    }
  };

  const htmlContent = marked(displayedContent, { breaks: true });
  
  return (
    <div className={`p-4 ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {isUser ? (
            <MessageSquare className="h-6 w-6 text-blue-400" />
          ) : (
            <Bot className="h-6 w-6 text-green-400" />
          )}
        </div>
        <div className="flex-1 min-w-0 relative group">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          {(isAnimating || isTyping) && (
            <div className="typing-indicator" data-testid="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          {!isUser && !isAnimating && !isTyping && (
            <>
              {/* Copy button in top right */}
              <button
                onClick={handleCopy}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-emerald-400 
                         transition-all duration-200 hover:scale-110 
                         rounded-lg hover:bg-emerald-950/20 opacity-0 
                         group-hover:opacity-100"
                title="Copy response"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              
              {/* Scroll to question button in bottom right */}
              {messageIndex !== undefined && messageIndex > 0 && (
                <button
                  onClick={handleScrollToQuestion}
                  className="absolute bottom-0 right-0 p-2 text-gray-400 hover:text-emerald-400 
                           transition-all duration-200 hover:scale-110 
                           rounded-lg hover:bg-emerald-950/20 opacity-0 
                           group-hover:opacity-100"
                  title="Scroll to question"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}