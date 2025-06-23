import { logger } from '../logger';
import type { 
  ConversationManagerInterface, 
  FileOperationsInterface,
  LogFormatter,
  FileDownloader,
  PersonaConversation
} from './types';

export class FileOperationsManager implements FileOperationsInterface {
  constructor(
    private conversationManager: ConversationManagerInterface,
    private formatter: LogFormatter,
    private downloader: FileDownloader
  ) {}

  getAvailablePersonas(): { key: string; name: string }[] {
    try {
      const logs = this.conversationManager.getLogs();
      return Object.entries(logs)
        .map(([key, log]) => ({
          key,
          name: log.personaName
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      logger.error('Error getting available personas:', error);
      return [];
    }
  }

  downloadPersonaLogs(personaKey: string): void {
    try {
      const conversation = this.conversationManager.getPersonaLogs(personaKey);
      if (!conversation) {
        logger.warn('No logs found for persona:', personaKey);
        return;
      }

      const content = this.formatter.formatConversation(conversation);
      const filename = this.generateFilename(conversation);
      
      this.downloader.downloadFile(content, filename);
    } catch (error) {
      logger.error('Error downloading persona logs:', error);
    }
  }

  downloadAllLogs(): void {
    try {
      const logs = this.conversationManager.getLogs();
      const conversations = Object.values(logs);
      
      if (conversations.length === 0) {
        logger.info('No logs available to download');
        return;
      }

      const content = this.formatter.formatAllConversations(conversations);
      const filename = `super-okai-all-conversations-${new Date().toISOString()}.txt`;
      
      this.downloader.downloadFile(content, filename);
    } catch (error) {
      logger.error('Error downloading all logs:', error);
    }
  }

  private generateFilename(conversation: PersonaConversation): string {
    const timestamp = new Date().toISOString();
    const personaName = conversation.personaName.toLowerCase().replace(/\s+/g, '-');
    return `super-okai-${personaName}-${timestamp}.txt`;
  }
}