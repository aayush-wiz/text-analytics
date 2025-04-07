import React, { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-1 focus:ring-offset-0 transition-colors cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#000000] hover:bg-[#191919] text-white focus:ring-gray-300 border border-[#000000]',
    secondary: 'bg-[#37352f] hover:bg-[#2f2c26] text-white focus:ring-gray-400 border border-[#37352f]',
    success: 'bg-[#0f7b55] hover:bg-[#0c6645] text-white focus:ring-green-400 border border-[#0f7b55]',
    danger: 'bg-[#dc2626] hover:bg-[#b91c1c] text-white focus:ring-red-400 border border-[#dc2626]',
    warning: 'bg-[#d97706] hover:bg-[#b45309] text-white focus:ring-yellow-300 border border-[#d97706]',
    info: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white focus:ring-blue-300 border border-[#2563eb]',
    light: 'bg-[#f7f6f3] hover:bg-[#ebeced] text-[#37352f] focus:ring-gray-200 border border-[#e4e5e7]',
    dark: 'bg-[#37352f] hover:bg-[#2f2c26] text-white focus:ring-gray-500 border border-[#37352f]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClassName = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    disabled || isLoading ? disabledStyles : '',
    className
  );

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
