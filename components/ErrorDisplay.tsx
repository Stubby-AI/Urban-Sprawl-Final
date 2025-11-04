
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
    
  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg shadow-md text-red-700 dark:text-red-300">
      <div className="flex items-center">
        <AlertIcon className="h-8 w-8 mr-4"/>
        <div>
          <h3 className="font-bold text-lg mb-1">An Error Occurred</h3>
          <p>{message}</p>
        </div>
      </div>
       <button 
        onClick={onRetry}
        className="mt-4 ml-12 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;
