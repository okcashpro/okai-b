import React from 'react';
import { Key } from 'lucide-react';

interface APISettingsProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export function APISettings({ apiKey, onApiKeyChange }: APISettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">API Configuration</h3>
      <div className="space-y-2">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">
          OpenRouter API Key
        </label>
        <div className="relative group">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 
                         transition-transform group-hover:scale-110" />
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-black border border-emerald-950/30 
                     rounded-lg text-white placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 transition-all duration-200 
                     hover:border-emerald-500/20"
            placeholder="Enter your OpenRouter API key"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r 
                        from-emerald-500/5 to-transparent opacity-0 
                        group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <p className="text-sm text-gray-400">
          Get your API key from{' '}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            OpenRouter
          </a>
        </p>
      </div>
    </div>
  );
}