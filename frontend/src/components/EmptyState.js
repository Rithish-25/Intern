import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ 
  title = 'No records found', 
  description = 'Try adjusting your search queries, clearing your filters, or registering a new employee.',
  icon: Icon = Inbox 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm" id="ui-empty-state">
      <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-full text-slate-400 dark:text-slate-500 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
    </div>
  );
};
