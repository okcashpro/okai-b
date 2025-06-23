import { logger } from '../../logger';
import { personaManager } from '../../personas';
import { getModelById, getSelectedModel } from '../../../config/models';
import { normalizeId } from '../../personas/types';
import { logEvents } from '../events';
import type { Message } from '../../../types';
import type {
  PersonaConversation,
  ConversationManagerInterface,
  LoggerConfig,
  StorageProvider,
  LogFormatter,
  FileDownloader,
  LogEvent
} from '../types';

export class ConversationManager implements ConversationManagerInterface {
  private logs: Record<string, PersonaConversation> = {};
  private readonly config: Required<LoggerConfig>;

  constructor(
    private storage: StorageProvider,
    private formatter: LogFormatter,
    private downloader: FileDownloader,
    config?: LoggerConfig
  ) {
    this.config = {
      maxConversationsPerPersona: config?.maxConversationsPerPersona ?? 100,
      daysToKeep: config?.daysToKeep ?? 30,
      storageKey: config?.storageKey ?? 'super_okai_logs'
    };

    this.initialize();
  }

  private initialize(): void {
    this.loadLogs();
    this.cleanupOldLogs();
    this.setupStorageListener();
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.config.storageKey) {
        this.loadLogs();
        this.emitEvent({ type: 'update', timestamp: Date.now() });
      }
    });
  }

  private emitEvent(event: LogEvent): void {
    logEvents.emit(event);
  }

  private loadLogs(): void {
    try {
      const stored = this.storage.get(this.config.storageKey);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (typeof parsed !== 'object') return;

      Object.entries(parsed).forEach(([key, value]) => {
        if (this.isValidConversation(value)) {
          const normalizedId = normalizeId(key);
          this.logs[normalizedId] = value as PersonaConversation;
        }
      });
    } catch (error) {
      logger.error('Error loading logs:', error);
    }
  }

  private saveLogs(): void {
    try {
      this.storage.set(this.config.storageKey, JSON.stringify(this.logs));
      this.emitEvent({ type: 'save', timestamp: Date.now() });
    } catch (error) {
      if (error instanceof Error && error.message === 'Storage quota exceeded') {
        this.handleStorageQuotaExceeded();
      } else {
        logger.error('Error saving logs:', error);
      }
    }
  }

  private handleStorageQuotaExceeded(): void {
    // Remove oldest half of conversations
    const sortedPersonas = Object.entries(this.logs)
      .sort(([, a], [, b]) => a.lastUpdated - b.lastUpdated)
      .slice(Math.floor(Object.keys(this.logs).length / 2));
    
    this.logs = Object.fromEntries(sortedPersonas);
    this.storage.set(this.config.storageKey, JSON.stringify(this.logs));
  }

  private isValidConversation(value: unknown): boolean {
    return !!(
      value &&
      typeof value === 'object' &&
      'messages' in value &&
      Array.isArray((value as any).messages) &&
      (value as any).messages.length > 0
    );
  }

  private cleanupOldLogs(): void {
    try {
      const cutoffDate = Date.now() - (this.config.daysToKeep * 24 * 60 * 60 * 1000);
      
      let hasChanges = false;
      Object.keys(this.logs).forEach(key => {
        if (this.logs[key].lastUpdated < cutoffDate) {
          delete this.logs[key];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        this.saveLogs();
        logger.info('Cleaned up old logs');
      }
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }

  async logConversation(messages: Message[], personaId: string): Promise<void> {
    if (!messages.length) return;

    try {
      const now = Date.now();
      const currentModel = getSelectedModel();
      const modelInfo = getModelById(currentModel);

      const persona = await personaManager.getPersona(personaId);
      if (!persona) {
        throw new Error(`Invalid persona ID: ${personaId}`);
      }

      const normalizedId = normalizeId(personaId);
      const existingConversation = this.logs[normalizedId];
      const modelUsage = existingConversation?.modelUsage || [];

      const lastModelUsage = modelUsage[modelUsage.length - 1];
      if (!lastModelUsage || lastModelUsage.modelId !== currentModel) {
        modelUsage.push({
          modelId: currentModel,
          modelName: modelInfo?.name || currentModel,
          timestamp: now
        });
      }

      this.logs[normalizedId] = {
        id: existingConversation?.id || crypto.randomUUID(),
        timestamp: existingConversation?.timestamp || now,
        messages,
        lastUpdated: now,
        personaName: persona.name,
        displayOrder: persona.displayOrder || 999,
        modelUsage
      };

      this.saveLogs();
      this.emitEvent({ 
        type: 'save', 
        personaId: normalizedId, 
        timestamp: now 
      });
    } catch (error) {
      logger.error('Error logging conversation:', error);
      throw error;
    }
  }

  getPersonaLogs(personaId: string): PersonaConversation | null {
    try {
      const normalizedId = normalizeId(personaId);
      return this.logs[normalizedId] || null;
    } catch (error) {
      logger.error('Error getting persona logs:', error);
      return null;
    }
  }

  clearPersonaLogs(personaId: string): void {
    try {
      const normalizedId = normalizeId(personaId);
      if (this.logs[normalizedId]) {
        delete this.logs[normalizedId];
        this.saveLogs();
        this.emitEvent({ 
          type: 'clear', 
          personaId: normalizedId, 
          timestamp: Date.now() 
        });
      }
    } catch (error) {
      logger.error('Error clearing persona logs:', error);
    }
  }

  clearAllLogs(): void {
    try {
      this.logs = {};
      this.storage.remove(this.config.storageKey);
      
      // Emit both standard and custom events
      this.emitEvent({ type: 'clear', timestamp: Date.now() });
      
      // Dispatch both storage and custom events
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.config.storageKey,
        newValue: null
      }));
      
      window.dispatchEvent(new CustomEvent('logsCleared'));
      
      logger.info('All logs cleared successfully');
    } catch (error) {
      logger.error('Error clearing logs:', error);
    }
  }

  getLogs(): Record<string, PersonaConversation> {
    return { ...this.logs };
  }
}