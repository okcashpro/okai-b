import { z } from 'zod';

export interface KeyResponse {
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

export interface BalanceState {
  balance: number | null;
  showBalance: boolean;
  isInitialFetch: boolean;
}

export interface BalancePreferences {
  showBalance: boolean;
}

// Validation schemas
export const keyResponseSchema = z.object({
  data: z.object({
    label: z.string(),
    usage: z.number(),
    limit: z.number().nullable(),
    is_free_tier: z.boolean(),
    rate_limit: z.object({
      requests: z.number(),
      interval: z.string()
    })
  })
});