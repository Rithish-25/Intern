import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, LogOut, Menu, User, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { clearAuth } from '../store/slices/authSlice';
import { resetEmployeeState } from '../store/slices/employeeSlice';
import { resetDashboardState } from '../store/slices/dashboardSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync theme to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearAuth());
      dispatch(resetEmployeeState());
      dispatch(resetDashboardState());
      toast.success('Logged out successfully.');
    } catch (error) {
      toast.error('Failed to log out: ' + error.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-slate-900/30 px-6 py-4 flex items-center justify-between shadow-sm" id="ui-navbar">
      <div className="flex items-center gap-4">
        {/* Toggle sidebar button for mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* System title / brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="p-2 bg-emerald-600 dark:bg-emerald-500 rounded-xl text-white shadow-sm flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:inline">
            EMS Portal
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-550 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
          title="Toggle visual theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* User Account Controls */}
        <div className="relative z-50">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center justify-center border border-slate-300/50 dark:border-slate-700/50">
              {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium text-slate-750 dark:text-slate-350 hidden md:inline truncate max-w-[150px]">
              {user?.email}
            </span>
          </button>

          {dropdownOpen && (
            <>
              {/* Close click blocker */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-200/50 dark:border-slate-900/40">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Admin Account</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
