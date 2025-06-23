import React, { useState } from 'react';
import { Settings, AlertCircle, Cpu, Bot } from 'lucide-react';
import { ModelSelector } from '../model/ModelSelector';
import { PersonaSelector } from '../persona/PersonaSelector';
import { BalanceDisplay } from '../balance/BalanceDisplay';

interface AppHeaderProps {
  onOpenSettings: () => void;
  configError: string | null;
  onModelChange: (modelId: string) => void;
  currentPersona: string;
  onPersonaChange: (personaKey: string) => void;
}

export function AppHeader({ 
  onOpenSettings, 
  configError, 
  onModelChange,
  currentPersona,
  onPersonaChange
}: AppHeaderProps) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isPersonaSelectorOpen, setIsPersonaSelectorOpen] = useState(false);

  return (
    <header className="flex-none p-4 bg-black border-b border-emerald-950/30">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-transparent bg-clip-text">
          Super Okai
        </h1>
        <div className="flex items-center gap-3">
          {/* Persona Selector */}
          <button
            onClick={() => setIsPersonaSelectorOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-lg text-sm 
                     border border-emerald-950/30 hover:border-emerald-500/30 
                     transition-all duration-200 hover:scale-105 group relative overflow-hidden"
            title="Select AI Agent"
          >
            <Bot className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" />
            <span className="text-gray-300 group-hover:text-white transition-colors">
              AI Agent
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 
                          to-emerald-500/0 opacity-0 group-hover:opacity-100 
                          transition-opacity" />
          </button>

          {/* Model Selector */}
          <ModelSelector
            isOpen={isModelSelectorOpen}
            onClose={() => setIsModelSelectorOpen(false)}
            onModelChange={onModelChange}
          />
          <button
            onClick={() => setIsModelSelectorOpen(true)}
            className="p-2 text-gray-400 hover:text-emerald-400 transition-all duration-200 
                     rounded-lg hover:bg-emerald-950/20 hover:scale-110 border border-transparent 
                     hover:border-emerald-500/30 group"
            title="Select AI Model"
          >
            <Cpu className="h-5 w-5 transition-transform group-hover:rotate-180" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-400 hover:text-emerald-400 transition-all duration-200 
                     rounded-lg hover:bg-emerald-950/20 hover:scale-110 border border-transparent 
                     hover:border-emerald-500/30 group"
            title="Settings"
          >
            <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </button>

          {/* Balance Display */}
          <BalanceDisplay />
        </div>
      </div>

      {configError && (
        <div className="mt-2 p-3 rounded-lg flex items-center gap-2 bg-red-900/50 border border-red-500 text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{configError}</p>
        </div>
      )}

      <PersonaSelector
        isOpen={isPersonaSelectorOpen}
        onClose={() => setIsPersonaSelectorOpen(false)}
        currentPersona={currentPersona}
        onPersonaChange={onPersonaChange}
      />
    </header>
  );
}