import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <AlertCircle className="h-5 w-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-green-900/90',
    error: 'bg-red-900/90',
    info: 'bg-blue-900/90'
  };

  const borderColors = {
    success: 'border-green-500/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50'
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg ${bgColors[type]} ${borderColors[type]}`}>
      {icons[type]}
      <p className="text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}