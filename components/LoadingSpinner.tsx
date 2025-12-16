import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-white dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-6">
        {/* Lucide Spinner */}
        <Loader size={64} className="animate-spin text-primary dark:text-primary-light" />
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Loading</p>
          <div className="flex gap-1 justify-center mt-2">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-light animate-bounce" style={{animationDelay: '0s'}}></span>
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-light animate-bounce" style={{animationDelay: '0.2s'}}></span>
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-primary-light animate-bounce" style={{animationDelay: '0.4s'}}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;