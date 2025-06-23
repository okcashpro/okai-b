import React from 'react';
import { Bot, Sparkles, Trash2, GripVertical } from 'lucide-react';
import type { PersonaMetadata } from '../../../../utils/personas';
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

interface PersonaCardProps {
  persona: PersonaMetadata;
  onSelect: (id: string) => void;
  onDelete: (persona: PersonaMetadata) => void;
  isDragging: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export function PersonaCard({
  persona,
  onSelect,
  onDelete,
  isDragging,
  dragHandleProps
}: PersonaCardProps) {
  return (
    <div
      className={`group relative w-full text-left bg-black rounded-xl border 
                transition-all duration-200 hover:scale-[1.02] cursor-pointer
                ${isDragging 
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                  : 'border-emerald-950/30 hover:border-emerald-500/20'}`}
      style={{
        width: isDragging ? '220px' : '100%',
        minHeight: '120px',
        transform: isDragging ? 'rotate(2deg)' : undefined,
        zIndex: isDragging ? 9999 : 'auto'
      }}
      onClick={() => onSelect(persona.id)}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-20"
        onClick={e => e.stopPropagation()}
      >
        <GripVertical className="h-5 w-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
      </div>

      {/* Card Content */}
      <div className="p-4 pl-10">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-5 w-5 text-emerald-400" />
          <h4 className="font-medium text-white group-hover:text-emerald-400 
                      transition-colors line-clamp-1 flex-1">
            {persona.name}
          </h4>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2">
          {persona.description}
        </p>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(persona);
          }}
          className="absolute top-2 right-2 p-2 text-red-400 hover:text-red-300 
                   hover:bg-red-950/20 rounded-lg transition-all duration-200 
                   hover:scale-110 border border-transparent hover:border-red-500/20
                   opacity-0 group-hover:opacity-100"
          title={`Delete ${persona.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Sparkles Icon - Moved to bottom right */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 
                     transition-opacity">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 
                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity 
                    pointer-events-none" />
    </div>
  );
}