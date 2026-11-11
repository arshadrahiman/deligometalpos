import React from 'react';

interface TabItem {
  id: string;
  label: string;
  sublabel?: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex border-b border-slate-200 bg-white rounded-t-lg ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2.5 text-xs font-semibold transition-all border-b-2 ${
              isActive
                ? 'border-brand-maroon text-brand-maroon bg-rose-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.sublabel && (
              <span className="text-[10px] font-normal text-slate-400 mt-0.5">
                {tab.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

