import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
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
  const baseStyles = "relative inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 transform active:scale-[0.96] shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden";
  
  const variants = {
    // Brand Gradient with animated background feel
    primary: "bg-gradient-to-r from-[#1A005B] to-[#007DA5] text-white hover:brightness-110 shadow-[#007DA5]/30 border-none",
    secondary: "bg-white text-[#1A005B] border border-gray-100 hover:bg-gray-50 focus:ring-gray-300 hover:border-[#1A005B]/20",
    outline: "border-2 border-[#1A005B] text-[#1A005B] hover:bg-[#1A005B]/5 focus:ring-[#1A005B]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-red-500/30"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-3.5 text-sm",
    lg: "px-10 py-4 text-base tracking-wide"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className} group`}
      {...props}
    >
      {/* Subtle sheen effect for primary buttons */}
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};