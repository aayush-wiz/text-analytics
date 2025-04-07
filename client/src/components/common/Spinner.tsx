import React from "react";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const baseClasses = "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent";
  const colorClasses = "text-[#37352f]";
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`${baseClasses} ${colorClasses} ${sizeClass} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
