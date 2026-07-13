import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50" id="ui-layout">
      {/* Header Sticky Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar + Content Port container */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Scrollable Viewport */}
        <main className="flex-1 flex flex-col p-6 w-full min-w-0 lg:pl-72 transition-all duration-300">
          <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col gap-6">
            {/* Child router views */}
            <Outlet />
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
