import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { KnowledgePrompt, KnowledgeCategory } from '../../../../utils/knowledge';

interface PromptEditorProps {
  prompts: KnowledgePrompt[];
  categories: KnowledgeCategory[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (prompts: KnowledgePrompt[]) => void;
}

export function PromptEditor({ prompts, categories, onAdd, onRemove, onChange }: PromptEditorProps) {
  const handlePromptChange = (prompt: KnowledgePrompt) => {
    onChange(prompts.map(p => p.id === prompt.id ? prompt : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Context-Specific Prompts</h4>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 
                   rounded-lg hover:bg-emerald-600/30 transition-colors border 
                   border-emerald-500/20 hover:border-emerald-500/30 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Prompt
        </button>
      </div>

      {prompts.map(prompt => (
        <div key={prompt.id} className="p-4 bg-black rounded-xl border border-emerald-950/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Prompt Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={prompt.name}
                  onChange={e => handlePromptChange({
                    ...prompt,
                    name: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30"
                  placeholder="e.g., Technical Support, User Guide, Best Practices"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A descriptive name for this context-specific prompt.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  value={prompt.category}
                  onChange={e => handlePromptChange({
                    ...prompt,
                    category: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Prompt Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={prompt.content}
                  onChange={e => handlePromptChange({
                    ...prompt,
                    content: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30 font-mono"
                  rows={6}
                  placeholder={`Example prompt:
You have extensive knowledge about [topic]. Share your expertise with a focus on:
1. Best practices and industry standards
2. Common pitfalls and how to avoid them
3. Performance and optimization techniques
4. Security considerations

Always provide practical examples and real-world applications.`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Instructions for how this knowledge should be used and presented in this context.
                  Include key points to focus on and any specific guidance for responses.
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemove(prompt.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors 
                       rounded-lg hover:bg-red-950/20"
              title="Remove prompt"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}