import { FileDownloader } from './types';
import { logger } from '../logger';

export class BrowserFileDownloader implements FileDownloader {
  downloadFile(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }
}