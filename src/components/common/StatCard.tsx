import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  variant?: 'maroon' | 'gold' | 'blue' | 'emerald' | 'default';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  variant = 'default',
}) => {
  const borderVariants = {
    maroon: 'border-l-4 border-l-brand-maroon',
    gold: 'border-l-4 border-l-brand-gold',
    blue: 'border-l-4 border-l-brand-blue',
    emerald: 'border-l-4 border-l-emerald-500',
    default: 'border-l-4 border-l-slate-400',
  }[variant];

  return (
    <div
      className={`bg-white rounded-lg p-3.5 shadow-xs border border-slate-200 ${borderVariants} flex items-center justify-between`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </span>
        <span className="text-lg font-bold text-slate-800 mt-0.5">{value}</span>
        {subtitle && <span className="text-[11px] text-slate-400 mt-0.5">{subtitle}</span>}
      </div>
      {icon && <div className="p-2 rounded-lg bg-slate-50 text-slate-700">{icon}</div>}
      {badge && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {badge}
        </span>
      )}
    </div>
  );
};
