import { useState, useEffect, useCallback } from 'react';
import { DragEndEvent } from '@hello-pangea/dnd';
import { personaManager } from '../../../../utils/personas';
import { restoreManager } from '../../../../utils/restore';
import { logger } from '../../../../utils/logger';
import type { PersonaMetadata } from '../../../../utils/personas';

interface UsePersonaListProps {
  onSelect: (id: string) => void;
  onFeedback: (message: string) => void;
}

function usePersonaList({ onSelect, onFeedback }: UsePersonaListProps) {
  const [personas, setPersonas] = useState<PersonaMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletePersona, setDeletePersona] = useState<PersonaMetadata | null>(null);

  const loadPersonas = useCallback(async () => {
    try {
      const list = await personaManager.listPersonas();
      // Sort by stored order
      const sortedList = list.sort((a, b) => {
        const orderA = restoreManager.getPersonaOrder(a.id);
        const orderB = restoreManager.getPersonaOrder(b.id);
        return orderA - orderB;
      });
      setPersonas(sortedList);
    } catch (error) {
      logger.error('Error loading personas:', error);
      onFeedback('Failed to load personas');
    } finally {
      setIsLoading(false);
    }
  }, [onFeedback]);

  // Listen for storage changes to reload personas
  useEffect(() => {
    const handleStorageChange = () => {
      void loadPersonas();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadPersonas]);

  useEffect(() => {
    void loadPersonas();
  }, [loadPersonas]);

  const handleCreated = useCallback(async (id: string) => {
    setIsCreating(false);
    await loadPersonas();
    onSelect(id);
  }, [loadPersonas, onSelect]);

  const handleDelete = useCallback(async () => {
    if (!deletePersona) return;

    try {
      await personaManager.deletePersona(deletePersona.id);
      onFeedback('AI agent deleted successfully');
      await loadPersonas();
    } catch (error) {
      if (error instanceof Error && error.message.includes('built-in')) {
        onFeedback('Cannot delete built-in AI agent');
      } else {
        logger.error('Error deleting persona:', error);
        onFeedback('Failed to delete AI agent');
      }
    } finally {
      setDeletePersona(null);
    }
  }, [deletePersona, loadPersonas, onFeedback]);

  const handleDragEnd = useCallback(async (result: DragEndEvent) => {
    const { destination, source } = result;

    // Drop outside the list or no movement
    if (!destination || destination.index === source.index) {
      return;
    }

    try {
      // Create a new array with the updated order
      const newPersonas = Array.from(personas);
      const [removed] = newPersonas.splice(source.index, 1);
      newPersonas.splice(destination.index, 0, removed);

      // Update display orders
      const updatedPersonas = newPersonas.map((persona, index) => ({
        ...persona,
        displayOrder: index * 10 // Use multiples of 10 to allow for future insertions
      }));

      // Create a map of new orders
      const orderMap = new Map(
        updatedPersonas.map(p => [p.id, p.displayOrder])
      );

      // Update UI immediately
      setPersonas(updatedPersonas);

      // Save the new orders
      await restoreManager.updatePersonaOrders(orderMap);
      onFeedback('Order saved successfully');

    } catch (error) {
      logger.error('Error updating order:', error);
      onFeedback('Failed to save order');
      await loadPersonas(); // Reload original order on error
    }
  }, [personas, loadPersonas, onFeedback]);

  return {
    personas,
    isLoading,
    isCreating,
    deletePersona,
    setIsCreating,
    setDeletePersona,
    handleCreated,
    handleDelete,
    handleDragEnd
  };
}

export { usePersonaList };