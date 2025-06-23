import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { knowledgeManager } from '../../../utils/knowledge';
import type { KnowledgeStore } from '../../../utils/knowledge';

interface CreateKnowledgeBaseProps {
  onCreated: (id: string) => void;
  onCancel: () => void;
  onFeedback: (message: string) => void;
}

export function CreateKnowledgeBase({ onCreated, onCancel, onFeedback }: CreateKnowledgeBaseProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [topics, setTopics] = useState('');
  const [prompt, setPrompt] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [knowledgeData, setKnowledgeData] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onFeedback('Please enter a knowledge base name');
      return;
    }

    if (!knowledgeData.trim()) {
      onFeedback('Please enter knowledge details');
      return;
    }

    try {
      // Create initial knowledge store
      const store: KnowledgeStore = {
        metadata: {
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name.trim(),
          description: description.trim() || `Knowledge base for ${name.trim()}`,
          version: '1.0.0',
          lastModified: Date.now(),
          categories: ['general'],
          promptCount: prompt ? 1 : 0,
          qaCount: question && answer ? 1 : 0,
          knowledgeData: knowledgeData.trim()
        },
        categories: [{
          id: 'general',
          name: category.trim() || 'General',
          description: 'General topics',
          topics: topics.split('\n').filter(t => t.trim())
        }],
        prompts: prompt ? [{
          id: 'default',
          name: 'Default Prompt',
          content: prompt.trim(),
          category: 'general'
        }] : [],
        qa: (question && answer) ? [{
          id: 'qa-1',
          question: question.trim(),
          answer: answer.trim(),
          category: 'general',
          tags: [],
          lastModified: Date.now()
        }] : [],
        knowledgeData: knowledgeData.trim()
      };

      // Transform to knowledge base format
      const kb = {
        name: store.metadata.name,
        topics: {
          [store.categories[0].name]: store.categories[0].topics
        },
        prompts: {
          'default': store.prompts[0]?.content || ''
        },
        sampleQA: store.qa.length > 0 ? {
          'general': [{
            question: store.qa[0].question,
            answer: store.qa[0].answer
          }]
        } : undefined,
        knowledgeData: store.knowledgeData
      };

      await knowledgeManager.saveKnowledgeBase(store.metadata.id, kb);
      onFeedback('Knowledge base created successfully');
      onCancel(); // Return to list view
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      onFeedback('Failed to create knowledge base');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Create New Knowledge Base</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Web Development, Machine Learning, Project Management"
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Knowledge Details <span className="text-red-500">*</span>
          </label>
          <textarea
            value={knowledgeData}
            onChange={(e) => setKnowledgeData(e.target.value)}
            placeholder="Enter detailed knowledge that the AI agent should know about this domain..."
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
            rows={10}
            required
          />
          <p className="text-sm text-gray-500">
            Comprehensive knowledge that will be used by AI agents to understand this domain.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Frontend, Backend, DevOps, Best Practices"
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Topics (one per line) <span className="text-red-500">*</span>
          </label>
          <textarea
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder={`Example topics:
React and React Hooks
State Management
API Integration
Performance Optimization
Testing Strategies
Deployment Practices`}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Default Prompt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Example prompt:
You are an expert in web development. Share your knowledge about modern development practices, focusing on:
1. Best practices and industry standards
2. Common pitfalls and how to avoid them
3. Performance and optimization techniques
4. Security considerations
Always provide practical examples and real-world applications.`}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Sample Q&A
          </label>
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are the best practices for state management in React?"
                className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/20 focus:border-emerald-500/30"
              />
            </div>

            <div className="space-y-2">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={`Example answer:
For state management in React, consider these best practices:

1. Use useState for simple component state
2. Implement useReducer for complex state logic
3. Consider Context API for shared state
4. Use state management libraries (Redux, Zustand) for large applications

Choose the approach that best fits your application's complexity and needs.`}
                className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
                rows={6}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 
                     rounded-lg hover:bg-emerald-600/30 transition-colors border 
                     border-emerald-500/20 hover:border-emerald-500/30"
          >
            <Plus className="h-4 w-4" />
            Create Knowledge Base
          </button>
        </div>
      </form>
    </div>
  );
}