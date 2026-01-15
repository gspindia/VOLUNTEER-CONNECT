
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  // Added optional children to satisfy strict type checking in React 18
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    // Brand Gradient: Deep Blue to Teal
    primary: "bg-gradient-to-br from-[#1A005B] to-[#007DA5] text-white hover:brightness-110 focus:ring-[#007DA5] border-none",
    secondary: "bg-white text-[#1A005B] border border-gray-100 hover:bg-gray-50 focus:ring-gray-300",
    outline: "border-2 border-[#1A005B] text-[#1A005B] hover:bg-[#1A005B]/5 focus:ring-[#1A005B]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-3.5 text-sm",
    lg: "px-10 py-5 text-base"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
