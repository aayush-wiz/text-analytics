import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  fullWidth = false,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const widthClass = fullWidth ? "w-full" : "";
  
  // Find the currently selected option label
  const selectedOption = options.find(option => option.value === value);
  const selectedLabel = selectedOption?.label || '';

  // Handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update dropdown position when it opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={twMerge(widthClass, className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[#37352f] mb-2"
        >
          {label}
        </label>
      )}
      <div 
        ref={selectRef} 
        className="relative" 
        id={selectId}
      >
        {/* Custom select button */}
        <button
          ref={buttonRef}
          type="button"
          className={twMerge(
            "w-full text-left px-3 py-2 text-[#37352f] bg-white border border-notion-border rounded-md hover:bg-[#f7f6f3] focus:border-[#37352f] focus:ring-1 focus:ring-[#37352f] focus:outline-none transition-colors",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
            isOpen ? "border-[#37352f] ring-1 ring-[#37352f]" : "",
            widthClass
          )}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between">
            <span className="block truncate">{selectedLabel}</span>
            <span className="pointer-events-none flex items-center">
              <svg width="10" height="6" className="fill-current opacity-70" viewBox="0 0 10 6">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z" />
              </svg>
            </span>
          </div>
        </button>

        {/* Portal for dropdown so it isn't confined by parent containers */}
        {isOpen && createPortal(
          <div 
            className="fixed bg-white border border-notion-border shadow-md rounded-md overflow-hidden z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            <ul className="max-h-60 overflow-auto py-1" role="listbox">
              {options.map((option) => (
                <li 
                  key={option.value} 
                  className={`cursor-pointer select-none py-2 px-3 ${
                    option.value === value 
                      ? 'bg-[#f1f1ef] text-[#37352f]' 
                      : 'text-[#37352f] hover:bg-[#f7f6f3]'
                  }`}
                  onClick={() => handleSelectOption(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <div className="flex items-center">
                    {option.value === value && (
                      <svg className="h-4 w-4 mr-2 text-[#37352f]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                    <span className={`${option.value === value ? 'ml-0' : 'ml-6'}`}>
                      {option.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 