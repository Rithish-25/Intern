import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6" id="ui-not-found">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-550 rounded-full mb-4">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">404</h1>
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-350 mt-1">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
        The resource or dashboard panel view you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-3 mt-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-505 dark:hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/10"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
