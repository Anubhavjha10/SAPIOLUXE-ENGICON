import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({
  message = 'Loading Sapioluxe Data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="w-8 h-8 text-tertiary-fixed-dim animate-spin" />
      <span className="font-mono-technical text-xs text-secondary uppercase tracking-widest">
        {message}
      </span>
    </div>
  );
};
