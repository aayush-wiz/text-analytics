import React, { ReactNode, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  as?: "button" | "a" | "div";
  href?: string;
  to?: string;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  as = "button",
  href,
  className,
  ...props
}) => {
  const baseClasses = "block w-full text-left px-4 py-2 text-sm text-[#37352f] hover:bg-notion-gray-light";
  const Element = as;

  if (as === "a" && href) {
    return (
      <a 
        href={href}
        className={twMerge(baseClasses, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Element
      type={as === "button" ? "button" : undefined}
      className={twMerge(baseClasses, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Element>
  );
};

export const DropdownDivider: React.FC<{className?: string}> = ({ className }) => (
  <div className={twMerge("border-t border-notion-border my-1", className)} />
);

export const DropdownLabel: React.FC<{children: ReactNode; className?: string}> = ({ 
  children,
  className 
}) => (
  <div className={twMerge("px-4 py-2 text-xs text-notion-text-gray font-medium", className)}>
    {children}
  </div>
);

interface DropdownProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  align?: "left" | "right";
  width?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  isOpen,
  onClose,
  align = "right",
  width = "w-48",
  className
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className={twMerge(
        "absolute z-10 mt-2 rounded-md shadow-sm bg-white border border-notion-border",
        align === "right" ? "right-0" : "left-0",
        width,
        className
      )}
      style={{ top: "100%" }}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}; 