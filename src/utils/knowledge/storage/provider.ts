import { logger } from '../../logger';
import type { StorageProvider } from './types';

export class LocalStorageProvider implements StorageProvider {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error('Error reading from storage:', error);
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error('Error writing to storage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded');
      }
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Error removing from storage:', error);
    }
  }
}