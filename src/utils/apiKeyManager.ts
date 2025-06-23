import { logger } from './logger';

class APIKeyManager {
  private static instance: APIKeyManager;
  private readonly storageKey = 'super_okai_api_key';

  private constructor() {}

  static getInstance(): APIKeyManager {
    if (!this.instance) {
      this.instance = new APIKeyManager();
    }
    return this.instance;
  }

  getStoredApiKey(): string | null {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (error) {
      logger.error('Error reading API key from storage:', error);
      return null;
    }
  }

  saveApiKey(key: string): void {
    try {
      localStorage.setItem(this.storageKey, key);
    } catch (error) {
      logger.error('Error saving API key:', error);
    }
  }

  clearApiKey(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      logger.error('Error clearing API key:', error);
    }
  }

  getActiveApiKey(): string | null {
    // First try environment variable
    const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (envKey) return envKey;

    // Then try stored key
    return this.getStoredApiKey();
  }
}

export const apiKeyManager = APIKeyManager.getInstance();