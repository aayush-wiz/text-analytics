import React, { InputHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className,
  id,
  checked,
  onChange,
  ...props
}) => {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="flex items-start py-1">
      <div className="flex items-center h-5 relative">
        <input
          id={checkboxId}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          className={twMerge(
            "absolute opacity-0 w-0 h-0",
            error ? "border-red-500" : "",
            className
          )}
          {...props}
        />
        <div 
          className={`w-5 h-5 flex items-center justify-center rounded border ${
            isChecked ? 'bg-[#37352f] border-[#37352f]' : 'bg-white border-notion-border'
          } transition-colors cursor-pointer`}
          onClick={() => {
            setIsChecked(!isChecked);
            const event = {
              target: { checked: !isChecked }
            } as React.ChangeEvent<HTMLInputElement>;
            if (onChange) onChange(event);
          }}
        >
          {isChecked && (
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 text-white fill-current">
              <path d="M11.988,2.078 L4.937,9.128 L1.495,5.685 C1.495,5.685 0.374,6.806 0.374,6.806 L4.937,11.368 L13.11,3.196 L11.988,2.078 Z" />
            </svg>
          )}
        </div>
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={checkboxId}
          className="font-medium text-[#37352f] select-none cursor-pointer"
          onClick={() => {
            setIsChecked(!isChecked);
            const event = {
              target: { checked: !isChecked }
            } as React.ChangeEvent<HTMLInputElement>;
            if (onChange) onChange(event);
          }}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};
