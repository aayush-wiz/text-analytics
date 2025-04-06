import React, { ReactNode } from "react";
import { Card, CardContent } from "../common/Card";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={twMerge("h-full", className)}>
      <CardContent className="h-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <p className="mt-2 flex items-center text-sm">
                <span
                  className={
                    change.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  <span className="flex items-center">
                    {change.isPositive ? (
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {Math.abs(change.value)}%
                  </span>
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  from last period
                </span>
              </p>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
