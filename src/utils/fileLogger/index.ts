import { ConversationManager } from './core/ConversationManager';
import { FileLogger } from './core/FileLogger';
import { LocalStorageProvider } from './storage';
import { ConversationFormatter } from './formatter';
import { BrowserFileDownloader } from './downloader';
import { FileOperationsManager } from './operations';

// Initialize core components
const storage = new LocalStorageProvider();
const formatter = new ConversationFormatter();
const downloader = new BrowserFileDownloader();

// Initialize conversation manager
const conversationManager = new ConversationManager(
  storage,
  formatter,
  downloader,
  {
    maxConversationsPerPersona: 100,
    daysToKeep: 30,
    storageKey: 'super_okai_logs'
  }
);

// Initialize file operations
const fileOperations = new FileOperationsManager(
  conversationManager,
  formatter,
  downloader
);

// Initialize and export file logger
const fileLogger = FileLogger.initialize(
  conversationManager,
  fileOperations
);

export { fileLogger };