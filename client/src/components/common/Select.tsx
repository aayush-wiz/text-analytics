import React, { SelectHTMLAttributes, useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = false,
  className,
  id,
  value,
  onChange,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const widthClass = fullWidth ? "w-full" : "";
  
  // Find the currently selected option label
  const selectedLabel = options.find(option => option.value === value)?.label || '';

  // Add custom styles for dropdown menu options
  useEffect(() => {
    // Add custom styles for the dropdown options
    const style = document.createElement('style');
    style.textContent = `
      select#${selectId} {
        font-family: inherit;
      }
      
      select#${selectId} option {
        padding: 10px;
        background-color: white;
        color: #37352f;
        font-size: 14px;
      }
      
      select#${selectId} option:hover,
      select#${selectId} option:focus,
      select#${selectId} option:active,
      select#${selectId} option:checked {
        background-color: #f7f6f3;
        color: #37352f;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [selectId]);

  return (
    <div className={widthClass}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[#37352f] mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={twMerge(
            "w-full cursor-pointer px-3 py-2 text-[#37352f] bg-notion-default border border-notion-border rounded-md focus:border-[#37352f] focus:ring-1 focus:ring-[#37352f] outline-none transition-colors appearance-none",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
            "hover:bg-[#f7f6f3]",
            widthClass,
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="py-2 px-3">
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#37352f]">
          <svg width="10" height="6" className="fill-current opacity-70" viewBox="0 0 10 6">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
