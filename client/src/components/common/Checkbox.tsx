import React, { InputHTMLAttributes } from "react";
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
  ...props
}) => {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          className={twMerge(
            "focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800",
            error ? "border-red-500" : "",
            className
          )}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label
          htmlFor={checkboxId}
          className="font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};
