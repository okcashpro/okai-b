import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { personaManager } from '../../../utils/personas';
import type { PersonaStore, PersonaStyle } from '../../../utils/personas';

interface CreatePersonaProps {
  onCreated: (id: string) => void;
  onCancel: () => void;
  onFeedback: (message: string) => void;
}

export function CreatePersona({ onCreated, onCancel, onFeedback }: CreatePersonaProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [chatLength, setChatLength] = useState<'short' | 'normal' | 'long'>('normal');
  const [customKnowledge, setCustomKnowledge] = useState('');
  
  // Style fields
  const [emoticons, setEmoticons] = useState('');
  const [expressions, setExpressions] = useState('');
  const [endPhrases, setEndPhrases] = useState('');
  const [removals, setRemovals] = useState('');
  const [formatters, setFormatters] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onFeedback('Please enter a persona name');
      return;
    }

    try {
      // Create style object if any style fields are filled
      let style: PersonaStyle | undefined;
      if (emoticons || expressions || endPhrases || removals || formatters) {
        style = {
          emoticons: emoticons.split('\n').filter(e => e.trim()),
          expressions: expressions.split('\n').filter(e => e.trim()),
          endPhrases: endPhrases.split('\n').filter(e => e.trim()),
          removals: removals.split('\n')
            .filter(r => r.trim())
            .map(r => new RegExp(r.trim(), 'gi')),
          formatters: formatters.split('\n')
            .filter(f => f.trim())
            .map(f => new Function('content', `return ${f}`) as (content: string) => string)
        };
      }

      // Create initial persona store
      const store: PersonaStore = {
        metadata: {
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name.trim(),
          description: description.trim(),
          version: '1.0.0',
          lastModified: Date.now(),
          chatLength
        },
        systemPrompt: systemPrompt.trim(),
        knowledgeBases: [],
        customKnowledge: customKnowledge.split('\n').filter(k => k.trim())
      };

      // Transform to persona format
      const persona = {
        name: store.metadata.name,
        description: store.metadata.description,
        systemPrompt: store.systemPrompt,
        knowledgeBases: store.knowledgeBases,
        customKnowledge: store.customKnowledge,
        chatLength: store.metadata.chatLength,
        style
      };

      await personaManager.savePersona(store.metadata.id, persona);
      onFeedback('AI agent created successfully');
      onCreated(store.metadata.id);
    } catch (error) {
      console.error('Error creating persona:', error);
      onFeedback('Failed to create AI agent');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Create New AI Agent</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech Expert, Creative Writer, Support Agent"
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A knowledgeable technical expert specializing in software development and system architecture."
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Chat Length
            </label>
            <select
              value={chatLength}
              onChange={(e) => setChatLength(e.target.value as 'short' | 'normal' | 'long')}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30"
            >
              <option value="short">Short (1-2 sentences)</option>
              <option value="normal">Normal (2-3 paragraphs)</option>
              <option value="long">Long (Detailed explanations)</option>
            </select>
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            System Prompt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder={`You are a [role/expertise]. Communicate in a [style/tone] manner.

Example:
You are a senior software architect with expertise in system design and best practices. Communicate in a clear, professional manner, using technical terms appropriately while making complex concepts understandable. Share practical examples and focus on maintainable, scalable solutions.`}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
            rows={8}
            required
          />
        </div>

        {/* Custom Knowledge */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Custom Knowledge (one per line)
          </label>
          <textarea
            value={customKnowledge}
            onChange={(e) => setCustomKnowledge(e.target.value)}
            placeholder={`Example topics:
Software architecture patterns
Cloud infrastructure
DevOps practices
API design principles
Performance optimization
Security best practices`}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
            rows={6}
          />
        </div>

        {/* Style Configuration */}
        <div className="space-y-4">
          <h4 className="font-medium text-white">Style Configuration</h4>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Emoticons (one per line)
            </label>
            <textarea
              value={emoticons}
              onChange={(e) => setEmoticons(e.target.value)}
              placeholder={`Example emoticons:
(｀・ω・´)
(◕‿◕✿)
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✨
(≧▽≦)
(´･ω･\`)`}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Expressions (one per line)
            </label>
            <textarea
              value={expressions}
              onChange={(e) => setExpressions(e.target.value)}
              placeholder={`Example expressions:
sugoi
kawaii
subarashii
nya
desu`}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              End Phrases (one per line)
            </label>
            <textarea
              value={endPhrases}
              onChange={(e) => setEndPhrases(e.target.value)}
              placeholder={`Example end phrases:
~
✨
!
🚀
⚡`}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Removals (one regex pattern per line)
            </label>
            <textarea
              value={removals}
              onChange={(e) => setRemovals(e.target.value)}
              placeholder={`Example removal patterns:
(\b|^)I apologize\b
(\b|^)sorry\b
knowledge base|previous response|as an AI|AI assistant`}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Formatters (one function per line)
            </label>
            <textarea
              value={formatters}
              onChange={(e) => setFormatters(e.target.value)}
              placeholder={`Example formatters:
content.replace(/!+/g, '~! ✨')
content.replace(/\b(that|which|who)\b/gi, '')
content.replace(/good|great/gi, 'insanely great')`}
              className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20 focus:border-emerald-500/30 font-mono"
              rows={4}
            />
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
            Create AI Agent
          </button>
        </div>
      </form>
    </div>
  );
}