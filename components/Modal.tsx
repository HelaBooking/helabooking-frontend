import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-elevation-3 border-t sm:border border-neutral-200 dark:border-neutral-700 w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto animate-slide-up sm:animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
        
        {/* Drag Handle for Mobile */}
        <div className="sm:hidden flex justify-center pt-2 pb-1">
          <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Title with Close Button */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 pr-4">{title}</h3>
            <button 
              onClick={onClose} 
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-600 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors duration-200 flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;