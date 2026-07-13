import React from 'react';
import { useSelector } from 'react-redux';
import { Shield, Mail, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Admin Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review your administrator console credentials.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="max-w-2xl glass-panel rounded-3xl border border-slate-200/50 dark:border-slate-900/30 overflow-hidden shadow-sm">
        
        {/* Banner */}
        <div className="px-6 py-8 bg-gradient-to-r from-emerald-650/10 to-teal-650/10 dark:from-emerald-500/5 dark:to-teal-500/5 border-b border-slate-200/50 dark:border-slate-900/30 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">System Administrator</h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-450 font-semibold uppercase tracking-wider mt-0.5">Full Privileges Granted</p>
          </div>
        </div>

        {/* User Info Fields */}
        <div className="p-6 space-y-5">
          {/* Email Address */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Email</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 block">
                {user?.email || 'N/A'}
              </span>
            </div>
          </div>



          {/* Access status */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Control Status</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-full mt-1.5 inline-block">
                Authorized Session Active
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
