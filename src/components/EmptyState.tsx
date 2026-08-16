import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are currently no items to display in this section.',
  actionText,
  onAction,
}) => {
  return (
    <div className="border border-dashed border-outline-variant p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
      <FolderOpen className="w-12 h-12 text-outline" />
      <div>
        <h4 className="font-headline-md text-lg font-bold text-primary mb-1">{title}</h4>
        <p className="font-body-md text-xs text-secondary max-w-md mx-auto">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary px-6 py-2.5 font-label-caps text-xs hover:bg-tertiary-fixed-dim hover:text-tertiary-container transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
