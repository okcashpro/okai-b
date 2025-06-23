import React, { useState, useEffect } from 'react';
import { X, Cpu, Check, Sparkles, Zap } from 'lucide-react';
import { models, getSelectedModel, setSelectedModel } from '../../config/models';
import { useChatFocus } from '../../hooks/useChatFocus';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ isOpen, onClose, onModelChange }: ModelSelectorProps) {
  const [selectedModelId, setSelectedModelId] = useState(getSelectedModel());
  const { focusInput } = useChatFocus();

  useEffect(() => {
    if (isOpen) {
      setSelectedModelId(getSelectedModel());
    }
  }, [isOpen]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedModelId(modelId);
    onModelChange(modelId);
    onClose();
    requestAnimationFrame(() => {
      focusInput();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl shadow-xl w-full max-w-lg border border-emerald-950/30 max-h-[90vh] flex flex-col">
        <div className="flex-none flex items-center justify-between p-4 border-b border-emerald-950/30">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-400" />
            Select AI Model
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-emerald-950/20 p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid gap-3">
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`group relative w-full text-left bg-black rounded-xl transition-all duration-200 border
                  ${selectedModelId === model.id 
                    ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                    : 'border-emerald-950/30 hover:border-emerald-500/20 hover:scale-[1.02]'}`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                          {model.name}
                          {selectedModelId === model.id && (
                            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                          )}
                        </h3>
                        {model.isFree && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 rounded-full flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {model.description}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${selectedModelId === model.id 
                        ? 'border-emerald-500 bg-emerald-500/20' 
                        : 'border-emerald-950/30 group-hover:border-emerald-500/20'}`}
                    >
                      {selectedModelId === model.id && (
                        <Check className="h-3 w-3 text-emerald-400" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-mono">
                    {model.id}
                  </div>
                </div>
                {selectedModelId === model.id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 animate-pulse pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}