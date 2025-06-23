import { useState, useEffect } from 'react';
import { fileLogger } from '../../utils/fileLogger';
import type { Message } from '../../types';
import type { AIPersona } from '../../config/personas/types';

export function usePersonaMessages(
  currentPersona: AIPersona | null,
  currentPersonaId: string | null
) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Listen for log clear events
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check if logs were cleared
      if (event.key === 'super_okai_logs' && (!event.newValue || event.newValue === '[]')) {
        setMessages([]); // Clear current conversation
      }
    };

    // Also listen for custom storage events for log clearing
    const handleCustomEvent = (event: Event) => {
      if (event instanceof CustomEvent && event.type === 'logsCleared') {
        setMessages([]); // Clear current conversation
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logsCleared', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logsCleared', handleCustomEvent);
    };
  }, []);

  // Load messages when persona changes
  useEffect(() => {
    if (!currentPersona || !currentPersonaId) {
      setMessages([]);
      return;
    }

    const logs = fileLogger.getPersonaLogs(currentPersonaId);
    setMessages(logs?.messages || []);
  }, [currentPersona, currentPersonaId]);

  return [messages, setMessages] as const;
}