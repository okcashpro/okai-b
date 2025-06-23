import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { KnowledgeCategory } from '../../../../utils/knowledge';

interface CategoryEditorProps {
  categories: KnowledgeCategory[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (categories: KnowledgeCategory[]) => void;
}

export function CategoryEditor({ categories, onAdd, onRemove, onChange }: CategoryEditorProps) {
  const handleCategoryChange = (category: KnowledgeCategory) => {
    onChange(categories.map(c => c.id === category.id ? category : c));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">Categories</h4>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 
                   rounded-lg hover:bg-emerald-600/30 transition-colors border 
                   border-emerald-500/20 hover:border-emerald-500/30 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {categories.map(category => (
        <div key={category.id} className="p-4 bg-black rounded-xl border border-emerald-950/30">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={category.name}
                  onChange={e => handleCategoryChange({
                    ...category,
                    name: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30"
                  placeholder="e.g., Basics, Technical, Best Practices"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A descriptive name for this category of knowledge.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <input
                  type="text"
                  value={category.description}
                  onChange={e => handleCategoryChange({
                    ...category,
                    description: e.target.value
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30"
                  placeholder="e.g., Fundamental concepts and principles"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Topics (one per line) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={category.topics.join('\n')}
                  onChange={e => handleCategoryChange({
                    ...category,
                    topics: e.target.value.split('\n').filter(t => t.trim())
                  })}
                  className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                           focus:border-emerald-500/30 font-mono"
                  rows={6}
                  placeholder={`Example topics:
React and React Hooks
State Management
API Integration
Performance Optimization
Testing Strategies
Deployment Practices`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  List specific topics covered in this category. Enter each topic on a new line.
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemove(category.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors 
                       rounded-lg hover:bg-red-950/20"
              title="Remove category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}