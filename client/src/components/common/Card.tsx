import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return (
    <h3
      className={twMerge(
        "text-lg font-medium text-gray-900 dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={twMerge("px-6 py-4", className)}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
};

// New Card components for Notion-like UI

export const EmptyState: React.FC<CardProps & { icon?: ReactNode, title?: string, actionLabel?: string, actionLink?: string }> = ({ 
  children, 
  className,
  icon,
  title,
  actionLabel,
  actionLink 
}) => {
  return (
    <div className={twMerge(
      "text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center",
      className
    )}>
      {icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {children}
      </div>
      {actionLabel && actionLink && (
        <a 
          href={actionLink} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
};

export const ContentBlock: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={twMerge(
      "p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4",
      className
    )}>
      {children}
    </div>
  );
};

export const PageHeader: React.FC<CardProps & { title: string, description?: string }> = ({ 
  children, 
  className,
  title,
  description 
}) => {
  return (
    <div className={twMerge("mb-6", className)}>
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className="mt-4 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};
