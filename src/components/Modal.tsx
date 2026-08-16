import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`bg-surface border border-outline-variant w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8`}
      >
        <div className="flex justify-between items-center pb-4 mb-6 border-b technical-line">
          {title && <h3 className="font-headline-md text-xl font-bold text-primary">{title}</h3>}
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 transition-colors ml-auto"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
