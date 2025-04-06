import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface AlertProps {
  children: ReactNode;
  type?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  type = "info",
  dismissible = false,
  onDismiss,
  className,
}) => {
  const typeStyles = {
    info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100",
    success:
      "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-100",
    warning:
      "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100",
    error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-100",
  };

  return (
    <div
      className={twMerge("p-4 rounded-md", typeStyles[type], className)}
      role="alert"
    >
      <div className="flex">
        <div className="flex-grow">{children}</div>
        {dismissible && (
          <button
            type="button"
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
