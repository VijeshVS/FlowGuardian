import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AlertData } from '../types';

interface AlertBannerProps {
  alert: AlertData;
  onDismiss: (id: string) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
  const severityStyles = {
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    critical: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`flex items-center justify-between px-4 py-3 border rounded-lg mb-4 ${severityStyles[alert.severity]}`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <span className="font-medium">{alert.message}</span>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="p-1 hover:bg-black/5 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}