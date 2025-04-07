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
        "bg-notion-default rounded-lg border border-notion-border shadow-sm overflow-hidden",
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
        "px-6 py-4 border-b border-notion-border flex flex-wrap items-center justify-between",
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
        "text-lg font-medium text-notion-text-default",
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
        "px-6 py-4 bg-notion-gray-light border-t border-notion-border",
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
      "text-center py-10 px-6 bg-notion-default rounded-lg border border-notion-border flex flex-col items-center",
      className
    )}>
      {icon && (
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-notion-gray-light text-[#37352f] mb-4">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-notion-text-default mb-2">{title}</h3>
      )}
      <div className="text-sm text-notion-text-gray mb-4">
        {children}
      </div>
      {actionLabel && actionLink && (
        <a 
          href={actionLink} 
          className="inline-flex items-center px-4 py-2 border border-[#37352f] rounded-md shadow-sm text-sm font-medium text-white bg-[#37352f] hover:bg-[#2f2c26]"
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
      "p-4 bg-notion-default rounded-lg border border-notion-border mb-4",
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
          <h1 className="text-2xl font-bold text-notion-text-default">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-notion-text-gray">{description}</p>
          )}
        </div>
        <div className="mt-4 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};
