import type { Message } from '../../types';

// Core types
export interface ModelUsage {
  modelId: string;
  modelName: string;
  timestamp: number;
}

export interface PersonaConversation {
  id: string;
  timestamp: number;
  messages: Message[];
  lastUpdated: number;
  personaName: string;
  displayOrder: number;
  modelUsage: ModelUsage[];
}

// Configuration
export interface LoggerConfig {
  maxConversationsPerPersona?: number;
  daysToKeep?: number;
  storageKey?: string;
}

// Storage interfaces
export interface StorageProvider {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface FileDownloader {
  downloadFile(content: string, filename: string): void;
}

export interface LogFormatter {
  formatConversation(conversation: PersonaConversation): string;
  formatAllConversations(conversations: PersonaConversation[]): string;
}

// Manager interfaces
export interface ConversationManagerInterface {
  getPersonaLogs(personaId: string): PersonaConversation | null;
  logConversation(messages: Message[], personaId: string): Promise<void>;
  clearPersonaLogs(personaId: string): void;
  clearAllLogs(): void;
  getLogs(): Record<string, PersonaConversation>;
}

export interface FileOperationsInterface {
  getAvailablePersonas(): { key: string; name: string }[];
  downloadPersonaLogs(personaKey: string): void;
  downloadAllLogs(): void;
}

// Event types
export interface LogEvent {
  type: 'save' | 'clear' | 'update';
  personaId?: string;
  timestamp: number;
}

export type LogEventListener = (event: LogEvent) => void;