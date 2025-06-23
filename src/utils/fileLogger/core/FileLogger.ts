import { logger } from '../../logger';
import type { Message } from '../../../types';
import type {
  ConversationManagerInterface,
  FileOperationsInterface,
  LoggerConfig,
  LogEvent,
  PersonaConversation
} from '../types';
import { logEvents } from '../events';

export class FileLogger {
  private static instance: FileLogger;
  private conversationManager: ConversationManagerInterface;
  private fileOperations: FileOperationsInterface;

  private constructor(
    conversationManager: ConversationManagerInterface,
    fileOperations: FileOperationsInterface
  ) {
    this.conversationManager = conversationManager;
    this.fileOperations = fileOperations;
  }

  static initialize(
    conversationManager: ConversationManagerInterface,
    fileOperations: FileOperationsInterface,
    config?: LoggerConfig
  ): FileLogger {
    if (!this.instance) {
      this.instance = new FileLogger(conversationManager, fileOperations);
    }
    return this.instance;
  }

  static getInstance(): FileLogger {
    if (!this.instance) {
      throw new Error('FileLogger not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  // Event handling
  onLogEvent(listener: (event: LogEvent) => void): void {
    logEvents.addListener(listener);
  }

  removeLogEventListener(listener: (event: LogEvent) => void): void {
    logEvents.removeListener(listener);
  }

  // Conversation Management
  getPersonaLogs(personaId: string): PersonaConversation | null {
    return this.conversationManager.getPersonaLogs(personaId);
  }

  async logConversation(messages: Message[], personaId: string): Promise<void> {
    try {
      await this.conversationManager.logConversation(messages, personaId);
    } catch (error) {
      logger.error('Failed to log conversation:', error);
    }
  }

  clearPersonaLogs(personaId: string): void {
    this.conversationManager.clearPersonaLogs(personaId);
  }

  clearAllLogs(): void {
    this.conversationManager.clearAllLogs();
  }

  // File Operations
  getAvailablePersonas(): { key: string; name: string }[] {
    return this.fileOperations.getAvailablePersonas();
  }

  downloadPersonaLogs(personaKey: string): void {
    this.fileOperations.downloadPersonaLogs(personaKey);
  }

  downloadAllLogs(): void {
    this.fileOperations.downloadAllLogs();
  }
}