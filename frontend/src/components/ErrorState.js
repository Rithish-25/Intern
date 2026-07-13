import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ 
  message = 'An error occurred while fetching information.', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/20 rounded-2xl" id="ui-error-state">
      <div className="p-3 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 dark:text-rose-300 mb-1">Failed to retrieve data</h3>
      <p className="text-sm text-rose-600 dark:text-rose-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};
