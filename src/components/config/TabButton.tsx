import React from 'react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function TabButton({ isActive, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`px-4 py-2 font-medium transition-colors ${
        isActive
          ? 'text-emerald-400 border-b-2 border-emerald-500'
          : 'text-gray-400 hover:text-emerald-400'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}