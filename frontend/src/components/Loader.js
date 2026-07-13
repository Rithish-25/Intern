import React from 'react';
import { motion } from 'framer-motion';

export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center" id="ui-spinner">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        className={`${sizeClasses[size]} border-slate-200 border-t-emerald-600 dark:border-slate-800 dark:border-t-emerald-500 rounded-full`}
      />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center" id="ui-page-loader">
      <div className="glass-panel px-10 py-8 rounded-2xl flex flex-col items-center gap-4 shadow-glass dark:shadow-glass-dark">
        <Spinner size="lg" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
          Loading system...
        </span>
      </div>
    </div>
  );
};

export const Skeleton = ({ className }) => {
  return (
    <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg ${className}`} />
  );
};
