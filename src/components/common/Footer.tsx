import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-nav text-slate-400 text-xs py-3 px-4 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>© 2026 Hambire Solutions ERP. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300">Support Helpline: +91 7879404501</span>
          <span className="h-3 w-[1px] bg-slate-600 hidden sm:inline" />
          <span className="text-brand-gold font-medium">Licensed to: Lakshmi Gold Testing</span>
        </div>
      </div>
    </footer>
  );
};
