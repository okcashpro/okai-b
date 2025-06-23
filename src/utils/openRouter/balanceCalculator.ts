import type { KeyResponse } from './types';

export class BalanceCalculator {
  calculateBalance(keyInfo: KeyResponse): number {
    const { limit, usage, is_free_tier } = keyInfo.data;

    // If there's no usage data, return 0
    if (typeof usage !== 'number') {
      return 0;
    }

    // For free tier accounts
    if (is_free_tier) {
      return limit === null ? 0 : Math.max(0, limit - usage);
    }

    // For prepaid accounts (limit is null)
    if (limit === null) {
      return usage; // Usage field contains the remaining balance
    }

    // For rate-limited accounts
    return Math.max(0, limit - usage);
  }
}