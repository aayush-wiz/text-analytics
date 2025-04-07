import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";
import { Chart, ChartType } from 'chart.js';

interface AnalysisByTypeProps {
  data: {
    type: string;
    count: number;
  }[];
  isLoading?: boolean;
}

export const AnalysisByType: React.FC<AnalysisByTypeProps> = ({
  data,
  isLoading = false,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart<ChartType> | null>(null);

  useEffect(() => {
    if (isLoading || !data.length || !chartRef.current) return;

    // Capture the current chart instance for cleanup
    const currentChartInstance = chartInstance.current;

    // Check if chart.js is available in window (could also be imported)
    // This is just a placeholder for the actual chart implementation
    if (typeof window !== 'undefined' && 'Chart' in window && chartRef.current) {
      // Create chart
      console.log("Would create chart with data:", data);
    }

    return () => {
      // Cleanup chart using captured instance
      if (currentChartInstance) {
        currentChartInstance.destroy();
      }
    };
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-notion-gray-light rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis by Type</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-notion-text-gray">
              No analysis data available yet.
            </p>
          </div>
        ) : (
          <div className="h-64" ref={chartRef}>
            {/* Chart will be rendered here */}
            <div className="flex flex-col space-y-2">
              {data.map((item) => (
                <div key={item.type} className="flex items-center">
                  <div className="w-32 text-sm text-notion-text-gray">
                    {item.type}
                  </div>
                  <div className="flex-1 h-4 bg-notion-gray-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#37352f] rounded-full"
                      style={{
                        width: `${
                          (item.count / Math.max(...data.map((d) => d.count))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-sm font-medium text-[#37352f] ml-2">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
