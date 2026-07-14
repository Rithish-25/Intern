import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, User, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Employee', path: '/employees/add', icon: UserPlus },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200/50 dark:border-slate-900/30 p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30 lg:top-[73px] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="ui-sidebar"
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <span className="font-bold text-sm uppercase tracking-wider text-slate-400">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            
            // Check if active (match path or sub-routes of employees except add)
            const isActive = 
              location.pathname === link.path ||
              (link.path === '/employees' && 
               location.pathname.startsWith('/employees') && 
               location.pathname !== '/employees/add');

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 dark:bg-emerald-500 dark:shadow-emerald-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
