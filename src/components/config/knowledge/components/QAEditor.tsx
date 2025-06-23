import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { QandA, KnowledgeCategory } from '../../../../utils/knowledge';

interface QAEditorProps {
  qa: QandA[];
  categories: KnowledgeCategory[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (qa: QandA[]) => void;
}

export function QAEditor({ qa, categories, onAdd, onRemove, onChange }: QAEditorProps) {
  const handleQAChange = (item: QandA) => {
    onChange(qa.map(q => q.id === item.id ? item : q));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Sample Q&As</h4>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 
                   rounded-lg hover:bg-emerald-600/30 transition-colors border 
                   border-emerald-500/20 hover:border-emerald-500/30 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Q&A
        </button>
      </div>

      {qa.map(item => (
        <div key={item.id} className="p-4 bg-black rounded-xl border border-emerald-950/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={e => handleQAChange({
                    ...item,
                    question: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30"
                  placeholder="e.g., What are the best practices for state management in React?"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A common question that users might ask about this topic.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={item.answer}
                  onChange={e => handleQAChange({
                    ...item,
                    answer: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30 font-mono"
                  rows={6}
                  placeholder={`Example answer:
For state management in React, consider these best practices:

1. Use useState for simple component state
2. Implement useReducer for complex state logic
3. Consider Context API for shared state
4. Use state management libraries (Redux, Zustand) for large applications

Choose the approach that best fits your application's complexity and needs.`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  A detailed, well-structured answer that demonstrates the expected response format.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Category
                </label>
                <select
                  value={item.category}
                  onChange={e => handleQAChange({
                    ...item,
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
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors 
                       rounded-lg hover:bg-red-950/20"
              title="Remove Q&A"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}