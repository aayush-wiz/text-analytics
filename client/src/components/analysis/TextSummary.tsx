import React from "react";
import { TextSummary as SummaryType } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../common/Card";

interface TextSummaryProps {
  data: SummaryType;
  originalText?: string;
}

export const TextSummary: React.FC<TextSummaryProps> = ({
  data,
  originalText,
}) => {
  // Calculate reduction percentage if original text is provided
  const getReductionPercentage = (): string => {
    if (!originalText) return "";

    const originalLength = originalText.length;
    const summaryLength = data.summary.length;
    const reduction = ((originalLength - summaryLength) / originalLength) * 100;

    return `(${reduction.toFixed(1)}% reduction)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600 ">
            An automated summary of the text content {getReductionPercentage()}.
          </p>
        </div>

        <div className="p-4 bg-gray-50  rounded-md text-gray-800 ">
          <p className="whitespace-pre-line">{data.summary}</p>
        </div>

        {data.extractiveSentences && data.extractiveSentences.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900  mb-2">
              Key Sentences
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 ">
              {data.extractiveSentences.map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
