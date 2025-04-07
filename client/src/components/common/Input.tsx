import React, { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={widthClass}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#37352f] mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          "px-3 py-2 w-full text-[#37352f] bg-white border border-[#e4e5e7] rounded-md hover:border-[#b8b7b4] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] outline-none transition duration-150 ease-in-out",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          widthClass,
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
