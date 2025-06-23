import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { usePersonaList } from './hooks/usePersonaList';
import { CreatePersona } from './CreatePersona';
import { CreateButton } from './components/CreateButton';
import { PersonaCard } from './components/PersonaCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { ConfirmDialog } from '../../common/ConfirmDialog';

interface PersonaListProps {
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

export function PersonaList({ onSelect, onFeedback }: PersonaListProps) {
  const {
    personas,
    isLoading,
    isCreating,
    deletePersona,
    setIsCreating,
    setDeletePersona,
    handleCreated,
    handleDelete,
    handleDragEnd
  } = usePersonaList({ onSelect, onFeedback });

  if (isCreating) {
    return (
      <CreatePersona
        onCreated={handleCreated}
        onCancel={() => setIsCreating(false)}
        onFeedback={onFeedback}
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <CreateButton onClick={() => setIsCreating(true)} />

      {personas.length === 0 ? (
        <EmptyState />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="personas" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {personas.map((persona, index) => (
                  <Draggable
                    key={persona.id}
                    draggableId={persona.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          // Ensure grid layout is maintained during drag
                          gridColumn: snapshot.isDragging ? 'span 1' : undefined,
                          zIndex: snapshot.isDragging ? 50 : undefined,
                          // Keep card dimensions during drag
                          width: snapshot.isDragging ? 'var(--dragged-width)' : '100%',
                          height: snapshot.isDragging ? 'var(--dragged-height)' : '100%'
                        }}
                        className="relative"
                        onDragStart={(e) => {
                          const element = e.currentTarget;
                          // Store original dimensions
                          element.style.setProperty('--dragged-width', `${element.offsetWidth}px`);
                          element.style.setProperty('--dragged-height', `${element.offsetHeight}px`);
                        }}
                      >
                        <PersonaCard
                          persona={persona}
                          onSelect={onSelect}
                          onDelete={setDeletePersona}
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <ConfirmDialog
        isOpen={!!deletePersona}
        title="Delete AI Agent"
        message={`Are you sure you want to delete ${deletePersona?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletePersona(null)}
      />
    </div>
  );
}