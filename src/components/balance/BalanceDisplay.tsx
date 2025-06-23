import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { openRouterBalance } from '../../utils/openRouter';

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(openRouterBalance.getCurrentBalance());
  const [showBalance, setShowBalance] = useState(openRouterBalance.shouldShowBalance());

  useEffect(() => {
    if (!showBalance) return;

    // Start balance updates
    openRouterBalance.startBalanceUpdates(true);

    // Set up interval to check for balance updates
    const checkInterval = setInterval(() => {
      const currentBalance = openRouterBalance.getCurrentBalance();
      if (currentBalance !== balance) {
        setBalance(currentBalance);
      }
    }, 1000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [showBalance, balance]);

  useEffect(() => {
    const handleStorageChange = () => {
      setShowBalance(openRouterBalance.shouldShowBalance());
      const currentBalance = openRouterBalance.getCurrentBalance();
      setBalance(currentBalance);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!showBalance || balance === null) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded-lg text-sm">
      <Wallet className="h-4 w-4 text-green-400" />
      <span className="text-gray-300">
        {balance === Infinity ? (
          'Unlimited'
        ) : balance === 0 ? (
          '$0.00'
        ) : (
          `$${balance.toFixed(2)}`
        )}
      </span>
    </div>
  );
}