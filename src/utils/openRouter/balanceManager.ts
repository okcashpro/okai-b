import { logger } from '../logger';
import { OpenRouterAPI } from './api';
import { BalanceStorage } from './storage';
import { BalanceCalculator } from './balanceCalculator';
import type { BalanceState } from './types';

export class BalanceManager {
  private static instance: BalanceManager;
  private state: BalanceState;
  private updateInterval: number | null = null;
  private readonly updateFrequency = 120000; // 2 minutes
  private readonly retryDelay = 30000; // 30 seconds
  private retryTimeout: number | null = null;
  private retryCount = 0;
  private readonly maxRetries = 3;
  
  private api = new OpenRouterAPI();
  private storage = new BalanceStorage();
  private calculator = new BalanceCalculator();

  private constructor() {
    const prefs = this.storage.getPreferences();
    const cachedBalance = this.storage.getCachedBalance();

    this.state = {
      balance: cachedBalance,
      showBalance: prefs.showBalance,
      isInitialFetch: true
    };
  }

  static getInstance(): BalanceManager {
    if (!this.instance) {
      this.instance = new BalanceManager();
    }
    return this.instance;
  }

  private scheduleRetry(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    // Only retry if we haven't exceeded max retries
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.retryTimeout = window.setTimeout(() => {
        void this.fetchBalance();
      }, this.retryDelay * this.retryCount); // Exponential backoff
    } else {
      logger.warn('Max balance fetch retries exceeded');
      this.retryCount = 0; // Reset for next time
    }
  }

  async fetchBalance(): Promise<number | null> {
    try {
      const keyInfo = await this.api.fetchKeyInfo();
      
      if (!keyInfo) {
        if (this.state.isInitialFetch) {
          logger.info('No API key available for initial balance fetch');
          this.state.isInitialFetch = false;
          this.scheduleRetry();
        }
        return this.state.balance;
      }

      const newBalance = this.calculator.calculateBalance(keyInfo);
      
      // Update state and cache
      this.state.balance = newBalance;
      this.storage.cacheBalance(newBalance);
      this.state.isInitialFetch = false;
      this.retryCount = 0; // Reset retry count on success
      
      // Clear any pending retry
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
      
      return newBalance;

    } catch (error) {
      // Only log error details for initial fetch or if it's not a missing API key
      if (this.state.isInitialFetch) {
        logger.debug('Error during initial balance fetch:', error);
        this.state.isInitialFetch = false;
        this.scheduleRetry();
      }
      return this.state.balance;
    }
  }

  startBalanceUpdates(immediate = true): void {
    this.stopBalanceUpdates();
    
    if (immediate) {
      void this.fetchBalance();
    }
    
    this.updateInterval = window.setInterval(() => {
      void this.fetchBalance();
    }, this.updateFrequency);
  }

  stopBalanceUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    this.retryCount = 0;
  }

  getCurrentBalance(): number | null {
    return this.state.balance;
  }

  shouldShowBalance(): boolean {
    return this.state.showBalance;
  }

  setShowBalancePreference(show: boolean): void {
    this.state.showBalance = show;
    this.storage.savePreferences({ showBalance: show });
  }
}

export const balanceManager = BalanceManager.getInstance();