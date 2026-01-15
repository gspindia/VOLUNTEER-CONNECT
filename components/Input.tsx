import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, prefix, className = '', children, ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {icon}
          </div>
        )}
        {prefix && !icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <span className="text-gray-500 font-bold">{prefix}</span>
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : prefix ? 'pl-8' : 'px-4'} py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-800 placeholder:text-gray-400 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};