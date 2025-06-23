import React from 'react';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-8 text-red-400">
      {error}
    </div>
  );
}