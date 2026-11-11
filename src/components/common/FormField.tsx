import React from 'react';

interface FormFieldProps {
  label: string;
  sublabel?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  sublabel,
  error,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {sublabel && <span className="text-[10px] text-slate-400 font-normal">{sublabel}</span>}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-600 font-medium">{error}</span>}
    </div>
  );
};
