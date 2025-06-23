import { apiKeyManager } from './apiKeyManager';
import { logger } from './logger';
import { config } from '../config/env';
import { cache } from './cache';

interface KeyResponse {
  data: {
    label: string;
    usage: number;
    limit: number | null;
    is_free_tier: boolean;
    rate_limit: {
      requests: number;
      interval: string;
    };
  };
}

class OpenRouterBalance {
  private static instance: OpenRouterBalance;
  private balance: number | null = null;
  private updateInterval: number | null = null;
  private readonly storageKey = 'super_okai_show_balance';
  private readonly cacheKey = 'openrouter_balance';
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes
  private showBalance: boolean;
  private isInitialFetch = true;

  private constructor() {
    this.showBalance = this.getShowBalancePreference();
    // Load cached balance on initialization
    this.loadCachedBalance();
  }

  static getInstance(): OpenRouterBalance {
    if (!this.instance) {
      this.instance = new OpenRouterBalance();
    }
    return this.instance;
  }

  private loadCachedBalance(): void {
    const cached = cache.get<number>(this.cacheKey);
    if (cached !== null) {
      this.balance = cached;
    }
  }

  private saveCachedBalance(balance: number): void {
    this.balance = balance;
    cache.set(this.cacheKey, balance, { maxAge: this.cacheDuration });
  }

  async fetchBalance(): Promise<number | null> {
    try {
      const apiKey = apiKeyManager.getActiveApiKey();
      if (!apiKey) {
        if (this.isInitialFetch) {
          logger.warn('No API key available for initial balance fetch');
          this.isInitialFetch = false;
        }
        return this.balance; // Return cached balance if available
      }

      const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': config.siteUrl || window.location.origin,
          'X-Title': config.appName || 'Super Okai',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as KeyResponse;
      
      // Validate response data
      if (!data?.data) {
        throw new Error('Invalid response data structure');
      }

      // Calculate balance based on usage and limit
      let newBalance: number;
      if (data.data.limit === null) {
        // If limit is null and it's not a free tier, user has unlimited credits
        newBalance = data.data.is_free_tier ? 0 : Infinity;
      } else {
        // Calculate remaining credits: limit - usage
        newBalance = Math.max(0, data.data.limit - (data.data.usage || 0));
      }

      // Update and cache the balance
      this.saveCachedBalance(newBalance);
      this.isInitialFetch = false;
      
      return newBalance;

    } catch (error) {
      // Only log detailed error on initial fetch or if it's not a missing API key
      if (this.isInitialFetch || apiKeyManager.getActiveApiKey()) {
        logger.error('Error fetching OpenRouter balance:', error);
        this.isInitialFetch = false;
      }
      
      // Return cached balance on error
      return this.balance;
    }
  }

  startBalanceUpdates(immediate = true): void {
    this.stopBalanceUpdates(); // Clear any existing interval
    
    if (immediate) {
      void this.fetchBalance();
    }
    
    // Update every 2 minutes
    this.updateInterval = window.setInterval(() => {
      void this.fetchBalance();
    }, 120000);
  }

  stopBalanceUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  getCurrentBalance(): number | null {
    return this.balance;
  }

  getShowBalancePreference(): boolean {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  }

  setShowBalancePreference(show: boolean): void {
    this.showBalance = show;
    localStorage.setItem(this.storageKey, JSON.stringify(show));
    // Trigger a window storage event for other components
    window.dispatchEvent(new Event('storage'));
  }

  shouldShowBalance(): boolean {
    return this.showBalance;
  }
}

export const openRouterBalance = OpenRouterBalance.getInstance();