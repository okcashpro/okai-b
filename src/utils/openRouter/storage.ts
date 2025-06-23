import { logger } from '../logger';
import { cache } from '../cache';
import type { BalancePreferences } from './types';

export class BalanceStorage {
  private readonly storageKey = 'super_okai_show_balance';
  private readonly cacheKey = 'openrouter_balance';
  private readonly cacheDuration = 3 * 60 * 1000; // 3 minutes

  getPreferences(): BalancePreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return {
        showBalance: stored ? JSON.parse(stored) : true
      };
    } catch (error) {
      logger.error('Error reading balance preferences:', error);
      return { showBalance: true };
    }
  }

  savePreferences(prefs: BalancePreferences): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(prefs.showBalance));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      logger.error('Error saving balance preferences:', error);
    }
  }

  getCachedBalance(): number | null {
    return cache.get<number>(this.cacheKey);
  }

  cacheBalance(balance: number): void {
    cache.set(this.cacheKey, balance, { maxAge: this.cacheDuration });
  }
}