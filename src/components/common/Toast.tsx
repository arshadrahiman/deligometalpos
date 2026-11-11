import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useUIStore();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-brand-blue text-white',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg px-4 py-3 shadow-xl max-w-md animate-fade-in text-xs font-medium ${bgStyles}">
      <div className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 shadow-xl ${bgStyles}`}>
        <Icon className="h-4 w-4 shrink-0" />
        <span>{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-2 rounded p-0.5 hover:bg-white/20 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
