import { config } from '../../config/env';
import { apiKeyManager } from '../apiKeyManager';
import { logger } from '../logger';
import type { KeyResponse } from './types';
import { keyResponseSchema } from './types';

export class OpenRouterAPI {
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  async fetchKeyInfo(): Promise<KeyResponse | null> {
    const apiKey = apiKeyManager.getActiveApiKey();
    if (!apiKey) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/key`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': config.siteUrl || window.location.origin,
          'X-Title': config.appName || 'Super Okai',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          logger.debug('Invalid API key');
          return null;
        }
        throw new Error(`Failed to fetch key info: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      try {
        // Validate response data
        const validatedData = keyResponseSchema.parse(data);
        return validatedData;
      } catch (error) {
        logger.debug('Invalid response data format:', error);
        return null;
      }

    } catch (error) {
      // Only log as debug since this is expected when no key is set
      logger.debug('Error fetching key info:', error);
      return null;
    }
  }
}