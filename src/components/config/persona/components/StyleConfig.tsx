import React from 'react';
import type { PersonaStore, PersonaStyle } from '../../../../utils/personas/types';

interface StyleConfigProps {
  store: PersonaStore;
  onChange: (store: PersonaStore) => void;
}

export function StyleConfig({ store, onChange }: StyleConfigProps) {
  // Helper function to safely extract function body
  const extractFunctionBody = (fn: ((content: string) => string) | undefined): string => {
    if (!fn) return '';
    try {
      const fnStr = fn.toString();
      const match = fnStr.match(/return\s+(.+)/);
      return match ? match[1].trim() : '';
    } catch (error) {
      console.error('Error extracting function body:', error);
      return '';
    }
  };

  return (
    <div className="p-4 bg-black rounded-xl border border-emerald-950/30">
      <h4 className="font-medium text-white mb-4">Style Configuration</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Emoticons (one per line)
          </label>
          <textarea
            value={store.style?.emoticons?.join('\n') || ''}
            onChange={e => {
              const emoticons = e.target.value.split('\n').filter(em => em.trim());
              onChange({
                ...store,
                style: {
                  ...store.style || {},
                  emoticons
                }
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={4}
            placeholder={`Example emoticons:
(｀・ω・´)
(◕‿◕✿)
(ﾉ◕ヮ◕)ﾉ*:･ﾟ✨
(≧▽≦)
(´･ω･\`)`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Expressions (one per line)
          </label>
          <textarea
            value={store.style?.expressions?.join('\n') || ''}
            onChange={e => {
              const expressions = e.target.value.split('\n').filter(ex => ex.trim());
              onChange({
                ...store,
                style: {
                  ...store.style || {},
                  expressions
                }
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={4}
            placeholder={`Example expressions:
sugoi
kawaii
subarashii
nya
desu`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            End Phrases (one per line)
          </label>
          <textarea
            value={store.style?.endPhrases?.join('\n') || ''}
            onChange={e => {
              const endPhrases = e.target.value.split('\n').filter(ep => ep.trim());
              onChange({
                ...store,
                style: {
                  ...store.style || {},
                  endPhrases
                }
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={4}
            placeholder={`Example end phrases:
~
✨
!
🚀
⚡`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Removals (one regex pattern per line)
          </label>
          <textarea
            value={store.style?.removals?.map(r => r.source).join('\n') || ''}
            onChange={e => {
              const removals = e.target.value
                .split('\n')
                .filter(r => r.trim())
                .map(r => new RegExp(r, 'gi'));
              onChange({
                ...store,
                style: {
                  ...store.style || {},
                  removals
                }
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={4}
            placeholder={`Example removal patterns:
(\b|^)I apologize\b
(\b|^)sorry\b
knowledge base|previous response|as an AI|AI assistant`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Formatters (one function per line)
          </label>
          <textarea
            value={(store.style?.formatters || []).map(extractFunctionBody).join('\n')}
            onChange={e => {
              const formatters = e.target.value
                .split('\n')
                .filter(f => f.trim())
                .map(f => new Function('content', `return ${f}`) as (content: string) => string);
              onChange({
                ...store,
                style: {
                  ...store.style || {},
                  formatters
                }
              });
            }}
            className="w-full px-3 py-2 bg-black border border-emerald-950/30 rounded-lg 
                     text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                     focus:border-emerald-500/30 font-mono"
            rows={4}
            placeholder={`Example formatters:
content.replace(/!+/g, '~! ✨')
content.replace(/\b(that|which|who)\b/gi, '')
content.replace(/good|great/gi, 'insanely great')`}
          />
        </div>
      </div>
    </div>
  );
}