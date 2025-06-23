import React from 'react';
import { openRouterBalance } from '../../utils/openRouterBalance';

interface SuperOkaiConfigProps {
  showBalance: boolean;
  onShowBalanceChange: (show: boolean) => void;
}

export function SuperOkaiConfig({ showBalance, onShowBalanceChange }: SuperOkaiConfigProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Super Okai Configuration</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="show-balance" className="block text-sm font-medium text-gray-300">
              Show OpenRouter Balance
            </label>
            <p className="text-sm text-gray-500">
              Display your remaining OpenRouter balance in the chat interface
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="show-balance"
              className="sr-only peer"
              checked={showBalance}
              onChange={(e) => onShowBalanceChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}