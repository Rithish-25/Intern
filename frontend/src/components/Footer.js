import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 border-t border-slate-200/50 dark:border-slate-900/40 text-center text-xs text-slate-400 dark:text-slate-500" id="ui-footer">
      <div className="container mx-auto px-6">
        <p>© {new Date().getFullYear()} Employee Management System. All rights reserved.</p>
        <p className="mt-1">Built with React, Node, Express, MongoDB Atlas, and Firebase Auth.</p>
      </div>
    </footer>
  );
};

export default Footer;
